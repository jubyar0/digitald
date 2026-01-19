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
    DropdownMenuTrigger,
} from '@/components/dashboard/ui/dropdown-menu';
import { MoreHorizontal, ArrowUpDown, Plus, Search, Download, Trash } from 'lucide-react';
import { getMyProducts, deleteMyProduct } from '@/actions/vendor-products';
import { toast } from 'sonner';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

// Define enum locally to avoid importing server-side dependencies
enum CategoryType {
    PHYSICAL = 'PHYSICAL',
    DIGITAL = 'DIGITAL',
    MIXED = 'MIXED'
}

interface Product {
    id: string;
    name: string;
    price: number;
    thumbnail?: string;
    status?: string;
    isDraft?: boolean;
    isActive?: boolean;
    featured?: boolean;
    category?: { name: string };
    createdAt: string;
}

export function DigitalProductsTable() {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [total, setTotal] = useState(0);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const { products, total } = await getMyProducts({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                type: CategoryType.DIGITAL,
            } as any);

            setData(products as any);
            setTotal(total);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Failed to load products');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageIndex, pagination.pageSize]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const result = await deleteMyProduct(id);
            if (result.success) {
                toast.success('Product deleted successfully');
                fetchProducts();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('Failed to delete product');
        }
    };

    const columns: ColumnDef<Product>[] = [
        {
            id: 'index',
            header: '#',
            cell: ({ row }) => <span className="text-muted-foreground">{row.index + 1}</span>,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="pl-0 hover:bg-transparent"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => row.original.category?.name || 'Uncategorized',
        },
        {
            accessorKey: 'price',
            header: 'Base Price',
            cell: ({ row }) => {
                const price = parseFloat(row.getValue('price'));
                const formatted = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(price);
                return <div className="font-medium">{formatted}</div>;
            },
        },
        {
            accessorKey: 'status',
            header: 'Approval',
            cell: ({ row }) => (
                <Badge variant={row.original.status === 'PUBLISHED' ? 'default' : 'secondary'} className={row.original.status === 'PUBLISHED' ? 'bg-green-500 hover:bg-green-600' : ''}>
                    {row.original.status || 'Draft'}
                </Badge>
            ),
        },
        {
            accessorKey: 'isActive',
            header: 'Published',
            cell: ({ row }) => (
                <Switch
                    checked={row.original.isActive}
                    onCheckedChange={() => { }} // TODO: Implement toggle
                    className="data-[state=checked]:bg-green-500"
                />
            ),
        },
        {
            accessorKey: 'featured',
            header: 'Featured',
            cell: ({ row }) => (
                <Switch
                    checked={row.original.featured}
                    onCheckedChange={() => { }} // TODO: Implement toggle
                    className="data-[state=checked]:bg-green-500"
                />
            ),
        },
        {
            id: 'actions',
            header: 'Options',
            cell: ({ row }) => {
                const product = row.original;

                return (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 bg-blue-50 hover:bg-blue-100 hover:text-blue-600">
                            <Link href={`/seller/products/edit/${product.id}`}>
                                <Search className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 bg-green-50 hover:bg-green-100 hover:text-green-600">
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600"
                            onClick={() => handleDelete(product.id)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
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
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        onPaginationChange: setPagination,
        manualPagination: true,
        pageCount: Math.ceil(total / pagination.pageSize),
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Search functionality can be added here if needed */}
                </div>
                <Link href="/seller/products/add?type=digital">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Digital Product
                    </Button>
                </Link>
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
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
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
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
    );
}
