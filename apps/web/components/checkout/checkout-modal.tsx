'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, CreditCard, Wallet } from 'lucide-react';
import { PaymentGateway } from '@/lib/payment/types';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    amount: number;
    currency: string;
}

export function CheckoutModal({ isOpen, onClose, orderId, amount, currency }: CheckoutModalProps) {
    const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('STRIPE');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    paymentMethod: selectedGateway,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Payment initiation failed');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error('No payment URL returned');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                    <DialogDescription>
                        Complete your purchase of {currency} {amount.toFixed(2)}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <RadioGroup value={selectedGateway} onValueChange={(val) => setSelectedGateway(val as PaymentGateway)}>
                        <div className="grid grid-cols-1 gap-4">
                            <Label
                                htmlFor="stripe"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                            >
                                <RadioGroupItem value="STRIPE" id="stripe" className="sr-only" />
                                <CreditCard className="mb-3 h-6 w-6" />
                                Credit Card (Stripe)
                            </Label>

                            <Label
                                htmlFor="googlepay"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                            >
                                <RadioGroupItem value="GOOGLE_PAY" id="googlepay" className="sr-only" />
                                <Wallet className="mb-3 h-6 w-6" />
                                Google Pay
                            </Label>

                            <Label
                                htmlFor="paypal"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                            >
                                <RadioGroupItem value="PAYPAL" id="paypal" className="sr-only" />
                                <Wallet className="mb-3 h-6 w-6" />
                                PayPal
                            </Label>

                            <Label
                                htmlFor="cryptomus"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                            >
                                <RadioGroupItem value="CRYPTOMUS" id="cryptomus" className="sr-only" />
                                <Wallet className="mb-3 h-6 w-6" />
                                Crypto (Cryptomus)
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handlePayment} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Pay Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
