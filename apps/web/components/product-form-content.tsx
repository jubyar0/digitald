'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminApi, sellerApi } from '@/lib/api';
import { createMyProduct, updateMyProduct } from '@/actions/vendor-products';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Plus, Check, ChevronsUpDown } from 'lucide-react';
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
import { getAllCategories, getAllVendors } from "@/actions/admin"

interface ProductFormContentProps {
    onSuccess: () => void;
    onCancel?: () => void;
    isAdminContext?: boolean;
    initialData?: any;
    isEditMode?: boolean;
    vendors?: any[];
    categories?: any[];
}

interface ImageFile {
    id: string;
    url: string;
    file?: File;
}

interface TextureFile {
    type: string;
    resolution: string;
    format: string;
}

interface FileFormat {
    name: string;
    version: string;
    enabled: boolean;
}

export function ProductFormContent({
    onSuccess,
    onCancel,
    isAdminContext = false,
    initialData,
    isEditMode = false,
    vendors = [],
    categories = []
}: ProductFormContentProps) {
    const [openCategory, setOpenCategory] = useState(false)

    // Images state
    const [images, setImages] = useState<ImageFile[]>([]);
    const [thumbnailIndex, setThumbnailIndex] = useState(0);

    // Basic form data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        vendorId: '',
        fileUrl: '',
        assetDetails: '',
        isFree: false,
    });

    // Mesh details
    const [meshDetails, setMeshDetails] = useState({
        meshCount: 0,
        polygonCount: 0,
        verticesCount: 0,
        geometryType: 'Quads',
        uvMapped: false,
        rigged: false,
    });

    // Advanced 3D Model Specifications
    const [advancedSpecs, setAdvancedSpecs] = useState({
        isRigged: false,
        isAnimated: false,
        hasLOD: false,
        lodLevels: 0,
        renderEngine: '',
        materialType: 'PBR',
    });

    // Software Compatibility
    const [softwareCompatibility, setSoftwareCompatibility] = useState<string[]>([]);
    const availableSoftware = [
        'Blender',
        'Maya',
        '3ds Max',
        'Cinema 4D',
        'Houdini',
        'ZBrush',
        'Substance Painter',
        'Unity',
        'Unreal Engine',
        'Godot',
    ];

    // Dimensions
    const [dimensions, setDimensions] = useState({
        height: 0,
        width: 0,
        depth: 0,
        unit: 'cm',
    });

    // File formats
    const [nativeFormats, setNativeFormats] = useState<FileFormat[]>([
        { name: '.blend', version: '3.0+', enabled: false },
        { name: '.max', version: '2020+', enabled: false },
        { name: '.c4d', version: 'R21+', enabled: false },
        { name: '.ma/.mb', version: '2020+', enabled: false },
    ]);

    const [universalFormats, setUniversalFormats] = useState<FileFormat[]>([
        { name: '.fbx', version: '7.4', enabled: false },
        { name: '.obj', version: '', enabled: false },
        { name: '.dae', version: '1.4', enabled: false },
        { name: '.stl', version: '', enabled: false },
        { name: '.gltf/.glb', version: '2.0', enabled: false },
    ]);

    // Textures
    const [textures, setTextures] = useState<TextureFile[]>([]);
    const [pbrTextures, setPbrTextures] = useState(false);
    const [textureResolution, setTextureResolution] = useState('2048x2048');

    // Add-ons
    const [addons, setAddons] = useState<string[]>([]);
    const [newAddon, setNewAddon] = useState('');

    // License
    const [license, setLicense] = useState({
        type: 'Standard',
        commercialUse: false,
        royaltyFree: false,
        attributionRequired: false,
        modificationAllowed: false,
        redistributionAllowed: false,
        customTerms: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);



    // Populate form with initial data when in edit mode
    useEffect(() => {
        if (initialData && isEditMode) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price || 0,
                categoryId: initialData.categoryId || '',
                vendorId: initialData.vendorId || '',
                fileUrl: initialData.fileUrl || '',
                assetDetails: initialData.assetDetails || '',
                isFree: initialData.price === 0,
            });

            if (initialData.height || initialData.width || initialData.depth) {
                setDimensions({
                    height: initialData.height || 0,
                    width: initialData.width || 0,
                    depth: initialData.depth || 0,
                    unit: 'cm',
                });
            }

            if (initialData.meshCount) {
                setMeshDetails(prev => ({
                    ...prev,
                    meshCount: initialData.meshCount,
                }));
            }

            if (initialData.thumbnail) {
                setImages([{ id: '1', url: initialData.thumbnail }]);
            }

            // Parse JSON fields
            if (initialData.textureFiles) {
                try {
                    const textureData = typeof initialData.textureFiles === 'string'
                        ? JSON.parse(initialData.textureFiles)
                        : initialData.textureFiles;
                    if (textureData.textures) setTextures(textureData.textures);
                    if (textureData.pbrEnabled !== undefined) setPbrTextures(textureData.pbrEnabled);
                    if (textureData.defaultResolution) setTextureResolution(textureData.defaultResolution);
                } catch (e) {
                    console.error('Failed to parse texture files:', e);
                }
            }

            if (initialData.nativeFileFormats) {
                try {
                    const formats = typeof initialData.nativeFileFormats === 'string'
                        ? JSON.parse(initialData.nativeFileFormats)
                        : initialData.nativeFileFormats;
                    setNativeFormats(prev => prev.map(f => ({
                        ...f,
                        enabled: formats.some((fmt: any) => fmt.name === f.name)
                    })));
                } catch (e) {
                    console.error('Failed to parse native formats:', e);
                }
            }

            if (initialData.universalFileFormats) {
                try {
                    const formats = typeof initialData.universalFileFormats === 'string'
                        ? JSON.parse(initialData.universalFileFormats)
                        : initialData.universalFileFormats;
                    setUniversalFormats(prev => prev.map(f => ({
                        ...f,
                        enabled: formats.some((fmt: any) => fmt.name === f.name)
                    })));
                } catch (e) {
                    console.error('Failed to parse universal formats:', e);
                }
            }

            if (initialData.addonSupport) {
                try {
                    const addonsData = typeof initialData.addonSupport === 'string'
                        ? JSON.parse(initialData.addonSupport)
                        : initialData.addonSupport;
                    setAddons(Array.isArray(addonsData) ? addonsData : []);
                } catch (e) {
                    console.error('Failed to parse addons:', e);
                }
            }

            if (initialData.licenseInfo) {
                try {
                    const licenseData = typeof initialData.licenseInfo === 'string'
                        ? JSON.parse(initialData.licenseInfo)
                        : initialData.licenseInfo;
                    setLicense(prev => ({ ...prev, ...licenseData }));
                } catch (e) {
                    console.error('Failed to parse license info:', e);
                }
            }
        }
    }, [initialData, isEditMode]);



    const formatCategoryName = (category: any) => {
        if (category.parent) {
            return `${category.parent.name} > ${category.name}`;
        }
        return category.name;
    };

    const sortedCategories = useMemo(() => {
        const roots = categories.filter(c => !c.parentId);
        const sorted: any[] = [];

        roots.forEach(root => {
            sorted.push(root);
            const children = categories.filter(c => c.parentId === root.id);
            sorted.push(...children);
        });

        // Add any orphans (shouldn't happen usually but good for safety)
        const processedIds = new Set(sorted.map(c => c.id));
        const orphans = categories.filter(c => !processedIds.has(c.id));
        sorted.push(...orphans);

        return sorted;
    }, [categories]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: ImageFile[] = Array.from(files).map((file, index) => ({
                id: `${Date.now()}-${index}`,
                url: URL.createObjectURL(file),
                file,
            }));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (id: string) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMeshChange = (field: string, value: any) => {
        setMeshDetails(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDimensionChange = (field: string, value: any) => {
        setDimensions(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const toggleFileFormat = (type: 'native' | 'universal', index: number) => {
        if (type === 'native') {
            setNativeFormats(prev => prev.map((fmt, i) =>
                i === index ? { ...fmt, enabled: !fmt.enabled } : fmt
            ));
        } else {
            setUniversalFormats(prev => prev.map((fmt, i) =>
                i === index ? { ...fmt, enabled: !fmt.enabled } : fmt
            ));
        }
    };

    const addTexture = () => {
        setTextures(prev => [...prev, { type: 'Diffuse', resolution: textureResolution, format: 'PNG' }]);
    };

    const removeTexture = (index: number) => {
        setTextures(prev => prev.filter((_, i) => i !== index));
    };

    const updateTexture = (index: number, field: string, value: string) => {
        setTextures(prev => prev.map((tex, i) =>
            i === index ? { ...tex, [field]: value } : tex
        ));
    };

    const addAddon = () => {
        if (newAddon.trim()) {
            setAddons(prev => [...prev, newAddon.trim()]);
            setNewAddon('');
        }
    };

    const removeAddon = (index: number) => {
        setAddons(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const productData = {
                ...formData,
                price: formData.isFree ? 0 : formData.price,
                thumbnail: images[thumbnailIndex]?.url || '',
                images: images.map(img => img.url), // Map images to URLs
                height: dimensions.height,
                width: dimensions.width,
                depth: dimensions.depth,
                meshCount: meshDetails.meshCount,
                // New 3D Model Technical Fields
                polygonCount: meshDetails.polygonCount,
                verticesCount: meshDetails.verticesCount,
                geometryType: meshDetails.geometryType,
                isRigged: advancedSpecs.isRigged,
                isAnimated: advancedSpecs.isAnimated,
                hasLOD: advancedSpecs.hasLOD,
                lodLevels: advancedSpecs.lodLevels,
                softwareCompatibility: JSON.stringify(softwareCompatibility),
                renderEngine: advancedSpecs.renderEngine,
                materialType: advancedSpecs.materialType,
                // Existing JSON fields
                textureFiles: JSON.stringify({
                    textures,
                    pbrEnabled: pbrTextures,
                    defaultResolution: textureResolution,
                }),
                nativeFileFormats: JSON.stringify(nativeFormats.filter(f => f.enabled)),
                universalFileFormats: JSON.stringify(universalFormats.filter(f => f.enabled)),
                addonSupport: JSON.stringify(addons),
                licenseInfo: JSON.stringify(license),
            };

            console.log('Submitting product data:', productData);

            let response;
            if (isEditMode && initialData?.id) {
                // Update existing product
                response = await updateMyProduct(initialData.id, productData);
            } else {
                // Create new product
                response = await createMyProduct(productData);
            }

            if (!response.success) {
                throw new Error(response.error || 'Failed to save product');
            }

            console.log('Product saved successfully:', response);

            onSuccess();
        } catch (error: any) {
            console.error('Failed to save product:', error);
            setError(error.message || 'Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="formats">Formats</TabsTrigger>
                    <TabsTrigger value="license">License</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Enter the product name, description, and pricing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Glazed Donut 3D Model"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($) *</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.isFree ? 0 : formData.price}
                                        onChange={handleChange}
                                        disabled={formData.isFree}
                                        required={!formData.isFree}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 rounded-md border p-3">
                                <Checkbox
                                    id="isFree"
                                    checked={formData.isFree}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFree: checked as boolean }))}
                                />
                                <div>
                                    <Label htmlFor="isFree">Free Product</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Make this product available for free
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="categoryId">Category *</Label>
                                    <Popover open={openCategory} onOpenChange={setOpenCategory}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openCategory}
                                                className="w-full justify-between"
                                            >
                                                {formData.categoryId
                                                    ? categories.find((category) => category.id === formData.categoryId)
                                                        ? formatCategoryName(categories.find((category) => category.id === formData.categoryId))
                                                        : "Select category..."
                                                    : "Select category..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" sideOffset={0}>
                                            <Command>
                                                <CommandInput placeholder="Search category..." />
                                                <CommandList>
                                                    <CommandEmpty>No category found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {sortedCategories.map((category) => (
                                                            <CommandItem
                                                                key={category.id}
                                                                value={formatCategoryName(category)}
                                                                onSelect={() => {
                                                                    handleSelectChange('categoryId', category.id)
                                                                    setOpenCategory(false)
                                                                }}
                                                                className={cn(category.parentId && "pl-8")}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        formData.categoryId === category.id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {category.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {isAdminContext && (
                                    <div className="space-y-2">
                                        <Label htmlFor="vendorId">Vendor *</Label>
                                        <Select name="vendorId" value={formData.vendorId} onValueChange={(value) => handleSelectChange('vendorId', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select vendor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vendors.map(vendor => (
                                                    <SelectItem key={vendor.id} value={vendor.id}>
                                                        {vendor.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="Describe your 3D model in detail..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fileUrl">Download File URL *</Label>
                                <Input
                                    id="fileUrl"
                                    name="fileUrl"
                                    value={formData.fileUrl}
                                    onChange={handleChange}
                                    required
                                    placeholder="https://..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Images Tab */}
                <TabsContent value="images" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                            <CardDescription>Upload multiple images of your 3D model</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <Label htmlFor="image-upload" className="cursor-pointer">
                                    <span className="text-sm text-muted-foreground">
                                        Click to upload or drag and drop
                                    </span>
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </Label>
                            </div>

                            {images.length > 0 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {images.map((img, index) => (
                                        <div key={img.id} className="relative group">
                                            <button
                                                type="button"
                                                onClick={() => setThumbnailIndex(index)}
                                                className="w-full h-32 p-0 border-0 bg-transparent focus:outline-none"
                                            >
                                                <img
                                                    src={img.url}
                                                    alt={`Product ${index + 1}`}
                                                    className={`w-full h-32 object-cover rounded-lg ${index === thumbnailIndex ? 'ring-2 ring-primary' : ''
                                                        }`}
                                                />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(img.id)}
                                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            {index === thumbnailIndex && (
                                                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                                    Thumbnail
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Specifications Tab */}
                <TabsContent value="specs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mesh Details</CardTitle>
                            <CardDescription>Technical specifications of the 3D model</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Polygon Count</Label>
                                    <Input
                                        type="number"
                                        value={meshDetails.polygonCount}
                                        onChange={(e) => handleMeshChange('polygonCount', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Vertices Count</Label>
                                    <Input
                                        type="number"
                                        value={meshDetails.verticesCount}
                                        onChange={(e) => handleMeshChange('verticesCount', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Geometry Type</Label>
                                    <Select value={meshDetails.geometryType} onValueChange={(value) => handleMeshChange('geometryType', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Quads">Quads</SelectItem>
                                            <SelectItem value="Triangles">Triangles</SelectItem>
                                            <SelectItem value="N-gons">N-gons</SelectItem>
                                            <SelectItem value="Mixed">Mixed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="uvMapped"
                                        checked={meshDetails.uvMapped}
                                        onCheckedChange={(checked) => handleMeshChange('uvMapped', checked)}
                                    />
                                    <Label htmlFor="uvMapped">UV Mapped</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="rigged"
                                        checked={meshDetails.rigged}
                                        onCheckedChange={(checked) => handleMeshChange('rigged', checked)}
                                    />
                                    <Label htmlFor="rigged">Rigged</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dimensions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Height</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={dimensions.height}
                                        onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Width</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={dimensions.width}
                                        onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Depth</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={dimensions.depth}
                                        onChange={(e) => handleDimensionChange('depth', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Unit</Label>
                                    <Select value={dimensions.unit} onValueChange={(value) => handleDimensionChange('unit', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cm">cm</SelectItem>
                                            <SelectItem value="m">m</SelectItem>
                                            <SelectItem value="in">inches</SelectItem>
                                            <SelectItem value="ft">feet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Textures</CardTitle>
                            <CardDescription>Texture information and PBR support</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="pbrTextures"
                                    checked={pbrTextures}
                                    onCheckedChange={(checked) => setPbrTextures(checked as boolean)}
                                />
                                <Label htmlFor="pbrTextures">PBR Textures Included</Label>
                            </div>

                            <div className="space-y-2">
                                <Label>Default Texture Resolution</Label>
                                <Select value={textureResolution} onValueChange={setTextureResolution}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1024x1024">1024x1024</SelectItem>
                                        <SelectItem value="2048x2048">2048x2048</SelectItem>
                                        <SelectItem value="4096x4096">4096x4096</SelectItem>
                                        <SelectItem value="8192x8192">8192x8192</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Texture Files</Label>
                                    <Button type="button" size="sm" onClick={addTexture}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Texture
                                    </Button>
                                </div>
                                {textures.map((texture, index) => (
                                    <div key={index} className="flex gap-2 items-end">
                                        <div className="flex-1 space-y-2">
                                            <Select value={texture.type} onValueChange={(value) => updateTexture(index, 'type', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Diffuse">Diffuse</SelectItem>
                                                    <SelectItem value="Normal">Normal</SelectItem>
                                                    <SelectItem value="Specular">Specular</SelectItem>
                                                    <SelectItem value="Roughness">Roughness</SelectItem>
                                                    <SelectItem value="Metallic">Metallic</SelectItem>
                                                    <SelectItem value="AO">Ambient Occlusion</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Select value={texture.format} onValueChange={(value) => updateTexture(index, 'format', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PNG">PNG</SelectItem>
                                                    <SelectItem value="JPG">JPG</SelectItem>
                                                    <SelectItem value="TIFF">TIFF</SelectItem>
                                                    <SelectItem value="EXR">EXR</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button type="button" variant="destructive" size="sm" onClick={() => removeTexture(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Advanced Specifications Tab */}
                <TabsContent value="advanced" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Advanced 3D Model Specifications</CardTitle>
                            <CardDescription>Rigging, animation, and optimization details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Rigging and Animation */}
                            <div className="space-y-4">
                                <h4 className="font-medium">Rigging & Animation</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2 rounded-md border p-3">
                                        <Checkbox
                                            id="isRigged"
                                            checked={advancedSpecs.isRigged}
                                            onCheckedChange={(checked) => setAdvancedSpecs(prev => ({ ...prev, isRigged: checked as boolean }))}
                                        />
                                        <div>
                                            <Label htmlFor="isRigged">Rigged</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Model includes a rig/skeleton
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 rounded-md border p-3">
                                        <Checkbox
                                            id="isAnimated"
                                            checked={advancedSpecs.isAnimated}
                                            onCheckedChange={(checked) => setAdvancedSpecs(prev => ({ ...prev, isAnimated: checked as boolean }))}
                                        />
                                        <div>
                                            <Label htmlFor="isAnimated">Animated</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Includes animations
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* LOD (Level of Detail) */}
                            <div className="space-y-4">
                                <h4 className="font-medium">Level of Detail (LOD)</h4>
                                <div className="flex items-center space-x-2 rounded-md border p-3">
                                    <Checkbox
                                        id="hasLOD"
                                        checked={advancedSpecs.hasLOD}
                                        onCheckedChange={(checked) => setAdvancedSpecs(prev => ({ ...prev, hasLOD: checked as boolean }))}
                                    />
                                    <div className="flex-1">
                                        <Label htmlFor="hasLOD">Includes LOD Versions</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Multiple detail levels for optimization
                                        </p>
                                    </div>
                                </div>
                                {advancedSpecs.hasLOD && (
                                    <div className="space-y-2 ml-6">
                                        <Label>Number of LOD Levels</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="10"
                                            value={advancedSpecs.lodLevels}
                                            onChange={(e) => setAdvancedSpecs(prev => ({ ...prev, lodLevels: parseInt(e.target.value) || 0 }))}
                                            placeholder="e.g., 3"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Software Compatibility */}
                            <div className="space-y-4">
                                <h4 className="font-medium">Software Compatibility</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {availableSoftware.map((software) => (
                                        <div key={software} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`software-${software}`}
                                                checked={softwareCompatibility.includes(software)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSoftwareCompatibility(prev => [...prev, software]);
                                                    } else {
                                                        setSoftwareCompatibility(prev => prev.filter(s => s !== software));
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={`software-${software}`} className="font-normal">
                                                {software}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Render Engine */}
                            <div className="space-y-2">
                                <Label>Recommended Render Engine</Label>
                                <Select
                                    value={advancedSpecs.renderEngine}
                                    onValueChange={(value) => setAdvancedSpecs(prev => ({ ...prev, renderEngine: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select render engine" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cycles">Cycles</SelectItem>
                                        <SelectItem value="Eevee">Eevee</SelectItem>
                                        <SelectItem value="Arnold">Arnold</SelectItem>
                                        <SelectItem value="V-Ray">V-Ray</SelectItem>
                                        <SelectItem value="Redshift">Redshift</SelectItem>
                                        <SelectItem value="Octane">Octane</SelectItem>
                                        <SelectItem value="Corona">Corona</SelectItem>
                                        <SelectItem value="Unreal">Unreal Engine</SelectItem>
                                        <SelectItem value="Unity">Unity</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Material Type */}
                            <div className="space-y-2">
                                <Label>Material Type</Label>
                                <Select
                                    value={advancedSpecs.materialType}
                                    onValueChange={(value) => setAdvancedSpecs(prev => ({ ...prev, materialType: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PBR">PBR (Physically Based Rendering)</SelectItem>
                                        <SelectItem value="Standard">Standard</SelectItem>
                                        <SelectItem value="Procedural">Procedural</SelectItem>
                                        <SelectItem value="Baked">Baked Textures</SelectItem>
                                        <SelectItem value="None">No Materials</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Formats Tab */}
                <TabsContent value="formats" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Native File Formats</CardTitle>
                            <CardDescription>Select the native formats included with this model</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {nativeFormats.map((format, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            checked={format.enabled}
                                            onCheckedChange={() => toggleFileFormat('native', index)}
                                        />
                                        <div>
                                            <p className="font-medium">{format.name}</p>
                                            {format.version && (
                                                <p className="text-sm text-muted-foreground">{format.version}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Universal File Formats</CardTitle>
                            <CardDescription>Select the universal formats included</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {universalFormats.map((format, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            checked={format.enabled}
                                            onCheckedChange={() => toggleFileFormat('universal', index)}
                                        />
                                        <div>
                                            <p className="font-medium">{format.name}</p>
                                            {format.version && (
                                                <p className="text-sm text-muted-foreground">{format.version}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Add-on Support</CardTitle>
                            <CardDescription>Compatible software and add-ons</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g., Blender 3.0+"
                                    value={newAddon}
                                    onChange={(e) => setNewAddon(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAddon())}
                                />
                                <Button type="button" onClick={addAddon}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {addons.map((addon, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full">
                                        <span className="text-sm">{addon}</span>
                                        <button type="button" onClick={() => removeAddon(index)}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* License Tab */}
                <TabsContent value="license" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>License Information</CardTitle>
                            <CardDescription>Define usage rights and restrictions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>License Type</Label>
                                <Select value={license.type} onValueChange={(value) => setLicense(prev => ({ ...prev, type: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Standard">Standard License</SelectItem>
                                        <SelectItem value="Extended">Extended License</SelectItem>
                                        <SelectItem value="Editorial">Editorial Use Only</SelectItem>
                                        <SelectItem value="Custom">Custom License</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="commercialUse"
                                        checked={license.commercialUse}
                                        onCheckedChange={(checked) => setLicense(prev => ({ ...prev, commercialUse: checked as boolean }))}
                                    />
                                    <Label htmlFor="commercialUse">Commercial Use Allowed</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="royaltyFree"
                                        checked={license.royaltyFree}
                                        onCheckedChange={(checked) => setLicense(prev => ({ ...prev, royaltyFree: checked as boolean }))}
                                    />
                                    <Label htmlFor="royaltyFree">Royalty-Free</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="attributionRequired"
                                        checked={license.attributionRequired}
                                        onCheckedChange={(checked) => setLicense(prev => ({ ...prev, attributionRequired: checked as boolean }))}
                                    />
                                    <Label htmlFor="attributionRequired">Attribution Required</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={loading}>
                    {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
                </Button>
            </div>
        </form>
    );
}
