import { NextRequest, NextResponse } from 'next/server';
import { PaymentService, processSuccessfulPayment } from '@/lib/payment';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@repo/database';

export async function POST(req: NextRequest) {
    try {
        const provider = PaymentService.getProvider('PAYPAL');
        const event = await provider.handleWebhook(req);

        if (event.paymentStatus === 'COMPLETED' && event.orderId) {
            await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                // Update Payment
                const payment = await tx.payment.update({
                    where: { orderId: event.orderId },
                    data: {
                        status: 'COMPLETED',
                        transactionId: event.eventId, // PayPal Order ID
                        metadata: event.payload,
                    },
                    include: {
                        order: {
                            select: { userId: true }
                        }
                    }
                });

                // Update Order
                await tx.order.update({
                    where: { id: event.orderId },
                    data: { status: 'COMPLETED' },
                });

                // Process payment (commissions, escrow, etc.)
                await processSuccessfulPayment(
                    tx,
                    event.orderId!,
                    payment.id,
                    payment.amount,
                    payment.currency,
                    payment.order.userId
                );
            });
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('PayPal webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
