'use client';

import { useState, useCallback } from 'react';
import { ProductsTable } from './inventory/products-table';
import { ImportProductsModal } from './_components/import-products-modal';
import { ExportProductsModal } from './_components/export-products-modal';
import { Button } from '@/components/dashboard/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/dashboard/ui/dropdown-menu';
import { Plus, ChevronDown, RefreshCw } from 'lucide-react';
import Link from 'next/link';

type TabType = 'all' | 'active' | 'draft' | 'archived' | 'pending';

interface TabConfig {
    id: TabType;
    label: string;
    hasDropdown?: boolean;
}

const tabs: TabConfig[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active', hasDropdown: true },
    { id: 'draft', label: 'Draft', hasDropdown: true },
    { id: 'archived', label: 'Archived', hasDropdown: true },
];

export default function ProductsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-col gap-0 container mx-auto max-w-7xl">
                {/* Page Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
                    <div className="flex items-center gap-3">
                        <RefreshCw className="h-5 w-5 text-muted-foreground" />
                        <h1 className="text-xl font-semibold">Products</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowExportModal(true)}
                        >
                            Export
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowImportModal(true)}
                        >
                            Import
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    More actions
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleRefresh}>
                                    Refresh list
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Bulk edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Archive selected
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link href="/seller/products/add">
                            <Button size="sm">
                                <Plus className="mr-1 h-4 w-4" />
                                Add product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Products Table */}
                <div className="p-6">
                    <ProductsTable
                        key={`${activeTab}-${refreshKey}`}
                        statusFilter={activeTab}
                        onTabChange={setActiveTab}
                        onUpdate={handleRefresh}
                        onSelectionChange={setSelectedProductIds}
                    />
                </div>
            </div>

            {/* Modals */}
            <ImportProductsModal
                open={showImportModal}
                onClose={() => setShowImportModal(false)}
            />
            <ExportProductsModal
                open={showExportModal}
                onClose={() => setShowExportModal(false)}
                selectedCount={selectedProductIds.length}
            />
        </div>
    );
}
