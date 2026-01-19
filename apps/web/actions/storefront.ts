'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { revalidatePath } from "next/cache"

export async function getStorefrontSettings() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: {
                id: true,
                name: true,
                bio: true,
                avatar: true,
                coverImage: true,
            }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        return vendor
    } catch (error) {
        console.error('Error fetching storefront settings:', error)
        return null
    }
}

export async function updateStorefrontSettings(data: {
    name?: string
    bio?: string
    themeColor?: string
    featuredLayout?: string
    avatar?: string
    coverImage?: string
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        await prisma.vendor.update({
            where: { id: vendor.id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        })

        revalidatePath('/seller/settings/storefront')
        return { success: true }
    } catch (error) {
        console.error('Error updating storefront settings:', error)
        return { success: false, error: 'Failed to update settings' }
    }
}
