'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    ChevronDown, ChevronUp, HelpCircle, DollarSign, Percent,
    TrendingUp, Calculator, Scale, Package, AlertCircle, Sparkles
} from 'lucide-react';
import { UnitPriceData, ProductFormData } from '../types';
import { cn } from '@/lib/utils';

interface PriceSectionProps {
    formData: ProductFormData;
    showAdditionalPrices: boolean;
    setShowAdditionalPrices: (show: boolean) => void;
    unitPriceOpen: boolean;
    setUnitPriceOpen: (open: boolean) => void;
    unitPriceData: UnitPriceData;
    setUnitPriceData: React.Dispatch<React.SetStateAction<UnitPriceData>>;
    setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PriceSection({
    formData,
    showAdditionalPrices,
    setShowAdditionalPrices,
    unitPriceOpen,
    setUnitPriceOpen,
    unitPriceData,
    setUnitPriceData,
    setFormData,
    handleChange
}: PriceSectionProps) {
    // Calculate profit and margin
    const profit = useMemo(() => {
        if (!formData.price || !formData.costPerItem) return 0;
        return formData.price - formData.costPerItem;
    }, [formData.price, formData.costPerItem]);

    const margin = useMemo(() => {
        if (!formData.price || formData.price === 0) return 0;
        return ((formData.price - (formData.costPerItem || 0)) / formData.price) * 100;
    }, [formData.price, formData.costPerItem]);

    const isProfitable = profit > 0;

    return (
        <Card className="overflow-hidden">
            <CardHeader className="px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-semibold">Pricing</CardTitle>
                    </div>
                    {formData.price > 0 && (
                        <Badge variant="secondary" className={cn(
                            "h-5 px-2 text-xs font-medium",
                            isProfitable ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        )}>
                            {isProfitable ? <TrendingUp className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                            {margin.toFixed(0)}% margin
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
                {/* Main Price */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="price" className="text-sm font-medium">Price</Label>
                        <span title="The price customers pay at checkout" className="flex items-center">
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        </span>
                    </div>
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 bg-muted/50 border-r rounded-l-md">
                            <span className="text-xs font-medium text-muted-foreground">DZD</span>
                        </div>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price || ''}
                            onChange={handleChange}
                            className="pl-14 text-lg font-semibold h-11"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Profit Summary Cards */}
                {formData.price > 0 && formData.costPerItem > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className={cn(
                            "p-3 rounded-lg border-2",
                            isProfitable ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50/50 border-amber-200"
                        )}>
                            <div className="flex items-center gap-1.5 mb-1">
                                <TrendingUp className={cn("h-3.5 w-3.5", isProfitable ? "text-emerald-600" : "text-amber-600")} />
                                <span className="text-xs text-muted-foreground">Profit</span>
                            </div>
                            <p className={cn("text-lg font-bold", isProfitable ? "text-emerald-700" : "text-amber-700")}>
                                {isProfitable ? '+' : ''}{profit.toLocaleString('en-US', { minimumFractionDigits: 2 })} DZD
                            </p>
                        </div>
                        <div className={cn(
                            "p-3 rounded-lg border-2",
                            isProfitable ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50/50 border-amber-200"
                        )}>
                            <div className="flex items-center gap-1.5 mb-1">
                                <Percent className={cn("h-3.5 w-3.5", isProfitable ? "text-emerald-600" : "text-amber-600")} />
                                <span className="text-xs text-muted-foreground">Margin</span>
                            </div>
                            <p className={cn("text-lg font-bold", isProfitable ? "text-emerald-700" : "text-amber-700")}>
                                {isProfitable ? '+' : ''}{margin.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                )}

                <Separator />

                {/* Collapsible Additional Prices */}
                <Collapsible open={showAdditionalPrices} onOpenChange={setShowAdditionalPrices}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
                        <span className="text-sm font-medium">Additional pricing options</span>
                        <div className="flex items-center gap-2">
                            {!showAdditionalPrices && (
                                <div className="flex gap-1">
                                    {formData.compareAtPrice > 0 && (
                                        <Badge variant="outline" className="text-[10px] h-5">Sale</Badge>
                                    )}
                                    {formData.chargeTax && (
                                        <Badge variant="outline" className="text-[10px] h-5">Tax</Badge>
                                    )}
                                </div>
                            )}
                            {showAdditionalPrices ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            )}
                        </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="space-y-4 pt-4 animate-in slide-in-from-top-2 duration-200">
                        {/* Compare-at Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5">
                                    <Label htmlFor="compareAtPrice" className="text-sm">Compare-at price</Label>
                                    <span title="Shows a strikethrough price to indicate a sale" className="flex items-center">
                                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                    </span>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-10 bg-muted/50 border-r rounded-l-md">
                                        <span className="text-xs text-muted-foreground">DZD</span>
                                    </div>
                                    <Input
                                        id="compareAtPrice"
                                        name="compareAtPrice"
                                        type="number"
                                        value={formData.compareAtPrice || ''}
                                        onChange={handleChange}
                                        className="pl-12"
                                        placeholder="0.00"
                                    />
                                </div>
                                {formData.compareAtPrice > 0 && formData.compareAtPrice > formData.price && (
                                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        {((1 - formData.price / formData.compareAtPrice) * 100).toFixed(0)}% off
                                    </p>
                                )}
                            </div>

                            {/* Unit Price */}
                            <div className="space-y-2">
                                <Label className="text-sm">Unit price</Label>
                                <Popover open={unitPriceOpen} onOpenChange={setUnitPriceOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between font-normal h-9">
                                            <div className="flex items-center gap-1.5">
                                                <Scale className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    {formData.price > 0 && unitPriceData.totalAmount > 0
                                                        ? `${(formData.price / (unitPriceData.totalAmount / 1000)).toFixed(2)}/${unitPriceData.baseUnit}`
                                                        : "Not set"}
                                                </span>
                                            </div>
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-4" align="start">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 pb-2 border-b">
                                                <Calculator className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium text-sm">Unit price calculator</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Total amount</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="number"
                                                            value={unitPriceData.totalAmount || ''}
                                                            onChange={(e) => setUnitPriceData(prev => ({ ...prev, totalAmount: parseFloat(e.target.value) || 0 }))}
                                                            className="h-8"
                                                        />
                                                        <Select
                                                            name="unitPriceUnit"
                                                            value={unitPriceData.totalUnit}
                                                            onValueChange={(val) => setUnitPriceData(prev => ({ ...prev, totalUnit: val }))}
                                                        >
                                                            <SelectTrigger className="w-16 h-8">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="g">g</SelectItem>
                                                                <SelectItem value="kg">kg</SelectItem>
                                                                <SelectItem value="ml">ml</SelectItem>
                                                                <SelectItem value="l">l</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2 pt-2 border-t">
                                                    <Button variant="ghost" size="sm" className="h-7" onClick={() => setUnitPriceOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button size="sm" className="h-7" onClick={() => setUnitPriceOpen(false)}>
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Tax Checkbox */}
                        <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                            <Checkbox
                                id="tax"
                                checked={formData.chargeTax}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, chargeTax: checked as boolean }))}
                            />
                            <div>
                                <Label htmlFor="tax" className="font-normal text-sm cursor-pointer">
                                    Charge tax on this product
                                </Label>
                                <p className="text-xs text-muted-foreground">Applicable taxes will be calculated at checkout</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Cost per Item */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                <Label className="text-sm font-medium">Cost & Profit</Label>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Cost per item</Label>
                                    <div className="relative">
                                        <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-10 bg-muted/50 border-r rounded-l-md">
                                            <span className="text-[10px] text-muted-foreground">DZD</span>
                                        </div>
                                        <Input
                                            id="costPerItem"
                                            name="costPerItem"
                                            type="number"
                                            value={formData.costPerItem || ''}
                                            onChange={handleChange}
                                            className="pl-12 h-9 text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Profit</Label>
                                    <div className={cn(
                                        "h-9 px-3 rounded-md border flex items-center text-sm font-medium",
                                        isProfitable ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-muted"
                                    )}>
                                        {formData.price && formData.costPerItem
                                            ? `${isProfitable ? '+' : ''}${profit.toFixed(2)}`
                                            : '--'}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">Margin</Label>
                                    <div className={cn(
                                        "h-9 px-3 rounded-md border flex items-center text-sm font-medium",
                                        isProfitable ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-muted"
                                    )}>
                                        {formData.price && formData.costPerItem && formData.price > 0
                                            ? `${isProfitable ? '+' : ''}${margin.toFixed(1)}%`
                                            : '--'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}
