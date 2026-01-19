"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Heart } from "lucide-react"

interface Product {
    id: string
    name: string
    thumbnail: string | null
    price: number
    currency: string
    vendor?: {
        name: string
    } | null
}

interface Collection {
    id: string
    identifier: string
    title: string
    products: Product[]
}

interface FeaturedTexturesProps {
    collections: Collection[]
}

export default function FeaturedTextures({ collections }: FeaturedTexturesProps) {
    // Find specific collections by identifier or use fallback/order
    const holidayFinds = collections.find(c => c.identifier === "holiday-finds")
    const pickedItems = collections.find(c => c.identifier === "picks-inspired")

    if (!holidayFinds && !pickedItems) return null

    return (
        <section className="py-12 bg-white border-b border-gray-100 space-y-16">

            {/* Section 1: Holiday finds for you */}
            {holidayFinds && holidayFinds.products.length > 0 && (
                <div className="container mx-auto px-4 lg:px-6 relative group/section">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-serif font-medium text-gray-900">{holidayFinds.title}</h2>
                    </div>

                    {/* Scroll Button - Left */}
                    <button
                        onClick={() => {
                            const container = document.getElementById('holiday-scroll-container');
                            if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-md border border-gray-200 text-gray-900 opacity-0 group-hover/section:opacity-100 transition-opacity hover:scale-105"
                        aria-label="Scroll left"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* Scroll Button - Right */}
                    <button
                        onClick={() => {
                            const container = document.getElementById('holiday-scroll-container');
                            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-md border border-gray-200 text-gray-900 opacity-0 group-hover/section:opacity-100 transition-opacity hover:scale-105"
                        aria-label="Scroll right"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    {/* Horizontal Scroll Container */}
                    <div
                        id="holiday-scroll-container"
                        className="relative -mx-4 px-4 lg:-mx-6 lg:px-6 overflow-x-auto pb-6 flex snap-x snap-mandatory gap-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                    >
                        {holidayFinds.products.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -4 }}
                                className="snap-start shrink-0 relative w-[200px] h-[200px] rounded-xl overflow-hidden cursor-pointer group"
                            >
                                <div className="relative w-full h-full bg-gray-100">
                                    {item.thumbnail ? (
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                    )}
                                </div>
                                {/* Pill Label */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-md border border-gray-100 whitespace-nowrap z-10 hover:scale-105 transition-transform max-w-[90%] text-center">
                                    <span className="text-[11px] font-bold text-gray-900 truncate block">{item.name}</span>
                                </div>
                            </motion.div>
                        ))}
                        {/* Spacer for right padding scroll */}
                        <div className="w-1 shrink-0" />
                    </div>
                </div>
            )}

            {/* Section 2: Picks inspired by your shopping */}
            {pickedItems && pickedItems.products.length > 0 && (
                <div className="container mx-auto px-4 lg:px-6 relative group/section">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif font-medium text-gray-900">{pickedItems.title}</h2>
                        <Link href="/products" className="text-sm font-medium text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full border border-gray-300 transition-colors">
                            View all
                        </Link>
                    </div>

                    {/* Scroll Button - Left */}
                    <button
                        onClick={() => {
                            const container = document.getElementById('picks-scroll-container');
                            if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                        }}
                        className="absolute left-2 top-1/2 z-20 p-2 rounded-full bg-white shadow-md border border-gray-200 text-gray-900 opacity-0 group-hover/section:opacity-100 transition-opacity hover:scale-105 hidden md:block"
                        aria-label="Scroll left"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* Scroll Button - Right */}
                    <button
                        onClick={() => {
                            const container = document.getElementById('picks-scroll-container');
                            if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                        }}
                        className="absolute right-2 top-1/2 z-20 p-2 rounded-full bg-white shadow-md border border-gray-200 text-gray-900 opacity-0 group-hover/section:opacity-100 transition-opacity hover:scale-105 hidden md:block"
                        aria-label="Scroll right"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <div
                        id="picks-scroll-container"
                        className="relative -mx-4 px-4 lg:-mx-6 lg:px-6 overflow-x-auto pb-6 flex snap-x snap-mandatory gap-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                    >
                        {pickedItems.products.map((product) => (
                            <div key={product.id} className="snap-start shrink-0 w-[180px] sm:w-[200px] group cursor-pointer">
                                <Link href={`/products/${product.id}`}>
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-transparent hover:shadow-md transition-all duration-200">
                                        {product.thumbnail ? (
                                            <Image
                                                src={product.thumbnail}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                        )}
                                        <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-400 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="mt-2 text-left">
                                        <h3 className="text-sm text-gray-900 font-medium truncate leading-tight" title={product.name}>{product.name}</h3>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="text-[10px] text-gray-500">Ad by {product.vendor?.name}</span>
                                        </div>
                                        <div className="mt-1 font-bold text-gray-900 text-sm">
                                            {product.currency} {product.price.toFixed(2)}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        {/* Spacer for right padding scroll */}
                        <div className="w-1 shrink-0" />
                    </div>
                </div>
            )}

        </section>
    )
}
