"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Heart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    getCart,
    removeFromCart,
    updateCartItemQuantity,
    getWishlist,
    removeFromWishlist,
    moveWishlistToCart
} from "@/actions/user-cart-wishlist";
import { toast } from "sonner";

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
        };
    };
}

interface CartData {
    id?: string;
    items: CartItem[];
    total: number;
    itemCount: number;
}

interface WishlistItem {
    id: string;
    product: {
        id: string;
        name: string;
        description?: string | null;
        price: number;
        currency: string;
        thumbnail: string | null;
        vendor: {
            id: string;
            name: string;
        };
    };
    addedAt: Date;
}

interface WishlistData {
    items: WishlistItem[];
    total: number;
}

interface CartWishlistSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab?: "cart" | "wishlist";
}

export function CartWishlistSidebar({ isOpen, onClose, activeTab = "cart" }: CartWishlistSidebarProps) {
    const [currentTab, setCurrentTab] = useState<"cart" | "wishlist">(activeTab);
    const [cart, setCart] = useState<CartData>({ items: [], total: 0, itemCount: 0 });
    const [wishlist, setWishlist] = useState<WishlistData>({ items: [], total: 0 });
    const [isLoadingCart, setIsLoadingCart] = useState(false);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

    // Update currentTab when activeTab prop changes
    useEffect(() => {
        setCurrentTab(activeTab);
    }, [activeTab]);

    const loadCart = async () => {
        try {
            setIsLoadingCart(true);
            const cartData = await getCart();
            setCart(cartData);
        } catch (error) {
            console.error("Failed to load cart:", error);
            // Don't show error toast for unauthorized users
        } finally {
            setIsLoadingCart(false);
        }
    };

    const loadWishlist = async () => {
        try {
            setIsLoadingWishlist(true);
            const wishlistData = await getWishlist();
            setWishlist(wishlistData);
        } catch (error) {
            console.error("Failed to load wishlist:", error);
            // Don't show error toast for unauthorized users
        } finally {
            setIsLoadingWishlist(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (currentTab === "cart") {
                loadCart();
            } else {
                loadWishlist();
            }
        }
    }, [isOpen, currentTab]);

    const handleRemoveCartItem = async (itemId: string) => {
        try {
            const result = await removeFromCart(itemId);
            if (result.success) {
                toast.success("Item removed from cart");
                loadCart();
            } else {
                toast.error((result as any).error || "Failed to remove item");
            }
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            const result = await updateCartItemQuantity(itemId, newQuantity);
            if (result.success) {
                loadCart();
            } else {
                toast.error((result as any).error || "Failed to update quantity");
            }
        } catch (error) {
            toast.error("Failed to update quantity");
        }
    };

    const handleRemoveWishlistItem = async (itemId: string) => {
        try {
            const result = await removeFromWishlist(itemId);
            if (result.success) {
                toast.success("Item removed from wishlist");
                loadWishlist();
            } else {
                toast.error((result as any).error || "Failed to remove item");
            }
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const handleMoveToCart = async (itemId: string) => {
        try {
            const result = await moveWishlistToCart(itemId);
            if (result.success) {
                toast.success("Item moved to cart");
                loadWishlist();
                loadCart();
            } else {
                toast.error((result as any).error || "Failed to move item to cart");
            }
        } catch (error) {
            toast.error("Failed to move item to cart");
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-lg bg-background border-border p-0 flex flex-col">
                <SheetHeader className="p-6 pb-4 border-b border-border">
                    <SheetTitle className="text-foreground">Shopping</SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                        Manage your cart and wishlist
                    </SheetDescription>
                </SheetHeader>

                <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as "cart" | "wishlist")} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="mx-6 mt-4 grid w-auto grid-cols-2">
                        <TabsTrigger value="cart" className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Cart ({cart.itemCount})
                        </TabsTrigger>
                        <TabsTrigger value="wishlist" className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Wishlist ({wishlist.total})
                        </TabsTrigger>
                    </TabsList>

                    {/* Cart Tab Content */}
                    <TabsContent value="cart" className="flex-1 flex flex-col overflow-hidden m-0 data-[state=inactive]:hidden">
                        {isLoadingCart ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-muted-foreground">Loading...</div>
                            </div>
                        ) : cart.items.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
                                <p className="text-sm text-muted-foreground mb-6">Add some amazing products to get started!</p>
                                <Button onClick={onClose} variant="outline">
                                    Continue Shopping
                                </Button>
                            </div>
                        ) : (
                            <>
                                <ScrollArea className="flex-1 px-6 py-4">
                                    <div className="space-y-4">
                                        {cart.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 p-4 rounded-lg border border-border bg-muted/30">
                                                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                                    {item.product.thumbnail ? (
                                                        <Image
                                                            src={item.product.thumbnail}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ShoppingCart className="w-8 h-8 text-muted-foreground/50" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-foreground text-sm truncate mb-1">
                                                        {item.product.name}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mb-2">
                                                        by {item.product.vendor.name}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                                className="w-6 h-6 rounded border border-border hover:bg-muted flex items-center justify-center text-foreground"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="text-sm text-foreground w-8 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                                className="w-6 h-6 rounded border border-border hover:bg-muted flex items-center justify-center text-foreground"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-sm font-semibold text-foreground">
                                                                ${(item.product.price * item.quantity).toFixed(2)}
                                                            </span>
                                                            <button
                                                                onClick={() => handleRemoveCartItem(item.id)}
                                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                                title="Remove item"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>

                                <div className="p-6 border-t border-border bg-background space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="text-foreground">${cart.total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Taxes</span>
                                            <span className="text-foreground">Calculated at checkout</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-foreground">Total</span>
                                            <span className="text-foreground text-lg">${cart.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        <Link href="/account/cart" onClick={onClose}>
                                            <Button className="w-full h-11 bg-[#F1641E] hover:bg-[#d6581b] text-white font-medium">
                                                Proceed to Checkout
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={onClose}
                                            variant="outline"
                                            className="w-full h-11"
                                        >
                                            Continue Shopping
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </TabsContent>

                    {/* Wishlist Tab Content */}
                    <TabsContent value="wishlist" className="flex-1 flex flex-col overflow-hidden m-0 data-[state=inactive]:hidden">
                        {isLoadingWishlist ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-muted-foreground">Loading...</div>
                            </div>
                        ) : wishlist.items.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                <Heart className="w-16 h-16 text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty</h3>
                                <p className="text-sm text-muted-foreground mb-6">Save items you love for later!</p>
                                <Button onClick={onClose} variant="outline">
                                    Browse Products
                                </Button>
                            </div>
                        ) : (
                            <ScrollArea className="flex-1 px-6 py-4">
                                <div className="space-y-4">
                                    {wishlist.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 rounded-lg border border-border bg-muted/30">
                                            <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                                {item.product.thumbnail ? (
                                                    <Image
                                                        src={item.product.thumbnail}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Heart className="w-8 h-8 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-foreground text-sm truncate mb-1">
                                                    {item.product.name}
                                                </h4>
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    by {item.product.vendor.name}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-foreground">
                                                        ${item.product.price.toFixed(2)}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleMoveToCart(item.id)}
                                                            className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-[#F1641E] hover:bg-[#d6581b] text-white transition-colors"
                                                            title="Move to cart"
                                                        >
                                                            <ShoppingBag className="w-3 h-3" />
                                                            Add to Cart
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveWishlistItem(item.id)}
                                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                                            title="Remove from wishlist"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
