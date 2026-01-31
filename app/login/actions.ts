'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
    }

    // Get user role and redirect accordingly
    const role = authData.user?.user_metadata?.role || 'participant'

    revalidatePath('/', 'layout')
    redirect(`/${role}/dashboard`)
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as string || 'participant'

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: role,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
        }
    })

    if (error) {
        redirect('/signup?error=' + encodeURIComponent(error.message))
    }

    // If email confirmation is disabled, try to sign in immediately
    if (data.session) {
        // Manually create profile since we removed the trigger
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: data.user!.id,
                full_name: fullName,
                role: role,
            })

        if (profileError) {
            console.error('Error creating profile:', profileError)
            // Even if profile fails, user is created, so we can proceed or warn
        }

        revalidatePath('/', 'layout')
        redirect(`/${role}/dashboard`)
    }

    // Email confirmation required - show success on signup page
    revalidatePath('/', 'layout')
    redirect('/signup?success=true')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
