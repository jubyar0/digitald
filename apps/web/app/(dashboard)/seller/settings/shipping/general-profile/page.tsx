"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card"
import { Button } from "@/components/dashboard/ui/button"
import { Separator } from "@/components/dashboard/ui/separator"
import { Input } from "@/components/dashboard/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/dashboard/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/dashboard/ui/select"
import { Label } from "@/components/dashboard/ui/label"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/dashboard/ui/tooltip"
import Link from "next/link"
import Image from "next/image"
import { Wifi, Pencil, MoreHorizontal, Plus, Globe, AlertTriangle, Info, Search } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

// Shipping zone data
const shippingZones = [
    {
        id: "domestic",
        name: "Domestic",
        country: "Algeria",
        flag: "/media/flags/algeria.svg",
        rates: [
            { id: 1, name: "Standard", price: "DZD 1,400.00" }
        ]
    },
    {
        id: "international",
        name: "International",
        countries: "United Arab Emirates, Austria, Australia",
        moreCount: 25,
        moreCountries: "Belgium, Canada, Switzerland, Czechia, Germany, Denmark, Spain, Finland, France, United Kingdom, Hong Kong SAR, Ireland, Israel, Italy, Japan, South Korea, Malaysia, Netherlands, Norway, New Zealand, Poland, Portugal, Sweden, Singapore, United States",
        warning: {
            count: 28,
            message: "To start selling to",
            suffix: "in this zone, include them in a"
        },
        rates: [
            { id: 1, name: "International", price: "DZD 2,500.00" }
        ]
    }
]

