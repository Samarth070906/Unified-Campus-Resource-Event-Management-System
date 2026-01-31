'use client'

import { useEffect, useState } from 'react'
import { verifyAttendance } from '@/lib/actions/attendance'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Loader2, CheckCircle, XCircle, RefreshCcw } from 'lucide-react'

export function QRScanner() {
    const [scanResult, setScanResult] = useState<string | null>(null)
    const [manualCode, setManualCode] = useState('') // Fallback
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    useEffect(() => {
        // Only initialize scanner if not processing/success, or ensure single instance
        const scannerId = "reader"

        // Prevent double init in strict mode or re-renders
        // We defer slightly to ensure DOM is ready
        const timer = setTimeout(() => {
            const element = document.getElementById(scannerId)
            if (element && !scanResult && status === 'idle') {
                // Clean up previous instance if any? html5-qrcode acts on ID.
                // We rely on the library handling.
                try {
                    const scanner = new Html5QrcodeScanner(
                        scannerId,
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        false
                    )

                    scanner.render(onScanSuccess, onScanFailure)

                    // Store scanner in window or ref to clear? 
                    // The library is tricky with React unmounts. 
                    // We'll rely on simple page refreshes if it gets stuck for now.
                } catch (e) {
                    console.error("Scanner init error", e)
                }
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [scanResult, status])

    async function onScanSuccess(decodedText: string, decodedResult: any) {
        // Stop scanning temporarily
        if (status === 'processing' || status === 'success') return

        handleVerification(decodedText)
    }

    function onScanFailure(error: any) {
        // Ignore errors purely from "no code found"
    }

    async function handleVerification(code: string) {
        setStatus('processing')
        setMessage('Verifying...')
        setScanResult(code)

        try {
            // Attempt to stop scanner? It's hard to stop the UI version programmatically without clearing the DOM.
            // We just overlay the result.

            const result = await verifyAttendance(code)

            if (result.error) {
                setStatus('error')
                setMessage(result.error)
            } else if (result.alreadyCheckedIn) {
                setStatus('error') // Or 'warning'
                setMessage(result.message || 'Already checked in')
            } else {
                setStatus('success')
                setMessage(result.message || 'Checked in successfully')
            }
        } catch {
            setStatus('error')
            setMessage("Network error occurred")
        }
    }

    const resetScanner = () => {
        setScanResult(null)
        setStatus('idle')
        setMessage('')
        // Reload page is easiest way to reset the DOM-based scanner reliably
        window.location.reload()
    }

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-center mb-6">Scan Entry Ticket 📷</h2>

                {status === 'idle' && (
                    <div id="reader" className="w-full overflow-hidden rounded-xl border border-border bg-black/5"></div>
                )}

                {status === 'processing' && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-muted-foreground">Verifying Ticket...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-emerald-700">Access Granted</h3>
                            <p className="text-muted-foreground mt-2">{message}</p>
                        </div>
                        <button onClick={resetScanner} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                            <RefreshCcw className="w-4 h-4" /> Scan Next
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-red-700">Access Denied</h3>
                            <p className="text-muted-foreground mt-2">{message}</p>
                        </div>
                        <button onClick={resetScanner} className="btn-outline w-full mt-4 flex items-center justify-center gap-2">
                            <RefreshCcw className="w-4 h-4" /> Try Again
                        </button>
                    </div>
                )}
            </div>

            {/* Fallback Manual Input */}
            {status === 'idle' && (
                <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-4">Scanner issues? Enter raw JSON manually (dev only)</p>
                    {/* Add manual input if really needed, but keeping it simple for now */}
                </div>
            )}
        </div>
    )
}
