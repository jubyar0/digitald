"use client";

import { EtsyProductGallery } from "@/components/3dm/etsy-product-gallery";
import { EtsyProductInfo } from "@/components/3dm/etsy-product-info";
import { ProductReviewsSection } from "@/components/3dm/product-reviews-section";
import { SellerCard } from "@/components/3dm/seller-card";
import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronRight, Heart, Info } from "lucide-react";

interface ProductData {
    id: string;
    name: string;
    description: string | null;
    price: number;
    currency: string;
    thumbnail: string | null;
    views: number;
    downloads: number;
    likes: number;
    averageRating: number;
    totalReviews: number;
    vendor: {
        id: string;
        name: string;
        avatar: string | null;
        averageRating: number;
        totalReviews: number;
        totalFollowers: number;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
    reviews: Array<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        user: {
            id: string;
            name: string | null;
        };
    }>;
    textureFiles?: any;
    licenseInfo?: any;
    nativeFileFormats?: any;
    universalFileFormats?: any;
}

interface EtsyProductContentProps {
    product: ProductData;
    productImages: string[];
    relatedProducts: any[];
}

const relatedSearchTags = [
    "Leather Coin Purse", "Personalised Gift", "Custom Wallet", "Birthday Gift",
    "Christmas Gift", "Handmade Leather", "Women's Accessories", "Monogram Gift"
];

