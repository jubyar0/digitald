'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    RowSelectionState,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/dashboard/ui/table';
import { Button } from '@/components/dashboard/ui/button';
import { Input } from '@/components/dashboard/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dashboard/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import {
    MoreHorizontal,
    ArrowUpDown,
    Search,
    SlidersHorizontal,
    ArrowUpNarrowWide,
    ChevronDown
} from 'lucide-react';
import { getMyProducts, deleteMyProduct } from '@/actions/vendor-products';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { EmptyProductsState } from '../_components/empty-products-state';

interface Product {
    id: string;
    name: string;
    price: number;
    thumbnail?: string;
    status?: string;
    isDraft?: boolean;
    category?: { name: string };
    createdAt: string;
    _count?: {
        reviews: number;
        orders: number;
    };
}

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

interface ProductsTableProps {
    statusFilter?: TabType;
    onTabChange?: (tab: TabType) => void;
    onUpdate?: () => void;
    onSelectionChange?: (selectedIds: string[]) => void;
}

export function ProductsTable({
    statusFilter = 'all',
    onTabChange,
    onUpdate,
    onSelectionChange
}: ProductsTableProps) {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });
    const [total, setTotal] = useState(0);

    // Map UI tabs to database status values
    const getStatusForFilter = (filter: string): string | undefined => {
        switch (filter) {
            case 'active':
                return 'PUBLISHED';
            case 'draft':
                return 'DRAFT';
            case 'archived':
                return 'SUSPENDED';
            case 'pending':
                return 'PENDING';
            default:
                return undefined; // 'all' returns all products
        }
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const status = getStatusForFilter(statusFilter);
            const { products, total } = await getMyProducts({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                status: status as any,
            });

            setData(products as any);
            setTotal(total);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Failed to load products');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageIndex, pagination.pageSize, statusFilter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (onSelectionChange) {
            const selectedIds = Object.keys(rowSelection)
                .filter(key => rowSelection[key])
                .map(key => data[parseInt(key)]?.id)
                .filter(Boolean) as string[];
            onSelectionChange(selectedIds);
        }
    }, [rowSelection, data, onSelectionChange]);

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('Product ID copied to clipboard');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const result = await deleteMyProduct(id);
            if (result.success) {
                toast.success('Product deleted successfully');
                fetchProducts();
                if (onUpdate) onUpdate();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('Failed to delete product');
        }
    };

    // Get status display config
    const getStatusConfig = (status?: string, isDraft?: boolean) => {
        if (isDraft || status === 'DRAFT') {
            return { label: 'Draft', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' };
        }
        switch (status) {
            case 'PUBLISHED':
                return { label: 'Active', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
            case 'PENDING':
                return { label: 'Pending', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
            case 'SUSPENDED':
                return { label: 'Archived', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' };
            case 'REJECTED':
                return { label: 'Rejected', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
            default:
                return { label: status || 'Draft', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' };
        }
    };

    const columns: ColumnDef<Product>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40,
        },
        {
            accessorKey: 'name',
            header: 'Product',
            cell: ({ row }) => {
                const thumbnail = row.original.thumbnail;
                const hasValidImage = thumbnail && (
                    thumbnail.startsWith('http') ||
                    thumbnail.startsWith('blob:') ||
                    thumbnail.startsWith('data:') ||
                    thumbnail.startsWith('/')
                );

                return (
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex-shrink-0 border">
                            {hasValidImage ? (
                                <Image
                                    src={thumbnail}
                                    alt={row.original.name}
                                    className="h-full w-full object-cover"
                                    width={40}
                                    height={40}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-muted">
                                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <Link
                                href={`/seller/products/edit/${row.original.id}`}
                                className="font-medium text-sm hover:text-primary hover:underline truncate"
                            >
                                {row.original.name}
                            </Link>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const { label, className } = getStatusConfig(row.original.status, row.original.isDraft);
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
                        {label}
                    </span>
                );
            },
        },
        {
            accessorKey: 'inventory',
            header: 'Inventory',
            cell: ({ row }) => {
                const orderCount = row.original._count?.orders || 0;
                return (
                    <span className="text-sm text-muted-foreground">
                        {orderCount > 0 ? `${orderCount} sold` : 'Digital product'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {row.original.category?.name || '-'}
                </span>
            ),
        },
        {
            accessorKey: 'channels',
            header: 'Channels',
            cell: () => (
                <span className="text-sm text-muted-foreground">2</span>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const product = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/seller/products/edit/${product.id}`}>
                                    Edit product
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyId(product.id)}>
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(product.id)}
                            >
                                Delete product
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            pagination,
            rowSelection,
        },
        onPaginationChange: setPagination,
        manualPagination: true,
        pageCount: Math.ceil(total / pagination.pageSize),
    });

    // Show empty state if no products
    if (!loading && data.length === 0) {
        return <EmptyProductsState type={statusFilter} />;
    }

    return (
        <div className="space-y-0">
            {/* Tabs and Search Bar */}
            <div className="flex items-center justify-between p-3 border-b bg-card rounded-t-lg border-x border-t">
                {/* Tabs */}
                <div className="flex items-center gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange?.(tab.id)}
                            className={`
                                px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                                flex items-center gap-1
                                ${statusFilter === tab.id
                                    ? 'bg-muted text-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }
                            `}
                        >
                            {tab.label}
                            {tab.hasDropdown && (
                                <ChevronDown className="h-3 w-3" />
                            )}
                        </button>
                    ))}
                    <button className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
                        +
                    </button>
                </div>
                {/* Search and Filter */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products"
                            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                            onChange={(event) =>
                                table.getColumn('name')?.setFilterValue(event.target.value)
                            }
                            className="pl-8 w-[200px] h-9"
                        />
                    </div>
                    <Button variant="ghost" size="sm" className="h-9 px-2">
                        <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 px-2">
                        <ArrowUpNarrowWide className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-b-lg border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/30 hover:bg-muted/30">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{ width: header.column.getSize() !== 150 ? header.column.getSize() : undefined }}
                                        className="text-xs font-medium text-muted-foreground"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        Loading products...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {total > pagination.pageSize && (
                <div className="flex items-center justify-between py-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
                        {Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)} of {total} products
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Footer link */}
            <div className="text-center py-4">
                <a href="#" className="text-sm text-primary hover:underline">
                    Learn more about products
                </a>
            </div>
        </div>
    );
}
