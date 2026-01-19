'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { getCategoryDiscounts, updateCategoryDiscount } from '@/actions/category-discounts'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import Image from 'next/image'
import { DiscountType } from '@repo/database'

interface CategoryDiscount {
    id: string
    icon?: string | null
    name: string
    parentCategory: string
    inHouseProducts: number
    sellerProducts: number
    presentDiscount?: number
    discountType?: DiscountType
    discountStartDate?: Date | null
    discountEndDate?: Date | null
    isSellerProductDiscountEnabled?: boolean | null
}

export default function CategoryDiscountsPage() {
    const [categories, setCategories] = useState<CategoryDiscount[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchCategories = useCallback(async () => {
        setLoading(true)
        try {
            const res = await getCategoryDiscounts(page, 15, search)
            setCategories(res.data as any)
            setTotalPages(Math.ceil(res.total / 15))
        } catch (error) {
            toast.error('Failed to fetch categories')
        } finally {
            setLoading(false)
        }
    }, [page, search])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handleUpdate = async (category: CategoryDiscount) => {
        try {
            await updateCategoryDiscount(category.id, {
                discountAmount: Number(category.presentDiscount || 0),
                discountType: category.discountType || 'PERCENTAGE',
                discountStartDate: category.discountStartDate || undefined,
                discountEndDate: category.discountEndDate || undefined,
                isSellerProductDiscountEnabled: category.isSellerProductDiscountEnabled || false,
            })
            toast.success('Discount updated successfully')
        } catch (error) {
            toast.error('Failed to update discount')
        }
    }

    const handleInputChange = (
        id: string,
        field: keyof CategoryDiscount,
        value: any
    ) => {
        setCategories((prev) =>
            prev.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat))
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Set Category Wise Product Discount</h1>
            </div>

            <div className="rounded-lg shadow p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-4">Categories</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Type name & Enter"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 max-w-sm"
                        />
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead className="w-[80px]">Icon</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Parent Category</TableHead>
                                <TableHead className="text-center">In-house Products</TableHead>
                                <TableHead className="text-center">Seller Products</TableHead>
                                <TableHead className="w-[200px]">Present Discount</TableHead>
                                <TableHead className="w-[250px]">Discount Date Range</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-10">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-10">
                                        No categories found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category, index) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{(page - 1) * 15 + index + 1}</TableCell>
                                        <TableCell>
                                            {category.icon ? (
                                                <Image
                                                    src={category.icon}
                                                    alt={category.name}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                                                    No
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>{category.parentCategory}</TableCell>
                                        <TableCell className="text-center">
                                            {category.inHouseProducts}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <span>{category.sellerProducts}</span>
                                                <Switch
                                                    checked={category.isSellerProductDiscountEnabled || false}
                                                    onCheckedChange={(checked) =>
                                                        handleInputChange(
                                                            category.id,
                                                            'isSellerProductDiscountEnabled',
                                                            checked
                                                        )
                                                    }
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    value={category.presentDiscount || 0}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            category.id,
                                                            'presentDiscount',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-20"
                                                />
                                                <Select
                                                    value={category.discountType || 'PERCENTAGE'}
                                                    onValueChange={(value) =>
                                                        handleInputChange(category.id, 'discountType', value)
                                                    }
                                                >
                                                    <SelectTrigger className="w-24">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PERCENTAGE">%</SelectItem>
                                                        <SelectItem value="FLAT">Flat</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !category.discountStartDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {category.discountStartDate ? (
                                                            category.discountEndDate ? (
                                                                <>
                                                                    {format(new Date(category.discountStartDate), "LLL dd, y")} -{" "}
                                                                    {format(new Date(category.discountEndDate), "LLL dd, y")}
                                                                </>
                                                            ) : (
                                                                format(new Date(category.discountStartDate), "LLL dd, y")
                                                            )
                                                        ) : (
                                                            <span>Select Date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        initialFocus
                                                        mode="range"
                                                        defaultMonth={category.discountStartDate ? new Date(category.discountStartDate) : undefined}
                                                        selected={{
                                                            from: category.discountStartDate ? new Date(category.discountStartDate) : undefined,
                                                            to: category.discountEndDate ? new Date(category.discountEndDate) : undefined,
                                                        }}
                                                        onSelect={(range) => {
                                                            handleInputChange(category.id, 'discountStartDate', range?.from)
                                                            handleInputChange(category.id, 'discountEndDate', range?.to)
                                                        }}
                                                        numberOfMonths={2}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button onClick={() => handleUpdate(category)}>Set</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-6 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Button
                            key={p}
                            variant={p === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPage(p)}
                        >
                            {p}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
