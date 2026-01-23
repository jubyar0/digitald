'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import { Input } from '@/components/dashboard/ui/input'
import { Button } from '@/components/dashboard/ui/button'
import { Badge } from '@/components/dashboard/ui/badge'
import { Search } from 'lucide-react'

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

interface CategoriesFilterClientProps {
    categories: Category[]
    collections: Collection[]
    children: (filteredCategories: Category[]) => React.ReactNode
}

export const CategoriesFilterClient = memo(function CategoriesFilterClient({
    categories,
    collections,
    children
}: CategoriesFilterClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

    const filteredCategories = useMemo(() => {
        return categories.filter(category => {
            const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                category.description?.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCollection = !selectedCollection || category.collectionId === selectedCollection
            return matchesSearch && matchesCollection
        })
    }, [categories, searchQuery, selectedCollection])

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    const handleCollectionClick = useCallback((collectionId: string | null) => {
        setSelectedCollection(collectionId)
    }, [])

    return (
        <>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Collections Filter */}
            {collections.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3">Filter by Collection</h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedCollection === null ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleCollectionClick(null)}
                        >
                            All Collections
                        </Button>
                        {collections.map((collection) => (
                            <Button
                                key={collection.id}
                                variant={selectedCollection === collection.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleCollectionClick(collection.id)}
                            >
                                {collection.name}
                                <Badge variant="secondary" className="ml-2">
                                    {collection._count.categories}
                                </Badge>
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Render filtered results */}
            {children(filteredCategories)}
        </>
    )
})
