"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCart, removeFromCart, updateCartItemQuantity } from "@/actions/user-cart-wishlist";
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

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    refreshTrigger?: number;
}

export function CartDrawer({ isOpen, onClose, refreshTrigger = 0 }: CartDrawerProps) {
    const [cart, setCart] = useState<CartData>({ items: [], total: 0, itemCount: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const loadCart = async () => {
        try {
            setIsLoading(true);
            const cartData = await getCart();
            setCart(cartData);
        } catch (error) {
            console.error("Failed to load cart:", error);
            toast.error("Failed to load cart");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadCart();
        }
    }, [isOpen, refreshTrigger]);

    const handleRemoveItem = async (itemId: string) => {
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

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-lg bg-zinc-950 border-zinc-800 text-white p-0 flex flex-col">
                <SheetHeader className="p-6 pb-4 border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-white flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Shopping Cart ({cart.itemCount})
                        </SheetTitle>
                    </div>
                    <SheetDescription className="text-zinc-400">
                        Review your items before checkout
                    </SheetDescription>
                </SheetHeader>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-zinc-400">Loading...</div>
                    </div>
                ) : cart.items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <ShoppingCart className="w-16 h-16 text-zinc-700 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Your cart is empty</h3>
                        <p className="text-sm text-zinc-400 mb-6">Add some amazing products to get started!</p>
                        <Button onClick={onClose} variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 px-6 py-4">
                            <div className="space-y-4">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
                                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                                            {item.product.thumbnail ? (
                                                <Image
                                                    src={item.product.thumbnail}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingCart className="w-8 h-8 text-zinc-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-white text-sm truncate mb-1">
                                                {item.product.name}
                                            </h4>
                                            <p className="text-xs text-zinc-500 mb-2">
                                                by {item.product.vendor.name}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 rounded border border-zinc-700 hover:bg-zinc-800 flex items-center justify-center text-white"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm text-white w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 rounded border border-zinc-700 hover:bg-zinc-800 flex items-center justify-center text-white"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-semibold text-white">
                                                        ${(item.product.price * item.quantity).toFixed(2)}
                                                    </span>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-zinc-500 hover:text-red-500 transition-colors"
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

                        <div className="p-6 border-t border-zinc-800 bg-zinc-950 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Subtotal</span>
                                    <span className="text-white">${cart.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Taxes</span>
                                    <span className="text-white">Calculated at checkout</span>
                                </div>
                                <Separator className="bg-zinc-800" />
                                <div className="flex justify-between font-semibold">
                                    <span className="text-white">Total</span>
                                    <span className="text-white text-lg">${cart.total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <Link href="/account/cart" onClick={onClose}>
                                    <Button className="w-full h-11 bg-white hover:bg-gray-100 text-black font-medium">
                                        Proceed to Checkout
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    className="w-full h-11 border-zinc-700 hover:bg-zinc-800 text-white"
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
