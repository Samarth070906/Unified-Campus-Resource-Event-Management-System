import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { response, user } = await updateSession(request)

    const path = request.nextUrl.pathname

    // Public/Auth routes don't need checks
    if (path.startsWith('/login') || path.startsWith('/auth') || path.startsWith('/_next')) {
        return response
    }

    // Redirect to login if no user
    if (!user && (path.startsWith('/admin') || path.startsWith('/organizer') || path.startsWith('/participant'))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-Based Access Control
    if (user) {
        const role = user.user_metadata.role as string // 'admin' | 'organizer' | 'participant'

        // Protect Admin Routes
        if (path.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        // Protect Organizer Routes (Admin can probably access too? Or strict separation?)
        // Assuming strict for now, or Admin implies all? Standard RBAC usually implies Admin > All or separate duties.
        // User requested "Only Organizers can create".
        if (path.startsWith('/organizer') && role !== 'organizer' && role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
