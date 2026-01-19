import { PaymentProvider, CreatePaymentParams, PaymentResult, PaymentStatus } from './types';
import Stripe from 'stripe';

/**
 * Google Pay Provider
 * 
 * Google Pay is integrated through Stripe as a payment method.
 * This provider creates a Stripe PaymentIntent with Google Pay enabled.
 * 
 * Requirements:
 * - Stripe account with Google Pay enabled
 * - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env
 * - STRIPE_SECRET_KEY in .env
 */
export class GooglePayProvider implements PaymentProvider {
    private stripe: Stripe;

    constructor(apiKey: string) {
        this.stripe = new Stripe(apiKey, {
            apiVersion: '2023-10-16',
        });
    }

    async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
        // Create a PaymentIntent for Google Pay
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(params.amount * 100), // Stripe uses cents
            currency: params.currency.toLowerCase(),
            payment_method_types: ['card'], // Google Pay uses card as underlying method
            metadata: {
                orderId: params.orderId,
                paymentMethod: 'google_pay',
                ...params.metadata,
            },
            receipt_email: params.customerEmail,
        });

        // For Google Pay, we return the client secret for frontend processing
        return {
            id: paymentIntent.id,
            status: 'PENDING',
            amount: params.amount,
            currency: params.currency,
            clientSecret: paymentIntent.client_secret || undefined,
            metadata: paymentIntent,
        };
    }

    async verifyPayment(paymentId: string): Promise<PaymentResult> {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);

        let status: PaymentStatus = 'PENDING';
        if (paymentIntent.status === 'succeeded') {
            status = 'COMPLETED';
        } else if (paymentIntent.status === 'canceled') {
            status = 'FAILED';
        }

        return {
            id: paymentIntent.id,
            transactionId: paymentIntent.id,
            status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency.toUpperCase(),
            metadata: paymentIntent,
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

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            if (paymentIntent.metadata?.paymentMethod === 'google_pay') {
                paymentStatus = 'COMPLETED';
                orderId = paymentIntent.metadata?.orderId;
                transactionId = paymentIntent.id;
            }
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
