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
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { createPayoutMethod, updatePayoutMethod } from "@/actions/seller"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PayoutMethodFormProps {
    method?: any
    onSuccess: () => void
    onCancel: () => void
}

export function PayoutMethodForm({ method, onSuccess, onCancel }: PayoutMethodFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [type, setType] = useState(method?.type || 'PAYPAL')
    const [label, setLabel] = useState(method?.label || '')
    const [isDefault, setIsDefault] = useState(method?.isDefault || false)
    const [details, setDetails] = useState<any>(method?.details || {})
    const router = useRouter()

    // Reset details when type changes for new methods
    useEffect(() => {
        if (!method) {
            setDetails({})
        }
    }, [type, method])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const data = {
                type,
                label,
                details,
                isDefault
            }

            let result
            if (method) {
                result = await updatePayoutMethod(method.id, data)
            } else {
                result = await createPayoutMethod(data)
            }

            if (result.success) {
                toast.success(method ? "Payout method updated" : "Payout method added")
                router.refresh()
                onSuccess()
            } else {
                toast.error(result.error || "Failed to save payout method")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const updateDetail = (key: string, value: string) => {
        setDetails((prev: any) => ({ ...prev, [key]: value }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Payment Method Type</Label>
                    <Select
                        value={type}
                        onValueChange={setType}
                        disabled={!!method} // Cannot change type when editing
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PAYPAL">PayPal</SelectItem>
                            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                            <SelectItem value="CRYPTO">Cryptocurrency</SelectItem>
                            <SelectItem value="STRIPE">Stripe</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="label">Label (e.g., &quot;My Main PayPal&quot;)</Label>
                    <Input
                        id="label"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="Give this method a name"
                        required
                    />
                </div>

                {/* Dynamic Fields based on Type */}
                {type === 'PAYPAL' && (
                    <div className="space-y-2">
                        <Label htmlFor="paypal-email">PayPal Email</Label>
                        <Input
                            id="paypal-email"
                            type="email"
                            value={details.email || ''}
                            onChange={(e) => updateDetail('email', e.target.value)}
                            placeholder="email@example.com"
                            required
                        />
                    </div>
                )}

                {type === 'BANK_TRANSFER' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bank-name">Bank Name</Label>
                                <Input
                                    id="bank-name"
                                    value={details.bankName || ''}
                                    onChange={(e) => updateDetail('bankName', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="account-holder">Account Holder Name</Label>
                                <Input
                                    id="account-holder"
                                    value={details.accountHolder || ''}
                                    onChange={(e) => updateDetail('accountHolder', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="account-number">Account Number / IBAN</Label>
                            <Input
                                id="account-number"
                                value={details.accountNumber || ''}
                                onChange={(e) => updateDetail('accountNumber', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="swift">SWIFT / BIC Code</Label>
                            <Input
                                id="swift"
                                value={details.swift || ''}
                                onChange={(e) => updateDetail('swift', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                )}

                {type === 'CRYPTO' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="chain">Network / Chain</Label>
                            <Select
                                value={details.chain || ''}
                                onValueChange={(val) => updateDetail('chain', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select network" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                                    <SelectItem value="ETH">Ethereum (ERC20)</SelectItem>
                                    <SelectItem value="USDT_TRC20">USDT (TRC20)</SelectItem>
                                    <SelectItem value="USDT_ERC20">USDT (ERC20)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="wallet-address">Wallet Address</Label>
                            <Input
                                id="wallet-address"
                                value={details.address || ''}
                                onChange={(e) => updateDetail('address', e.target.value)}
                                placeholder="0x..."
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="default"
                        checked={isDefault}
                        onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                    />
                    <Label htmlFor="default" className="font-normal cursor-pointer">
                        Set as default payment method
                    </Label>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : (method ? "Update Method" : "Add Method")}
                </Button>
            </div>
        </form>
    )
}
