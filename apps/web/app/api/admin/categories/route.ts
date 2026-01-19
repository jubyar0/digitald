import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')

        const where: any = {}
        if (search) {
            where.name = { contains: search, mode: 'insensitive' }
        }

        const categories = await prisma.category.findMany({
            where,
            include: {
                parent: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(categories)
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, slug, parentId, isActive } = body

        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Name and slug are required' },
                { status: 400 }
            )
        }

        // Check if category with same slug exists
        const existing = await prisma.category.findUnique({
            where: { slug }
        })

        if (existing) {
            return NextResponse.json(
                { error: 'Category with this slug already exists' },
                { status: 400 }
            )
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                parentId: parentId || null,
                isActive: isActive !== undefined ? isActive : true,
            },
            include: {
                parent: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        products: true,
                    },
                },
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Category created successfully',
            category
        })
    } catch (error) {
        console.error('Error creating category:', error)
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        )
    }
}
