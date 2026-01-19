'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DollarSignIcon } from "lucide-react"
import { useState } from "react"
import { requestWithdrawal } from "@/actions/seller"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface RequestPayoutFormProps {
    availableBalance: number
    currency: string
    savedMethods: any[]
}

export function RequestPayoutForm({ availableBalance, currency, savedMethods }: RequestPayoutFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [amount, setAmount] = useState('')
    const [selectedMethodId, setSelectedMethodId] = useState<string>(
        savedMethods.find(m => m.isDefault)?.id || 'manual'
    )

    // Manual entry state
    const [method, setMethod] = useState('')
    const [details, setDetails] = useState('')

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const amountNum = parseFloat(amount)

        if (!amount || amountNum <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        if (amountNum > availableBalance) {
            toast.error("Amount exceeds available balance")
            return
        }

        // Validation based on selection
        if (selectedMethodId === 'manual') {
            if (!method) {
                toast.error("Please select a withdrawal method")
                return
            }
            if (!details.trim()) {
                toast.error("Please provide payment details")
                return
            }
        }

        setIsLoading(true)

        try {
            const payload: any = {
                amount: amountNum
            }

            if (selectedMethodId === 'manual') {
                payload.method = method
                payload.details = details
            } else {
                payload.payoutMethodId = selectedMethodId
            }

            const result = await requestWithdrawal(payload)

            if (result.success) {
                toast.success("Withdrawal request submitted successfully")
                setAmount('')
                if (selectedMethodId === 'manual') {
                    setMethod('')
                    setDetails('')
                }
                router.refresh()
            } else {
                toast.error(result.error || "Failed to submit withdrawal request")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                    <DollarSignIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-3xl font-bold">${availableBalance.toFixed(2)}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="amount">Payout Amount ({currency})</Label>
                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={availableBalance}
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        Maximum: ${availableBalance.toFixed(2)}
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="payout-method">Payout Method</Label>
                    <Select value={selectedMethodId} onValueChange={setSelectedMethodId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select payout method" />
                        </SelectTrigger>
                        <SelectContent>
                            {savedMethods.map((m) => (
                                <SelectItem key={m.id} value={m.id}>
                                    {m.label} ({m.type.replace('_', ' ')})
                                </SelectItem>
                            ))}
                            <SelectItem value="manual">Enter details manually</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {selectedMethodId === 'manual' && (
                    <div className="space-y-4 p-4 border rounded-md bg-muted/20">
                        <div className="space-y-2">
                            <Label htmlFor="method">Withdrawal Method</Label>
                            <Select value={method} onValueChange={setMethod} required={selectedMethodId === 'manual'}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                    <SelectItem value="PAYPAL">PayPal</SelectItem>
                                    <SelectItem value="CRYPTO">Cryptocurrency</SelectItem>
                                    <SelectItem value="STRIPE">Stripe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="details">Payment Details</Label>
                            <Textarea
                                id="details"
                                placeholder="Enter your bank account number, PayPal email, crypto wallet address, etc."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows={4}
                                required={selectedMethodId === 'manual'}
                            />
                            <p className="text-xs text-muted-foreground">
                                Provide the necessary information for the selected payment method
                            </p>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || availableBalance <= 0}
                >
                    {isLoading ? "Submitting..." : "Request Payout"}
                </Button>
            </div>
        </form>
    )
}
