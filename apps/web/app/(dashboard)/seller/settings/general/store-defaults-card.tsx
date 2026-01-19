"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { updateStoreDefaults } from "@/actions/seller"
import { toast } from "sonner"

interface StoreDefaultsProps {
    settings?: {
        currency: string
        timezone: string
        unitSystem: string
        weightUnit: string
    } | null
}

export function StoreDefaultsCard({ settings }: StoreDefaultsProps) {
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
    const [isFormattingOpen, setIsFormattingOpen] = useState(false)

    const [currency, setCurrency] = useState(settings?.currency || "DZD")
    const [timezone, setTimezone] = useState(settings?.timezone || "WAT")
    const [unitSystem, setUnitSystem] = useState(settings?.unitSystem || "metric")
    const [weightUnit, setWeightUnit] = useState(settings?.weightUnit || "kg")

    async function handleUpdate(field: string, value: string) {
        // Optimistic update
        if (field === "currency") setCurrency(value)
        if (field === "timezone") setTimezone(value)
        if (field === "unitSystem") setUnitSystem(value)
        if (field === "weightUnit") setWeightUnit(value)

        const data = {
            currency: field === "currency" ? value : currency,
            timezone: field === "timezone" ? value : timezone,
            unitSystem: field === "unitSystem" ? value : unitSystem,
            weightUnit: field === "weightUnit" ? value : weightUnit,
        }

        try {
            const result = await updateStoreDefaults(data)
            if (result.success) {
                toast.success("Store defaults updated")
            } else {
                toast.error("Failed to update store defaults")
                // Revert on failure (could be improved)
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Store defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Currency Display */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Currency display</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                                {currency === "DZD" ? "Algerian Dinar (DZD)" :
                                    currency === "USD" ? "US Dollar (USD)" :
                                        currency === "EUR" ? "Euro (EUR)" : currency}
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsCurrencyOpen(true)}>
                                        Change store currency
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setIsFormattingOpen(true)}>
                                        Change currency formatting
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        To manage the currencies customers see, go to <Link href="#" className="text-blue-600 hover:underline">Markets</Link>
                    </p>
                </div>

                {/* Backup Region */}
                <div className="space-y-2">
                    <Label>Backup Region</Label>
                    <Select defaultValue="DZ" disabled>
                        <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DZ">Algeria</SelectItem>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        Determines settings for customers outside of your markets
                    </p>
                </div>

                {/* Units */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Unit system</Label>
                        <Select value={unitSystem} onValueChange={(val) => handleUpdate("unitSystem", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select system" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="metric">Metric system</SelectItem>
                                <SelectItem value="imperial">Imperial system</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Default weight unit</Label>
                        <Select value={weightUnit} onValueChange={(val) => handleUpdate("weightUnit", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                <SelectItem value="g">Gram (g)</SelectItem>
                                <SelectItem value="lb">Pound (lb)</SelectItem>
                                <SelectItem value="oz">Ounce (oz)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                    <Label>Time zone</Label>
                    <Select value={timezone} onValueChange={(val) => handleUpdate("timezone", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="WAT">(GMT+01:00) West Central Africa</SelectItem>
                            <SelectItem value="UTC">(GMT+00:00) UTC</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        Sets the time for when orders and analytics are recorded
                    </p>
                </div>

                <p className="text-sm text-muted-foreground pt-2">
                    To change your user level time zone and language visit your <Link href="#" className="text-blue-600 hover:underline">account settings</Link>
                </p>

                {/* Change Store Currency Dialog */}
                <Dialog open={isCurrencyOpen} onOpenChange={setIsCurrencyOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Change store currency</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label>Store currency</Label>
                                <Select value={currency} onValueChange={(val) => handleUpdate("currency", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DZD">Algerian Dinar (DZD)</SelectItem>
                                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label>Reason for changing (optional)</Label>
                                <RadioGroup className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="testing" id="testing" />
                                        <Label htmlFor="testing" className="font-normal">Testing payment processors not available in current currency</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="mismatch" id="mismatch" />
                                        <Label htmlFor="mismatch" className="font-normal">Default currency does not match my intended choice</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="experimenting" id="experimenting" />
                                        <Label htmlFor="experimenting" className="font-normal">Experimenting with different markets</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="other" id="other" />
                                        <Label htmlFor="other" className="font-normal">Other</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCurrencyOpen(false)}>Cancel</Button>
                            <Button onClick={() => setIsCurrencyOpen(false)}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Change Currency Formatting Dialog */}
                <Dialog open={isFormattingOpen} onOpenChange={setIsFormattingOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Change currency formatting</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <p className="text-sm text-muted-foreground">
                                Change how currencies are displayed on your store. {"{{amount}}"} and {"{{amount_no_decimals}}"} will be replaced with the price of your product.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>HTML with currency</Label>
                                    <Input defaultValue="DA {{amount}} DZD" />
                                </div>
                                <div className="space-y-2">
                                    <Label>HTML without currency</Label>
                                    <Input defaultValue="DA {{amount}}" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email with currency</Label>
                                    <Input defaultValue="DA {{amount}} DZD" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email without currency</Label>
                                    <Input defaultValue="DA {{amount}}" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsFormattingOpen(false)}>Cancel</Button>
                            <Button onClick={() => setIsFormattingOpen(false)}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}
