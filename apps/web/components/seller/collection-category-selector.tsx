'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { getCollections } from '@/actions/collections'
import { getProductCategories } from '@/actions/vendor-products'

interface Collection {
    id: string
    name: string
    slug: string
}

interface Category {
    id: string
    name: string
    slug: string
    isActive?: boolean
    description?: string | null
    parentId?: string | null
    collectionId?: string | null
    collection?: {
        id: string
        name: string
        slug: string
    } | null
}

interface CollectionCategorySelectorProps {
    value?: {
        collectionId?: string
        categoryId?: string
    }
    onChange: (data: { collectionId?: string; categoryId: string }) => void
    required?: boolean
}

export function CollectionCategorySelector({
    value,
    onChange,
    required = false,
}: CollectionCategorySelectorProps) {
    const [collections, setCollections] = useState<Collection[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCollection, setSelectedCollection] = useState<string>(
        value?.collectionId || ''
    )
    const [selectedCategory, setSelectedCategory] = useState<string>(
        value?.categoryId || ''
    )
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCollections()
    }, [])

    useEffect(() => {
        if (selectedCollection) {
            loadCategories(selectedCollection)
        } else {
            loadCategories()
        }
    }, [selectedCollection])

    const loadCollections = async () => {
        try {
            const data = await getCollections()
            setCollections(data)
        } catch (error) {
            console.error('Failed to load collections:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadCategories = async (collectionId?: string) => {
        try {
            const data = await getProductCategories(collectionId)
            setCategories(data)
        } catch (error) {
            console.error('Failed to load categories:', error)
        }
    }

    const handleCollectionChange = (collectionId: string) => {
        setSelectedCollection(collectionId)
        setSelectedCategory('') // Reset category when collection changes
    }

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId)
        onChange({
            collectionId: selectedCollection || undefined,
            categoryId,
        })
    }

    if (loading) {
        return <div className="text-sm text-muted-foreground">Loading...</div>
    }

    return (
        <div className="grid gap-4">
            {/* Collection Selector */}
            <div className="grid gap-2">
                <Label htmlFor="collection">
                    Collection {!required && '(Optional)'}
                </Label>
                <Select value={selectedCollection} onValueChange={handleCollectionChange}>
                    <SelectTrigger id="collection">
                        <SelectValue placeholder="Select a collection" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Collections</SelectItem>
                        {collections.map((collection) => (
                            <SelectItem key={collection.id} value={collection.id}>
                                {collection.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    Filter categories by collection (e.g., Textures, Models, HDRIs)
                </p>
            </div>

            {/* Category Selector */}
            <div className="grid gap-2">
                <Label htmlFor="category">
                    Category {required && '*'}
                </Label>
                <Select
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
                    required={required}
                >
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.length === 0 ? (
                            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                                {selectedCollection
                                    ? 'No categories in this collection'
                                    : 'No categories available'}
                            </div>
                        ) : (
                            categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                    {category.collection && (
                                        <span className="text-muted-foreground ml-2">
                                            ({category.collection.name})
                                        </span>
                                    )}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    Choose the category for your product
                </p>
            </div>
        </div>
    )
}
