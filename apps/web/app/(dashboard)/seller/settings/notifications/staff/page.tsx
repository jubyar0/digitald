"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronRight, ArrowLeft, PlusCircle, MoreHorizontal, Mail } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function StaffNotificationsPage() {
    return (
        <div className="p-6 max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/seller/settings/notifications" className="p-2 hover:bg-accent rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </Link>
                <h1 className="text-2xl font-semibold">Staff notifications</h1>
            </div>

            {/* Notification Types */}
            <Card>
                <CardContent className="p-0 divide-y">
                    <NotificationItem
                        title="Store order summary"
                        description="Sent every Monday 9:00 AM GMT+1"
                        hasSwitch
                    />
                    <NotificationItem
                        title="New order"
                        description="Sent when a customer places an order"
                        hasSwitch
                    />
                    <NotificationItem
                        title="New return request"
                        description="Sent when a customer requests a return on an order"
                        hasSwitch
                    />
                    <NotificationItem
                        title="Sales attribution edited"
                        description="Sent to order notification subscribers when the attributed staff on an order is edited."
                        hasSwitch
                    />
                    <NotificationItem
                        title="New draft order"
                        description="Sent when a customer submits a draft order. Only sent to store owner"
                        hasSwitch
                    />
                </CardContent>
            </Card>

            {/* Recipients */}
            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-base font-semibold">Recipients</CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                    {/* Existing Recipient */}
                    <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-medium text-sm text-[#262626] dark:text-gray-200">Alouana Ali <span className="text-muted-foreground font-normal">alouanaa@gmail.com</span></p>
                                <p className="text-xs text-muted-foreground mt-0.5">All orders</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>

                    {/* Add Recipient Button */}
                    <div className="p-4">
                        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent">
                            <PlusCircle className="h-5 w-5" />
                            Add recipient
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function NotificationItem({ title, description, hasSwitch = false }: { title: string, description: string, hasSwitch?: boolean }) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer group">
            <div className="flex-1 pr-4">
                <p className="font-medium text-sm text-[#262626] dark:text-gray-200">{title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            </div>
            <div className="flex items-center gap-4">
                {hasSwitch && <Switch />}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
        </div>
    )
}