export function EtsyProductContent({ product, productImages, relatedProducts }: EtsyProductContentProps) {
    const material = {
        id: product.id,
        name: product.name,
        category: product.category?.name || 'Uncategorized',
        imageUrl: product.thumbnail || '/placeholder.jpg',
        tags: [],
        images: productImages,
        description: product.description || '',
        type: 'Model' as const,
        isFree: product.price === 0,
        price: product.price,
        fileFormat: product.nativeFileFormats?.[0]?.format || 'Unknown',
        fileSize: 'Digital Download',
        resolution: product.textureFiles?.defaultResolution || 'Unknown',
        license: product.licenseInfo?.type || 'Standard',
        specifications: [],
        artist: product.vendor?.name || 'Unknown',
        publishedDate: 'Recently',
        views: product.views?.toString() || '0',
        downloads: product.downloads?.toString() || '0',
        likes: product.likes?.toString() || '0',
        textureMaps: product.textureFiles?.textures?.map((t: any) => t.type) || [],
        includes: product.universalFileFormats?.map((f: any) => f.format) || []
    };

    const similarItems = relatedProducts.slice(0, 6);
    const youMayAlsoLike = relatedProducts.slice(0, 8);

    return (
        <main className="flex-1 bg-white">
            {/* Similar Items - Top */}
            {similarItems.length > 0 && (
                <section className="border-b border-gray-200 bg-white py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-2 mb-3">
                            <h2 className="text-base font-semibold text-gray-900">Similar items</h2>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                Including ads
                                <button className="hover:text-gray-700">
                                    <Info className="h-3 w-3" />
                                </button>
                            </span>
                            <Link href="/search" className="text-sm text-gray-600 hover:underline ml-auto flex items-center gap-1">
                                See more <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {similarItems.map((item) => (
                                <Link key={item.id} href={`/3d-models/products/${item.id}`} className="flex-shrink-0 w-[213px] group">
                                    <div className="relative w-[213px] h-[169px] rounded-lg overflow-hidden bg-gray-100 mb-2">
                                        {item.thumbnail ? (
                                            <Image src={item.thumbnail} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-200" sizes="213px" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                        )}
                                    </div>
                                    <h3 className="text-sm text-gray-700 line-clamp-1 mb-0.5 group-hover:underline">{item.name}</h3>
                                    <p className="text-xs text-gray-500 mb-1">Ad by Etsy seller</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">USD {item.price?.toFixed(2) || '0.00'}</span>
                                        {item.originalPrice && item.originalPrice > item.price && (
                                            <span className="text-xs text-gray-500 line-through">USD {item.originalPrice.toFixed(2)}</span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}


            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                    <Link href="/" className="hover:text-gray-900 hover:underline">Homepage</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/products" className="hover:text-gray-900 hover:underline">Products</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href={`/categories/${product.category?.slug}`} className="hover:text-gray-900 hover:underline">{product.category?.name}</Link>
                </nav>

                {/* Two Column Grid */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT COLUMN - Gallery + Seller Card + Reviews */}
                    <div className="lg:w-[55%] space-y-8">
                        <BlurFade delay={0.1}>
                            <EtsyProductGallery
                                images={productImages.length > 0 ? productImages : ['/placeholder.jpg']}
                                productName={product.name}
                            />
                        </BlurFade>

                        {/* Seller Card - In LEFT Column */}
                        <BlurFade delay={0.15}>
                            <SellerCard
                                vendor={{
                                    id: product.vendor?.id || '',
                                    name: product.vendor?.name || 'SbriStudio',
                                    avatar: product.vendor?.avatar,
                                    rating: product.vendor?.averageRating || 4.9,
                                    reviewCount: product.vendor?.totalReviews || 2800,
                                    salesCount: product.vendor?.totalFollowers || 16700,
                                    location: "Ringwood, United Kingdom",
                                    yearsOnPlatform: 5
                                }}
                                products={relatedProducts.slice(0, 4)}
                            />
                        </BlurFade>

                        {/* Reviews for this item */}
                        <BlurFade delay={0.2}>
                            <ProductReviewsSection
                                productId={product.id}
                                reviews={product.reviews}
                                averageRating={product.averageRating}
                                totalReviews={product.totalReviews}
                            />
                        </BlurFade>
                    </div>

                    {/* RIGHT COLUMN - Product Info only (Sticky) */}
                    <div className="lg:w-[45%]">
                        <div className="lg:sticky lg:top-[160px]">
                            <BlurFade delay={0.12}>
                                <EtsyProductInfo
                                    material={material}
                                    productId={product.id}
                                    vendor={{
                                        id: product.vendor?.id || '',
                                        name: product.vendor?.name || 'Unknown',
                                        avatar: product.vendor?.avatar || undefined,
                                        rating: product.vendor?.averageRating || 5,
                                        reviewCount: product.vendor?.totalReviews || 0,
                                        salesCount: product.vendor?.totalFollowers || 0,
                                    }}
                                />
                            </BlurFade>
                        </div>
                    </div>
                </div>
            </div>

            {/* You may also like */}
            {youMayAlsoLike.length > 0 && (
                <section className="border-t border-gray-200 bg-gray-50 py-8">
                    <div className="container mx-auto px-4">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">You may also like</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {youMayAlsoLike.slice(0, 6).map((item) => (<ProductCard key={item.id} product={item} />))}
                        </div>
                    </div>
                </section>
            )}

            {/* Explore related searches */}
            <section className="border-t border-gray-200 bg-white py-6">
                <div className="container mx-auto px-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-3">Explore related searches</h2>
                    <div className="flex flex-wrap gap-2">
                        {relatedSearchTags.map((tag, idx) => (
                            <Link key={idx} href={`/search?q=${encodeURIComponent(tag)}`} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                    {relatedProducts[idx]?.thumbnail && <Image src={relatedProducts[idx].thumbnail} alt={tag} width={24} height={24} className="w-full h-full object-cover" />}
                                </div>
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

function ProductCard({ product }: { product: any }) {
    return (
        <Link href={`/3d-models/products/${product.id}`} className="group block">
            <div className="relative aspect-square rounded overflow-hidden bg-gray-100 mb-1.5">
                {product.thumbnail ? (
                    <Image src={product.thumbnail} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-200" sizes="(max-width: 640px) 50vw, 16vw" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                )}
                <button className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                    <Heart className="h-3 w-3 text-gray-600" />
                </button>
            </div>
            <div className="space-y-0.5">
                <div className="font-medium text-gray-900 text-sm">EUR {product.price?.toFixed(2) || '0.00'}</div>
                <h3 className="text-xs text-gray-600 line-clamp-2 group-hover:underline">{product.name}</h3>
                {product.vendor && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="truncate">{product.vendor.name}</span>
                        <Star className="h-3 w-3 text-gray-900 fill-gray-900" />
                    </div>
                )}
            </div>
        </Link>
    );
}
