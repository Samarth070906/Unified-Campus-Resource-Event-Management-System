'use client'

import { createEvent } from "@/lib/actions/event"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Calendar, Clock, FileText, MapPin, ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function CreateEventPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resources, setResources] = useState<any[]>([])
    const [clubs, setClubs] = useState<any[]>([])
    const [showClubs, setShowClubs] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()
            const { data: res } = await supabase.from('resources').select('*').eq('is_active', true)
            const { data: clb } = await supabase.from('clubs').select('*')

            if (res) setResources(res)
            if (clb) setClubs(clb)
        }
        fetchData()
    }, [])

    const [selectedResourceId, setSelectedResourceId] = useState('')
    const selectedResource = resources.find(r => r.id === selectedResourceId)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError('')

        try {
            const result = await createEvent(formData)
            if (result.error) {
                setError(result.error)
            } else {
                router.push('/organizer/dashboard')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/organizer/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <div className="bg-card rounded-2xl border border-border p-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Create New Event</h1>
                <p className="text-muted-foreground mb-8">Fill in the details to submit your event for approval.</p>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                            Event Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            required
                            className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            placeholder="Annual Tech Fest 2024"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                            placeholder="Describe your event, activities, and what participants can expect..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start_time" className="block text-sm font-medium text-foreground mb-2">
                                Start Date & Time
                            </label>
                            <input
                                id="start_time"
                                name="start_time"
                                type="datetime-local"
                                required
                                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="end_time" className="block text-sm font-medium text-foreground mb-2">
                                End Date & Time
                            </label>
                            <input
                                id="end_time"
                                name="end_time"
                                type="datetime-local"
                                required
                                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="resource_id" className="block text-sm font-medium text-foreground mb-2">
                                Campus Resource (Optional)
                            </label>
                            <div className="relative">
                                <select
                                    id="resource_id"
                                    name="resource_id"
                                    className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                                    onChange={(e) => setSelectedResourceId(e.target.value)}
                                    value={selectedResourceId}
                                >
                                    <option value="">Select a venue...</option>
                                    {resources.map((resource) => (
                                        <option key={resource.id} value={resource.id}>
                                            {resource.name} ({resource.type})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                </div>
                            </div>
                            {selectedResource ? (
                                <div className="mt-2 p-3 bg-blue-50/50 rounded-lg text-xs text-blue-800 border border-blue-100">
                                    <span className="font-semibold block mb-1">Venue Details:</span>
                                    <div className="flex justify-between">
                                        <span>Capacity: <strong>{selectedResource.capacity} seats</strong></span>
                                        <span>Type: {selectedResource.type}</span>
                                    </div>
                                    <span className="block mt-1 text-blue-600/80">Event limit will be set to {selectedResource.capacity}.</span>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground mt-1">Select a resource to auto-set capacity.</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                                Or Custom Location
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                placeholder="e.g. Off-campus, Online, etc."
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-4">
                        <div className="flex items-start gap-3">
                            <input
                                id="is_collaborative"
                                name="is_collaborative"
                                type="checkbox"
                                className="w-5 h-5 mt-0.5 rounded border-border text-primary focus:ring-primary"
                                onChange={(e) => setShowClubs(e.target.checked)}
                            />
                            <div>
                                <label htmlFor="is_collaborative" className="text-sm font-medium text-foreground cursor-pointer">
                                    Collaborative Event (Club)
                                </label>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    This event is organized by a specific club.
                                </p>
                            </div>
                        </div>

                        {showClubs && (
                            <div className="pl-8">
                                <label htmlFor="club_id" className="block text-sm font-medium text-foreground mb-2">
                                    Select Club
                                </label>
                                <div className="relative">
                                    <select
                                        id="club_id"
                                        name="club_id"
                                        className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="">Select a club...</option>
                                        {clubs.map((club) => (
                                            <option key={club.id} value={club.id}>
                                                {club.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Link
                            href="/organizer/dashboard"
                            className="flex-1 h-12 flex items-center justify-center rounded-xl border border-border bg-background text-foreground font-medium hover:bg-muted transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-12 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Submit for Approval'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
