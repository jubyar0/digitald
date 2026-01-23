"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, MoreHorizontal, Info, Plus, Pencil, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function LocalDeliveryPage() {
    // State
    const [isLocationEnabled, setIsLocationEnabled] = useState(false)
    const [deliveryZoneType, setDeliveryZoneType] = useState<"postal" | "radius">("radius")
    const [radiusUnit, setRadiusUnit] = useState<"km" | "mi">("km")
    const [radiusDistance, setRadiusDistance] = useState("")
    const [includeNeighboring, setIncludeNeighboring] = useState(false)

    // Dialog states
    const [isAddZoneOpen, setIsAddZoneOpen] = useState(false)
    const [isCurrencyDialogOpen, setIsCurrencyDialogOpen] = useState(false)

    return (
        <div className="max-w-4xl mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/seller/settings/shipping">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Store className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-xl font-semibold">Local delivery for Shop location</h1>
            </div>

            {/* Location Status */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">Location status</CardTitle>
                        <Switch
                            checked={isLocationEnabled}
                            onCheckedChange={setIsLocationEnabled}
                        />
                    </div>
                    <CardDescription>
                        Deliver orders to customers directly from this location
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

                    {isLocationEnabled && (
                        <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Delivery prices for this location are in Algerian dinars (DZD).{" "}
                                <button
                                    onClick={() => setIsCurrencyDialogOpen(true)}
                                    className="text-primary hover:underline"
                                >
                                    Change Currency
                                </button>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {isLocationEnabled && (
                <>
                    {/* Delivery Zones */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Delivery zones</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <RadioGroup
                                value={deliveryZoneType}
                                onValueChange={(v) => setDeliveryZoneType(v as "postal" | "radius")}
                                className="space-y-4"
                            >
                                <div className="flex items-start space-x-3">
                                    <RadioGroupItem value="postal" id="postal" className="mt-1" />
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="postal" className="font-medium">Use postal codes</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Choose specific areas that you deliver to
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <RadioGroupItem value="radius" id="radius" className="mt-1" />
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="radius" className="font-medium">Set a delivery radius</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Set a distance around your location that you deliver to
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>

                            {deliveryZoneType === "radius" && (
                                <div className="pl-7 space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="neighboring"
                                            checked={includeNeighboring}
                                            onCheckedChange={(c) => setIncludeNeighboring(c as boolean)}
                                        />
                                        <Label htmlFor="neighboring" className="font-normal">Include neighboring states or regions</Label>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Measure radius in</Label>
                                        <RadioGroup
                                            value={radiusUnit}
                                            onValueChange={(v) => setRadiusUnit(v as "km" | "mi")}
                                            className="flex gap-6"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="km" id="km" />
                                                <Label htmlFor="km" className="font-normal">km</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="mi" id="mi" />
                                                <Label htmlFor="mi" className="font-normal">mi</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                            )}

                            {/* Zone List */}
                            <div className="border-t border-border pt-4">
                                <div className="flex items-center justify-between p-4 border border-border rounded-lg mb-4">
                                    <div>
                                        <p className="text-sm font-medium">Local Delivery</p>
                                        <p className="text-sm text-muted-foreground">
                                            Up to 10mi • No delivery information
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">No minimum order</span>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">Free</span>
                                        <Button variant="outline" size="sm" className="h-8" onClick={() => setIsAddZoneOpen(true)}>
                                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                                            Edit
                                        </Button>
                                    </div>
                                </div>

                                <Button variant="outline" size="sm" onClick={() => setIsAddZoneOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add zone
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Manage local deliveries */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Manage local deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Get an optimized route or plan the order of delivery stops yourself. With local delivery apps, you and your staff can view routes, contact customers, update delivery statuses, and more.
                            </p>
                            <Button variant="outline" size="sm">
                                <Link href="#" className="flex items-center gap-2">
                                    <div className="grid grid-cols-2 gap-0.5">
                                        <div className="w-1 h-1 bg-current rounded-full" />
                                        <div className="w-1 h-1 bg-current rounded-full" />
                                        <div className="w-1 h-1 bg-current rounded-full" />
                                        <div className="w-1 h-1 bg-current rounded-full" />
                                    </div>
                                    Recommended local delivery apps
                                </Link>
                            </Button>
                            <div className="mt-4 flex justify-end">
                                <Button variant="outline" size="sm">
                                    View apps
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
            {/* Add/Edit Zone Dialog */}
            <Dialog open={isAddZoneOpen} onOpenChange={setIsAddZoneOpen}>
                <DialogContent className="max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add zone</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="zoneName">Zone name</Label>
                            <div className="relative">
                                <Input id="zoneName" defaultValue="Local Delivery" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">14/50</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Delivery radius from 10 mi up to</Label>
                            <div className="relative w-1/3">
                                <Input defaultValue="" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">mi</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="minPrice">Minimum order price</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">DZD</span>
                                    <Input id="minPrice" className="pl-12" defaultValue="0.00" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deliveryPrice">Delivery price</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">DZD</span>
                                    <Input id="deliveryPrice" className="pl-12" defaultValue="0.00" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Free</span>
                                </div>
                            </div>
                        </div>

                        <button className="text-sm text-primary hover:underline font-medium">
                            Add conditional pricing
                        </button>

                        <div className="space-y-2">
                            <Label htmlFor="deliveryInfo">Delivery information</Label>
                            <textarea
                                id="deliveryInfo"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder=""
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>This message will appear at checkout and in the <Link href="#" className="text-primary hover:underline">order confirmation notification</Link></span>
                                <span>0/255</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddZoneOpen(false)}>Cancel</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setIsAddZoneOpen(false)}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Change Currency Dialog */}
            <Dialog open={isCurrencyDialogOpen} onOpenChange={setIsCurrencyDialogOpen}>
                <DialogContent className="max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Change Currency</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Set the currency for your local delivery price at checkout
                        </p>

                        <RadioGroup defaultValue="default" className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <RadioGroupItem value="default" id="default" className="mt-1" />
                                <div className="grid gap-1.5">
                                    <Label htmlFor="default" className="font-medium">Use store default</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Local delivery price will be displayed in Algerian dinars (DZD)
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <RadioGroupItem value="list" id="list" className="mt-1" />
                                <div className="grid gap-1.5 w-full">
                                    <Label htmlFor="list" className="font-medium">Choose from a list</Label>
                                    <div className="relative">
                                        <Input disabled defaultValue="Algerian Dinar (DZD)" className="bg-muted text-muted-foreground" />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCurrencyDialogOpen(false)}>Cancel</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setIsCurrencyDialogOpen(false)}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
