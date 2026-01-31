import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-destructive">403</h1>
                <h2 className="text-2xl font-semibold">Access Denied</h2>
                <p className="text-muted-foreground max-w-md">
                    You don&apos;t have permission to access this page. Please contact an administrator if you believe this is an error.
                </p>
                <Button asChild>
                    <Link href="/">Go Home</Link>
                </Button>
            </div>
        </div>
    )
}
