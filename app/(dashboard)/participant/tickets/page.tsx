import { createClient } from "@/lib/supabase/server"
import { TicketCard } from "@/components/TicketCard"
import { Ticket } from "lucide-react"

export default async function MyTicketsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: registrations, error } = await supabase
        .from('event_registrations')
        .select(`
            checked_in_at,
            events (
                id,
                title,
                start_time,
                location
            )
        `)
        .eq('user_id', user.id)
        .order('registered_at', { ascending: false })

    if (error) {
        return (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                <h3 className="font-bold">Error fetching tickets</h3>
                <p className="text-sm font-mono">{error.message}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">My Tickets 🎟️</h1>
                <p className="text-muted-foreground">Show these QR codes at the event entrance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {registrations && registrations.length > 0 ? (
                    registrations.map((reg: any) => (
                        reg.events ? ( // Check if event exists
                            <TicketCard
                                key={reg.events.id}
                                event={reg.events}
                                userId={user.id}
                                checkedInAt={reg.checked_in_at}
                            />
                        ) : null
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center bg-card rounded-2xl border border-border">
                        <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Tickets Found</h3>
                        <p className="text-muted-foreground">Register for an event to get your ticket.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
