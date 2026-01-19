'use client'

import { useState } from 'react'
import { PosLayout } from '@/features/pos/components/pos-layout'
import { ProductGrid } from '@/features/pos/components/product-grid'
import { Cart } from '@/features/pos/components/cart'
import { CheckoutDialog } from '@/features/pos/components/checkout-dialog'
import { processPosOrder } from '@/features/pos/actions'
import { toast } from 'sonner'

interface CartItem {
    productId: string
    name: string
    price: number
    quantity: number
}

export default function PosPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const addToCart = (product: any) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.productId === product.id)
            if (existing) {
                return prev.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            }]
        })
    }

    const updateQuantity = (productId: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.productId === productId) {
                const newQty = Math.max(0, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        }).filter(item => item.quantity > 0))
    }

    const removeItem = (productId: string) => {
        setCartItems(prev => prev.filter(item => item.productId !== productId))
    }

    const handleCheckout = async (method: 'CASH' | 'CARD', email?: string) => {
        setIsProcessing(true)
        try {
            const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

            const result = await processPosOrder({
                items: cartItems,
                totalAmount: total,
                paymentMethod: method,
                customerEmail: email
            })

            if (result.success) {
                toast.success('Order processed successfully')
                setCartItems([])
                setIsCheckoutOpen(false)
            }
        } catch (error) {
            toast.error('Failed to process order')
            console.error(error)
        } finally {
            setIsProcessing(false)
        }
    }

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return (
        <PosLayout>
            <ProductGrid onAddToCart={addToCart} />
            <Cart
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={() => setIsCheckoutOpen(true)}
                isProcessing={isProcessing}
            />
            <CheckoutDialog
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onConfirm={handleCheckout}
                total={total}
                isProcessing={isProcessing}
            />
        </PosLayout>
    )
}
