import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { Badge } from '@/components/dashboard/ui/badge'
import { CheckCircle2, CreditCard, Truck, Globe, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function Configuration() {
    return (
        <div className="grid gap-6 md:grid-cols-3 mb-4 mt-8">
            {/* Payment Provider */}
            <Card className="flex flex-col bg-[#f7f7f7] dark:bg-[hsl(213.33deg_11.11%_15.88%)] border-border shadow-sm overflow-hidden rounded-[20px]">
                <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-medium leading-tight">Set up a payment provider</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col px-4 pb-4">
                    <div className="flex items-center justify-center my-4">
                        <Image
                            src="/media/illustrations/18.svg"
                            alt="Payment illustration"
                            width={120}
                            height={100}
                            className="h-16 w-auto object-contain dark:hidden"
                        />
                        <Image
                            src="/media/illustrations/18-dark.svg"
                            alt="Payment illustration"
                            width={120}
                            height={100}
                            className="h-16 w-auto object-contain hidden dark:block"
                        />
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center flex-nowrap gap-3">
                            {/* Payment Logos */}
                            <Image
                                src="/media/brand-logos/paypal.svg"
                                alt="PayPal"
                                width={0}
                                height={0}
                                unoptimized
                                className="h-5 w-auto object-contain brightness-0 dark:brightness-0 dark:invert"
                                style={{ width: 'auto' }}
                            />
                            <Image
                                src="/media/brand-logos/visa.svg"
                                alt="Visa"
                                width={0}
                                height={0}
                                unoptimized
                                className="h-5 w-auto object-contain brightness-0 dark:brightness-0 dark:invert"
                                style={{ width: 'auto' }}
                            />
                            <Image
                                src="/media/brand-logos/american-express.svg"
                                alt="American Express"
                                width={0}
                                height={0}
                                unoptimized
                                className="h-5 w-auto object-contain brightness-0 dark:brightness-0 dark:invert"
                                style={{ width: 'auto' }}
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-8" asChild>
                            <Link href="/seller/settings/payments">Activate</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Shipping Rates */}
            <Card className="flex flex-col bg-[#f7f7f7] dark:bg-[hsl(213.33deg_11.11%_15.88%)] border-border shadow-sm overflow-hidden rounded-[20px]">
                <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-5 w-5 fill-green-600 text-white dark:text-black" />
                        <CardTitle className="text-sm font-medium">Verified shipping rates</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col px-4 pb-4">
                    <div className="flex items-center justify-center my-4">
                        <Image
                            src="/media/illustrations/21.svg"
                            alt="Shipping illustration"
                            width={120}
                            height={100}
                            className="h-16 w-auto object-contain dark:hidden"
                        />
                        <Image
                            src="/media/illustrations/21-dark.svg"
                            alt="Shipping illustration"
                            width={120}
                            height={100}
                            className="h-16 w-auto object-contain hidden dark:block"
                        />
                    </div>
                    <div className="mt-auto flex items-center space-x-3">
                        <Image
                            src="/media/flags/algeria.svg"
                            alt="Algeria Flag"
                            width={32}
                            height={24}
                            className="h-6 w-8 rounded object-cover"
                        />
                        <span className="text-sm font-medium bg-background px-3 py-1 rounded-full border shadow-sm text-foreground">National</span>
                        <Button variant="outline" size="sm" className="bg-background h-8 ml-auto" asChild>
                            <Link href="/seller/settings/shipping">Edit</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Your plan can pay for itself */}
            <Card className="flex flex-col bg-[#f7f7f7] dark:bg-[hsl(213.33deg_11.11%_15.88%)] border-border shadow-sm overflow-hidden rounded-[20px]">
                <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-medium">Your plan can pay for itself</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col px-4 pb-4">
                    <div className="flex items-center justify-center my-4">
                        <Image
                            src="/media/illustrations/19.svg"
                            alt="Plan illustration"
                            width={120}
                            height={100}
                            className="h-16 w-auto object-contain dark:hidden"
                        />
                        <Image
                            src="/media/illustrations/19-dark.svg"
                            alt="Plan illustration"
                            width={120}
                            height={100}
                            className="h-16 w-auto object-contain hidden dark:block"
                        />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Discover how to maximize your store's potential
                    </p>
                    <div className="mt-auto">
                        <Button variant="outline" size="sm" className="h-8" asChild>
                            <Link href="/seller/settings/billing">Learn more</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
