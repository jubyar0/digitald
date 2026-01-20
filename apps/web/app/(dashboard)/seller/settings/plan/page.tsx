import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ChevronRight } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function PlanPage() {
    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Plan</h1>
            </div>

            <div className="space-y-6">
                {/* Plan Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Plan details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-dashed">
                            <div className="flex items-center gap-3">
                                <span className="font-medium">Trial</span>
                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-0 rounded-sm font-normal px-2">
                                    2 days remaining
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    Cancel trial
                                </Button>
                                <Button className="bg-black text-white hover:bg-black/90" asChild>
                                    <Link href="/seller/settings/plan/pick">
                                        Choose plan
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Link href="#" className="text-sm text-blue-600 hover:underline">
                                View the terms of service and privacy policy
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscriptions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Additional items you're billed for on a recurring basis
                        </p>

                        <div className="pt-2">
                            <Button variant="outline" className="w-full justify-between font-normal" asChild>
                                <Link href="#">
                                    <span>View all subscriptions</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
