'use client'

import { Bell, Check, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'

interface Notification {
    id: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export function NotificationList({ notifications: initialNotifications }: { notifications: Notification[] }) {
    const [notifications, setNotifications] = useState(initialNotifications)

    if (notifications.length === 0) {
        return (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {notifications.map((notif) => (
                <div
                    key={notif.id}
                    className={`p-4 rounded-xl border flex gap-4 ${notif.is_read ? 'bg-card border-border' : 'bg-blue-50/50 border-blue-100'
                        }`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.is_read ? 'bg-muted text-muted-foreground' : 'bg-blue-100 text-blue-600'
                        }`}>
                        <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <h4 className={`font-semibold ${notif.is_read ? 'text-foreground' : 'text-blue-900'}`}>
                                {notif.title}
                            </h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {format(new Date(notif.created_at), 'MMM d, h:mm a')}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{notif.message}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
