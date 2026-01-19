import {
    getAllFeaturedCollectionsCached,
    getAvailableProductsCached,
    ensureDefaultCollections
} from "@/actions/admin-featured-collections"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { EditCollectionForm } from "./edit-collection-form"

export default async function FeaturedCollectionsPage() {
    // Ensure default collections exist (runs only if needed)
    await ensureDefaultCollections()

    // Use cached data fetching - much faster than direct Prisma
    const [collections, availableProducts] = await Promise.all([
        getAllFeaturedCollectionsCached(),
        getAvailableProductsCached()
    ])

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Featured Collections</h3>
                <p className="text-sm text-muted-foreground">
                    Manage the content of dynamic sections on the landing page.
                </p>
            </div>
            <Separator />

            <div className="grid gap-6">
                {collections.map(collection => (
                    <Card key={collection.id}>
                        <CardHeader>
                            <CardTitle>{collection.title}</CardTitle>
                            <CardDescription>Identifier: {collection.identifier}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditCollectionForm
                                collection={collection}
                                availableProducts={availableProducts}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

