'use client'

import { useState } from "react"
import { SendAnnouncementButton } from "@/components/SendAnnouncementButton"
import { Users, AlertCircle, Ban, CheckCircle } from "lucide-react"
import { toggleRegistration } from "@/lib/actions/event"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EventManageCardProps {
    event: any
    registrationCount: number
}

export function EventManageCard({ event, registrationCount }: EventManageCardProps) {
    const [isOpen, setIsOpen] = useState(event.registration_open)
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        const newState = !isOpen
        const res = await toggleRegistration(event.id, newState)

        if (res.success) {
            setIsOpen(newState)
        } else {
            alert(res.error || "Failed to update")
        }
        setLoading(false)
    }

    const capacity = event.max_capacity
    const percentage = capacity ? Math.round((registrationCount / capacity) * 100) : 0
    const isFull = capacity && registrationCount >= capacity

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl leading-tight">{event.title}</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${event.status === 'approved' ? 'bg-green-100 text-green-800' :
                        event.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                        }`}>
                        {event.status}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                    {new Date(event.start_time).toLocaleDateString()}
                </p>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col">
                {/* Stats */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4" /> Registrations
                        </span>
                        <span className="font-semibold text-foreground">
                            {registrationCount} {capacity ? `/ ${capacity}` : ''}
                        </span>
                    </div>

                    {capacity && (
                        <div className="space-y-1">
                            <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all ${isFull ? 'bg-red-500' : 'bg-primary'}`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-right text-muted-foreground">
                                {isFull ? 'Full Capacity' : `${capacity - registrationCount} seats left`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="mt-auto space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Registration Status</span>
                        <button
                            onClick={handleToggle}
                            disabled={loading}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${isOpen
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                        >
                            {isOpen ? (
                                <><CheckCircle className="w-3 h-3" /> Open</>
                            ) : (
                                <><Ban className="w-3 h-3" /> Closed</>
                            )}
                        </button>
                    </div>

                    {event.status === 'approved' && (
                        <SendAnnouncementButton eventId={event.id} eventTitle={event.title} />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
