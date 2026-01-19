"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { ProductCard } from "@/components/products/product-card"
import { CardSpotlight } from "@/components/ui/card-spotlight"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

interface Product {
    id: string
    name: string
    description: string
    price: number
    currency: string
    thumbnail: string | null
    views: number
    downloads: number
    vendor: {
        id: string
        name: string
        avatar: string | null
    }
    category: {
        id: string
        name: string
        slug: string
    }
    _count: {
        reviews: number
    }
}

interface Category {
    id: string
    name: string
    slug: string
    image?: string // Assuming we might have images for categories, if not we'll placeholder
}

interface HeroSectionClientProps {
    products: Product[]
    categories: Category[]
}

export default function HeroSectionClient({ products, categories }: HeroSectionClientProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Etsy often uses a secondary beige background for the top welcome area or just clean white
    // Circles for categories

    return (
        <section className="min-h-screen bg-white pt-20">
            {/* Welcome Banner / Hero */}
            <div className="bg-[#fdfbf6] py-16 md:py-24 border-b border-gray-100">
                <div className="container mx-auto px-4 lg:px-6 text-center">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6 tracking-tight font-medium">
                        Find things you&apos;ll love. Support independent creators.
                    </h1>

                    {/* Circle Categories */}
                    <div className="mt-12">
                        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                            {categories.slice(0, 6).map((category, i) => (
                                <Link key={category.id} href={`/products?category=${category.slug}`} className="group flex flex-col items-center gap-4">
                                    <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden bg-white shadow-sm border border-gray-200 group-hover:shadow-md transition-all duration-300">
                                        {/* Placeholder or actual category image if available */}
                                        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-400">
                                            {/* If we had images we'd put them here. For now simpler generic icons/colors or just defaults */}
                                            {category.image ? (
                                                <Image src={category.image} alt={category.name} fill className="object-cover" />
                                            ) : (
                                                <span className="text-xs font-medium">Image</span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-base font-semibold text-gray-900 group-hover:underline decoration-2 underline-offset-4 decoration-gray-900">
                                        {category.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products Grid */}
            <div className="container mx-auto px-4 lg:px-6 py-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                        Fresh from the community
                    </h2>
                    <Link
                        href="/products"
                        className="text-sm font-medium text-foreground hover:underline"
                    >
                        View all items
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.slice(0, 8).map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            priority={index === 0}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    ))}
                </div>

                {/* Secondary Banner with CardSpotlight */}
                <CardSpotlight className="mt-16 w-full">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-xl font-bold relative z-20 text-white font-serif mb-2">
                                Sell your 3D models & assets
                            </p>
                            <p className="text-neutral-300 relative z-20">
                                Join our growing marketplace of creators today.
                            </p>
                        </div>
                        <Link href="/sell" className="relative z-20">
                            <HoverBorderGradient
                                containerClassName="rounded-full"
                                as="span"
                                className="dark:bg-black bg-black text-white flex items-center space-x-2 font-bold"
                            >
                                Get Started
                            </HoverBorderGradient>
                        </Link>
                    </div>
                </CardSpotlight>

            </div>
        </section>
    )
}
