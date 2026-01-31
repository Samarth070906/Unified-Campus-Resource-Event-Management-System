'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createResource(formData: FormData) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // Admin check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
        const debugMsg = `Permission denied. Your role is '${profile?.role || 'null'}', but 'admin' is required. User ID: ${user.id}`
        console.error(debugMsg)
        return { error: debugMsg }
    }

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const capacity = formData.get('capacity') ? parseInt(formData.get('capacity') as string) : null

    const { error } = await supabase.from('resources').insert({
        name,
        type,
        capacity,
        is_active: true
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/resources')
    return { success: true }
}
