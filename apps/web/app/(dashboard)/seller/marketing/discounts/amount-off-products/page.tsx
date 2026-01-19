'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tag, Search } from "lucide-react"
import {
    DiscountFormLayout,
    FormSection,
    MethodSection,
    DiscountValueSection,
    EligibilitySection,
    MinPurchaseSection,
    MaxUsesSection,
    CombinationsSection,
    ActiveDatesSection,
    SummaryCard,
    DiscountMethod,
    EligibilityType,
    MinPurchaseType,
} from "../components/discount-form-components"

export default function AmountOffProductsPage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    // Method
    const [method, setMethod] = useState<DiscountMethod>('code')
    const [discountCode, setDiscountCode] = useState('')

    // Value
    const [valueType, setValueType] = useState<'percentage' | 'fixed'>('percentage')
    const [value, setValue] = useState('')

    // Applies to
    const [appliesTo, setAppliesTo] = useState<'collections' | 'products'>('collections')
    const [searchQuery, setSearchQuery] = useState('')

    // Eligibility
    const [eligibility, setEligibility] = useState<EligibilityType>('all')

    // Min Purchase
    const [minPurchaseType, setMinPurchaseType] = useState<MinPurchaseType>('none')
    const [minAmount, setMinAmount] = useState('')
    const [minQuantity, setMinQuantity] = useState('')

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
        'No minimum purchase requirement',
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
                    type="Amount off products"
                    typeIcon={<Tag className="h-4 w-4" />}
                    details={summaryDetails}
                />
            }
        >
            {/* Method Section */}
            <MethodSection
                title="Amount off products"
                method={method}
                onMethodChange={setMethod}
                discountCode={discountCode}
                onCodeChange={setDiscountCode}
                onGenerateCode={generateCode}
            />

            {/* Discount Value */}
            <FormSection title="Discount value">
                <DiscountValueSection
                    valueType={valueType}
                    onValueTypeChange={setValueType}
                    value={value}
                    onValueChange={setValue}
                />

                <div className="mt-4">
                    <Label htmlFor="appliesTo" className="text-sm font-medium mb-2 block">Applies to</Label>
                    <select
                        id="appliesTo"
                        name="appliesTo"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={appliesTo}
                        onChange={(e) => setAppliesTo(e.target.value as 'collections' | 'products')}
                    >
                        <option value="collections">Specific collections</option>
                        <option value="products">Specific products</option>
                    </select>
                </div>

                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="productSearch"
                        name="productSearch"
                        placeholder={appliesTo === 'collections' ? 'Search collections' : 'Search products'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Eligibility */}
            <EligibilitySection
                eligibility={eligibility}
                onEligibilityChange={setEligibility}
            />

            {/* Minimum Purchase */}
            <MinPurchaseSection
                minPurchaseType={minPurchaseType}
                onMinPurchaseTypeChange={setMinPurchaseType}
                minAmount={minAmount}
                onMinAmountChange={setMinAmount}
                minQuantity={minQuantity}
                onMinQuantityChange={setMinQuantity}
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
