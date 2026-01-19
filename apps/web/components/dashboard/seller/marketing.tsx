import { Card, CardContent } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Marketing() {
    return (
        <div className="space-y-4 mb-4">
            {/* Plan Upgrade Banner */}
            <Card>
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-base">Your plan can pay for itself</h3>
                        <p className="text-sm text-muted-foreground max-w-xl">
                            Receive 1% on all your sales in subscription credits. Even without Shopify Payments, you still receive 0.5%. Credits apply automatically to your invoice.
                        </p>
                        <div className="pt-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/seller/settings/plan">Learn more</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 h-32 relative">
                        {/* Abstract coins illustration */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full h-full">
                                <div className="absolute top-0 right-10 w-16 h-16 bg-yellow-400 rounded-full shadow-lg transform rotate-12 border-4 border-yellow-500/50"></div>
                                <div className="absolute bottom-0 right-20 w-14 h-14 bg-yellow-400 rounded-full shadow-lg transform -rotate-12 border-4 border-yellow-500/50"></div>
                                <div className="absolute top-10 right-0 w-12 h-12 bg-yellow-400 rounded-full shadow-lg transform rotate-45 border-4 border-yellow-500/50"></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Editions Banner */}
            <div className="relative rounded-lg overflow-hidden bg-zinc-900 text-white min-h-[160px] flex flex-col justify-center p-8">
                {/* Background Image Placeholder - using a gradient/pattern for now */}
                <div className="absolute inset-0 bg-[url('https://cdn.shopify.com/shopifycloud/shopify/assets/admin/home/editions/winter-2025/banner-desktop-large-2x-c7a8a8a8a8a8a8a8.jpg')] bg-cover bg-center opacity-50"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>

                <div className="relative z-10 max-w-lg space-y-4">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            Shopify Editions <span className="text-white/80">|</span> Winter 2026
                        </h3>
                        <p className="text-base font-medium mt-1">The renaissance of commerce is here.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button variant="secondary" className="bg-white text-black hover:bg-gray-100 h-8 text-xs" asChild>
                            <Link href="https://www.shopify.com/editions/winter2025" target="_blank">
                                Discover over 150 updates
                            </Link>
                        </Button>
                        <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 text-xs" asChild>
                            <Link href="https://www.shopify.com/editions" target="_blank">
                                <Zap className="mr-2 h-3 w-3" />
                                /editions
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

