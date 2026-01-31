'use server'

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { notifyAdmins, sendNotification } from "@/lib/notifications"

const eventSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    start_time: z.coerce.date(),
    end_time: z.coerce.date(),
    location: z.string().optional(),
    isCollaborative: z.boolean().default(false),
})

export async function createEvent(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || (user.user_metadata.role !== 'organizer' && user.user_metadata.role !== 'admin')) {
        return { error: "Unauthorized. Only Organizers can create events." }
    }

    const validated = eventSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        start_time: formData.get('start_time'),
        end_time: formData.get('end_time'),
        location: formData.get('location'),
        isCollaborative: formData.get('is_collaborative') === 'on',
    })

    if (!validated.success) {
        return { error: "Please fill in all required fields correctly." }
    }

    const { title, description, start_time, end_time, location, isCollaborative } = validated.data

    // Handle Resource Booking
    let maxCapacity = null
    const resourceId = formData.get('resource_id')

    if (resourceId && resourceId.toString().length > 0) {
        // Fetch resource details first
        const { data: res } = await supabase.from('resources').select('name, capacity').eq('id', resourceId).single()

        if (res) {
            maxCapacity = res.capacity
        }
    }

    const { error: eventError, data: newEvent } = await supabase.from('events').insert({
        title,
        description,
        start_time: start_time.toISOString(),
        end_time: end_time.toISOString(),
        location: location,
        is_collaborative: isCollaborative,
        organizer_id: user.id,
        status: 'pending',
        max_capacity: maxCapacity,
        registration_open: true
    }).select().single()

    if (eventError) {
        console.error('Supabase error:', eventError)
        return { error: `Database error: ${eventError.message}` }
    }

    if (resourceId && resourceId.toString().length > 0) {
        // Create a booking
        const { error: bookingError } = await supabase.from('bookings').insert({
            event_id: newEvent.id,
            resource_id: resourceId,
            start_time: start_time.toISOString(),
            end_time: end_time.toISOString(),
            status: 'confirmed'
        })
        if (bookingError) console.error('Booking error:', bookingError)

        // Update event location with resource name for display
        const { data: res } = await supabase.from('resources').select('name').eq('id', resourceId).single()
        if (res) {
            await supabase.from('events').update({ location: res.name }).eq('id', newEvent.id)
        }
    }

    // Handle Club Association
    const clubId = formData.get('club_id')
    if (isCollaborative && clubId && clubId.toString().length > 0) {
        const { error: clubError } = await supabase.from('event_clubs').insert({
            event_id: newEvent.id,
            club_id: clubId
        })
        if (clubError) console.error('Club association error:', clubError)
    }

    await notifyAdmins(`New event request: "${title}" by user ${user.email}`)

    revalidatePath('/organizer/dashboard')
    revalidatePath('/organizer/events')
    return { success: true }
}

export async function updateEventStatus(eventId: string, newStatus: 'approved' | 'rejected') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata.role !== 'admin') {
        throw new Error("Unauthorized. Only Admins can approve/reject events.")
    }

    const { data: event } = await supabase.from('events').select('title, organizer_id').eq('id', eventId).single()

    const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', eventId)

    if (error) throw new Error("Failed to update status")

    if (event) {
        await sendNotification(event.organizer_id, `Your event "${event.title}" has been ${newStatus}.`)
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/events')
    revalidatePath('/participant/events')
    return { success: true }
}

export async function toggleRegistration(eventId: string, isOpen: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    // Verify ownership
    const { data: event } = await supabase.from('events').select('organizer_id').eq('id', eventId).single()
    if (!event || event.organizer_id !== user.id) {
        return { error: "You can only manage your own events." }
    }

    const { error } = await supabase
        .from('events')
        .update({ registration_open: isOpen })
        .eq('id', eventId)

    if (error) {
        console.error("Toggle error:", error)
        return { error: `Update failed: ${error.message}` }
    }

    revalidatePath('/organizer/events')
    revalidatePath('/participant/events')
    return { success: true }
}

export async function registerForEvent(eventId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "You must be logged in to register." }
    }

    // Fetch Event Details (Capacity & Status)
    const { data: event } = await supabase
        .from('events')
        .select('registration_open, max_capacity')
        .eq('id', eventId)
        .single()

    if (!event) return { error: "Event not found." }

    if (event.registration_open === false) {
        return { error: "Registration is closed for this event." }
    }

    // Check capacity if set
    if (event.max_capacity) {
        const { count } = await supabase
            .from('event_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', eventId)

        if (count !== null && count >= event.max_capacity) {
            return { error: "Event is full." }
        }
    }

    // Check if already registered
    const { data: existing } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single()

    if (existing) {
        return { error: "You are already registered for this event." }
    }

    const { error } = await supabase
        .from('event_registrations')
        .insert({
            event_id: eventId,
            user_id: user.id
        })

    if (error) {
        console.error('Registration error:', error)
        return { error: "Failed to register for event." }
    }

    revalidatePath('/participant/events')
    revalidatePath('/organizer/dashboard')
    return { success: true }
}
