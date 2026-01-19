'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from 'lucide-react';

interface CategorySectionProps {
    categoryId: string;
    categories: any[];
    sortedCategories: any[];
    openCategory: boolean;
    setOpenCategory: (open: boolean) => void;
    formatCategoryName: (category: any) => string;
    onCategorySelect: (categoryId: string) => void;
}

export function CategorySection({
    categoryId,
    categories,
    sortedCategories,
    openCategory,
    setOpenCategory,
    formatCategoryName,
    onCategorySelect
}: CategorySectionProps) {
    return (
        <Card>
            <CardHeader className="px-6 pt-6 pb-2">
                <CardTitle className="text-sm font-semibold">Category</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-2">
                    <Label htmlFor="category">Product Category</Label>
                    <Popover open={openCategory} onOpenChange={setOpenCategory}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openCategory}
                                className="w-full justify-between font-normal"
                            >
                                {categoryId
                                    ? categories.find((c) => c.id === categoryId)?.name || "Select category..."
                                    : "Choose a product category"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Search category..." />
                                <CommandList>
                                    <CommandEmpty>No category found.</CommandEmpty>
                                    <CommandGroup>
                                        {sortedCategories.map((category) => (
                                            <CommandItem
                                                key={category.id}
                                                value={category.name}
                                                onSelect={() => {
                                                    onCategorySelect(category.id);
                                                    setOpenCategory(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        categoryId === category.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {formatCategoryName(category)}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground">
                        Determines tax rates and adds metafields to improve search, filters, and cross-channel sales.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
