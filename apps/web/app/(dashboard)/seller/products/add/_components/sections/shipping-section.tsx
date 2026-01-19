'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    ChevronDown, ChevronUp, HelpCircle, Truck, Package,
    Globe, FileText, Scale, Box, Plane, AlertCircle,
    Laptop, Download, PackageOpen
} from 'lucide-react';
import { ProductFormData } from '../types';
import { cn } from '@/lib/utils';

interface ShippingSectionProps {
    formData: ProductFormData;
    showCustomsInfo: boolean;
    setShowCustomsInfo: (show: boolean) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: (field: string, value: string) => void;
    handleSwitchChange: (field: string) => (checked: boolean) => void;
}

const WEIGHT_UNITS = [
    { value: 'kg', label: 'kg', fullLabel: 'Kilograms' },
    { value: 'g', label: 'g', fullLabel: 'Grams' },
    { value: 'lb', label: 'lb', fullLabel: 'Pounds' },
    { value: 'oz', label: 'oz', fullLabel: 'Ounces' },
];

const COUNTRIES = [
    { value: 'DZ', label: 'Algeria' },
    { value: 'US', label: 'United States' },
    { value: 'FR', label: 'France' },
    { value: 'CN', label: 'China' },
    { value: 'DE', label: 'Germany' },
    { value: 'IT', label: 'Italy' },
    { value: 'TR', label: 'Turkey' },
];

