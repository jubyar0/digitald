"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, Truck, MessageCircle, Sparkles, Zap, Award } from "lucide-react";

interface SellerInfoSectionProps {
    vendor: {
        id: string;
        name: string;
        avatar?: string;
        rating?: number;
        reviewCount?: number;
        salesCount?: number;
        location?: string;
        yearsOnPlatform?: number;
        responseTime?: string;
    };
    reviews?: Array<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        user: {
            id: string;
            name: string | null;
        };
        productName?: string;
    }>;
}

// Mock reviews for demonstration
const mockShopReviews = [
    {
        id: "s1",
        user: { name: "Marci" },
        date: "29 Dec, 2025",
        rating: 4,
        content: "It is cute and the material was good but the personalization could have been better.",
        productName: "Personalised Leather Pet Name Tag"
    },
    {
        id: "s2",
        user: { name: "Anne" },
        date: "29 Dec, 2025",
        rating: 5,
        content: "very pretty, a nice Christmas gift",
        productName: "Personalised Leather Point Bookmark"
    },
    {
        id: "s3",
        user: { name: "jenniv350" },
        date: "29 Dec, 2025",
        rating: 5,
        content: "Great little stocking filler gift for the reader in your life.",
        productName: "Personalised Leather Point Bookmark"
    },
    {
        id: "s4",
        user: { name: "Fay" },
        date: "28 Dec, 2025",
        rating: 5,
        content: "Great gift - my dad loved it!",
        productName: "Personalised Leather Point Bookmark"
    },
    {
        id: "s5",
        user: { name: "Michael" },
        date: "26 Dec, 2025",
        rating: 5,
        content: "Fine quality product with service to match. Shipped immediately and kept aware of progress.",
        productName: "Personalised Leather Point Bookmark"
    }
];

export function SellerInfoSection({ vendor, reviews }: SellerInfoSectionProps) {
    const displayReviews = mockShopReviews;
    const rating = vendor.rating || 4.9;
    const reviewCount = vendor.reviewCount || 2800;
    const salesCount = vendor.salesCount || 16700;
    const yearsOnPlatform = vendor.yearsOnPlatform || 5;

    return (
        <section className="border-t border-gray-200 bg-white py-10">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl">
                    {/* Shop Header */}
                    <div className="flex items-start gap-4 mb-6">
                        {/* Shop Avatar */}
                        <Link href={`/shop/${vendor.id}`} className="block">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 ring-2 ring-gray-100">
                                {vendor.avatar ? (
                                    <Image
                                        src={vendor.avatar}
                                        alt={vendor.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-semibold bg-gradient-to-br from-orange-100 to-amber-100 text-gray-600">
                                        {vendor.name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </Link>

                        {/* Shop Info */}
                        <div className="flex-1">
                            <Link href={`/shop/${vendor.id}`} className="text-xl font-semibold text-gray-900 hover:underline">
                                {vendor.name}
                            </Link>

                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <span>Owned by {vendor.name?.split(' ')[0] || 'Owner'}</span>
                                <span className="text-gray-300">|</span>
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>{vendor.location || 'Unknown Location'}</span>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-gray-900 fill-gray-900" />
                                    <span className="font-medium">{rating}</span>
                                    <span className="text-gray-500">({(reviewCount / 1000).toFixed(1)}k)</span>
                                </div>
                                <span className="text-gray-500">{(salesCount / 1000).toFixed(1)}k sales</span>
                                <span className="text-gray-500">{yearsOnPlatform} years on platform</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-4">
                                <button className="h-10 px-5 rounded-full border border-gray-900 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4" />
                                    Message seller
                                </button>
                                <button className="h-10 px-5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                                    Follow shop
                                </button>
                            </div>

                            {/* Response Time */}
                            <p className="text-sm text-gray-500 mt-3">
                                This seller usually responds within a few hours.
                            </p>
                        </div>
                    </div>

                    {/* Seller Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                            <Truck className="h-5 w-5 text-gray-700 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-sm text-gray-900">Smooth dispatch</p>
                                <p className="text-xs text-gray-500">Has a history of dispatching on time with tracking.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                            <Zap className="h-5 w-5 text-gray-700 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-sm text-gray-900">Speedy replies</p>
                                <p className="text-xs text-gray-500">Has a history of replying to messages quickly.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                            <Award className="h-5 w-5 text-gray-700 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-sm text-gray-900">Rave reviews</p>
                                <p className="text-xs text-gray-500">Average review rating is 4.8 or higher.</p>
                            </div>
                        </div>
                    </div>

                    {/* All Reviews from Shop */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">
                                All reviews from this shop ({(reviewCount / 1000).toFixed(1)}k)
                            </h3>
                            <button className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
                                Show all
                            </button>
                        </div>

                        <div className="space-y-4">
                            {displayReviews.map((review) => (
                                <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                                    <p className="text-sm text-gray-700 mb-2">{review.content}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3 w-3 ${i < review.rating
                                                            ? "text-gray-900 fill-gray-900"
                                                            : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-medium text-gray-700">{review.user.name}</span>
                                        <span>{review.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Purchased: <span className="underline hover:text-gray-600 cursor-pointer">{review.productName}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
