import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Calendar, Clock, PlusCircle, ArrowRight, Eye, Edit } from "lucide-react"
import { WeeklyCalendar } from "@/components/WeeklyCalendar"

export default async function OrganizerDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Recent events for list
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

    // Calendar events (All approved events to check availability)
    const { data: calendarEvents } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')

    const pending = events?.filter(e => e.status === 'pending').length || 0
    const approved = events?.filter(e => e.status === 'approved').length || 0
    const total = events?.length || 0

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500" />
                <div className="absolute inset-0 gradient-mesh opacity-20" />
                <div className="relative p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">
                        Organizer Dashboard 🎯
                    </h1>
                    <p className="text-white/80 max-w-xl">
                        Create and manage events, track registrations, and engage with your community.
                    </p>
                    <div className="flex gap-4 mt-6">
                        <Link href="/organizer/create-event" className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">
                            <PlusCircle className="w-5 h-5" /> Create Event
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card rounded-2xl p-6 border border-border card-hover">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{total}</p>
                    <p className="text-muted-foreground">Total Events</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border card-hover">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                        <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{pending}</p>
                    <p className="text-muted-foreground">Pending Approval</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border card-hover">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                        <Eye className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{approved}</p>
                    <p className="text-muted-foreground">Live Events</p>
                </div>
            </div>


            {/* Recent Events */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Recent Events</h2>
                    <Link href="/organizer/events" className="text-primary hover:underline font-medium flex items-center gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    {events && events.length > 0 ? (
                        <div className="divide-y divide-border">
                            {events.map((event) => (
                                <div key={event.id} className="p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                            {event.title.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{event.title}</h3>
                                            <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                                                {new Date(event.start_time).toLocaleDateString()} at {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`badge ${event.status === 'approved' ? 'badge-approved' :
                                            event.status === 'rejected' ? 'badge-rejected' :
                                                event.status === 'pending' ? 'badge-pending' :
                                                    'badge-draft'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">You haven&apos;t created any events yet</p>
                            <Link href="/organizer/create-event" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
                                <PlusCircle className="w-4 h-4" /> Create your first event
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
