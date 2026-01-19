'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Plus, X, Search, ChevronDown, MoreHorizontal, Check,
    Image as ImageIcon, GripVertical, Layers, Palette, Ruler,
    Package, Trash2, Copy, Edit, AlertCircle, Sparkles
} from 'lucide-react';
import { ProductOption, ProductVariant } from '../types';
import { cn } from '@/lib/utils';

interface VariantsSectionProps {
    options: ProductOption[];
    variants: ProductVariant[];
    isAddingOption: boolean;
    newOptionName: string;
    newOptionValues: string[];
    newOptionValueInput: string;
    setIsAddingOption: (adding: boolean) => void;
    setNewOptionName: (name: string) => void;
    setNewOptionValues: React.Dispatch<React.SetStateAction<string[]>>;
    setNewOptionValueInput: (input: string) => void;
    setVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
    handleAddOption: () => void;
    handleSaveOption: () => void;
    handleDeleteOption: (id: string) => void;
    handleOptionValueAdd: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleOptionValueRemove: (value: string) => void;
    handleVariantClick: (variant: ProductVariant) => void;
}

const OPTION_SUGGESTIONS = [
    { name: 'Size', icon: Ruler, values: ['S', 'M', 'L', 'XL'] },
    { name: 'Color', icon: Palette, values: ['Black', 'White', 'Blue', 'Red'] },
    { name: 'Material', icon: Layers, values: ['Cotton', 'Polyester', 'Silk'] },
    { name: 'Style', icon: Package, values: ['Regular', 'Slim', 'Relaxed'] },
];

const VALUE_COLORS: Record<string, string> = {
    'Black': 'bg-gray-900',
    'White': 'bg-white border-2',
    'Blue': 'bg-blue-500',
    'Red': 'bg-red-500',
    'Green': 'bg-green-500',
    'Yellow': 'bg-yellow-400',
    'Pink': 'bg-pink-400',
    'Purple': 'bg-purple-500',
    'Navy': 'bg-blue-900',
    'Brown': 'bg-amber-700',
};

