'use client'

import { useState, useMemo } from 'react'
import {
    format,
    startOfWeek,
    addDays,
    isSameDay,
    parseISO,
    differenceInMinutes,
    startOfDay,
    isSameWeek
} from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarEvent {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    status: 'pending' | 'approved' | 'rejected' | 'draft';
    description?: string;
}

interface WeeklyCalendarProps {
    events: CalendarEvent[];
}

export function WeeklyCalendar({ events }: WeeklyCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    // Configuration
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM
    const totalHours = endHour - startHour;
    const hourHeight = 50; // pixels per hour

    // Generate days for the current week (starting Sunday)
    const weekStart = startOfWeek(currentDate)
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i))
    }, [weekStart])

    // Generate time slots
    const timeSlots = useMemo(() => {
        return Array.from({ length: totalHours + 1 }).map((_, i) => startHour + i)
    }, [])

    const navigateWeek = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => addDays(prev, direction === 'next' ? 7 : -7))
    }

    const resetToToday = () => {
        setCurrentDate(new Date())
    }

    // Filter events for this week to optimize rendering
    const weekEvents = useMemo(() => {
        return events.filter(event =>
            isSameWeek(parseISO(event.start_time), currentDate)
        )
    }, [events, currentDate])

    const getEventStyle = (event: CalendarEvent) => {
        const start = parseISO(event.start_time)
        const end = parseISO(event.end_time)

        // Calculate position relative to startHour
        const startMinutes = (start.getHours() * 60) + start.getMinutes()
        const startOffsetMinutes = (startHour * 60)

        const top = ((startMinutes - startOffsetMinutes) / 60) * hourHeight
        const durationMinutes = differenceInMinutes(end, start)
        const height = (durationMinutes / 60) * hourHeight

        // Color coding based on status
        let bgClass = 'bg-blue-100 border-blue-200 text-blue-700'
        if (event.status === 'pending') bgClass = 'bg-yellow-100 border-yellow-200 text-yellow-700'
        if (event.status === 'approved') bgClass = 'bg-emerald-100 border-emerald-200 text-emerald-700'
        if (event.status === 'rejected') bgClass = 'bg-red-50 border-red-100 text-red-400 opacity-60'

        return {
            top: `${Math.max(0, top)}px`,
            height: `${Math.max(20, height)}px`, // Min height for visibility
            styleClass: bgClass
        }
    }

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">
                        {format(weekStart, 'MMMM yyyy')}
                    </h2>
                    <span className="text-muted-foreground text-sm">
                        {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={resetToToday}
                        className="btn-outline text-xs h-8"
                    >
                        Today
                    </button>
                    <div className="flex items-center rounded-md border border-border bg-background">
                        <button
                            onClick={() => navigateWeek('prev')}
                            className="p-1 hover:bg-muted transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="w-[1px] h-5 bg-border"></div>
                        <button
                            onClick={() => navigateWeek('next')}
                            className="p-1 hover:bg-muted transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 relative">
                <div className="min-w-[800px]"> {/* Horizontal scroll support for small screens */}

                    {/* Header Row (Days) */}
                    <div className="grid grid-cols-[60px_1fr] border-b border-border">
                        <div className="border-r border-border p-2 text-xs text-muted-foreground font-medium text-center pt-8">
                            GMT+05:30
                        </div>
                        <div className="grid grid-cols-7">
                            {weekDays.map((date, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "p-2 text-center border-r border-border last:border-r-0",
                                        isSameDay(date, new Date()) ? "bg-primary/5" : ""
                                    )}
                                >
                                    <div className="text-xs text-muted-foreground font-medium mb-1">
                                        {format(date, 'EEE')}
                                    </div>
                                    <div className={cn(
                                        "text-xl font-bold w-8 h-8 flex items-center justify-center mx-auto rounded-full",
                                        isSameDay(date, new Date()) ? "bg-primary text-primary-foreground" : "text-foreground"
                                    )}>
                                        {format(date, 'd')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Body (Time slots + Events) */}
                    <div className="grid grid-cols-[60px_1fr]">

                        {/* Time labels column */}
                        <div className="border-r border-border bg-muted/20">
                            {timeSlots.map((hour) => (
                                <div
                                    key={hour}
                                    className="border-b border-border text-xs text-muted-foreground text-right pr-2 pt-[2px]"
                                    style={{ height: `${hourHeight}px` }}
                                >
                                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                                </div>
                            ))}
                        </div>

                        {/* Days Columns */}
                        <div className="grid grid-cols-7 relative">
                            {/* Grid Lines */}
                            {weekDays.map((day, dayIndex) => (
                                <div key={dayIndex} className="border-r border-border last:border-r-0 relative">
                                    {timeSlots.map((hour) => (
                                        <div
                                            key={hour}
                                            className="border-b border-border"
                                            style={{ height: `${hourHeight}px` }}
                                        />
                                    ))}

                                    {/* Events for this day */}
                                    {weekEvents
                                        .filter(event => isSameDay(parseISO(event.start_time), day))
                                        .map(event => {
                                            const { top, height, styleClass } = getEventStyle(event)
                                            return (
                                                <div
                                                    key={event.id}
                                                    className={cn(
                                                        "absolute left-[2px] right-[2px] rounded-md border p-1 text-xs overflow-hidden cursor-pointer hover:brightness-95 transition-all shadow-sm z-10",
                                                        styleClass
                                                    )}
                                                    style={{ top, height }}
                                                >
                                                    <div className="font-semibold truncate">{event.title}</div>
                                                    <div className="truncate opacity-80">
                                                        {format(parseISO(event.start_time), 'h:mm a')} - {format(parseISO(event.end_time), 'h:mm a')}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ))}

                            {/* Current Time Indicator (if current week) */}
                            {/* We can add this later as a polish */}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
