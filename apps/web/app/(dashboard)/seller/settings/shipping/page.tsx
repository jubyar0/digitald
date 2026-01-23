"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card"
import { Button } from "@/components/dashboard/ui/button"
import { Separator } from "@/components/dashboard/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Package, Truck, Info, ChevronRight, Plus, MoreHorizontal, X, Search, ChevronDown, ChevronUp, Check, Globe, MapPin } from "lucide-react"

// Country data for shipping destinations
const countries = [
    { code: "DZ", name: "Algeria", flag: "🇩🇿" },
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "FR", name: "France", flag: "🇫🇷" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "JP", name: "Japan", flag: "🇯🇵" },
    { code: "CN", name: "China", flag: "🇨🇳" },
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "BR", name: "Brazil", flag: "🇧🇷" },
    { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
    { code: "EG", name: "Egypt", flag: "🇪🇬" },
    { code: "MA", name: "Morocco", flag: "🇲🇦" },
    { code: "TN", name: "Tunisia", flag: "🇹🇳" },
]

// Location suggestions for autocomplete (simulating Google Places API)
const locationSuggestions: Record<string, { name: string; fullAddress: string }[]> = {
    "lag": [
        { name: "Laghouat, Algeria", fullAddress: "Laghouat, Algeria" },
        { name: "Laghouat Province, Algeria", fullAddress: "Laghouat Province, Algeria" },
        { name: "Laghouat, Laghouat, Algeria", fullAddress: "Laghouat, Laghouat, Algeria" },
        { name: "Legata, Algeria", fullAddress: "Legata, Algeria" },
        { name: "Moulay Ahmed Medeghri Airport (LOO), Laghouat, Algeria", fullAddress: "Moulay Ahmed Medeghri Airport (LOO), Laghouat, Algeria" },
    ],
    "alg": [
        { name: "Algeria", fullAddress: "Algeria" },
        { name: "Algiers, Algeria", fullAddress: "Algiers, Algeria" },
        { name: "Algiers Province, Algeria", fullAddress: "Algiers Province, Algeria" },
    ],
    "new": [
        { name: "New York, NY, USA", fullAddress: "New York, NY, USA" },
        { name: "New Orleans, LA, USA", fullAddress: "New Orleans, LA, USA" },
        { name: "Newark, NJ, USA", fullAddress: "Newark, NJ, USA" },
        { name: "New Delhi, India", fullAddress: "New Delhi, India" },
    ],
    "par": [
        { name: "Paris, France", fullAddress: "Paris, France" },
        { name: "Paris, TX, USA", fullAddress: "Paris, TX, USA" },
    ],
    "lon": [
        { name: "London, UK", fullAddress: "London, UK" },
        { name: "Long Beach, CA, USA", fullAddress: "Long Beach, CA, USA" },
    ],
}

