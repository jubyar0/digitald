'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Truck } from "lucide-react"
import {
    DiscountFormLayout,
    FormSection,
    MethodSection,
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

export default function FreeShippingPage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    // Method
    const [method, setMethod] = useState<DiscountMethod>('code')
    const [discountCode, setDiscountCode] = useState('')

    // Countries
    const [countries, setCountries] = useState<'all' | 'selected'>('all')

    // Shipping rates
    const [excludeRates, setExcludeRates] = useState(false)
    const [excludeAmount, setExcludeAmount] = useState('')

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
        'For all countries',
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
                    type="Free shipping"
                    typeIcon={<Truck className="h-4 w-4" />}
                    details={summaryDetails}
                />
            }
        >
            {/* Method Section */}
            <MethodSection
                title="Free shipping"
                method={method}
                onMethodChange={setMethod}
                discountCode={discountCode}
                onCodeChange={setDiscountCode}
                onGenerateCode={generateCode}
            />

            {/* Countries */}
            <FormSection title="Countries">
                <RadioGroup
                    value={countries}
                    onValueChange={(v) => setCountries(v as 'all' | 'selected')}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all-countries" />
                        <Label htmlFor="all-countries" className="font-normal">All countries</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="selected" id="selected-countries" />
                        <Label htmlFor="selected-countries" className="font-normal">Selected countries</Label>
                    </div>
                </RadioGroup>
            </FormSection>

            {/* Shipping rates */}
            <FormSection title="Shipping rates">
                <div className="flex items-start space-x-2">
                    <Checkbox
                        id="exclude-rates"
                        checked={excludeRates}
                        onCheckedChange={(checked) => setExcludeRates(checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="exclude-rates" className="font-normal">
                            Exclude shipping rates over a certain amount
                        </Label>
                        {excludeRates && (
                            <div className="relative w-32 mt-2">
                                <Input
                                    id="excludeAmount"
                                    name="excludeAmount"
                                    type="number"
                                    value={excludeAmount}
                                    onChange={(e) => setExcludeAmount(e.target.value)}
                                    className="pr-8"
                                    placeholder="0.00"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            </div>
                        )}
                    </div>
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
                shippingDiscounts={false}
                onShippingDiscountsChange={() => { }}
                showShipping={false}
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