export default function GeneralProfilePage() {
    const [isManageRatesOpen, setIsManageRatesOpen] = useState(false)
    const [isAddRateOpen, setIsAddRateOpen] = useState(false)
    const [isEditZoneOpen, setIsEditZoneOpen] = useState(false)
    const [currentEditZone, setCurrentEditZone] = useState<string | null>(null)
    const [removeRatesSelected, setRemoveRatesSelected] = useState(false)
    const [zoneSearchQuery, setZoneSearchQuery] = useState("")
    const [editZoneName, setEditZoneName] = useState("")

    // Countries for Domestic Zone
    const domesticCountries = [
        { id: "africa", name: "Africa", flag: "/media/flags/algeria.svg", regions: "1 of 1 states/provinces", checked: true, hasDropdown: true, isParent: true, disabled: false },
        { id: "dz", name: "Algeria", flag: "/media/flags/algeria.svg", checked: true, isChild: true, disabled: false },
    ]

    // Countries for International Zone
    const internationalCountries = [
        { id: "cn", name: "China", flag: "/media/flags/china.svg", regions: "In another zone", disabled: true },
        { id: "dz-int", name: "Algeria", flag: "/media/flags/algeria.svg", regions: "In another zone", disabled: true },
        { id: "asia", name: "Asia", flag: "/media/flags/australia.svg", regions: "50 of 50 states/provinces", checked: true, hasDropdown: true, disabled: false },
        { id: "hk", name: "Hong Kong SAR", flag: "/media/flags/hong-kong.svg", regions: "3 of 3 regions", checked: true, hasDropdown: true, disabled: false },
        { id: "il", name: "Israel", flag: "/media/flags/israel.svg", regions: "", checked: true, disabled: false },
        { id: "jp", name: "Japan", flag: "/media/flags/japan.svg", regions: "47 of 47 prefectures", checked: true, hasDropdown: true, disabled: false },
        { id: "my", name: "Malaysia", flag: "/media/flags/malaysia.svg", regions: "16 of 16 states and territories", checked: true, hasDropdown: true, disabled: false },
        { id: "sg", name: "Singapore", flag: "/media/flags/singapore.svg", regions: "", checked: true, disabled: false },
    ]

    const currentZoneCountries = currentEditZone === "domestic" ? domesticCountries : internationalCountries

    const [selectedDomesticCountries, setSelectedDomesticCountries] = useState<string[]>(
        domesticCountries.filter(c => c.checked).map(c => c.id)
    )
    const [selectedInternationalCountries, setSelectedInternationalCountries] = useState<string[]>(
        internationalCountries.filter(c => c.checked).map(c => c.id)
    )

    const selectedCountries = currentEditZone === "domestic" ? selectedDomesticCountries : selectedInternationalCountries
    const setSelectedCountries = currentEditZone === "domestic" ? setSelectedDomesticCountries : setSelectedInternationalCountries

    const toggleCountry = (countryId: string) => {
        const currentDisabled = currentZoneCountries.find(c => c.id === countryId)?.disabled
        if (currentDisabled) return

        if (currentEditZone === "domestic") {
            setSelectedDomesticCountries(prev =>
                prev.includes(countryId)
                    ? prev.filter(id => id !== countryId)
                    : [...prev, countryId]
            )
        } else {
            setSelectedInternationalCountries(prev =>
                prev.includes(countryId)
                    ? prev.filter(id => id !== countryId)
                    : [...prev, countryId]
            )
        }
    }

    const filteredCountries = currentZoneCountries.filter(country =>
        country.name.toLowerCase().includes(zoneSearchQuery.toLowerCase())
    )

    const openEditZone = (zoneId: string, zoneName: string) => {
        setCurrentEditZone(zoneId)
        setEditZoneName(zoneName)
        setZoneSearchQuery("")
        setIsEditZoneOpen(true)
    }

    // Add Rate Form State
    const [rateType, setRateType] = useState("flat")
    const [shippingTime, setShippingTime] = useState("custom")
    const [rateName, setRateName] = useState("")
    const [rateDescription, setRateDescription] = useState("")
    const [ratePrice, setRatePrice] = useState("0.00")
    const [isFreeShipping, setIsFreeShipping] = useState(false)
    const [showConditionalPricing, setShowConditionalPricing] = useState(false)
    const [pricingType, setPricingType] = useState<"weight" | "price">("weight")
    const [minWeight, setMinWeight] = useState("0")
    const [maxWeight, setMaxWeight] = useState("No limit")
    const [showDescriptionSuggestions, setShowDescriptionSuggestions] = useState(false)

    const descriptionSuggestions = [
        "Tracking number provided",
        "Made to order",
        "Ships next day"
    ]

    const handleAddRate = () => {
        // Handle adding rate logic here
        setIsAddRateOpen(false)
        // Reset form
        setRateName("")
        setRateDescription("")
        setRatePrice("0.00")
        setIsFreeShipping(false)
        setShowConditionalPricing(false)
        setPricingType("weight")
        setMinWeight("0")
        setMaxWeight("No limit")
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-col gap-6 py-6 px-4 md:px-6 max-w-4xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wifi className="h-4 w-4" />
                    <span className="text-foreground">›</span>
                    <Link href="/seller/settings/shipping" className="hover:underline">Shipping and delivery</Link>
                    <span className="text-foreground">›</span>
                    <span className="text-foreground font-medium">General profile</span>
                </div>

                {/* Products Section */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Products</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            All products not in other profiles. Newly created products are added to this profile.
                        </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="bg-muted/50 rounded-lg p-4 border border-border">
                            <p className="text-sm text-muted-foreground">
                                To move products into this profile, remove them from other profiles
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Info text */}
                <p className="text-sm text-muted-foreground">
                    To charge different rates for only certain products, create a new profile in{" "}
                    <Link href="/seller/settings/shipping" className="text-primary hover:underline">
                        shipping settings
                    </Link>
                </p>

                {/* Fulfillment Location Section */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold">Fulfillment location</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-6">
                        {/* Shop Location */}
                        <div className="flex items-start justify-between">
                            <Link href="/seller/settings/locations" className="hover:underline">
                                <p className="text-sm font-medium">Shop location</p>
                                <p className="text-sm text-muted-foreground">Algeria</p>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setIsManageRatesOpen(true)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </div>

                        <Separator />

                        {/* Shipping Zones Header */}
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold">Shipping zones</h4>
                            <Button variant="link" className="text-primary h-auto p-0 text-sm">
                                Add shipping zone
                            </Button>
                        </div>

                        {/* Shipping Zones List */}
                        <div className="space-y-4">
                            {shippingZones.map((zone) => (
                                <div key={zone.id} className="space-y-3">
                                    {/* Zone Header */}
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            {zone.flag ? (
                                                <Image
                                                    src={zone.flag}
                                                    alt={zone.country || ""}
                                                    width={24}
                                                    height={18}
                                                    className="rounded-sm object-cover"
                                                />
                                            ) : (
                                                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                            <span className="text-sm font-medium">
                                                {zone.name} • {zone.country || zone.countries}
                                                {zone.moreCount && zone.moreCountries && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="text-primary hover:underline cursor-pointer ml-1">
                                                                    {zone.moreCount} more
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="bottom" className="max-w-xs p-3">
                                                                <p className="text-xs leading-relaxed">
                                                                    {zone.moreCountries}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </span>
                                        </div>
                                        {/* Zone Dropdown Menu */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-32">
                                                <DropdownMenuItem onClick={() => openEditZone(zone.id, zone.name)}>
                                                    Edit zone
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Warning Banner (for international) */}
                                    {zone.warning && (
                                        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                                {zone.warning.message}{" "}
                                                <span className="font-semibold text-primary">{zone.warning.count} countries/regions</span>{" "}
                                                {zone.warning.suffix}{" "}
                                                <Link href="/seller/settings/markets" className="text-primary hover:underline font-medium">
                                                    market
                                                </Link>
                                            </p>
                                        </div>
                                    )}

                                    {/* Rates */}
                                    {zone.rates.map((rate) => (
                                        <div key={rate.id} className="flex items-center justify-between py-2 pl-9">
                                            <span className="text-sm text-muted-foreground">{rate.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium bg-muted px-3 py-1 rounded-md">
                                                    {rate.price}
                                                </span>
                                                {/* Rate Dropdown Menu */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-32">
                                                        <DropdownMenuItem>
                                                            Edit rate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Rate */}
                                    <div className="pl-9">
                                        <Button
                                            variant="ghost"
                                            className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
                                            onClick={() => setIsAddRateOpen(true)}
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add rate
                                        </Button>
                                    </div>

                                    {zone.id !== shippingZones[shippingZones.length - 1].id && (
                                        <Separator className="mt-4" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Start Shipping to More Places */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">Start shipping to more places</CardTitle>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Add countries/regions to a market to start selling and manage localized settings, including shipping zones
                        </p>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                        <Button variant="outline" size="sm">
                            Go to Markets
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            236 countries/regions not in a market
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Manage Rates Dialog */}
            <Dialog open={isManageRatesOpen} onOpenChange={setIsManageRatesOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Manage rates for Shop location</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Remove rates</Label>
                            <div className="flex items-start gap-3">
                                <input
                                    type="radio"
                                    id="remove-rates"
                                    name="manage-rates"
                                    checked={removeRatesSelected}
                                    onChange={() => setRemoveRatesSelected(true)}
                                    className="mt-1"
                                />
                                <Label htmlFor="remove-rates" className="text-sm text-muted-foreground font-normal cursor-pointer">
                                    This location will no longer ship the products in this profile
                                </Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsManageRatesOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setIsManageRatesOpen(false)}>
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Rate Dialog */}
            <Dialog open={isAddRateOpen} onOpenChange={setIsAddRateOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add rate</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                        {/* Rate Type */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Rate type</Label>
                            <Select value={rateType} onValueChange={setRateType}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select rate type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="flat">Use flat rate</SelectItem>
                                    <SelectItem value="calculated">Use carrier or app to calculate rates</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Shipping Time */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Shipping time</Label>
                            <Select value={shippingTime} onValueChange={setShippingTime}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select shipping time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="custom">Custom</SelectItem>
                                    <SelectItem value="economy">Economy (5-8 business days)</SelectItem>
                                    <SelectItem value="standard">Standard (3-4 business days)</SelectItem>
                                    <SelectItem value="express">Express (1-2 business days)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Custom Rate Name */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Custom rate name</Label>
                            <Input
                                value={rateName}
                                onChange={(e) => setRateName(e.target.value)}
                                placeholder="e.g., Standard Shipping"
                            />
                        </div>

                        {/* Custom Delivery Description */}
                        <div className="space-y-2 relative">
                            <Label className="text-sm font-medium">Custom delivery description (optional)</Label>
                            <Input
                                value={rateDescription}
                                onChange={(e) => setRateDescription(e.target.value)}
                                onFocus={() => setShowDescriptionSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowDescriptionSuggestions(false), 200)}
                                placeholder=""
                            />
                            {showDescriptionSuggestions && (
                                <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
                                    <div className="px-3 py-2 text-xs text-muted-foreground font-medium">Suggestions</div>
                                    {descriptionSuggestions.map((suggestion) => (
                                        <div
                                            key={suggestion}
                                            className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
                                            onClick={() => {
                                                setRateDescription(suggestion)
                                                setShowDescriptionSuggestions(false)
                                            }}
                                        >
                                            {suggestion}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Price</Label>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center flex-1 border border-input rounded-md overflow-hidden">
                                    <span className="inline-flex items-center px-3 h-9 text-sm text-muted-foreground bg-muted border-r border-input">
                                        DZD
                                    </span>
                                    <Input
                                        type="text"
                                        value={isFreeShipping ? "0.00" : ratePrice}
                                        onChange={(e) => {
                                            setRatePrice(e.target.value)
                                            setIsFreeShipping(false)
                                        }}
                                        disabled={isFreeShipping}
                                        className="border-0 rounded-none focus-visible:ring-0"
                                        placeholder="0.00"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant={isFreeShipping ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        setIsFreeShipping(!isFreeShipping)
                                        if (!isFreeShipping) setRatePrice("0.00")
                                    }}
                                >
                                    Free
                                </Button>
                            </div>
                        </div>

                        {/* Conditional Pricing Section */}
                        {!showConditionalPricing ? (
                            <Button
                                variant="link"
                                className="text-primary h-auto p-0 text-sm"
                                onClick={() => setShowConditionalPricing(true)}
                            >
                                Add conditional pricing
                            </Button>
                        ) : (
                            <div className="space-y-4">
                                <Button
                                    variant="link"
                                    className="text-primary h-auto p-0 text-sm"
                                    onClick={() => setShowConditionalPricing(false)}
                                >
                                    Remove conditional pricing
                                </Button>

                                {/* Pricing Type Radio */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            id="weight-based"
                                            name="pricing-type"
                                            checked={pricingType === "weight"}
                                            onChange={() => setPricingType("weight")}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor="weight-based" className="text-sm font-normal cursor-pointer">
                                            Based on item weight
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            id="price-based"
                                            name="pricing-type"
                                            checked={pricingType === "price"}
                                            onChange={() => setPricingType("price")}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor="price-based" className="text-sm font-normal cursor-pointer">
                                            Based on order price
                                        </Label>
                                    </div>
                                </div>

                                {/* Weight Inputs */}
                                {pricingType === "weight" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Minimum weight</Label>
                                            <div className="flex items-center border border-input rounded-md overflow-hidden">
                                                <Input
                                                    type="text"
                                                    value={minWeight}
                                                    onChange={(e) => setMinWeight(e.target.value)}
                                                    className="border-0 focus-visible:ring-0"
                                                />
                                                <span className="px-3 text-sm text-muted-foreground bg-muted border-l border-input h-9 flex items-center">
                                                    kg
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Maximum weight</Label>
                                            <div className="flex items-center border border-input rounded-md overflow-hidden">
                                                <Input
                                                    type="text"
                                                    value={maxWeight}
                                                    onChange={(e) => setMaxWeight(e.target.value)}
                                                    className="border-0 focus-visible:ring-0"
                                                    placeholder="No limit"
                                                />
                                                <span className="px-3 text-sm text-muted-foreground bg-muted border-l border-input h-9 flex items-center">
                                                    kg
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Checkout Preview */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Checkout preview</Label>
                            <div className="border border-border rounded-lg p-4 bg-muted/30">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="h-4 w-4 mt-0.5 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {rateName || "Rate name"}
                                            </span>
                                            {rateDescription && (
                                                <span className="text-xs text-muted-foreground">
                                                    {rateDescription}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">
                                        {isFreeShipping || ratePrice === "0.00" ? "FREE" : `DZD ${ratePrice}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsAddRateOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddRate}>
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Zone Dialog */}
            <Dialog open={isEditZoneOpen} onOpenChange={setIsEditZoneOpen}>
                <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Edit shipping zone</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-4 flex-1 overflow-hidden flex flex-col">
                        {/* Zone Name */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Zone name</Label>
                            <Input
                                value={editZoneName}
                                onChange={(e) => setEditZoneName(e.target.value)}
                                placeholder="e.g., International"
                            />
                            <p className="text-xs text-muted-foreground">Customers won't see this</p>
                        </div>

                        {/* Shipping Zones */}
                        <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                            <Label className="text-sm font-medium">Shipping zones</Label>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={zoneSearchQuery}
                                    onChange={(e) => setZoneSearchQuery(e.target.value)}
                                    placeholder="Search countries and regions to ship to"
                                    className="pl-9"
                                />
                            </div>

                            {/* Countries List */}
                            <ScrollArea className="flex-1 -mx-6 px-6">
                                <div className="space-y-1">
                                    {filteredCountries.map((country: any) => (
                                        <div
                                            key={country.id}
                                            className={`flex items-center justify-between py-2.5 px-2 rounded-md hover:bg-muted/50 ${country.disabled ? 'opacity-50' : ''} ${country.isChild ? 'ml-6' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    id={country.id}
                                                    checked={selectedCountries.includes(country.id)}
                                                    onCheckedChange={() => !country.disabled && toggleCountry(country.id)}
                                                    disabled={country.disabled}
                                                />
                                                {country.isParent ? (
                                                    <div className="h-6 w-8 rounded bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
                                                        AF
                                                    </div>
                                                ) : (
                                                    <Image
                                                        src={country.flag}
                                                        alt={country.name}
                                                        width={24}
                                                        height={18}
                                                        className="rounded-sm object-cover"
                                                    />
                                                )}
                                                <span className="text-sm font-medium">{country.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {country.regions && (
                                                    <span className={`text-xs ${country.disabled ? 'text-muted-foreground italic' : 'text-muted-foreground'}`}>
                                                        {country.regions}
                                                    </span>
                                                )}
                                                {country.hasDropdown && (
                                                    <Button variant="ghost" size="sm" className="h-6 px-1">
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Add more link */}
                        <Button variant="link" className="text-primary h-auto p-0 text-sm justify-start">
                            Add more countries/regions in Markets
                        </Button>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsEditZoneOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setIsEditZoneOpen(false)}>
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
