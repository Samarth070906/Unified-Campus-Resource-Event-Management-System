'use server'

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const bookingSchema = z.object({
    resourceId: z.string().uuid(),
    start: z.coerce.date(),
    end: z.coerce.date(),
    eventId: z.string().uuid(),
})

export type BookingState = {
    success: boolean
    message: string
    errors?: {
        resourceId?: string[]
        start?: string[]
        end?: string[]
        eventId?: string[]
    }
}

/**
 * Checks if a resource is available for a given time range.
 * Throws an error if a conflict is found.
 */
export async function checkAvailability(resourceId: string, start: Date, end: Date) {
    const supabase = await createClient()

    // Conflict Logic:
    // Existing booking (StartB, EndB) overlaps with (StartA, EndA) if:
    // StartA < EndB AND EndA > StartB

    const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('resource_id', resourceId)
        .eq('status', 'confirmed') // Only check confirmed bookings
        .lt('start_time', end.toISOString())
        .gt('end_time', start.toISOString())

    if (error) {
        console.error("Error checking availability:", error)
        throw new Error("Failed to check availability")
    }

    if (data && data.length > 0) {
        return false // Conflict detected
    }

    return true // Available
}

/**
 * Creates a booking for an event.
 * Using this as a Server Action.
 */
export async function createBooking(prevState: BookingState, formData: FormData) {
    const validatedFields = bookingSchema.safeParse({
        resourceId: formData.get('resourceId'),
        start: formData.get('start'),
        end: formData.get('end'),
        eventId: formData.get('eventId'),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { resourceId, start, end, eventId } = validatedFields.data

    try {
        const isAvailable = await checkAvailability(resourceId, start, end)

        if (!isAvailable) {
            return {
                success: false,
                message: "Conflict detected: Resource is already booked for this time."
            }
        }

        const supabase = await createClient()
        const { error } = await supabase
            .from('bookings')
            .insert({
                resource_id: resourceId,
                event_id: eventId,
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                status: 'confirmed'
            })

        if (error) {
            console.error("Booking Error:", error)
            return { success: false, message: "Database Error: Failed to create booking." }
        }

        return { success: true, message: "Booking confirmed!" }

    } catch (err) {
        console.error(err)
        return { success: false, message: "Internal Server Error" }
    }
}
