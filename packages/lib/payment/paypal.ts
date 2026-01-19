import { PaymentProvider, CreatePaymentParams, PaymentResult, PaymentStatus } from './types';

export class PayPalProvider implements PaymentProvider {
    private clientId: string;
    private clientSecret: string;
    private baseUrl: string;

    constructor(clientId: string, clientSecret: string, mode: 'sandbox' | 'live' = 'sandbox') {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseUrl = mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
    }

    private async getAccessToken(): Promise<string> {
        const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
        const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
            method: 'POST',
            body: 'grant_type=client_credentials',
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const data = await response.json();
        return data.access_token;
    }

    async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
        const accessToken = await this.getAccessToken();
        const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        reference_id: params.orderId,
                        amount: {
                            currency_code: params.currency,
                            value: params.amount.toFixed(2),
                        },
                    },
                ],
                application_context: {
                    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
                    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failed`,
                },
            }),
        });

        const order = await response.json();
        const approvalUrl = order.links.find((link: any) => link.rel === 'approve')?.href;

        return {
            id: order.id,
            status: 'PENDING',
            amount: params.amount,
            currency: params.currency,
            approvalUrl,
            metadata: order,
        };
    }

    async verifyPayment(paymentId: string): Promise<PaymentResult> {
        const accessToken = await this.getAccessToken();
        const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const order = await response.json();

        let status: PaymentStatus = 'PENDING';
        if (order.status === 'COMPLETED' || order.status === 'APPROVED') {
            status = 'COMPLETED';
        } else if (order.status === 'VOIDED') {
            status = 'FAILED';
        }

        return {
            id: order.id,
            status,
            amount: parseFloat(order.purchase_units[0].amount.value),
            currency: order.purchase_units[0].amount.currency_code,
            metadata: order,
        };
    }

    async handleWebhook(request: Request): Promise<any> {
        // Implement webhook signature verification here
        const body = await request.json();

        let paymentStatus: PaymentStatus | undefined;
        let orderId: string | undefined;

        if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
            // You might want to capture the order here if not auto-captured
            paymentStatus = 'COMPLETED';
            orderId = body.resource.purchase_units[0].reference_id;
        }

        return {
            eventId: body.id,
            type: body.event_type,
            payload: body,
            paymentStatus,
            orderId,
        };
    }
}
