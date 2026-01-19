import { Suspense } from 'react'
import Link from 'next/link'
import { getCollections } from '@/actions/collections'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight } from 'lucide-react'

export const metadata = {
    title: 'Browse Collections | Digital Marketplace',
    description: 'Explore our collections of digital assets',
}

export default async function CollectionsPage() {
    const collections = await getCollections()

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Browse Collections</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover high-quality digital assets organized by type. From textures to 3D models, find everything you need for your creative projects.
                    </p>
                </div>

                {/* Collections Grid */}
                {collections.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">No collections available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collections.map((collection) => (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.slug}`}
                                className="group"
                            >
                                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                                    {collection.image && (
                                        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                                            <img
                                                src={collection.image}
                                                alt={collection.name}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                {collection.icon && (
                                                    <span className="text-2xl">{collection.icon}</span>
                                                )}
                                                {collection.name}
                                            </CardTitle>
                                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        {collection.description && (
                                            <CardDescription>{collection.description}</CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <Badge variant="secondary">
                                            {collection._count?.categories || 0} categories
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
