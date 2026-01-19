'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { revalidatePath } from 'next/cache'

/**
 * Get all collections (public)
 */
export async function getCollections(includeInactive = false) {
    try {
        const collections = await prisma.collection.findMany({
            where: includeInactive ? {} : { isActive: true },
            include: {
                categories: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                    },
                },
                _count: {
                    select: {
                        categories: true,
                    },
                },
            },
            orderBy: { order: 'asc' },
        })

        return collections
    } catch (error) {
        console.error('Error fetching collections:', error)
        return []
    }
}

/**
 * Get single collection by slug
 */
export async function getCollectionBySlug(slug: string) {
    try {
        const collection = await prisma.collection.findUnique({
            where: { slug },
            include: {
                categories: {
                    where: { isActive: true },
                    include: {
                        _count: {
                            select: {
                                products: true,
                            },
                        },
                    },
                },
            },
        })

        return collection
    } catch (error) {
        console.error('Error fetching collection:', error)
        return null
    }
}

/**
 * Create new collection (Admin only)
 */
export async function createCollection(data: {
    name: string
    slug: string
    description?: string
    icon?: string
    image?: string
    order?: number
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized: Admin access required')
        }

        const collection = await prisma.collection.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                icon: data.icon,
                image: data.image,
                order: data.order ?? 0,
            },
        })

        revalidatePath('/admin/collections')
        revalidatePath('/collections')
        return { success: true, collection }
    } catch (error) {
        console.error('Error creating collection:', error)
        return { success: false, error: 'Failed to create collection' }
    }
}

/**
 * Update collection (Admin only)
 */
export async function updateCollection(
    id: string,
    data: {
        name?: string
        slug?: string
        description?: string
        icon?: string
        image?: string
        order?: number
        isActive?: boolean
    }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized: Admin access required')
        }

        const collection = await prisma.collection.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        })

        revalidatePath('/admin/collections')
        revalidatePath('/collections')
        return { success: true, collection }
    } catch (error) {
        console.error('Error updating collection:', error)
        return { success: false, error: 'Failed to update collection' }
    }
}

/**
 * Delete collection (Admin only)
 */
export async function deleteCollection(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized: Admin access required')
        }

        // Check if collection has categories
        const collection = await prisma.collection.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { categories: true },
                },
            },
        })

        if (collection && collection._count.categories > 0) {
            return {
                success: false,
                error: 'Cannot delete collection with existing categories',
            }
        }

        await prisma.collection.delete({
            where: { id },
        })

        revalidatePath('/admin/collections')
        revalidatePath('/collections')
        return { success: true }
    } catch (error) {
        console.error('Error deleting collection:', error)
        return { success: false, error: 'Failed to delete collection' }
    }
}

/**
 * Reorder collections (Admin only)
 */
export async function reorderCollections(collectionIds: string[]) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized: Admin access required')
        }

        // Update order for each collection
        await Promise.all(
            collectionIds.map((id, index) =>
                prisma.collection.update({
                    where: { id },
                    data: { order: index },
                })
            )
        )

        revalidatePath('/admin/collections')
        revalidatePath('/collections')
        return { success: true }
    } catch (error) {
        console.error('Error reordering collections:', error)
        return { success: false, error: 'Failed to reorder collections' }
    }
}
