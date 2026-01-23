import { Card, CardContent } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { CheckCircle2, Wand2, Search, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/dashboard/ui/dialog"

import { ShopNameEditor } from '@/components/dashboard/seller/shop-name-editor'

interface SetupGuideProps {
    storeName: string | null
    latestProduct?: {
        id: string
        name: string
        thumbnail: string | null
        price: number
    } | null
}

// Static list of sourcing apps as requested
const SOURCING_APPS = [
    {
        name: "AliExpress Dropshipping",
        description: "Find and import products from AliExpress",
        icon: "https://ae01.alicdn.com/kf/S7b1d4026972d46fbb720680d0b8d9d75x.png", // Placeholder or generic icon
        url: "/seller/app-store/aliexpress"
    },
    {
        name: "CJ Dropshipping",
        description: "Sourcing and fulfillment service",
        icon: "https://cc-west-usa.oss-us-west-1.aliyuncs.com/20200815/1597463660558.png",
        url: "/seller/app-store/cj-dropshipping"
    },
    {
        name: "Spocket",
        description: "US & EU Dropshipping Suppliers",
        icon: "https://assets.spocket.co/assets/logo/spocket_icon.svg",
        url: "/seller/app-store/spocket"
    },
    {
        name: "DSers",
        description: "AliExpress Dropshipping Solution",
        icon: "https://www.dsers.com/images/logo-icon.svg",
        url: "/seller/app-store/dsers"
    }
]

export function SetupGuide({ storeName, latestProduct }: SetupGuideProps) {
    return (
        <div className="space-y-6">
            <ShopNameEditor initialName={storeName} />

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="flex flex-col bg-card border-border shadow-sm">
                    <CardContent className="flex-1 flex flex-col items-center justify-center text-center space-y-4 pt-6 pb-4">
                        {latestProduct ? (
                            <>
                                <div className="relative w-36 h-44 bg-background rounded-xl overflow-hidden shadow-sm border p-2">
                                    <div className="w-full h-full bg-muted rounded-lg overflow-hidden relative">
                                        {latestProduct.thumbnail ? (
                                            <Image
                                                src={latestProduct.thumbnail}
                                                alt={latestProduct.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                                <div className="w-20 h-28 bg-primary/20 rounded-md shadow-sm"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm line-clamp-1 max-w-[200px]">{latestProduct.name}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {new Intl.NumberFormat('en-DZ', { style: 'currency', currency: 'DZD' }).format(latestProduct.price)}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-start text-left w-full px-2">
                                <div className="relative w-24 h-24 mb-4 bg-muted rounded-xl overflow-hidden shadow-sm border p-2 flex items-center justify-center">
                                    <div className="w-12 h-16 bg-background border rounded-md shadow-sm transform rotate-[-6deg] flex items-center justify-center">
                                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30"></div>
                                    </div>
                                </div>
                                <h3 className="font-medium mb-1 text-base">Discover products to sell</h3>
                                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                    Install a recommended app to find products from suppliers, or <Link href="/seller/products/add" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">add a product manually</Link>
                                </p>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                                            Find products
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px]">
                                        <DialogHeader>
                                            <DialogTitle>Find Products to Sell</DialogTitle>
                                            <DialogDescription>
                                                Connect with top suppliers and sourcing apps to fill your store.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                            {SOURCING_APPS.map((app) => (
                                                <div key={app.name} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                        <Search className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-sm">{app.name}</h4>
                                                        <p className="text-xs text-muted-foreground line-clamp-2">{app.description}</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
                                                        <Link href={app.url}>
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <Button variant="link" asChild>
                                                <Link href="/seller/app-store">Browse all apps</Link>
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </CardContent>
                    <div className="p-5 pt-0 mt-auto flex items-center justify-between">
                        {latestProduct ? (
                            <div className="flex items-center text-sm text-green-600 dark:text-green-500 font-medium">
                                <CheckCircle2 className="mr-2 h-5 w-5 fill-green-600 text-white dark:text-black" />
                                Products Added
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                No products added yet
                            </div>
                        )}
                        <Button variant="outline" size="sm" className="h-8" asChild>
                            <Link href="/seller/products/add">Add Manually</Link>
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col bg-card border-border shadow-sm">
                    <CardContent className="pt-6 pb-5 px-5 flex-1 flex flex-col justify-center">
                        <div className="relative h-28 mb-4 w-full flex justify-center">
                            {/* Abstract representation of theme selection */}
                            <div className="flex -space-x-8 items-center justify-center scale-100">
                                <div className="w-20 h-28 bg-background border rounded-lg shadow-sm transform -rotate-12 z-0 opacity-80"></div>
                                <div className="w-20 h-28 bg-background border rounded-lg shadow-sm transform rotate-0 z-10 flex flex-col p-2 gap-2">
                                    <div className="flex gap-1">
                                        <div className="h-10 w-1/3 bg-muted rounded-sm"></div>
                                        <div className="h-10 w-2/3 bg-muted rounded-sm"></div>
                                    </div>
                                    <div className="flex gap-1 flex-1">
                                        <div className="w-full bg-muted/30 rounded-sm"></div>
                                    </div>
                                    <div className="mt-auto self-end bg-muted/50 text-[8px] px-1.5 py-0.5 rounded font-bold">Aa</div>
                                </div>
                                <div className="w-20 h-28 bg-background border rounded-lg shadow-sm transform rotate-12 z-0 opacity-80"></div>
                            </div>
                        </div>

                        <h3 className="font-medium mb-1 text-base">Design Your Store</h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            Describe your business to generate custom themes or <Link href="/seller/settings/storefront" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">browse predefined themes</Link>
                        </p>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="theme-description"
                                name="theme-description"
                                placeholder="Modern handmade jewelry"
                                className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <Button size="sm" className="bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300 h-9 px-4">
                                <Wand2 className="mr-2 h-4 w-4" /> Generate
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
