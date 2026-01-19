"use server"

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { revalidatePath } from "next/cache"

// ============================================================================
// App Management Actions
// ============================================================================

/**
 * Get all apps (for admin view)
 */
export async function getAllApps(status?: string) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== "ADMIN") {
            throw new Error("Unauthorized")
        }

        const where: any = {}
        if (status && status !== "ALL") {
            where.status = status
        }

        const apps = await prisma.app.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { installations: true }
                }
            }
        })

        return apps
    } catch (error) {
        console.error("Error fetching all apps:", error)
        return []
    }
}

/**
 * Create a new app (Admin only)
 */
export async function createApp(data: any) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== "ADMIN") {
            throw new Error("Unauthorized")
        }

        // Generate slug from name if not provided
        const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

        const app = await prisma.app.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
                shortDescription: data.shortDescription,
                icon: data.icon,
                category: data.category,
                status: "APPROVED", // Admin created apps are auto-approved
                createdByAdmin: true,
                permissions: {
                    create: data.permissions?.map((p: any) => ({
                        permission: p.value,
                        description: p.label
                    })) || []
                }
            }
        })

        revalidatePath("/admin/apps")
        return { success: true, appId: app.id }

    } catch (error) {
        console.error("Error creating app:", error)
        return { success: false, error: "Failed to create app" }
    }
}

// ============================================================================
// Moderation Actions
// ============================================================================

/**
 * Approve a pending app
 */
export async function approveApp(appId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== "ADMIN") {
            throw new Error("Unauthorized")
        }

        await prisma.app.update({
            where: { id: appId },
            data: {
                status: "APPROVED",
                reviewedBy: session.user.id,
                reviewedAt: new Date()
            }
        })

        revalidatePath("/admin/apps")
        return { success: true }

    } catch (error) {
        console.error("Error approving app:", error)
        return { success: false, error: "Failed to approve app" }
    }
}

/**
 * Reject a pending app
 */
export async function rejectApp(appId: string, reason: string) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== "ADMIN") {
            throw new Error("Unauthorized")
        }

        await prisma.app.update({
            where: { id: appId },
            data: {
                status: "REJECTED",
                reviewedBy: session.user.id,
                reviewedAt: new Date(),
                rejectionReason: reason
            }
        })

        revalidatePath("/admin/apps")
        return { success: true }

    } catch (error) {
        console.error("Error rejecting app:", error)
        return { success: false, error: "Failed to reject app" }
    }
}

/**
 * Suspend an active app
 */
export async function suspendApp(appId: string, reason: string) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== "ADMIN") {
            throw new Error("Unauthorized")
        }

        // 1. Suspend the app
        await prisma.app.update({
            where: { id: appId },
            data: {
                status: "SUSPENDED",
                suspensionReason: reason
            }
        })

        // 2. Suspend all active installations
        await prisma.merchantAppInstallation.updateMany({
            where: { appId: appId, status: "ACTIVE" },
            data: {
                status: "SUSPENDED",
                suspendedBy: session.user.id,
                suspendedAt: new Date(),
                suspensionReason: "App suspended by admin: " + reason
            }
        })

        revalidatePath("/admin/apps")
        return { success: true }

    } catch (error) {
        console.error("Error suspending app:", error)
        return { success: false, error: "Failed to suspend app" }
    }
}

/**
 * Revoke a specific installation
 */
export async function revokeInstallation(installationId: string, reason: string) {
    try {
        const session = await getServerSession(authOptions)
        if (session?.user?.role !== "ADMIN") {
            throw new Error("Unauthorized")
        }

        await prisma.merchantAppInstallation.update({
            where: { id: installationId },
            data: {
                status: "SUSPENDED",
                suspendedBy: session.user.id,
                suspendedAt: new Date(),
                suspensionReason: reason
            }
        })

        // Log for the merchant to see
        const installation = await prisma.merchantAppInstallation.findUnique({
            where: { id: installationId }
        })

        if (installation) {
            await prisma.appActivityLog.create({
                data: {
                    vendorId: installation.vendorId,
                    appId: installation.appId,
                    installationId: installation.id,
                    action: "installation_revoked_by_admin",
                    metadata: { reason }
                }
            })
        }

        return { success: true }

    } catch (error) {
        console.error("Error revoking installation:", error)
        return { success: false, error: "Failed to revoke installation" }
    }
}
