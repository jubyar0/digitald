'use client';

import { useState } from 'react';
import { Star, Send } from 'lucide-react';

interface ReviewFormProps {
    productId: string;
    productName: string;
    onSuccess?: () => void;
}

export default function ReviewForm({ productId, productName, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment: comment.trim() || undefined
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to submit review');
            }

            setRating(0);
            setComment('');
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Write a Review</h3>

            <form onSubmit={submitReview} className="space-y-6">
                {/* Product Name */}
                <div>
                    <p className="text-sm text-slate-600 mb-1">Reviewing:</p>
                    <p className="font-semibold text-slate-900">{productName}</p>
                </div>

                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                        Your Rating *
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-10 h-10 ${star <= (hoverRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-slate-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    {rating > 0 && (
                        <p className="text-sm text-slate-600 mt-2">
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent'}
                        </p>
                    )}
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Your Review (Optional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={5}
                        placeholder="Share your experience with this product..."
                        maxLength={1000}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        {comment.length}/1000 characters
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {submitting ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Submit Review
                        </>
                    )}
                </button>

                <p className="text-xs text-slate-500 text-center">
                    * You can only review products you&apos;ve purchased
                </p>
            </form>
        </div>
    );
}
