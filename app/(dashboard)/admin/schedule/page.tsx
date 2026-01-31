import { createClient } from "@/lib/supabase/server"
import { WeeklyCalendar } from "@/components/WeeklyCalendar"

export default async function AdminSchedule() {
    const supabase = await createClient()

    const { data: allEvents } = await supabase
        .from('events')
        .select('*')

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Schedule Overview</h1>
            <WeeklyCalendar events={allEvents || []} />
        </div>
    )
}
