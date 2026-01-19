'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Calendar, Clock, ChevronLeft, Percent, Tag } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

// ==================== Types ====================
export type DiscountMethod = 'code' | 'automatic'
export type EligibilityType = 'all' | 'segments' | 'customers'
export type MinPurchaseType = 'none' | 'amount' | 'quantity'

// ==================== Layout Components ====================
interface DiscountFormLayoutProps {
    title: string
    children: ReactNode
    summary: ReactNode
    onSave: () => void
    onDiscard: () => void
    isSaving?: boolean
}

export function DiscountFormLayout({
    title,
    children,
    summary,
    onSave,
    onDiscard,
    isSaving = false,
}: DiscountFormLayoutProps) {
    return (
        <div className="flex flex-1 flex-col">
            {/* Top Bar */}
            <div className="sticky top-0 z-10 bg-background border-b">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Percent className="h-4 w-4" />
                        <span>Unsaved discount</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onDiscard}>
                            Discard
                        </Button>
                        <Button size="sm" onClick={onSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-2 mb-6">
                    <Link href="/seller/marketing/discounts" className="text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-xl font-semibold">Create discount</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {children}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            {summary}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ==================== Section Components ====================
interface FormSectionProps {
    title: string
    description?: string
    children: ReactNode
    className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
    return (
        <Card className={cn("", className)}>
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
    )
}

// ==================== Method Section ====================
interface MethodSectionProps {
    title: string
    method: DiscountMethod
    onMethodChange: (method: DiscountMethod) => void
    discountCode: string
    onCodeChange: (code: string) => void
    onGenerateCode: () => void
}

export function MethodSection({
    title,
    method,
    onMethodChange,
    discountCode,
    onCodeChange,
    onGenerateCode,
}: MethodSectionProps) {
    return (
        <FormSection title={title}>
            <div className="space-y-4">
                <div>
                    <Label className="text-sm font-medium mb-2 block">Method</Label>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={method === 'code' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onMethodChange('code')}
                            className={method === 'code' ? 'bg-zinc-800 hover:bg-zinc-700' : ''}
                        >
                            Discount code
                        </Button>
                        <Button
                            type="button"
                            variant={method === 'automatic' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onMethodChange('automatic')}
                            className={method === 'automatic' ? 'bg-zinc-800 hover:bg-zinc-700' : ''}
                        >
                            Automatic discount
                        </Button>
                    </div>
                </div>

                {method === 'code' && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="discountCode" className="text-sm font-medium">
                                Discount code
                            </Label>
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="text-primary h-auto p-0"
                                onClick={onGenerateCode}
                            >
                                Generate random code
                            </Button>
                        </div>
                        <Input
                            id="discountCode"
                            name="discountCode"
                            value={discountCode}
                            onChange={(e) => onCodeChange(e.target.value)}
                            placeholder="e.g., SUMMER20"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Customers must enter this code at checkout.
                        </p>
                    </div>
                )}
            </div>
        </FormSection>
    )
}

// ==================== Discount Value Section ====================
interface DiscountValueSectionProps {
    valueType: 'percentage' | 'fixed'
    onValueTypeChange: (type: 'percentage' | 'fixed') => void
    value: string
    onValueChange: (value: string) => void
}

export function DiscountValueSection({
    valueType,
    onValueTypeChange,
    value,
    onValueChange,
}: DiscountValueSectionProps) {
    return (
        <div>
            <Label className="text-sm font-medium mb-2 block">Discount value</Label>
            <div className="flex gap-2">
                <select
                    id="discountValueType"
                    name="discountValueType"
                    className="flex h-10 w-[140px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={valueType}
                    onChange={(e) => onValueTypeChange(e.target.value as 'percentage' | 'fixed')}
                >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                </select>
                <div className="relative flex-1">
                    <Input
                        id="discountValue"
                        name="discountValue"
                        type="number"
                        value={value}
                        onChange={(e) => onValueChange(e.target.value)}
                        className="pr-8"
                        placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {valueType === 'percentage' ? '%' : '$'}
                    </span>
                </div>
            </div>
        </div>
    )
}

// ==================== Eligibility Section ====================
interface EligibilitySectionProps {
    eligibility: EligibilityType
    onEligibilityChange: (type: EligibilityType) => void
}

export function EligibilitySection({ eligibility, onEligibilityChange }: EligibilitySectionProps) {
    return (
        <FormSection title="Eligibility" description="Available on all sales channels">
            <RadioGroup value={eligibility} onValueChange={(v) => onEligibilityChange(v as EligibilityType)}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-customers" />
                    <Label htmlFor="all-customers" className="font-normal">All customers</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="segments" id="segments" />
                    <Label htmlFor="segments" className="font-normal">Specific customer segments</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customers" id="specific-customers" />
                    <Label htmlFor="specific-customers" className="font-normal">Specific customers</Label>
                </div>
            </RadioGroup>
        </FormSection>
    )
}

// ==================== Minimum Purchase Section ====================
interface MinPurchaseSectionProps {
    minPurchaseType: MinPurchaseType
    onMinPurchaseTypeChange: (type: MinPurchaseType) => void
    minAmount: string
    onMinAmountChange: (amount: string) => void
    minQuantity: string
    onMinQuantityChange: (quantity: string) => void
}

export function MinPurchaseSection({
    minPurchaseType,
    onMinPurchaseTypeChange,
    minAmount,
    onMinAmountChange,
    minQuantity,
    onMinQuantityChange,
}: MinPurchaseSectionProps) {
    return (
        <FormSection title="Minimum purchase requirements">
            <RadioGroup value={minPurchaseType} onValueChange={(v) => onMinPurchaseTypeChange(v as MinPurchaseType)}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="no-min" />
                    <Label htmlFor="no-min" className="font-normal">No minimum requirements</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amount" id="min-amount" />
                    <Label htmlFor="min-amount" className="font-normal">Minimum purchase amount ($)</Label>
                </div>
                {minPurchaseType === 'amount' && (
                    <div className="ml-6">
                        <Input
                            id="minAmount"
                            name="minAmount"
                            type="number"
                            value={minAmount}
                            onChange={(e) => onMinAmountChange(e.target.value)}
                            placeholder="0.00"
                            className="w-32"
                        />
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quantity" id="min-quantity" />
                    <Label htmlFor="min-quantity" className="font-normal">Minimum quantity of items</Label>
                </div>
                {minPurchaseType === 'quantity' && (
                    <div className="ml-6">
                        <Input
                            id="minQuantity"
                            name="minQuantity"
                            type="number"
                            value={minQuantity}
                            onChange={(e) => onMinQuantityChange(e.target.value)}
                            placeholder="0"
                            className="w-32"
                        />
                    </div>
                )}
            </RadioGroup>
        </FormSection>
    )
}

// ==================== Maximum Uses Section ====================
interface MaxUsesSectionProps {
    limitTotal: boolean
    onLimitTotalChange: (checked: boolean) => void
    totalLimit: string
    onTotalLimitChange: (limit: string) => void
    limitPerCustomer: boolean
    onLimitPerCustomerChange: (checked: boolean) => void
}

export function MaxUsesSection({
    limitTotal,
    onLimitTotalChange,
    totalLimit,
    onTotalLimitChange,
    limitPerCustomer,
    onLimitPerCustomerChange,
}: MaxUsesSectionProps) {
    return (
        <FormSection title="Maximum discount uses">
            <div className="space-y-3">
                <div className="flex items-start space-x-2">
                    <Checkbox
                        id="limit-total"
                        checked={limitTotal}
                        onCheckedChange={(checked) => onLimitTotalChange(checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="limit-total" className="font-normal">
                            Limit number of times this discount can be used in total
                        </Label>
                        {limitTotal && (
                            <Input
                                id="totalLimit"
                                name="totalLimit"
                                type="number"
                                value={totalLimit}
                                onChange={(e) => onTotalLimitChange(e.target.value)}
                                placeholder="0"
                                className="w-32 mt-2"
                            />
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="limit-per-customer"
                        checked={limitPerCustomer}
                        onCheckedChange={(checked) => onLimitPerCustomerChange(checked as boolean)}
                    />
                    <Label htmlFor="limit-per-customer" className="font-normal">
                        Limit to one use per customer
                    </Label>
                </div>
            </div>
        </FormSection>
    )
}

// ==================== Combinations Section ====================
interface CombinationsSectionProps {
    productDiscounts: boolean
    onProductDiscountsChange: (checked: boolean) => void
    orderDiscounts: boolean
    onOrderDiscountsChange: (checked: boolean) => void
    shippingDiscounts: boolean
    onShippingDiscountsChange: (checked: boolean) => void
    showShipping?: boolean
}

export function CombinationsSection({
    productDiscounts,
    onProductDiscountsChange,
    orderDiscounts,
    onOrderDiscountsChange,
    shippingDiscounts,
    onShippingDiscountsChange,
    showShipping = true,
}: CombinationsSectionProps) {
    return (
        <FormSection title="Combinations">
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="product-discounts"
                        checked={productDiscounts}
                        onCheckedChange={(checked) => onProductDiscountsChange(checked as boolean)}
                    />
                    <Label htmlFor="product-discounts" className="font-normal">Product discounts</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="order-discounts"
                        checked={orderDiscounts}
                        onCheckedChange={(checked) => onOrderDiscountsChange(checked as boolean)}
                    />
                    <Label htmlFor="order-discounts" className="font-normal">Order discounts</Label>
                </div>
                {showShipping && (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="shipping-discounts"
                            checked={shippingDiscounts}
                            onCheckedChange={(checked) => onShippingDiscountsChange(checked as boolean)}
                        />
                        <Label htmlFor="shipping-discounts" className="font-normal">Shipping discounts</Label>
                    </div>
                )}
            </div>
        </FormSection>
    )
}

// ==================== Active Dates Section ====================
interface ActiveDatesSectionProps {
    startDate: string
    onStartDateChange: (date: string) => void
    startTime: string
    onStartTimeChange: (time: string) => void
    hasEndDate: boolean
    onHasEndDateChange: (checked: boolean) => void
    endDate: string
    onEndDateChange: (date: string) => void
    endTime: string
    onEndTimeChange: (time: string) => void
}

export function ActiveDatesSection({
    startDate,
    onStartDateChange,
    startTime,
    onStartTimeChange,
    hasEndDate,
    onHasEndDateChange,
    endDate,
    onEndDateChange,
    endTime,
    onEndTimeChange,
}: ActiveDatesSectionProps) {
    return (
        <FormSection title="Active dates">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Start date</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => onStartDateChange(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Start time (CET)</Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="startTime"
                                name="startTime"
                                type="time"
                                value={startTime}
                                onChange={(e) => onStartTimeChange(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="has-end-date"
                        checked={hasEndDate}
                        onCheckedChange={(checked) => onHasEndDateChange(checked as boolean)}
                    />
                    <Label htmlFor="has-end-date" className="font-normal">Set end date</Label>
                </div>

                {hasEndDate && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium mb-2 block">End date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="endDate"
                                    name="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => onEndDateChange(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium mb-2 block">End time (CET)</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="endTime"
                                    name="endTime"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => onEndTimeChange(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FormSection>
    )
}

// ==================== Summary Card ====================
interface SummaryCardProps {
    title: string
    type: string
    typeIcon?: ReactNode
    details: string[]
    showSalesChannel?: boolean
}

export function SummaryCard({ title, type, typeIcon, details, showSalesChannel = true }: SummaryCardProps) {
    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                {title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">Code</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Type</p>
                            <p className="text-sm font-medium">{type}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                                {typeIcon}
                                <span>Product discount</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Details</p>
                            <ul className="text-sm text-muted-foreground space-y-0.5">
                                {details.map((detail, i) => (
                                    <li key={i}>• {detail}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {showSalesChannel && (
                <Card>
                    <CardContent className="pt-6">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                                Sales channel access
                            </p>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="featured-channels" />
                                <Label htmlFor="featured-channels" className="font-normal text-sm">
                                    Allow discount to be featured on selected channels
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
