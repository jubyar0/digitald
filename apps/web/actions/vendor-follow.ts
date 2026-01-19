'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

// ============================================================================
// Vendor Follow Actions
// ============================================================================

/**
 * Follow a vendor/shop
 */
export async function followVendor(vendorId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized. Please login to follow shops." }
        }

        // Check if vendor exists
        const vendor = await prisma.vendor.findUnique({
            where: { id: vendorId }
        })

        if (!vendor) {
            return { success: false, error: "Shop not found" }
        }

        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: vendorId
                }
            }
        })

        if (existingFollow) {
            return { success: true, message: "Already following this shop", isFollowing: true }
        }

        // Create follow relationship
        await prisma.follow.create({
            data: {
                followerId: session.user.id,
                followingId: vendorId
            }
        })

        // Update vendor follower count
        await prisma.vendor.update({
            where: { id: vendorId },
            data: { totalFollowers: { increment: 1 } }
        })

        revalidatePath(`/shop/${vendorId}`)
        return { success: true, message: "Now following this shop!", isFollowing: true }
    } catch (error) {
        console.error("Error following vendor:", error)
        return { success: false, error: "Failed to follow shop. Please try again." }
    }
}

/**
 * Unfollow a vendor/shop
 */
export async function unfollowVendor(vendorId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized. Please login." }
        }

        // Find and delete the follow relationship
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: vendorId
                }
            }
        })

        if (!follow) {
            return { success: true, message: "Not following this shop", isFollowing: false }
        }

        await prisma.follow.delete({
            where: { id: follow.id }
        })

        // Update vendor follower count
        await prisma.vendor.update({
            where: { id: vendorId },
            data: { totalFollowers: { decrement: 1 } }
        })

        revalidatePath(`/shop/${vendorId}`)
        return { success: true, message: "Unfollowed this shop", isFollowing: false }
    } catch (error) {
        console.error("Error unfollowing vendor:", error)
        return { success: false, error: "Failed to unfollow shop. Please try again." }
    }
}

/**
 * Check if current user is following a vendor
 */
export async function isFollowingVendor(vendorId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { isFollowing: false }
        }

        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: vendorId
                }
            }
        })

        return { isFollowing: !!follow }
    } catch (error) {
        console.error("Error checking follow status:", error)
        return { isFollowing: false }
    }
}

/**
 * Get follower count for a vendor
 */
export async function getFollowerCount(vendorId: string) {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: { id: vendorId },
            select: { totalFollowers: true }
        })

        return { count: vendor?.totalFollowers || 0 }
    } catch (error) {
        console.error("Error getting follower count:", error)
        return { count: 0 }
    }
}

/**
 * Toggle follow status for a vendor
 */
export async function toggleFollowVendor(vendorId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized. Please login to follow shops." }
        }

        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: vendorId
                }
            }
        })

        if (existingFollow) {
            return unfollowVendor(vendorId)
        } else {
            return followVendor(vendorId)
        }
    } catch (error) {
        console.error("Error toggling follow:", error)
        return { success: false, error: "Failed to update follow status." }
    }
}
