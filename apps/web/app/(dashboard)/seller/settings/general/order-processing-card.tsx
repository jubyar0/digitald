"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Info } from "lucide-react"
import { updateOrderProcessing } from "@/actions/seller"
import { toast } from "sonner"

interface OrderProcessingCardProps {
    settings?: {
        autoFulfill: boolean
        autoFulfillGiftCards: boolean
        autoArchive: boolean
    } | null
}

export function OrderProcessingCard({ settings }: OrderProcessingCardProps) {
    // Determine initial radio value
    const getInitialRadioValue = () => {
        if (settings?.autoFulfill) return "auto-fulfill"
        if (settings?.autoFulfillGiftCards) return "gift-cards"
        return "dont-fulfill"
    }

    const [radioValue, setRadioValue] = useState(getInitialRadioValue())
    const [autoArchive, setAutoArchive] = useState(settings?.autoArchive ?? true)

    async function handleUpdate(type: "radio" | "archive", value: string | boolean) {
        let newRadioValue = radioValue
        let newAutoArchive = autoArchive

        if (type === "radio") {
            newRadioValue = value as string
            setRadioValue(newRadioValue)
        } else {
            newAutoArchive = value as boolean
            setAutoArchive(newAutoArchive)
        }

        const data = {
            autoFulfill: newRadioValue === "auto-fulfill",
            autoFulfillGiftCards: newRadioValue === "gift-cards",
            autoArchive: newAutoArchive
        }

        try {
            const result = await updateOrderProcessing(data)
            if (result.success) {
                toast.success("Order processing settings updated")
            } else {
                toast.error("Failed to update settings")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <CardTitle className="text-base">Order processing</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label className="text-base font-normal">After an order has been paid</Label>
                    <RadioGroup value={radioValue} onValueChange={(val) => handleUpdate("radio", val)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="auto-fulfill" id="auto-fulfill" />
                            <Label htmlFor="auto-fulfill" className="font-normal">Automatically fulfill the order's line items</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="gift-cards" id="gift-cards" />
                            <Label htmlFor="gift-cards" className="font-normal">Automatically fulfill only the gift cards of the order</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dont-fulfill" id="dont-fulfill" />
                            <Label htmlFor="dont-fulfill" className="font-normal">Don't fulfill any of the order's line items automatically</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-3 pt-4 border-t">
                    <Label className="text-base font-normal">After an order has been fulfilled and paid, or when all items have been refunded</Label>
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="archive"
                            checked={autoArchive}
                            onCheckedChange={(checked) => handleUpdate("archive", checked === true)}
                            className="mt-1"
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="archive" className="font-medium">
                                Automatically archive the order
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                The order will be removed from your list of open orders.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
