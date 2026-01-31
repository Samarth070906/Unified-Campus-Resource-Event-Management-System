import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventManageCard } from "@/components/EventManageCard"

export default async function OrganizerEvents() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <p>Please log in.</p>

    const { data: events } = await supabase
        .from('events')
        .select(`
            *,
            event_registrations (count)
        `)
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">My Events Manager</h2>
            <p className="text-muted-foreground">Monitor registrations and manage your events.</p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events && events.length > 0 ? (
                    events.map((event: any) => (
                        <EventManageCard
                            key={event.id}
                            event={event}
                            registrationCount={event.event_registrations[0]?.count || 0}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 col-span-3">You haven&apos;t created any events yet.</p>
                )}
            </div>
        </div>
    )
}
