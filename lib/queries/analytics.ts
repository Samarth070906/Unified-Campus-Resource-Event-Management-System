import { createClient } from "@/lib/supabase/server"

export type ResourceUtilization = {
    resource_name: string
    utilization_percentage: number
}

export type ClubEngagement = {
    club_name: string
    events_count: number
    total_participants: number
    avg_participants_per_event: number
}

/**
 * Calculates resource utilization for a given month.
 * Formula: (Total Booked Hours / Total Available Hours) * 100
 * Assuming 12 hours availability per day (e.g., 8am - 8pm) for simplicity, or 24h.
 * Let's assume standard 10-hour active window (8am-6pm) * 30 days = 300 hours/month capacity.
 */
export async function getResourceUtilization(month: number, year: number): Promise<ResourceUtilization[]> {
    const supabase = await createClient()

    // Start and End of the month
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString() // Last day of month

    const { data: resources } = await supabase.from('resources').select('id, name')
    const { data: bookings } = await supabase
        .from('bookings')
        .select('resource_id, start_time, end_time')
        .eq('status', 'confirmed')
        .gte('start_time', startDate)
        .lte('end_time', endDate)

    if (!resources || !bookings) return []

    const totalCapacityHours = 300 // Approximation

    const utilization: ResourceUtilization[] = resources.map(resource => {
        const resourceBookings = bookings.filter(b => b.resource_id === resource.id)

        const totalBookedMinutes = resourceBookings.reduce((acc, booking) => {
            const start = new Date(booking.start_time)
            const end = new Date(booking.end_time)
            return acc + (end.getTime() - start.getTime()) / (1000 * 60)
        }, 0)

        const totalBookedHours = totalBookedMinutes / 60
        const percentage = (totalBookedHours / totalCapacityHours) * 100

        return {
            resource_name: resource.name,
            utilization_percentage: Math.min(Math.round(percentage * 100) / 100, 100) // Cap at 100
        }
    })

    return utilization
}

/**
 * Calculates Club Engagement.
 * Metrics: Participants per event.
 */
export async function getClubEngagement(): Promise<ClubEngagement[]> {
    const supabase = await createClient()

    // Fetch all clubs
    const { data: clubs } = await supabase.from('clubs').select('id, name')

    // This is a complex query. In a real world scenario, we might want to use a Database View or RPC.
    // For now, we'll fetch and process in JS for simplicity of prototype.

    if (!clubs) return []

    const metrics: ClubEngagement[] = []

    for (const club of clubs) {
        // Get events for this club (where club is primary organizer/collaborator)
        // Note: Our schema has 'organizer_id' (User) and 'event_clubs' (Club).
        // Let's assume we link via 'event_clubs'.

        const { data: events } = await supabase
            .from('event_clubs')
            .select('event_id')
            .eq('club_id', club.id)

        if (!events || events.length === 0) {
            metrics.push({
                club_name: club.name,
                events_count: 0,
                total_participants: 0,
                avg_participants_per_event: 0
            })
            continue
        }

        const eventIds = events.map(e => e.event_id)

        // Count registrations for these events
        const { count, error } = await supabase
            .from('event_registrations')
            .select('user_id', { count: 'exact', head: true })
            .in('event_id', eventIds)

        const totalParticipants = count || 0
        const eventCount = eventIds.length

        metrics.push({
            club_name: club.name,
            events_count: eventCount,
            total_participants: totalParticipants,
            avg_participants_per_event: eventCount > 0 ? Math.round(totalParticipants / eventCount) : 0
        })
    }

    return metrics
}
