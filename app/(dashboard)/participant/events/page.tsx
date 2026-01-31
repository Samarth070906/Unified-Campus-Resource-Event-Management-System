import { createClient } from "@/lib/supabase/server"
import { Calendar, Clock, Search, Filter } from "lucide-react"
import { EventRegistrationButton } from "@/components/EventRegistrationButton"

// Force rebuild
export default async function ParticipantEvents() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: events } = await supabase
        .from('events')
        .select('*, event_registrations(user_id)')
        .eq('status', 'approved')
        .order('start_time', { ascending: true })

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Explore Events</h1>
                    <p className="text-muted-foreground">Discover and register for campus events</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Search className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="w-64 h-10 pl-11 pr-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events && events.length > 0 ? (
                    events.map((event: any) => {
                        // Check if current user is registered
                        const isRegistered = event.event_registrations?.some((r: any) => r.user_id === user?.id) || false

                        return (
                            <div key={event.id} className="bg-card rounded-2xl border border-border overflow-hidden card-hover group flex flex-col">
                                <div className="h-40 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center relative flex-shrink-0">
                                    <span className="text-6xl font-bold text-white/20">{event.title.charAt(0)}</span>
                                    <div className="absolute bottom-3 left-3">
                                        <span className="badge badge-approved">Open</span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                        {event.description || 'An exciting campus event. Join us for a great experience!'}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-auto pb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(event.start_time).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="mt-auto">
                                        <EventRegistrationButton
                                            eventId={event.id}
                                            eventTitle={event.title}
                                            isRegistered={isRegistered}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="col-span-3 text-center py-16 bg-card rounded-2xl border border-border">
                        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">No Events Available</h3>
                        <p className="text-muted-foreground">Check back soon for upcoming events!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
