"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ArrowRight, ArrowLeft } from "lucide-react"

interface Category {
    id: string
    name: string
    slug: string
    description?: string | null
}

interface Product {
    id: string
    name: string
    price: number
    currency: string
    thumbnail: string | null
    vendor?: {
        id: string
        name: string
        avatar?: string | null
    }
    category?: {
        id: string
        name: string
        slug: string
    }
}

interface ShopSelectionsProps {
    shopCategoriesVisible?: boolean
    freshCommunityVisible?: boolean
    categories?: Category[]
    freshProducts?: Product[]
}

// Fallback Mock Data for "Shop by Category"
const defaultCategories: Category[] = [
    { id: '1', name: "Jewelry & Accessories", slug: "jewelry-accessories" },
    { id: '2', name: "Clothing & Shoes", slug: "clothing-shoes" },
    { id: '3', name: "Home & Living", slug: "home-living" },
    { id: '4', name: "Wedding & Party", slug: "wedding-party" },
    { id: '5', name: "Toys & Entertainment", slug: "toys-entertainment" },
    { id: '6', name: "Art & Collectibles", slug: "art-collectibles" },
    { id: '7', name: "Craft Supplies", slug: "craft-supplies" },
    { id: '8', name: "Vintage", slug: "vintage" },
]

// Fallback Mock Data for "Fresh from the community"
const defaultFreshItems: Product[] = [
    { id: '1', name: "Custom Pet Portrait", price: 45.00, currency: "USD", thumbnail: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&q=80", vendor: { id: '1', name: "ArtByAnna" } },
    { id: '2', name: "Handmade Ceramic Mug", price: 28.00, currency: "USD", thumbnail: "https://images.unsplash.com/photo-1517260739837-6799d239ce83?w=400&q=80", vendor: { id: '2', name: "MuddyHands" } },
    { id: '3', name: "Linen Tablecloth", price: 55.00, currency: "USD", thumbnail: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80", vendor: { id: '3', name: "LinenLovers" } },
    { id: '4', name: "Vintage Camera", price: 120.00, currency: "USD", thumbnail: "https://images.unsplash.com/photo-1453754348246-552e89669524?w=400&q=80", vendor: { id: '4', name: "RetroFinds" } },
    { id: '5', name: "Leather Journal", price: 35.00, currency: "USD", thumbnail: "https://images.unsplash.com/photo-1515096788709-a3cf4ce0a4a6?w=400&q=80", vendor: { id: '5', name: "Boundless" } },
    { id: '6', name: "Succulent Planter", price: 18.00, currency: "USD", thumbnail: "https://images.unsplash.com/photo-1463936575229-46e3e91b6103?w=400&q=80", vendor: { id: '6', name: "GreenThumb" } },
    { id: '7', name: "Wooden Spoon", price: 12.00, currency: "USD", thumbnail: "https://images.unsplash.com/photo-1584269600464-3704b6c2a378?w=400&q=80", vendor: { id: '7', name: "Carved" } },
    { id: '8', name: "Knitted Scarf", price: 40.00, currency: "USD", thumbnail: "https://images.unsplash.com/photo-1520903920248-0c65313a1e64?w=400&q=80", vendor: { id: '8', name: "WarmKnits" } },
]

export default function ShopSelections({
    shopCategoriesVisible = true,
    freshCommunityVisible = true,
    categories = [],
    freshProducts = [],
}: ShopSelectionsProps) {
    // Use provided data or fallback to defaults
    const shopCategories = categories.length > 0 ? categories : defaultCategories
    const freshItems = freshProducts.length > 0 ? freshProducts : defaultFreshItems

    return (
        <div className="bg-white">

            {/* Shop by Category Section */}
            {shopCategoriesVisible && (
                <section className="py-12 border-b border-gray-100">
                    <div className="container mx-auto px-4 lg:px-6 relative group/section">
                        <h2 className="text-2xl font-serif font-medium text-gray-900 mb-6">Shop by Category</h2>

                        {/* Scroll Button - Left */}
                        <button
                            onClick={() => {
                                const container = document.getElementById('category-scroll-container');
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
                                const container = document.getElementById('category-scroll-container');
                                if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-md border border-gray-200 text-gray-900 opacity-0 group-hover/section:opacity-100 transition-opacity hover:scale-105"
                            aria-label="Scroll right"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <div
                            id="category-scroll-container"
                            className="relative -mx-4 px-4 lg:-mx-6 lg:px-6 overflow-x-auto pb-6 flex snap-x snap-mandatory gap-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                        >
                            {shopCategories.map((cat) => (
                                <Link key={cat.id} href={`/products?category=${cat.slug}`} className="snap-start shrink-0 group block text-center w-[160px]">
                                    <div className="relative aspect-square rounded-full overflow-hidden mb-3 bg-gray-100 border border-transparent group-hover:shadow-md transition-all">
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                            {cat.name.charAt(0)}
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 group-hover:underline decoration-1 underline-offset-4">{cat.name}</span>
                                </Link>
                            ))}
                            {/* Spacer for right padding scroll */}
                            <div className="w-1 shrink-0" />
                        </div>
                    </div>
                </section>
            )}

            {/* Fresh from the community Section */}
            {freshCommunityVisible && (
                <section className="py-12 border-b border-gray-100">
                    <div className="container mx-auto px-4 lg:px-6 relative group/section">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-serif font-medium text-gray-900">Fresh from the community</h2>
                            <Link href="/products" className="text-sm font-medium text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full border border-gray-300 transition-colors">
                                View all
                            </Link>
                        </div>

                        {/* Scroll Button - Left */}
                        <button
                            onClick={() => {
                                const container = document.getElementById('fresh-scroll-container');
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
                                const container = document.getElementById('fresh-scroll-container');
                                if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-md border border-gray-200 text-gray-900 opacity-0 group-hover/section:opacity-100 transition-opacity hover:scale-105"
                            aria-label="Scroll right"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <div
                            id="fresh-scroll-container"
                            className="relative -mx-4 px-4 lg:-mx-6 lg:px-6 overflow-x-auto pb-6 flex snap-x snap-mandatory gap-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                        >
                            {freshItems.map((item) => (
                                <div key={item.id} className="snap-start shrink-0 w-[180px] sm:w-[200px] group cursor-pointer">
                                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:shadow-md transition-all">
                                        {item.thumbnail ? (
                                            <Image
                                                src={item.thumbnail}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No image
                                            </div>
                                        )}
                                        <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-400 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="mt-2">
                                        <h3 className="text-sm text-gray-900 font-medium truncate">{item.name}</h3>
                                        <p className="text-xs text-gray-500 truncate">{item.vendor?.name}</p>
                                        <p className="mt-1 text-sm font-bold text-gray-900">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                            {/* Spacer for right padding scroll */}
                            <div className="w-1 shrink-0" />
                        </div>
                    </div>
                </section>
            )}

        </div>
    )
}