export default function ShippingAndDeliveryPage() {
    // Shipping Rate Calculator state
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
    const [shippingFrom, setShippingFrom] = useState("shop")
    const [shippingFromCountry, setShippingFromCountry] = useState("DZ")
    const [shippingFromSearch, setShippingFromSearch] = useState("")
    const [shippingToCountry, setShippingToCountry] = useState("DZ")
    const [shippingToSearch, setShippingToSearch] = useState("lag")
    const [showFromSuggestions, setShowFromSuggestions] = useState(false)
    const [showToSuggestions, setShowToSuggestions] = useState(false)
    const [packageType, setPackageType] = useState("custom")
    const [dimensionL, setDimensionL] = useState("")
    const [dimensionW, setDimensionW] = useState("")
    const [dimensionH, setDimensionH] = useState("")
    const [dimensionUnit, setDimensionUnit] = useState("in")
    const [totalWeight, setTotalWeight] = useState("1")
    const [weightUnit, setWeightUnit] = useState("lb")
    const [showWeightUnitDropdown, setShowWeightUnitDropdown] = useState(false)
    const [showDimensionUnitDropdown, setShowDimensionUnitDropdown] = useState(false)
    const [showFromCountryDropdown, setShowFromCountryDropdown] = useState(false)
    const [showToCountryDropdown, setShowToCountryDropdown] = useState(false)

    // Estimated Delivery Dates popup state
    const [isDeliveryDatesOpen, setIsDeliveryDatesOpen] = useState(false)
    const [deliveryDateMode, setDeliveryDateMode] = useState<"off" | "manual">("manual")
    const [fulfillmentTime, setFulfillmentTime] = useState("next")
    const [showFulfillmentDropdown, setShowFulfillmentDropdown] = useState(false)

    // Shop Promise popup state
    const [isShopPromiseOpen, setIsShopPromiseOpen] = useState(false)

    // Add Package popup state
    const [isAddPackageOpen, setIsAddPackageOpen] = useState(false)
    const [newPackageType, setNewPackageType] = useState<"box" | "envelope" | "soft">("box")
    const [newPackageLength, setNewPackageLength] = useState("")
    const [newPackageWidth, setNewPackageWidth] = useState("")
    const [newPackageHeight, setNewPackageHeight] = useState("")
    const [newPackageDimensionUnit, setNewPackageDimensionUnit] = useState("cm")
    const [newPackageWeight, setNewPackageWeight] = useState("")
    const [newPackageWeightUnit, setNewPackageWeightUnit] = useState("kg")
    const [newPackageName, setNewPackageName] = useState("")
    const [isDefaultPackage, setIsDefaultPackage] = useState(false)

    const toSearchRef = useRef<HTMLInputElement>(null)
    const fromSearchRef = useRef<HTMLInputElement>(null)

    // Get suggestions based on search query
    const getToSuggestions = () => {
        const query = shippingToSearch.toLowerCase()
        if (query.length < 2) return []

        for (const key of Object.keys(locationSuggestions)) {
            if (query.includes(key) || key.includes(query)) {
                return locationSuggestions[key]
            }
        }
        return []
    }

    const getFromSuggestions = () => {
        const query = shippingFromSearch.toLowerCase()
        if (query.length < 2) return []

        for (const key of Object.keys(locationSuggestions)) {
            if (query.includes(key) || key.includes(query)) {
                return locationSuggestions[key]
            }
        }
        return []
    }

    const selectedFromCountry = countries.find(c => c.code === shippingFromCountry)
    const selectedToCountry = countries.find(c => c.code === shippingToCountry)

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-col gap-6 py-6 px-4 md:px-6 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <h1 className="text-xl font-semibold">Shipping and delivery</h1>
                </div>

                {/* Shipping Section */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">Shipping</CardTitle>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Manage where you ship and how much you charge
                        </p>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                        {/* General shipping rates - Links to General profile */}
                        <Link href="/seller/settings/shipping/general-profile" className="block">
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex items-start gap-8">
                                    <div>
                                        <p className="text-sm font-medium">General shipping rates</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Package className="h-3.5 w-3.5" />
                                            All products
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Rates for</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <span className="flex items-center gap-1">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                Domestic
                                            </span>
                                        </p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <span className="flex items-center gap-1">
                                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                                International
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </Link>

                        <p className="text-sm text-muted-foreground">
                            <Link href="#" className="text-primary hover:underline">Create a custom profile</Link>
                            {" "}to set different rates or restrict destinations for specific products
                        </p>
                    </CardContent>
                </Card>

                {/* Shipping labels */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base font-semibold">Shipping labels</CardTitle>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setIsCalculatorOpen(true)}>
                                Calculate rates
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Buy labels with the lowest rates. Manage your carriers to fulfill orders faster.
                        </p>
                    </CardHeader>
                </Card>

                {/* Shipping Rate Calculator Dialog */}
                <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
                    <DialogContent className="max-w-[650px] p-0 gap-0">
                        <DialogHeader className="px-6 py-4 border-b border-border">
                            <DialogTitle className="text-base font-semibold">Shipping rate calculator</DialogTitle>
                        </DialogHeader>

                        <div className="flex">
                            {/* Left side - Form */}
                            <div className="flex-1 p-6 space-y-5 border-r border-border">
                                {/* Shipping from */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Shipping from</Label>
                                    <Select value={shippingFrom} onValueChange={setShippingFrom}>
                                        <SelectTrigger className="w-full">
                                            <div className="flex items-center gap-2">
                                                {shippingFrom === "shop" ? (
                                                    <>
                                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                                        <span>Shop location</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span>Custom location</span>
                                                    </>
                                                )}
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="custom">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    Custom location
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="shop">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4" />
                                                    Shop location
                                                    <Check className="h-4 w-4 ml-auto" />
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Custom location search (shown when custom is selected) */}
                                    {shippingFrom === "custom" && (
                                        <div className="flex gap-2 mt-2">
                                            {/* Country flag selector */}
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowFromCountryDropdown(!showFromCountryDropdown)}
                                                    className="flex items-center gap-1 px-2 py-2 border border-border rounded-md bg-background hover:bg-muted/50 h-10"
                                                >
                                                    <span className="text-lg">{selectedFromCountry?.flag}</span>
                                                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                                </button>
                                                {showFromCountryDropdown && (
                                                    <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto w-48">
                                                        {countries.map((country) => (
                                                            <button
                                                                key={country.code}
                                                                type="button"
                                                                onClick={() => {
                                                                    setShippingFromCountry(country.code)
                                                                    setShowFromCountryDropdown(false)
                                                                }}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted/50 text-left"
                                                            >
                                                                <span>{country.flag}</span>
                                                                <span>{country.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Search input */}
                                            <div className="relative flex-1">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        ref={fromSearchRef}
                                                        value={shippingFromSearch}
                                                        onChange={(e) => setShippingFromSearch(e.target.value)}
                                                        onFocus={() => setShowFromSuggestions(true)}
                                                        onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                                                        className="pl-9"
                                                        placeholder="Search location"
                                                    />
                                                </div>
                                                {showFromSuggestions && getFromSuggestions().length > 0 && (
                                                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50">
                                                        {getFromSuggestions().map((suggestion, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                onClick={() => {
                                                                    setShippingFromSearch(suggestion.name)
                                                                    setShowFromSuggestions(false)
                                                                }}
                                                                className="w-full px-3 py-2 text-sm hover:bg-muted/50 text-left"
                                                            >
                                                                {suggestion.name}
                                                            </button>
                                                        ))}
                                                        <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border">
                                                            Powered by Google
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Shipping to */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Shipping to</Label>
                                    <div className="flex gap-2">
                                        {/* Country flag selector */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowToCountryDropdown(!showToCountryDropdown)}
                                                className="flex items-center gap-1 px-2 py-2 border border-border rounded-md bg-background hover:bg-muted/50 h-10"
                                            >
                                                <span className="text-lg">{selectedToCountry?.flag}</span>
                                                <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                            </button>
                                            {showToCountryDropdown && (
                                                <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto w-48">
                                                    {countries.map((country) => (
                                                        <button
                                                            key={country.code}
                                                            type="button"
                                                            onClick={() => {
                                                                setShippingToCountry(country.code)
                                                                setShowToCountryDropdown(false)
                                                            }}
                                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted/50 text-left"
                                                        >
                                                            <span>{country.flag}</span>
                                                            <span>{country.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Search input */}
                                        <div className="relative flex-1">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    ref={toSearchRef}
                                                    value={shippingToSearch}
                                                    onChange={(e) => setShippingToSearch(e.target.value)}
                                                    onFocus={() => setShowToSuggestions(true)}
                                                    onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                                                    className="pl-9"
                                                    placeholder="Search location"
                                                />
                                            </div>
                                            {showToSuggestions && getToSuggestions().length > 0 && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50">
                                                    {getToSuggestions().map((suggestion, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => {
                                                                setShippingToSearch(suggestion.name)
                                                                setShowToSuggestions(false)
                                                            }}
                                                            className="w-full px-3 py-2 text-sm hover:bg-muted/50 text-left"
                                                        >
                                                            {suggestion.name}
                                                        </button>
                                                    ))}
                                                    <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border">
                                                        Powered by Google
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Package */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Package</Label>
                                    <Select value={packageType} onValueChange={setPackageType}>
                                        <SelectTrigger className="w-full">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                <span>Custom dimensions</span>
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="custom">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    Custom dimensions
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="sample">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    Sample box
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Dimensions inputs */}
                                    <div className="flex gap-2 items-center">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Input
                                                    value={dimensionL}
                                                    onChange={(e) => setDimensionL(e.target.value)}
                                                    className="pr-8"
                                                    placeholder=""
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">L</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Input
                                                    value={dimensionW}
                                                    onChange={(e) => setDimensionW(e.target.value)}
                                                    className="pr-8"
                                                    placeholder=""
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">W</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Input
                                                    value={dimensionH}
                                                    onChange={(e) => setDimensionH(e.target.value)}
                                                    className="pr-8"
                                                    placeholder=""
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">H</span>
                                            </div>
                                        </div>

                                        {/* Dimension unit selector */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowDimensionUnitDropdown(!showDimensionUnitDropdown)}
                                                className="flex items-center gap-1 px-3 py-2 border border-border rounded-md bg-background hover:bg-muted/50 h-10 text-sm"
                                            >
                                                <span>{dimensionUnit}</span>
                                                <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                            </button>
                                            {showDimensionUnitDropdown && (
                                                <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 w-16">
                                                    {["in", "cm", "mm"].map((unit) => (
                                                        <button
                                                            key={unit}
                                                            type="button"
                                                            onClick={() => {
                                                                setDimensionUnit(unit)
                                                                setShowDimensionUnitDropdown(false)
                                                            }}
                                                            className={`flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-muted/50 ${dimensionUnit === unit ? 'bg-primary text-primary-foreground' : ''}`}
                                                        >
                                                            {unit}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Total weight */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Total weight</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={totalWeight}
                                            onChange={(e) => setTotalWeight(e.target.value)}
                                            className="flex-1"
                                            type="number"
                                        />

                                        {/* Weight unit selector */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowWeightUnitDropdown(!showWeightUnitDropdown)}
                                                className="flex items-center gap-1 px-3 py-2 border border-border rounded-md bg-background hover:bg-muted/50 h-10 text-sm"
                                            >
                                                <span>{weightUnit}</span>
                                                <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                            </button>
                                            {showWeightUnitDropdown && (
                                                <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 w-16">
                                                    {["g", "kg", "oz", "lb"].map((unit) => (
                                                        <button
                                                            key={unit}
                                                            type="button"
                                                            onClick={() => {
                                                                setWeightUnit(unit)
                                                                setShowWeightUnitDropdown(false)
                                                            }}
                                                            className={`flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-muted/50 ${weightUnit === unit ? 'bg-primary text-primary-foreground' : ''}`}
                                                        >
                                                            {unit}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Calculate button */}
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    Calculate discounted rates
                                </Button>
                            </div>

                            {/* Right side - Info panel */}
                            <div className="w-[200px] p-6 flex items-center justify-center bg-muted/30">
                                <p className="text-sm text-muted-foreground text-center">
                                    Calculate how much you'll save when you buy labels at discounted rates from Shopify
                                </p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delivery expectations */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">Delivery expectations</CardTitle>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                        {/* Estimated delivery dates */}
                        <button
                            type="button"
                            onClick={() => setIsDeliveryDatesOpen(true)}
                            className="block w-full text-left"
                        >
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Estimated delivery dates</p>
                                    <p className="text-sm text-muted-foreground">
                                        Increase conversion and build trust with delivery dates on your store
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                        {deliveryDateMode === "manual" ? "Manual" : "Off"}
                                    </span>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </div>
                        </button>

                        {/* Shop Promise */}
                        <button
                            type="button"
                            onClick={() => setIsShopPromiseOpen(true)}
                            className="block w-full text-left"
                        >
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Shop Promise</p>
                                    <p className="text-sm text-muted-foreground">
                                        Highlight that you're an exceptional shipper with dates backed by a badge and guarantee
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">Off</span>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </div>
                        </button>
                    </CardContent>
                </Card>

                {/* Shop Promise Dialog */}
                <Dialog open={isShopPromiseOpen} onOpenChange={setIsShopPromiseOpen}>
                    <DialogContent className="max-w-[600px] p-12 flex flex-col items-center text-center">
                        {/* Illustration */}
                        <div className="mb-6 relative w-24 h-24">
                            <div className="absolute inset-0 bg-emerald-100 rounded-full opacity-50" />
                            <div className="absolute top-2 right-2 w-8 h-8 bg-emerald-600 rounded-lg transform rotate-12" />
                            <div className="absolute bottom-2 left-2 w-8 h-8 bg-orange-400 rounded-lg transform -rotate-12" />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                                <Plus className="h-6 w-6 text-muted-foreground" />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold mb-2">You don't have this app installed</h2>
                        <p className="text-muted-foreground mb-8">Get Shop and try again.</p>

                        {/* App Card */}
                        <div className="w-full max-w-md border border-border rounded-xl p-4 flex items-center gap-4 text-left">
                            <div className="h-12 w-12 bg-[#5E3BEE] rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-white font-bold text-xs">Shop</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-semibold text-sm">Shop</span>
                                    <span className="text-xs text-muted-foreground flex items-center">
                                        4.8 <span className="text-yellow-400 ml-0.5">★</span>
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                    Complement your store with a branded mobile experience in Shop
                                </p>
                            </div>
                            <Button variant="outline" size="sm" className="shrink-0">
                                Install
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Estimated Delivery Dates Dialog */}
                <Dialog open={isDeliveryDatesOpen} onOpenChange={setIsDeliveryDatesOpen}>
                    <DialogContent className="max-w-[500px] p-0 gap-0">
                        <DialogHeader className="px-6 py-4 border-b border-border">
                            <DialogTitle className="text-base font-semibold">Estimated delivery dates</DialogTitle>
                        </DialogHeader>

                        <div className="p-6 space-y-6">
                            {/* Preview card */}
                            <div className="border border-border rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            <div className="h-4 w-4 rounded-full border-4 border-emerald-500 bg-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Standard</p>
                                            <p className="text-xs text-muted-foreground">
                                                Tuesday, May 27–Friday, May 30
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium">DZD 10.00</p>
                                </div>
                            </div>

                            {/* Radio options */}
                            <div className="space-y-4">
                                {/* Off option */}
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="deliveryMode"
                                        checked={deliveryDateMode === "off"}
                                        onChange={() => setDeliveryDateMode("off")}
                                        className="mt-1 h-4 w-4 text-primary"
                                    />
                                    <div>
                                        <p className="text-sm font-medium">Off</p>
                                        <p className="text-sm text-muted-foreground">
                                            Only shows transit time or custom descriptions based on your{" "}
                                            <Link href="#" className="text-primary hover:underline">shipping rates</Link>
                                        </p>
                                    </div>
                                </label>

                                {/* Manual option */}
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="deliveryMode"
                                        checked={deliveryDateMode === "manual"}
                                        onChange={() => setDeliveryDateMode("manual")}
                                        className="mt-1 h-4 w-4 text-primary"
                                    />
                                    <div>
                                        <p className="text-sm font-medium">Manual</p>
                                        <p className="text-sm text-muted-foreground">
                                            Shows a delivery date range by adding your fulfillment time to the{" "}
                                            <Link href="#" className="text-primary hover:underline">transit time</Link>
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Fulfillment time - only shown when Manual is selected */}
                            {deliveryDateMode === "manual" && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Fulfillment time</Label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowFulfillmentDropdown(!showFulfillmentDropdown)}
                                            className="flex items-center justify-between w-full px-3 py-2 border border-border rounded-md bg-background hover:bg-muted/50 text-sm"
                                        >
                                            <span>
                                                {fulfillmentTime === "same" && "Same business day"}
                                                {fulfillmentTime === "next" && "Next business day"}
                                                {fulfillmentTime === "2days" && "2 business days"}
                                                {fulfillmentTime === "custom" && "Custom"}
                                            </span>
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                        {showFulfillmentDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50">
                                                {[
                                                    { value: "same", label: "Same business day" },
                                                    { value: "next", label: "Next business day" },
                                                    { value: "2days", label: "2 business days" },
                                                    { value: "custom", label: "Custom" },
                                                ].map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setFulfillmentTime(option.value)
                                                            setShowFulfillmentDropdown(false)
                                                        }}
                                                        className={`w-full px-3 py-2 text-sm text-left hover:bg-muted/50 ${fulfillmentTime === option.value ? 'bg-primary text-primary-foreground' : ''}`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Used to calculate manual dates</p>
                                </div>
                            )}
                        </div>

                        {/* Footer with Cancel and Save buttons */}
                        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsDeliveryDatesOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => setIsDeliveryDatesOpen(false)}
                            >
                                Save
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Local delivery */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base font-semibold">Local delivery</CardTitle>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Link href="/seller/settings/shipping/local-delivery">
                                <Button variant="outline" size="sm">
                                    Set up
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Deliver orders to customers directly from your locations
                        </p>
                    </CardHeader>
                </Card>

                {/* Pickup in store */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base font-semibold">Pickup in store</CardTitle>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Link href="/seller/settings/shipping/pickup-in-store">
                                <Button variant="outline" size="sm">
                                    Set up
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Let customers pick up their orders at your locations
                        </p>
                    </CardHeader>
                </Card>

                {/* Delivery customizations */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Delivery customizations</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Customizations control how delivery options appear to buyers at checkout. You can hide, rename, and reorder delivery options.
                        </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground gap-2 p-0 h-auto">
                            <Plus className="h-4 w-4" />
                            Add delivery customization
                        </Button>
                    </CardContent>
                </Card>

                {/* Packages */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">Packages</CardTitle>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Used to calculate shipping rates at checkout and pre-selected when buying labels
                        </p>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                        <div className="flex items-center justify-between py-3 px-4 border border-border rounded-lg">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Sample box</p>
                                    <p className="text-sm text-muted-foreground">22 × 13.7 × 4.2 cm, 0 kg</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="font-normal">
                                    Store default
                                </Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setIsAddPackageOpen(true)}>
                                            Edit
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            className="text-sm text-muted-foreground hover:text-foreground gap-2 p-0 h-auto"
                            onClick={() => setIsAddPackageOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Add package
                        </Button>
                    </CardContent>
                </Card>

                {/* Add Package Dialog */}
                <Dialog open={isAddPackageOpen} onOpenChange={setIsAddPackageOpen}>
                    <DialogContent className="max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add package</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="space-y-3">
                                <Label>Package type</Label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setNewPackageType("box")}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-colors ${newPackageType === "box"
                                            ? "border-black bg-muted/50 ring-1 ring-black"
                                            : "border-border hover:bg-muted/50"
                                            }`}
                                    >
                                        <Package className="h-4 w-4" />
                                        Box
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewPackageType("envelope")}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-colors ${newPackageType === "envelope"
                                            ? "border-black bg-muted/50 ring-1 ring-black"
                                            : "border-border hover:bg-muted/50"
                                            }`}
                                    >
                                        <div className="h-4 w-4 border border-current rounded-sm" />
                                        Envelope
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewPackageType("soft")}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-colors ${newPackageType === "soft"
                                            ? "border-black bg-muted/50 ring-1 ring-black"
                                            : "border-border hover:bg-muted/50"
                                            }`}
                                    >
                                        <div className="h-4 w-4 border border-current rounded-full" />
                                        Soft package
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="length">Length</Label>
                                    <div className="relative">
                                        <Input
                                            id="length"
                                            value={newPackageLength}
                                            onChange={(e) => setNewPackageLength(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="width">Width</Label>
                                    <div className="relative">
                                        <Input
                                            id="width"
                                            value={newPackageWidth}
                                            onChange={(e) => setNewPackageWidth(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="height">Height</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="height"
                                            value={newPackageHeight}
                                            onChange={(e) => setNewPackageHeight(e.target.value)}
                                        />
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setNewPackageDimensionUnit(newPackageDimensionUnit === "cm" ? "in" : "cm")}
                                                className="h-10 px-3 border border-border rounded-md bg-background text-sm flex items-center gap-1 hover:bg-muted/50 w-[70px] justify-between"
                                            >
                                                {newPackageDimensionUnit}
                                                <ChevronDown className="h-3 w-3 opacity-50" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weight">Weight (empty)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="weight"
                                            value={newPackageWeight}
                                            onChange={(e) => setNewPackageWeight(e.target.value)}
                                        />
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const units = ["kg", "g", "lb", "oz"]
                                                    const currentIndex = units.indexOf(newPackageWeightUnit)
                                                    setNewPackageWeightUnit(units[(currentIndex + 1) % units.length])
                                                }}
                                                className="h-10 px-3 border border-border rounded-md bg-background text-sm flex items-center gap-1 hover:bg-muted/50 w-[70px] justify-between"
                                            >
                                                {newPackageWeightUnit}
                                                <ChevronDown className="h-3 w-3 opacity-50" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="packageName">Package name</Label>
                                <Input
                                    id="packageName"
                                    value={newPackageName}
                                    onChange={(e) => setNewPackageName(e.target.value)}
                                />
                            </div>

                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="defaultPackage"
                                    checked={isDefaultPackage}
                                    onCheckedChange={(c: boolean) => setIsDefaultPackage(c)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label
                                        htmlFor="defaultPackage"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Use as default package
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Used to calculate rates at checkout and pre-selected when buying labels
                                    </p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddPackageOpen(false)}>Cancel</Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setIsAddPackageOpen(false)}>Add package</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Enable third party calculated rates */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Enable third party calculated rates at checkout</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Connect your existing shipping carrier account to use your own rates
                                </p>
                            </div>
                            <Truck className="h-16 w-16 text-primary opacity-50" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0 flex gap-4">
                        <Button variant="outline" size="sm">
                            Upgrade your plan
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                            Learn more
                        </Button>
                    </CardContent>
                </Card>

                {/* Shipping documents */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Shipping documents</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-0">
                        <Link href="#" className="flex items-center justify-between py-3 border-b border-border hover:bg-muted/50 transition-colors">
                            <p className="text-sm">Customize store name on shipping labels</p>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <Link href="/seller/settings/shipping/packing-slip" className="flex items-center justify-between py-3 hover:bg-muted/50 transition-colors">
                            <p className="text-sm">Packing slip template</p>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                    </CardContent>
                </Card>

                {/* Custom order fulfillment */}
                <Card className="bg-card border-border">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">Custom order fulfillment</CardTitle>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Add an email for a custom fulfillment service that fulfills orders for you
                        </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground gap-2 p-0 h-auto">
                            <Plus className="h-4 w-4" />
                            Add fulfillment service
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
