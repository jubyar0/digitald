import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSellerProfile } from "@/actions/seller"
import {
    Box,
    Tag,
    History,
    HelpCircle,
    Users,
    Keyboard,
    Activity,
    ChevronRight
} from "lucide-react"
import { StoreDetailsCard } from "./store-details-card"
import Link from "next/link"

import { StoreDefaultsCard } from "./store-defaults-card"
import { OrderIdCard } from "./order-id-card"
import { OrderProcessingCard } from "./order-processing-card"

export const dynamic = 'force-dynamic'

export default async function GeneralSettingsPage() {
    const profile = await getSellerProfile()

    // Map profile data to match StoreDetailsCard interface
    const settings = (profile as any)?.settings

    const storeProfile = profile ? {
        businessName: (profile as any).name || (profile as any).vendorName,
        contactEmail: settings?.supportEmail || (profile as any).email,
        phone: settings?.supportPhone || null,
        address: settings?.address || (profile as any).location,
        city: settings?.city || null,
        state: settings?.state || null,
        zipCode: settings?.zipCode || null,
        country: settings?.country || (profile as any).location, // Fallback to location if country is missing
        apartment: settings?.apartment || null
    } : null

    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">General</h1>
                    <p className="text-sm text-muted-foreground">
                        View and update your store details
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Store Details */}
                <StoreDetailsCard profile={storeProfile} />

                {/* Store Defaults */}
                <StoreDefaultsCard settings={settings} />

                {/* Order ID */}
                <OrderIdCard settings={settings} />

                {/* Order Processing */}
                <OrderProcessingCard settings={settings} />

                {/* Store Assets */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Store assets</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            <Link href="/seller/settings/metafields" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <Box className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium text-sm">Metafields</p>
                                        <p className="text-sm text-muted-foreground">Available in themes and configurable for Storefront API</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                            <Link href="/seller/settings/brand" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium text-sm">Brand</p>
                                        <p className="text-sm text-muted-foreground">Integrate brand assets across sales channels, themes and apps</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Resources */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <History className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium text-sm">Change log</span>
                                </div>
                                <Button variant="outline" size="sm">View change log</Button>
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium text-sm">dIGO Help Center</span>
                                </div>
                                <Button variant="outline" size="sm">Get help</Button>
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium text-sm">Hire a dIGO Partner</span>
                                </div>
                                <Button variant="outline" size="sm">Hire a Partner</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Keyboard className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium text-sm">Keyboard shortcuts</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Activity className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium text-sm">Store activity log</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Organizations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Organizations and store transfers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground max-w-[80%]">
                                Group your stores together in an organization or transfer this store to a new owner outside your business. <Link href="#" className="text-blue-600 hover:underline">Learn more</Link>
                            </p>
                            <Button variant="outline" size="sm">Manage</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
