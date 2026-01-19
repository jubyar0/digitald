'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { verifyPassword } from '@/actions/user-security'
import crypto from 'crypto'

// ============================================================================
// Encryption utilities for payment details
// ============================================================================

const ENCRYPTION_KEY = process.env.PAYMENT_ENCRYPTION_KEY || 'default-key-please-change-in-production'
const ALGORITHM = 'aes-256-cbc'

function encrypt(text: string): string {
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return iv.toString('hex') + ':' + encrypted
}

function decrypt(text: string): string {
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
    const parts = text.split(':')
    const iv = Buffer.from(parts[0], 'hex')
    const encrypted = parts[1]
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

// ============================================================================
// Payment Methods Management
// Note: This uses VendorPayoutMethod for sellers. For customer payment methods,
// the payment is handled during checkout via payment gateways.
// ============================================================================

interface PaymentMethodDetails {
    cardNumber?: string
    accountNumber?: string
    [key: string]: string | undefined
}

interface PaymentMethod {
    id: string
    type: string
    label: string
    details: PaymentMethodDetails
    isDefault: boolean
    createdAt: Date
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Check if user is a vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id }
        })

        if (!vendor) {
            // User is not a vendor, return empty array
            return []
        }

        const methods = await prisma.vendorPayoutMethod.findMany({
            where: {
                vendorId: vendor.id,
                isActive: true
            },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ]
        })

        // Decrypt and mask payment details for display
        const results: PaymentMethod[] = []
        for (const method of methods) {
            try {
                const details = JSON.parse(decrypt(method.details as string)) as PaymentMethodDetails

                // Mask sensitive information
                const maskedDetails: PaymentMethodDetails = { ...details }
                if (details.cardNumber) {
                    maskedDetails.cardNumber = '**** **** **** ' + details.cardNumber.slice(-4)
                }
                if (details.accountNumber) {
                    maskedDetails.accountNumber = '****' + details.accountNumber.slice(-4)
                }

                results.push({
                    id: method.id,
                    type: method.type as string,
                    label: method.label,
                    details: maskedDetails,
                    isDefault: method.isDefault,
                    createdAt: method.createdAt
                })
            } catch (error) {
                console.error('Error decrypting payment method:', error)
            }
        }
        return results
    } catch (error) {
        console.error('Error getting payment methods:', error)
        throw new Error('Failed to get payment methods')
    }
}

export async function addPaymentMethod(
    password: string,
    type: string,
    label: string,
    details: Record<string, string>
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Verify password for this sensitive operation
        const passwordCheck = await verifyPassword(password)
        if (!passwordCheck.success) {
            return { success: false, error: 'Incorrect password' }
        }

        // Check if user is a vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id }
        })

        if (!vendor) {
            return { success: false, error: 'Only vendors can add payment methods' }
        }

        // Encrypt payment details
        const encryptedDetails = encrypt(JSON.stringify(details))

        await prisma.vendorPayoutMethod.create({
            data: {
                vendorId: vendor.id,
                type: type as any,
                label,
                details: encryptedDetails,
                isDefault: false
            }
        })

        revalidatePath('/user/payment-methods')
        return { success: true }
    } catch (error) {
        console.error('Error adding payment method:', error)
        return { success: false, error: 'Failed to add payment method' }
    }
}

export async function setDefaultPaymentMethod(methodId: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Check if user is a vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id }
        })

        if (!vendor) {
            return { success: false, error: 'Only vendors can manage payment methods' }
        }

        // Verify ownership
        const method = await prisma.vendorPayoutMethod.findFirst({
            where: {
                id: methodId,
                vendorId: vendor.id
            }
        })

        if (!method) {
            return { success: false, error: 'Payment method not found' }
        }

        // Remove default from all other methods
        await prisma.vendorPayoutMethod.updateMany({
            where: { vendorId: vendor.id },
            data: { isDefault: false }
        })

        // Set this method as default
        await prisma.vendorPayoutMethod.update({
            where: { id: methodId },
            data: { isDefault: true }
        })

        revalidatePath('/user/payment-methods')
        return { success: true }
    } catch (error) {
        console.error('Error setting default payment method:', error)
        return { success: false, error: 'Failed to set default payment method' }
    }
}

export async function deletePaymentMethod(methodId: string, password: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Verify password
        const passwordCheck = await verifyPassword(password)
        if (!passwordCheck.success) {
            return { success: false, error: 'Incorrect password' }
        }

        // Check if user is a vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id }
        })

        if (!vendor) {
            return { success: false, error: 'Only vendors can manage payment methods' }
        }

        // Verify ownership
        const method = await prisma.vendorPayoutMethod.findFirst({
            where: {
                id: methodId,
                vendorId: vendor.id
            }
        })

        if (!method) {
            return { success: false, error: 'Payment method not found' }
        }

        await prisma.vendorPayoutMethod.delete({
            where: { id: methodId }
        })

        revalidatePath('/user/payment-methods')
        return { success: true }
    } catch (error) {
        console.error('Error deleting payment method:', error)
        return { success: false, error: 'Failed to delete payment method' }
    }
}

export async function updatePaymentMethod(
    methodId: string,
    password: string,
    label?: string,
    details?: Record<string, string>
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            throw new Error('Unauthorized')
        }

        // Verify password
        const passwordCheck = await verifyPassword(password)
        if (!passwordCheck.success) {
            return { success: false, error: 'Incorrect password' }
        }

        // Check if user is a vendor
        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id }
        })

        if (!vendor) {
            return { success: false, error: 'Only vendors can manage payment methods' }
        }

        // Verify ownership
        const method = await prisma.vendorPayoutMethod.findFirst({
            where: {
                id: methodId,
                vendorId: vendor.id
            }
        })

        if (!method) {
            return { success: false, error: 'Payment method not found' }
        }

        const updateData: { label?: string; details?: string } = {}
        if (label) updateData.label = label
        if (details) updateData.details = encrypt(JSON.stringify(details))

        await prisma.vendorPayoutMethod.update({
            where: { id: methodId },
            data: updateData
        })

        revalidatePath('/user/payment-methods')
        return { success: true }
    } catch (error) {
        console.error('Error updating payment method:', error)
        return { success: false, error: 'Failed to update payment method' }
    }
}
