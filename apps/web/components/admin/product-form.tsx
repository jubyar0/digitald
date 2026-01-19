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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { createProductByAdmin, getAllCategories, getAllVendors } from '@/actions/admin'
import { toast } from 'sonner'
import { Loader2, Upload, Plus, X } from 'lucide-react'

export default function ProductForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const [vendors, setVendors] = useState<any[]>([])

    // Form State
    const [formData, setFormData] = useState({
        // General
        name: '',
        categoryId: '',
        vendorId: '',
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

        // Price & Stock
        price: '',
        discount: '',
        discountType: 'flat',
        sku: '',
        stockQuantity: '',
        lowStockWarning: '',
        showStockQuantity: false,
        hideStock: false,
        cashOnDelivery: true,

        // Shipping
        freeShipping: false,
        estimateShippingTime: '',

        // SEO
        metaTitle: '',
        metaDescription: '',
        metaImage: '',
    })

    useEffect(() => {
        const loadData = async () => {
            const [cats, vends] = await Promise.all([
                getAllCategories(),
                getAllVendors()
            ])
            setCategories(cats)
            setVendors(vends)
        }
        loadData()
    }, [])

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.categoryId || !formData.vendorId) {
            toast.error('Please fill in all required fields (Name, Category, Vendor, Price)')
            return
        }

        setLoading(true)
        try {
            const result = await createProductByAdmin(formData)
            if (result.success) {
                toast.success('Product created successfully')
                router.push('/admin/products')
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
        <div className="flex flex-col gap-6">
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
                            <TabsTrigger value="seo" className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">SEO</TabsTrigger>
                            <TabsTrigger value="shipping" className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Shipping</TabsTrigger>
                        </TabsList>
                    </aside>

                    <div className="flex-1">
                        {/* General Tab */}
                        <TabsContent value="general" className="m-0 space-y-6">
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="font-semibold text-lg">Product Information</h3>

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
                                            <Label>Category *</Label>
                                            <Select
                                                value={formData.categoryId}
                                                onValueChange={(val) => handleChange('categoryId', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((cat: any) => (
                                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Vendor *</Label>
                                            <Select
                                                value={formData.vendorId}
                                                onValueChange={(val) => handleChange('vendorId', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Vendor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {vendors.map((v: any) => (
                                                        <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Brand</Label>
                                            <Input
                                                placeholder="Select Brand"
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
                                            <Label>Weight (in kg)</Label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={formData.weight}
                                                onChange={(e) => handleChange('weight', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Minimum Purchase Qty *</Label>
                                            <Input
                                                type="number"
                                                value={formData.minPurchaseQty}
                                                onChange={(e) => handleChange('minPurchaseQty', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Tags</Label>
                                        <Input
                                            placeholder="Type and hit enter to add a tag"
                                            value={formData.tags}
                                            onChange={(e) => handleChange('tags', e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">This is used for search. Input tags separated by commas.</p>
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

                                    <div className="flex items-center justify-between border-t pt-4">
                                        <div className="space-y-0.5">
                                            <Label>Refundable?</Label>
                                        </div>
                                        <Switch
                                            checked={formData.refundable}
                                            onCheckedChange={(checked) => handleChange('refundable', checked)}
                                        />
                                    </div>

                                    <div className="space-y-4 border-t pt-4">
                                        <h4 className="font-medium">Status</h4>
                                        <div className="flex items-center justify-between">
                                            <Label>Featured</Label>
                                            <Switch
                                                checked={formData.featured}
                                                onCheckedChange={(checked) => handleChange('featured', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label>Today's Deal</Label>
                                            <Switch
                                                checked={formData.todaysDeal}
                                                onCheckedChange={(checked) => handleChange('todaysDeal', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label>Flash Deal</Label>
                                            <Switch
                                                checked={formData.flashDeal}
                                                onCheckedChange={(checked) => handleChange('flashDeal', checked)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Files & Media Tab */}
                        <TabsContent value="files" className="m-0 space-y-6">
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="font-semibold text-lg">Product Files & Media</h3>

                                    <div className="grid gap-2">
                                        <Label>Gallery Images</Label>
                                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">Browse or Drag & Drop</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Thumbnail Image</Label>
                                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">Browse or Drag & Drop</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Video Provider</Label>
                                        <Select
                                            value={formData.videoProvider}
                                            onValueChange={(val) => handleChange('videoProvider', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="youtube">YouTube</SelectItem>
                                                <SelectItem value="dailymotion">DailyMotion</SelectItem>
                                                <SelectItem value="vimeo">Vimeo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Video Link</Label>
                                        <Input
                                            placeholder="Video Link"
                                            value={formData.videoLink}
                                            onChange={(e) => handleChange('videoLink', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>PDF Specification</Label>
                                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">Browse or Drag & Drop</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Price & Stock Tab */}
                        <TabsContent value="price" className="m-0 space-y-6">
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="font-semibold text-lg">Product Price + Stock</h3>

                                    <div className="grid gap-2">
                                        <Label>Unit Price *</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={formData.price}
                                            onChange={(e) => handleChange('price', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Discount</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={formData.discount}
                                                onChange={(e) => handleChange('discount', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Discount Type</Label>
                                            <Select
                                                value={formData.discountType}
                                                onValueChange={(val) => handleChange('discountType', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="flat">Flat</SelectItem>
                                                    <SelectItem value="percent">Percent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>SKU</Label>
                                        <Input
                                            placeholder="SKU"
                                            value={formData.sku}
                                            onChange={(e) => handleChange('sku', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Quantity</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={formData.stockQuantity}
                                                onChange={(e) => handleChange('stockQuantity', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Low Stock Quantity Warning</Label>
                                            <Input
                                                type="number"
                                                placeholder="1"
                                                value={formData.lowStockWarning}
                                                onChange={(e) => handleChange('lowStockWarning', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t pt-4">
                                        <h4 className="font-medium">Stock Visibility State</h4>
                                        <div className="flex items-center justify-between">
                                            <Label>Show Stock Quantity</Label>
                                            <Switch
                                                checked={formData.showStockQuantity}
                                                onCheckedChange={(checked) => handleChange('showStockQuantity', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label>Hide Stock</Label>
                                            <Switch
                                                checked={formData.hideStock}
                                                onCheckedChange={(checked) => handleChange('hideStock', checked)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* SEO Tab */}
                        <TabsContent value="seo" className="m-0 space-y-6">
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="font-semibold text-lg">SEO Meta Tags</h3>

                                    <div className="grid gap-2">
                                        <Label>Meta Title</Label>
                                        <Input
                                            placeholder="Meta Title"
                                            value={formData.metaTitle}
                                            onChange={(e) => handleChange('metaTitle', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            placeholder="Meta Description"
                                            value={formData.metaDescription}
                                            onChange={(e) => handleChange('metaDescription', e.target.value)}
                                        />
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

                        {/* Shipping Tab */}
                        <TabsContent value="shipping" className="m-0 space-y-6">
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="font-semibold text-lg">Shipping Configuration</h3>

                                    <div className="flex items-center justify-between">
                                        <Label>Free Shipping</Label>
                                        <Switch
                                            checked={formData.freeShipping}
                                            onCheckedChange={(checked) => handleChange('freeShipping', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Label>Cash On Delivery</Label>
                                        <Switch
                                            checked={formData.cashOnDelivery}
                                            onCheckedChange={(checked) => handleChange('cashOnDelivery', checked)}
                                        />
                                    </div>

                                    <div className="grid gap-2 mt-4">
                                        <Label>Estimate Shipping Time</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Shipping Days"
                                                value={formData.estimateShippingTime}
                                                onChange={(e) => handleChange('estimateShippingTime', e.target.value)}
                                            />
                                            <div className="flex items-center justify-center px-3 bg-muted rounded-md border text-sm text-muted-foreground">
                                                Days
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}
