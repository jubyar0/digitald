import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"
import { getPurchasedProducts } from "@/actions/user-cart-wishlist"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Package, FileText, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function DownloadsPage() {
    const session = await getCurrentSession()
    if (!session?.user) {
        redirect("/signin")
    }

    const downloads = await getPurchasedProducts(1, 12)

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Download className="h-8 w-8" />
                        My Downloads
                    </h2>
                    <p className="text-muted-foreground">
                        {downloads.total} purchased {downloads.total === 1 ? 'product' : 'products'}
                    </p>
                </div>
            </div>

            {downloads.products.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Package className="h-24 w-24 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Products you purchase will appear here for download
                        </p>
                        <Link href="/">
                            <Button>
                                Browse Products
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {downloads.products.map((product) => (
                        <Card key={product.id}>
                            <CardContent className="p-6">
                                <div className="flex gap-6">
                                    {/* Product Image */}
                                    <div className="relative h-32 w-32 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                                        {product.thumbnail ? (
                                            <Image
                                                src={product.thumbnail}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <Package className="h-12 w-12 text-muted-foreground/50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-semibold">{product.name}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        By {product.vendor.name}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary">
                                                    v{product.currentVersion}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>
                                                Purchased: {new Date(product.purchasedAt).toLocaleDateString()}
                                            </span>
                                            <span>•</span>
                                            <Link
                                                href={`/user/orders/${product.orderId}`}
                                                className="hover:text-primary hover:underline"
                                            >
                                                Order #{product.orderId.slice(-8)}
                                            </Link>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button size="sm">
                                                <Download className="mr-2 h-4 w-4" />
                                                Download Files
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <FileText className="mr-2 h-4 w-4" />
                                                View License
                                            </Button>
                                            {product.latestVersion && (
                                                <Button size="sm" variant="outline">
                                                    <Package className="mr-2 h-4 w-4" />
                                                    Download v{product.latestVersion.version}
                                                </Button>
                                            )}
                                        </div>

                                        {product.latestVersion && product.latestVersion.version !== product.currentVersion && (
                                            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 border border-blue-200 dark:border-blue-800">
                                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                    🎉 New version available: v{product.latestVersion.version}
                                                </p>
                                                {product.latestVersion.changelog && (
                                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                                        {product.latestVersion.changelog}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {downloads.totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-6">
                    <Button variant="outline" disabled={downloads.page === 1}>
                        Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-muted-foreground">
                        Page {downloads.page} of {downloads.totalPages}
                    </span>
                    <Button variant="outline" disabled={downloads.page === downloads.totalPages}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}
