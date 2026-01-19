'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchIcon, MoreHorizontal, Eye, Pencil, Trash2, Filter } from 'lucide-react'
import {
    getSellerProducts,
    getAllVendors,
    toggleProductPublished,
    toggleProductApproved,
    toggleProductFeatured,
    toggleProductTodaysDeal,
    deleteProduct,
    bulkDeleteProducts,
    bulkPublishProducts
} from '@/actions/admin'
import { toast } from 'sonner'
import Image from 'next/image'

export default function SellerProductsPage() {
    const [products, setProducts] = useState<any[]>([])
    const [vendors, setVendors] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [search, setSearch] = useState('')
    const [activeTab, setActiveTab] = useState('all')
    const [selectedVendor, setSelectedVendor] = useState('')
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const [bulkAction, setBulkAction] = useState('bulk')
    const pageSize = 15

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const result = await getSellerProducts(
                page,
                pageSize,
                search,
                activeTab,
                selectedVendor === 'all' ? '' : selectedVendor
            )
            setProducts(result.data)
            setTotal(result.total)
        } catch (error) {
            toast.error('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    const fetchVendors = async () => {
        try {
            const vendorsList = await getAllVendors()
            setVendors(vendorsList)
        } catch (error) {
            console.error('Error fetching vendors:', error)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [page, activeTab, selectedVendor])

    useEffect(() => {
        fetchVendors()
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchProducts()
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProducts(products.map(p => p.id))
        } else {
            setSelectedProducts([])
        }
    }

    const handleSelectProduct = (productId: string, checked: boolean) => {
        if (checked) {
            setSelectedProducts(prev => [...prev, productId])
        } else {
            setSelectedProducts(prev => prev.filter(id => id !== productId))
        }
    }

    const handleBulkAction = async () => {
        if (selectedProducts.length === 0) {
            toast.error('Please select products first')
            return
        }

        if (bulkAction === 'delete') {
            if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return
            try {
                await bulkDeleteProducts(selectedProducts)
                toast.success('Products deleted successfully')
                setSelectedProducts([])
                fetchProducts()
            } catch (error) {
                toast.error('Failed to delete products')
            }
        } else if (bulkAction === 'publish') {
            try {
                await bulkPublishProducts(selectedProducts)
                toast.success('Products published successfully')
                setSelectedProducts([])
                fetchProducts()
            } catch (error) {
                toast.error('Failed to publish products')
            }
        }
    }

    const handleTogglePublished = async (productId: string, currentStatus: boolean) => {
        try {
            await toggleProductPublished(productId, !currentStatus)
            toast.success(currentStatus ? 'Product unpublished' : 'Product published')
            fetchProducts()
        } catch (error) {
            toast.error('Failed to toggle published status')
        }
    }

    const handleToggleApproved = async (productId: string, currentStatus: boolean) => {
        try {
            const approved = currentStatus === false || currentStatus === undefined
            await toggleProductApproved(productId, approved)
            toast.success(approved ? 'Product approved' : 'Product approval revoked')
            fetchProducts()
        } catch (error) {
            toast.error('Failed to toggle approved status')
        }
    }

    const handleToggleFeatured = async (productId: string, currentStatus: boolean) => {
        try {
            await toggleProductFeatured(productId, !currentStatus)
            toast.success(currentStatus ? 'Removed from featured' : 'Added to featured')
            fetchProducts()
        } catch (error) {
            toast.error('Failed to toggle featured status')
        }
    }

    const handleToggleTodaysDeal = async (productId: string, currentStatus: boolean) => {
        try {
            await toggleProductTodaysDeal(productId, !currentStatus)
            toast.success(currentStatus ? 'Removed from today\'s deal' : 'Added to today\'s deal')
            fetchProducts()
        } catch (error) {
            toast.error('Failed to toggle today\'s deal status')
        }
    }

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            await deleteProduct(productId)
            toast.success('Product deleted successfully')
            fetchProducts()
        } catch (error) {
            toast.error('Failed to delete product')
        }
    }

    const renderStars = (rating: number) => {
        const stars = []
        const fullStars = Math.floor(rating)

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <span key={i} className="text-yellow-400">★</span>
                )
            } else {
                stars.push(
                    <span key={i} className="text-gray-300">★</span>
                )
            }
        }

        return <div className="flex items-center gap-1">{stars}</div>
    }

    const totalPages = Math.ceil(total / pageSize)

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-6 dashboard-padding">
                    {/* Header */}
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header mb-6">
                            <h3 className="dashboard-card-title">All Products</h3>
                        </div>

                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                            <TabsList className="grid w-full max-w-2xl grid-cols-4">
                                <TabsTrigger value="all">All Seller Products</TabsTrigger>
                                <TabsTrigger value="physical">Physical Products</TabsTrigger>
                                <TabsTrigger value="digital">Digital Products</TabsTrigger>
                                <TabsTrigger value="not-approved">Not Approved</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4">
                            <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search products..."
                                        className="pl-10"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </form>

                            <Select value={selectedVendor || 'all'} onValueChange={setSelectedVendor}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="All Sellers" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sellers</SelectItem>
                                    {vendors.map((vendor) => (
                                        <SelectItem key={vendor.id} value={vendor.id}>
                                            {vendor.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center gap-2">
                                <Select value={bulkAction} onValueChange={setBulkAction}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Bulk Action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bulk">Bulk Action</SelectItem>
                                        <SelectItem value="delete">Delete Selected</SelectItem>
                                        <SelectItem value="publish">Publish Selected</SelectItem>
                                    </SelectContent>
                                </Select>
                                {bulkAction !== 'bulk' && (
                                    <Button onClick={handleBulkAction} variant="secondary">
                                        Apply
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[40px]">
                                                <Checkbox
                                                    checked={selectedProducts.length === products.length && products.length > 0}
                                                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                                />
                                            </TableHead>
                                            <TableHead className="w-[80px]">IMAGE</TableHead>
                                            <TableHead className="min-w-[250px]">ORDER DETAILS</TableHead>
                                            <TableHead className="w-[120px]">RATINGS</TableHead>
                                            <TableHead className="w-[120px]">PRICE DETAILS</TableHead>
                                            <TableHead className="w-[120px]">INFO</TableHead>
                                            <TableHead className="w-[100px] text-center">PUBLISHED</TableHead>
                                            <TableHead className="w-[100px] text-center">APPROVED</TableHead>
                                            <TableHead className="w-[100px] text-center">FEATURED</TableHead>
                                            <TableHead className="w-[120px] text-center">TODAY'S DEAL</TableHead>
                                            <TableHead className="w-[80px] text-center">OPTIONS</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={11} className="h-24 text-center">
                                                    Loading...
                                                </TableCell>
                                            </TableRow>
                                        ) : products.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={11} className="h-24 text-center">
                                                    No products found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            products.map((product: any) => (
                                                <TableRow key={product.id}>
                                                    {/* Checkbox */}
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedProducts.includes(product.id)}
                                                            onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                                                        />
                                                    </TableCell>

                                                    {/* Image */}
                                                    <TableCell>
                                                        <div className="relative h-[60px] w-[60px] rounded overflow-hidden bg-muted">
                                                            {product.thumbnail ? (
                                                                <Image
                                                                    src={product.thumbnail}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                                    No image
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    {/* Order Details */}
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            <div className="font-medium text-sm line-clamp-1">
                                                                {product.name}
                                                            </div>
                                                            <div className="text-xs text-primary hover:underline cursor-pointer">
                                                                {product.vendor?.name || 'Unknown seller'}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {product.category?.name || 'No category'}
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* Ratings */}
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            {renderStars(product.averageRating || 0)}
                                                            <div className="text-xs text-muted-foreground">
                                                                {product.averageRating?.toFixed(1) || '0.0'} out of 5.0
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {product.totalReviews} reviews
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* Price Details */}
                                                    <TableCell>
                                                        <div className="font-semibold text-sm">
                                                            ${product.price.toFixed(2)}
                                                        </div>
                                                    </TableCell>

                                                    {/* Info */}
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1 text-xs">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-muted-foreground">Number of Sale:</span>
                                                                <span className="font-medium">{product.sales || 0}</span>
                                                            </div>
                                                            <div className="text-blue-600 hover:underline cursor-pointer">
                                                                View Stock
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* Published Toggle */}
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center">
                                                            <Switch
                                                                checked={product.isActive}
                                                                onCheckedChange={() => handleTogglePublished(product.id, product.isActive)}
                                                            />
                                                        </div>
                                                    </TableCell>

                                                    {/* Approved Toggle */}
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center">
                                                            <Switch
                                                                checked={product.status === 'PUBLISHED'}
                                                                onCheckedChange={() => handleToggleApproved(product.id, product.status === 'PUBLISHED')}
                                                            />
                                                        </div>
                                                    </TableCell>

                                                    {/* Featured Toggle */}
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center">
                                                            <Switch
                                                                checked={product.featured || false}
                                                                onCheckedChange={() => handleToggleFeatured(product.id, product.featured || false)}
                                                            />
                                                        </div>
                                                    </TableCell>

                                                    {/* Today's Deal Toggle */}
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center">
                                                            <Switch
                                                                checked={product.todaysDeal || false}
                                                                onCheckedChange={() => handleToggleTodaysDeal(product.id, product.todaysDeal || false)}
                                                            />
                                                        </div>
                                                    </TableCell>

                                                    {/* Options */}
                                                    <TableCell className="text-center">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Pencil className="h-4 w-4 mr-2" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDelete(product.id)}
                                                                    className="text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 pb-8">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                                let pageNum
                                if (totalPages <= 7) {
                                    pageNum = i + 1
                                } else if (page <= 4) {
                                    pageNum = i + 1
                                } else if (page >= totalPages - 3) {
                                    pageNum = totalPages - 6 + i
                                } else {
                                    pageNum = page - 3 + i
                                }

                                return (
                                    <Button
                                        key={i}
                                        variant={page === pageNum ? "default" : "outline"}
                                        size="sm"
                                        className="w-8 h-8 p-0"
                                        onClick={() => setPage(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                )
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
