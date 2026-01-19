'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface CartItem {
    productId: string
    name: string
    price: number
    quantity: number
}

interface CartProps {
    items: CartItem[]
    onUpdateQuantity: (productId: string, delta: number) => void
    onRemoveItem: (productId: string) => void
    onCheckout: () => void
    isProcessing: boolean
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout, isProcessing }: CartProps) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.0 // Assuming 0 tax for now or handle via settings
    const total = subtotal + tax

    return (
        <div className="w-96 bg-background border-l flex flex-col h-full shadow-xl z-20">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Current Order</h2>
                <p className="text-sm text-muted-foreground">{items.length} items</p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            Cart is empty
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.productId} className="flex gap-3">
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                                    <div className="text-sm text-muted-foreground">
                                        ${item.price.toFixed(2)} x {item.quantity}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="font-bold text-sm">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => onUpdateQuantity(item.productId, -1)}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => onUpdateQuantity(item.productId, 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 bg-muted/10 border-t space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                <Button 
                    className="w-full h-12 text-lg" 
                    disabled={items.length === 0 || isProcessing}
                    onClick={onCheckout}
                >
                    {isProcessing ? (
                        'Processing...'
                    ) : (
                        <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Charge ${total.toFixed(2)}
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
