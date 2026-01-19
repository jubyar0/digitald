import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        // Find vendor by ID (vendor ID or user ID)
        const vendor = await prisma.vendor.findFirst({
            where: {
                OR: [
                    { id: id },
                    { userId: id },
                    { user: { email: { contains: id } } },
                    { name: { contains: id, mode: 'insensitive' } }
                ]
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true
                    }
                },
                badges: {
                    where: {
                        badge: {
                            isActive: true
                        }
                    },
                    include: {
                        badge: true
                    }
                },
                softwareTools: {
                    include: {
                        softwareTool: true
                    }
                },
                products: {
                    where: {
                        status: 'PUBLISHED',
                        isActive: true
                    },
                    select: {
                        id: true
                    }
                },
                followers: {
                    select: {
                        id: true
                    }
                },
                sellerReviews: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 10,
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                orders: {
                    where: {
                        status: 'COMPLETED'
                    },
                    select: {
                        id: true,
                        totalAmount: true
                    }
                }
            }
        })

        if (!vendor) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            )
        }

        // Calculate statistics
        const stats = {
            products: vendor.products.length,
            followers: vendor.totalFollowers,
            sales: vendor.orders.length,
            rating: vendor.averageRating,
            reviews: vendor.totalReviews,
            totalRevenue: vendor.orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0)
        }

        // Format response
        const profile = {
            id: vendor.id,
            name: vendor.name,
            username: vendor.user.email?.split('@')[0] || vendor.name,
            description: vendor.description,
            bio: vendor.bio,
            specializations: vendor.specializations as string[] || [],
            location: vendor.location,
            avatar: vendor.avatar,
            coverImage: vendor.coverImage,
            socialLinks: vendor.socialLinks as Record<string, string> || {},
            joinedDate: vendor.createdAt,
            isVerified: vendor.isVerified,
            stats,
            badges: vendor.badges.map((vb: any) => ({
                id: vb.badge.id,
                name: vb.badge.name,
                description: vb.badge.description,
                icon: vb.badge.icon,
                color: vb.badge.color,
                assignedAt: vb.assignedAt
            })),
            softwareTools: vendor.softwareTools
                .filter((vst: any) => vst.softwareTool && vst.softwareTool.isActive)
                .map((vst: any) => ({
                    id: vst.softwareTool.id,
                    name: vst.softwareTool.name,
                    description: vst.softwareTool.description,
                    logoUrl: vst.softwareTool.logoUrl,
                    category: vst.softwareTool.category
                })),
            reviews: vendor.sellerReviews.map((review: any) => ({
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
                user: {
                    name: review.user.name || 'Anonymous',
                    avatar: null
                }
            }))
        }

        return NextResponse.json(profile)
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}
