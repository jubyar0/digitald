import { PaymentProvider, CreatePaymentParams, PaymentResult, PaymentStatus } from './types';
import crypto from 'crypto';

interface CryptomusPaymentResponse {
    state: number;
    result: {
        uuid: string;
        order_id: string;
        amount: string;
        payment_amount: string;
        currency: string;
        payment_status: string;
        url: string;
        expired_at: number;
        status: string;
        is_final: boolean;
    };
}

export class CryptomusProvider implements PaymentProvider {
    private merchantId: string;
    private apiKey: string;
    private baseUrl = 'https://api.cryptomus.com/v1';

    constructor(merchantId: string, apiKey: string) {
        this.merchantId = merchantId;
        this.apiKey = apiKey;
    }

    private generateSign(data: Record<string, any>): string {
        const jsonData = JSON.stringify(data);
        const base64Data = Buffer.from(jsonData).toString('base64');
        return crypto
            .createHash('md5')
            .update(base64Data + this.apiKey)
            .digest('hex');
    }

    async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
        const payload = {
            amount: params.amount.toString(),
            currency: params.currency,
            order_id: params.orderId,
            url_return: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
            url_callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/cryptomus`,
            is_payment_multiple: false,
            lifetime: 3600, // 1 hour expiration
            ...params.metadata,
        };

        const sign = this.generateSign(payload);

        const response = await fetch(`${this.baseUrl}/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'merchant': this.merchantId,
                'sign': sign,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json() as CryptomusPaymentResponse;

        if (data.state !== 0 || !data.result) {
            throw new Error('Failed to create Cryptomus payment');
        }

        return {
            id: data.result.uuid,
            transactionId: data.result.uuid,
            status: 'PENDING',
            amount: params.amount,
            currency: params.currency,
            approvalUrl: data.result.url,
            metadata: data.result,
        };
    }

    async verifyPayment(paymentId: string): Promise<PaymentResult> {
        const payload = { uuid: paymentId };
        const sign = this.generateSign(payload);

        const response = await fetch(`${this.baseUrl}/payment/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'merchant': this.merchantId,
                'sign': sign,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json() as CryptomusPaymentResponse;

        if (data.state !== 0 || !data.result) {
            throw new Error('Failed to verify Cryptomus payment');
        }

        const statusMap: Record<string, PaymentStatus> = {
            'paid': 'COMPLETED',
            'paid_over': 'COMPLETED',
            'confirm_check': 'PENDING',
            'check': 'PENDING',
            'process': 'PENDING',
            'cancel': 'FAILED',
            'fail': 'FAILED',
            'wrong_amount': 'FAILED',
            'system_fail': 'FAILED',
            'refund_process': 'REFUNDED',
            'refund_fail': 'FAILED',
            'refund_paid': 'REFUNDED',
        };

        return {
            id: data.result.uuid,
            transactionId: data.result.uuid,
            status: statusMap[data.result.payment_status] || 'PENDING',
            amount: parseFloat(data.result.amount),
            currency: data.result.currency,
            metadata: data.result,
        };
    }

    async handleWebhook(request: Request): Promise<any> {
        const body = await request.json();

        // Verify webhook signature
        const receivedSign = request.headers.get('sign');
        const expectedSign = this.generateSign(body);

        if (receivedSign !== expectedSign) {
            throw new Error('Invalid webhook signature');
        }

        const statusMap: Record<string, PaymentStatus> = {
            'paid': 'COMPLETED',
            'paid_over': 'COMPLETED',
            'cancel': 'FAILED',
            'fail': 'FAILED',
        };

        return {
            eventId: body.uuid,
            type: `payment.${body.status}`,
            payload: body,
            paymentStatus: statusMap[body.status],
            orderId: body.order_id,
            transactionId: body.uuid,
        };
    }
}
