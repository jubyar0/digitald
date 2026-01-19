import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const tools = await prisma.softwareTool.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                name: 'asc'
            },
            select: {
                id: true,
                name: true,
                description: true,
                logoUrl: true,
                category: true
            }
        })

        return NextResponse.json({
            tools
        })
    } catch (error) {
        console.error('Error fetching software tools:', error)
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined
        })
        return NextResponse.json(
            {
                error: 'Failed to fetch software tools',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
