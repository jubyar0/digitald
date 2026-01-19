'use client';

import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
        name: string | null;
    };
}

interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Array<{
        rating: number;
        count: number;
    }>;
}

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchReviews();
    }, [productId, page]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/reviews/product/${productId}?page=${page}&limit=10`
            );
            const data = await response.json();

            setReviews(data.reviews);
            setStats(data.stats);
            setTotalPages(data.pagination.pages);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Rating Summary */}
            {stats && stats.totalReviews > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Average Rating */}
                        <div className="text-center">
                            <p className="text-6xl font-bold text-blue-600 mb-2">
                                {stats.averageRating.toFixed(1)}
                            </p>
                            <div className="flex justify-center mb-2">
                                {renderStars(Math.round(stats.averageRating))}
                            </div>
                            <p className="text-slate-600">
                                Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                            </p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const dist = stats.ratingDistribution.find(d => d.rating === rating);
                                const count = dist?.count || 0;
                                const percentage = stats.totalReviews > 0
                                    ? (count / stats.totalReviews) * 100
                                    : 0;

                                return (
                                    <div key={rating} className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-slate-700 w-8">
                                            {rating} <Star className="w-3 h-3 inline fill-yellow-400 text-yellow-400" />
                                        </span>
                                        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-yellow-400 h-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-slate-600 w-12 text-right">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Customer Reviews</h3>

                {reviews.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <p className="text-slate-500">No reviews yet. Be the first to review!</p>
                    </div>
                ) : (
                    <>
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                        <User className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Review Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-semibold text-slate-900">
                                                {review.user.name || 'Anonymous'}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="mb-3">
                                            {renderStars(review.rating)}
                                        </div>

                                        {review.comment && (
                                            <p className="text-slate-700 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-slate-700">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
