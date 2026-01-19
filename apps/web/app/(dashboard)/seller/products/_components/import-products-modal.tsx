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
import { Upload, ExternalLink } from 'lucide-react';

interface ImportProductsModalProps {
    open: boolean;
    onClose: () => void;
}

export function ImportProductsModal({ open, onClose }: ImportProductsModalProps) {
    const [importType, setImportType] = useState<'csv' | 'platform'>('csv');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleNext = () => {
        // TODO: Implement import logic
        console.log('Import type:', importType, 'File:', file);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Import products</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        How do you want to import your products?
                    </p>

                    <RadioGroup
                        value={importType}
                        onValueChange={(value) => setImportType(value as 'csv' | 'platform')}
                        className="space-y-4"
                    >
                        <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                            <RadioGroupItem value="csv" id="csv" className="mt-1" />
                            <div className="flex-1">
                                <Label htmlFor="csv" className="font-medium cursor-pointer">
                                    Upload a CSV file
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Import a CSV file that's already formatted for this template.{' '}
                                    <a href="#" className="text-primary hover:underline inline-flex items-center gap-1">
                                        Download sample CSV
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                            <RadioGroupItem value="platform" id="platform" className="mt-1" />
                            <div className="flex-1">
                                <Label htmlFor="platform" className="font-medium cursor-pointer">
                                    Import data from another platform
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Import a copy of your data from another platform using one of our recommended apps.
                                </p>
                            </div>
                        </div>
                    </RadioGroup>

                    {importType === 'csv' && (
                        <div className="mt-4 p-4 border-2 border-dashed rounded-lg text-center">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center gap-2"
                            >
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {file ? file.name : 'Click to upload or drag and drop'}
                                </span>
                                <span className="text-xs text-muted-foreground">CSV files only</span>
                            </label>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleNext}>
                        Next
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
