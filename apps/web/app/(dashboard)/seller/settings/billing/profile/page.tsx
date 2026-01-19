import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, PlusCircle, MapPin, Banknote, Info, ChevronLeft, Lock, Search } from "lucide-react"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function BillingProfilePage() {
    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild className="-ml-2">
                    <Link href="/seller/settings/billing">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h1 className="text-xl font-semibold">Billing profile</h1>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Your payment methods, billing currency and store address
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Payment Methods */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Payment methods</CardTitle>
                        <CardDescription>For purchases and bills in dIGO</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full justify-start gap-2 h-12 border-dashed text-muted-foreground hover:text-foreground">
                                    <PlusCircle className="h-4 w-4" />
                                    Add payment method
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Add credit card</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="payment-type">Payment method type</Label>
                                        <Select defaultValue="credit-card">
                                            <SelectTrigger id="payment-type">
                                                <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="credit-card">Credit card</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="card-number">Card number</Label>
                                        <div className="relative">
                                            <Input id="card-number" placeholder="" className="pr-10" />
                                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="expires">Expires</Label>
                                            <Input id="expires" placeholder="MM / YY" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="cvv">CVV</Label>
                                            <div className="relative">
                                                <Input id="cvv" placeholder="" className="pr-10" />
                                                <Info className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-medium text-sm">Billing address</h4>

                                        <div className="grid gap-2">
                                            <Label htmlFor="country">Country/region</Label>
                                            <Select defaultValue="algeria">
                                                <SelectTrigger id="country">
                                                    <SelectValue placeholder="Select country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="algeria">Algeria</SelectItem>
                                                    <SelectItem value="us">United States</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="first-name">First name</Label>
                                                <Input id="first-name" defaultValue="Aiosana" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="last-name">Last name</Label>
                                                <Input id="last-name" defaultValue="Ali" />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="address">Address</Label>
                                            <div className="relative">
                                                <Input id="address" className="pl-10" />
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="apartment">Apartment, suite, etc.</Label>
                                            <Input id="apartment" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="postal-code">Postal code</Label>
                                                <Input id="postal-code" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="city">City</Label>
                                                <Input id="city" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline">Cancel</Button>
                                    <Button>Save card</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                {/* Address and Currency */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base">Address and currency</CardTitle>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <CardDescription>
                            The options for your billing currency are determined by your billing address
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {/* Store Address */}
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Store address</p>
                                        <p className="text-sm text-muted-foreground">My Store, Algeria</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/seller/settings/general">
                                        Manage
                                    </Link>
                                </Button>
                            </div>

                            {/* Currency */}
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <Banknote className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Currency</p>
                                        <p className="text-sm text-muted-foreground">USD (US Dollar)</p>
                                    </div>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">Manage</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px]">
                                        <DialogHeader>
                                            <DialogTitle>Switch billing currency</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <div className="flex items-center space-x-2 border p-4 rounded-lg bg-gray-50/50">
                                                <div className="h-4 w-4 rounded-full border border-primary bg-primary flex items-center justify-center">
                                                    <div className="h-2 w-2 rounded-full bg-white" />
                                                </div>
                                                <span className="text-sm font-medium">USD (US Dollar)</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                                                This change will be applied to your next billing cycle. If you have any outstanding charges, you'll be billed for them in your current currency (USD). Any remaining credits will be converted to the new currency. Learn more about <a href="#" className="text-blue-600 hover:underline">your billing currency</a>.
                                            </p>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline">Cancel</Button>
                                            <Button className="bg-black text-white hover:bg-black/90">Confirm</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
