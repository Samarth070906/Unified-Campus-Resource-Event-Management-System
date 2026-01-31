import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Calendar, Clock, Users, MapPin, ArrowRight, Sparkles } from "lucide-react"

export default async function ParticipantDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: events } = await supabase
        .from('events')
        .select('*, profiles(full_name)')
        .eq('status', 'approved')
        .order('start_time', { ascending: true })
        .limit(6)

    const { data: registrations } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', user?.id)

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 gradient-primary opacity-90" />
                <div className="absolute inset-0 gradient-mesh opacity-20" />
                <div className="relative p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, {user?.user_metadata.full_name || 'Student'}! 👋
                    </h1>
                    <p className="text-white/80 max-w-xl">
                        Discover exciting events happening on campus, register for activities, and connect with clubs.
                    </p>
                    <div className="flex gap-4 mt-6">
                        <Link href="/participant/events" className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">
                            Explore Events <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card rounded-2xl p-6 border border-border card-hover">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                        <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{events?.length || 0}</p>
                    <p className="text-muted-foreground">Upcoming Events</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border card-hover">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{registrations?.length || 0}</p>
                    <p className="text-muted-foreground">My Registrations</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border card-hover">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">5+</p>
                    <p className="text-muted-foreground">Active Clubs</p>
                </div>
            </div>

            {/* Upcoming Events */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
                    <Link href="/participant/events" className="text-primary hover:underline font-medium flex items-center gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events && events.length > 0 ? (
                        events.map((event) => (
                            <div key={event.id} className="bg-card rounded-2xl border border-border overflow-hidden card-hover group">
                                <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-white/30">{event.title.charAt(0)}</span>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">{event.title}</h3>
                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                        {event.description || 'Join us for an exciting event!'}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {new Date(event.start_time).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button className="w-full btn-primary text-sm">
                                        Register Now
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12 bg-card rounded-2xl border border-border">
                            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No events available right now</p>
                            <p className="text-sm text-muted-foreground mt-1">Check back soon for new events!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
