'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { login } from './actions'
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const message = searchParams.get('message')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <>
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                </div>
            )}

            {message && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm">
                    {message}
                </div>
            )}

            <form action={login} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email address
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Lock className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            className="w-full h-12 pl-12 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full h-12 btn-primary flex items-center justify-center gap-2"
                >
                    Sign in <ArrowRight className="w-4 h-4" />
                </button>
            </form>

            <p className="mt-8 text-center text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                    Create one
                </Link>
            </p>
        </>
    )
}

function LoginFormFallback() {
    return (
        <div className="space-y-5 animate-pulse">
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-12 bg-primary/50 rounded-xl" />
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-foreground">CampusSync</span>
                    </div>

                    <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
                    <p className="text-muted-foreground mb-8">
                        Sign in to continue to your dashboard
                    </p>

                    <Suspense fallback={<LoginFormFallback />}>
                        <LoginForm />
                    </Suspense>
                </div>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden">
                <div className="absolute inset-0 gradient-primary" />
                <div className="absolute inset-0 gradient-mesh opacity-30" />
                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
                    <div className="max-w-md text-center">
                        <h2 className="text-4xl font-bold mb-6">Manage Campus Events Effortlessly</h2>
                        <p className="text-white/80 text-lg">
                            Join the platform trusted by students and organizers across campus for seamless event management.
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-3 gap-6">
                        {['Events', 'Clubs', 'Resources'].map((item, i) => (
                            <div key={i} className="glass rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold">{['50+', '20+', '15+'][i]}</div>
                                <div className="text-sm text-white/70">{item}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
