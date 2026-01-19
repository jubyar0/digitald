'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Gift, Search } from "lucide-react"
import {
    DiscountFormLayout,
    FormSection,
    MethodSection,
    EligibilitySection,
    MaxUsesSection,
    CombinationsSection,
    ActiveDatesSection,
    SummaryCard,
    DiscountMethod,
    EligibilityType,
} from "../components/discount-form-components"

export default function BuyXGetYPage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    // Method
    const [method, setMethod] = useState<DiscountMethod>('code')
    const [discountCode, setDiscountCode] = useState('')

    // Customer Buys
    const [customerBuysType, setCustomerBuysType] = useState<'quantity' | 'amount'>('quantity')
    const [buyQuantity, setBuyQuantity] = useState('')
    const [buyAmount, setBuyAmount] = useState('')
    const [buyProductsType, setBuyProductsType] = useState<'specific'>('specific')
    const [buySearchQuery, setBuySearchQuery] = useState('')

    // Customer Gets
    const [getQuantity, setGetQuantity] = useState('')
    const [getProductsType, setGetProductsType] = useState<'specific'>('specific')
    const [getSearchQuery, setGetSearchQuery] = useState('')

    // Discounted Value
    const [discountedValueType, setDiscountedValueType] = useState<'percentage' | 'fixed' | 'free'>('percentage')
    const [discountedValue, setDiscountedValue] = useState('')
    const [maxUsesPerOrder, setMaxUsesPerOrder] = useState(false)

    // Eligibility
    const [eligibility, setEligibility] = useState<EligibilityType>('all')

    // Max Uses
    const [limitTotal, setLimitTotal] = useState(false)
    const [totalLimit, setTotalLimit] = useState('')
    const [limitPerCustomer, setLimitPerCustomer] = useState(false)

    // Combinations
    const [productDiscounts, setProductDiscounts] = useState(false)
    const [orderDiscounts, setOrderDiscounts] = useState(false)
    const [shippingDiscounts, setShippingDiscounts] = useState(false)

    // Dates
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
    const [startTime, setStartTime] = useState('05:00')
    const [hasEndDate, setHasEndDate] = useState(false)
    const [endDate, setEndDate] = useState('')
    const [endTime, setEndTime] = useState('')

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = ''
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setDiscountCode(code)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // TODO: Implement save logic
            toast.success('Discount created successfully')
            router.push('/seller/marketing/discounts')
        } catch (error) {
            toast.error('Failed to create discount')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDiscard = () => {
        router.push('/seller/marketing/discounts')
    }

    const summaryDetails = [
        'All customers',
        'For Online Store',
        'No usage limits',
        "Can't combine with other discounts",
        'Active from today',
    ]

    return (
        <DiscountFormLayout
            title="Create discount"
            onSave={handleSave}
            onDiscard={handleDiscard}
            isSaving={isSaving}
            summary={
                <SummaryCard
                    title="No discount code yet"
                    type="Buy X get Y"
                    typeIcon={<Gift className="h-4 w-4" />}
                    details={summaryDetails}
                />
            }
        >
            {/* Method Section */}
            <MethodSection
                title="Buy X get Y"
                method={method}
                onMethodChange={setMethod}
                discountCode={discountCode}
                onCodeChange={setDiscountCode}
                onGenerateCode={generateCode}
            />

            {/* Customer Buys */}
            <FormSection title="Customer buys">
                <RadioGroup
                    value={customerBuysType}
                    onValueChange={(v) => setCustomerBuysType(v as 'quantity' | 'amount')}
                    className="mb-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="quantity" id="min-quantity-items" />
                        <Label htmlFor="min-quantity-items" className="font-normal">Minimum quantity of items</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="amount" id="min-purchase-amount" />
                        <Label htmlFor="min-purchase-amount" className="font-normal">Minimum purchase amount</Label>
                    </div>
                </RadioGroup>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="buyQuantity" className="text-sm font-medium mb-2 block">Quantity</Label>
                        <Input
                            id="buyQuantity"
                            name="buyQuantity"
                            type="number"
                            value={buyQuantity}
                            onChange={(e) => setBuyQuantity(e.target.value)}
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <Label htmlFor="buyProductsType" className="text-sm font-medium mb-2 block">Any items from</Label>
                        <select
                            id="buyProductsType"
                            name="buyProductsType"
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={buyProductsType}
                            onChange={(e) => setBuyProductsType(e.target.value as 'specific')}
                        >
                            <option value="specific">Specific products</option>
                        </select>
                    </div>
                </div>

                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="buySearchQuery"
                        name="buySearchQuery"
                        placeholder="Search products"
                        value={buySearchQuery}
                        onChange={(e) => setBuySearchQuery(e.target.value)}
                        className="pl-10"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                    >
                        Browse
                    </Button>
                </div>
            </FormSection>

            {/* Customer Gets */}
            <FormSection
                title="Customer gets"
                description="Customers must add the quantity of items specified below to their cart."
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="getQuantity" className="text-sm font-medium mb-2 block">Quantity</Label>
                        <Input
                            id="getQuantity"
                            name="getQuantity"
                            type="number"
                            value={getQuantity}
                            onChange={(e) => setGetQuantity(e.target.value)}
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <Label htmlFor="getProductsType" className="text-sm font-medium mb-2 block">Any items from</Label>
                        <select
                            id="getProductsType"
                            name="getProductsType"
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={getProductsType}
                            onChange={(e) => setGetProductsType(e.target.value as 'specific')}
                        >
                            <option value="specific">Specific products</option>
                        </select>
                    </div>
                </div>

                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="getSearchQuery"
                        name="getSearchQuery"
                        placeholder="Search products"
                        value={getSearchQuery}
                        onChange={(e) => setGetSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                    >
                        Browse
                    </Button>
                </div>
            </FormSection>

            {/* At a discounted value */}
            <FormSection title="At a discounted value">
                <RadioGroup
                    value={discountedValueType}
                    onValueChange={(v) => setDiscountedValueType(v as 'percentage' | 'fixed' | 'free')}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id="percentage-discount" />
                        <Label htmlFor="percentage-discount" className="font-normal">Percentage</Label>
                    </div>
                    {discountedValueType === 'percentage' && (
                        <div className="ml-6 mt-2">
                            <div className="relative w-32">
                                <Input
                                    id="discountedValuePercentage"
                                    name="discountedValuePercentage"
                                    type="number"
                                    value={discountedValue}
                                    onChange={(e) => setDiscountedValue(e.target.value)}
                                    className="pr-8"
                                    placeholder="0"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed-amount" />
                        <Label htmlFor="fixed-amount" className="font-normal">Amount off each</Label>
                    </div>
                    {discountedValueType === 'fixed' && (
                        <div className="ml-6 mt-2">
                            <div className="relative w-32">
                                <Input
                                    id="discountedValueFixed"
                                    name="discountedValueFixed"
                                    type="number"
                                    value={discountedValue}
                                    onChange={(e) => setDiscountedValue(e.target.value)}
                                    className="pr-8"
                                    placeholder="0"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="free" id="free-items" />
                        <Label htmlFor="free-items" className="font-normal">Free</Label>
                    </div>
                </RadioGroup>

                <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                        id="max-uses-order"
                        checked={maxUsesPerOrder}
                        onCheckedChange={(checked) => setMaxUsesPerOrder(checked as boolean)}
                    />
                    <Label htmlFor="max-uses-order" className="font-normal">
                        Set a maximum number of uses per order
                    </Label>
                </div>
            </FormSection>

            {/* Eligibility */}
            <EligibilitySection
                eligibility={eligibility}
                onEligibilityChange={setEligibility}
            />

            {/* Maximum Uses */}
            <MaxUsesSection
                limitTotal={limitTotal}
                onLimitTotalChange={setLimitTotal}
                totalLimit={totalLimit}
                onTotalLimitChange={setTotalLimit}
                limitPerCustomer={limitPerCustomer}
                onLimitPerCustomerChange={setLimitPerCustomer}
            />

            {/* Combinations */}
            <CombinationsSection
                productDiscounts={productDiscounts}
                onProductDiscountsChange={setProductDiscounts}
                orderDiscounts={orderDiscounts}
                onOrderDiscountsChange={setOrderDiscounts}
                shippingDiscounts={shippingDiscounts}
                onShippingDiscountsChange={setShippingDiscounts}
            />

            {/* Active Dates */}
            <ActiveDatesSection
                startDate={startDate}
                onStartDateChange={setStartDate}
                startTime={startTime}
                onStartTimeChange={setStartTime}
                hasEndDate={hasEndDate}
                onHasEndDateChange={setHasEndDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
                endTime={endTime}
                onEndTimeChange={setEndTime}
            />
        </DiscountFormLayout>
    )
}
