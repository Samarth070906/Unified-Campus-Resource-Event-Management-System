import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminEvents() {
    const supabase = await createClient()

    const { data: events } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">All Events (Admin View)</h2>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 px-4">Title</th>
                            <th className="text-left py-3 px-4">Organizer</th>
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-left py-3 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events && events.map((event) => (
                            <tr key={event.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">{event.title}</td>
                                <td className="py-3 px-4">Organizer ID: {event.organizer_id.slice(0, 8)}...</td>
                                <td className="py-3 px-4">{new Date(event.start_time).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${event.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        event.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {event.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!events || events.length === 0) && (
                    <p className="text-gray-500 text-center py-8">No events in the system.</p>
                )}
            </div>
        </div>
    )
}
