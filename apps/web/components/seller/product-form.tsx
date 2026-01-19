'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createMyProduct, getMyProducts } from '@/actions/vendor-products'
import { getAllCategories } from '@/actions/admin'
import { toast } from 'sonner'
import { Loader2, Upload, Plus, X, Check, ChevronsUpDown, MoreHorizontal, Download, FileDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MediaUploadDialog } from './media-upload-dialog'
import { cn } from "@/lib/utils"

export default function SellerProductForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])

    // Frequently Bought Search State
    const [openFreqBought, setOpenFreqBought] = useState(false)
    const [availableProducts, setAvailableProducts] = useState<any[]>([])
    const [selectedFreqBought, setSelectedFreqBought] = useState<any[]>([])

    // Form State
    const [formData, setFormData] = useState({
        // General
        name: '',
        status: 'active', // 'active' | 'draft' | 'unlisted'
        categoryId: '',
        brand: '',
        unit: '',
        weight: '',
        minPurchaseQty: '1',
        tags: '',
        barcode: '',
        description: '',
        refundable: true,
        featured: false,
        todaysDeal: false,
        flashDeal: false,

        // Files & Media
        thumbnail: '', // URL or base64
        images: [] as string[],
        videoProvider: 'youtube',
        videoLink: '',
        pdfSpecification: '',
        fileUrl: '',

        // Price & Stock
        price: '',
        compareAtPrice: '', // New
        costPerItem: '', // New
        chargeTax: false, // New

        // Unit Price
        showUnitPrice: false,
        unitPriceTotalAmount: '',
        unitPriceTotalUnit: 'g',
        unitPriceBaseAmount: '',
        unitPriceBaseUnit: 'kg',

        discount: '',
        discountType: 'flat',
        sku: '',
        stockQuantity: '',
        lowStockWarning: '',
        showStockQuantity: false,
        hideStock: false,
        cashOnDelivery: true,

        // Shipping
        isPhysicalProduct: false,
        freeShipping: false,
        estimateShippingTime: '',
        weightUnit: 'kg',
        countryOfOrigin: '',
        hsnCode: '',

        // SEO
        metaTitle: '',
        metaDescription: '',
        metaImage: '',

        // Advanced
        gstRate: '',
        warrantyPeriod: '',
        warrantyPolicy: '',

        // Variations
        hasColors: false,
        colors: [] as string[],
        attributes: [] as { name: string, values: string[] }[],

        frequentlyBought: [] as string[],
    })

    // Local state for adding colors/attributes
    const [colorInput, setColorInput] = useState('')

    // Add Package State
    const [openAddPackage, setOpenAddPackage] = useState(false)
    const [newPackageData, setNewPackageData] = useState({
        type: 'box', // box, envelope, soft
        length: '',
        width: '',
        height: '',
        unit: 'cm',
        weight: '',
        weightUnit: 'kg',
        name: '',
        isDefault: false
    })

    useEffect(() => {
        const loadData = async () => {
            const cats = await getAllCategories()
            setCategories(cats)

            // Load initial products for frequently bought
            const productsRes = await getMyProducts({ limit: 20 })
            setAvailableProducts(productsRes.products)
        }
        loadData()
    }, [])

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Color Handlers
    const addColor = () => {
        if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
            setFormData(prev => ({ ...prev, colors: [...prev.colors, colorInput.trim()] }))
            setColorInput('')
        }
    }
    const removeColor = (color: string) => {
        setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }))
    }

    // Attribute Handlers
    const addAttribute = () => {
        setFormData(prev => ({
            ...prev,
            attributes: [...prev.attributes, { name: '', values: [] }]
        }))
    }
    const removeAttribute = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attributes: prev.attributes.filter((_, i) => i !== index)
        }))
    }
    const updateAttributeName = (index: number, name: string) => {
        const newAttrs = [...formData.attributes]
        newAttrs[index].name = name
        setFormData(prev => ({ ...prev, attributes: newAttrs }))
    }
    const addAttributeValue = (index: number, value: string) => {
        if (value.trim()) {
            const newAttrs = [...formData.attributes]
            if (!newAttrs[index].values.includes(value.trim())) {
                newAttrs[index].values.push(value.trim())
                setFormData(prev => ({ ...prev, attributes: newAttrs }))
            }
        }
    }
    const removeAttributeValue = (attrIndex: number, valIndex: number) => {
        const newAttrs = [...formData.attributes]
        newAttrs[attrIndex].values = newAttrs[attrIndex].values.filter((_, i) => i !== valIndex)
        setFormData(prev => ({ ...prev, attributes: newAttrs }))
    }

    // Frequently Bought Handlers
    const toggleFreqBought = (product: any) => {
        const isSelected = selectedFreqBought.find(p => p.id === product.id)
        if (isSelected) {
            setSelectedFreqBought(prev => prev.filter(p => p.id !== product.id))
            setFormData(prev => ({ ...prev, frequentlyBought: prev.frequentlyBought.filter(id => id !== product.id) }))
        } else {
            setSelectedFreqBought(prev => [...prev, product])
            setFormData(prev => ({ ...prev, frequentlyBought: [...prev.frequentlyBought, product.id] }))
        }
    }

    const handleAddPackage = () => {
        // Here you would typically save the package to the backend or local list
        // For now, we'll just close the dialog and maybe select it (mock)
        console.log('Adding package:', newPackageData)
        setOpenAddPackage(false)
        toast.success('Package added successfully')
        // Reset form
        setNewPackageData({
            type: 'box',
            length: '',
            width: '',
            height: '',
            unit: 'cm',
            weight: '',
            weightUnit: 'kg',
            name: '',
            isDefault: false
        })
    }

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.categoryId) {
            toast.error('Please fill in all required fields (Name, Category, Price)')
            return
        }

        setLoading(true)
        try {
            // Prepare data for submission
            const submissionData = {
                ...formData,
                status: formData.status, // Ensure status is passed explicitly
                price: parseFloat(formData.price),
                weight: formData.weight ? parseFloat(formData.weight) : undefined,
                minPurchaseQty: parseInt(formData.minPurchaseQty) || 1,
                stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : 0,
                lowStockWarning: formData.lowStockWarning ? parseInt(formData.lowStockWarning) : undefined,
                discount: formData.discount ? parseFloat(formData.discount) : undefined,
                gstRate: formData.gstRate ? parseFloat(formData.gstRate) : undefined,
                // Ensure fileUrl is present if required by schema, even if dummy for physical
                fileUrl: formData.fileUrl || 'physical-product-placeholder',
                // Clean up variations if disabled
                colors: formData.hasColors ? formData.colors : [],
                attributes: [
                    ...formData.attributes.filter(a => a.name && a.values.length > 0),
                    // Add shipping attributes if physical
                    ...(formData.isPhysicalProduct ? [
                        { name: 'isPhysicalProduct', values: ['true'] },
                        { name: 'weightUnit', values: [formData.weightUnit] },
                        { name: 'countryOfOrigin', values: [formData.countryOfOrigin] }
                    ] : []),
                    // Add Price attributes
                    ...(formData.compareAtPrice ? [{ name: 'compareAtPrice', values: [formData.compareAtPrice] }] : []),
                    ...(formData.costPerItem ? [{ name: 'costPerItem', values: [formData.costPerItem] }] : []),
                    { name: 'chargeTax', values: [formData.chargeTax ? 'true' : 'false'] },
                    ...(formData.showUnitPrice ? [
                        { name: 'unitPriceTotalAmount', values: [formData.unitPriceTotalAmount] },
                        { name: 'unitPriceTotalUnit', values: [formData.unitPriceTotalUnit] },
                        { name: 'unitPriceBaseAmount', values: [formData.unitPriceBaseAmount] },
                        { name: 'unitPriceBaseUnit', values: [formData.unitPriceBaseUnit] }
                    ] : [])
                ],
            }

            const result = await createMyProduct(submissionData)
            if (result.success) {
                toast.success('Product created successfully')
                router.push('/seller/products/inventory')
            } else {
                toast.error(result.error || 'Failed to create product')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Add New Product</h2>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save & Publish
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <div className="flex flex-col md:flex-row gap-6">
                    <aside className="w-full md:w-64 shrink-0">
                        <TabsList className="flex flex-col h-auto items-stretch bg-transparent p-0 gap-1">
                            <TabsTrigger value="general" className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">General</TabsTrigger>
                            <TabsTrigger value="files" className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Files & Media</TabsTrigger>
                            <TabsTrigger value="price" className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Price & Stock</TabsTrigger>
                            <TabsTrigger value="variations" className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Variations</TabsTrigger>
                            <TabsTrigger value="shipping" className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Shipping</TabsTrigger>
                            <TabsTrigger value="seo" className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">SEO</TabsTrigger>
                            <TabsTrigger value="advanced" className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Advanced</TabsTrigger>
                        </TabsList>
                    </aside>

                    <div className="flex-1">
                        {/* General Tab */}
                        <TabsContent value="general" className="m-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Product Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label>Product Name *</Label>
                                                <Input
                                                    placeholder="Product Name"
                                                    value={formData.name}
                                                    onChange={(e) => handleChange('name', e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label>Brand</Label>
                                                    <Input
                                                        placeholder="Brand"
                                                        value={formData.brand}
                                                        onChange={(e) => handleChange('brand', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Unit</Label>
                                                    <Input
                                                        placeholder="Unit (e.g. KG, Pc)"
                                                        value={formData.unit}
                                                        onChange={(e) => handleChange('unit', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label>Weight (kg)</Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={formData.weight}
                                                        onChange={(e) => handleChange('weight', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Tags</Label>
                                                    <Input
                                                        placeholder="Tags (comma separated)"
                                                        value={formData.tags}
                                                        onChange={(e) => handleChange('tags', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Barcode</Label>
                                                <Input
                                                    placeholder="Barcode"
                                                    value={formData.barcode}
                                                    onChange={(e) => handleChange('barcode', e.target.value)}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Description</Label>
                                                <Textarea
                                                    placeholder="Product Description"
                                                    className="min-h-[150px]"
                                                    value={formData.description}
                                                    onChange={(e) => handleChange('description', e.target.value)}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Status</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                                                <SelectTrigger className="h-auto py-2">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active" className="py-3">
                                                        <div className="flex flex-col gap-1 text-left">
                                                            <span className="font-medium">Active</span>
                                                            <span className="text-xs text-muted-foreground">Sell via selected sales channels and markets</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="draft" className="py-3">
                                                        <div className="flex flex-col gap-1 text-left">
                                                            <span className="font-medium">Draft</span>
                                                            <span className="text-xs text-muted-foreground">Not visible on selected sales channels or markets</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="unlisted" className="py-3">
                                                        <div className="flex flex-col gap-1 text-left">
                                                            <span className="font-medium">Unlisted</span>
                                                            <span className="text-xs text-muted-foreground">Accessible only by direct link</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Status & Flags</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label>Featured</Label>
                                                <Switch checked={formData.featured} onCheckedChange={(c) => handleChange('featured', c)} />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Label>Today's Deal</Label>
                                                <Switch checked={formData.todaysDeal} onCheckedChange={(c) => handleChange('todaysDeal', c)} />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Label>Flash Deal</Label>
                                                <Switch checked={formData.flashDeal} onCheckedChange={(c) => handleChange('flashDeal', c)} />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Label>Refundable</Label>
                                                <Switch checked={formData.refundable} onCheckedChange={(c) => handleChange('refundable', c)} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Files & Media Tab */}
                        <TabsContent value="files" className="m-0 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Images</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Gallery Images</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-lg border overflow-hidden group">
                                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => handleChange('images', formData.images.filter((_, i) => i !== idx))}
                                                        className="absolute top-1 right-1 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <MediaUploadDialog
                                            title="Select Gallery Images"
                                            maxFiles={10}
                                            onSelect={(files) => {
                                                const urls = files.map(f => f.url).filter(Boolean)
                                                handleChange('images', [...formData.images, ...urls])
                                            }}
                                            trigger={
                                                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                                    <p className="text-sm text-muted-foreground">Browse or Drag & Drop</p>
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Thumbnail Image</Label>
                                        <MediaUploadDialog
                                            title="Select Thumbnail Image"
                                            maxFiles={1}
                                            onSelect={(files) => {
                                                if (files.length > 0) {
                                                    handleChange('thumbnail', files[0].url)
                                                }
                                            }}
                                            trigger={
                                                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[150px]">
                                                    {formData.thumbnail ? (
                                                        <div className="relative w-full h-full">
                                                            <img src={formData.thumbnail} alt="Thumbnail" className="mx-auto h-32 object-contain" />
                                                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                                <span className="bg-background px-2 py-1 rounded text-xs font-medium">Change</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                                            <p className="text-sm text-muted-foreground">Browse or Drag & Drop</p>
                                                        </>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </div>

                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Videos</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Video Provider</Label>
                                        <Select value={formData.videoProvider} onValueChange={(val) => handleChange('videoProvider', val)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="youtube">YouTube</SelectItem>
                                                <SelectItem value="dailymotion">DailyMotion</SelectItem>
                                                <SelectItem value="vimeo">Vimeo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Video Link</Label>
                                        <Input placeholder="Video Link" value={formData.videoLink} onChange={(e) => handleChange('videoLink', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>PDF Specification</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">Browse or Drag & Drop</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Price & Stock Tab */}
                        <TabsContent value="price" className="m-0 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Price</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label>Price</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">DZD</span>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                className="pl-12"
                                                value={formData.price}
                                                onChange={(e) => handleChange('price', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Collapsed/Expanded Toggle Header */}
                                        <div
                                            className="flex items-center justify-between cursor-pointer p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                                            onClick={() => setFormData(prev => ({ ...prev, showUnitPrice: !prev.showUnitPrice }))}
                                        >
                                            {!formData.showUnitPrice ? (
                                                <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                                                    {(formData.compareAtPrice || formData.unitPriceTotalAmount || formData.chargeTax || formData.costPerItem) ? (
                                                        <>
                                                            {formData.compareAtPrice && (
                                                                <span className="bg-background px-2 py-1 rounded border">
                                                                    Compare at <span className="font-medium text-foreground">DZD {formData.compareAtPrice}</span>
                                                                </span>
                                                            )}
                                                            {formData.unitPriceTotalAmount && formData.unitPriceBaseAmount && (
                                                                <span className="bg-background px-2 py-1 rounded border">
                                                                    Unit price <span className="font-medium text-foreground">DZD {(parseFloat(formData.price || '0') / parseFloat(formData.unitPriceTotalAmount)).toFixed(2)}/{formData.unitPriceTotalUnit}</span>
                                                                </span>
                                                            )}
                                                            {formData.chargeTax && (
                                                                <span className="bg-background px-2 py-1 rounded border">
                                                                    Charge tax <span className="font-medium text-foreground">Yes</span>
                                                                </span>
                                                            )}
                                                            {formData.costPerItem && (
                                                                <span className="bg-background px-2 py-1 rounded border">
                                                                    Cost per item <span className="font-medium text-foreground">DZD {formData.costPerItem}</span>
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span>Additional display prices</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <Label className="cursor-pointer">Additional display prices</Label>
                                            )}
                                            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                                        </div>

                                        {formData.showUnitPrice && (
                                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label>Compare-at price</Label>
                                                        </div>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">DZD</span>
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                className="pl-12"
                                                                value={formData.compareAtPrice}
                                                                onChange={(e) => handleChange('compareAtPrice', e.target.value)}
                                                            />
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-help" title="To show a reduced price, move the product's original price into Compare-at price. Enter a lower value into Price.">
                                                                <span className="text-xs border rounded-full w-4 h-4 flex items-center justify-center">?</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label>Unit price</Label>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button variant="outline" className="w-full justify-between text-muted-foreground font-normal">
                                                                    {formData.unitPriceTotalAmount && formData.unitPriceBaseAmount
                                                                        ? `DZD ${(parseFloat(formData.price || '0') / parseFloat(formData.unitPriceTotalAmount)).toFixed(2)}/${formData.unitPriceTotalUnit}`
                                                                        : '--'}
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-80">
                                                                <div className="grid gap-4">
                                                                    <div className="space-y-2">
                                                                        <h4 className="font-medium leading-none">Unit price</h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Calculated based on the product price and volume.
                                                                        </p>
                                                                    </div>
                                                                    <div className="grid gap-2">
                                                                        <Label>Total amount</Label>
                                                                        <div className="flex gap-2">
                                                                            <Input
                                                                                type="number"
                                                                                value={formData.unitPriceTotalAmount}
                                                                                onChange={(e) => handleChange('unitPriceTotalAmount', e.target.value)}
                                                                                placeholder="0"
                                                                            />
                                                                            <Select value={formData.unitPriceTotalUnit} onValueChange={(val) => handleChange('unitPriceTotalUnit', val)}>
                                                                                <SelectTrigger className="w-24">
                                                                                    <SelectValue />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="g">g</SelectItem>
                                                                                    <SelectItem value="kg">kg</SelectItem>
                                                                                    <SelectItem value="ml">ml</SelectItem>
                                                                                    <SelectItem value="l">l</SelectItem>
                                                                                    <SelectItem value="m">m</SelectItem>
                                                                                    <SelectItem value="cm">cm</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid gap-2">
                                                                        <Label>Base measure</Label>
                                                                        <div className="flex gap-2">
                                                                            <Input
                                                                                type="number"
                                                                                value={formData.unitPriceBaseAmount}
                                                                                onChange={(e) => handleChange('unitPriceBaseAmount', e.target.value)}
                                                                                placeholder="1"
                                                                            />
                                                                            <Select value={formData.unitPriceBaseUnit} onValueChange={(val) => handleChange('unitPriceBaseUnit', val)}>
                                                                                <SelectTrigger className="w-24">
                                                                                    <SelectValue />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="g">g</SelectItem>
                                                                                    <SelectItem value="kg">kg</SelectItem>
                                                                                    <SelectItem value="ml">ml</SelectItem>
                                                                                    <SelectItem value="l">l</SelectItem>
                                                                                    <SelectItem value="m">m</SelectItem>
                                                                                    <SelectItem value="cm">cm</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="charge-tax"
                                                        checked={formData.chargeTax}
                                                        onCheckedChange={(c) => handleChange('chargeTax', c)}
                                                    />
                                                    <Label htmlFor="charge-tax">Charge tax on this product</Label>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                                    <div className="grid gap-2">
                                                        <Label>Cost per item</Label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">DZD</span>
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                className="pl-12"
                                                                value={formData.costPerItem}
                                                                onChange={(e) => handleChange('costPerItem', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Profit</Label>
                                                        <div className="h-10 px-3 py-2 rounded-md border bg-muted/20 flex items-center text-sm">
                                                            {formData.price && formData.costPerItem
                                                                ? `DZD ${(parseFloat(formData.price) - parseFloat(formData.costPerItem)).toFixed(2)}`
                                                                : '--'}
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Margin</Label>
                                                        <div className="h-10 px-3 py-2 rounded-md border bg-muted/20 flex items-center text-sm">
                                                            {formData.price && formData.costPerItem && parseFloat(formData.price) > 0
                                                                ? `${(((parseFloat(formData.price) - parseFloat(formData.costPerItem)) / parseFloat(formData.price)) * 100).toFixed(0)}%`
                                                                : '--'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid gap-2 pt-4 border-t">
                                        <Label>SKU (Stock Keeping Unit)</Label>
                                        <Input placeholder="SKU" value={formData.sku} onChange={(e) => handleChange('sku', e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Quantity</Label>
                                            <Input type="number" placeholder="0" value={formData.stockQuantity} onChange={(e) => handleChange('stockQuantity', e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Min Purchase Qty</Label>
                                            <Input type="number" value={formData.minPurchaseQty} onChange={(e) => handleChange('minPurchaseQty', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Low Stock Quantity Warning</Label>
                                        <Input type="number" placeholder="1" value={formData.lowStockWarning} onChange={(e) => handleChange('lowStockWarning', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Stock Visibility</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Show Stock Quantity</Label>
                                        <Switch checked={formData.showStockQuantity} onCheckedChange={(c) => handleChange('showStockQuantity', c)} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label>Hide Stock</Label>
                                        <Switch checked={formData.hideStock} onCheckedChange={(c) => handleChange('hideStock', c)} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Cash On Delivery</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <Label>Status</Label>
                                        <Switch checked={formData.cashOnDelivery} onCheckedChange={(c) => handleChange('cashOnDelivery', c)} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Variations Tab */}
                        <TabsContent value="variations" className="m-0 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Variations</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Colors */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base">Colors</Label>
                                            <Switch checked={formData.hasColors} onCheckedChange={(c) => handleChange('hasColors', c)} />
                                        </div>
                                        {formData.hasColors && (
                                            <div className="space-y-2 p-4 border rounded-md bg-muted/20">
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Add color (e.g. Red, #FF0000)"
                                                        value={colorInput}
                                                        onChange={(e) => setColorInput(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault()
                                                                addColor()
                                                            }
                                                        }}
                                                    />
                                                    <Button onClick={addColor} type="button" size="icon" variant="secondary">
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {formData.colors.map((color, idx) => (
                                                        <Badge key={idx} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                                            {color}
                                                            <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeColor(color)} />
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Attributes */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base">Attributes</Label>
                                            <Button onClick={addAttribute} variant="outline" size="sm">
                                                <Plus className="h-4 w-4 mr-2" /> Add Attribute
                                            </Button>
                                        </div>
                                        {formData.attributes.map((attr, idx) => (
                                            <div key={idx} className="p-4 border rounded-md bg-muted/20 space-y-3 relative">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeAttribute(idx)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <div className="grid gap-2">
                                                    <Label>Attribute Name</Label>
                                                    <Input
                                                        placeholder="e.g. Size, Material"
                                                        value={attr.name}
                                                        onChange={(e) => updateAttributeName(idx, e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Values</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Add value (e.g. S, M, Cotton)"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault()
                                                                    addAttributeValue(idx, e.currentTarget.value)
                                                                    e.currentTarget.value = ''
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {attr.values.map((val, vIdx) => (
                                                            <Badge key={vIdx} variant="outline" className="pl-2 pr-1 py-1 flex items-center gap-1 bg-background">
                                                                {val}
                                                                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeAttributeValue(idx, vIdx)} />
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Shipping Tab */}
                        <TabsContent value="shipping" className="m-0 space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Shipping</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="physical-product">Physical product</Label>
                                            <Switch
                                                id="physical-product"
                                                checked={formData.isPhysicalProduct}
                                                onCheckedChange={(c) => handleChange('isPhysicalProduct', c)}
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                {formData.isPhysicalProduct && (
                                    <CardContent className="space-y-6">
                                        {/* Package Selection */}
                                        <div className="grid gap-2">
                                            <div className="flex items-center gap-2">
                                                <Label>Package</Label>
                                                <span className="text-muted-foreground text-xs">ⓘ</span>
                                            </div>
                                            <Select onValueChange={(val) => {
                                                if (val === 'add_new') {
                                                    setOpenAddPackage(true)
                                                }
                                            }}>
                                                <SelectTrigger className="h-12">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-muted p-1 rounded">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                                            </svg>
                                                        </div>
                                                        <div className="flex flex-col items-start text-sm">
                                                            <span className="font-medium">Sample box</span>
                                                            <span className="text-muted-foreground text-xs">22 × 13.7 × 4.2 cm, 0 kg</span>
                                                        </div>
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sample">
                                                        <div className="flex items-center gap-2">
                                                            <div className="bg-muted p-1 rounded">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                                                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                                                </svg>
                                                            </div>
                                                            <div className="flex flex-col items-start text-sm">
                                                                <span className="font-medium">Sample box</span>
                                                                <span className="text-muted-foreground text-xs">22 × 13.7 × 4.2 cm, 0 kg</span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                    <div className="p-2 border-t mt-1">
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full justify-start text-blue-600 h-8 px-2"
                                                            onClick={() => setOpenAddPackage(true)}
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" /> Add new package
                                                        </Button>
                                                        {/* Hidden item to allow selection via keyboard if needed, though button click is primary */}
                                                        <SelectItem value="add_new" className="hidden">Add new package</SelectItem>
                                                    </div>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Weight */}
                                        <div className="grid gap-2">
                                            <Label>Product weight</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="0.0"
                                                    value={formData.weight}
                                                    onChange={(e) => handleChange('weight', e.target.value)}
                                                />
                                                <Select value={formData.weightUnit} onValueChange={(val) => handleChange('weightUnit', val)}>
                                                    <SelectTrigger className="w-24">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="kg">kg</SelectItem>
                                                        <SelectItem value="lb">lb</SelectItem>
                                                        <SelectItem value="oz">oz</SelectItem>
                                                        <SelectItem value="g">g</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Customs Information */}
                                        <div className="space-y-4 pt-4 border-t">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-base font-semibold">Customs information</Label>
                                            </div>

                                            <div className="grid gap-4 p-4 bg-muted/20 rounded-lg">
                                                <div className="grid gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Label>Country/Region of origin</Label>
                                                        <span className="text-muted-foreground text-xs">ⓘ</span>
                                                    </div>
                                                    <Select value={formData.countryOfOrigin} onValueChange={(val) => handleChange('countryOfOrigin', val)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="US">United States</SelectItem>
                                                            <SelectItem value="CN">China</SelectItem>
                                                            <SelectItem value="IN">India</SelectItem>
                                                            <SelectItem value="UK">United Kingdom</SelectItem>
                                                            <SelectItem value="CA">Canada</SelectItem>
                                                            {/* Add more as needed */}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Label>Harmonized System (HS) code</Label>
                                                            <span className="text-muted-foreground text-xs">ⓘ</span>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    <span>Add HS codes by country/region</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Download className="mr-2 h-4 w-4" />
                                                                    <span>Export with CSV</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <FileDown className="mr-2 h-4 w-4" />
                                                                    <span>Import with CSV</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <Input
                                                        placeholder="Enter a 6-digit code or search by keyword"
                                                        value={formData.hsnCode}
                                                        onChange={(e) => handleChange('hsnCode', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t">
                                            <Label>Free Shipping</Label>
                                            <Switch checked={formData.freeShipping} onCheckedChange={(c) => handleChange('freeShipping', c)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Estimate Shipping Time (Days)</Label>
                                            <Input placeholder="e.g. 3-5" value={formData.estimateShippingTime} onChange={(e) => handleChange('estimateShippingTime', e.target.value)} />
                                        </div>
                                    </CardContent>
                                )}
                                {!formData.isPhysicalProduct && (
                                    <CardContent className="py-10 text-center text-muted-foreground">
                                        <p>Enable "Physical product" to configure shipping options.</p>
                                    </CardContent>
                                )}
                            </Card>
                        </TabsContent>

                        {/* SEO Tab */}
                        <TabsContent value="seo" className="m-0 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>SEO Meta Tags</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Meta Title</Label>
                                        <Input placeholder="Meta Title" value={formData.metaTitle} onChange={(e) => handleChange('metaTitle', e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Description</Label>
                                        <Textarea placeholder="Meta Description" value={formData.metaDescription} onChange={(e) => handleChange('metaDescription', e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Meta Image</Label>
                                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">Browse or Drag & Drop</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Advanced Tab */}
                        <TabsContent value="advanced" className="m-0 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>HSN & GST</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>HSN Code</Label>
                                        <Input
                                            placeholder="HSN Code"
                                            value={formData.hsnCode}
                                            onChange={(e) => handleChange('hsnCode', e.target.value)}
                                            className="bg-muted/50"
                                            readOnly
                                            title="Manage in Shipping tab"
                                        />
                                        <p className="text-xs text-muted-foreground">Manage in Shipping tab</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>GST Rate (%)</Label>
                                        <Input type="number" placeholder="0" value={formData.gstRate} onChange={(e) => handleChange('gstRate', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Warranty</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Warranty Period</Label>
                                        <Input placeholder="e.g. 1 Year" value={formData.warrantyPeriod} onChange={(e) => handleChange('warrantyPeriod', e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Warranty Policy</Label>
                                        <Textarea placeholder="Warranty Policy" value={formData.warrantyPolicy} onChange={(e) => handleChange('warrantyPolicy', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Frequently Bought</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Select Products</Label>
                                        <Popover open={openFreqBought} onOpenChange={setOpenFreqBought}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" role="combobox" aria-expanded={openFreqBought} className="w-full justify-between">
                                                    Add Product...
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search products..." />
                                                    <CommandList>
                                                        <CommandEmpty>No product found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {availableProducts.map((product) => (
                                                                <CommandItem
                                                                    key={product.id}
                                                                    value={product.name}
                                                                    onSelect={() => {
                                                                        toggleFreqBought(product)
                                                                        setOpenFreqBought(false)
                                                                    }}
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4", selectedFreqBought.find(p => p.id === product.id) ? "opacity-100" : "opacity-0")} />
                                                                    {product.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>

                                        <div className="space-y-2 mt-2">
                                            {selectedFreqBought.map((product) => (
                                                <div key={product.id} className="flex items-center justify-between p-2 border rounded-md bg-muted/20">
                                                    <span className="text-sm font-medium truncate">{product.name}</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => toggleFreqBought(product)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </div>
            </Tabs >

            <Dialog open={openAddPackage} onOpenChange={setOpenAddPackage}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add package</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label>Package type</Label>
                            <div className="grid grid-cols-3 gap-4">
                                <div
                                    className={cn(
                                        "cursor-pointer rounded-lg border-2 p-4 hover:bg-muted/50 flex items-center gap-2 transition-all",
                                        newPackageData.type === 'box' ? "border-primary bg-primary/5" : "border-muted"
                                    )}
                                    onClick={() => setNewPackageData(prev => ({ ...prev, type: 'box' }))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={newPackageData.type === 'box' ? "text-primary" : "text-muted-foreground"}>
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                    </svg>
                                    <span className="font-medium text-sm">Box</span>
                                </div>
                                <div
                                    className={cn(
                                        "cursor-pointer rounded-lg border-2 p-4 hover:bg-muted/50 flex items-center gap-2 transition-all",
                                        newPackageData.type === 'envelope' ? "border-primary bg-primary/5" : "border-muted"
                                    )}
                                    onClick={() => setNewPackageData(prev => ({ ...prev, type: 'envelope' }))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={newPackageData.type === 'envelope' ? "text-primary" : "text-muted-foreground"}>
                                        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                                        <path d="m2 5 10 7 10-7"></path>
                                    </svg>
                                    <span className="font-medium text-sm">Envelope</span>
                                </div>
                                <div
                                    className={cn(
                                        "cursor-pointer rounded-lg border-2 p-4 hover:bg-muted/50 flex items-center gap-2 transition-all",
                                        newPackageData.type === 'soft' ? "border-primary bg-primary/5" : "border-muted"
                                    )}
                                    onClick={() => setNewPackageData(prev => ({ ...prev, type: 'soft' }))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={newPackageData.type === 'soft' ? "text-primary" : "text-muted-foreground"}>
                                        <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path>
                                    </svg>
                                    <span className="font-medium text-sm">Soft package</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="grid gap-2">
                                <Label>Length</Label>
                                <Input
                                    placeholder="0"
                                    value={newPackageData.length}
                                    onChange={(e) => setNewPackageData(prev => ({ ...prev, length: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Width</Label>
                                <Input
                                    placeholder="0"
                                    value={newPackageData.width}
                                    onChange={(e) => setNewPackageData(prev => ({ ...prev, width: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Height</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="0"
                                        value={newPackageData.height}
                                        onChange={(e) => setNewPackageData(prev => ({ ...prev, height: e.target.value }))}
                                    />
                                    <Select value={newPackageData.unit} onValueChange={(val) => setNewPackageData(prev => ({ ...prev, unit: val }))}>
                                        <SelectTrigger className="w-20 px-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cm">cm</SelectItem>
                                            <SelectItem value="in">in</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Weight (empty)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="0"
                                        value={newPackageData.weight}
                                        onChange={(e) => setNewPackageData(prev => ({ ...prev, weight: e.target.value }))}
                                    />
                                    <Select value={newPackageData.weightUnit} onValueChange={(val) => setNewPackageData(prev => ({ ...prev, weightUnit: val }))}>
                                        <SelectTrigger className="w-20 px-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">kg</SelectItem>
                                            <SelectItem value="lb">lb</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Package name</Label>
                            <Input
                                placeholder="e.g. Small Box"
                                value={newPackageData.name}
                                onChange={(e) => setNewPackageData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="default-package"
                                checked={newPackageData.isDefault}
                                onCheckedChange={(c) => setNewPackageData(prev => ({ ...prev, isDefault: c }))}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="default-package" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Use as default package
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Used to calculate rates at checkout and pre-selected when buying labels
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenAddPackage(false)}>Cancel</Button>
                        <Button onClick={handleAddPackage}>Add package</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}
