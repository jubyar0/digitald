"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Store, MapPin, Pencil, Search } from "lucide-react"
import { updateStoreDetails } from "@/actions/seller"
import { toast } from "sonner"

interface ProfileData {
    businessName?: string | null
    contactEmail?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    country?: string | null
    apartment?: string | null
}

export function StoreDetailsCard({ profile }: { profile: ProfileData | null }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isBillingOpen, setIsBillingOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            supportEmail: formData.get("storeEmail") as string,
            supportPhone: formData.get("storePhone") as string,
            // Preserve existing billing address fields
            address: profile?.address || undefined,
            apartment: profile?.apartment || undefined,
            city: profile?.city || undefined,
            state: profile?.state || undefined,
            zipCode: profile?.zipCode || undefined,
            country: profile?.country || undefined,
        }

        try {
            const result = await updateStoreDetails(data)
            if (result.success) {
                toast.success("Store profile updated")
                setIsProfileOpen(false)
            } else {
                toast.error(result.error || "Failed to update store profile")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSaveBilling(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            supportEmail: profile?.contactEmail || "", // specific field not in form yet
            supportPhone: profile?.phone || "", // specific field not in form yet
            address: formData.get("address") as string,
            apartment: formData.get("apartment") as string,
            city: formData.get("city") as string,
            state: "", // specific field not in form yet
            zipCode: formData.get("zipCode") as string,
            country: formData.get("country") as string,
        }

        try {
            const result = await updateStoreDetails(data)
            if (result.success) {
                toast.success("Store details updated successfully")
                setIsBillingOpen(false)
            } else {
                toast.error("Failed to update store details")
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
                <CardTitle className="text-base">Store details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Store Profile Item */}
                <div
                    className="group relative flex items-start gap-4 p-3 border rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => setIsProfileOpen(true)}
                >
                    <div className="mt-1">
                        <Store className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">{profile?.businessName || "My Store"}</p>
                        <p className="text-sm text-muted-foreground">
                            {profile?.contactEmail} • {profile?.phone || "No phone number"}
                        </p>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-2 bg-background rounded-md shadow-sm border">
                            <Pencil className="h-3 w-3 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Billing Address Item */}
                <div
                    className="group relative flex items-start gap-4 p-3 border rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => setIsBillingOpen(true)}
                >
                    <div className="mt-1">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">Billing address</p>
                        <p className="text-sm text-muted-foreground">
                            {profile?.country === "DZ" ? "Algeria" : profile?.country || "Algeria"}
                        </p>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-2 bg-background rounded-md shadow-sm border">
                            <Pencil className="h-3 w-3 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Edit Profile Dialog */}
                <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <form onSubmit={handleSaveProfile}>
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    These details could be publicly available. Do not use your personal information.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName">Store name</Label>
                                    <Input id="storeName" name="storeName" defaultValue={profile?.businessName || "My Store"} disabled />
                                    <p className="text-xs text-muted-foreground">Appears on your website. To change this, update your Vendor Name.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="storeEmail">Store email</Label>
                                    <Input id="storeEmail" name="storeEmail" defaultValue={profile?.contactEmail || ""} />
                                    <p className="text-xs text-muted-foreground">
                                        Receives messages about your store. For sender email, go to <span className="text-blue-600 cursor-pointer hover:underline">notification settings</span>
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="storePhone">Store phone</Label>
                                    <Input id="storePhone" name="storePhone" defaultValue={profile?.phone || ""} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={() => setIsProfileOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isLoading}>Save</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Billing Dialog */}
                <Dialog open={isBillingOpen} onOpenChange={setIsBillingOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <form onSubmit={handleSaveBilling}>
                            <DialogHeader>
                                <DialogTitle>Billing information</DialogTitle>
                                <DialogDescription>
                                    Your customers could see this information.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="legalName">Legal business name</Label>
                                    <Input id="legalName" name="legalName" defaultValue={profile?.businessName || ""} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="billing-country">Country/region</Label>
                                    <Select name="country" defaultValue={profile?.country || "DZ"}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DZ">🇩🇿 Algeria</SelectItem>
                                            <SelectItem value="US">🇺🇸 United States</SelectItem>
                                            <SelectItem value="FR">🇫🇷 France</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="address" name="address" className="pl-9" defaultValue={profile?.address || ""} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="apartment">Apartment, suite, etc.</Label>
                                    <Input id="apartment" name="apartment" placeholder="Apartment, suite, etc." defaultValue={profile?.apartment || ""} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="postalCode">Postal code</Label>
                                        <Input id="postalCode" name="zipCode" defaultValue={profile?.zipCode || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" name="city" defaultValue={profile?.city || ""} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={() => setIsBillingOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}
