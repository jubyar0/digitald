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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCategories, getAllCategories, createCategory, updateCategory, deleteCategory } from '@/actions/admin'
import { toast } from 'sonner'
import { PlusIcon, Loader2Icon, EditIcon, Trash2Icon, SearchIcon, MoreVertical } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { CATEGORY_ICONS, getCategoryIcon } from '@/components/admin/category-icons'

interface Category {
    id: string
    name: string
    slug: string
    isActive: boolean
    parentId?: string | null
    description?: string | null
    type?: 'PHYSICAL' | 'DIGITAL' | 'MIXED'
    icon?: string | null
    commission?: number | null
    parent?: {
        id: string
        name: string
    } | null
    children?: Category[]
    _count: {
        products: number
        children?: number
    }
}

type CategoryType = 'ALL' | 'PHYSICAL' | 'DIGITAL'

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [allCategories, setAllCategories] = useState<{ id: string; name: string }[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<CategoryType>('ALL')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10

    // Add Dialog State
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [addName, setAddName] = useState('')
    const [addSlug, setAddSlug] = useState('')
    const [addDescription, setAddDescription] = useState('')
    const [addParentId, setAddParentId] = useState<string>('none')
    const [addType, setAddType] = useState<'PHYSICAL' | 'DIGITAL' | 'MIXED'>('MIXED')
    const [addIcon, setAddIcon] = useState<string>('package')
    const [addCommission, setAddCommission] = useState<string>('')
    const [adding, setAdding] = useState(false)

    // Edit Dialog State
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editCategory, setEditCategory] = useState<Category | null>(null)
    const [editName, setEditName] = useState('')
    const [editSlug, setEditSlug] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [editParentId, setEditParentId] = useState<string>('none')
    const [editType, setEditType] = useState<'PHYSICAL' | 'DIGITAL' | 'MIXED'>('MIXED')
    const [editIcon, setEditIcon] = useState<string>('package')
    const [editCommission, setEditCommission] = useState<string>('')
    const [editIsActive, setEditIsActive] = useState(true)
    const [editing, setEditing] = useState(false)

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
    const [deleting, setDeleting] = useState(false)

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const result = await getCategories(page, pageSize)
            setCategories(result.data as any)
            setTotal(result.total)

            // Also fetch all categories for dropdown
            const all = await getAllCategories()
            setAllCategories(all)
        } catch (error) {
            toast.error('Failed to load categories')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [page])

    const handleAddClick = () => {
        setAddName('')
        setAddSlug('')
        setAddDescription('')
        setAddParentId('none')
        setAddType('MIXED')
        setAddIcon('package')
        setAddCommission('')
        setAddDialogOpen(true)
    }

    const handleAddCategory = async () => {
        if (!addName.trim() || !addSlug.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        setAdding(true)
        try {
            const result = await createCategory(
                addName,
                addSlug,
                addParentId === 'none' ? undefined : addParentId
            )
            if (result.success) {
                toast.success('Category created successfully')
                setAddDialogOpen(false)
                fetchCategories()
            } else {
                toast.error(result.error || 'Failed to create category')
            }
        } catch (error) {
            toast.error('Failed to create category')
        } finally {
            setAdding(false)
        }
    }

    const handleEditClick = (category: Category) => {
        setEditCategory(category)
        setEditName(category.name)
        setEditSlug(category.slug)
        setEditDescription(category.description || '')
        setEditParentId(category.parentId || 'none')
        setEditType(category.type || 'MIXED')
        setEditIcon(category.icon || 'package')
        setEditCommission(category.commission?.toString() || '')
        setEditIsActive(category.isActive)
        setEditDialogOpen(true)
    }

    const handleEditCategory = async () => {
        if (!editCategory || !editName.trim() || !editSlug.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        setEditing(true)
        try {
            await updateCategory(
                editCategory.id,
                editName,
                editSlug,
                editIsActive,
                editParentId === 'none' ? null : editParentId
            )
            toast.success('Category updated successfully')
            setEditDialogOpen(false)
            fetchCategories()
        } catch (error) {
            toast.error('Failed to update category')
        } finally {
            setEditing(false)
        }
    }

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category)
        setDeleteDialogOpen(true)
    }

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return

        setDeleting(true)
        try {
            await deleteCategory(categoryToDelete.id)
            toast.success('Category deleted successfully')
            setDeleteDialogOpen(false)
            fetchCategories()
        } catch (error) {
            toast.error('Failed to delete category')
        } finally {
            setDeleting(false)
        }
    }

    // Auto-generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
    }

    // Filter categories based on active tab and search
    const filteredCategories = categories.filter((category) => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.slug.toLowerCase().includes(searchTerm.toLowerCase())

        if (activeTab === 'ALL') return matchesSearch
        if (activeTab === 'PHYSICAL') return matchesSearch && category.type === 'PHYSICAL'
        if (activeTab === 'DIGITAL') return matchesSearch && category.type === 'DIGITAL'

        return matchesSearch
    })

    const getTypeColor = (type?: 'PHYSICAL' | 'DIGITAL' | 'MIXED') => {
        switch (type) {
            case 'PHYSICAL':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'DIGITAL':
                return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            case 'MIXED':
                return 'bg-green-500/10 text-green-500 border-green-500/20'
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
        }
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-6 dashboard-padding">
                    {/* Header */}
                    <div className="dashboard-card p-6">
                        <div className="flex items-center justify-between">
                            <div className="dashboard-card-header">
                                <h3 className="dashboard-card-title">All Categories</h3>
                                <p className="dashboard-card-description">
                                    Manage product categories
                                </p>
                            </div>
                            <Button onClick={handleAddClick} size="lg">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add New
                            </Button>
                        </div>
                    </div>

                    {/* Tabs and Search */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CategoryType)} className="w-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <TabsList className="grid w-auto grid-cols-3">
                                            <TabsTrigger value="ALL">All Categories</TabsTrigger>
                                            <TabsTrigger value="PHYSICAL">Physical Categories</TabsTrigger>
                                            <TabsTrigger value="DIGITAL">Digital Categories</TabsTrigger>
                                        </TabsList>

                                        <div className="relative w-64">
                                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search Categories"
                                                className="pl-10"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </Tabs>

                                {/* Categories Table */}
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px]">#</TableHead>
                                                <TableHead>NAME</TableHead>
                                                <TableHead>PRIMARY CATEGORY</TableHead>
                                                <TableHead>PARENT LEVEL</TableHead>
                                                <TableHead>CHILD LEVEL</TableHead>
                                                <TableHead>SLUG NAME</TableHead>
                                                <TableHead>DESC</TableHead>
                                                <TableHead>COMMISSION</TableHead>
                                                <TableHead className="text-right">ACTIONS</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={9} className="h-24 text-center">
                                                        <Loader2Icon className="h-6 w-6 animate-spin mx-auto" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : filteredCategories.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={9} className="h-24 text-center">
                                                        No categories found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredCategories.map((category, index) => {
                                                    const IconComponent = getCategoryIcon(category.icon)
                                                    return (
                                                        <TableRow key={category.id}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                                                        <IconComponent className="h-5 w-5" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium">{category.name}</div>
                                                                        <Badge variant="outline" className={`mt-1 ${getTypeColor(category.type)}`}>
                                                                            {category.type || 'MIXED'}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {category.parent ? (
                                                                    <Badge variant="secondary">{category.parent.name}</Badge>
                                                                ) : (
                                                                    <span className="text-muted-foreground">—</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-muted-foreground">
                                                                    {category.parentId ? '1' : '0'}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-muted-foreground">
                                                                    {category._count.children || 0}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                                                    {category.slug}
                                                                </code>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-sm text-muted-foreground line-clamp-1 max-w-[150px]">
                                                                    {category.description || '—'}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                {category.commission ? (
                                                                    <Badge variant="outline">{category.commission}%</Badge>
                                                                ) : (
                                                                    <span className="text-muted-foreground">—</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm">
                                                                            <span className="text-blue-500 mr-2">View More</span>
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => handleEditClick(category)}>
                                                                            <EditIcon className="mr-2 h-4 w-4" />
                                                                            Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleDeleteClick(category)}
                                                                            className="text-red-600"
                                                                        >
                                                                            <Trash2Icon className="mr-2 h-4 w-4" />
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {filteredCategories.length} of {total} categories
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total}>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Category Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>
                            Create a new product category
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="addName">Name *</Label>
                            <Input
                                id="addName"
                                placeholder="Enter category name"
                                value={addName}
                                onChange={(e) => {
                                    setAddName(e.target.value)
                                    setAddSlug(generateSlug(e.target.value))
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="addSlug">Slug *</Label>
                            <Input
                                id="addSlug"
                                placeholder="category-slug"
                                value={addSlug}
                                onChange={(e) => setAddSlug(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="addType">Type</Label>
                            <Select value={addType} onValueChange={(v: any) => setAddType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PHYSICAL">Physical</SelectItem>
                                    <SelectItem value="DIGITAL">Digital</SelectItem>
                                    <SelectItem value="MIXED">Mixed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="addIcon">Icon</Label>
                            <Select value={addIcon} onValueChange={setAddIcon}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORY_ICONS.map((icon) => (
                                        <SelectItem key={icon.name} value={icon.name}>
                                            <div className="flex items-center gap-2">
                                                <icon.icon className="h-4 w-4" />
                                                <span>{icon.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="addParent">Parent Category</Label>
                            <Select value={addParentId} onValueChange={setAddParentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None (Root Category)</SelectItem>
                                    {allCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="addCommission">Commission (%)</Label>
                            <Input
                                id="addCommission"
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                placeholder="0.00"
                                value={addCommission}
                                onChange={(e) => setAddCommission(e.target.value)}
                            />
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="addDescription">Description</Label>
                            <Textarea
                                id="addDescription"
                                placeholder="Category description"
                                value={addDescription}
                                onChange={(e) => setAddDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAddDialogOpen(false)}
                            disabled={adding}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddCategory} disabled={adding}>
                            {adding && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Add Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Update category information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="editName">Name *</Label>
                            <Input
                                id="editName"
                                placeholder="Enter category name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="editSlug">Slug *</Label>
                            <Input
                                id="editSlug"
                                placeholder="category-slug"
                                value={editSlug}
                                onChange={(e) => setEditSlug(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="editType">Type</Label>
                            <Select value={editType} onValueChange={(v: any) => setEditType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PHYSICAL">Physical</SelectItem>
                                    <SelectItem value="DIGITAL">Digital</SelectItem>
                                    <SelectItem value="MIXED">Mixed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="editIcon">Icon</Label>
                            <Select value={editIcon} onValueChange={setEditIcon}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORY_ICONS.map((icon) => (
                                        <SelectItem key={icon.name} value={icon.name}>
                                            <div className="flex items-center gap-2">
                                                <icon.icon className="h-4 w-4" />
                                                <span>{icon.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="editParent">Parent Category</Label>
                            <Select value={editParentId} onValueChange={setEditParentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None (Root Category)</SelectItem>
                                    {allCategories
                                        .filter(cat => cat.id !== editCategory?.id)
                                        .map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="editCommission">Commission (%)</Label>
                            <Input
                                id="editCommission"
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                placeholder="0.00"
                                value={editCommission}
                                onChange={(e) => setEditCommission(e.target.value)}
                            />
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="editDescription">Description</Label>
                            <Textarea
                                id="editDescription"
                                placeholder="Category description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="col-span-2 flex items-center space-x-2">
                            <Switch
                                id="editIsActive"
                                checked={editIsActive}
                                onCheckedChange={setEditIsActive}
                            />
                            <Label htmlFor="editIsActive">Active</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditDialogOpen(false)}
                            disabled={editing}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleEditCategory} disabled={editing}>
                            {editing && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Update Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Category Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the category{' '}
                            <span className="font-semibold">{categoryToDelete?.name}</span>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCategory}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
