'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
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
import { toast } from 'sonner'
import {
    Gift,
    LayoutGrid,
    Users,
    Sparkles,
    Loader2,
    Check,
    X,
    GripVertical,
    Search,
    Eye,
    EyeOff,
    Save,
} from 'lucide-react'
import {
    getLandingSections,
    updateLandingSection,
    toggleSectionVisibility,
    getShopCategories,
    getFreshCommunityProducts,
    updateFreshCommunityProducts,
    searchProductsForSection,
} from '@/actions/landing-section-actions'
import {
    getPendingFeaturedSubmissions,
    reviewFeaturedSubmission,
} from '@/actions/vendor-featured-actions'
import Image from 'next/image'

interface LandingSection {
    id: string
    identifier: string
    title: string
    subtitle: string | null
    buttonText: string | null
    buttonLink: string | null
    isActive: boolean
    config: any
    order: number
}

interface Category {
    id: string
    name: string
    slug: string
    description: string | null
}

interface Product {
    id: string
    name: string
    price: number
    currency: string
    thumbnail: string | null
    vendor?: { name: string }
}

interface FeaturedSubmission {
    id: string
    productId: string
    sectionId: string
    status: string
    submittedAt: string
    product: {
        id: string
        name: string
        thumbnail: string | null
        price: number
        currency: string
    }
    vendor: {
        id: string
        name: string
        avatar: string | null
    }
}

