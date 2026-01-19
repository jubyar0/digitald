import { prisma, Prisma } from '@repo/database';

export async function processSuccessfulPayment(
    tx: Prisma.TransactionClient,
    orderId: string,
    paymentId: string,
    amount: number,
    currency: string,
    userId: string
) {
    // 1. Get Order to find Vendor
    const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { vendor: true },
    });

    if (!order) {
        throw new Error(`Order ${orderId} not found`);
    }

    // 2. Calculate Commission (5% platform fee)
    const platformFeePercent = 0.05; // 5%
    const platformFee = amount * platformFeePercent;
    const sellerEarnings = amount - platformFee;

    // 3. Log Platform Commission
    await tx.transaction.create({
        data: {
            type: 'COMMISSION_PLATFORM',
            amount: platformFee,
            currency: currency,
            status: 'COMPLETED',
            referenceId: orderId,
            description: `Platform fee for Order #${orderId}`,
        },
    });

    // 4. Log Seller Commission
    await tx.transaction.create({
        data: {
            type: 'COMMISSION_SELLER',
            amount: sellerEarnings,
            currency: currency,
            status: 'COMPLETED',
            referenceId: orderId,
            userId: order.vendor.userId, // Vendor's User ID
            description: `Earnings from Order #${orderId}`,
        },
    });

    // 5. Update Vendor Escrow/Balance
    // Check if EscrowAccount exists for vendor
    let escrow = await tx.escrowAccount.findUnique({
        where: { vendorId: order.vendorId },
    });

    if (!escrow) {
        escrow = await tx.escrowAccount.create({
            data: {
                vendorId: order.vendorId,
                balance: 0,
                currency: currency,
            },
        });
    }

    await tx.escrowAccount.update({
        where: { id: escrow.id },
        data: {
            balance: { increment: sellerEarnings },
        },
    });

    // 6. Create Escrow Transaction
    await tx.escrowTransaction.create({
        data: {
            escrowAccountId: escrow.id,
            orderId: orderId,
            amount: sellerEarnings,
            type: 'DEPOSIT', // Assuming DEPOSIT enum exists or similar
            status: 'COMPLETED', // Assuming COMPLETED enum exists
            description: `Earnings from Order #${orderId}`,
        },
    });
}
