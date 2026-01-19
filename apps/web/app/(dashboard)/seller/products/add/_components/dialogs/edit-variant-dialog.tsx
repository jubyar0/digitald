'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Image as ImageIcon, DollarSign, Package, Barcode,
    TrendingUp, Percent, AlertCircle, CheckCircle2, HelpCircle
} from 'lucide-react';
import { ProductVariant } from '../types';
import { cn } from '@/lib/utils';

interface EditVariantDialogProps {
    editingVariant: ProductVariant | null;
    setEditingVariant: React.Dispatch<React.SetStateAction<ProductVariant | null>>;
    handleSaveVariant: () => void;
}

export function EditVariantDialog({
    editingVariant,
    setEditingVariant,
    handleSaveVariant
}: EditVariantDialogProps) {
    // Calculate profit and margin
    const profit = useMemo(() => {
        if (!editingVariant?.price || !editingVariant?.costPerItem) return 0;
        return editingVariant.price - editingVariant.costPerItem;
    }, [editingVariant?.price, editingVariant?.costPerItem]);

    const margin = useMemo(() => {
        if (!editingVariant?.price || editingVariant.price === 0) return 0;
        return ((editingVariant.price - (editingVariant.costPerItem || 0)) / editingVariant.price) * 100;
    }, [editingVariant?.price, editingVariant?.costPerItem]);

    const isProfitable = profit > 0;

    if (!editingVariant) return null;

    return (
        <Dialog open={!!editingVariant} onOpenChange={(open) => !open && setEditingVariant(null)}>
            <DialogContent className="sm:max-w-[550px] p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b bg-muted/20">
                    <DialogTitle className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg border bg-muted/50 flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <span className="font-semibold">{editingVariant.title}</span>
                            <p className="text-xs text-muted-foreground font-normal mt-0.5">
                                Edit variant details
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 py-4 space-y-5 max-h-[60vh] overflow-y-auto">
                    {/* Create Variant Toggle */}
                    <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                        <Checkbox id="createVariant" defaultChecked />
                        <div>
                            <Label htmlFor="createVariant" className="font-medium text-sm cursor-pointer">
                                Create this variant
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Uncheck to skip creating this combination
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Pricing Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium text-sm">Pricing</h4>
                        </div>

                        {/* Price Input */}
                        <div className="space-y-2">
                            <Label className="text-sm">Price</Label>
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 bg-muted/50 border-r rounded-l-md">
                                    <span className="text-xs font-medium text-muted-foreground">DZD</span>
                                </div>
                                <Input
                                    className="pl-14 text-lg font-semibold h-11"
                                    value={editingVariant.price?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                                    onChange={(e) => setEditingVariant(prev => prev ? ({
                                        ...prev,
                                        price: parseFloat(e.target.value.replace(/,/g, '')) || 0
                                    }) : null)}
                                />
                            </div>
                        </div>

                        {/* Profit Summary */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Cost per item</Label>
                                <div className="relative">
                                    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-10 bg-muted/50 border-r rounded-l-md">
                                        <span className="text-[10px] text-muted-foreground">DZD</span>
                                    </div>
                                    <Input
                                        className="pl-12 h-9 text-sm"
                                        value={editingVariant.costPerItem?.toString() || ''}
                                        onChange={(e) => setEditingVariant(prev => prev ? ({
                                            ...prev,
                                            costPerItem: parseFloat(e.target.value) || 0
                                        }) : null)}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Profit</Label>
                                <div className={cn(
                                    "h-9 px-3 rounded-md border flex items-center text-sm font-medium gap-1",
                                    isProfitable ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-muted"
                                )}>
                                    <TrendingUp className="h-3 w-3" />
                                    {editingVariant.price && editingVariant.costPerItem
                                        ? `${isProfitable ? '+' : ''}${profit.toFixed(2)}`
                                        : '--'}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Margin</Label>
                                <div className={cn(
                                    "h-9 px-3 rounded-md border flex items-center text-sm font-medium gap-1",
                                    isProfitable ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-muted"
                                )}>
                                    <Percent className="h-3 w-3" />
                                    {editingVariant.price && editingVariant.costPerItem && editingVariant.price > 0
                                        ? `${isProfitable ? '+' : ''}${margin.toFixed(1)}%`
                                        : '--'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Inventory Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium text-sm">Inventory</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5">
                                    <Label className="text-sm">SKU</Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs">
                                                <p className="text-xs">Stock Keeping Unit - A unique identifier</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="relative">
                                    <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        value={editingVariant.sku || ''}
                                        onChange={(e) => setEditingVariant(prev => prev ? ({
                                            ...prev,
                                            sku: e.target.value
                                        }) : null)}
                                        className="h-9 pl-9"
                                        placeholder="e.g., VAR-001"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Barcode</Label>
                                <div className="relative">
                                    <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        value={editingVariant.barcode || ''}
                                        onChange={(e) => setEditingVariant(prev => prev ? ({
                                            ...prev,
                                            barcode: e.target.value
                                        }) : null)}
                                        className="h-9 pl-9"
                                        placeholder="e.g., 1234567890123"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <Label className="text-sm">Quantity</Label>
                            <Input
                                type="number"
                                value={editingVariant.quantity || 0}
                                onChange={(e) => setEditingVariant(prev => prev ? ({
                                    ...prev,
                                    quantity: parseInt(e.target.value) || 0
                                }) : null)}
                                className="h-9 w-32"
                            />
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-blue-900">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <p className="text-xs">
                            Save the product to edit more variant details like images, weight, and dimensions.
                        </p>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-muted/20">
                    <Button variant="outline" onClick={() => setEditingVariant(null)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveVariant}>
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
