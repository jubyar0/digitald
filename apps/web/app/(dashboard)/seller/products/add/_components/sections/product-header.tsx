'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductHeaderProps {
    isEditMode: boolean;
    productName: string;
    loading: boolean;
    onCancel?: () => void;
    onSave: () => void;
}

export function ProductHeader({ isEditMode, productName, loading, onCancel, onSave }: ProductHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/seller/products">
                    <Button variant="ghost" size="icon" type="button">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold">
                    {isEditMode ? productName : 'Add product'}
                </h1>
                {!isEditMode && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        Unsaved product
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" type="button" onClick={onCancel}>
                    Discard
                </Button>
                <Button type="button" onClick={onSave} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Save
                </Button>
            </div>
        </div>
    );
}
