import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { updateEventStatus } from "@/lib/actions/event"
import { Calendar, Clock, Users, CheckCircle, XCircle, BarChart3, ArrowRight, AlertCircle } from "lucide-react"
import { WeeklyCalendar } from "@/components/WeeklyCalendar"

export default async function AdminDashboard() {
    // ... existing setup ...
    const supabase = await createClient()

    const { data: pendingEvents } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    const { data: allEvents } = await supabase
        .from('events')
        .select('*')

    const { data: resources } = await supabase
        .from('resources')
        .select('*')

    const stats = {
        pending: pendingEvents?.length || 0,
        total: allEvents?.length || 0,
        approved: allEvents?.filter(e => e.status === 'approved').length || 0,
        resources: resources?.length || 0,
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500" />
                <div className="absolute inset-0 gradient-mesh opacity-20" />
                <div className="relative p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">
                        Admin Control Center 🛡️
                    </h1>
                    <p className="text-white/80 max-w-xl">
                        Manage campus events, resources, andmonitor platform analytics.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card rounded-2xl p-6 border border-border card-hover">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
                    <p className="text-muted-foreground">Pending Approval</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border card-hover">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stats.approved}</p>
                    <p className="text-muted-foreground">Approved Events</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border card-hover">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-muted-foreground">Total Events</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border card-hover">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stats.resources}</p>
                    <p className="text-muted-foreground">Resources</p>
                </div>
            </div>



            {/* Pending Approvals */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Pending Approvals</h2>
                    <Link href="/admin/events" className="text-primary hover:underline font-medium flex items-center gap-1">
                        View all events <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    {pendingEvents && pendingEvents.length > 0 ? (
                        <div className="divide-y divide-border">
                            {pendingEvents.map((event) => (
                                <div key={event.id} className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                            {event.title.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{event.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                By {event.profiles?.full_name || 'Unknown'} • {new Date(event.start_time).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <form action={async () => {
                                            'use server'
                                            await updateEventStatus(event.id, 'approved')
                                        }}>
                                            <button
                                                type="submit"
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors font-medium text-sm"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Approve
                                            </button>
                                        </form>
                                        <form action={async () => {
                                            'use server'
                                            await updateEventStatus(event.id, 'rejected')
                                        }}>
                                            <button
                                                type="submit"
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-medium text-sm"
                                            >
                                                <XCircle className="w-4 h-4" /> Reject
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                            <p className="text-foreground font-medium">All caught up!</p>
                            <p className="text-muted-foreground text-sm mt-1">No events pending approval</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
