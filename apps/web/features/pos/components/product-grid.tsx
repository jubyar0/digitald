'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Loader2 } from 'lucide-react'
import { getPosProducts } from '../actions'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface Product {
    id: string
    name: string
    price: number
    thumbnail: string | null
    category: { name: string }
}

interface ProductGridProps {
    onAddToCart: (product: Product) => void
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
    const [query, setQuery] = useState('')
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts()
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const loadProducts = async () => {
        setIsLoading(true)
        try {
            const data = await getPosProducts(query)
            setProducts(data as any)
        } catch (error) {
            console.error('Failed to load products', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    className="pl-10 bg-background"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                        {products.map((product) => (
                            <Card 
                                key={product.id} 
                                className="cursor-pointer hover:border-primary transition-colors overflow-hidden"
                                onClick={() => onAddToCart(product)}
                            >
                                <div className="aspect-square relative bg-muted">
                                    {product.thumbnail ? (
                                        <Image
                                            src={product.thumbnail}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-3">
                                    <h3 className="font-medium text-sm truncate" title={product.name}>
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-muted-foreground truncate max-w-[50%]">
                                            {product.category?.name}
                                        </span>
                                        <span className="font-bold text-sm">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {products.length === 0 && (
                            <div className="col-span-full text-center py-10 text-muted-foreground">
                                No products found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
