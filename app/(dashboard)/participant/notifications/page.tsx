import { createClient } from "@/lib/supabase/server"
import { NotificationList } from "@/components/NotificationList"

export default async function ParticipantNotifications() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Notifications 🔔</h1>
                <p className="text-muted-foreground">Updates regarding your registered events.</p>
            </div>

            <NotificationList notifications={notifications || []} />
        </div>
    )
}
