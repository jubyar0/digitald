import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'
import { VendorSoftwareTool } from '@repo/database'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        console.log('PUT /api/profile: Session user:', session?.user)

        if (!session || (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN')) {
            console.log('PUT /api/profile: Unauthorized - Role:', session?.user?.role)
            return NextResponse.json(
                { error: 'Unauthorized. Vendor or Admin access required.' },
                { status: 401 }
            )
        }

        const body = await request.json()
        console.log('PUT /api/profile: Received body', body)

        const {
            bio,
            specializations,
            location,
            avatar,
            coverImage,
            socialLinks
        } = body

        // Find or create vendor for current user
        let vendor = await prisma.vendor.findUnique({
            where: {
                userId: session.user.id
            }
        })

        if (!vendor) {
            // Auto-create vendor profile if it doesn't exist
            vendor = await prisma.vendor.create({
                data: {
                    userId: session.user.id,
                    name: session.user.name || 'Unnamed Vendor',
                    description: '',
                    bio: bio || '',
                    specializations: specializations || [],
                    location: location || '',
                    avatar: avatar || '',
                    coverImage: coverImage || '',
                    socialLinks: socialLinks || {},
                    isVerified: false,
                    averageRating: 0,
                    totalReviews: 0,
                    totalFollowers: 0,
                    totalSales: 0
                }
            })
        }

        // Update vendor profile
        const updatedVendor = await prisma.vendor.update({
            where: {
                id: vendor.id
            },
            data: {
                bio: bio !== undefined ? bio : vendor.bio,
                specializations: specializations !== undefined ? specializations : vendor.specializations,
                location: location !== undefined ? location : vendor.location,
                avatar: avatar !== undefined ? avatar : vendor.avatar,
                coverImage: coverImage !== undefined ? coverImage : vendor.coverImage,
                socialLinks: socialLinks !== undefined ? socialLinks : vendor.socialLinks,
                updatedAt: new Date()
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            vendor: {
                id: updatedVendor.id,
                bio: updatedVendor.bio,
                specializations: updatedVendor.specializations,
                location: updatedVendor.location,
                avatar: updatedVendor.avatar,
                coverImage: updatedVendor.coverImage,
                socialLinks: updatedVendor.socialLinks
            }
        })
    } catch (error) {
        console.error('Error updating profile:', error)
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined
        })
        return NextResponse.json(
            {
                error: 'Failed to update profile',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        console.log('GET /api/profile: Session user:', session?.user)

        if (!session || (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN')) {
            console.log('GET /api/profile: Unauthorized - Role:', session?.user?.role)
            return NextResponse.json(
                { error: 'Unauthorized. Vendor or Admin access required.' },
                { status: 401 }
            )
        }

        // Find or create vendor for current user
        let vendor = await prisma.vendor.findUnique({
            where: {
                userId: session.user.id
            },
            include: {
                softwareTools: {
                    include: {
                        softwareTool: true
                    }
                }
            }
        })

        if (!vendor) {
            // Auto-create vendor profile if it doesn't exist
            vendor = await prisma.vendor.create({
                data: {
                    userId: session.user.id,
                    name: session.user.name || 'Unnamed Vendor',
                    description: '',
                    bio: '',
                    specializations: [],
                    location: '',
                    avatar: '',
                    coverImage: '',
                    socialLinks: {},
                    isVerified: false,
                    averageRating: 0,
                    totalReviews: 0,
                    totalFollowers: 0,
                    totalSales: 0
                },
                include: {
                    softwareTools: {
                        include: {
                            softwareTool: true
                        }
                    }
                }
            })
        }

        return NextResponse.json({
            id: vendor.id,
            name: vendor.name,
            description: vendor.description,
            bio: vendor.bio,
            specializations: vendor.specializations,
            location: vendor.location,
            avatar: vendor.avatar,
            coverImage: vendor.coverImage,
            socialLinks: vendor.socialLinks,
            selectedSoftwareTools: vendor.softwareTools.map((vst: VendorSoftwareTool) => vst.softwareToolId)
        })
    } catch (error) {
        console.error('Error fetching profile:', error)

        try {
            // Log error to file system if possible
            import('fs').then(fs => {
                import('path').then(path => {
                    const logFile = path.join(process.cwd(), 'server-error.log');
                    const errorLog = `${new Date().toISOString()} - GET /api/profile Error: ${error instanceof Error ? error.message : 'Unknown'}\nStack: ${error instanceof Error ? error.stack : ''}\n\n`;
                    fs.appendFileSync(logFile, errorLog);
                });
            }).catch(e => console.error('Failed to write to log file:', e));
        } catch (e) {
            console.error('Failed to write to log file:', e);
        }

        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined
        })
        return NextResponse.json(
            {
                error: 'Failed to fetch profile',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

