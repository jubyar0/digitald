"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { addToCart } from "@/actions/user-cart-wishlist";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
    productId: string;
    productName?: string;
    onSuccess?: () => void;
    className?: string;
    variant?: "default" | "outline" | "ghost";
    showIcon?: boolean;
}

export function AddToCartButton({
    productId,
    productName = "Product",
    onSuccess,
    className = "",
    variant = "default",
    showIcon = true
}: AddToCartButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAddToCart = async () => {
        try {
            setIsLoading(true);
            const result = await addToCart(productId, 1);

            if (result.success) {
                toast.success(`${productName} added to cart!`, {
                    action: {
                        label: "View Cart",
                        onClick: () => router.push("/account/cart")
                    }
                });
                onSuccess?.();
            } else {
                // Check if error is due to authentication
                if ((result as any).error?.includes("Unauthorized")) {
                    toast.error("Please login to add items to cart", {
                        action: {
                            label: "Login",
                            onClick: () => router.push("/login")
                        }
                    });
                } else {
                    toast.error((result as any).error || "Failed to add to cart");
                }
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add to cart. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            variant={variant}
            className={className}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                </>
            ) : (
                <>
                    {showIcon && <ShoppingCart className="w-4 h-4 mr-2" />}
                    Add to Cart
                </>
            )}
        </Button>
    );
}
