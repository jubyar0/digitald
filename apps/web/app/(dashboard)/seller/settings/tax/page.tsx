import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TaxPage() {
    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Tax Settings</h3>
                            <p className="dashboard-card-description">Configure tax rates and information</p>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                                <Input id="taxRate" type="number" placeholder="8.5" step="0.1" />
                                <p className="text-sm text-muted-foreground">Default tax rate for your products</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="taxNumber">Tax ID / VAT Number</Label>
                                <Input id="taxNumber" placeholder="XX-XXXXXXX" />
                                <p className="text-sm text-muted-foreground">Your business tax identification number</p>
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
