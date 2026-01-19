'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
// import { auth } from '@/lib/auth' // Assuming auth is configured
import { Role } from '@repo/database'

export async function getAdminUsers() {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: [Role.ADMIN] // Adjust based on your Role enum
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                // canHandleLiveChat: true,
                // canHandleTickets: true,
            }
        })
        return { success: true, data: users }
    } catch (error) {
        console.error('Error fetching admin users:', error)
        return { success: false, error: 'Failed to fetch users' }
    }
}

export async function updateUserPermissions(userId: string, permissions: { canHandleLiveChat?: boolean; canHandleTickets?: boolean }) {
    try {
        // Verify current user is admin (security check)
        // const session = await auth()
        // if (session?.user?.role !== 'ADMIN') return { success: false, error: 'Unauthorized' }

        await prisma.user.update({
            where: { id: userId },
            data: permissions
        })

        revalidatePath('/admin/support/settings/team')
        return { success: true }
    } catch (error) {
        console.error('Error updating permissions:', error)
        return { success: false, error: 'Failed to update permissions' }
    }
}
