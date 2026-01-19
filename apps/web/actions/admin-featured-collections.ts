"use server"

import { prisma } from "@/lib/db"
import { revalidatePath, revalidateTag } from "next/cache"
import { unstable_cache } from "next/cache"

// ============================================================================
// Featured Collections with Caching
// ============================================================================

async function _getAllFeaturedCollections() {
    return prisma.featuredCollection.findMany({
        orderBy: { createdAt: 'asc' },
        include: {
            products: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    currency: true,
                    thumbnail: true,
                }
            }
        }
    })
}

async function _getAvailableProducts() {
    return prisma.product.findMany({
        where: { isActive: true, status: 'PUBLISHED' },
        take: 50,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            thumbnail: true,
            price: true,
            currency: true
        }
    })
}

// Cached version - revalidates every 60 seconds or on tag invalidation
export const getAllFeaturedCollectionsCached = unstable_cache(
    _getAllFeaturedCollections,
    ['featured-collections'],
    { revalidate: 60, tags: ['featured-collections'] }
)

export const getAvailableProductsCached = unstable_cache(
    _getAvailableProducts,
    ['available-products'],
    { revalidate: 60, tags: ['available-products'] }
)

// Export uncached for backward compatibility
export async function getAllFeaturedCollections() {
    return _getAllFeaturedCollections()
}

export async function getAvailableProducts() {
    return _getAvailableProducts()
}

export async function getFeaturedCollection(identifier: string) {
    try {
        const collection = await prisma.featuredCollection.findUnique({
            where: { identifier },
            include: {
                products: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        currency: true,
                        thumbnail: true,
                    }
                }
            }
        })
        return collection
    } catch (error) {
        console.error("Error fetching featured collection:", error)
        return null
    }
}

// ============================================================================
// Ensure Default Collections Exist
// ============================================================================

export async function ensureDefaultCollections() {
    const defaultCollections = [
        { identifier: "holiday-finds", title: "Holiday finds for you" },
        { identifier: "picks-inspired", title: "Picks inspired by your shopping" }
    ]

    for (const { identifier, title } of defaultCollections) {
        const exists = await prisma.featuredCollection.findUnique({
            where: { identifier }
        })
        if (!exists) {
            await prisma.featuredCollection.create({
                data: { identifier, title }
            })
        }
    }
}

// ============================================================================
// Update Featured Collection
// ============================================================================

export async function updateFeaturedCollection(
    identifier: string,
    data: { title: string; productIds: string[] }
) {
    try {
        const existing = await prisma.featuredCollection.findUnique({
            where: { identifier }
        })

        if (!existing) {
            await prisma.featuredCollection.create({
                data: {
                    identifier,
                    title: data.title,
                    products: {
                        connect: data.productIds.map(id => ({ id }))
                    }
                }
            })
        } else {
            await prisma.featuredCollection.update({
                where: { identifier },
                data: {
                    title: data.title,
                    products: {
                        set: data.productIds.map(id => ({ id }))
                    }
                }
            })
        }

        // Invalidate cache
        revalidateTag('featured-collections')
        revalidatePath("/")
        revalidatePath("/admin/featured-collections")

        return { success: true }
    } catch (error) {
        console.error("Error updating featured collection:", error)
        return { success: false, error: "Failed to update collection" }
    }
}

