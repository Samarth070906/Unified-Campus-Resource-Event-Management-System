import { createClient } from "@/lib/supabase/server"
import { WeeklyCalendar } from "@/components/WeeklyCalendar"

export default async function OrganizerSchedule() {
    const supabase = await createClient()

    const { data: allEvents } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved') // Organizers should mainly see approved events to avoid conflicts

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Campus Schedule</h1>
            <p className="text-muted-foreground">View all approved campus events to plan your own.</p>
            <WeeklyCalendar events={allEvents || []} />
        </div>
    )
}
