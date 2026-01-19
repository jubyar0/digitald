"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { publicApi } from "@/lib/api";
import { MagicCard } from "@/components/ui/magic-card";

interface RelatedProductsCarouselProps {
    currentProductId: string;
    category: string;
}

interface Product {
    id: string;
    name: string;
    thumbnail: string | null;
    price: number;
    rating?: number;
    reviewCount?: number;
    vendor?: {
        name: string;
    };
}

export function RelatedProductsCarousel({ currentProductId, category }: RelatedProductsCarouselProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                // Fetch published products
                const response = await publicApi.getPublishedProducts({ limit: 12 });
                const productList = (response as any)?.products || [];

                // Filter out current product and add mock data for demo
                const filtered = productList
                    .filter((p: any) => p.id !== currentProductId)
                    .map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        thumbnail: p.thumbnail || p.images?.[0]?.url || '/placeholder.jpg',
                        price: p.price || 0,
                        rating: 4.5 + Math.random() * 0.5,
                        reviewCount: Math.floor(Math.random() * 500) + 50,
                        vendor: p.vendor
                    }));

                setProducts(filtered);
            } catch (error) {
                console.error('Failed to fetch related products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [currentProductId]);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollButtons);
            checkScrollButtons();
            return () => container.removeEventListener('scroll', checkScrollButtons);
        }
    }, [products]);

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-12">
                <div className="flex gap-4 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-48 shrink-0 animate-pulse">
                            <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                            <div className="h-4 bg-gray-200 rounded mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">You may also like</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className={cn(
                                "h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center transition-all",
                                canScrollLeft
                                    ? "hover:bg-gray-100 text-gray-700"
                                    : "opacity-40 cursor-not-allowed text-gray-400"
                            )}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className={cn(
                                "h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center transition-all",
                                canScrollRight
                                    ? "hover:bg-gray-100 text-gray-700"
                                    : "opacity-40 cursor-not-allowed text-gray-400"
                            )}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Products Carousel */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            {/* Second Section - Shoppers with similar taste */}
            <div className="container mx-auto px-4 mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Shoppers with similar taste loved</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {products.slice(0, 6).map((product) => (
                        <ProductCard key={`similar-${product.id}`} product={product} compact />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
    }).format(product.price);

    return (
        <MagicCard
            className={cn(
                "group shrink-0 rounded-xl overflow-hidden",
                compact ? "w-full" : "w-48"
            )}
            gradientColor="#f97316"
            gradientOpacity={0.15}
        >
            <Link
                href={`/3d-models/products/${product.id}`}
                className="block"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image
                        src={product.thumbnail || '/placeholder.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                    />

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsWishlisted(!isWishlisted);
                        }}
                        className={cn(
                            "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow flex items-center justify-center transition-all",
                            isHovered || isWishlisted ? "opacity-100" : "opacity-0"
                        )}
                    >
                        <Heart className={cn(
                            "h-4 w-4",
                            isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600"
                        )} />
                    </button>
                </div>

                {/* Info */}
                <div className="p-3">
                    {/* Price */}
                    <div className="font-bold text-gray-900 mb-1">
                        {product.price === 0 ? 'Free' : formattedPrice}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm text-gray-700 line-clamp-2 mb-2 group-hover:underline">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "h-3 w-3",
                                        i < Math.floor(product.rating || 4)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">
                            ({product.reviewCount || 0})
                        </span>
                    </div>

                    {/* Seller */}
                    {product.vendor && !compact && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                            {product.vendor.name}
                        </p>
                    )}
                </div>
            </Link>
        </MagicCard>
    );
}
