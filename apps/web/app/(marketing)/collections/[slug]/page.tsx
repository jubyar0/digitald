import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCollectionBySlug } from '@/actions/collections'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface CollectionPageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: CollectionPageProps) {
    const collection = await getCollectionBySlug(params.slug)

    if (!collection) {
        return {
            title: 'Collection Not Found',
        }
    }

    return {
        title: `${collection.name} | Digital Marketplace`,
        description: collection.description || `Browse ${collection.name} categories`,
    }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const collection = await getCollectionBySlug(params.slug)

    if (!collection) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link href="/collections">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Collections
                    </Button>
                </Link>

                {/* Collection Header */}
                <div className="mb-12">
                    {collection.image && (
                        <div className="aspect-[21/9] w-full overflow-hidden rounded-lg mb-6">
                            <img
                                src={collection.image}
                                alt={collection.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                        {collection.icon && (
                            <span className="text-5xl">{collection.icon}</span>
                        )}
                        <h1 className="text-4xl font-bold">{collection.name}</h1>
                    </div>
                    {collection.description && (
                        <p className="text-lg text-muted-foreground max-w-3xl">
                            {collection.description}
                        </p>
                    )}
                </div>

                {/* Categories Grid */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6">Categories</h2>
                    {collection.categories.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">
                                No categories in this collection yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {collection.categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/collections/${params.slug}/${category.slug}`}
                                    className="group"
                                >
                                    <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="group-hover:text-primary transition-colors">
                                                    {category.name}
                                                </CardTitle>
                                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            {category.description && (
                                                <CardDescription>{category.description}</CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent>
                                            <Badge variant="secondary">
                                                {category._count?.products || 0} products
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
