import { createClient } from "@/lib/supabase/server"

export default async function DebugPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Not logged in</div>

    const { data: registrations, error: regError } = await supabase
        .from('event_registrations')
        .select('*')

    const { data: myRegistrations, error: myRegError } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', user.id)

    return (
        <div className="p-8 font-mono text-sm space-y-8">
            <h1 className="text-xl font-bold">Debug Data</h1>

            <div>
                <h2 className="font-bold">User ID:</h2>
                <p>{user.id}</p>
            </div>

            <div>
                <h2 className="font-bold">My Registrations ({myRegistrations?.length}):</h2>
                {(myRegistrations && myRegistrations.length > 0) ? (
                    <pre className="bg-muted p-4 rounded">{JSON.stringify(myRegistrations, null, 2)}</pre>
                ) : (
                    <p className="text-red-500">No registrations found for this user.</p>
                )}
                {myRegError && <p className="text-red-500">{myRegError.message}</p>}
            </div>

            <div>
                <h2 className="font-bold">All Registrations in DB ({registrations?.length}):</h2>
                {(registrations && registrations.length > 0) ? (
                    <pre className="bg-muted p-4 rounded">{JSON.stringify(registrations, null, 2)}</pre>
                ) : (
                    <p className="text-red-500">Table is empty.</p>
                )}
                {regError && <p className="text-red-500">{regError.message}</p>}
            </div>
        </div>
    )
}
