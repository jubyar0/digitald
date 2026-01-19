"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    ShoppingBag,
    Lock,
    CreditCard,
    ArrowLeft,
    Loader2,
    Trash2,
    Plus,
    Minus,
    LogIn,
    Shield,
    Truck,
    Gift,
    ChevronRight,
    Check,
    AlertCircle,
    Sparkles,
    Heart,
    Store,
    FileDown,
    Mail
} from "lucide-react";
import { getCart, removeFromCart, updateCartItemQuantity } from "@/actions/user-cart-wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        currency: string;
        thumbnail: string | null;
        vendor: {
            id: string;
            name: string;
        } | null;
    };
}

interface Cart {
    id?: string;
    items: CartItem[];
    total: number;
    itemCount: number;
}

type CheckoutStep = 'cart' | 'account' | 'payment';

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingItem, setProcessingItem] = useState<string | null>(null);
    const [checkingOut, setCheckingOut] = useState(false);
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
    const [paymentMethod, setPaymentMethod] = useState<string>('stripe');
    const [promoCode, setPromoCode] = useState('');
    const [applyingPromo, setApplyingPromo] = useState(false);

    useEffect(() => {
        loadCart();
    }, []);

    useEffect(() => {
        if (session?.user && currentStep === 'account') {
            setCurrentStep('payment');
        }
    }, [session, currentStep]);

    const loadCart = async () => {
        try {
            setLoading(true);
            const cartData = await getCart();
            setCart(cartData);
        } catch (error) {
            console.error("Error loading cart:", error);
            toast.error("Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        try {
            setProcessingItem(itemId);
            const result = await removeFromCart(itemId);
            if (result.success) {
                toast.success("Item removed");
                loadCart();
            } else {
                toast.error((result as any).error || "Failed to remove item");
            }
        } catch (error) {
            toast.error("Failed to remove item");
        } finally {
            setProcessingItem(null);
        }
    };

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            setProcessingItem(itemId);
            const result = await updateCartItemQuantity(itemId, newQuantity);
            if (result.success) {
                loadCart();
            } else {
                toast.error((result as any).error || "Failed to update quantity");
            }
        } catch (error) {
            toast.error("Failed to update quantity");
        } finally {
            setProcessingItem(null);
        }
    };

    const handleProceed = () => {
        if (!session?.user) {
            setCurrentStep('account');
        } else {
            setCurrentStep('payment');
        }
    };

    const handleCheckout = async () => {
        if (!session?.user) {
            router.push(`/login?callbackUrl=${encodeURIComponent('/checkout')}`);
            return;
        }

        setCheckingOut(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromCart: true })
            });

            const data = await response.json();

            if (response.ok && data.orderId) {
                // Process payment
                const paymentResponse = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: data.orderId,
                        paymentMethod: paymentMethod.toUpperCase()
                    })
                });

                const paymentData = await paymentResponse.json();

                if (paymentResponse.ok && paymentData.url) {
                    window.location.href = paymentData.url;
                } else {
                    toast.error((paymentData as any).error || "Payment initialization failed");
                }
            } else {
                toast.error((data as any).error || "Failed to create order");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Checkout failed. Please try again.");
        } finally {
            setCheckingOut(false);
        }
    };

    const formatPrice = (price: number, currency: string = 'EUR') => {
        return new Intl.NumberFormat('en-EU', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    const steps = [
        { id: 'cart', label: 'Review', icon: ShoppingBag },
        { id: 'account', label: 'Account', icon: LogIn },
        { id: 'payment', label: 'Payment', icon: CreditCard }
    ];

    const getStepStatus = (stepId: string) => {
        const stepIndex = steps.findIndex(s => s.id === stepId);
        const currentIndex = steps.findIndex(s => s.id === currentStep);

        if (stepId === 'account' && session?.user) return 'completed';
        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'upcoming';
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
                        <ShoppingBag className="w-6 h-6 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your cart...</p>
                </div>
            </div>
        );
    }

    // Empty cart
    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">
                        Discover amazing digital products from talented creators around the world!
                    </p>
                    <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                        <Link href="/3d-models" className="gap-2">
                            <Sparkles className="w-4 h-4" />
                            Explore Products
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Progress Steps */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-center">
                        {steps.map((step, index) => {
                            const status = getStepStatus(step.id);
                            const Icon = step.icon;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => {
                                            if (status === 'completed' || status === 'current') {
                                                if (step.id !== 'account' || !session?.user) {
                                                    setCurrentStep(step.id as CheckoutStep);
                                                }
                                            }
                                        }}
                                        disabled={status === 'upcoming'}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                                            status === 'current' && "bg-orange-500 text-white shadow-md",
                                            status === 'completed' && "bg-green-100 text-green-700 hover:bg-green-200",
                                            status === 'upcoming' && "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        )}
                                    >
                                        {status === 'completed' ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Icon className="w-4 h-4" />
                                        )}
                                        <span className="font-medium text-sm">{step.label}</span>
                                    </button>

                                    {index < steps.length - 1 && (
                                        <ChevronRight className={cn(
                                            "w-5 h-5 mx-2",
                                            status === 'completed' ? "text-green-400" : "text-gray-300"
                                        )} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 py-8">
                {/* Back button */}
                <Link
                    href="/3d-models"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Continue shopping
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Cart Review Step */}
                        {currentStep === 'cart' && (
                            <>
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Review your order
                                    </h1>
                                    <Badge variant="secondary" className="text-sm">
                                        {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
                                    </Badge>
                                </div>

                                {/* Cart Items */}
                                <div className="space-y-4">
                                    {cart.items.map((item) => (
                                        <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                            <CardContent className="p-0">
                                                <div className="flex">
                                                    {/* Product Image */}
                                                    <div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-50 flex-shrink-0">
                                                        {item.product.thumbnail ? (
                                                            <Image
                                                                src={item.product.thumbnail}
                                                                alt={item.product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <FileDown className="w-10 h-10 text-gray-300" />
                                                            </div>
                                                        )}
                                                        {/* Digital Product Badge */}
                                                        <div className="absolute bottom-2 left-2">
                                                            <Badge variant="secondary" className="text-xs bg-white/90 backdrop-blur-sm">
                                                                <FileDown className="w-3 h-3 mr-1" />
                                                                Digital
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 p-4">
                                                        <div className="flex justify-between">
                                                            <div className="flex-1 min-w-0 pr-4">
                                                                <h3 className="font-semibold text-gray-900 truncate mb-1">
                                                                    {item.product.name}
                                                                </h3>
                                                                {item.product.vendor && (
                                                                    <Link
                                                                        href={`/shop/${item.product.vendor.id}`}
                                                                        className="inline-flex items-center text-sm text-gray-500 hover:text-orange-500 transition-colors"
                                                                    >
                                                                        <Store className="w-3 h-3 mr-1" />
                                                                        {item.product.vendor.name}
                                                                    </Link>
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-lg font-bold text-gray-900">
                                                                    {formatPrice(item.product.price * item.quantity, item.product.currency)}
                                                                </p>
                                                                {item.quantity > 1 && (
                                                                    <p className="text-xs text-gray-500">
                                                                        {formatPrice(item.product.price)} each
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center justify-between mt-4">
                                                            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1 || processingItem === item.id}
                                                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </button>
                                                                <span className="w-10 text-center font-medium">
                                                                    {processingItem === item.id ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                                                    ) : (
                                                                        item.quantity
                                                                    )}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                                    disabled={processingItem === item.id}
                                                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                                >
                                                                    <Heart className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveItem(item.id)}
                                                                    disabled={processingItem === item.id}
                                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Promo Code */}
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex gap-3">
                                            <div className="flex-1">
                                                <Label htmlFor="promo" className="text-sm text-gray-600 mb-1.5 block">
                                                    Have a promo code?
                                                </Label>
                                                <Input
                                                    id="promo"
                                                    placeholder="Enter code"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value)}
                                                    className="bg-gray-50"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <Button
                                                    variant="outline"
                                                    disabled={!promoCode || applyingPromo}
                                                    onClick={() => {
                                                        setApplyingPromo(true);
                                                        setTimeout(() => {
                                                            toast.error("Invalid promo code");
                                                            setApplyingPromo(false);
                                                        }, 1000);
                                                    }}
                                                >
                                                    {applyingPromo ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        "Apply"
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Account Step */}
                        {currentStep === 'account' && !session?.user && (
                            <Card>
                                <CardHeader>
                                    <h2 className="text-xl font-bold">Sign in to continue</h2>
                                    <p className="text-gray-500">
                                        Create an account or sign in to complete your purchase
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button
                                        onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent('/checkout')}`)}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                        size="lg"
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Sign in with Email
                                    </Button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <Separator className="w-full" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white px-2 text-gray-500">or</span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => router.push(`/signup?callbackUrl=${encodeURIComponent('/checkout')}`)}
                                        className="w-full"
                                        size="lg"
                                    >
                                        Create an Account
                                    </Button>

                                    <p className="text-center text-xs text-gray-500">
                                        By continuing, you agree to our Terms of Service and Privacy Policy
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Payment Step */}
                        {currentStep === 'payment' && session?.user && (
                            <Card>
                                <CardHeader>
                                    <h2 className="text-xl font-bold">Payment method</h2>
                                    <p className="text-gray-500">
                                        Choose how you&apos;d like to pay
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={paymentMethod}
                                        onValueChange={setPaymentMethod}
                                        className="space-y-3"
                                    >
                                        {/* Stripe */}
                                        <label
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                                paymentMethod === 'stripe'
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            <RadioGroupItem value="stripe" className="text-orange-500" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-5 h-5 text-gray-600" />
                                                    <span className="font-medium">Credit / Debit Card</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    Visa, Mastercard, American Express
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Image src="/images/payments/visa.png" alt="Visa" width={40} height={24} className="object-contain" />
                                                <Image src="/images/payments/mastercard.png" alt="Mastercard" width={40} height={24} className="object-contain" />
                                            </div>
                                        </label>

                                        {/* PayPal */}
                                        <label
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                                paymentMethod === 'paypal'
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            <RadioGroupItem value="paypal" className="text-orange-500" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">PayPal</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    Pay with your PayPal account
                                                </p>
                                            </div>
                                            <div className="w-16 h-6 bg-[#003087] rounded text-white text-[10px] flex items-center justify-center font-bold">PayPal</div>
                                        </label>

                                        {/* Crypto */}
                                        <label
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                                paymentMethod === 'cryptomus'
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            <RadioGroupItem value="cryptomus" className="text-orange-500" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Cryptocurrency</span>
                                                    <Badge variant="secondary" className="text-[10px]">New</Badge>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    Bitcoin, Ethereum, USDT & more
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <Image src="/images/payments/cryptomus.png" alt="Cryptomus" width={80} height={24} className="object-contain" />
                                            </div>
                                        </label>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <Card className="overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4">
                                    <h3 className="font-bold text-lg">Order Summary</h3>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Items preview */}
                                    <div className="space-y-2">
                                        {cart.items.slice(0, 2).map((item) => (
                                            <div key={item.id} className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                                                    {item.product.thumbnail ? (
                                                        <Image
                                                            src={item.product.thumbnail}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <FileDown className="w-5 h-5 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-medium">
                                                    {formatPrice(item.product.price * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                        {cart.items.length > 2 && (
                                            <p className="text-sm text-gray-500 text-center">
                                                +{cart.items.length - 2} more items
                                            </p>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* Pricing */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">{formatPrice(cart.total)}</span>
                                        </div>
                                        <div className="flex justify-between text-green-600">
                                            <span>Platform fees</span>
                                            <span>Free</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-orange-600">{formatPrice(cart.total)}</span>
                                    </div>

                                    {/* CTA Button */}
                                    {currentStep === 'cart' && (
                                        <Button
                                            onClick={handleProceed}
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25"
                                            size="lg"
                                        >
                                            Proceed to Checkout
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    )}

                                    {currentStep === 'payment' && session?.user && (
                                        <Button
                                            onClick={handleCheckout}
                                            disabled={checkingOut}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25"
                                            size="lg"
                                        >
                                            {checkingOut ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-4 h-4 mr-2" />
                                                    Pay {formatPrice(cart.total)}
                                                </>
                                            )}
                                        </Button>
                                    )}

                                    {/* Security badges */}
                                    <div className="flex items-center justify-center gap-4 pt-2">
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Shield className="w-4 h-4 text-green-500" />
                                            <span>Secure</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Lock className="w-4 h-4 text-green-500" />
                                            <span>Encrypted</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Trust badges */}
                            <Card>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <FileDown className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Instant Download</p>
                                            <p className="text-xs text-gray-500">Get your files immediately after purchase</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Shield className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Buyer Protection</p>
                                            <p className="text-xs text-gray-500">Full refund if not as described</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                            <Gift className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Support Creators</p>
                                            <p className="text-xs text-gray-500">95% goes directly to the creator</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