export function ShippingSection({
    formData,
    showCustomsInfo,
    setShowCustomsInfo,
    handleChange,
    handleSelectChange,
    handleSwitchChange
}: ShippingSectionProps) {
    const [productType, setProductType] = useState<'physical' | 'digital'>('physical');

    const handleProductTypeChange = (type: 'physical' | 'digital') => {
        setProductType(type);
        handleSwitchChange('isPhysical')(type === 'physical');
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-semibold">Shipping</CardTitle>
                    </div>
                    <Badge variant="secondary" className="h-5 px-2 text-[10px]">
                        {productType === 'physical' ? (
                            <><Package className="h-3 w-3 mr-1" /> Physical</>
                        ) : (
                            <><Download className="h-3 w-3 mr-1" /> Digital</>
                        )}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
                {/* Product Type Selection */}
                <RadioGroup
                    value={productType}
                    onValueChange={(val) => handleProductTypeChange(val as 'physical' | 'digital')}
                    className="grid grid-cols-2 gap-3"
                >
                    <div className={cn(
                        "relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all",
                        productType === 'physical'
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:bg-muted/30"
                    )}>
                        <RadioGroupItem value="physical" id="physical" className="sr-only" />
                        <Label
                            htmlFor="physical"
                            className="flex items-center gap-3 cursor-pointer w-full"
                        >
                            <div className={cn(
                                "h-10 w-10 rounded-lg flex items-center justify-center",
                                productType === 'physical' ? "bg-primary/10" : "bg-muted"
                            )}>
                                <PackageOpen className={cn(
                                    "h-5 w-5",
                                    productType === 'physical' ? "text-primary" : "text-muted-foreground"
                                )} />
                            </div>
                            <div>
                                <span className="font-medium text-sm">Physical product</span>
                                <p className="text-xs text-muted-foreground">Shipped to customers</p>
                            </div>
                        </Label>
                    </div>

                    <div className={cn(
                        "relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all",
                        productType === 'digital'
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:bg-muted/30"
                    )}>
                        <RadioGroupItem value="digital" id="digital" className="sr-only" />
                        <Label
                            htmlFor="digital"
                            className="flex items-center gap-3 cursor-pointer w-full"
                        >
                            <div className={cn(
                                "h-10 w-10 rounded-lg flex items-center justify-center",
                                productType === 'digital' ? "bg-primary/10" : "bg-muted"
                            )}>
                                <Laptop className={cn(
                                    "h-5 w-5",
                                    productType === 'digital' ? "text-primary" : "text-muted-foreground"
                                )} />
                            </div>
                            <div>
                                <span className="font-medium text-sm">Digital product</span>
                                <p className="text-xs text-muted-foreground">Downloadable or service</p>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>

                {productType === 'physical' && (
                    <>
                        <Separator />

                        {/* Weight */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Scale className="h-3.5 w-3.5 text-muted-foreground" />
                                <Label className="text-sm font-medium">Weight</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p className="text-xs">Used to calculate shipping rates at checkout</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        name="weight"
                                        type="number"
                                        step="0.01"
                                        value={formData.weight || ''}
                                        onChange={handleChange}
                                        className="h-9 pr-12"
                                        placeholder="0.0"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                        {formData.weightUnit || 'kg'}
                                    </span>
                                </div>
                                <Select
                                    value={formData.weightUnit || 'kg'}
                                    onValueChange={(val) => handleSelectChange('weightUnit', val)}
                                >
                                    <SelectTrigger className="w-24 h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {WEIGHT_UNITS.map((unit) => (
                                            <SelectItem key={unit.value} value={unit.value}>
                                                {unit.fullLabel}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Dimensions (Optional) */}
                        <Collapsible>
                            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group text-sm">
                                <div className="flex items-center gap-2">
                                    <Box className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="font-medium">Dimensions</span>
                                    <Badge variant="outline" className="text-[10px] h-4">Optional</Badge>
                                </div>
                                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-3 space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Length (cm)</Label>
                                        <Input type="number" className="h-8" placeholder="0" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Width (cm)</Label>
                                        <Input type="number" className="h-8" placeholder="0" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Height (cm)</Label>
                                        <Input type="number" className="h-8" placeholder="0" />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <Separator />

                        {/* Customs Information */}
                        <Collapsible open={showCustomsInfo} onOpenChange={setShowCustomsInfo}>
                            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-sm font-medium">Customs information</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!showCustomsInfo && formData.countryOfOrigin && (
                                        <Badge variant="outline" className="text-[10px] h-5">{formData.countryOfOrigin}</Badge>
                                    )}
                                    {showCustomsInfo ? (
                                        <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    )}
                                </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="space-y-4 pt-4 animate-in slide-in-from-top-2 duration-200">
                                {/* Country of Origin */}
                                <div className="space-y-2">
                                    <Label className="text-sm">Country/Region of origin</Label>
                                    <Select
                                        value={formData.countryOfOrigin}
                                        onValueChange={(val) => handleSelectChange('countryOfOrigin', val)}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Select country..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COUNTRIES.map((country) => (
                                                <SelectItem key={country.value} value={country.value}>
                                                    {country.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* HS Code */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5">
                                        <Label className="text-sm">HS (Harmonized System) code</Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs">
                                                    <p className="text-xs">A standardized numerical code for classifying traded products</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input
                                            name="hsCode"
                                            value={formData.hsCode}
                                            onChange={handleChange}
                                            className="h-9 pl-9"
                                            placeholder="e.g., 6109.10"
                                        />
                                    </div>
                                </div>

                                {/* International Shipping Notice */}
                                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-amber-900">
                                    <Plane className="h-4 w-4 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium">International shipping</p>
                                        <p className="text-xs text-amber-700 mt-0.5">
                                            Customs information helps ensure smooth delivery across borders
                                        </p>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Requires Shipping Checkbox */}
                        <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                            <Checkbox
                                id="requiresShipping"
                                checked={formData.requiresShipping}
                                onCheckedChange={(checked) => handleSwitchChange('requiresShipping')(checked as boolean)}
                            />
                            <div>
                                <Label htmlFor="requiresShipping" className="font-normal text-sm cursor-pointer">
                                    This product requires shipping
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Uncheck for local pickup only or in-store products
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {productType === 'digital' && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-blue-900">
                        <Download className="h-5 w-5 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium">Digital product</p>
                            <p className="text-xs text-blue-700 mt-1">
                                Digital products are delivered electronically. No shipping information is required.
                                You can configure download links and access after saving the product.
                            </p>
                            <Button variant="link" className="h-auto p-0 text-xs text-blue-900 mt-2">
                                Learn about digital product delivery →
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
