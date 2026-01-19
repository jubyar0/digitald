import { PaymentProvider, CreatePaymentParams, PaymentResult, PaymentStatus } from './types';
import Stripe from 'stripe';

export class StripeProvider implements PaymentProvider {
    private stripe: Stripe;

    constructor(apiKey: string) {
        this.stripe = new Stripe(apiKey, {
            apiVersion: '2023-10-16', // Use compatible version
        });
    }

    async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: params.currency,
                        product_data: {
                            name: `Order #${params.orderId}`,
                        },
                        unit_amount: Math.round(params.amount * 100), // Stripe uses cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failed`,
            metadata: {
                orderId: params.orderId,
                ...params.metadata,
            },
            customer_email: params.customerEmail,
        });

        return {
            id: session.id,
            status: 'PENDING',
            amount: params.amount,
            currency: params.currency,
            approvalUrl: session.url || undefined,
            metadata: session,
        };
    }

    async verifyPayment(paymentId: string): Promise<PaymentResult> {
        const session = await this.stripe.checkout.sessions.retrieve(paymentId);
        let status: PaymentStatus = 'PENDING';

        if (session.payment_status === 'paid') {
            status = 'COMPLETED';
        } else if (session.status === 'expired' || session.status === 'open') {
            status = 'PENDING'; // Open means still waiting
        } else {
            status = 'FAILED';
        }

        return {
            id: session.id,
            transactionId: session.payment_intent as string,
            status,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency || 'USD',
            metadata: session,
        };
    }

    async handleWebhook(request: Request): Promise<any> {
        const sig = request.headers.get('stripe-signature');
        const body = await request.text();

        let event;

        try {
            event = this.stripe.webhooks.constructEvent(
                body,
                sig!,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err: any) {
            throw new Error(`Webhook Error: ${err.message}`);
        }

        let paymentStatus: PaymentStatus | undefined;
        let orderId: string | undefined;
        let transactionId: string | undefined;

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            paymentStatus = 'COMPLETED';
            orderId = session.metadata?.orderId;
            transactionId = session.payment_intent as string;
        }

        return {
            eventId: event.id,
            type: event.type,
            payload: event.data.object,
            paymentStatus,
            orderId,
            transactionId,
        };
    }
}
