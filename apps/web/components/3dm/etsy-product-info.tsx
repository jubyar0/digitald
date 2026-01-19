"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Star,
    Heart,
    ShoppingCart,
    Truck,
    ChevronDown,
    Check,
    Sparkles,
    Gift,
    Loader2
} from "lucide-react";
import { Material } from "@/lib/materials-data";
import { cn } from "@/lib/utils";
import { addToCart } from "@/actions/user-cart-wishlist";
import { toast } from "sonner";

interface EtsyProductInfoProps {
    material: Material;
    productId: string;
    vendor?: {
        id: string;
        name: string;
        avatar?: string;
        rating?: number;
        reviewCount?: number;
        salesCount?: number;
    };
}

export function EtsyProductInfo({ material, productId, vendor }: EtsyProductInfoProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);

    const price = material.price || 0;
    const formattedPrice = new Intl.NumberFormat('en-EU', {
        style: 'currency',
        currency: 'EUR',
    }).format(price);

    const rating = vendor?.rating || 4.9;

    const handleAddToCart = async () => {
        try {
            setIsAddingToCart(true);
            const result = await addToCart(productId, quantity);

            if (result.success) {
                toast.success(`${material.name} added to basket!`, {
                    action: {
                        label: "View Basket",
                        onClick: () => router.push("/account/cart")
                    }
                });
            } else {
                if ((result as any).error?.includes("Unauthorized")) {
                    toast.error("Please login to add items to basket", {
                        action: {
                            label: "Login",
                            onClick: () => router.push("/login")
                        }
                    });
                } else {
                    toast.error((result as any).error || "Failed to add to basket");
                }
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add to basket. Please try again.");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        try {
            setIsBuyingNow(true);
            const result = await addToCart(productId, quantity);

            if (result.success) {
                toast.success("Redirecting to checkout...");
                router.push("/checkout");
            } else {
                if ((result as any).error?.includes("Unauthorized")) {
                    toast.error("Please login to purchase", {
                        action: {
                            label: "Login",
                            onClick: () => router.push("/login")
                        }
                    });
                } else {
                    toast.error((result as any).error || "Failed to process. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error buying now:", error);
            toast.error("Failed to process. Please try again.");
        } finally {
            setIsBuyingNow(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* Seller Badge - Top */}
            {vendor && (
                <div className="flex items-center gap-2 flex-wrap">
                    <Link
                        href={`/shop/${vendor.id}`}
                        className="text-sm font-medium text-gray-900 hover:underline"
                    >
                        {vendor.name}
                    </Link>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 rounded-full">
                        <Sparkles className="h-3 w-3 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">Star Seller</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 text-gray-900 fill-gray-900" />
                        ))}
                    </div>
                </div>
            )}

            {/* Price */}
            <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{formattedPrice}</span>
                    {material.isFree && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Free</span>
                    )}
                </div>
                <p className="text-xs text-gray-500">Local taxes included (where applicable)</p>
            </div>

            {/* Product Title */}
            <h1 className="text-base font-normal text-gray-900 leading-snug">
                {material.name}
            </h1>

            {/* Quantity Selector */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Quantity</label>
                <div className="relative w-full">
                    <select
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full h-11 px-4 pr-10 rounded-md border border-gray-300 bg-white text-gray-900 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
                <button
                    onClick={handleBuyNow}
                    disabled={isBuyingNow || isAddingToCart}
                    className="w-full h-11 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isBuyingNow ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Buy it now"
                    )}
                </button>
                <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || isBuyingNow}
                    className="w-full h-11 border-2 border-gray-900 text-gray-900 font-medium rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isAddingToCart ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-4 w-4" />
                            Add to basket
                        </>
                    )}
                </button>
            </div>

            {/* Star Seller Box */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-3 w-3 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Star Seller</p>
                        <p className="text-xs text-gray-500">This seller consistently earned 5-star reviews, dispatched on time, and replied quickly to messages.</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-gray-700">Order today to get by <span className="font-medium">Jan 8-15</span></p>
                </div>

                <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <p className="text-sm text-gray-700"><span className="font-medium">Returns & exchanges accepted</span> within 30 days</p>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                    <Gift className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <p className="text-sm text-gray-700"><span className="font-medium">Send as a gift.</span> Add a note during checkout.</p>
                </div>
            </div>

            {/* Item Details Toggle */}
            <div className="border-t border-gray-200 pt-4">
                <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="flex items-center justify-between w-full py-2 text-left"
                >
                    <span className="font-medium text-gray-900 text-sm">Item details</span>
                    <ChevronDown className={cn(
                        "h-5 w-5 text-gray-500 transition-transform",
                        showDescription && "rotate-180"
                    )} />
                </button>
                {showDescription && material.description && (
                    <div className="py-3 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {material.description}
                    </div>
                )}
            </div>
        </div>
    );
}
