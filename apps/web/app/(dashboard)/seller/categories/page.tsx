import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/dashboard/ui/card'
import { Badge } from '@/components/dashboard/ui/badge'
import { Button } from '@/components/dashboard/ui/button'
import { Loader2, FolderTree, Package, Tag } from 'lucide-react'
import Link from 'next/link'
import { CategoriesFilterClient } from './_components/categories-filter-client'
import { getCachedCategoriesWithCount, getCachedCollections } from '@/lib/queries/cached-queries'

interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    isActive: boolean
    parentId: string | null
    collectionId: string | null
    collection: {
        id: string
        name: string
        slug: string
        icon: string | null
    } | null
    _count: {
        products: number
    }
}

interface Collection {
    id: string
    name: string
    slug: string
    icon: string | null
    _count: {
        categories: number
    }
}

// Loading skeleton component
function CategoriesPageSkeleton() {
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <div className="h-9 w-64 bg-muted animate-pulse rounded mb-2" />
                <div className="h-5 w-96 bg-muted animate-pulse rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
                ))}
            </div>
        </div>
    )
}

// Server Component to fetch data with caching
async function CategoriesData() {
    // ✅ Use cached queries for better performance  
    const [categories, collections] = await Promise.all([
        getCachedCategoriesWithCount(),
        getCachedCollections()
    ])

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Product Categories</h1>
                <p className="text-muted-foreground">
                    Browse available categories for your products
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <FolderTree className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{categories.length}</p>
                                <p className="text-sm text-muted-foreground">Total Categories</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Tag className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{collections.length}</p>
                                <p className="text-sm text-muted-foreground">Collections</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {categories.reduce((sum, cat) => sum + cat._count.products, 0)}
                                </p>
                                <p className="text-sm text-muted-foreground">Total Products</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Client component for filtering */}
            <CategoriesFilterClient categories={categories} collections={collections}>
                {(filteredCategories) => (
                    <>
                        {/* Categories Grid */}
                        {filteredCategories.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredCategories.map((category) => (
                                    <Card key={category.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg">{category.name}</CardTitle>
                                                    {category.description && (
                                                        <CardDescription className="mt-1">
                                                            {category.description}
                                                        </CardDescription>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {category.collection && (
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary">
                                                            {category.collection.name}
                                                        </Badge>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Products in category
                                                    </span>
                                                    <Badge variant="outline">
                                                        {category._count.products}
                                                    </Badge>
                                                </div>
                                                <Link href={`/seller/products/create?category=${category.id}`}>
                                                    <Button size="sm" variant="outline" className="w-full">
                                                        Create Product in This Category
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FolderTree className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Categories Found</h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        )}
                    </>
                )}
            </CategoriesFilterClient>
        </div>
    )
}

// Main page component (Server Component)
export default function SellerCategoriesPage() {
    return (
        <Suspense fallback={<CategoriesPageSkeleton />}>
            <CategoriesData />
        </Suspense>
    )
}
