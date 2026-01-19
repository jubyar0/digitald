"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/actions/user-cart-wishlist";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddToWishlistButtonProps {
    productId: string;
    productName?: string;
    variant?: "default" | "outline" | "ghost";
    showLabel?: boolean;
    className?: string;
}

export function AddToWishlistButton({
    productId,
    productName = "Product",
    variant = "outline",
    showLabel = false,
    className = ""
}: AddToWishlistButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);
    const [wishlistId, setWishlistId] = useState<string | undefined>();
    const router = useRouter();

    useEffect(() => {
        checkWishlistStatus();
    }, [productId]);

    const checkWishlistStatus = async () => {
        try {
            const result = await isInWishlist(productId);
            setInWishlist(result.inWishlist);
            setWishlistId(result.wishlistId);
        } catch (error) {
            console.error("Error checking wishlist:", error);
        }
    };

    const handleToggleWishlist = async () => {
        try {
            setIsLoading(true);

            if (inWishlist && wishlistId) {
                // Remove from wishlist
                const result = await removeFromWishlist(wishlistId);
                if (result.success) {
                    toast.success(`${productName} removed from wishlist`);
                    setInWishlist(false);
                    setWishlistId(undefined);
                } else {
                    toast.error(result.error || "Failed to remove from wishlist");
                }
            } else {
                // Add to wishlist
                const result = await addToWishlist(productId);
                if (result.success) {
                    toast.success(`${productName} added to wishlist!`, {
                        action: {
                            label: "View Wishlist",
                            onClick: () => router.push("/account/wishlist")
                        }
                    });
                    await checkWishlistStatus();
                } else {
                    // Check if error is due to authentication
                    if (result.error?.includes("Unauthorized")) {
                        toast.error("Please login to add items to wishlist", {
                            action: {
                                label: "Login",
                                onClick: () => router.push("/login")
                            }
                        });
                    } else {
                        toast.error(result.error || "Failed to add to wishlist");
                    }
                }
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            toast.error("Failed to update wishlist. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleToggleWishlist}
            disabled={isLoading}
            variant={variant}
            size={showLabel ? "default" : "icon"}
            className={className}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    <Heart className={`w-4 h-4 ${inWishlist ? "fill-current text-red-500" : ""} ${showLabel ? "mr-2" : ""}`} />
                    {showLabel && (inWishlist ? "In Wishlist" : "Add to Wishlist")}
                </>
            )}
        </Button>
    );
}
