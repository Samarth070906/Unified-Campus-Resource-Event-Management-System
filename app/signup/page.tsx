'use client'

import Link from 'next/link'
import { signup } from '../login/actions'
import { Zap, Mail, Lock, User, Users, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SignupForm() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const success = searchParams.get('success')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <>
            {/* Success Message */}
            {success && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-emerald-700">Account Created Successfully!</p>
                        <p className="text-sm text-emerald-600 mt-1">
                            Please check your email to verify your account, then sign in.
                        </p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                </div>
            )}

            <form action={signup} className="space-y-5">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

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
                            placeholder="you@iitgoa.ac.in"
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
                            autoComplete="new-password"
                            required
                            className="w-full h-12 pl-12 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            placeholder="Min. 6 characters"
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

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                        I am a...
                    </label>
                    <select
                        id="role"
                        name="role"
                        className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    >
                        <option value="participant">Student / Participant</option>
                        <option value="organizer">Club Organizer</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full h-12 btn-primary flex items-center justify-center gap-2"
                >
                    Create Account <ArrowRight className="w-4 h-4" />
                </button>
            </form>

            <p className="mt-8 text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Sign in
                </Link>
            </p>
        </>
    )
}

function SignupFormFallback() {
    return (
        <div className="space-y-5 animate-pulse">
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-12 bg-muted rounded-xl" />
            <div className="h-12 bg-primary/50 rounded-xl" />
        </div>
    )
}

export default function SignupPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden">
                <div className="absolute inset-0 gradient-primary" />
                <div className="absolute inset-0 gradient-mesh opacity-30" />
                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
                    <div className="max-w-md text-center">
                        <h2 className="text-4xl font-bold mb-6">Join the Campus Community</h2>
                        <p className="text-white/80 text-lg">
                            Create your account and start discovering events, joining clubs, and booking resources.
                        </p>
                    </div>
                    <div className="mt-12 space-y-4 w-full max-w-sm">
                        {[
                            { icon: Users, text: 'Join 50+ active clubs' },
                            { icon: Zap, text: 'Discover exciting events' },
                            { icon: User, text: 'Build your campus network' },
                        ].map((item, i) => (
                            <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-foreground">CampusSync</span>
                    </div>

                    <h1 className="text-3xl font-bold text-foreground mb-2">Create account</h1>
                    <p className="text-muted-foreground mb-8">
                        Get started with your free account
                    </p>

                    <Suspense fallback={<SignupFormFallback />}>
                        <SignupForm />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
