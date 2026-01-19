'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

// ============================================================================
// Vendor Application Management
// ================================================================================================================================

export async function getVendorApplicationStatus() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Check if user is already a vendor
        const existingVendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            include: {
                vendorApplication: true
            }
        })

        if (existingVendor) {
            return {
                isVendor: true,
                application: existingVendor.vendorApplication
            }
        }

        return {
            isVendor: false,
            application: null
        }
    } catch (error) {
        console.error('Error getting vendor application status:', error)
        throw new Error('Failed to get application status')
    }
}

export async function submitVendorApplication(data: {
    businessName: string
    description: string
    businessType?: string
    taxId?: string
    phone?: string
    address?: string
    portfolio?: string
    additionalInfo?: string
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Check if user is already a vendor
        const existingVendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id }
        })

        if (existingVendor) {
            return { success: false, error: 'You are already a vendor' }
        }

        // Create vendor record (pending approval)
        const vendor = await prisma.vendor.create({
            data: {
                userId: session.user.id,
                name: data.businessName,
                description: data.description,
                bio: data.additionalInfo,
            }
        })

        // Create vendor application
        await prisma.vendorApplication.create({
            data: {
                vendorId: vendor.id,
                status: 'PENDING',
                notes: JSON.stringify({
                    businessType: data.businessType,
                    taxId: data.taxId,
                    phone: data.phone,
                    address: data.address,
                    portfolio: data.portfolio,
                    additionalInfo: data.additionalInfo,
                    submittedAt: new Date()
                })
            }
        })

        // TODO: Send notification to admins about new vendor application

        revalidatePath('/user/become-seller')
        return { success: true }
    } catch (error) {
        console.error('Error submitting vendor application:', error)
        return { success: false, error: 'Failed to submit application' }
    }
}

export async function updateVendorApplication(data: {
    businessName?: string
    description?: string
    businessType?: string
    taxId?: string
    phone?: string
    address?: string
    portfolio?: string
    additionalInfo?: string
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Get vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            include: { vendorApplication: true }
        })

        if (!vendor) {
            return { success: false, error: 'Not a vendor' }
        }

        if (!vendor.vendorApplication) {
            return { success: false, error: 'No application found' }
        }

        // Only allow updates if application is pending or rejected
        if (vendor.vendorApplication.status === 'APPROVED') {
            return { success: false, error: 'Cannot update approved application' }
        }

        // Update vendor info
        if (data.businessName || data.description || data.additionalInfo) {
            await prisma.vendor.update({
                where: { id: vendor.id },
                data: {
                    name: data.businessName || vendor.name,
                    description: data.description || vendor.description,
                    bio: data.additionalInfo || vendor.bio
                }
            })
        }

        // Update application notes
        const currentNotes = vendor.vendorApplication.notes
            ? JSON.parse(vendor.vendorApplication.notes as string)
            : {}

        const updatedNotes = {
            ...currentNotes,
            ...data,
            lastUpdatedAt: new Date()
        }

        await prisma.vendorApplication.update({
            where: { id: vendor.vendorApplication.id },
            data: {
                status: 'PENDING', // Reset to pending if it was rejected
                notes: JSON.stringify(updatedNotes)
            }
        })

        revalidatePath('/user/become-seller')
        return { success: true }
    } catch (error) {
        console.error('Error updating vendor application:', error)
        return { success: false, error: 'Failed to update application' }
    }
}

export async function cancelVendorApplication() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            include: { vendorApplication: true }
        })

        if (!vendor || !vendor.vendorApplication) {
            return { success: false, error: 'No application found' }
        }

        if (vendor.vendorApplication.status === 'APPROVED') {
            return { success: false, error: 'Cannot cancel approved application' }
        }

        // Delete application and vendor record if not approved
        await prisma.vendorApplication.delete({
            where: { id: vendor.vendorApplication.id }
        })

        await prisma.vendor.delete({
            where: { id: vendor.id }
        })

        revalidatePath('/user/become-seller')
        return { success: true }
    } catch (error) {
        console.error('Error canceling vendor application:', error)
        return { success: false, error: 'Failed to cancel application' }
    }
}
