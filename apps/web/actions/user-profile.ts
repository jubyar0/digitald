'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import bcrypt from 'bcryptjs'

// ============================================================================
// User Profile Management
// ============================================================================

export async function getUserProfile() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        if (!user) {
            throw new Error('User not found')
        }

        return user
    } catch (error) {
        console.error('Error fetching user profile:', error)
        throw new Error('Failed to fetch user profile')
    }
}

export async function updateUserProfile(data: {
    name?: string
    email?: string
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Check if email is being changed and if it's already taken
        if (data.email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: data.email,
                    NOT: { id: session.user.id }
                }
            })

            if (existingUser) {
                return { success: false, error: 'Email already in use' }
            }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                email: data.email,
            }
        })

        revalidatePath('/user/profile')
        return { success: true }
    } catch (error) {
        console.error('Error updating user profile:', error)
        return { success: false, error: 'Failed to update profile' }
    }
}

export async function updateProfileImage(imageUrl: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: imageUrl }
        })

        revalidatePath('/user/profile')
        return { success: true }
    } catch (error) {
        console.error('Error updating profile image:', error)
        return { success: false, error: 'Failed to update profile image' }
    }
}

export async function changePassword(currentPassword: string, newPassword: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true }
        })

        if (!user || !user.password) {
            return { success: false, error: 'Cannot change password for this account type' }
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password)
        if (!isValid) {
            return { success: false, error: 'Current password is incorrect' }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        })

        return { success: true }
    } catch (error) {
        console.error('Error changing password:', error)
        return { success: false, error: 'Failed to change password' }
    }
}

// ============================================================================
// User Statistics
// ============================================================================

export async function getUserStats() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const [totalOrders, totalSpent, wishlistCount, cartCount] = await Promise.all([
            prisma.order.count({
                where: { userId: session.user.id }
            }),
            prisma.order.aggregate({
                where: {
                    userId: session.user.id,
                    status: 'COMPLETED'
                },
                _sum: { totalAmount: true }
            }),
            prisma.wishlist.count({
                where: { userId: session.user.id }
            }),
            prisma.cart.findUnique({
                where: { userId: session.user.id },
                include: {
                    _count: {
                        select: { items: true }
                    }
                }
            })
        ])

        return {
            totalOrders,
            totalSpent: totalSpent._sum.totalAmount || 0,
            wishlistCount,
            cartItemsCount: cartCount?._count.items || 0
        }
    } catch (error) {
        console.error('Error fetching user stats:', error)
        throw new Error('Failed to fetch user stats')
    }
}
