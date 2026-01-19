import { prisma } from "@/lib/db"
import crypto from "crypto"
import { headers } from "next/headers"

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface AppAuthContext {
    vendorId: string
    appId: string
    installationId: string
    permissions: string[]
}

export interface AppAuthOptions {
    requiredPermissions?: string[]
}

// ============================================================================
// Token Utilities
// ============================================================================

/**
 * Hash a plain text token for storage/comparison
 */
export function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex")
}

/**
 * Generate a new app access token
 * Format: app_live_{32_random_hex_chars}
 */
export function generateAppToken(): { token: string; hashedToken: string; prefix: string } {
    const randomBytes = crypto.randomBytes(16).toString("hex")
    const token = `app_live_${randomBytes}`
    const hashedToken = hashToken(token)
    const prefix = token.substring(0, 12) // app_live_ + 3 chars

    return { token, hashedToken, prefix }
}

// ============================================================================
// Authorization Logic
// ============================================================================

/**
 * Validate an app token and return the installation context
 */
export async function validateAppToken(token: string): Promise<AppAuthContext | null> {
    try {
        // 1. Basic format check
        if (!token.startsWith("app_live_")) {
            return null
        }

        // 2. Hash token for lookup
        const hashedToken = hashToken(token)

        // 3. Find active installation
        const installation = await prisma.merchantAppInstallation.findFirst({
            where: {
                accessToken: hashedToken,
                status: "ACTIVE"
            },
            include: {
                app: true
            }
        })

        if (!installation) {
            return null
        }

        // 4. Check if app is suspended
        if (installation.app.status === "SUSPENDED") {
            return null
        }

        // 5. Update last used timestamp (fire and forget)
        // We don't await this to avoid slowing down the request
        prisma.merchantAppInstallation.update({
            where: { id: installation.id },
            data: { lastUsedAt: new Date() }
        }).catch(console.error)

        // 6. Return context
        // Parse permissions snapshot safely
        let permissions: string[] = []
        try {
            if (typeof installation.permissionsSnapshot === 'string') {
                permissions = JSON.parse(installation.permissionsSnapshot)
            } else if (Array.isArray(installation.permissionsSnapshot)) {
                permissions = installation.permissionsSnapshot as string[]
            }
        } catch (e) {
            console.error("Failed to parse permissions", e)
        }

        return {
            vendorId: installation.vendorId,
            appId: installation.appId,
            installationId: installation.id,
            permissions
        }

    } catch (error) {
        console.error("App auth validation error:", error)
        return null
    }
}

/**
 * Middleware helper for API routes
 * Usage:
 * const auth = await withAppAuth({ requiredPermissions: ['read_orders'] })
 * if (!auth) return new Response("Unauthorized", { status: 401 })
 */
export async function withAppAuth(options: AppAuthOptions = {}): Promise<AppAuthContext | null> {
    const headersList = headers()
    const authHeader = headersList.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null
    }

    const token = authHeader.split(" ")[1]
    const context = await validateAppToken(token)

    if (!context) {
        return null
    }

    // Check permissions if required
    if (options.requiredPermissions && options.requiredPermissions.length > 0) {
        const hasAllPermissions = options.requiredPermissions.every(p =>
            context.permissions.includes(p)
        )

        if (!hasAllPermissions) {
            console.warn(`App ${context.appId} missing required permissions: ${options.requiredPermissions.join(", ")}`)
            return null
        }
    }

    return context
}
