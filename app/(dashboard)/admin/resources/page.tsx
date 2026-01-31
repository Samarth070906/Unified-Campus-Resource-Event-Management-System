import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddResourceModal } from "@/components/AddResourceModal"

export default async function AdminResources() {
    const supabase = await createClient()

    const { data: resources } = await supabase
        .from('resources')
        .select('*')
        .order('name')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Resource Management</h2>
                <AddResourceModal />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resources && resources.length > 0 ? (
                    resources.map((resource) => (
                        <Card key={resource.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {resource.name}
                                    <span className={`text-xs px-2 py-1 rounded-full ${resource.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {resource.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">Type: {resource.type}</p>
                                {resource.capacity && (
                                    <p className="text-sm text-gray-500">Capacity: {resource.capacity}</p>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-3">No resources found. Add resources in Supabase.</p>
                )}
            </div>
        </div>
    )
}
