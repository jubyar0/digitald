import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const dynamic = 'force-dynamic'

export default function ShippingPage() {
    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Shipping Settings</h3>
                            <p className="dashboard-card-description">Configure shipping rates and zones</p>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="freeShipping">Free Shipping Threshold ($)</Label>
                                <Input id="freeShipping" type="number" placeholder="100.00" />
                                <p className="text-sm text-muted-foreground">Orders above this amount get free shipping</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="flatRate">Flat Rate Shipping ($)</Label>
                                <Input id="flatRate" type="number" placeholder="10.00" />
                                <p className="text-sm text-muted-foreground">Standard shipping cost for all orders</p>
                            </div>

                            <div className="flex gap-2">
                                <Button>Save Changes</Button>
                                <Button variant="outline">Cancel</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
