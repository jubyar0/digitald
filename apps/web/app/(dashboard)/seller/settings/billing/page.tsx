import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Receipt, PlusCircle, MoreHorizontal, Search, ArrowUpDown, FileText } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = 'force-dynamic'

export default function BillingPage() {
    return (
        <div className="p-6 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Receipt className="h-6 w-6 text-muted-foreground" />
                    <h1 className="text-2xl font-semibold">Billing</h1>
                </div>
                <Button variant="outline" className="gap-2" asChild>
                    <Link href="/seller/settings/billing/profile">
                        <FileText className="h-4 w-4" />
                        Billing profile
                    </Link>
                </Button>
            </div>

            <div className="space-y-6">
                {/* Upcoming Bill */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">Upcoming bill</CardTitle>
                            <Button variant="link" className="text-blue-600 h-auto p-0">View bill</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold">$0.00 USD</span>
                                <span className="text-muted-foreground text-sm">USD</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Next bill in 2 days or when your $60 USD threshold is reached. You have $60 remaining.
                            </p>
                        </div>

                        <Button variant="outline" className="w-full justify-start gap-2 h-12 border-dashed">
                            <PlusCircle className="h-4 w-4" />
                            Add payment method
                        </Button>
                    </CardContent>
                </Card>

                <div className="text-sm text-muted-foreground">
                    To make changes to your plan, <Link href="/seller/settings/plan" className="text-blue-600 hover:underline">visit plan settings</Link>
                </div>

                {/* Past Bills */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">Past bills</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="all" className="w-full">
                            <div className="flex items-center justify-between mb-4">
                                <TabsList className="bg-transparent p-0 h-auto gap-2">
                                    <TabsTrigger
                                        value="all"
                                        className="rounded-full border px-4 py-1.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black h-auto"
                                    >
                                        All
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="paid"
                                        className="rounded-full border px-4 py-1.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black h-auto"
                                    >
                                        Paid
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="unpaid"
                                        className="rounded-full border px-4 py-1.5 data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black h-auto"
                                    >
                                        Unpaid
                                    </TabsTrigger>
                                </TabsList>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                        <Search className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                        <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="min-h-[300px] flex flex-col items-center justify-center text-center border rounded-lg bg-gray-50/30">
                                <p className="text-sm text-muted-foreground font-medium">Your past bills will appear here.</p>
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
