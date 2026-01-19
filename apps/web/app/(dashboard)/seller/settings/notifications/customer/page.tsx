"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CustomerNotificationsPage() {
    return (
        <div className="p-6 max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/seller/settings/notifications" className="p-2 hover:bg-accent rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <h1 className="text-2xl font-semibold">Customer notifications</h1>
                </div>
                <Button variant="outline">Customize email templates</Button>
            </div>

            {/* Order Processing */}
            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Order processing</CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                    <NotificationItem
                        title="Order confirmation"
                        description="Sent automatically to the customer after they place their order"
                    />
                    <NotificationItem
                        title="Order edited"
                        description="Sent to the customer after their order is edited (if you select this option)"
                    />
                    <NotificationItem
                        title="Order invoice"
                        description="Sent to the customer when the order has an outstanding balance"
                    />
                    <NotificationItem
                        title="Order cancelled"
                        description="Sent automatically to the customer if their order is cancelled (if you select this option)"
                    />
                    <NotificationItem
                        title="Order refund"
                        description="Sent automatically to the customer if their order is refunded (if you select this option)"
                    />
                    <NotificationItem
                        title="Draft order invoice"
                        description="Sent when you create an invoice for a draft order"
                    />
                    <NotificationItem
                        title="Abandoned checkout"
                        description="Sent to the customer if they leave checkout before buying the items in their cart"
                    />
                </CardContent>
            </Card>

            {/* Local Pickup */}
            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Local pickup</CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                    <NotificationItem
                        title="Ready for pickup"
                        description="Sent to the customer when their order is ready to be picked up"
                    />
                    <NotificationItem
                        title="Picked up"
                        description="Sent to the customer when the order is marked as picked up"
                    />
                </CardContent>
            </Card>

            {/* Local Delivery */}
            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Local delivery</CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                    <NotificationItem
                        title="Out for delivery"
                        description="Sent to the customer when their local order is out for delivery"
                        hasSwitch
                    />
                    <NotificationItem
                        title="Delivered"
                        description="Sent to the customer when their local order is delivered"
                        hasSwitch
                    />
                    <NotificationItem
                        title="Missed delivery"
                        description="Sent to the customer when their local delivery is missed"
                        hasSwitch
                    />
                </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Shipping</CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                    <NotificationItem
                        title="Shipping confirmation"
                        description="Sent automatically to the customer when their order is fulfilled (if you select this option)"
                    />
                    <NotificationItem
                        title="Shipping update"
                        description="Sent automatically to the customer if their fulfilled order's tracking number is updated (if you select this option)"
                    />
                    <NotificationItem
                        title="Out for delivery"
                        description="Sent to the customer when their order is out for delivery"
                        hasSwitch
                    />
                    <NotificationItem
                        title="Delivered"
                        description="Sent to the customer when their order is delivered"
                        hasSwitch
                    />
                </CardContent>
            </Card>

            {/* Customer Account */}
            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Customer account</CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                    <NotificationItem
                        title="Customer account invite"
                        description="Sent to the customer with account activation instructions"
                    />
                    <NotificationItem
                        title="Customer account welcome"
                        description="Sent to the customer when they complete their account activation"
                    />
                    <NotificationItem
                        title="Customer account password reset"
                        description="Sent to the customer when they ask to reset their account password"
                    />
                    <NotificationItem
                        title="B2B access email"
                        description="Sent to the customer when they are invited to buy from your B2B store"
                    />
                </CardContent>
            </Card>

            {/* Marketing */}
            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Marketing</CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                    <NotificationItem
                        title="Customer marketing confirmation"
                        description="Sent to the customer when they sign up for email marketing (if you select this option)"
                        hasSwitch
                    />
                </CardContent>
            </Card>

            {/* Returns */}
            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Returns</CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                    <NotificationItem
                        title="Return request confirmation"
                        description="Sent automatically to the customer when they request a return"
                    />
                    <NotificationItem
                        title="Return request approved"
                        description="Sent automatically to the customer when their return request is approved"
                    />
                    <NotificationItem
                        title="Return request declined"
                        description="Sent automatically to the customer when their return request is declined"
                    />
                </CardContent>
            </Card>
        </div>
    )
}

function NotificationItem({ title, description, hasSwitch = false }: { title: string, description: string, hasSwitch?: boolean }) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer group">
            <div className="flex-1 pr-4">
                <p className="font-medium text-sm text-[#262626] dark:text-gray-200 group-hover:underline decoration-dotted underline-offset-4">{title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            </div>
            <div className="flex items-center gap-4">
                {hasSwitch && <Switch />}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
        </div>
    )
}
