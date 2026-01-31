'use client'

import { useState } from 'react'
import { createResource } from '@/lib/actions/resource'
import { PlusCircle, Loader2, X } from 'lucide-react'

export function AddResourceModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            const res = await createResource(formData)

            if (res.error) {
                alert(res.error)
            } else {
                setIsOpen(false)
            }
        } catch (error) {
            console.error(error)
            alert("Connection Error. Please refresh the page and try again.\nDetails: " + (error instanceof Error ? error.message : "Unknown error"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
                <PlusCircle className="w-4 h-4" /> Add Resource
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border p-6 relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted text-muted-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Add New Resource</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Resource Name</label>
                                <input
                                    name="name"
                                    required
                                    placeholder="e.g. Auditorium A"
                                    className="w-full p-2 rounded-lg border border-border bg-background"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    name="type"
                                    required
                                    className="w-full p-2 rounded-lg border border-border bg-background"
                                >
                                    <option value="room">Room</option>
                                    <option value="hall">Hall</option>
                                    <option value="auditorium">Auditorium</option>
                                    <option value="equipment">Equipment</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Capacity (Optional)</label>
                                <input
                                    name="capacity"
                                    type="number"
                                    placeholder="e.g. 50"
                                    className="w-full p-2 rounded-lg border border-border bg-background"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Create Resource
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
