"use server"

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { revalidatePath } from "next/cache"

export async function getSellerReviews() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { success: false, error: "Vendor not found" }
        }

        const reviews = await prisma.review.findMany({
            where: {
                product: {
                    vendorId: vendor.id
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                product: {
                    select: {
                        name: true,
                        thumbnail: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Calculate stats
        const totalReviews = reviews.length
        const averageRating = totalReviews > 0
            ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
            : "0"

        // Note: The current schema doesn't seem to have a 'reply' field in the Review model.
        // Assuming we might need to add it or use a separate table if replies are needed.
        // For now, we'll return pending replies as 0 since we can't track them yet without schema change.
        // If 'reply' field existed: const pendingReplies = reviews.filter(r => !r.reply).length
        const pendingReplies = 0

        return {
            success: true,
            data: {
                reviews,
                stats: {
                    totalReviews,
                    averageRating,
                    pendingReplies
                }
            }
        }
    } catch (error) {
        console.error("Error fetching seller reviews:", error)
        return { success: false, error: "Failed to fetch reviews" }
    }
}

export async function replyToReview(reviewId: string, reply: string) {
    // Placeholder for reply functionality.
    // Requires schema update to store replies (e.g., adding 'reply' field to Review model or a ReviewReply model).
    // For now, we'll just log it.
    console.log(`Replying to review ${reviewId} with: ${reply}`)

    return { success: false, error: "Reply functionality requires schema update" }
}
