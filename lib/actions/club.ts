'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function joinClub(clubId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "You must be logged in to join a club." }
    }

    // Check if already a member
    const { data: existing } = await supabase
        .from('club_members')
        .select('role')
        .eq('club_id', clubId)
        .eq('user_id', user.id)
        .single()

    if (existing) {
        return { error: "You are already a member of this club." }
    }

    const { error } = await supabase
        .from('club_members')
        .insert({
            club_id: clubId,
            user_id: user.id,
            role: 'member'
        })

    if (error) {
        console.error('Join Club Error:', error)
        return { error: "Failed to join club." }
    }

    revalidatePath('/participant/clubs')
    revalidatePath('/participant/dashboard')
    return { success: true }
}

export async function leaveClub(clubId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from('club_members')
        .delete()
        .eq('club_id', clubId)
        .eq('user_id', user.id)

    if (error) {
        return { error: "Failed to leave club." }
    }

    revalidatePath('/participant/clubs')
    return { success: true }
}
