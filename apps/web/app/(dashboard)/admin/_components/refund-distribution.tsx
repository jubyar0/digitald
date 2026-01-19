'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { Slider } from '@/components/dashboard/ui/slider'
import { Label } from '@/components/dashboard/ui/label'
import { Textarea } from '@/components/dashboard/ui/textarea'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Loader2, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { resolveDispute } from '@/actions/disputes'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/dashboard/ui/alert-dialog'

interface RefundDistributionProps {
    disputeId: string
    orderAmount: number
}

export function RefundDistribution({ disputeId, orderAmount }: RefundDistributionProps) {
    const [buyerPercentage, setBuyerPercentage] = useState(50)
    const [resolution, setResolution] = useState('')
    const [processing, setProcessing] = useState(false)

    const buyerAmount = (orderAmount * buyerPercentage) / 100
    const sellerAmount = orderAmount - buyerAmount

    async function handleResolve() {
        if (!resolution.trim()) {
            toast.error('Please provide a resolution description')
            return
        }

        setProcessing(true)
        try {
            const result = await resolveDispute(disputeId, resolution, {
                buyerAmount,
                sellerAmount
            })

            if (result.success) {
                toast.success('Dispute resolved successfully')
                window.location.reload()
            } else {
                toast.error(result.error || 'Failed to resolve dispute')
            }
        } catch (error) {
            toast.error('Failed to resolve dispute')
        } finally {
            setProcessing(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Refund Distribution
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label className="mb-4 block">Distribution Slider</Label>
                    <Slider
                        value={[buyerPercentage]}
                        onValueChange={(value) => setBuyerPercentage(value[0])}
                        max={100}
                        step={5}
                        className="mb-4"
                    />
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Buyer: {buyerPercentage}%</span>
                        <span className="text-muted-foreground">Seller: {100 - buyerPercentage}%</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <p className="text-sm font-medium mb-1">Buyer Refund</p>
                        <p className="text-2xl font-bold">${buyerAmount.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <p className="text-sm font-medium mb-1">Seller Keeps</p>
                        <p className="text-2xl font-bold">${sellerAmount.toFixed(2)}</p>
                    </div>
                </div>

                <div>
                    <Label htmlFor="resolution">Resolution Notes</Label>
                    <Textarea
                        id="resolution"
                        placeholder="Explain the resolution decision..."
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        rows={4}
                        className="mt-2"
                    />
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full" disabled={!resolution.trim()}>
                            Resolve Dispute & Process Refund
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Resolution</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will resolve the dispute and process the following refund:
                                <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                                    <p><strong>Buyer Refund:</strong> ${buyerAmount.toFixed(2)}</p>
                                    <p><strong>Seller Keeps:</strong> ${sellerAmount.toFixed(2)}</p>
                                    <p className="text-sm mt-2"><strong>Resolution:</strong> {resolution}</p>
                                </div>
                                <p className="mt-4 text-sm text-destructive">
                                    This action cannot be undone.
                                </p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResolve} disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm & Resolve'
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <div className="text-xs text-muted-foreground">
                    <p>• The buyer will receive a refund of ${buyerAmount.toFixed(2)}</p>
                    <p>• The seller will keep ${sellerAmount.toFixed(2)}</p>
                    <p>• Both parties will be notified of the resolution</p>
                </div>
            </CardContent>
        </Card>
    )
}
