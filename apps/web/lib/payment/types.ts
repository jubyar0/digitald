export type PaymentGateway = 'STRIPE' | 'PAYPAL' | 'CRYPTOMUS' | 'GOOGLE_PAY' | 'BALANCE';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface CreatePaymentParams {
    orderId: string;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
    customerEmail?: string;
    customerName?: string;
}

export interface PaymentResult {
    id: string; // Internal Payment ID or External Transaction ID
    transactionId?: string; // External Transaction ID
    status: PaymentStatus;
    amount: number;
    currency: string;
    clientSecret?: string; // For Stripe
    approvalUrl?: string; // For PayPal/Cryptomus
    metadata?: any;
}

export interface PaymentProvider {
    createPayment(params: CreatePaymentParams): Promise<PaymentResult>;
    verifyPayment(paymentId: string): Promise<PaymentResult>;
    handleWebhook(request: Request): Promise<{
        eventId: string;
        type: string;
        payload: any;
        paymentStatus?: PaymentStatus;
        orderId?: string;
        transactionId?: string;
    }>;
}
