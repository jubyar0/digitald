"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Star, ThumbsUp, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhotosFromReviews } from "@/components/3dm/photos-from-reviews";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
    };
}

interface ProductReviewsSectionProps {
    productId: string;
    reviews?: Review[];
    averageRating?: number;
    totalReviews?: number;
}

// Mock review data - used when no real reviews are available
const mockReviews = [
    {
        id: "1",
        user: { id: "u1", name: "Sarah M.", avatar: null, location: "United States" },
        rating: 5,
        createdAt: new Date("2024-12-15"),
        comment: "Absolutely stunning quality! The textures are incredibly detailed and work perfectly in my projects. Highly recommend for any 3D artist.",
        helpful: 24,
    },
    {
        id: "2",
        user: { id: "u2", name: "Michael K.", avatar: null, location: "Germany" },
        rating: 5,
        createdAt: new Date("2024-12-10"),
        comment: "Great asset! The file organization is excellent and the documentation helped me get started quickly. Will definitely buy more from this seller.",
        helpful: 18,
    },
    {
        id: "3",
        user: { id: "u3", name: "Emma L.", avatar: null, location: "Canada" },
        rating: 4,
        createdAt: new Date("2024-12-08"),
        comment: "Good quality overall. The model is well-optimized and renders beautifully. Only minor issue was the UV mapping on one section, but the seller was very responsive.",
        helpful: 12,
    },
    {
        id: "4",
        user: { id: "u4", name: "James R.", avatar: null, location: "United Kingdom" },
        rating: 5,
        createdAt: new Date("2024-12-05"),
        comment: "Exactly what I needed for my project! Fast download and excellent quality. The seller provides great support too.",
        helpful: 9,
    }
];

const defaultRatingBreakdown = {
    5: 186,
    4: 24,
    3: 8,
    2: 2,
    1: 1
};

// Review highlights/tags - AI generated keywords
const reviewHighlights = [
    { label: "Quality", count: 156 },
    { label: "Fast delivery", count: 89 },
    { label: "Great value", count: 67 },
    { label: "Easy to use", count: 54 },
    { label: "Professional", count: 43 }
];

