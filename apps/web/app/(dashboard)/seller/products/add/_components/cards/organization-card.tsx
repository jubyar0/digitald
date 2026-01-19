'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
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
    HelpCircle, Search, Plus, X, Check, ChevronRight,
    Tag, FolderOpen, Building2, LayoutGrid, Sparkles
} from 'lucide-react';
import { Collection } from '../types';
import { cn } from '@/lib/utils';

interface OrganizationCardProps {
    categoryId: string;
    sortedCategories: any[];
    formatCategoryName: (category: any) => string;
    productType: string;
    setProductType: (type: string) => void;
    productTypeOpen: boolean;
    setProductTypeOpen: (open: boolean) => void;
    vendorInput: string;
    setVendorInput: (vendor: string) => void;
    collectionsOpen: boolean;
    setCollectionsOpen: (open: boolean) => void;
    collectionsSearch: string;
    setCollectionsSearch: (search: string) => void;
    selectedCollections: string[];
    setSelectedCollections: React.Dispatch<React.SetStateAction<string[]>>;
    availableCollections: Collection[];
    tagsOpen: boolean;
    setTagsOpen: (open: boolean) => void;
    tagsSearch: string;
    setTagsSearch: (search: string) => void;
    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
    availableTags: string[];
    onCategorySelect: (categoryId: string) => void;
}

const SUGGESTED_VENDORS = ['Nike', 'Adidas', 'Puma', 'Zara', 'H&M', 'Custom'];
const TAG_COLORS = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700', 'bg-emerald-100 text-emerald-700', 'bg-pink-100 text-pink-700'];

