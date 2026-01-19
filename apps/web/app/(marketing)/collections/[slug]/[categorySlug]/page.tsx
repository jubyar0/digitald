import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Star, Download } from 'lucide-react'

interface CategoryProductsPageProps {
    params: {
        slug: string
        categorySlug: string
    }
}

// Type for category with collection (until Prisma generates new types)
type CategoryWithRelations = {
    id: string
    name: string
    slug: string
    description?: string | null
    collection?: {
        id: string
        name: string
        slug: string
    } | null
    products: Array<{
        id: string
        name: string
        description: string
        price: number
        thumbnail?: string | null
        downloads: number
        vendor: {
            id: string
            name: string
            avatar?: string | null
            averageRating: number
        }
        reviews: Array<{
            rating: number
        }>
    }>
}

export async function generateMetadata({ params }: CategoryProductsPageProps) {
    try {
        const category = await prisma.category.findUnique({
            where: { slug: params.categorySlug },
            select: {
                name: true,
            },
        })

        if (!category) {
            return {
                title: 'Category Not Found',
            }
        }

        return {
            title: `${category.name} | Digital Marketplace`,
            description: `Browse ${category.name} products`,
        }
    } catch (error) {
        return {
            title: 'Category Not Found',
        }
    }
}

export default async function CategoryProductsPage({ params }: CategoryProductsPageProps) {
    let category: CategoryWithRelations | null = null

    try {
        // Fetch category with products (collection relation might not exist yet)
        const rawCategory = await prisma.category.findUnique({
            where: { slug: params.categorySlug },
            select: {
                id: true,
                name: true,
                slug: true,
                products: {
                    where: {
                        isActive: true,
                        status: 'PUBLISHED',
                    },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        thumbnail: true,
                        downloads: true,
                        vendor: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                averageRating: true,
                            },
                        },
                        reviews: {
                            select: {
                                rating: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        })

        if (rawCategory) {
            category = {
                ...rawCategory,
                description: null, // Will be added when schema is updated
                collection: null, // Will be populated when migration runs
                products: rawCategory.products,
            }
        }
    } catch (error) {
        console.error('Error fetching category:', error)
    }

    if (!category) {
        notFound()
    }

    // Calculate average rating for each product
    const productsWithRatings = category.products.map((product) => {
        const avgRating =
            product.reviews.length > 0
                ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / product.reviews.length
                : 0

        return {
            ...product,
            averageRating: avgRating,
            reviewCount: product.reviews.length,
        }
    })

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/collections" className="hover:text-foreground">
                        Collections
                    </Link>
                    <span>/</span>
                    <Link
                        href={`/collections/${params.slug}`}
                        className="hover:text-foreground"
                    >
                        {category.collection?.name || params.slug}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{category.name}</span>
                </div>

                {/* Category Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
                    {category.description && (
                        <p className="text-lg text-muted-foreground max-w-3xl">
                            {category.description}
                        </p>
                    )}
                    <div className="mt-4">
                        <Badge variant="secondary">
                            {productsWithRatings.length} product{productsWithRatings.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </div>

                {/* Products Grid */}
                {productsWithRatings.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">
                            No products in this category yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productsWithRatings.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="group"
                            >
                                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 overflow-hidden">
                                    {/* Product Image */}
                                    <div className="aspect-square w-full overflow-hidden bg-muted">
                                        {product.thumbnail ? (
                                            <img
                                                src={product.thumbnail}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader className="pb-3">
                                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {product.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="pb-3">
                                        {/* Vendor Info */}
                                        <div className="flex items-center gap-2 mb-3">
                                            {product.vendor.avatar ? (
                                                <img
                                                    src={product.vendor.avatar}
                                                    alt={product.vendor.name}
                                                    className="w-6 h-6 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-muted" />
                                            )}
                                            <span className="text-sm text-muted-foreground">
                                                {product.vendor.name}
                                            </span>
                                        </div>

                                        {/* Rating */}
                                        {product.averageRating > 0 && (
                                            <div className="flex items-center gap-1 text-sm">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-medium">
                                                    {product.averageRating.toFixed(1)}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    ({product.reviewCount})
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>

                                    <CardFooter className="pt-0">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="text-2xl font-bold">
                                                ${product.price.toFixed(2)}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Download className="h-4 w-4" />
                                                <span>{product.downloads || 0}</span>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
