'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { createDigitalProductByAdmin, getAllCategories, getProducts } from '@/actions/admin'
import { toast } from 'sonner'
import { Loader2, Plus, X, Upload, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Strikethrough, Link2, TableIcon, Image as ImageIcon, Video, Code, Undo, Redo, Highlighter } from 'lucide-react'

export interface Category {
    id: string
    name: string
    parentId?: string | null
    children?: Category[]
}

export interface Product {
    id: string
    name: string
}

interface DigitalProductFormProps {
    initialCategories: Category[]
    initialProducts: Product[]
}

export default function DigitalProductForm({ initialCategories, initialProducts }: DigitalProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>(initialCategories)
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const mainImageRef = useRef<HTMLInputElement>(null)
    const thumbnailRef = useRef<HTMLInputElement>(null)
    const metaImageRef = useRef<HTMLInputElement>(null)

    // Form State
    const [formData, setFormData] = useState({
        // General
        name: '',
        productFile: null as File | null,
        productFileName: '',
        tags: '',

        // Images
        mainImages: [] as File[],
        thumbnailImage: null as File | null,

        // Meta Tags
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        metaImage: null as File | null,

        // Price
        unitPrice: '',
        hsnCode: '',
        gstRate: '',
        discountStartDate: '',
        discountEndDate: '',
        discount: '',
        discountType: 'Flat',

        // Product Information
        description: '',

        // Frequently Bought
        frequentlyBoughtType: 'product' as 'product' | 'category',
        frequentlyBoughtItems: [] as string[],

        // Category
        selectedCategories: [] as string[],
    })

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleFileChange = (field: string, files: FileList | null) => {
        if (!files || files.length === 0) return

        if (field === 'mainImages') {
            handleChange('mainImages', [...formData.mainImages, ...Array.from(files)])
        } else if (field === 'productFile') {
            handleChange('productFile', files[0])
            handleChange('productFileName', files[0].name)
        } else {
            handleChange(field, files[0])
        }
    }

    const removeMainImage = (index: number) => {
        const newImages = [...formData.mainImages]
        newImages.splice(index, 1)
        handleChange('mainImages', newImages)
    }

    const handleCategoryToggle = (categoryId: string) => {
        const newCategories = formData.selectedCategories.includes(categoryId)
            ? formData.selectedCategories.filter(id => id !== categoryId)
            : [...formData.selectedCategories, categoryId]
        handleChange('selectedCategories', newCategories)
    }

    const addFrequentlyBought = () => {
        handleChange('frequentlyBoughtItems', [...formData.frequentlyBoughtItems, ''])
    }

    const removeFrequentlyBought = (index: number) => {
        const newItems = [...formData.frequentlyBoughtItems]
        newItems.splice(index, 1)
        handleChange('frequentlyBoughtItems', newItems)
    }

    const updateFrequentlyBought = (index: number, value: string) => {
        const newItems = [...formData.frequentlyBoughtItems]
        newItems[index] = value
        handleChange('frequentlyBoughtItems', newItems)
    }

    const clearForm = () => {
        setFormData({
            name: '',
            productFile: null,
            productFileName: '',
            tags: '',
            mainImages: [],
            thumbnailImage: null,
            metaTitle: '',
            metaDescription: '',
            keywords: '',
            metaImage: null,
            unitPrice: '',
            hsnCode: '',
            gstRate: '',
            discountStartDate: '',
            discountEndDate: '',
            discount: '',
            discountType: 'Flat',
            description: '',
            frequentlyBoughtType: 'product',
            frequentlyBoughtItems: [],
            selectedCategories: [],
        })
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        if (!formData.name || !formData.unitPrice) {
            toast.error('Please fill in all required fields (Product Name, Unit Price)')
            return
        }

        if (formData.selectedCategories.length === 0) {
            toast.error('Please select at least one category')
            return
        }

        setLoading(true)
        try {
            const submitData = {
                name: formData.name,
                price: formData.unitPrice,
                categoryId: formData.selectedCategories[0],
                tags: formData.tags,
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                keywords: formData.keywords,
                hsnCode: formData.hsnCode,
                gstRate: formData.gstRate,
                discount: formData.discount,
                discountType: formData.discountType,
                discountStartDate: formData.discountStartDate,
                discountEndDate: formData.discountEndDate,
                description: formData.description,
                isDigital: true,
            }

            const result = await createDigitalProductByAdmin(submitData)
            if (result.success) {
                toast.success('Digital product created successfully')
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Add New Digital Product</h1>
                <button
                    onClick={clearForm}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                >
                    Clear Template
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-6">
                {/* Left Column - Main Form */}
                <div className="flex-1 space-y-6">
                    {/* General Section */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-medium text-gray-700">General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="name" className="text-sm text-gray-600">Product Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Product Name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className=""
                                />
                            </div>

                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="productFile" className="text-sm text-gray-600">Product File</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        className="bg-blue-500 hover:bg-blue-600"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Browse
                                    </Button>
                                    <Input
                                        id="productFile"
                                        name="productFile"
                                        readOnly
                                        placeholder="Choose file"
                                        value={formData.productFileName}
                                        className="flex-1"
                                    />
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleFileChange('productFile', e.target.files)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="tags" className="text-sm text-gray-600">Tags</Label>
                                <Input
                                    id="tags"
                                    name="tags"
                                    placeholder="Type to add a tag"
                                    value={formData.tags}
                                    onChange={(e) => handleChange('tags', e.target.value)}
                                    className=""
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images Section */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-medium text-gray-700">Images</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="mainImages" className="text-sm text-gray-600">Main Images</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        className="bg-blue-500 hover:bg-blue-600"
                                        onClick={() => mainImageRef.current?.click()}
                                    >
                                        Browse
                                    </Button>
                                    <Input
                                        id="mainImages"
                                        name="mainImages"
                                        readOnly
                                        placeholder="Choose file"
                                        value={formData.mainImages.map(f => f.name).join(', ')}
                                        className="flex-1"
                                    />
                                    <input
                                        ref={mainImageRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange('mainImages', e.target.files)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="thumbnailImage" className="text-sm text-gray-600">Thumbnail Image <span className="text-xs text-gray-400">(48x63)</span></Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        className="bg-blue-500 hover:bg-blue-600"
                                        onClick={() => thumbnailRef.current?.click()}
                                    >
                                        Browse
                                    </Button>
                                    <Input
                                        id="thumbnailImage"
                                        name="thumbnailImage"
                                        readOnly
                                        placeholder="Choose file"
                                        value={formData.thumbnailImage?.name || ''}
                                        className="flex-1"
                                    />
                                    <input
                                        ref={thumbnailRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange('thumbnailImage', e.target.files)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Meta Tags Section */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-medium text-gray-700">Meta Tags</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="metaTitle" className="text-sm text-gray-600">Meta Title</Label>
                                <Input
                                    id="metaTitle"
                                    name="metaTitle"
                                    placeholder="Meta Title"
                                    value={formData.metaTitle}
                                    onChange={(e) => handleChange('metaTitle', e.target.value)}
                                    className=""
                                />
                            </div>

                            <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                                <Label htmlFor="metaDescription" className="text-sm text-gray-600 pt-2">Description</Label>
                                <Textarea
                                    id="metaDescription"
                                    name="metaDescription"
                                    placeholder=""
                                    value={formData.metaDescription}
                                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                                    className="min-h-[80px] resize-y"
                                />
                            </div>

                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="keywords" className="text-sm text-gray-600">Keywords</Label>
                                <div>
                                    <Input
                                        id="keywords"
                                        name="keywords"
                                        placeholder="Keyword, Keyword"
                                        value={formData.keywords}
                                        onChange={(e) => handleChange('keywords', e.target.value)}
                                        className=""
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Separate with coma</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="metaImage" className="text-sm text-gray-600">Meta Image</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        className="bg-blue-500 hover:bg-blue-600"
                                        onClick={() => metaImageRef.current?.click()}
                                    >
                                        Browse
                                    </Button>
                                    <Input
                                        id="metaImage"
                                        name="metaImage"
                                        readOnly
                                        placeholder="Choose file"
                                        value={formData.metaImage?.name || ''}
                                        className="flex-1"
                                    />
                                    <input
                                        ref={metaImageRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange('metaImage', e.target.files)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Price Section */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-medium text-gray-700">Price</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="unitPrice" className="text-sm text-gray-600">Unit price <span className="text-red-500">*</span></Label>
                                <Input
                                    id="unitPrice"
                                    name="unitPrice"
                                    type="number"
                                    placeholder="0"
                                    value={formData.unitPrice}
                                    onChange={(e) => handleChange('unitPrice', e.target.value)}
                                    className=""
                                />
                            </div>

                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="hsnCode" className="text-sm text-gray-600">HSN Code</Label>
                                <Input
                                    id="hsnCode"
                                    name="hsnCode"
                                    placeholder="HSN Code"
                                    value={formData.hsnCode}
                                    onChange={(e) => handleChange('hsnCode', e.target.value)}
                                    className=""
                                />
                            </div>

                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="gstRate" className="text-sm text-gray-600">GST Rate (%)</Label>
                                <Input
                                    id="gstRate"
                                    name="gstRate"
                                    type="number"
                                    placeholder="0"
                                    value={formData.gstRate}
                                    onChange={(e) => handleChange('gstRate', e.target.value)}
                                    className=""
                                />
                            </div>

                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="discountDateRange" className="text-sm text-gray-600">Discount Date Range</Label>
                                <Input
                                    id="discountDateRange"
                                    name="discountDateRange"
                                    type="text"
                                    placeholder="Select Date"
                                    value={formData.discountStartDate && formData.discountEndDate
                                        ? `${formData.discountStartDate} - ${formData.discountEndDate}`
                                        : ''}
                                    onChange={(e) => { }}
                                    className=""
                                />
                            </div>

                            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                <Label htmlFor="discount" className="text-sm text-gray-600">Discount</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="discount"
                                        name="discount"
                                        type="number"
                                        placeholder="0"
                                        value={formData.discount}
                                        onChange={(e) => handleChange('discount', e.target.value)}
                                        className="flex-1"
                                    />
                                    <Select
                                        value={formData.discountType}
                                        onValueChange={(val) => handleChange('discountType', val)}
                                        name="discountType"
                                    >
                                        <SelectTrigger className="w-32" id="discountType">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Flat">Flat</SelectItem>
                                            <SelectItem value="Percent">%</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Information Section */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-medium text-gray-700">Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                                <Label className="text-sm text-gray-600 pt-2">Description</Label>
                                <div className="border rounded-md overflow-hidden">
                                    {/* Rich Text Toolbar */}
                                    <div className="flex flex-wrap items-center gap-1 p-2 border-b">
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><Bold className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><Underline className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><Italic className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><Strikethrough className="w-4 h-4" /></button>
                                        <div className="w-px h-5 bg-gray-300 mx-1" />
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><List className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><ListOrdered className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><AlignLeft className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><AlignCenter className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><AlignRight className="w-4 h-4" /></button>
                                        <div className="w-px h-5 bg-gray-300 mx-1" />
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><Highlighter className="w-4 h-4" /></button>
                                        <div className="w-6 h-6 bg-yellow-400 rounded cursor-pointer" />
                                        <div className="w-px h-5 bg-gray-300 mx-1" />
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><TableIcon className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><Code className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><ImageIcon className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><Video className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><Link2 className="w-4 h-4" /></button>
                                        <div className="w-px h-5 bg-gray-300 mx-1" />
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><Undo className="w-4 h-4" /></button>
                                        <button type="button" className="p-1.5 hover:bg-gray-200 rounded"><Redo className="w-4 h-4" /></button>
                                    </div>
                                    {/* Editor Area */}
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder=""
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        className="border-0 min-h-[200px] resize-y rounded-none focus-visible:ring-0"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Frequently Bought Section */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-medium text-gray-700">Frequently Bought</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <RadioGroup
                                value={formData.frequentlyBoughtType}
                                onValueChange={(val) => handleChange('frequentlyBoughtType', val as 'product' | 'category')}
                                className="flex gap-4"
                                name="frequentlyBoughtType"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="product" id="select-product" />
                                    <Label htmlFor="select-product" className="text-sm text-red-500 font-normal cursor-pointer">Select Product</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="category" id="select-category" />
                                    <Label htmlFor="select-category" className="text-sm text-gray-600 font-normal cursor-pointer">Select Category</Label>
                                </div>
                            </RadioGroup>

                            {formData.frequentlyBoughtItems.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <Select
                                        value={item}
                                        onValueChange={(val) => updateFrequentlyBought(index, val)}
                                    >
                                        <SelectTrigger className="bg-gray-50 flex-1">
                                            <SelectValue placeholder={formData.frequentlyBoughtType === 'product' ? 'Select Product' : 'Select Category'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {formData.frequentlyBoughtType === 'product'
                                                ? products.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                ))
                                                : categories.map(c => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFrequentlyBought(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="ghost"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={addFrequentlyBought}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add More
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Category Sidebar */}
                <div className="w-80 shrink-0">
                    <Card className="sticky top-4">
                        <CardHeader className="pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-medium text-gray-700">Product category</CardTitle>
                            <button type="button" className="text-blue-500 text-sm">Select Main ✓</button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {categories.map(category => (
                                    <div key={category.id} className="flex items-center gap-3">
                                        <Checkbox
                                            id={`cat-${category.id}`}
                                            name="selectedCategories"
                                            checked={formData.selectedCategories.includes(category.id)}
                                            onCheckedChange={() => handleCategoryToggle(category.id)}
                                        />
                                        <Label
                                            htmlFor={`cat-${category.id}`}
                                            className="text-sm text-gray-600 font-normal cursor-pointer"
                                        >
                                            {category.name}
                                        </Label>
                                    </div>
                                ))}
                                {categories.length === 0 && (
                                    <p className="text-sm text-gray-400">No categories available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end pt-4 border-t">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Product
                    </Button>
                </div>
            </form >
        </div >
    )
}
