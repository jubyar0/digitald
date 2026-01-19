'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/dashboard/ui/dialog';
import { Button } from '@/components/dashboard/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ExternalLink } from 'lucide-react';

interface ExportProductsModalProps {
    open: boolean;
    onClose: () => void;
    totalProducts?: number;
    selectedCount?: number;
    searchQuery?: string;
}

export function ExportProductsModal({
    open,
    onClose,
    totalProducts = 0,
    selectedCount = 0,
    searchQuery = ''
}: ExportProductsModalProps) {
    const [exportScope, setExportScope] = useState<'current' | 'all' | 'selected' | 'search'>('all');
    const [exportFormat, setExportFormat] = useState<'excel' | 'plain'>('excel');

    const handleExport = () => {
        // TODO: Implement export logic
        console.log('Export scope:', exportScope, 'Format:', exportFormat);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Export products</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        This CSV file can update all product information. To update just inventory, quantities use the{' '}
                        <a href="#" className="text-primary hover:underline">CSV file for inventory</a>.
                    </p>

                    <div className="space-y-6">
                        {/* Export Scope */}
                        <div>
                            <h4 className="font-medium mb-3">Export</h4>
                            <RadioGroup
                                value={exportScope}
                                onValueChange={(value) => setExportScope(value as typeof exportScope)}
                                className="space-y-2"
                            >
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="current" id="current" />
                                    <Label htmlFor="current" className="cursor-pointer">Current page</Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="all" id="all" />
                                    <Label htmlFor="all" className="cursor-pointer">All products</Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="selected" id="selected" disabled={selectedCount === 0} />
                                    <Label htmlFor="selected" className={`cursor-pointer ${selectedCount === 0 ? 'text-muted-foreground' : ''}`}>
                                        Selected: {selectedCount} products
                                    </Label>
                                </div>
                                {searchQuery && (
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="search" id="search" />
                                        <Label htmlFor="search" className="cursor-pointer">
                                            Products matching your search
                                        </Label>
                                    </div>
                                )}
                            </RadioGroup>
                        </div>

                        {/* Export Format */}
                        <div>
                            <h4 className="font-medium mb-3">Export as</h4>
                            <RadioGroup
                                value={exportFormat}
                                onValueChange={(value) => setExportFormat(value as typeof exportFormat)}
                                className="space-y-2"
                            >
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="excel" id="excel" />
                                    <Label htmlFor="excel" className="cursor-pointer">
                                        CSV for Excel, Numbers, or other spreadsheet programs
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="plain" id="plain" />
                                    <Label htmlFor="plain" className="cursor-pointer">Plain CSV file</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Learn more about{' '}
                            <a href="#" className="text-primary hover:underline inline-flex items-center gap-1">
                                exporting products to CSV file
                                <ExternalLink className="h-3 w-3" />
                            </a>
                            {' '}or the{' '}
                            <a href="#" className="text-primary hover:underline inline-flex items-center gap-1">
                                bulk editor
                                <ExternalLink className="h-3 w-3" />
                            </a>.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleExport}>
                        Export products
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
