"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { AddToWishlistButton } from "@/components/cart/add-to-wishlist-button";
import { CartDrawer } from "@/components/cart/cart-drawer";

interface ProductActionsProps {
    productId: string;
    productName: string;
}

export function ProductActions({ productId, productName }: ProductActionsProps) {
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
    const [cartRefreshTrigger, setCartRefreshTrigger] = useState(0);

    const handleAddToCartSuccess = () => {
        setCartRefreshTrigger(prev => prev + 1);
        setIsCartDrawerOpen(true);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: productName,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <>
            <div className="flex gap-4 mb-8">
                <AddToCartButton
                    productId={productId}
                    productName={productName}
                    onSuccess={handleAddToCartSuccess}
                    className="flex-1 h-12 px-6 rounded-lg bg-white hover:bg-gray-100 text-black font-medium transition-colors"
                />
                <AddToWishlistButton
                    productId={productId}
                    productName={productName}
                    variant="outline"
                    className="h-12 px-4 rounded-lg border-white/10 hover:bg-white/5 text-gray-400 hover:text-white"
                />
                <Button
                    onClick={handleShare}
                    variant="outline"
                    size="icon"
                    className="h-12 px-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                >
                    <Share2 className="w-5 h-5" />
                </Button>
            </div>

            <CartDrawer
                isOpen={isCartDrawerOpen}
                onClose={() => setIsCartDrawerOpen(false)}
                refreshTrigger={cartRefreshTrigger}
            />
        </>
    );
}
