'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { revalidatePath } from 'next/cache'
import { ProductStatus } from '@repo/database'
import { triggerAppEvent } from '@/lib/webhook-service'

/**
 * Get vendor's own products
 */
export async function getMyProducts(filters?: {
    status?: ProductStatus
    categoryId?: string
    collectionId?: string
    search?: string
    page?: number
    limit?: number
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Get vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        const where: any = {
            vendorId: vendor.id,
        }

        if (filters?.status) {
            where.status = filters.status
        }

        if (filters?.categoryId) {
            where.categoryId = filters.categoryId
        }

        if (filters?.collectionId) {
            where.category = {
                collectionId: filters.collectionId,
            }
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ]
        }

        const page = filters?.page || 1
        const limit = filters?.limit || 10
        const skip = (page - 1) * limit

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: {
                        include: {
                            collection: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            reviews: true,
                            orders: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.product.count({ where })
        ])

        return { products, total }
    } catch (error) {
        console.error('Error fetching vendor products:', error)
        return { products: [], total: 0 }
    }
}

/**
 * Create new product (Vendor only)
 */
export async function createMyProduct(data: {
    name: string
    description: string
    price: number
    categoryId: string
    fileUrl: string
    thumbnail?: string
    images?: string[]
    status?: ProductStatus
    assetDetails?: string
    includedResolution?: string
    availableResolutions?: string
    height?: number
    width?: number
    depth?: number
    meshCount?: number
    // New 3D Technical Fields
    polygonCount?: number
    verticesCount?: number
    geometryType?: string
    isRigged?: boolean
    isAnimated?: boolean
    hasLOD?: boolean
    lodLevels?: number
    softwareCompatibility?: any
    renderEngine?: string
    materialType?: string
    textureFiles?: any
    nativeFileFormats?: any
    universalFileFormats?: any
    addonSupport?: any
    licenseInfo?: any
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Get vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        const product = await prisma.product.create({
            data: {
                ...data,
                vendorId: vendor.id,
                status: data.status || ProductStatus.PENDING,
                isActive: data.status === ProductStatus.PUBLISHED,
                isDraft: data.status === ProductStatus.DRAFT,
                images: data.images || [],
            },
        })

        revalidatePath('/seller/products')
        return { success: true, product }
    } catch (error) {
        console.error('Error creating product:', error)
        return { success: false, error: 'Failed to create product' }
    }
}

/**
 * Update vendor's own product
 */
export async function updateMyProduct(
    productId: string,
    data: {
        name?: string
        description?: string
        price?: number
        categoryId?: string
        fileUrl?: string
        thumbnail?: string
        images?: string[]
        status?: ProductStatus
        isActive?: boolean
        isDraft?: boolean
        assetDetails?: string
        includedResolution?: string
        availableResolutions?: string
        height?: number
        width?: number
        depth?: number
        meshCount?: number
        // New 3D Technical Fields
        polygonCount?: number
        verticesCount?: number
        geometryType?: string
        isRigged?: boolean
        isAnimated?: boolean
        hasLOD?: boolean
        lodLevels?: number
        softwareCompatibility?: any
        renderEngine?: string
        materialType?: string
        textureFiles?: any
        nativeFileFormats?: any
        universalFileFormats?: any
        addonSupport?: any
        licenseInfo?: any
    }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Get vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Verify ownership
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId },
            select: { vendorId: true },
        })

        if (!existingProduct || existingProduct.vendorId !== vendor.id) {
            throw new Error('Unauthorized: You can only edit your own products')
        }

        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                ...data,
                ...(data.status && {
                    status: data.status,
                    isActive: data.status === ProductStatus.PUBLISHED,
                    isDraft: data.status === ProductStatus.DRAFT,
                }),
                updatedAt: new Date(),
            },
        })

        // Trigger webhook
        triggerAppEvent("product.updated", product, vendor.id).catch(console.error)

        revalidatePath('/seller/products')
        return { success: true, product }
    } catch (error) {
        console.error('Error updating product:', error)
        return { success: false, error: 'Failed to update product' }
    }
}

/**
 * Delete vendor's own product
 */
export async function deleteMyProduct(productId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Get vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        // Verify ownership
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId },
            select: { vendorId: true },
        })

        if (!existingProduct || existingProduct.vendorId !== vendor.id) {
            throw new Error('Unauthorized: You can only delete your own products')
        }

        await prisma.product.delete({
            where: { id: productId },
        })

        revalidatePath('/seller/products')
        return { success: true }
    } catch (error) {
        console.error('Error deleting product:', error)
        return { success: false, error: 'Failed to delete product' }
    }
}

/**
 * Get categories for product creation (optionally filtered by collection)
 */
export async function getProductCategories(collectionId?: string) {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true,
                ...(collectionId && { collectionId }),
            },
            include: {
                collection: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        })

        return categories
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

/**
 * Get inventory statistics
 */
export async function getInventoryStats() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Get vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        const [
            totalProducts,
            activeProducts,
            draftProducts,
            pendingProducts,
            totalValue
        ] = await Promise.all([
            prisma.product.count({ where: { vendorId: vendor.id } }),
            prisma.product.count({ where: { vendorId: vendor.id, status: 'PUBLISHED' } }),
            prisma.product.count({ where: { vendorId: vendor.id, isDraft: true } }),
            prisma.product.count({ where: { vendorId: vendor.id, status: 'PENDING' } }),
            prisma.product.aggregate({
                where: { vendorId: vendor.id },
                _sum: { price: true }
            })
        ])

        return {
            totalProducts,
            activeProducts,
            draftProducts,
            pendingProducts,
            totalValue: totalValue._sum.price || 0,
            lowStock: 0 // Placeholder
        }
    } catch (error) {
        console.error('Error fetching inventory stats:', error)
        return {
            totalProducts: 0,
            activeProducts: 0,
            draftProducts: 0,
            pendingProducts: 0,
            totalValue: 0,
            lowStock: 0
        }
    }
}

/**
 * Get single product for editing (Vendor only)
 */
export async function getMyProduct(productId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Get vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        })

        if (!vendor) {
            throw new Error('Vendor not found')
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                category: true,
            }
        })

        if (!product || product.vendorId !== vendor.id) {
            return null
        }

        return product
    } catch (error) {
        console.error('Error fetching product:', error)
        return null
    }
}
