"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect, useTransition } from "react"
import { getTaxSettings, updateTaxSettings } from "@/actions/seller"
import { Loader2, CheckCircle } from "lucide-react"

export default function TaxPage() {
    const [isPending, startTransition] = useTransition()
    const [saved, setSaved] = useState(false)
    const [taxRate, setTaxRate] = useState("")
    const [taxNumber, setTaxNumber] = useState("")

    useEffect(() => {
        getTaxSettings().then(settings => {
            if (settings) {
                setTaxRate(settings.taxRate?.toString() || "")
                setTaxNumber(settings.taxNumber || "")
            }
        })
    }, [])

    const handleSave = () => {
        startTransition(async () => {
            const result = await updateTaxSettings({
                taxRate: taxRate ? parseFloat(taxRate) : undefined,
                taxNumber: taxNumber || undefined
            })
            if (result.success) {
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
            }
        })
    }

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
                                <Input
                                    id="taxRate"
                                    type="number"
                                    placeholder="8.5"
                                    step="0.1"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">Default tax rate for your products</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="taxNumber">Tax ID / VAT Number</Label>
                                <Input
                                    id="taxNumber"
                                    placeholder="XX-XXXXXXX"
                                    value={taxNumber}
                                    onChange={(e) => setTaxNumber(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">Your business tax identification number</p>
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={handleSave} disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : saved ? (
                                        <>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Saved!
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                                <Button variant="outline" onClick={() => {
                                    getTaxSettings().then(settings => {
                                        if (settings) {
                                            setTaxRate(settings.taxRate?.toString() || "")
                                            setTaxNumber(settings.taxNumber || "")
                                        }
                                    })
                                }}>
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
