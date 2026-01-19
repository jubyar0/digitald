'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Receipt } from "lucide-react"
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

export default function AmountOffOrderPage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    // Method
    const [method, setMethod] = useState<DiscountMethod>('code')
    const [discountCode, setDiscountCode] = useState('')

    // Value
    const [valueType, setValueType] = useState<'percentage' | 'fixed'>('percentage')
    const [value, setValue] = useState('')

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
                    type="Amount off order"
                    typeIcon={<Receipt className="h-4 w-4" />}
                    details={summaryDetails}
                />
            }
        >
            {/* Method Section */}
            <MethodSection
                title="Amount off order"
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
