'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function sendEventAnnouncement(eventId: string, title: string, message: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    // 1. Verify Ownership (Organizer or Admin)
    const { data: event } = await supabase
        .from('events')
        .select('organizer_id, title')
        .eq('id', eventId)
        .single()

    if (!event) return { error: "Event not found" }

    // Check if user is organizer
    if (event.organizer_id !== user.id) {
        // Also check if admin
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role !== 'admin') {
            return { error: "Unauthorized" }
        }
    }

    // 2. Fetch Attendees
    const { data: registrations } = await supabase
        .from('event_registrations')
        .select('user_id')
        .eq('event_id', eventId)

    if (!registrations || registrations.length === 0) {
        return { error: "No attendees found for this event." }
    }

    // 3. Create Notifications
    const notifications = registrations.map(reg => ({
        user_id: reg.user_id,
        title: `Update: ${event.title}`,
        message: message
    }))

    const { error } = await supabase
        .from('notifications')
        .insert(notifications)

    if (error) {
        console.error("Notification Error:", error)
        return { error: "Failed to send notifications" }
    }

    return { success: true, count: notifications.length }
}
