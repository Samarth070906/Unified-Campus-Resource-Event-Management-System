'use client'

import { X } from 'lucide-react'

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    loading: boolean;
}

export function RegistrationModal({ isOpen, onClose, onConfirm, title, loading }: RegistrationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-background rounded-2xl shadow-xl border border-border w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Confirm Registration
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                        You are about to register for:
                    </p>
                    <p className="font-semibold text-foreground text-lg mt-1">
                        {title}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground mb-2">
                        A confirmation email will be sent to your registered address.
                    </p>

                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted transition-colors font-medium text-sm"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 btn-primary text-sm flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Confirm & Register'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
