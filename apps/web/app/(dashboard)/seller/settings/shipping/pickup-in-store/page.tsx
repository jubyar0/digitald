"use client"

import { useState } from "react"
import Link from "next/link"
import { Store, MapPin, Info, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function PickupInStorePage() {
    const [isPickupEnabled, setIsPickupEnabled] = useState(false)
    const [processingTime, setProcessingTime] = useState("24hours")
    const [notificationText, setNotificationText] = useState("Bring your confirmation email when you come to collect your order.")

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/seller/settings/shipping">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Store className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-xl font-semibold">In-store pickup for Shop location</h1>
            </div>

            {/* Location Status */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">Location status</CardTitle>
                        <Switch
                            checked={isPickupEnabled}
                            onCheckedChange={setIsPickupEnabled}
                        />
                    </div>
                    <CardDescription>
                        Let customers pick up orders directly at this location
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-3 p-3 border border-border rounded-lg bg-muted/30">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Shop location</p>
                            <p className="text-sm text-muted-foreground">Algeria</p>
                        </div>
                    </div>

                    {isPickupEnabled && (
                        <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Learn more about <Link href="#" className="text-primary hover:underline">in-store pickup</Link>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {isPickupEnabled && (
                <>
                    {/* Expected pickup date */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Expected pickup date</CardTitle>
                            <CardDescription>
                                Choose order processing time shown to customers at storefront and checkout
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select value={processingTime} onValueChange={setProcessingTime}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select processing time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1hour">Usually ready in 1 hour</SelectItem>
                                    <SelectItem value="2hours">Usually ready in 2 hours</SelectItem>
                                    <SelectItem value="4hours">Usually ready in 4 hours</SelectItem>
                                    <SelectItem value="24hours">Usually ready in 24 hours</SelectItem>
                                    <SelectItem value="2days">Usually ready in 2-4 days</SelectItem>
                                    <SelectItem value="5days">Usually ready in 5+ days</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Ready for pickup notification */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Ready for pickup notification</CardTitle>
                            <CardDescription>
                                This message will be sent when the order is marked as ready for pickup
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <Textarea
                                    value={notificationText}
                                    onChange={(e) => setNotificationText(e.target.value)}
                                    className="min-h-[100px] resize-none"
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                    {notificationText.length}/255
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Checkout preview */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Checkout preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border border-border rounded-lg p-4 bg-muted/10">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            <div className="h-4 w-4 rounded-full border-4 border-blue-500 bg-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Shop location</p>
                                            <p className="text-xs text-muted-foreground">Algeria</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">FREE</p>
                                        <p className="text-xs text-muted-foreground">
                                            {processingTime === "1hour" && "Usually ready in 1 hour"}
                                            {processingTime === "2hours" && "Usually ready in 2 hours"}
                                            {processingTime === "4hours" && "Usually ready in 4 hours"}
                                            {processingTime === "24hours" && "Usually ready in 24 hours"}
                                            {processingTime === "2days" && "Usually ready in 2-4 days"}
                                            {processingTime === "5days" && "Usually ready in 5+ days"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    Location name and address shown at checkout are set in <Link href="#" className="text-primary hover:underline">location settings</Link>
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Learn more about <Link href="#" className="text-primary hover:underline">in-store pickup</Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
