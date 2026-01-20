import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCircle, Info, Lock, RotateCcw, Wallet, Link as LinkIcon, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function CustomerAccountsPage() {
    return (
        <div className="p-6 max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
                <UserCircle className="h-6 w-6 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Customer accounts</h1>
            </div>

            <div className="space-y-6">
                {/* Sign-in links */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Sign-in links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <div className="h-4 w-4 border rounded flex items-center justify-center">
                                        <div className="h-2 w-2 bg-foreground rounded-sm" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Show sign-in links</p>
                                    <p className="text-sm text-muted-foreground">Show sign-in links in the header of online store and at checkout</p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Choose which version of customer accounts to link to</p>
                            <RadioGroup defaultValue="new" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                                    <RadioGroupItem value="new" id="new" className="mt-1" />
                                    <div className="grid gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="new" className="font-medium">Customer accounts</Label>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">Recommended</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Customers sign in with a one-time code sent to their email (no passwords)</p>
                                    </div>
                                </div>
                                <div className="relative flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                                    <RadioGroupItem value="legacy" id="legacy" className="mt-1" />
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="legacy" className="font-medium">Legacy</Label>
                                        <p className="text-sm text-muted-foreground">Customers create an account and sign in with email and password</p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer accounts details */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">Customer accounts</CardTitle>
                            <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Authentication */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Authentication</p>
                                    <p className="text-sm text-muted-foreground">Manage sign-in methods and account access</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Manage</Button>
                        </div>

                        {/* Self-serve returns */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Self-serve returns</p>
                                    <p className="text-sm text-muted-foreground">
                                        Allow customers to request and manage returns. Customize what your customers can return with <Link href="#" className="text-blue-600 hover:underline">return rules</Link>
                                    </p>
                                </div>
                            </div>
                            <Switch />
                        </div>

                        {/* Store credit */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <Wallet className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Store credit</p>
                                    <p className="text-sm text-muted-foreground">Allow customers to view and spend store credit</p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        {/* URL */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">URL</p>
                                        <p className="text-sm text-muted-foreground">Use this URL anywhere you'd like customers to access customer accounts</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Manage</Button>
                            </div>
                            <div className="bg-gray-100 p-2 rounded text-sm text-muted-foreground pl-3">
                                https://dIGO.com/735600589247/account
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2">
                                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                                    <p className="text-sm text-blue-700">Your Order status page uses this domain.</p>
                                </div>
                                <button className="text-blue-400 hover:text-blue-600">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
