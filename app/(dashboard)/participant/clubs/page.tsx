import { createClient } from "@/lib/supabase/server"
import { ClubCard } from "@/components/ClubCard"
import { Users } from "lucide-react"

export default async function ClubsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch all clubs
    const { data: clubs } = await supabase
        .from('clubs')
        .select('*')
        .order('name')

    // Fetch user's memberships to check status
    const { data: memberships } = await supabase
        .from('club_members')
        .select('club_id')
        .eq('user_id', user.id)

    const memberClubIds = new Set(memberships?.map(m => m.club_id))

    return (
        <div className="space-y-8">
            <div className="relative rounded-2xl overflow-hidden bg-indigo-600">
                <div className="absolute inset-0 gradient-mesh opacity-20" />
                <div className="relative p-8 text-white flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Campus Clubs 🚀</h1>
                        <p className="text-indigo-100 max-w-xl">
                            Discover and join communities that match your interests.
                        </p>
                    </div>
                    <div className="hidden md:block opacity-80">
                        <Users className="w-24 h-24" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs?.map((club) => (
                    <ClubCard
                        key={club.id}
                        club={club}
                        isMember={memberClubIds.has(club.id)}
                    />
                ))}

                {(!clubs || clubs.length === 0) && (
                    <div className="col-span-full text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">No clubs found</h3>
                        <p className="text-muted-foreground">Check back later for new communities!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
