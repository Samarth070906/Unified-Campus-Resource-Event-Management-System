/**
 * Simulated Notification Service
 */

export type NotificationType = 'EMAIL' | 'SMS' | 'PUSH'

export async function sendNotification(userId: string, message: string, type: NotificationType = 'EMAIL') {
    // In a real app, this would use Resend, Twilio, or Firebase FCM.
    console.log(`[NOTIFICATION SERVICE] Sending ${type} to User ${userId}: "${message}"`)

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return { success: true }
}

export async function notifyAdmins(message: string) {
    console.log(`[NOTIFICATION SERVICE] Alerting Admins: "${message}"`)
    return { success: true }
}