export default function AdminSectionsPage() {
    const [sections, setSections] = useState<LandingSection[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [freshProducts, setFreshProducts] = useState<Product[]>([])
    const [pendingSubmissions, setPendingSubmissions] = useState<FeaturedSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('gift-banner')

    // Product search for adding to sections
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Product[]>([])
    const [searching, setSearching] = useState(false)
    const [addProductDialogOpen, setAddProductDialogOpen] = useState(false)

    // Form states for each section
    const [giftBannerForm, setGiftBannerForm] = useState({
        title: '',
        subtitle: '',
        buttonText: '',
        buttonLink: '',
    })
    const [heroForm, setHeroForm] = useState({
        title: '',
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [sectionsResult, categoriesResult, productsResult, submissionsResult] = await Promise.all([
                getLandingSections(),
                getShopCategories(),
                getFreshCommunityProducts(),
                getPendingFeaturedSubmissions(),
            ])

            if (sectionsResult.success) {
                setSections(sectionsResult.data)
                // Initialize forms
                const giftBanner = sectionsResult.data.find(s => s.identifier === 'gift-banner')
                if (giftBanner) {
                    setGiftBannerForm({
                        title: giftBanner.title || '',
                        subtitle: giftBanner.subtitle || '',
                        buttonText: giftBanner.buttonText || '',
                        buttonLink: giftBanner.buttonLink || '',
                    })
                }
                const hero = sectionsResult.data.find(s => s.identifier === 'hero-banner')
                if (hero) {
                    setHeroForm({ title: hero.title || '' })
                }
            }
            if (categoriesResult.success) setCategories(categoriesResult.data)
            if (productsResult.success) setFreshProducts(productsResult.data)
            if (submissionsResult.success) setPendingSubmissions(submissionsResult.data)
        } catch (error) {
            toast.error('Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveGiftBanner = async () => {
        setSaving(true)
        try {
            const result = await updateLandingSection('gift-banner', giftBannerForm)
            if (result.success) {
                toast.success('Gift Banner updated successfully')
                loadData()
            } else {
                toast.error((result as any).error || 'Failed to update')
            }
        } finally {
            setSaving(false)
        }
    }

    const handleSaveHero = async () => {
        setSaving(true)
        try {
            const result = await updateLandingSection('hero-banner', heroForm)
            if (result.success) {
                toast.success('Hero Banner updated successfully')
                loadData()
            } else {
                toast.error((result as any).error || 'Failed to update')
            }
        } finally {
            setSaving(false)
        }
    }

    const handleToggleVisibility = async (identifier: string) => {
        const result = await toggleSectionVisibility(identifier)
        if (result.success) {
            toast.success('Visibility updated')
            loadData()
        } else {
            toast.error((result as any).error || 'Failed to update')
        }
    }

    const handleSearchProducts = async () => {
        if (!searchQuery.trim()) return
        setSearching(true)
        try {
            const result = await searchProductsForSection(searchQuery)
            if (result.success) {
                setSearchResults(result.data)
            }
        } finally {
            setSearching(false)
        }
    }

    const handleAddProductToFresh = async (productId: string) => {
        const currentIds = freshProducts.map(p => p.id)
        if (currentIds.includes(productId)) {
            toast.error('Product already in section')
            return
        }
        const result = await updateFreshCommunityProducts([...currentIds, productId])
        if (result.success) {
            toast.success('Product added to section')
            setAddProductDialogOpen(false)
            setSearchQuery('')
            setSearchResults([])
            loadData()
        } else {
            toast.error((result as any).error || 'Failed to add product')
        }
    }

    const handleRemoveProductFromFresh = async (productId: string) => {
        const newIds = freshProducts.filter(p => p.id !== productId).map(p => p.id)
        const result = await updateFreshCommunityProducts(newIds)
        if (result.success) {
            toast.success('Product removed from section')
            loadData()
        } else {
            toast.error((result as any).error || 'Failed to remove product')
        }
    }

    const handleReviewSubmission = async (submissionId: string, action: 'APPROVED' | 'REJECTED') => {
        const result = await reviewFeaturedSubmission(submissionId, action)
        if (result.success) {
            toast.success(`Submission ${action.toLowerCase()}`)
            loadData()
        } else {
            toast.error((result as any).error || 'Failed to review submission')
        }
    }

    const getSectionByIdentifier = (identifier: string) => sections.find(s => s.identifier === identifier)

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Landing Page Sections</h3>
                            <p className="dashboard-card-description">
                                Manage and customize the sections displayed on your landing page
                            </p>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="gift-banner" className="flex items-center gap-2">
                                <Gift className="h-4 w-4" />
                                <span className="hidden sm:inline">Gift Banner</span>
                            </TabsTrigger>
                            <TabsTrigger value="shop-category" className="flex items-center gap-2">
                                <LayoutGrid className="h-4 w-4" />
                                <span className="hidden sm:inline">Categories</span>
                            </TabsTrigger>
                            <TabsTrigger value="fresh-community" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span className="hidden sm:inline">Fresh</span>
                            </TabsTrigger>
                            <TabsTrigger value="hero-banner" className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                <span className="hidden sm:inline">Hero</span>
                            </TabsTrigger>
                            <TabsTrigger value="submissions" className="flex items-center gap-2">
                                <Badge variant={pendingSubmissions.length > 0 ? "destructive" : "secondary"} className="h-5 w-5 p-0 flex items-center justify-center">
                                    {pendingSubmissions.length}
                                </Badge>
                                <span className="hidden sm:inline">Requests</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Gift Banner Tab */}
                        <TabsContent value="gift-banner" className="mt-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Gift className="h-5 w-5 text-green-600" />
                                            Send a gift ASAP?!
                                        </CardTitle>
                                        <CardDescription>Configure the gift mode promotional banner</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getSectionByIdentifier('gift-banner')?.isActive ? (
                                            <Badge variant="default"><Eye className="h-3 w-3 mr-1" /> Visible</Badge>
                                        ) : (
                                            <Badge variant="secondary"><EyeOff className="h-3 w-3 mr-1" /> Hidden</Badge>
                                        )}
                                        <Switch
                                            checked={getSectionByIdentifier('gift-banner')?.isActive ?? true}
                                            onCheckedChange={() => handleToggleVisibility('gift-banner')}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="gift-title">Title</Label>
                                            <Input
                                                id="gift-title"
                                                value={giftBannerForm.title}
                                                onChange={(e) => setGiftBannerForm(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="Send a gift ASAP?!"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gift-button-text">Button Text</Label>
                                            <Input
                                                id="gift-button-text"
                                                value={giftBannerForm.buttonText}
                                                onChange={(e) => setGiftBannerForm(prev => ({ ...prev, buttonText: e.target.value }))}
                                                placeholder="Try Gift Mode"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gift-subtitle">Subtitle / Description</Label>
                                        <Textarea
                                            id="gift-subtitle"
                                            value={giftBannerForm.subtitle}
                                            onChange={(e) => setGiftBannerForm(prev => ({ ...prev, subtitle: e.target.value }))}
                                            placeholder="Your presents can be present... instantly."
                                            rows={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gift-link">Button Link</Label>
                                        <Input
                                            id="gift-link"
                                            value={giftBannerForm.buttonLink}
                                            onChange={(e) => setGiftBannerForm(prev => ({ ...prev, buttonLink: e.target.value }))}
                                            placeholder="/gift-mode"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button onClick={handleSaveGiftBanner} disabled={saving}>
                                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Shop by Category Tab */}
                        <TabsContent value="shop-category" className="mt-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <LayoutGrid className="h-5 w-5 text-blue-600" />
                                            Shop by Category
                                        </CardTitle>
                                        <CardDescription>Manage category display order and visibility</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getSectionByIdentifier('shop-category')?.isActive ? (
                                            <Badge variant="default"><Eye className="h-3 w-3 mr-1" /> Visible</Badge>
                                        ) : (
                                            <Badge variant="secondary"><EyeOff className="h-3 w-3 mr-1" /> Hidden</Badge>
                                        )}
                                        <Switch
                                            checked={getSectionByIdentifier('shop-category')?.isActive ?? true}
                                            onCheckedChange={() => handleToggleVisibility('shop-category')}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12"></TableHead>
                                                <TableHead>Category Name</TableHead>
                                                <TableHead>Slug</TableHead>
                                                <TableHead>Description</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categories.map((category) => (
                                                <TableRow key={category.id}>
                                                    <TableCell>
                                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{category.name}</TableCell>
                                                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                                                    <TableCell className="text-muted-foreground">{category.description || '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                            {categories.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                        No categories found. Create categories first.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Fresh from Community Tab */}
                        <TabsContent value="fresh-community" className="mt-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-purple-600" />
                                            Fresh from the community
                                        </CardTitle>
                                        <CardDescription>Curate featured products for this section</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            {getSectionByIdentifier('fresh-community')?.isActive ? (
                                                <Badge variant="default"><Eye className="h-3 w-3 mr-1" /> Visible</Badge>
                                            ) : (
                                                <Badge variant="secondary"><EyeOff className="h-3 w-3 mr-1" /> Hidden</Badge>
                                            )}
                                            <Switch
                                                checked={getSectionByIdentifier('fresh-community')?.isActive ?? true}
                                                onCheckedChange={() => handleToggleVisibility('fresh-community')}
                                            />
                                        </div>
                                        <Button onClick={() => setAddProductDialogOpen(true)}>
                                            Add Product
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {freshProducts.map((product) => (
                                            <div key={product.id} className="relative group">
                                                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                                    {product.thumbnail ? (
                                                        <Image
                                                            src={product.thumbnail}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                            No image
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => handleRemoveProductFromFresh(product.id)}
                                                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <p className="mt-2 text-sm font-medium truncate">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">${product.price}</p>
                                            </div>
                                        ))}
                                        {freshProducts.length === 0 && (
                                            <div className="col-span-full text-center py-8 text-muted-foreground">
                                                No products in this section. Add products to feature them.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Hero Banner Tab */}
                        <TabsContent value="hero-banner" className="mt-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-yellow-600" />
                                            Hero Banner
                                        </CardTitle>
                                        <CardDescription>Configure the main hero section title</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getSectionByIdentifier('hero-banner')?.isActive ? (
                                            <Badge variant="default"><Eye className="h-3 w-3 mr-1" /> Visible</Badge>
                                        ) : (
                                            <Badge variant="secondary"><EyeOff className="h-3 w-3 mr-1" /> Hidden</Badge>
                                        )}
                                        <Switch
                                            checked={getSectionByIdentifier('hero-banner')?.isActive ?? true}
                                            onCheckedChange={() => handleToggleVisibility('hero-banner')}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="hero-title">Main Title</Label>
                                        <Textarea
                                            id="hero-title"
                                            value={heroForm.title}
                                            onChange={(e) => setHeroForm({ title: e.target.value })}
                                            placeholder="Find things you'll love. Support independent creators."
                                            rows={2}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button onClick={handleSaveHero} disabled={saving}>
                                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Pending Submissions Tab */}
                        <TabsContent value="submissions" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Vendor Feature Requests</CardTitle>
                                    <CardDescription>Review and approve vendor product submissions for featured sections</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Vendor</TableHead>
                                                <TableHead>Section</TableHead>
                                                <TableHead>Submitted</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pendingSubmissions.map((submission) => (
                                                <TableRow key={submission.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-md overflow-hidden bg-muted relative">
                                                                {submission.product.thumbnail ? (
                                                                    <Image
                                                                        src={submission.product.thumbnail}
                                                                        alt={submission.product.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{submission.product.name}</p>
                                                                <p className="text-sm text-muted-foreground">${submission.product.price}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {submission.vendor.avatar && (
                                                                <div className="w-6 h-6 rounded-full overflow-hidden relative">
                                                                    <Image src={submission.vendor.avatar} alt="" fill className="object-cover" />
                                                                </div>
                                                            )}
                                                            {submission.vendor.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{submission.sectionId}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {new Date(submission.submittedAt).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                onClick={() => handleReviewSubmission(submission.id, 'APPROVED')}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleReviewSubmission(submission.id, 'REJECTED')}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {pendingSubmissions.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                        No pending submissions
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Add Product Dialog */}
            <Dialog open={addProductDialogOpen} onOpenChange={setAddProductDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Product to Section</DialogTitle>
                        <DialogDescription>Search and select a product to add to the featured section</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchProducts()}
                            />
                            <Button onClick={handleSearchProducts} disabled={searching}>
                                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                            {searchResults.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleAddProductToFresh(product.id)}
                                    className="p-3 border rounded-lg hover:bg-muted transition-colors text-left"
                                >
                                    <div className="aspect-square rounded-md overflow-hidden bg-muted mb-2 relative">
                                        {product.thumbnail ? (
                                            <Image src={product.thumbnail} alt={product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                                        )}
                                    </div>
                                    <p className="font-medium text-sm truncate">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{product.vendor?.name}</p>
                                    <p className="text-sm font-bold">${product.price}</p>
                                </button>
                            ))}
                            {searchResults.length === 0 && searchQuery && !searching && (
                                <div className="col-span-full text-center py-8 text-muted-foreground">
                                    No products found. Try a different search term.
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddProductDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
