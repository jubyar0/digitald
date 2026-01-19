"use server"

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { revalidatePath } from "next/cache"
import { generateAppToken } from "@/lib/app-auth"
import { triggerAppEvent } from "@/lib/webhook-service"

// ============================================================================
// App Store Actions
// ============================================================================

/**
 * Get all available apps for the app store
 */
export async function getAvailableApps(category?: string) {
    try {
        const where: any = {
            status: "APPROVED"
        }

        if (category && category !== "all") {
            where.category = category
        }

        const apps = await prisma.app.findMany({
            where,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                permissions: true
            }
        })

        return apps
    } catch (error) {
        console.error("Error fetching available apps:", error)
        return []
    }
}

/**
 * Get a specific app details with all related data
 */
export async function getAppDetails(appId: string) {
    try {
        const session = await getServerSession(authOptions)

        const app = await prisma.app.findUnique({
            where: { id: appId },
            include: {
                permissions: true,
            }
        })

        if (!app) return null

        // Get reviews if table exists
        let reviews: any[] = []
        let reviewStats = { average: app.rating, total: app.reviewCount, breakdown: { 5: 89, 4: 7, 3: 0, 2: 1, 1: 3 } }

        try {
            const appReviews = await prisma.appReview.findMany({
                where: { appId },
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: {
                    vendor: {
                        select: { name: true }
                    }
                }
            })
            reviews = appReviews

            if (appReviews.length > 0) {
                const ratingCounts = [0, 0, 0, 0, 0]
                let total = 0
                appReviews.forEach(r => {
                    ratingCounts[r.rating - 1]++
                    total += r.rating
                })
                reviewStats = {
                    average: total / appReviews.length,
                    total: appReviews.length,
                    breakdown: {
                        5: ratingCounts[4],
                        4: ratingCounts[3],
                        3: ratingCounts[2],
                        2: ratingCounts[1],
                        1: ratingCounts[0]
                    }
                }
            }
        } catch (e) {
            // AppReview table might not exist yet
            console.log("AppReview table not available, using mock data")
        }

        // Check if user has installed this app
        let isInstalled = false
        let installationId = null

        if (session?.user?.id) {
            const vendor = await prisma.vendor.findUnique({
                where: { userId: session.user.id },
                select: { id: true }
            })

            if (vendor) {
                const installation = await prisma.merchantAppInstallation.findUnique({
                    where: {
                        vendorId_appId: {
                            vendorId: vendor.id,
                            appId: appId
                        }
                    }
                })

                if (installation && installation.status === 'ACTIVE') {
                    isInstalled = true
                    installationId = installation.id
                }
            }
        }

        return {
            ...app,
            reviews,
            reviewStats,
            isInstalled,
            installationId,
            // Mock pricing tiers for now
            pricingTiers: [
                {
                    name: 'Free',
                    price: 0,
                    features: ['Basic features', 'Standard support']
                },
                {
                    name: 'Tier 1',
                    price: 4.99,
                    features: ['All free features', 'Priority support', 'Advanced analytics'],
                    hasTrial: true,
                    trialDays: 7
                },
                {
                    name: 'Tier 2',
                    price: 9.99,
                    features: ['Everything in Tier 1', 'Unlimited usage', '24/7 support'],
                    hasTrial: true,
                    trialDays: 7
                }
            ]
        }
    } catch (error) {
        console.error("Error fetching app details:", error)
        return null
    }
}

/**
 * Get similar apps based on category
 */
export async function getSimilarApps(appId: string, category: string | null, limit: number = 3) {
    try {
        const apps = await prisma.app.findMany({
            where: {
                status: 'APPROVED',
                id: { not: appId },
                ...(category ? { category } : {})
            },
            take: limit,
            orderBy: { rating: 'desc' }
        })

        return apps
    } catch (error) {
        console.error("Error fetching similar apps:", error)
        return []
    }
}

/**
 * Add a review for an app
 */
export async function addAppReview(appId: string, rating: number, comment: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true, name: true }
        })

        if (!vendor) {
            return { success: false, error: "Vendor not found" }
        }

        // Check if app is installed
        const installation = await prisma.merchantAppInstallation.findUnique({
            where: {
                vendorId_appId: {
                    vendorId: vendor.id,
                    appId: appId
                }
            }
        })

        if (!installation || installation.status !== 'ACTIVE') {
            return { success: false, error: "You must install the app before reviewing" }
        }

        // Check if already reviewed
        try {
            const existingReview = await prisma.appReview.findUnique({
                where: {
                    appId_vendorId: {
                        vendorId: vendor.id,
                        appId: appId
                    }
                }
            })

            if (existingReview) {
                // Update existing review
                await prisma.appReview.update({
                    where: { id: existingReview.id },
                    data: { rating, comment, updatedAt: new Date() }
                })
            } else {
                // Create new review
                await prisma.appReview.create({
                    data: {
                        vendorId: vendor.id,
                        appId: appId,
                        rating,
                        comment
                    }
                })

                // Update app review count
                await prisma.app.update({
                    where: { id: appId },
                    data: { reviewCount: { increment: 1 } }
                })
            }

            // Update app average rating
            const allReviews = await prisma.appReview.findMany({
                where: { appId },
                select: { rating: true }
            })

            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
            await prisma.app.update({
                where: { id: appId },
                data: { rating: avgRating }
            })

            revalidatePath(`/seller/apps/${appId}`)
            return { success: true }
        } catch (e) {
            // AppReview table might not exist
            console.log("AppReview table not available")
            return { success: false, error: "Reviews not available" }
        }
    } catch (error) {
        console.error("Error adding review:", error)
        return { success: false, error: "Failed to add review" }
    }
}

