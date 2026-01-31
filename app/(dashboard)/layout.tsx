import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { logout } from "@/app/login/actions"
import {
    Home,
    Calendar,
    Settings,
    Users,
    BarChart3,
    PlusCircle,
    LogOut,
    Zap,
    Menu,
    QrCode,
    ScanLine,
    Bell,
    Clock
} from "lucide-react"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const role = user.user_metadata.role || 'participant'
    const fullName = user.user_metadata.full_name || user.email?.split('@')[0] || 'User'

    const navItems = {
        participant: [
            { href: '/participant/dashboard', icon: Home, label: 'Dashboard' },
            { href: '/participant/events', icon: Calendar, label: 'Events' },
            { href: '/participant/tickets', icon: QrCode, label: 'My Tickets' },
            { href: '/participant/clubs', icon: Users, label: 'Clubs' },
            { href: '/participant/notifications', icon: Bell, label: 'Updates' },
        ],
        organizer: [
            { href: '/organizer/dashboard', icon: Home, label: 'Dashboard' },
            { href: '/organizer/events', icon: Calendar, label: 'My Events' },
            { href: '/organizer/schedule', icon: Clock, label: 'Schedule' },
            { href: '/organizer/create-event', icon: PlusCircle, label: 'Create Event' },
            { href: '/organizer/scan', icon: ScanLine, label: 'Scan Entry' },
        ],
        admin: [
            { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
            { href: '/admin/events', icon: Calendar, label: 'All Events' },
            { href: '/admin/schedule', icon: Clock, label: 'Schedule' },
            { href: '/admin/resources', icon: Zap, label: 'Resources' },
            { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        ],
    }

    const items = navItems[role as keyof typeof navItems] || navItems.participant

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border hidden lg:flex flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-foreground">CampusSync</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                            {fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{fullName}</p>
                            <p className="text-xs text-muted-foreground capitalize">{role}</p>
                        </div>
                    </div>
                    <form action={logout} className="mt-2">
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Header */}
                <header className="sticky top-0 z-40 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 rounded-lg hover:bg-muted">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="font-semibold text-lg text-foreground capitalize">
                            {role} Dashboard
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold lg:hidden">
                            {fullName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
