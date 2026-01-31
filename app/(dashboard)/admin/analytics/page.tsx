import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getResourceUtilization, getClubEngagement } from "@/lib/queries/analytics"

export default async function AdminAnalytics() {
    const today = new Date()
    const utilization = await getResourceUtilization(today.getMonth() + 1, today.getFullYear())
    const engagement = await getClubEngagement()

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Resource Utilization (This Month)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {utilization.length > 0 ? (
                            <div className="space-y-3">
                                {utilization.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="font-medium">{item.resource_name}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${item.utilization_percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-500 w-12 text-right">
                                                {item.utilization_percentage}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No utilization data available.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Club Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {engagement.length > 0 ? (
                            <div className="space-y-3">
                                {engagement.map((club, index) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div>
                                            <p className="font-medium">{club.club_name}</p>
                                            <p className="text-xs text-gray-500">{club.events_count} events</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">{club.total_participants}</p>
                                            <p className="text-xs text-gray-500">participants</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No club data available.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
