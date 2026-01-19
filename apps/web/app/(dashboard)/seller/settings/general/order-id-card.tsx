"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { updateOrderIdFormat } from "@/actions/seller"
import { toast } from "sonner"

interface OrderIdCardProps {
    settings?: {
        orderIdPrefix: string | null
        orderIdSuffix: string | null
    } | null
}

export function OrderIdCard({ settings }: OrderIdCardProps) {
    const [prefix, setPrefix] = useState(settings?.orderIdPrefix || "#")
    const [suffix, setSuffix] = useState(settings?.orderIdSuffix || "")
    const [isLoading, setIsLoading] = useState(false)

    async function handleSave() {
        setIsLoading(true)
        try {
            const result = await updateOrderIdFormat({ prefix, suffix })
            if (result.success) {
                toast.success("Order ID format updated")
            } else {
                toast.error("Failed to update Order ID format")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Order ID</CardTitle>
                <CardDescription>
                    Shown on the order page, customer pages, and customer order notifications to identify order
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="prefix">Prefix</Label>
                        <Input
                            id="prefix"
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="suffix">Suffix</Label>
                        <Input
                            id="suffix"
                            value={suffix}
                            onChange={(e) => setSuffix(e.target.value)}
                        />
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    Your order ID will appear as {prefix}1001{suffix}, {prefix}1002{suffix}, {prefix}1003{suffix} ...
                </p>
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
