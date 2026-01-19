"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRecentlyViewedProducts } from "@/actions/recently-viewed";
import { Clock } from "lucide-react";

interface RecentlyViewedProduct {
    id: string;
    name: string;
    price: number;
    thumbnail: string | null;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    createdAt: Date;
}

export function RecentlyViewedSection() {
    const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadRecentlyViewed() {
            try {
                // Get product IDs from localStorage
                const recentlyViewedIds = localStorage.getItem('recentlyViewed');
                if (!recentlyViewedIds) {
                    setIsLoading(false);
                    return;
                }

                const ids = JSON.parse(recentlyViewedIds) as string[];
                if (ids.length === 0) {
                    setIsLoading(false);
                    return;
                }

                // Fetch product details
                const fetchedProducts = await getRecentlyViewedProducts(ids);
                setProducts(fetchedProducts as RecentlyViewedProduct[]);
            } catch (error) {
                console.error('Error loading recently viewed products:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadRecentlyViewed();
    }, []);

    if (isLoading || products.length === 0) {
        return null;
    }

    return (
        <div className="border-t border-border bg-muted/30 py-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-2 mb-6">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-2xl font-bold text-foreground">Recently Viewed</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/${product.category.slug}/products/${product.id}`}
                            className="group block"
                        >
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                                {product.thumbnail ? (
                                    <Image
                                        src={product.thumbnail}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                                        <span className="text-4xl">📦</span>
                                    </div>
                                )}

                                {/* Category Badge */}
                                <div className="absolute top-2 left-2">
                                    <span className="px-2 py-0.5 text-xs font-medium bg-background/90 backdrop-blur rounded-full border border-border">
                                        {product.category.name}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-sm font-bold text-primary">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
