'use client'

import { useState } from 'react'
import { sendEventAnnouncement } from '@/lib/actions/notification'
import { Bell, Send, X, Loader2 } from 'lucide-react'

export function SendAnnouncementButton({ eventId, eventTitle }: { eventId: string, eventTitle: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        if (!message.trim()) return

        setLoading(true)
        try {
            const res = await sendEventAnnouncement(eventId, `Update: ${eventTitle}`, message)
            if (res.error) {
                alert(res.error)
            } else {
                alert(`Sent to ${res.count} attendees!`)
                setIsOpen(false)
                setMessage('')
            }
        } catch {
            alert("Failed to send")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors text-sm font-medium"
            >
                <Bell className="w-4 h-4" /> Send Update
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border p-6 space-y-4 relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted text-muted-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div>
                            <h3 className="text-xl font-bold">Send Announcement 📢</h3>
                            <p className="text-sm text-muted-foreground">
                                Notify all attendees of <strong>{eventTitle}</strong>
                            </p>
                        </div>

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your message here... (e.g. Venue changed to Room 303)"
                            className="w-full min-h-[100px] p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        />

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={loading || !message.trim()}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Send Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
