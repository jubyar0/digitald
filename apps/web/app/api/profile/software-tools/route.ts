import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        console.log('PUT /api/profile/software-tools: Session user:', session?.user)

        if (!session || (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN')) {
            console.log('PUT /api/profile/software-tools: Unauthorized - Role:', session?.user?.role)
            return NextResponse.json(
                { error: 'Unauthorized. Vendor or Admin access required.' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { softwareToolIds } = body

        if (!Array.isArray(softwareToolIds)) {
            return NextResponse.json(
                { error: 'softwareToolIds must be an array' },
                { status: 400 }
            )
        }

        // Find vendor for current user
        const vendor = await prisma.vendor.findUnique({
            where: {
                userId: session.user.id
            }
        })

        if (!vendor) {
            return NextResponse.json(
                { error: 'Vendor profile not found' },
                { status: 404 }
            )
        }

        // Delete existing software tool associations
        await prisma.vendorSoftwareTool.deleteMany({
            where: {
                vendorId: vendor.id
            }
        })

        // Create new associations
        if (softwareToolIds.length > 0) {
            await prisma.vendorSoftwareTool.createMany({
                data: softwareToolIds.map((toolId: string) => ({
                    vendorId: vendor.id,
                    softwareToolId: toolId
                })),
                skipDuplicates: true
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Software tools updated successfully'
        })
    } catch (error) {
        console.error('Error updating software tools:', error)
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined
        })
        return NextResponse.json(
            {
                error: 'Failed to update software tools',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

