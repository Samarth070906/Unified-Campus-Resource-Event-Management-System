'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

interface TicketCardProps {
    event: {
        id: string;
        title: string;
        start_time: string;
        location: string;
    };
    userId: string;
    checkedInAt?: string | null;
}

export function TicketCard({ event, userId, checkedInAt }: TicketCardProps) {
    const qrData = JSON.stringify({
        eventId: event.id,
        userId: userId
    })

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
            {/* Left: Event Details */}
            <div className="p-6 flex-1 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{event.title}</h3>
                    <div className="space-y-2 text-muted-foreground mb-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(event.start_time), 'PPP')}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            {format(new Date(event.start_time), 'p')}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4" />
                            {event.location || 'TBA'}
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    {checkedInAt ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                            <CheckCircle className="w-3 h-3" /> Checked In
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            Valid Ticket
                        </div>
                    )}
                </div>
            </div>

            {/* Right: QR Code (Perforated line effect) */}
            <div className="relative p-6 bg-white border-l border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 min-w-[200px]">
                {/* Semi-circles for ticket effect */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-background rounded-full border border-border" />
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-background rounded-full border border-border" />

                <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                    <QRCodeSVG
                        value={qrData}
                        size={120}
                        level="M"
                        includeMargin={false}
                    />
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Scan for Entry</p>
            </div>
        </div>
    )
}