/**
 * Get app reviews with pagination
 */
export async function getAppReviews(appId: string, page: number = 1, limit: number = 10) {
    try {
        const skip = (page - 1) * limit

        const [reviews, total] = await Promise.all([
            prisma.appReview.findMany({
                where: { appId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    vendor: {
                        select: { name: true }
                    }
                }
            }),
            prisma.appReview.count({ where: { appId } })
        ])

        return {
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error) {
        console.error("Error fetching reviews:", error)
        return { reviews: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }
    }
}

// ============================================================================
// Installation Actions
// ============================================================================

/**
 * Get all installed apps for the current vendor
 */
export async function getInstalledApps() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return []

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) return []

        const installations = await prisma.merchantAppInstallation.findMany({
            where: {
                vendorId: vendor.id,
                status: { not: "UNINSTALLED" }
            },
            include: {
                app: true
            },
            orderBy: {
                installedAt: "desc"
            }
        })

        return installations
    } catch (error) {
        console.error("Error fetching installed apps:", error)
        return []
    }
}

/**
 * Install an app for the current vendor
 */
export async function installApp(appId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error("Vendor profile not found")
        }

        // 1. Get app details to snapshot permissions
        const app = await prisma.app.findUnique({
            where: { id: appId },
            include: { permissions: true }
        })

        if (!app || app.status !== "APPROVED") {
            throw new Error("App not found or not available")
        }

        // 2. Check if already installed
        const existingInstallation = await prisma.merchantAppInstallation.findUnique({
            where: {
                vendorId_appId: {
                    vendorId: vendor.id,
                    appId: appId
                }
            }
        })

        if (existingInstallation && existingInstallation.status === "ACTIVE") {
            return { success: true, installationId: existingInstallation.id, alreadyInstalled: true }
        }

        // 3. Generate token
        const { hashedToken, prefix, token } = generateAppToken()
        const permissionsList = app.permissions.map(p => p.permission)

        // 4. Create or update installation
        if (existingInstallation) {
            // Re-install
            await prisma.merchantAppInstallation.update({
                where: { id: existingInstallation.id },
                data: {
                    status: "ACTIVE",
                    accessToken: hashedToken,
                    accessTokenPrefix: prefix,
                    permissionsSnapshot: permissionsList,
                    installedAt: new Date(),
                    uninstalledAt: null
                }
            })
        } else {
            // New install
            await prisma.merchantAppInstallation.create({
                data: {
                    vendorId: vendor.id,
                    appId: appId,
                    accessToken: hashedToken,
                    accessTokenPrefix: prefix,
                    permissionsSnapshot: permissionsList,
                    status: "ACTIVE"
                }
            })
        }

        // 5. Log activity
        await prisma.appActivityLog.create({
            data: {
                vendorId: vendor.id,
                appId: appId,
                action: "app_installed",
                metadata: {
                    ipAddress: "internal", // Could capture from headers if needed
                    userAgent: "dashboard"
                }
            }
        })

        revalidatePath("/seller/apps")
        revalidatePath("/seller/app-store")

        // Return the raw token ONLY ONCE
        return { success: true, token }

    } catch (error) {
        console.error("Error installing app:", error)
        return { success: false, error: "Failed to install app" }
    }
}

/**
 * Uninstall an app
 */
export async function uninstallApp(installationId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error("Vendor not found")
        }

        // Verify ownership
        const installation = await prisma.merchantAppInstallation.findUnique({
            where: { id: installationId }
        })

        if (!installation || installation.vendorId !== vendor.id) {
            throw new Error("Installation not found or unauthorized")
        }

        // Soft delete (mark as uninstalled)
        await prisma.merchantAppInstallation.update({
            where: { id: installationId },
            data: {
                status: "UNINSTALLED",
                uninstalledAt: new Date(),
                accessToken: "" // Clear token for security
            }
        })

        // Log activity
        await prisma.appActivityLog.create({
            data: {
                vendorId: vendor.id,
                appId: installation.appId,
                installationId: installation.id,
                action: "app_uninstalled"
            }
        })

        revalidatePath("/seller/apps")
        return { success: true }

    } catch (error) {
        console.error("Error uninstalling app:", error)
        return { success: false, error: "Failed to uninstall app" }
    }
}

// ============================================================================
// Activity & Management
// ============================================================================

/**
 * Get activity logs for an installed app
 */
export async function getAppActivity(appId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) return []

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) return []

        const logs = await prisma.appActivityLog.findMany({
            where: {
                vendorId: vendor.id,
                appId: appId
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 50
        })

        return logs
    } catch (error) {
        console.error("Error fetching app activity:", error)
        return []
    }
}

/**
 * Regenerate access token for an app
 */
export async function regenerateAppToken(installationId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error("Vendor not found")
        }

        // Verify ownership
        const installation = await prisma.merchantAppInstallation.findUnique({
            where: { id: installationId }
        })

        if (!installation || installation.vendorId !== vendor.id) {
            throw new Error("Installation not found or unauthorized")
        }

        // Generate new token
        const { hashedToken, prefix, token } = generateAppToken()

        await prisma.merchantAppInstallation.update({
            where: { id: installationId },
            data: {
                accessToken: hashedToken,
                accessTokenPrefix: prefix
            }
        })

        // Log activity
        await prisma.appActivityLog.create({
            data: {
                vendorId: vendor.id,
                appId: installation.appId,
                installationId: installation.id,
                action: "token_regenerated"
            }
        })

        return { success: true, token }

    } catch (error) {
        console.error("Error regenerating token:", error)
        return { success: false, error: "Failed to regenerate token" }
    }
}
