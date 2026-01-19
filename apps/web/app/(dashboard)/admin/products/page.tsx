'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SearchIcon, MoreHorizontal, Pencil, Trash2, Eye, EyeOff, MessageSquare } from 'lucide-react'
import {
    getProducts,
    getProductById,
    updateProductByAdmin,
    toggleProductStatus,
    deleteProductWithNotification,
    getAllCategories
} from '@/actions/admin'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

export default function AllProductsPage() {
    const { data: session } = useSession()
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [search, setSearch] = useState('')
    const pageSize = 10

    // Modal states
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        price: 0,
        categoryId: '',
    })
    const [deleteReason, setDeleteReason] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const result = await getProducts(page, pageSize, search)
            setProducts(result.data)
            setTotal(result.total)
        } catch (error) {
            toast.error('فشل في تحميل المنتجات')
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const cats = await getAllCategories()
            setCategories(cats)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [page])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchProducts()
    }

    // Open edit modal
    const handleEditClick = async (product: any) => {
        try {
            const fullProduct = await getProductById(product.id)
            setSelectedProduct(fullProduct)
            setEditForm({
                name: fullProduct.name,
                description: fullProduct.description || '',
                price: fullProduct.price,
                categoryId: fullProduct.categoryId,
            })
            setEditModalOpen(true)
        } catch (error) {
            toast.error('فشل في تحميل بيانات المنتج')
        }
    }

    // Save edit
    const handleEditSave = async () => {
        if (!selectedProduct) return
        setActionLoading(true)
        try {
            await updateProductByAdmin(selectedProduct.id, {
                name: editForm.name,
                description: editForm.description,
                price: editForm.price,
                categoryId: editForm.categoryId,
            })
            toast.success('تم تحديث المنتج بنجاح')
            setEditModalOpen(false)
            fetchProducts()
        } catch (error) {
            toast.error('فشل في تحديث المنتج')
        } finally {
            setActionLoading(false)
        }
    }

    // Toggle product status
    const handleToggleStatus = async (product: any) => {
        try {
            const newStatus = !product.isActive
            await toggleProductStatus(product.id, newStatus)
            toast.success(newStatus ? 'تم تفعيل المنتج' : 'تم تعطيل المنتج')
            fetchProducts()
        } catch (error) {
            toast.error('فشل في تغيير حالة المنتج')
        }
    }

    // Open delete modal
    const handleDeleteClick = (product: any) => {
        setSelectedProduct(product)
        setDeleteReason('')
        setDeleteModalOpen(true)
    }

    // Confirm delete
    const handleDeleteConfirm = async () => {
        if (!selectedProduct || !session?.user?.id) return
        if (!deleteReason.trim()) {
            toast.error('يرجى إدخال سبب الحذف')
            return
        }
        setActionLoading(true)
        try {
            await deleteProductWithNotification(
                selectedProduct.id,
                deleteReason,
                session.user.id
            )
            toast.success('تم حذف المنتج وإرسال رسالة للبائع')
            setDeleteModalOpen(false)
            fetchProducts()
        } catch (error) {
            toast.error('فشل في حذف المنتج')
        } finally {
            setActionLoading(false)
        }
    }

    const getStatusBadge = (product: any) => {
        if (!product.isActive) {
            return <Badge variant="destructive">معطل</Badge>
        }
        switch (product.status) {
            case 'PUBLISHED':
                return <Badge variant="default">منشور</Badge>
            case 'PENDING':
                return <Badge variant="secondary">قيد المراجعة</Badge>
            case 'REJECTED':
                return <Badge variant="destructive">مرفوض</Badge>
            default:
                return <Badge variant="outline">{product.status}</Badge>
        }
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    {/* Header */}
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">جميع المنتجات</h3>
                            <p className="dashboard-card-description">
                                إدارة جميع المنتجات على المنصة
                            </p>
                        </div>
                        <form onSubmit={handleSearch} className="mt-6 flex gap-4">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="البحث عن منتجات..."
                                    className="pl-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button type="submit">بحث</Button>
                        </form>
                    </div>

                    {/* Products Table */}
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>المنتج</TableHead>
                                        <TableHead>البائع</TableHead>
                                        <TableHead>الفئة</TableHead>
                                        <TableHead>السعر</TableHead>
                                        <TableHead>الحالة</TableHead>
                                        <TableHead>التاريخ</TableHead>
                                        <TableHead className="text-right">إجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                جاري التحميل...
                                            </TableCell>
                                        </TableRow>
                                    ) : products.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                لا توجد منتجات
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.map((product: any) => (
                                            <TableRow
                                                key={product.id}
                                                className={!product.isActive ? 'opacity-50 bg-muted/30' : ''}
                                            >
                                                <TableCell className="font-medium">
                                                    {!product.isActive && <span className="line-through">{product.name}</span>}
                                                    {product.isActive && product.name}
                                                </TableCell>
                                                <TableCell>{product.vendor?.name}</TableCell>
                                                <TableCell>{product.category?.name}</TableCell>
                                                <TableCell>${product.price}</TableCell>
                                                <TableCell>{getStatusBadge(product)}</TableCell>
                                                <TableCell>{new Date(product.createdAt).toLocaleDateString('ar-EG')}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditClick(product)}>
                                                                <Pencil className="h-4 w-4 mr-2" />
                                                                تعديل
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleToggleStatus(product)}>
                                                                {product.isActive ? (
                                                                    <>
                                                                        <EyeOff className="h-4 w-4 mr-2" />
                                                                        تعطيل
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Eye className="h-4 w-4 mr-2" />
                                                                        تفعيل
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteClick(product)}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                حذف
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            عرض {products.length} من {total} منتج
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                السابق
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page * pageSize >= total}
                            >
                                التالي
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>تعديل المنتج</DialogTitle>
                        <DialogDescription>
                            قم بتعديل بيانات المنتج
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">اسم المنتج</Label>
                            <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">الوصف</Label>
                            <Textarea
                                id="description"
                                value={editForm.description}
                                onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))}
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">السعر</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={editForm.price}
                                onChange={(e) => setEditForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">الفئة</Label>
                            <select
                                id="category"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={editForm.categoryId}
                                onChange={(e) => setEditForm(f => ({ ...f, categoryId: e.target.value }))}
                            >
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                            إلغاء
                        </Button>
                        <Button onClick={handleEditSave} disabled={actionLoading}>
                            {actionLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center gap-2">
                            <Trash2 className="h-5 w-5" />
                            حذف المنتج
                        </DialogTitle>
                        <DialogDescription>
                            سيتم حذف المنتج <strong>{selectedProduct?.name}</strong> نهائياً وإرسال رسالة للبائع.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                سبب الحذف (سيتم إرساله للبائع)
                            </Label>
                            <Textarea
                                id="reason"
                                placeholder="اكتب سبب حذف المنتج..."
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            إلغاء
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={actionLoading || !deleteReason.trim()}
                        >
                            {actionLoading ? 'جاري الحذف...' : 'تأكيد الحذف'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
