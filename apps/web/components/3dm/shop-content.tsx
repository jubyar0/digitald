"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Heart, MessageCircle, UserPlus, Search, ChevronDown, Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopProduct {
    id: string;
    name: string;
    price: number;
    thumbnail: string;
}

interface ShopVendor {
    id: string;
    name: string;
    avatar: string | null;
    banner: string;
    description: string;
    location: string;
    rating: number;
    reviewCount: number;
    salesCount: number;
    joinedYear: number;
    products: ShopProduct[];
}

interface ShopContentProps {
    vendor: ShopVendor;
}

// Mock reviews for the shop
const mockShopReviews = [
    { id: "1", user: "Marci", date: "29 Dec, 2025", rating: 5, content: "It is cute and the material was good but the personalization could have been better.", product: "Personalised Leather Purse", avatar: null },
    { id: "2", user: "Anne", date: "29 Dec, 2025", rating: 5, content: "Very pretty, a nice Christmas gift for my daughter!", product: "Personalised Leather Coin Purse", avatar: null },
    { id: "3", user: "jenniv350", date: "29 Dec, 2025", rating: 5, content: "Great little stocking filler gift for the reader in your life.", product: "Personalised Bookmark", avatar: null },
    { id: "4", user: "Fay", date: "28 Dec, 2025", rating: 5, content: "Great gift - my dad loved it! Fast shipping and beautiful packaging.", product: "Personalised Leather Keyring", avatar: null },
];

export function ShopContent({ vendor }: ShopContentProps) {
    const [activeTab, setActiveTab] = useState<"items" | "reviews" | "about">("items");
    const [sortBy, setSortBy] = useState("featured");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <main className="flex-1 bg-white">
            {/* Banner */}
            <div className="relative h-[200px] bg-gradient-to-r from-pink-100 to-purple-100 overflow-hidden">
                {vendor.banner && (
                    <Image
                        src={vendor.banner}
                        alt={`${vendor.name} banner`}
                        fill
                        className="object-cover opacity-60"
                    />
                )}
            </div>

            {/* Shop Header */}
            <div className="container mx-auto px-4 -mt-12 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mb-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                        {vendor.avatar ? (
                            <Image src={vendor.avatar} alt={vendor.name} width={96} height={96} className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-3xl font-semibold text-gray-600">
                                {vendor.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Shop Info */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-1">{vendor.name}</h1>
                        <p className="text-sm text-gray-600 mb-2">{vendor.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">{vendor.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-gray-900 fill-gray-900" />
                                <span className="font-medium">{vendor.rating}</span>
                                <span className="text-gray-500">({(vendor.reviewCount / 1000).toFixed(1)}k reviews)</span>
                            </div>
                            <span className="text-gray-600">{(vendor.salesCount / 1000).toFixed(1)}k sales</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button className="h-10 px-5 rounded-full border border-gray-900 bg-white text-gray-900 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Contact
                        </button>
                        <button className="h-10 px-5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Follow shop
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("items")}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors relative",
                            activeTab === "items" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Items
                        {activeTab === "items" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors relative",
                            activeTab === "reviews" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        Reviews
                        {activeTab === "reviews" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("about")}
                        className={cn(
                            "pb-3 text-sm font-medium transition-colors relative",
                            activeTab === "about" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        About
                        {activeTab === "about" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-6">
                {activeTab === "items" && (
                    <>
                        {/* Filters */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">{vendor.products.length} items</span>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search this shop"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-full bg-white focus:outline-none focus:border-gray-500 w-[200px]"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {vendor.products.map((product) => (
                                <Link key={product.id} href={`/3d-models/products/${product.id}`} className="group">
                                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                                        <Image
                                            src={product.thumbnail}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                                            sizes="(max-width: 640px) 50vw, 20vw"
                                        />
                                        <button
                                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <Heart className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                    <h3 className="text-sm text-gray-700 line-clamp-2 group-hover:underline mb-1">{product.name}</h3>
                                    <p className="text-sm font-semibold text-gray-900">EUR {product.price.toFixed(2)}</p>
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "reviews" && (
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-gray-900 fill-gray-900" />
                                <span className="text-xl font-semibold">{vendor.rating}</span>
                            </div>
                            <span className="text-gray-500">({(vendor.reviewCount / 1000).toFixed(1)}k reviews)</span>
                        </div>

                        <div className="space-y-6">
                            {mockShopReviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-200 pb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                                            {review.user.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{review.user}</p>
                                            <p className="text-xs text-gray-500">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("h-4 w-4", i < review.rating ? "text-gray-900 fill-gray-900" : "text-gray-300")} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-700 mb-2">{review.content}</p>
                                    <p className="text-xs text-gray-500">
                                        Purchased item: <span className="underline">{review.product}</span>
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button className="mt-6 px-6 py-2.5 rounded-full border border-gray-300 bg-white text-gray-900 text-sm font-medium hover:border-gray-400">
                            See more reviews
                        </button>
                    </div>
                )}

                {activeTab === "about" && (
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                                {vendor.avatar ? (
                                    <Image src={vendor.avatar} alt={vendor.name} width={64} height={64} className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-xl font-semibold text-gray-600">
                                        {vendor.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">{vendor.name}</h2>
                                <p className="text-sm text-gray-500">Shop owner</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm text-gray-700">
                            <p>{vendor.description}</p>
                            <p>📍 Based in {vendor.location}</p>
                            <p>🗓️ On Etsy since {vendor.joinedYear}</p>
                            <p>⭐ {(vendor.salesCount / 1000).toFixed(1)}k sales</p>
                        </div>

                        <button className="mt-6 h-10 px-5 rounded-full border border-gray-900 bg-white text-gray-900 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Message {vendor.name}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