export function VariantsSection({
    options,
    variants,
    isAddingOption,
    newOptionName,
    newOptionValues,
    newOptionValueInput,
    setIsAddingOption,
    setNewOptionName,
    setNewOptionValues,
    setNewOptionValueInput,
    setVariants,
    handleAddOption,
    handleSaveOption,
    handleDeleteOption,
    handleOptionValueAdd,
    handleOptionValueRemove,
    handleVariantClick
}: VariantsSectionProps) {
    const [selectedVariants, setSelectedVariants] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [bulkEditOpen, setBulkEditOpen] = useState(false);

    const filteredVariants = variants.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleVariantSelection = (id: string) => {
        setSelectedVariants(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const toggleAllVariants = () => {
        if (selectedVariants.size === variants.length) {
            setSelectedVariants(new Set());
        } else {
            setSelectedVariants(new Set(variants.map(v => v.id)));
        }
    };

    const handleQuickOptionSelect = (suggestion: typeof OPTION_SUGGESTIONS[0]) => {
        setNewOptionName(suggestion.name);
        setNewOptionValues(suggestion.values);
        setIsAddingOption(true);
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-semibold">Variants</CardTitle>
                        {variants.length > 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {variants.length}
                            </Badge>
                        )}
                    </div>
                    {options.length > 0 && !isAddingOption && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={handleAddOption}
                        >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add option
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4">
                {/* Empty State with Quick Options */}
                {options.length === 0 && !isAddingOption && (
                    <div className="text-center py-6">
                        <div className="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                            <Layers className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h4 className="font-medium text-sm mb-1">Add product variants</h4>
                        <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
                            Create variants for different sizes, colors, or other options
                        </p>

                        {/* Quick Option Buttons */}
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {OPTION_SUGGESTIONS.map((suggestion) => (
                                <Button
                                    key={suggestion.name}
                                    variant="outline"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => handleQuickOptionSelect(suggestion)}
                                >
                                    <suggestion.icon className="h-3.5 w-3.5 mr-1.5" />
                                    {suggestion.name}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="secondary"
                            className="w-full max-w-xs"
                            onClick={handleAddOption}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add custom option
                        </Button>
                    </div>
                )}

                {/* Options List */}
                {options.length > 0 && (
                    <div className="space-y-3 mb-4">
                        {options.map((option, index) => (
                            <div
                                key={option.id}
                                className="group flex items-start gap-3 p-3 bg-muted/20 rounded-lg border hover:border-primary/30 transition-colors"
                            >
                                <div className="mt-1 cursor-move text-muted-foreground hover:text-foreground transition-colors">
                                    <GripVertical className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-medium text-sm">{option.name}</span>
                                        <Badge variant="outline" className="text-[10px] h-4">
                                            {option.values.length} values
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {option.values.map((value) => (
                                            <Badge
                                                key={value}
                                                variant="secondary"
                                                className="font-normal text-xs px-2 py-0.5 flex items-center gap-1"
                                            >
                                                {VALUE_COLORS[value] && (
                                                    <div className={cn("h-2.5 w-2.5 rounded-full", VALUE_COLORS[value])} />
                                                )}
                                                {value}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Edit option</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                    onClick={() => handleDeleteOption(option.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Remove option</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Option Form */}
                {isAddingOption && (
                    <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 space-y-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="font-medium text-sm">New option</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setIsAddingOption(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Option name</Label>
                                <Input
                                    value={newOptionName}
                                    onChange={(e) => setNewOptionName(e.target.value)}
                                    placeholder="e.g., Size, Color, Material"
                                    className="h-9"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Option values</Label>
                                <Input
                                    value={newOptionValueInput}
                                    onChange={(e) => setNewOptionValueInput(e.target.value)}
                                    onKeyDown={handleOptionValueAdd}
                                    placeholder="Type a value and press Enter"
                                    className="h-9"
                                />
                                {newOptionValues.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {newOptionValues.map((value) => (
                                            <Badge
                                                key={value}
                                                variant="secondary"
                                                className="font-normal text-xs px-2 py-0.5 flex items-center gap-1 bg-primary/10"
                                            >
                                                {value}
                                                <button
                                                    type="button"
                                                    onClick={() => handleOptionValueRemove(value)}
                                                    className="hover:text-destructive transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                    setIsAddingOption(false);
                                    setNewOptionName('');
                                    setNewOptionValues([]);
                                }}
                            >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSaveOption}
                                disabled={!newOptionName || newOptionValues.length === 0}
                            >
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Done
                            </Button>
                        </div>
                    </div>
                )}

                {/* Variants Table */}
                {variants.length > 0 && (
                    <div className="space-y-3">
                        <Separator />

                        {/* Table Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Variants</span>
                                <Badge variant="outline" className="text-xs">
                                    {variants.length} total
                                </Badge>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {selectedVariants.size > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {selectedVariants.size} selected
                                    </Badge>
                                )}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-7 text-xs">
                                            All locations <ChevronDown className="ml-1 h-3 w-3" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-0" align="end">
                                        <Command>
                                            <CommandList>
                                                <CommandGroup>
                                                    <CommandItem className="flex items-center justify-between">
                                                        All locations
                                                        <Check className="h-4 w-4" />
                                                    </CommandItem>
                                                    <CommandItem>Main Location</CommandItem>
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search variants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9"
                            />
                        </div>

                        {/* Option Filter Pills */}
                        <div className="flex flex-wrap gap-2">
                            {options.map((option) => (
                                <Popover key={option.id}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-7 text-xs">
                                            {option.name} <ChevronDown className="ml-1 h-3 w-3" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40 p-0" align="start">
                                        <Command>
                                            <CommandList>
                                                <CommandGroup>
                                                    {option.values.map((value) => (
                                                        <CommandItem key={value} className="text-xs">
                                                            {VALUE_COLORS[value] && (
                                                                <div className={cn("h-2.5 w-2.5 rounded-full mr-2", VALUE_COLORS[value])} />
                                                            )}
                                                            {value}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent bg-muted/30">
                                        <TableHead className="w-10">
                                            <Checkbox
                                                checked={selectedVariants.size === variants.length}
                                                onCheckedChange={toggleAllVariants}
                                            />
                                        </TableHead>
                                        <TableHead className="text-xs">Variant</TableHead>
                                        <TableHead className="text-xs text-right">Price</TableHead>
                                        <TableHead className="text-xs text-right w-24">Available</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVariants.map((variant) => (
                                        <TableRow
                                            key={variant.id}
                                            className={cn(
                                                "group cursor-pointer transition-colors",
                                                selectedVariants.has(variant.id) && "bg-primary/5"
                                            )}
                                            onClick={() => handleVariantClick(variant)}
                                        >
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedVariants.has(variant.id)}
                                                    onCheckedChange={() => toggleVariantSelection(variant.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 border rounded-md flex items-center justify-center bg-muted/20 text-muted-foreground shrink-0">
                                                        <ImageIcon className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-sm truncate">{variant.title}</span>
                                                            <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                                                                New
                                                            </Badge>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {variant.sku || 'No SKU'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="relative inline-block">
                                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                                        DZD
                                                    </div>
                                                    <Input
                                                        value={variant.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        className="h-8 w-28 text-right pl-10 text-sm"
                                                        onChange={(e) => {
                                                            const newPrice = parseFloat(e.target.value.replace(/,/g, '')) || 0;
                                                            setVariants(prev => prev.map(v => v.id === variant.id ? { ...v, price: newPrice } : v));
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                <Input
                                                    value={variant.quantity}
                                                    type="number"
                                                    className="h-8 w-16 text-right text-sm"
                                                    onChange={(e) => {
                                                        const newQty = parseInt(e.target.value) || 0;
                                                        setVariants(prev => prev.map(v => v.id === variant.id ? { ...v, quantity: newQty } : v));
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Table Footer */}
                            <div className="px-4 py-3 border-t bg-muted/20 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    Total inventory: {variants.reduce((acc, v) => acc + v.quantity, 0)} units
                                </span>
                                {selectedVariants.size > 0 && (
                                    <Button variant="outline" size="sm" className="h-7 text-xs">
                                        <Edit className="h-3 w-3 mr-1" />
                                        Bulk edit ({selectedVariants.size})
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
