import { PaymentsClient } from "./payments-client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { prisma } from "@/lib/db"

export const dynamic = 'force-dynamic'

async function getPaymentData() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { balance: { available: 0, pending: 0, currency: 'USD' } }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { balance: { available: 0, pending: 0, currency: 'USD' } }
        }

        // Get escrow account balance
        const escrowAccount = await prisma.escrowAccount.findUnique({
            where: { vendorId: vendor.id },
            select: {
                balance: true,
                availableBalance: true,
                currency: true
            }
        })

        // Get pending earnings from completed orders not yet released
        const pendingEarnings = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId: session.user.id,
                type: 'COMMISSION_SELLER',
                status: 'PENDING'
            }
        })

        return {
            balance: {
                available: escrowAccount?.availableBalance || 0,
                pending: pendingEarnings._sum.amount || escrowAccount?.balance || 0,
                currency: escrowAccount?.currency || 'USD'
            }
        }
    } catch (error) {
        console.error('Error fetching payment data:', error)
        return { balance: { available: 0, pending: 0, currency: 'USD' } }
    }
}

export default async function PaymentsPage() {
    const paymentData = await getPaymentData()

    return (
        <PaymentsClient
            balance={paymentData.balance}
        />
    )
}
