import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"
import { getCart } from "@/actions/user-cart-wishlist"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, Heart, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function CartPage() {
    const session = await getCurrentSession()
    if (!session?.user) {
        redirect("/signin")
    }

    const cart = await getCart()

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <ShoppingCart className="h-8 w-8" />
                        Shopping Cart
                    </h2>
                    <p className="text-muted-foreground">
                        {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>
            </div>

            {cart.items.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <ShoppingCart className="h-24 w-24 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                        <p className="text-muted-foreground mb-6">
                            Start shopping to add products to your cart
                        </p>
                        <Link href="/">
                            <Button>
                                Browse Products
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-muted">
                                            {item.product.thumbnail ? (
                                                <Image
                                                    src={item.product.thumbnail}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                                    <ShoppingCart className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <h3 className="font-semibold line-clamp-1">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    By {item.product.vendor.name}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                                        -
                                                    </Button>
                                                    <span className="w-12 text-center">{item.quantity}</span>
                                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                                        +
                                                    </Button>
                                                </div>

                                                <Separator orientation="vertical" className="h-8" />

                                                <Button variant="ghost" size="sm">
                                                    <Heart className="mr-2 h-4 w-4" />
                                                    Save for later
                                                </Button>

                                                <Button variant="ghost" size="sm" className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">
                                                {item.product.currency} {item.product.price.toFixed(2)}
                                            </p>
                                            {item.quantity > 1 && (
                                                <p className="text-sm text-muted-foreground">
                                                    {item.product.currency} {(item.product.price * item.quantity).toFixed(2)} total
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">USD {cart.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span className="font-medium">$0.00</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>USD {cart.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button className="w-full" size="lg">
                                    Proceed to Checkout
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>

                                <div className="rounded-lg bg-muted p-4">
                                    <p className="text-xs text-muted-foreground text-center">
                                        🔒 Secure checkout with encrypted payment
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Accepted Payment Methods</h4>
                                    <div className="flex gap-2">
                                        <div className="rounded border bg-background p-2 text-xs font-medium">
                                            💳 Card
                                        </div>
                                        <div className="rounded border bg-background p-2 text-xs font-medium">
                                            PayPal
                                        </div>
                                        <div className="rounded border bg-background p-2 text-xs font-medium">
                                            ₿ Crypto
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
