import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"
import { getWishlist } from "@/actions/user-cart-wishlist"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function WishlistPage() {
    const session = await getCurrentSession()
    if (!session?.user) {
        redirect("/signin")
    }

    const wishlist = await getWishlist(1, 12)

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Heart className="h-8 w-8 fill-current" />
                        My Wishlist
                    </h2>
                    <p className="text-muted-foreground">
                        {wishlist.total} {wishlist.total === 1 ? 'item' : 'items'} saved
                    </p>
                </div>
            </div>

            {wishlist.items.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Heart className="h-24 w-24 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                        <p className="text-muted-foreground mb-6">
                            Save products you love for later
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
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {wishlist.items.map((item) => (
                        <Card key={item.id} className="group overflow-hidden">
                            <div className="relative aspect-square overflow-hidden bg-muted">
                                {item.product.thumbnail ? (
                                    <Image
                                        src={item.product.thumbnail}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
                                    </div>
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="sm" variant="secondary">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Add to Cart
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Heart Icon */}
                                <div className="absolute top-2 right-2">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 rounded-full"
                                    >
                                        <Heart className="h-4 w-4 fill-current text-red-500" />
                                    </Button>
                                </div>
                            </div>

                            <CardContent className="p-4 space-y-2">
                                <div>
                                    <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        By {item.product.vendor.name}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-xl font-bold">
                                        {item.product.currency} {item.product.price.toFixed(2)}
                                    </p>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Added {new Date(item.addedAt).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {wishlist.totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-6">
                    <Button variant="outline" disabled={wishlist.page === 1}>
                        Previous
                    </Button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: wishlist.totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === wishlist.page ? "default" : "outline"}
                                size="icon"
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button variant="outline" disabled={wishlist.page === wishlist.totalPages}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}
