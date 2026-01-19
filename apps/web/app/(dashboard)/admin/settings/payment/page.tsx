'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { getPlatformSettings, updatePlatformSettings } from '@/actions/admin'
import { toast } from 'sonner'
import { Loader2Icon, SaveIcon } from 'lucide-react'

export default function PaymentSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [platformFeePercent, setPlatformFeePercent] = useState(30)
    const [cryptoPaymentEnabled, setCryptoPaymentEnabled] = useState(true)
    const [disputePeriodDays, setDisputePeriodDays] = useState(14)
    const [escrowHoldDays, setEscrowHoldDays] = useState(7)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const result = await getPlatformSettings()
            if (result.data) {
                setPlatformFeePercent(result.data.platformFeePercent)
                setCryptoPaymentEnabled(result.data.cryptoPaymentEnabled)
                setDisputePeriodDays(result.data.disputePeriodDays)
                setEscrowHoldDays(result.data.escrowHoldDays)
            }
        } catch (error) {
            toast.error('Failed to load payment settings')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await updatePlatformSettings({
                platformFeePercent,
                cryptoPaymentEnabled,
                disputePeriodDays,
                escrowHoldDays,
            })
            toast.success('Payment settings saved successfully')
        } catch (error) {
            toast.error('Failed to save payment settings')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-1 flex-col container mx-auto">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-8 dashboard-padding">
                        <div className="flex items-center justify-center h-64">
                            <Loader2Icon className="h-8 w-8 animate-spin" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Payment Settings</h3>
                            <p className="dashboard-card-description">
                                Configure payment gateways and platform fees
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {/* Platform Fee */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Platform Fee</CardTitle>
                                <CardDescription>
                                    Set the platform commission percentage
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="platformFee">Platform Fee Percentage</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="platformFee"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={platformFeePercent}
                                            onChange={(e) => setPlatformFeePercent(parseFloat(e.target.value))}
                                            className="max-w-xs"
                                        />
                                        <span className="text-muted-foreground">%</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        The percentage fee charged on each transaction
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Crypto Payment */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Cryptocurrency Payments</CardTitle>
                                <CardDescription>
                                    Enable or disable crypto payment options
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="cryptoPayment">Enable Crypto Payments</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Allow users to pay with cryptocurrency
                                        </p>
                                    </div>
                                    <Switch
                                        id="cryptoPayment"
                                        checked={cryptoPaymentEnabled}
                                        onCheckedChange={setCryptoPaymentEnabled}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Escrow & Disputes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Escrow & Dispute Settings</CardTitle>
                                <CardDescription>
                                    Configure escrow hold period and dispute timeframes
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="escrowHold">Escrow Hold Period</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="escrowHold"
                                            type="number"
                                            min="1"
                                            max="90"
                                            value={escrowHoldDays}
                                            onChange={(e) => setEscrowHoldDays(parseInt(e.target.value))}
                                            className="max-w-xs"
                                        />
                                        <span className="text-muted-foreground">days</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Number of days to hold funds in escrow after purchase
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="disputePeriod">Dispute Period</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="disputePeriod"
                                            type="number"
                                            min="1"
                                            max="90"
                                            value={disputePeriodDays}
                                            onChange={(e) => setDisputePeriodDays(parseInt(e.target.value))}
                                            className="max-w-xs"
                                        />
                                        <span className="text-muted-foreground">days</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Number of days buyers can open a dispute after purchase
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button onClick={handleSave} disabled={saving} size="lg">
                                {saving ? (
                                    <>
                                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <SaveIcon className="mr-2 h-4 w-4" />
                                        Save Settings
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
