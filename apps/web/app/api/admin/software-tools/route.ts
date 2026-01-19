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

        const tools = await prisma.softwareTool.findMany({
            include: {
                _count: {
                    select: {
                        vendors: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json({
            tools: tools.map((tool: typeof tools[number]) => ({
                id: tool.id,
                name: tool.name,
                description: tool.description,
                logoUrl: tool.logoUrl,
                category: tool.category,
                isActive: tool.isActive,
                vendorCount: tool._count.vendors,
                createdAt: tool.createdAt
            }))
        })
    } catch (error) {
        console.error('Error fetching software tools:', error)
        return NextResponse.json(
            { error: 'Failed to fetch software tools' },
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
        const { name, description, logoUrl, category } = body

        if (!name || !logoUrl) {
            return NextResponse.json(
                { error: 'Name and logo URL are required' },
                { status: 400 }
            )
        }

        // Check if tool name already exists
        const existing = await prisma.softwareTool.findUnique({
            where: { name }
        })

        if (existing) {
            return NextResponse.json(
                { error: 'Software tool with this name already exists' },
                { status: 400 }
            )
        }

        const tool = await prisma.softwareTool.create({
            data: {
                name,
                description: description || null,
                logoUrl,
                category: category || null,
                isActive: true
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Software tool created successfully',
            tool: {
                id: tool.id,
                name: tool.name,
                description: tool.description,
                logoUrl: tool.logoUrl,
                category: tool.category,
                isActive: tool.isActive
            }
        })
    } catch (error) {
        console.error('Error creating software tool:', error)
        return NextResponse.json(
            { error: 'Failed to create software tool' },
            { status: 500 }
        )
    }
}

