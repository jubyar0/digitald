import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Check, X, ChevronLeft, Store, ShoppingBag } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function PickPlanPage() {
    return (
        <div className="min-h-screen bg-muted/40 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/seller/settings/plan">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        <span className="font-semibold">Pick your plan</span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/seller/settings/plan">
                        <X className="h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
                {/* Hero */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Everything you need to run your business</h1>
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Check className="h-4 w-4 text-blue-600" /> World's best checkout</span>
                        <span className="flex items-center gap-1"><Check className="h-4 w-4 text-blue-600" /> Sell online and in person</span>
                        <span className="flex items-center gap-1"><Check className="h-4 w-4 text-blue-600" /> 24/7 chat support</span>
                        <span className="flex items-center gap-1"><Check className="h-4 w-4 text-blue-600" /> Over 13,000 apps</span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Basic */}
                    <Card className="relative flex flex-col border-2 border-blue-100 shadow-lg">
                        <div className="absolute top-0 left-0 right-0 -mt-3 flex justify-center">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">Most popular</Badge>
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl">Basic</CardTitle>
                            <CardDescription>For solo entrepreneurs</CardDescription>
                            <div className="mt-4">
                                <span className="text-3xl font-bold text-gray-400 line-through decoration-red-500 decoration-2">$27</span>
                                <span className="text-4xl font-bold ml-2">$1</span>
                                <span className="text-sm text-muted-foreground ml-1">USD/month<br />for first 3 months</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Button className="w-full mb-6 bg-black hover:bg-black/90">Select Basic</Button>
                            <ul className="space-y-3 text-sm">
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Earn $4,500 in credits as you sell</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Full online store</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Sell in person with a phone or card reader</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> 10 inventory locations</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Easy shipping labels</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Grow */}
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl">Grow</CardTitle>
                            <CardDescription>For small teams</CardDescription>
                            <div className="mt-4">
                                <span className="text-3xl font-bold text-gray-400 line-through decoration-red-500 decoration-2">$72</span>
                                <span className="text-4xl font-bold ml-2">$1</span>
                                <span className="text-sm text-muted-foreground ml-1">USD/month<br />for first 3 months</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Button className="w-full mb-6 bg-black hover:bg-black/90">Select Grow</Button>
                            <ul className="space-y-3 text-sm">
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Earn $6,500 in credits as you sell</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Full online store</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Sell in person with a phone or card reader</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> 10 inventory locations</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Shipping discounts + Insurance</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> 5 staff accounts</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Advanced */}
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl">Advanced</CardTitle>
                            <CardDescription>As your business scales</CardDescription>
                            <div className="mt-4">
                                <span className="text-3xl font-bold text-gray-400 line-through decoration-red-500 decoration-2">$399</span>
                                <span className="text-4xl font-bold ml-2">$1</span>
                                <span className="text-sm text-muted-foreground ml-1">USD/month<br />for first 3 months</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Button className="w-full mb-6 bg-black hover:bg-black/90">Select Advanced</Button>
                            <ul className="space-y-3 text-sm">
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Earn $8,000 in credits as you sell</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Full online store</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Sell in person with a phone or card reader</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> 10 inventory locations</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Fully integrated shipping</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> 15 staff accounts</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Local storefronts by market</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Enhanced 24/7 chat support</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Plus */}
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl">Plus</CardTitle>
                            <CardDescription>For more complex businesses</CardDescription>
                            <div className="mt-4">
                                <p className="text-xs text-muted-foreground">Starting at</p>
                                <span className="text-4xl font-bold">$2,300</span>
                                <span className="text-sm text-muted-foreground ml-1">USD/month</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Button className="w-full mb-6 bg-black hover:bg-black/90">Select Plus</Button>
                            <ul className="space-y-3 text-sm">
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Full online store</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Sell in person with POS Pro for up to 200 locations</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> 200 inventory locations</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Local storefronts by market</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Fully integrated shipping</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Unlimited staff accounts</li>
                                <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Priority 24/7 phone support</li>
                                <li className="flex gap-2 text-blue-600"><Check className="h-4 w-4 shrink-0" /> Fully customizable checkout</li>
                                <li className="flex gap-2 text-blue-600"><Check className="h-4 w-4 shrink-0" /> Sell wholesale B2B</li>
                                <li className="flex gap-2 text-blue-600"><Check className="h-4 w-4 shrink-0" /> Optimize ads with Audiences</li>
                                <li className="flex gap-2 text-blue-600"><Check className="h-4 w-4 shrink-0" /> 9 free expansion stores</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Compare Plans */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Compare plans</h2>
                    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-muted/50 flex items-center gap-2">
                            <Switch id="diff-only" />
                            <Label htmlFor="diff-only">Only show differences</Label>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-4 text-left font-medium w-1/4">Pricing</th>
                                        <th className="p-4 text-center font-medium w-1/6">Basic<br /><span className="text-xs text-muted-foreground font-normal">Most popular</span></th>
                                        <th className="p-4 text-center font-medium w-1/6">Grow</th>
                                        <th className="p-4 text-center font-medium w-1/6">Advanced</th>
                                        <th className="p-4 text-center font-medium w-1/6">Plus</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="p-4 font-medium">Pay monthly</td>
                                        <td className="p-4 text-center">$27 USD/mo</td>
                                        <td className="p-4 text-center">$72 USD/mo</td>
                                        <td className="p-4 text-center">$399 USD/mo</td>
                                        <td className="p-4 text-center text-xs text-muted-foreground">Starting at<br />$2,300 USD/mo<br />on a 3-year term</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium">Pay yearly (Save up to 25%)*</td>
                                        <td className="p-4 text-center">$19 USD/mo*</td>
                                        <td className="p-4 text-center">$54 USD/mo*</td>
                                        <td className="p-4 text-center">$299 USD/mo*</td>
                                        <td className="p-4 text-center">—</td>
                                    </tr>
                                    <tr className="bg-muted/50">
                                        <td colSpan={5} className="p-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Core features</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4">Earn 0.5% back on all sales</td>
                                        <td className="p-4 text-center">Up to $4,500 USD</td>
                                        <td className="p-4 text-center">Up to $6,500 USD</td>
                                        <td className="p-4 text-center">Up to $8,000 USD</td>
                                        <td className="p-4 text-center">—</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4">Online store</td>
                                        <td className="p-4 text-center">Full-featured</td>
                                        <td className="p-4 text-center">Full-featured</td>
                                        <td className="p-4 text-center">Full-featured</td>
                                        <td className="p-4 text-center">Full-featured</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 text-center border-t">
                            <Button variant="outline" size="sm">See all features</Button>
                        </div>
                    </div>
                </div>

                {/* More ways to sell */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">More ways to sell</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold">Starter</h3>
                                </div>
                                <CardDescription>For selling on social</CardDescription>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold text-gray-400 line-through decoration-red-500 decoration-2">$5</span>
                                    <span className="text-4xl font-bold ml-2">$1</span>
                                    <span className="text-sm text-muted-foreground ml-1">USD/month<br />for first 3 months</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full mb-6 bg-black hover:bg-black/90">Select Starter</Button>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Limited online store (one theme)</li>
                                    <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> 2 inventory locations</li>
                                    <li className="flex gap-2 text-muted-foreground"><X className="h-4 w-4 shrink-0" /> No custom pages or menus</li>
                                    <li className="flex gap-2 text-muted-foreground"><X className="h-4 w-4 shrink-0" /> No product collections</li>
                                    <li className="flex gap-2 text-muted-foreground"><X className="h-4 w-4 shrink-0" /> No POS Pro compatibility</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-xl font-bold">Retail</h3>
                                </div>
                                <CardDescription>For selling at retail stores</CardDescription>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold text-gray-400 line-through decoration-red-500 decoration-2">$89</span>
                                    <span className="text-4xl font-bold ml-2">$1</span>
                                    <span className="text-sm text-muted-foreground ml-1">USD/month<br />for first 3 months</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full mb-6 bg-black hover:bg-black/90">Select Retail</Button>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Sell in person with POS Pro (1 location included)</li>
                                    <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> 10 inventory locations</li>
                                    <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Unlimited POS staff with roles & permissions</li>
                                    <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Inventory management</li>
                                    <li className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Rich customer profiles and insights</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* FAQ */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Frequently asked questions</h2>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">General</h3>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>What is dIGO and how does it work?</AccordionTrigger>
                                    <AccordionContent>
                                        dIGO is a complete commerce platform that lets you start, grow, and manage a business.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>How much does dIGO cost?</AccordionTrigger>
                                    <AccordionContent>
                                        dIGO has several plans ranging from $5/month to custom enterprise pricing.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How do I earn subscription credits with the 0.5% back offer?</AccordionTrigger>
                                    <AccordionContent>
                                        Details about the credit offer...
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Payment</h3>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>Are there any transaction fees?</AccordionTrigger>
                                    <AccordionContent>
                                        Use dIGO Payments to avoid transaction fees.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
