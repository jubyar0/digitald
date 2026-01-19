import { prisma } from "@/lib/db"
import crypto from "crypto"

// ============================================================================
// Types
// ============================================================================

export interface WebhookPayload {
    id: string
    event: string
    createdAt: string
    data: any
}

export interface WebhookDeliveryResult {
    success: boolean
    statusCode?: number
    error?: string
}

// ============================================================================
// Signing
// ============================================================================

/**
 * Sign payload with app secret using HMAC SHA256
 */
export function signPayload(payload: string, secret: string): string {
    return crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex")
}

// ============================================================================
// Delivery Logic
// ============================================================================

/**
 * Send a webhook to a specific URL
 */
async function sendWebhook(
    url: string,
    payload: WebhookPayload,
    secret: string | null
): Promise<WebhookDeliveryResult> {
    try {
        const body = JSON.stringify(payload)
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-App-Event": payload.event,
            "X-App-Event-Id": payload.id,
        }

        if (secret) {
            headers["X-App-Signature"] = signPayload(body, secret)
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

        const response = await fetch(url, {
            method: "POST",
            headers,
            body,
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        return {
            success: response.ok,
            statusCode: response.status
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Network error"
        }
    }
}

// ============================================================================
// Event Triggering
// ============================================================================

/**
 * Trigger an event for a specific app (or all apps subscribed to it)
 */
export async function triggerAppEvent(
    event: string,
    data: any,
    vendorId: string,
    specificAppId?: string
) {
    try {
        // 1. Find subscriptions
        const where: any = {
            event,
            isActive: true,
            app: {
                status: "APPROVED",
                installations: {
                    some: {
                        vendorId,
                        status: "ACTIVE"
                    }
                }
            }
        }

        if (specificAppId) {
            where.appId = specificAppId
        }

        const subscriptions = await prisma.appWebhook.findMany({
            where,
            include: {
                app: {
                    select: {
                        id: true,
                        webhookSecret: true
                    }
                }
            }
        })

        if (subscriptions.length === 0) return

        // 2. Prepare payload
        const payload: WebhookPayload = {
            id: crypto.randomUUID(),
            event,
            createdAt: new Date().toISOString(),
            data
        }

        // 3. Send webhooks (fire and forget / background job pattern)
        // In a real production system, this should be pushed to a queue (Redis/BullMQ/Kafka)
        // For this implementation, we'll process asynchronously but immediately
        Promise.all(subscriptions.map(async (sub) => {
            const result = await sendWebhook(sub.targetUrl, payload, sub.app.webhookSecret)

            // 4. Log result
            await prisma.appWebhook.update({
                where: { id: sub.id },
                data: {
                    lastDeliveredAt: result.success ? new Date() : undefined,
                    failureCount: result.success ? 0 : { increment: 1 }
                }
            })

            // Log detailed activity
            await prisma.appActivityLog.create({
                data: {
                    vendorId,
                    appId: sub.appId,
                    action: "webhook_delivery",
                    metadata: {
                        event,
                        url: sub.targetUrl,
                        success: result.success,
                        statusCode: result.statusCode,
                        error: result.error
                    }
                }
            })
        })).catch(console.error)

    } catch (error) {
        console.error("Error triggering app event:", error)
    }
}
