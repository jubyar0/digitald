"use client"

import Image from "next/image"
import Link from "next/link"
import { BlurFade } from "@/components/ui/blur-fade"
import { DotPattern } from "@/components/ui/dot-pattern"

interface Product {
    id: string
    name: string
    thumbnail: string | null
    price: number
    vendor: {
        name: string
    } | null
}

function ProductCard({ product, index }: { product: Product; index: number }) {
    return (
        <BlurFade delay={0.05 + index * 0.03} inView>
            <Link href={`/products/${product.id}`} className="group block">
                <div className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-lg">
                    <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        {product.thumbnail ? (
                            <Image
                                src={product.thumbnail}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-4xl opacity-30">📦</span>
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="text-[15px] font-medium text-neutral-900 dark:text-white line-clamp-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                                {product.name}
                            </h3>
                            <span className="text-[15px] font-semibold text-neutral-900 dark:text-white shrink-0">
                                {product.price === 0 ? "Free" : `$${product.price}`}
                            </span>
                        </div>
                        {product.vendor && (
                            <p className="text-[13px] text-neutral-500 mt-1">
                                {product.vendor.name}
                            </p>
                        )}
                    </div>
                </div>
            </Link>
        </BlurFade>
    )
}

interface FeaturedProductsClientProps {
    products: Product[]
}

export default function FeaturedProductsClient({ products }: FeaturedProductsClientProps) {
    if (!products || products.length === 0) {
        return null
    }

    return (
        <section className="relative py-24 bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden">
            {/* Subtle Dot Pattern Background */}
            <DotPattern
                className="absolute inset-0 text-neutral-300 dark:text-neutral-700 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"
                width={24}
                height={24}
                cr={1}
            />

            <div className="container relative z-10 mx-auto px-4">
                {/* Section Header */}
                <BlurFade delay={0.1} inView>
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                                New This Week
                            </h2>
                            <p className="text-neutral-500 mt-1">
                                Fresh products from our creators
                            </p>
                        </div>
                        <Link
                            href="/products?sort=newest"
                            className="text-[15px] font-medium text-neutral-900 dark:text-white hover:opacity-70 transition-opacity"
                        >
                            View all →
                        </Link>
                    </div>
                </BlurFade>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product: Product, index: number) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
