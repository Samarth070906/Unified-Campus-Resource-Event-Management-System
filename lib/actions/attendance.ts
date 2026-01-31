'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function verifyAttendance(qrData: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    let parsedData
    try {
        parsedData = JSON.parse(qrData)
    } catch {
        return { error: "Invalid QR Code format" }
    }

    const { eventId, userId } = parsedData

    if (!eventId || !userId) return { error: "Missing event or user ID" }

    // 1. Verify Requestor Permissions (Must be Organizer of event or Admin)
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('organizer_id, title')
        .eq('id', eventId)
        .single()

    if (eventError || !event) return { error: "Event not found" }

    // Check role/ownership
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'
    const isOrganizer = event.organizer_id === user.id

    if (!isAdmin && !isOrganizer) {
        return { error: "You are not authorized to scan for this event." }
    }

    // 2. Check Registration
    const { data: registration, error: regError } = await supabase
        .from('event_registrations')
        .select('*, profiles:user_id(full_name, email)') // Join properly? No, user_id is the FK
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single()

    // We need to fetch profile separately if Join syntax is tricky or RLS acts up
    // But let's try a separate fetch for robustness
    const { data: userProfile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', userId)
        .single()

    if (regError || !registration) {
        return { error: "No valid registration found for this user." }
    }

    const userName = userProfile?.full_name || userProfile?.email || "Participant"

    // 3. Check if already scanned
    if (registration.checked_in_at) {
        return {
            success: false,
            alreadyCheckedIn: true,
            message: `⚠️ ${userName} already checked in at ${new Date(registration.checked_in_at).toLocaleTimeString()}`,
            userName
        }
    }

    // 4. Mark Attendance
    const { error: updateError } = await supabase
        .from('event_registrations')
        .update({ checked_in_at: new Date().toISOString() })
        .eq('event_id', eventId)
        .eq('user_id', userId)

    if (updateError) return { error: "Failed to update attendance record" }

    revalidatePath('/participant/tickets')

    return {
        success: true,
        message: `✅ Success! Welcome, ${userName}.`,
        userName
    }
}
