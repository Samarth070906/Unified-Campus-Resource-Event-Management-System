'use client'

import { useState } from "react"
import { Users, UserPlus, CheckCircle, LogOut } from "lucide-react"
import { joinClub, leaveClub } from "@/lib/actions/club"
import { cn } from "@/lib/utils"

interface ClubCardProps {
    club: {
        id: string
        name: string
        description: string | null
    }
    isMember: boolean
}

export function ClubCard({ club, isMember }: ClubCardProps) {
    const [loading, setLoading] = useState(false)

    const handleJoin = async () => {
        setLoading(true)
        try {
            await joinClub(club.id)
        } finally {
            setLoading(false)
        }
    }

    const handleLeave = async () => {
        if (!confirm("Are you sure you want to leave this club?")) return
        setLoading(true)
        try {
            await leaveClub(club.id)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Users className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">{club.name}</h3>
            <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-3">
                {club.description || "No description provided."}
            </p>

            <div className="mt-auto">
                {isMember ? (
                    <div className="flex gap-2">
                        <button
                            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-emerald-100 text-emerald-700 font-medium cursor-default"
                        >
                            <CheckCircle className="w-4 h-4" /> Member
                        </button>
                        <button
                            onClick={handleLeave}
                            disabled={loading}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="Leave Club"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleJoin}
                        disabled={loading}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors",
                            loading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <UserPlus className="w-4 h-4" /> {loading ? "Joining..." : "Join Club"}
                    </button>
                )}
            </div>
        </div>
    )
}
