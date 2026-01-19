'use server'

import { prisma } from '@/lib/db'
import { getCurrentSession } from '@/lib/auth'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { AppStatus } from '@repo/database'
import crypto from 'crypto'
import { unstable_cache } from 'next/cache'

/**
 * Generate a random secret for webhooks
 */
function generateSecret() {
    return `whsec_${crypto.randomBytes(24).toString('hex')}`
}

/**
 * Register a new app
 */
export async function registerApp(data: {
    name: string
    description: string
    webhookUrl?: string
    category?: string
}) {
    const session = await getCurrentSession()
    if (!session?.user) {
        throw new Error('Unauthorized')
    }

    // Generate a unique slug from name
    let slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const existing = await prisma.app.findUnique({ where: { slug } })
    if (existing) {
        slug = `${slug}-${crypto.randomBytes(4).toString('hex')}`
    }

    const app = await prisma.app.create({
        data: {
            name: data.name,
            slug,
            description: data.description,
            developerId: session.user.id,
            developerName: session.user.name,
            developerEmail: session.user.email,
            status: AppStatus.PENDING, // Auto-approve could be an option for trusted devs
            webhookSecret: generateSecret(),
            // If webhook URL is provided, create a default subscription
            webhooks: data.webhookUrl ? {
                create: [
                    { event: 'app.installed', targetUrl: data.webhookUrl, isActive: true },
                    { event: 'app.uninstalled', targetUrl: data.webhookUrl, isActive: true }
                ]
            } : undefined
        }
    })

    revalidateTag('my-apps')
    revalidatePath('/developer')
    return { success: true, appId: app.id }
}

/**
 * Get all apps owned by the current user
 */
export const getMyApps = async () => {
    const session = await getCurrentSession()
    if (!session?.user) {
        redirect('/signin')
    }

    return unstable_cache(
        async () => {
            return prisma.app.findMany({
                where: {
                    developerId: session.user.id
                },
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    _count: {
                        select: { installations: true }
                    }
                }
            })
        },
        [`my-apps-${session.user.id}`],
        {
            tags: ['my-apps'],
            revalidate: 60
        }
    )()
}

/**
 * Get a specific app by ID (if owned by user)
 */
export const getMyApp = async (appId: string) => {
    const session = await getCurrentSession()
    if (!session?.user) {
        throw new Error('Unauthorized')
    }

    return unstable_cache(
        async () => {
            const app = await prisma.app.findUnique({
                where: { id: appId },
                include: {
                    webhooks: true
                }
            })

            if (!app || app.developerId !== session.user.id) {
                return null
            }

            return app
        },
        [`app-${appId}`],
        {
            tags: [`app-${appId}`],
            revalidate: 60
        }
    )()
}

/**
 * Update app details
 */
export async function updateApp(appId: string, data: {
    name?: string
    description?: string
    webhookUrl?: string
    redirectUrl?: string
}) {
    const session = await getCurrentSession()
    if (!session?.user) {
        throw new Error('Unauthorized')
    }

    const app = await prisma.app.findUnique({
        where: { id: appId },
        include: { webhooks: true }
    })

    if (!app || app.developerId !== session.user.id) {
        throw new Error('Unauthorized')
    }

    // Update basic info
    await prisma.app.update({
        where: { id: appId },
        data: {
            name: data.name,
            description: data.description,
        }
    })

    // Update webhook URL if provided
    if (data.webhookUrl) {
        // Update all existing webhooks to the new URL
        await prisma.appWebhook.updateMany({
            where: { appId: app.id },
            data: { targetUrl: data.webhookUrl }
        })

        // If no webhooks exist, create defaults
        const count = await prisma.appWebhook.count({ where: { appId: app.id } })
        if (count === 0) {
            await prisma.appWebhook.createMany({
                data: [
                    { appId: app.id, event: 'app.installed', targetUrl: data.webhookUrl, isActive: true },
                    { appId: app.id, event: 'app.uninstalled', targetUrl: data.webhookUrl, isActive: true }
                ]
            } as any) // Type cast to avoid potential type issues with bulk insert if strict
        }
    }

    revalidateTag(`app-${appId}`)
    revalidatePath(`/developer/apps/${appId}`)
    return { success: true }
}

/**
 * Regenerate webhook secret
 */
export async function regenerateAppSecret(appId: string) {
    const session = await getCurrentSession()
    if (!session?.user) {
        throw new Error('Unauthorized')
    }

    const app = await prisma.app.findUnique({
        where: { id: appId }
    })

    if (!app || app.developerId !== session.user.id) {
        throw new Error('Unauthorized')
    }

    const newSecret = generateSecret()

    await prisma.app.update({
        where: { id: appId },
        data: { webhookSecret: newSecret }
    })

    revalidateTag(`app-${appId}`)
    revalidatePath(`/developer/apps/${appId}`)
    return { success: true, secret: newSecret }
}
