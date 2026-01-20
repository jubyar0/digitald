"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function FulfillmentNotificationPage() {
    return (
        <div className="p-6 max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/seller/settings/notifications" className="p-2 hover:bg-accent rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <h1 className="text-2xl font-semibold">Fulfillment request notification</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost">Send test</Button>
                    <Button variant="default" className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">Edit code</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-medium">Preview</h2>

                    <Card className="bg-[#f1f1f1] dark:bg-muted/30 border-none shadow-none">
                        <CardContent className="p-8 min-h-[800px] font-serif text-[#262626] dark:text-gray-300">
                            <div className="mb-8">
                                <p className="text-sm">Subject: Order fulfillment request for My Store</p>
                            </div>

                            <div className="space-y-6">
                                <p>Please fulfill order #9999</p>
                                <p>Total number of items:</p>
                                <p>Unique items:</p>

                                <div className="pt-4">
                                    <p className="font-bold mb-2">Items to fulfill:</p>
                                </div>

                                <div className="pt-4">
                                    <p className="font-bold mb-2">Shipping Address:</p>
                                    <div className="text-sm space-y-1">
                                        <p>Steve Shopper Shipping Company</p>
                                        <p>123 Shipping Street</p>
                                        <p>Shippington, Kentucky</p>
                                        <p>40003</p>
                                        <p>United States</p>
                                        <p>Phone: 555-555-SHIP</p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <p className="font-bold mb-2">Shipping Method:</p>
                                    <p className="text-sm">Generic Shipping</p>
                                </div>

                                <div className="pt-4">
                                    <p className="font-bold mb-2">Tracking Number:</p>
                                    <p className="text-sm">None</p>
                                </div>

                                <div className="pt-4">
                                    <p className="font-bold mb-2">Customer Email:</p>
                                    <p className="text-sm">jon@example.com</p>
                                </div>

                                <div className="pt-8">
                                    <p>Thank you,</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar could go here if needed, but design shows full width preview mostly */}
                <div className="md:col-span-1">
                    {/* Placeholder for potential sidebar content */}
                </div>
            </div>
        </div>
    )
}
