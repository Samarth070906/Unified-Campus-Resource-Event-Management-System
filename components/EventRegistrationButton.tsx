'use client'

import { useState } from 'react'
import { registerForEvent } from '@/lib/actions/event'
import { Loader2, CheckCircle } from 'lucide-react'
import { RegistrationModal } from './RegistrationModal'
import Link from 'next/link'

export function EventRegistrationButton({ eventId, eventTitle, isRegistered }: { eventId: string, eventTitle: string, isRegistered: boolean }) {
    const [loading, setLoading] = useState(false)
    const [registered, setRegistered] = useState(isRegistered)
    const [showModal, setShowModal] = useState(false)

    const handleRegister = async () => {
        setLoading(true)
        try {
            const res = await registerForEvent(eventId)
            if (res.error) {
                alert(res.error)
            } else {
                setRegistered(true)
                setShowModal(false)
            }
        } catch {
            alert("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    if (registered) {
        return (
            <Link href="/participant/tickets" className="w-full py-2.5 px-4 rounded-xl bg-emerald-100 text-emerald-700 font-medium text-sm flex items-center justify-center gap-2 hover:bg-emerald-200 transition-colors border border-emerald-200">
                <CheckCircle className="w-4 h-4" /> View Ticket
            </Link>
        )
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="w-full btn-primary text-sm flex items-center justify-center h-10"
            >
                Register Now
            </button>

            <RegistrationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleRegister}
                title={eventTitle}
                loading={loading}
            />
        </>
    )
}