export function OrganizationCard({
    categoryId,
    sortedCategories,
    formatCategoryName,
    productType,
    setProductType,
    productTypeOpen,
    setProductTypeOpen,
    vendorInput,
    setVendorInput,
    collectionsOpen,
    setCollectionsOpen,
    collectionsSearch,
    setCollectionsSearch,
    selectedCollections,
    setSelectedCollections,
    availableCollections,
    tagsOpen,
    setTagsOpen,
    tagsSearch,
    setTagsSearch,
    selectedTags,
    setSelectedTags,
    availableTags,
    onCategorySelect
}: OrganizationCardProps) {
    const [vendorOpen, setVendorOpen] = useState(false);
    const [customTagInput, setCustomTagInput] = useState('');

    const handleAddCustomTag = () => {
        if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
            setSelectedTags(prev => [...prev, customTagInput.trim()]);
            setCustomTagInput('');
        }
    };

    const getTagColor = (tag: string) => {
        const index = tag.length % TAG_COLORS.length;
        return TAG_COLORS[index];
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-semibold">Product organization</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p className="text-xs">Organize your product for better discoverability and filtering</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 space-y-5">
                {/* Product Type */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                        <Label className="text-sm font-medium">Product type</Label>
                    </div>
                    <Popover open={productTypeOpen} onOpenChange={setProductTypeOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={productTypeOpen}
                                className="w-full justify-between font-normal h-9 text-sm"
                            >
                                <span className={cn("truncate", !productType && !categoryId && "text-muted-foreground")}>
                                    {productType || (categoryId && sortedCategories.find(c => c.id === categoryId)?.name) || 'Select product type'}
                                </span>
                                <ChevronRight className={cn(
                                    "ml-2 h-4 w-4 shrink-0 transition-transform duration-200",
                                    productTypeOpen && "rotate-90"
                                )} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Search product types..." />
                                <CommandList className="max-h-[200px]">
                                    <CommandEmpty>
                                        <div className="py-4 text-center">
                                            <p className="text-sm text-muted-foreground">No types found</p>
                                            <Button variant="link" size="sm" className="mt-1">
                                                <Plus className="h-3 w-3 mr-1" />
                                                Create new type
                                            </Button>
                                        </div>
                                    </CommandEmpty>
                                    <CommandGroup heading="Suggested">
                                        {sortedCategories.slice(0, 5).map((category) => (
                                            <CommandItem
                                                key={category.id}
                                                value={category.name}
                                                onSelect={() => {
                                                    onCategorySelect(category.id);
                                                    setProductType(formatCategoryName(category));
                                                    setProductTypeOpen(false);
                                                }}
                                                className="flex items-center justify-between"
                                            >
                                                <span className="text-sm">{formatCategoryName(category)}</span>
                                                {categoryId === category.id && (
                                                    <Check className="h-4 w-4 text-primary" />
                                                )}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                    {sortedCategories.length > 5 && (
                                        <>
                                            <CommandSeparator />
                                            <CommandGroup heading="All Types">
                                                {sortedCategories.slice(5).map((category) => (
                                                    <CommandItem
                                                        key={category.id}
                                                        value={category.name}
                                                        onSelect={() => {
                                                            onCategorySelect(category.id);
                                                            setProductType(formatCategoryName(category));
                                                            setProductTypeOpen(false);
                                                        }}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <span className="text-sm">{formatCategoryName(category)}</span>
                                                        {categoryId === category.id && (
                                                            <Check className="h-4 w-4 text-primary" />
                                                        )}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </>
                                    )}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <Separator />

                {/* Vendor */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <Label className="text-sm font-medium">Vendor</Label>
                    </div>
                    <Popover open={vendorOpen} onOpenChange={setVendorOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between font-normal h-9 text-sm"
                            >
                                <span className={cn("truncate", !vendorInput && "text-muted-foreground")}>
                                    {vendorInput || 'Select or enter vendor'}
                                </span>
                                <ChevronRight className={cn(
                                    "ml-2 h-4 w-4 shrink-0 transition-transform duration-200",
                                    vendorOpen && "rotate-90"
                                )} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command>
                                <CommandInput
                                    placeholder="Search or enter vendor..."
                                    value={vendorInput}
                                    onValueChange={setVendorInput}
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        <button
                                            type="button"
                                            className="w-full text-left px-2 py-3 text-sm hover:bg-muted"
                                            onClick={() => {
                                                setVendorOpen(false);
                                            }}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Plus className="h-3.5 w-3.5" />
                                                Add "{vendorInput}" as new vendor
                                            </span>
                                        </button>
                                    </CommandEmpty>
                                    <CommandGroup heading="Popular vendors">
                                        {SUGGESTED_VENDORS
                                            .filter(v => v.toLowerCase().includes(vendorInput.toLowerCase()))
                                            .map((vendor) => (
                                                <CommandItem
                                                    key={vendor}
                                                    value={vendor}
                                                    onSelect={() => {
                                                        setVendorInput(vendor);
                                                        setVendorOpen(false);
                                                    }}
                                                >
                                                    <span className="text-sm">{vendor}</span>
                                                    {vendorInput === vendor && (
                                                        <Check className="ml-auto h-4 w-4 text-primary" />
                                                    )}
                                                </CommandItem>
                                            ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <Separator />

                {/* Collections */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                            <Label className="text-sm font-medium">Collections</Label>
                        </div>
                        {selectedCollections.length > 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {selectedCollections.length}
                            </Badge>
                        )}
                    </div>
                    <Popover open={collectionsOpen} onOpenChange={setCollectionsOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-start font-normal h-9 text-sm text-muted-foreground"
                            >
                                <Search className="h-3.5 w-3.5 mr-2 shrink-0" />
                                Search collections...
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command>
                                <CommandInput
                                    placeholder="Search or create collection..."
                                    value={collectionsSearch}
                                    onValueChange={setCollectionsSearch}
                                />
                                <CommandList>
                                    <CommandGroup>
                                        <CommandItem className="text-primary" onSelect={() => { }}>
                                            <Plus className="h-3.5 w-3.5 mr-2" />
                                            <span className="text-sm">Create new collection</span>
                                        </CommandItem>
                                    </CommandGroup>
                                    <CommandSeparator />
                                    <CommandGroup heading="Available collections">
                                        {availableCollections
                                            .filter(c => c.name.toLowerCase().includes(collectionsSearch.toLowerCase()))
                                            .map((collection) => (
                                                <CommandItem
                                                    key={collection.id}
                                                    value={collection.name}
                                                    onSelect={() => {
                                                        if (selectedCollections.includes(collection.id)) {
                                                            setSelectedCollections(prev => prev.filter(id => id !== collection.id));
                                                        } else {
                                                            setSelectedCollections(prev => [...prev, collection.id]);
                                                        }
                                                    }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Checkbox
                                                        checked={selectedCollections.includes(collection.id)}
                                                        className="h-4 w-4"
                                                    />
                                                    <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-sm flex-1">{collection.name}</span>
                                                </CommandItem>
                                            ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {/* Selected Collections */}
                    {selectedCollections.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {selectedCollections.map((collectionId) => {
                                const collection = availableCollections.find(c => c.id === collectionId);
                                return (
                                    <Badge
                                        key={collectionId}
                                        variant="secondary"
                                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-normal flex items-center gap-1 transition-colors"
                                    >
                                        <FolderOpen className="h-2.5 w-2.5" />
                                        {collection?.name}
                                        <button
                                            type="button"
                                            onClick={() => setSelectedCollections(prev => prev.filter(id => id !== collectionId))}
                                            className="ml-0.5 hover:text-blue-900 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                );
                            })}
                        </div>
                    )}
                </div>

                <Separator />

                {/* Tags */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                            <Label className="text-sm font-medium">Tags</Label>
                        </div>
                        {selectedTags.length > 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {selectedTags.length}
                            </Badge>
                        )}
                    </div>
                    <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-start font-normal h-9 text-sm text-muted-foreground"
                            >
                                <Tag className="h-3.5 w-3.5 mr-2 shrink-0" />
                                Find or create tags...
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command>
                                <div className="flex items-center border-b px-3">
                                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <input
                                        className="flex-1 h-10 px-2 text-sm outline-none placeholder:text-muted-foreground"
                                        placeholder="Enter tag and press Enter..."
                                        value={customTagInput}
                                        onChange={(e) => setCustomTagInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddCustomTag();
                                            }
                                        }}
                                    />
                                    {customTagInput && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 px-2 text-xs"
                                            onClick={handleAddCustomTag}
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add
                                        </Button>
                                    )}
                                </div>
                                <CommandList>
                                    <CommandGroup heading="Suggested tags">
                                        {availableTags
                                            .filter(tag =>
                                                tag.toLowerCase().includes(customTagInput.toLowerCase()) &&
                                                !selectedTags.includes(tag)
                                            )
                                            .slice(0, 6)
                                            .map((tag) => (
                                                <CommandItem
                                                    key={tag}
                                                    value={tag}
                                                    onSelect={() => {
                                                        setSelectedTags(prev => [...prev, tag]);
                                                        setCustomTagInput('');
                                                    }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div className={cn("h-2 w-2 rounded-full", getTagColor(tag).replace('text-', 'bg-').split(' ')[0])} />
                                                    <span className="text-sm">{tag}</span>
                                                </CommandItem>
                                            ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {/* Selected Tags */}
                    {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {selectedTags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className={cn(
                                        "px-2 py-0.5 text-xs font-normal flex items-center gap-1 transition-colors",
                                        getTagColor(tag)
                                    )}
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                                        className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* AI Suggestion */}
                {selectedTags.length === 0 && selectedCollections.length === 0 && (
                    <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                        <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-purple-900">Smart suggestions</p>
                            <p className="text-xs text-purple-700 mt-0.5">
                                Add a title and description to get AI-powered tag recommendations
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
