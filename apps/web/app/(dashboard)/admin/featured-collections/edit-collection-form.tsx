"use client"

import { useState } from "react"
import { updateFeaturedCollection } from "@/actions/admin-featured-collections"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, X } from "lucide-react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Product {
    id: string
    name: string
    thumbnail: string | null
    price: number
    currency: string
}

interface Collection {
    id: string
    identifier: string
    title: string
    products: Product[]
}

interface EditCollectionFormProps {
    collection: Collection
    availableProducts: Product[]
}

export function EditCollectionForm({ collection, availableProducts }: EditCollectionFormProps) {
    const [title, setTitle] = useState(collection.title)
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
        collection.products.map(p => p.id)
    )
    const [isSaving, setIsSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const handleToggleProduct = (productId: string) => {
        if (selectedProductIds.includes(productId)) {
            setSelectedProductIds(prev => prev.filter(id => id !== productId))
        } else {
            setSelectedProductIds(prev => [...prev, productId])
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const result = await updateFeaturedCollection(collection.identifier, {
                title,
                productIds: selectedProductIds
            })

            if (result.success) {
                toast.success("Collection updated successfully")
            } else {
                toast.error("Failed to update collection")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsSaving(false)
        }
    }

    const filteredProducts = availableProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const selectedProductsDetails = availableProducts.filter(p => selectedProductIds.includes(p.id))

    return (
        <div className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor={`title-${collection.id}`}>Display Title</Label>
                <Input
                    id={`title-${collection.id}`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter section title"
                />
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Selected Products ({selectedProductIds.length})</Label>

                    {selectedProductIds.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {selectedProductsDetails.map(p => (
                                <div key={p.id} className="flex items-center gap-2 bg-secondary/50 rounded-md p-1 pr-2 border">
                                    <div className="relative w-8 h-8 rounded overflow-hidden bg-muted">
                                        {p.thumbnail && (
                                            <Image
                                                src={p.thumbnail}
                                                alt={p.name}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <span className="text-xs truncate max-w-[150px]">{p.name}</span>
                                    <button
                                        onClick={() => handleToggleProduct(p.id)}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No products selected</p>
                    )}
                </div>

                <div className="border rounded-md p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Add Products</Label>
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[200px] h-8"
                        />
                    </div>

                    <ScrollArea className="h-[200px]">
                        <div className="space-y-2">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="flex items-start space-x-3 p-2 hover:bg-secondary/20 rounded transition-colors">
                                    <Checkbox
                                        id={`product-${product.id}`}
                                        checked={selectedProductIds.includes(product.id)}
                                        onCheckedChange={() => handleToggleProduct(product.id)}
                                    />
                                    <div className="grid gap-1.5 leading-none w-full">
                                        <label
                                            htmlFor={`product-${product.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="relative w-8 h-8 rounded overflow-hidden bg-muted">
                                                    {product.thumbnail && (
                                                        <Image
                                                            src={product.thumbnail}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <span>{product.name}</span>
                                            </div>
                                            <span className="text-muted-foreground">{product.currency} {product.price}</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </div>
    )
}
