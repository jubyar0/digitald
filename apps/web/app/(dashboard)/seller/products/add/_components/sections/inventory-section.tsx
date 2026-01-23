'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    ChevronDown, ChevronUp, HelpCircle, Package, MapPin,
    Barcode, QrCode, AlertTriangle, CheckCircle2, Plus, Minus,
    Warehouse, TrendingDown, RefreshCw
} from 'lucide-react';
import { ProductFormData } from '../types';
import { cn } from '@/lib/utils';

interface InventorySectionProps {
    formData: ProductFormData;
    showInventoryDetails: boolean;
    setShowInventoryDetails: (show: boolean) => void;
    setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSwitchChange: (field: string) => (checked: boolean) => void;
}

interface Location {
    id: string;
    name: string;
    address: string;
    available: number;
    committed: number;
    incoming: number;
}

const DEFAULT_LOCATIONS: Location[] = [
    { id: 'main', name: 'Main Location', address: 'Algiers, Algeria', available: 0, committed: 0, incoming: 0 },
];

export function InventorySection({
    formData,
    showInventoryDetails,
    setShowInventoryDetails,
    setFormData,
    handleChange,
    handleSwitchChange
}: InventorySectionProps) {
    const isLowStock = formData.quantity > 0 && formData.quantity <= 10;
    const isOutOfStock = formData.quantity === 0;

    return (
        <Card className="overflow-hidden">
            <CardHeader className="px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-semibold">Inventory</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        {isOutOfStock && (
                            <Badge variant="destructive" className="h-5 text-[10px]">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Out of stock
                            </Badge>
                        )}
                        {isLowStock && !isOutOfStock && (
                            <Badge variant="secondary" className="h-5 text-[10px] bg-amber-50 text-amber-700">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                Low stock
                            </Badge>
                        )}
                        {!isLowStock && !isOutOfStock && formData.quantity > 0 && (
                            <Badge variant="secondary" className="h-5 text-[10px] bg-emerald-50 text-emerald-700">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                In stock
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
                {/* Tracking Toggle */}
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <Label htmlFor="trackQuantity" className="font-medium text-sm">Track quantity</Label>
                            <p className="text-xs text-muted-foreground">Automatically update stock levels when orders are placed</p>
                        </div>
                    </div>
                    <Switch
                        id="trackQuantity"
                        checked={formData.trackQuantity}
                        onCheckedChange={handleSwitchChange('trackQuantity')}
                    />
                </div>

                {formData.trackQuantity && (
                    <>
                        {/* Quantity by Location */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                    Quantity by location
                                </span>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add location
                                </Button>
                            </div>

                            {/* Location Cards */}
                            <div className="space-y-2">
                                {DEFAULT_LOCATIONS.map((location) => (
                                    <div
                                        key={location.id}
                                        className="p-3 border rounded-lg hover:border-primary/30 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                                                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <span className="font-medium text-sm">{location.name}</span>
                                                    <p className="text-xs text-muted-foreground">{location.address}</p>
                                                </div>
                                            </div>

                                            {/* Quantity Control */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        quantity: Math.max(0, prev.quantity - 1)
                                                    }))}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                    name="quantity"
                                                    aria-label="Quantity"
                                                    className={cn(
                                                        "w-20 text-center h-8 text-sm font-medium",
                                                        isOutOfStock && "border-destructive",
                                                        isLowStock && !isOutOfStock && "border-amber-500"
                                                    )}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        quantity: prev.quantity + 1
                                                    }))}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Stock Breakdown */}
                                        <div className="flex gap-4 mt-3 pt-3 border-t">
                                            <div className="flex-1">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Available</p>
                                                <p className="text-sm font-medium">{formData.quantity}</p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Committed</p>
                                                <p className="text-sm font-medium">0</p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Incoming</p>
                                                <p className="text-sm font-medium">0</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Out of Stock Behavior */}
                        <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                            <Checkbox
                                id="continueOutOfStock"
                                checked={formData.continueSellingOutOfStock}
                                onCheckedChange={(checked) => setFormData(prev => ({
                                    ...prev,
                                    continueSellingOutOfStock: checked as boolean
                                }))}
                            />
                            <div>
                                <Label htmlFor="continueOutOfStock" className="font-normal text-sm cursor-pointer">
                                    Continue selling when out of stock
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Allow customers to purchase even when inventory is 0
                                </p>
                            </div>
                        </div>
                    </>
                )}

                <Separator />

                {/* SKU & Barcode */}
                <Collapsible open={showInventoryDetails} onOpenChange={setShowInventoryDetails}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
                        <div className="flex items-center gap-2">
                            <Barcode className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium">SKU & Barcode</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {!showInventoryDetails && formData.sku && (
                                <Badge variant="outline" className="text-[10px] h-5">{formData.sku}</Badge>
                            )}
                            {showInventoryDetails ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            )}
                        </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="space-y-4 pt-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5">
                                    <Label htmlFor="sku" className="text-sm">SKU</Label>
                                    <span title="Stock Keeping Unit - A unique identifier for your product" className="flex items-center">
                                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                    </span>
                                </div>
                                <div className="relative">
                                    <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        id="sku"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        className="h-9 pl-9"
                                        placeholder="e.g., SKU-001"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5">
                                    <Label htmlFor="barcode" className="text-sm">Barcode</Label>
                                    <span title="ISBN, UPC, GTIN, or other barcode format" className="flex items-center">
                                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                    </span>
                                </div>
                                <div className="relative">
                                    <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        id="barcode"
                                        name="barcode"
                                        value={formData.barcode}
                                        onChange={handleChange}
                                        className="h-9 pl-9"
                                        placeholder="e.g., 1234567890123"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-blue-900">
                            <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                            <p className="text-xs">
                                SKUs help you track inventory across locations and connect to external systems.
                                Barcodes enable scanning for faster checkout.
                            </p>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}
