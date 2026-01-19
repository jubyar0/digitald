"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

interface ProductCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    thumbnail: string | null;
    views: number;
    downloads: number;
    vendor: {
        id: string;
        name: string;
        avatar: string | null;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
    _count: {
        reviews: number;
    };
}

export function ProductCard({ product, priority = false, sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" }: { product: ProductCardProps; priority?: boolean; sizes?: string }) {
    return (
        <div className="group relative">
            <Link href={`/${product.category.slug}/products/${product.id}`} className="block">
                <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 transition-all duration-200 hover:shadow-md">
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        {product.thumbnail ? (
                            <Image
                                src={product.thumbnail}
                                alt={product.name}
                                fill
                                priority={priority}
                                sizes={sizes}
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-100">
                                <span className="text-4xl opacity-50">📦</span>
                            </div>
                        )}

                        {/* Hover Overlay - Etsy style subtle darkening */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                {/* Product Info */}
                <div className="mt-3 pr-2">
                    <h3 className="font-medium text-gray-900 text-[15px] leading-snug truncate group-hover:underline decoration-1 underline-offset-2">
                        {product.name}
                    </h3>

                    {/* Vendor / Rating */}
                    <p className="text-xs text-gray-500 mt-1 truncate">
                        {product.vendor.name}
                    </p>

                    {/* Price */}
                    <div className="mt-1.5 flex items-center gap-2">
                        <span className="font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                        </span>
                        {/* Optional Sales Badge or Original Price */}
                    </div>
                </div>
            </Link>

            {/* Favorite Button - Absolute positioned overlay */}
            <button
                className="absolute top-3 right-3 p-2 rounded-full bg-white hover:bg-gray-50 text-gray-600 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border border-gray-100"
                aria-label="Add to favorites"
                onClick={(e) => {
                    e.preventDefault();
                    // Add to favorites logic here
                }}
            >
                <Heart className="w-4 h-4" />
            </button>
        </div>
    );
}
