import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Info, ChevronRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
    return (
        <div className="p-6 max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Checkout</h1>
            </div>

            <div className="space-y-6">
                {/* Customer Contact Method */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">Customer contact method</CardTitle>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <CardDescription>
                            The contact method customers enter at checkout will receive order and shipping <Link href="#" className="text-blue-600 hover:underline">notifications</Link>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup defaultValue="phone-email">
                            <div className="flex items-start space-x-3 space-y-0 mb-4">
                                <RadioGroupItem value="phone-email" id="phone-email" className="mt-1" />
                                <div className="grid gap-1.5">
                                    <Label htmlFor="phone-email" className="font-medium">Phone number or email</Label>
                                    <p className="text-sm text-muted-foreground">An <Link href="#" className="text-blue-600 hover:underline">SMS App</Link> is required to send SMS updates</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 space-y-0">
                                <RadioGroupItem value="email" id="email" className="mt-1" />
                                <div className="grid gap-1.5">
                                    <Label htmlFor="email" className="font-medium">Email</Label>
                                </div>
                            </div>
                        </RadioGroup>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-start space-x-3">
                                <Checkbox id="show-shop-link" defaultChecked className="mt-1" />
                                <div className="grid gap-1.5">
                                    <Label htmlFor="show-shop-link" className="font-medium">Show a link for customers to track their order with <Link href="#" className="text-blue-600 hover:underline">Shop</Link></Label>
                                    <p className="text-sm text-muted-foreground">Customers will be able to download the app from the order status page</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Checkbox id="require-signin" className="mt-1" />
                                <div className="grid gap-1.5">
                                    <Label htmlFor="require-signin" className="font-medium">Require customers to sign in to their account before checkout</Label>
                                    <p className="text-sm text-muted-foreground">Customers can only use email when sign-in is required</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Customer information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-muted-foreground">Full name</Label>
                            <RadioGroup defaultValue="last-name">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="last-name" id="last-name" />
                                    <Label htmlFor="last-name" className="font-normal">Only require last name</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="first-last-name" id="first-last-name" />
                                    <Label htmlFor="first-last-name" className="font-normal">Require first and last name</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Company Name */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-muted-foreground">Company name</Label>
                            <RadioGroup defaultValue="dont-include">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="dont-include" id="company-dont-include" />
                                    <Label htmlFor="company-dont-include" className="font-normal">Don't include</Label>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded ml-2">Recommended</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="optional" id="company-optional" />
                                    <Label htmlFor="company-optional" className="font-normal">Optional</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="required" id="company-required" />
                                    <Label htmlFor="company-required" className="font-normal">Required</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Address Line 2 */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-muted-foreground">Address line 2 (apartment, unit, etc.)</Label>
                            <RadioGroup defaultValue="optional">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="dont-include" id="address2-dont-include" />
                                    <Label htmlFor="address2-dont-include" className="font-normal">Don't include</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="optional" id="address2-optional" />
                                    <Label htmlFor="address2-optional" className="font-normal">Optional</Label>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded ml-2">Recommended</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="required" id="address2-required" />
                                    <Label htmlFor="address2-required" className="font-normal">Required</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Shipping Address Phone Number */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-muted-foreground">Shipping address phone number</Label>
                            <RadioGroup defaultValue="dont-include">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="dont-include" id="phone-dont-include" />
                                    <Label htmlFor="phone-dont-include" className="font-normal">Don't include</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="optional" id="phone-optional" />
                                    <Label htmlFor="phone-optional" className="font-normal">Optional</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="required" id="phone-required" />
                                    <Label htmlFor="phone-required" className="font-normal">Required</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                {/* Marketing Options */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base font-semibold">Marketing options</CardTitle>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <CardDescription>
                                Display a checkbox for customers to sign up for email or SMS marketing
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm">Customize labels</Button>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="email-marketing" />
                                <Label htmlFor="email-marketing" className="font-medium">Email</Label>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between py-2 border-t">
                            <div className="flex items-center gap-2">
                                <Checkbox id="sms-marketing" />
                                <Label htmlFor="sms-marketing" className="font-medium">SMS</Label>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                {/* Tipping */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">Tipping</CardTitle>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <CardDescription>
                            Customers can choose between 3 presets or enter a custom amount
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="show-tipping" />
                            <Label htmlFor="show-tipping">Show tipping options at checkout</Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Checkout Language */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Checkout language</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm font-medium">English</span>
                            <Button variant="outline" size="sm">Edit checkout content</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Advanced Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Advanced preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Address collection</p>
                                        <p className="text-sm text-muted-foreground">Manage how you collect shipping and billing addresses</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm">Add-to-cart limit</p>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Recommended</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Protects your available inventory quantities from being revealed</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">On</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Checkout Rules */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">Checkout rules</CardTitle>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <CardDescription>
                            Rules set parameters for how the cart or checkout responds to different customer scenarios. You can set product limits, perform age verification and more.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-gray-50 rounded-lg text-sm text-muted-foreground">
                            There are no apps installed with rules for checkout or cart. Visit the <Link href="#" className="text-blue-600 hover:underline">dIGO App Store</Link> to install one.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
