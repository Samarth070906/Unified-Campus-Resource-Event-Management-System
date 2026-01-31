import { QRScanner } from "@/components/QRScanner"

export default function ScanPage() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Entry Gate 🚧</h1>
                <p className="text-muted-foreground">Ensure you have permission to manage the event before scanning.</p>
            </div>

            <QRScanner />
        </div>
    )
}