export function ProductReviewsSection({
    productId,
    reviews: realReviews,
    averageRating: propAverageRating,
    totalReviews: propTotalReviews
}: ProductReviewsSectionProps) {
    const [sortBy, setSortBy] = useState("suggested");
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({});

    // Merge real reviews with mock data format
    const allReviews = useMemo(() => {
        if (realReviews && realReviews.length > 0) {
            return realReviews.map(r => ({
                id: r.id,
                user: {
                    id: r.user.id,
                    name: r.user.name || "Anonymous",
                    avatar: null,
                    location: null
                },
                rating: r.rating,
                createdAt: new Date(r.createdAt),
                comment: r.comment || "",
                helpful: Math.floor(Math.random() * 30), // Placeholder
            }));
        }
        return mockReviews;
    }, [realReviews]);

    // Sort reviews based on selection
    const sortedReviews = useMemo(() => {
        const reviews = [...allReviews];
        switch (sortBy) {
            case "recent":
                return reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            case "helpful":
                return reviews.sort((a, b) => b.helpful - a.helpful);
            case "highest":
                return reviews.sort((a, b) => b.rating - a.rating);
            case "lowest":
                return reviews.sort((a, b) => a.rating - b.rating);
            default: // suggested - mix of helpful and recent
                return reviews.sort((a, b) => {
                    const helpScore = (b.helpful - a.helpful) * 0.6;
                    const recentScore = (b.createdAt.getTime() - a.createdAt.getTime()) / (1000 * 60 * 60 * 24) * 0.4;
                    return helpScore + recentScore;
                });
        }
    }, [allReviews, sortBy]);

    // Use real data or fallback to mock data
    const displayTotalReviews = propTotalReviews ?? Object.values(defaultRatingBreakdown).reduce((a, b) => a + b, 0);
    const displayAverageRating = propAverageRating ?? (
        Object.entries(defaultRatingBreakdown).reduce((sum, [rating, count]) => sum + Number(rating) * count, 0) / displayTotalReviews
    );

    // Format for display
    const formattedRating = displayAverageRating.toFixed(1);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleHelpfulClick = (reviewId: string) => {
        setHelpfulClicked(prev => ({ ...prev, [reviewId]: true }));
    };

    return (
        <section id="reviews" className="border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-10">
                {/* Reviews Header */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        Reviews for this item
                        <span className="text-gray-500 font-normal ml-2">({displayTotalReviews})</span>
                    </h2>
                </div>

                {/* Photos from reviews */}
                <PhotosFromReviews />

                {/* Rating Summary - Etsy Style */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    {/* Left - Big Rating */}
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-gray-900">{formattedRating}</div>
                            <div className="flex justify-center mt-2 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "h-4 w-4",
                                            i < Math.round(displayAverageRating)
                                                ? "text-gray-900 fill-gray-900"
                                                : "text-gray-300"
                                        )}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500">{displayTotalReviews} reviews</p>
                        </div>

                        {/* Rating Circles */}
                        <div className="flex gap-6">
                            <div className="text-center">
                                <div className="relative w-16 h-16 mb-2">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                                        <circle
                                            cx="32" cy="32" r="28"
                                            stroke="#111827"
                                            strokeWidth="4"
                                            fill="none"
                                            strokeDasharray={`${(displayAverageRating / 5) * 176} 176`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                                        {formattedRating}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600">Item quality</p>
                            </div>
                            <div className="text-center">
                                <div className="relative w-16 h-16 mb-2">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                                        <circle
                                            cx="32" cy="32" r="28"
                                            stroke="#111827"
                                            strokeWidth="4"
                                            fill="none"
                                            strokeDasharray="176 176"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                                        5.0
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600">Delivery</p>
                            </div>
                            <div className="text-center">
                                <div className="relative w-16 h-16 mb-2">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                                        <circle
                                            cx="32" cy="32" r="28"
                                            stroke="#111827"
                                            strokeWidth="4"
                                            fill="none"
                                            strokeDasharray="176 176"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                                        5.0
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600">Customer service</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buyer Highlights */}
                <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-900">Buyer highlights, summarised by AI</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {reviewHighlights.map((highlight, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveFilter(activeFilter === highlight.label ? null : highlight.label)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                                    activeFilter === highlight.label
                                        ? "bg-gray-900 text-white"
                                        : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
                                )}
                            >
                                {highlight.label} ({highlight.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-sm text-gray-600">Sort by</span>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="h-10 pl-4 pr-10 rounded-lg border border-gray-200 bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                            <option value="suggested">Suggested</option>
                            <option value="recent">Most recent</option>
                            <option value="helpful">Most helpful</option>
                            <option value="highest">Highest rated</option>
                            <option value="lowest">Lowest rated</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {sortedReviews.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p className="text-lg font-medium mb-2">No reviews yet</p>
                            <p className="text-sm">Be the first to review this product!</p>
                        </div>
                    ) : (
                        sortedReviews.map((review) => (
                            <div
                                key={review.id}
                                className="pb-6 border-b border-gray-100 last:border-0"
                            >
                                <div className="flex items-start gap-4">
                                    {/* User Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                        {review.user.avatar ? (
                                            <Image
                                                src={review.user.avatar}
                                                alt={review.user.name}
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-600 font-medium">
                                                {review.user.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Review Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={cn(
                                                            "h-3.5 w-3.5",
                                                            i < review.rating
                                                                ? "text-gray-900 fill-gray-900"
                                                                : "text-gray-300"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-800 leading-relaxed mb-2">
                                            {review.comment}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="font-medium text-gray-700">{review.user.name}</span>
                                            <span>•</span>
                                            <span>{formatDate(review.createdAt)}</span>
                                            {review.user.location && (
                                                <>
                                                    <span>•</span>
                                                    <span>{review.user.location}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Helpful Button */}
                                        <button
                                            onClick={() => handleHelpfulClick(review.id)}
                                            disabled={helpfulClicked[review.id]}
                                            className={cn(
                                                "flex items-center gap-1.5 mt-3 text-xs transition-colors",
                                                helpfulClicked[review.id]
                                                    ? "text-green-600 cursor-default"
                                                    : "text-gray-500 hover:text-gray-700"
                                            )}
                                        >
                                            <ThumbsUp className={cn("h-3.5 w-3.5", helpfulClicked[review.id] && "fill-green-600")} />
                                            {helpfulClicked[review.id] ? "Thanks for your feedback!" : `Helpful? (${review.helpful})`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Load More */}
                {sortedReviews.length > 0 && (
                    <div className="flex items-center justify-center mt-8">
                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-300 bg-white text-gray-900 text-sm font-medium hover:border-gray-400 transition-colors">
                            See more reviews
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
