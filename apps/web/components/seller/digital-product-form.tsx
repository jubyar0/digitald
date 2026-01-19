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
import { createMyProduct, getMyProducts } from '@/actions/vendor-products'
import { getAllCategories } from '@/actions/admin'
import { toast } from 'sonner'
import { Loader2, Upload, Plus, X, Check, ChevronsUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { cn } from "@/lib/utils"

// Define enum locally to avoid importing server-side dependencies if needed, 
// but here we are in a component that might be used in a page that is client-side.
// However, importing from @repo/database in client components can be tricky if it pulls in server code.
// Let's try to use the import first, if it fails we'll use a local enum or string.
// Actually, to be safe and consistent with previous fix:
enum LocalCategoryType {
    PHYSICAL = 'PHYSICAL',
    DIGITAL = 'DIGITAL',
    MIXED = 'MIXED'
}

export default function DigitalProductForm() {
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
        categoryId: '',
        tags: '',
        fileUrl: '', // For "Product File"

        // Images
        thumbnail: '',
        images: [] as string[],

        // Meta Tags
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '', // "Keywords" in design
        metaImage: '',

        // Price
        price: '',
        hsnCode: '',
        gstRate: '',
        discountDateRange: '', // Placeholder for now
        discount: '',
        discountType: 'flat',

        // Product Information
        description: '', // Rich text editor placeholder

        // Frequently Bought
        frequentlyBought: [] as string[],

        // Digital Product Type
        digitalProductType: 'software', // Default

        // Specific Fields
        version: '',
        osCompatibility: '',
        licenseType: '',
        polygonCount: '',
        verticesCount: '',
        isAnimated: false,
        isRigged: false,
        fileFormat: '',
        resolution: '',
        mapsIncluded: '',
        timeOfDay: '',
        serviceType: '',
        duration: '',
        platform: '',
        value: '',
        region: '',
    })

    useEffect(() => {
        const loadData = async () => {
            const cats = await getAllCategories()
            // Filter for digital categories if possible, or just show all
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

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.categoryId) {
            toast.error('Please fill in all required fields (Name, Category, Price)')
            return
        }

        setLoading(true)
        try {
            // Prepare data for submission
            const submissionData = {
                name: formData.name,
                categoryId: formData.categoryId,
                price: parseFloat(formData.price),
                description: formData.description,
                tags: formData.tags,

                // Defaults
                minPurchaseQty: 1,
                stockQuantity: 999999,
                showStockQuantity: false,
                hideStock: true,
                cashOnDelivery: false,
                refundable: false,

                // Specific fields
                hsnCode: formData.hsnCode,
                gstRate: formData.gstRate ? parseFloat(formData.gstRate) : undefined,
                discount: formData.discount ? parseFloat(formData.discount) : undefined,
                discountType: formData.discountType,

                // Meta
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                metaKeywords: formData.metaKeywords,

                // Files
                fileUrl: formData.fileUrl,

                // Attributes
                attributes: {
                    discountDateRange: formData.discountDateRange
                },

                // Frequently Bought
                frequentlyBought: formData.frequentlyBought,

                // Digital/3D Specific
                currentVersion: formData.version,
                polygonCount: formData.polygonCount ? parseInt(formData.polygonCount) : undefined,
                verticesCount: formData.verticesCount ? parseInt(formData.verticesCount) : undefined,
                isAnimated: formData.isAnimated,
                isRigged: formData.isRigged,
                softwareCompatibility: formData.osCompatibility,
                licenseType: formData.licenseType,
                fileFormat: formData.fileFormat,

                // Dynamic Attributes
                resolution: formData.resolution,
                mapsIncluded: formData.mapsIncluded,
                timeOfDay: formData.timeOfDay,
                serviceType: formData.serviceType,
                duration: formData.duration,
                platform: formData.platform,
                value: formData.value,
                region: formData.region,
            }

            const result = await createMyProduct(submissionData as any)
            if (result.success) {
                toast.success('Digital Product created successfully')
                router.push('/seller/products/digital')
            } else {
                toast.error(result.error || 'Failed to create product')
            }
        } catch (error) {
            console.error(error)
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Add Your Product</h2>
                <div className="flex gap-2">
                    {/* "Clear Template" button from design? */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* General */}
                    <Card>
                        <CardHeader>
                            <CardTitle>General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Product Name <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Product Name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Product File</Label>
                                <div className="flex gap-2">
                                    <Button variant="outline">Browse</Button>
                                    <Input
                                        readOnly
                                        placeholder="Choose file"
                                        value={formData.fileUrl}
                                        className="flex-1 bg-muted/50"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Tags</Label>
                                <Input
                                    placeholder="Type and hit enter"
                                    value={formData.tags}
                                    onChange={(e) => handleChange('tags', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">This is used for search. Input those words by which customer can find this product.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Gallery Images (600x600)</Label>
                                <div className="flex gap-2">
                                    <Button variant="outline">Browse</Button>
                                    <Input readOnly placeholder="Choose file" className="flex-1 bg-muted/50" />
                                </div>
                                <p className="text-xs text-muted-foreground">These images are visible in product details page gallery. Use 600x600 sizes images.</p>
                            </div>
                            <div className="grid gap-2">
                                <Label>Thumbnail Image (300x300)</Label>
                                <div className="flex gap-2">
                                    <Button variant="outline">Browse</Button>
                                    <Input readOnly placeholder="Choose file" className="flex-1 bg-muted/50" />
                                </div>
                                <p className="text-xs text-muted-foreground">This image is visible in all product box. Use 300x300 sizes image. Keep some blank space around main object of your image as we had to crop some edge in different devices to make it responsive.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Meta Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Meta Tags</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                    placeholder="Description"
                                    className="min-h-[100px]"
                                    value={formData.metaDescription}
                                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Keywords</Label>
                                <Input
                                    placeholder="Keyword, Keyword"
                                    value={formData.metaKeywords}
                                    onChange={(e) => handleChange('metaKeywords', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Separate with comma</p>
                            </div>
                            <div className="grid gap-2">
                                <Label>Meta Image</Label>
                                <div className="flex gap-2">
                                    <Button variant="outline">Browse</Button>
                                    <Input readOnly placeholder="Choose file" className="flex-1 bg-muted/50" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specific Fields based on Type */}
                    {formData.digitalProductType === 'software' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Software Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Version</Label>
                                    <Input
                                        placeholder="e.g. 1.0.0"
                                        value={formData.version}
                                        onChange={(e) => handleChange('version', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>OS Compatibility</Label>
                                    <Input
                                        placeholder="e.g. Windows, macOS, Linux"
                                        value={formData.osCompatibility}
                                        onChange={(e) => handleChange('osCompatibility', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>License Type</Label>
                                    <Input
                                        placeholder="e.g. Single User, Commercial"
                                        value={formData.licenseType}
                                        onChange={(e) => handleChange('licenseType', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {formData.digitalProductType === 'model' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Model Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Polygon Count</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={formData.polygonCount}
                                            onChange={(e) => handleChange('polygonCount', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Vertices Count</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={formData.verticesCount}
                                            onChange={(e) => handleChange('verticesCount', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="animated"
                                            checked={formData.isAnimated}
                                            onCheckedChange={(checked) => handleChange('isAnimated', checked)}
                                        />
                                        <Label htmlFor="animated">Animated</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="rigged"
                                            checked={formData.isRigged}
                                            onCheckedChange={(checked) => handleChange('isRigged', checked)}
                                        />
                                        <Label htmlFor="rigged">Rigged</Label>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>File Formats</Label>
                                    <Input
                                        placeholder="e.g. .FBX, .OBJ, .BLEND"
                                        value={formData.fileFormat}
                                        onChange={(e) => handleChange('fileFormat', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {formData.digitalProductType === 'texture' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Texture Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Resolution</Label>
                                    <Input
                                        placeholder="e.g. 4K, 8K"
                                        value={formData.resolution}
                                        onChange={(e) => handleChange('resolution', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Maps Included</Label>
                                    <Input
                                        placeholder="e.g. Diffuse, Normal, Roughness"
                                        value={formData.mapsIncluded}
                                        onChange={(e) => handleChange('mapsIncluded', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {formData.digitalProductType === 'hdri' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>HDRI Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Resolution</Label>
                                    <Input
                                        placeholder="e.g. 8K, 16K"
                                        value={formData.resolution}
                                        onChange={(e) => handleChange('resolution', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Time of Day</Label>
                                    <Input
                                        placeholder="e.g. Day, Night, Sunset"
                                        value={formData.timeOfDay}
                                        onChange={(e) => handleChange('timeOfDay', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {formData.digitalProductType === 'account' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Service Type</Label>
                                    <Input
                                        placeholder="e.g. Netflix, Spotify"
                                        value={formData.serviceType}
                                        onChange={(e) => handleChange('serviceType', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Duration</Label>
                                    <Input
                                        placeholder="e.g. 1 Month, 1 Year"
                                        value={formData.duration}
                                        onChange={(e) => handleChange('duration', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {formData.digitalProductType === 'gift_card' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Gift Card Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Platform</Label>
                                    <Input
                                        placeholder="e.g. Amazon, Steam"
                                        value={formData.platform}
                                        onChange={(e) => handleChange('platform', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Value</Label>
                                    <Input
                                        placeholder="e.g. $50, $100"
                                        value={formData.value}
                                        onChange={(e) => handleChange('value', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Region</Label>
                                    <Input
                                        placeholder="e.g. Global, US, EU"
                                        value={formData.region}
                                        onChange={(e) => handleChange('region', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Price */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Price</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Unit price <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={formData.price}
                                    onChange={(e) => handleChange('price', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>HSN Code</Label>
                                <Input
                                    placeholder="HSN Code"
                                    value={formData.hsnCode}
                                    onChange={(e) => handleChange('hsnCode', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>GST Rate (%)</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={formData.gstRate}
                                    onChange={(e) => handleChange('gstRate', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Discount Date Range</Label>
                                <Input
                                    placeholder="Select Date"
                                    value={formData.discountDateRange}
                                    onChange={(e) => handleChange('discountDateRange', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Discount <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={formData.discount}
                                        onChange={(e) => handleChange('discount', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>&nbsp;</Label>
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
                        </CardContent>
                    </Card>

                    {/* Product Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                {/* Placeholder for Rich Text Editor */}
                                <div className="border rounded-md p-2 min-h-[200px] bg-muted/10">
                                    <div className="flex gap-2 border-b pb-2 mb-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">B</Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">I</Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">U</Button>
                                        {/* Add more toolbar items as needed */}
                                    </div>
                                    <Textarea
                                        className="border-0 shadow-none focus-visible:ring-0 resize-none min-h-[150px]"
                                        placeholder="Type your description here..."
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Frequently Bought */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Frequently Bought</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroup defaultValue="product" className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="product" id="r1" />
                                            <Label htmlFor="r1">Select Product</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="category" id="r2" />
                                            <Label htmlFor="r2">Select Category</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Popover open={openFreqBought} onOpenChange={setOpenFreqBought}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" aria-expanded={openFreqBought} className="w-full justify-between">
                                            Add More
                                            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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

                    <div className="flex justify-end">
                        <Button onClick={handleSubmit} disabled={loading} className="bg-slate-800 hover:bg-slate-900 text-white">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Product
                        </Button>
                    </div>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Product Type</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <RadioGroup
                                    value={formData.digitalProductType}
                                    onValueChange={(val) => handleChange('digitalProductType', val)}
                                    className="space-y-2"
                                >
                                    {[
                                        { id: 'software', label: 'Softwares' },
                                        { id: 'model', label: 'Models' },
                                        { id: 'texture', label: 'Textures' },
                                        { id: 'hdri', label: 'HDRIs' },
                                        { id: 'account', label: 'Accounts' },
                                        { id: 'gift_card', label: 'Gift Cards' },
                                    ].map((type) => (
                                        <div key={type.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={type.id} id={`type-${type.id}`} />
                                            <Label htmlFor={`type-${type.id}`} className="font-normal cursor-pointer">{type.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Product Category</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Search Category */}
                                <div className="relative">
                                    <Input placeholder="Search" className="pl-8" />
                                    <div className="absolute left-2.5 top-2.5 text-muted-foreground">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                    </div>
                                </div>

                                {/* Category List (Radio Buttons) */}
                                <RadioGroup
                                    value={formData.categoryId}
                                    onValueChange={(val) => handleChange('categoryId', val)}
                                    className="space-y-2"
                                >
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={cat.id} id={`cat-${cat.id}`} />
                                            <Label htmlFor={`cat-${cat.id}`} className="font-normal cursor-pointer">{cat.name}</Label>
                                        </div>
                                    ))}
                                    {categories.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No categories found.</p>
                                    )}
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div >
        </div >
    )
}
