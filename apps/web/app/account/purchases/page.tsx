'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import LandingNavbar from "@/components/landing/navbar"
import FooterSection from "@/components/landing/footer"
import { Search, Loader2, ShoppingBag, Star, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { getUserPurchases, searchUserPurchases, getUserCases } from '@/actions/user-purchases'
import { createProductReview, getReviewByProductId, updateProductReview } from '@/actions/user-reviews'

// Category suggestions for empty state
const categoryCards = [
    {
        name: 'Jewelry',
        href: '/products?category=jewelry',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop'
    },
    {
        name: 'Home & Living',
        href: '/products?category=home',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop'
    },
    {
        name: 'Kids',
        href: '/products?category=kids',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop'
    },
    {
        name: 'Art',
        href: '/products?category=art',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=200&fit=crop'
    },
    {
        name: '3D Models',
        href: '/3d-models',
        image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&h=200&fit=crop'
    },
]

interface PurchaseItem {
    id: string
    productId: string
    name: string
    image: string
    price: number
    quantity: number
    vendor: { id: string; name: string }
    hasReview: boolean
}

interface Purchase {
    id: string
    orderNumber: string
    date: string
    status: string
    total: number
    currency: string
    items: PurchaseItem[]
}

interface Case {
    id: string
    status: string
    reason: string
    disputeReason: string | null
    resolution: string | null
    createdAt: string
    product: { id: string; name: string; thumbnail: string | null }
}

// Review Modal Component
function ReviewModal({
    isOpen,
    onClose,
    productId,
    productName,
    onSuccess
}: {
    isOpen: boolean
    onClose: () => void
    productId: string
    productName: string
    onSuccess: () => void
}) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [existingReviewId, setExistingReviewId] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && productId) {
            // Check if user already has a review
            getReviewByProductId(productId).then(result => {
                if (result.success && result.data) {
                    setRating(result.data.rating)
                    setComment(result.data.comment || '')
                    setExistingReviewId(result.data.id)
                } else {
                    setRating(0)
                    setComment('')
                    setExistingReviewId(null)
                }
            })
        }
    }, [isOpen, productId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            toast.error('Please select a rating')
            return
        }

        setIsSubmitting(true)
        try {
            let result
            if (existingReviewId) {
                result = await updateProductReview(existingReviewId, rating, comment)
            } else {
                result = await createProductReview(productId, rating, comment)
            }

            if (result.success) {
                toast.success(existingReviewId ? 'Review updated!' : 'Review submitted!')
                onSuccess()
                onClose()
            } else {
                toast.error(result.error || 'Failed to submit review')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {existingReviewId ? 'Edit Review' : 'Write a Review'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">{productName}</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1"
                                >
                                    <Star
                                        className={cn(
                                            "h-8 w-8 transition-colors",
                                            (hoverRating || rating) >= star
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comment (optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                            placeholder="Share your experience with this product..."
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || rating === 0}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : existingReviewId ? 'Update' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function PurchasesPage() {
    const { status: authStatus } = useSession()
    const [activeTab, setActiveTab] = useState<'purchases' | 'cases'>('purchases')
    const [purchases, setPurchases] = useState<Purchase[]>([])
    const [cases, setCases] = useState<Case[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; productId: string; productName: string }>({
        isOpen: false,
        productId: '',
        productName: ''
    })

    const fetchPurchases = useCallback(async () => {
        setLoading(true)
        try {
            const result = await getUserPurchases(1, 20)
            if (result.success && result.data) {
                setPurchases(result.data.purchases)
            }
        } catch (error) {
            console.error('Error fetching purchases:', error)
            toast.error('Failed to load purchases')
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchCases = useCallback(async () => {
        try {
            const result = await getUserCases(1, 20)
            if (result.success && result.data) {
                setCases(result.data.cases)
            }
        } catch (error) {
            console.error('Error fetching cases:', error)
        }
    }, [])

    useEffect(() => {
        if (authStatus === 'authenticated') {
            fetchPurchases()
            fetchCases()
        } else if (authStatus === 'unauthenticated') {
            setLoading(false)
        }
    }, [authStatus, fetchPurchases, fetchCases])

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchPurchases()
            return
        }

        setLoading(true)
        try {
            const result = await searchUserPurchases(searchQuery)
            if (result.success && result.data) {
                setPurchases(result.data.map((p: any) => ({
                    ...p,
                    currency: p.currency || 'USD',
                    items: p.items.map((item: any) => ({ ...item, hasReview: false }))
                })))
            }
        } catch (error) {
            console.error('Error searching:', error)
        } finally {
            setLoading(false)
        }
    }

    const openReviewModal = (productId: string, productName: string) => {
        setReviewModal({ isOpen: true, productId, productName })
    }

    const handleReviewSuccess = () => {
        fetchPurchases() // Refresh to update hasReview status
    }

    if (authStatus === 'loading') {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <LandingNavbar />
            <div className="h-[140px]" />

            <main className="flex-1 container mx-auto px-4 lg:px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Purchases</h1>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setActiveTab('purchases')}
                                className={cn(
                                    "text-sm font-medium pb-1 border-b-2 transition-colors",
                                    activeTab === 'purchases'
                                        ? "text-gray-900 border-gray-900"
                                        : "text-gray-500 border-transparent hover:text-gray-700"
                                )}
                            >
                                Purchases
                            </button>
                            <button
                                onClick={() => setActiveTab('cases')}
                                className={cn(
                                    "text-sm font-medium pb-1 border-b-2 transition-colors",
                                    activeTab === 'cases'
                                        ? "text-gray-900 border-gray-900"
                                        : "text-gray-500 border-transparent hover:text-gray-700"
                                )}
                            >
                                Cases {cases.length > 0 && `(${cases.length})`}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search your purchases"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-56 pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                            />
                            <button onClick={handleSearch}>
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {activeTab === 'purchases' && (
                    <div className="border border-gray-200 rounded-lg">
                        {loading ? (
                            <div className="flex items-center justify-center h-[400px]">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                        ) : purchases.length === 0 ? (
                            <div className="py-8 px-6">
                                <div className="text-center mb-8">
                                    <p className="text-gray-700 font-medium">
                                        No Purchases? No Problem! Browse for awesome items.
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-6">
                                    {categoryCards.map((category) => (
                                        <Link key={category.name} href={category.href} className="group flex flex-col items-center">
                                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 mb-2 group-hover:border-gray-400 transition-colors">
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                                {category.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {purchases.map((purchase) => (
                                    <div key={purchase.id} className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-gray-500">Order #{purchase.orderNumber}</span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(purchase.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className={cn(
                                                "text-sm font-medium px-3 py-1 rounded-full",
                                                purchase.status === 'DELIVERED' || purchase.status === 'COMPLETED'
                                                    ? "bg-green-100 text-green-700"
                                                    : purchase.status === 'SHIPPED' || purchase.status === 'PAID'
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-gray-100 text-gray-700"
                                            )}>
                                                {purchase.status}
                                            </span>
                                        </div>

                                        {purchase.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Link
                                                        href={`/3d-models/products/${item.productId}`}
                                                        className="text-sm font-medium text-gray-900 hover:underline line-clamp-2"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <Link
                                                        href={`/shop/${item.vendor.id}`}
                                                        className="text-sm text-gray-500 hover:underline"
                                                    >
                                                        {item.vendor.name}
                                                    </Link>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            ${item.price.toFixed(2)}
                                                        </span>
                                                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => openReviewModal(item.productId, item.name)}
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                                    >
                                                        {item.hasReview ? 'Edit review' : 'Write a review'}
                                                    </button>
                                                    <Link
                                                        href={`/account/downloads`}
                                                        className="px-4 py-2 text-sm font-medium text-center text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                                    >
                                                        Download
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'cases' && (
                    <div className="border border-gray-200 rounded-lg">
                        {cases.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                                <ShoppingBag className="h-16 w-16 mb-4 text-gray-300" />
                                <p className="text-lg font-medium text-gray-600">No cases to show</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    If you have an issue with an order, you can open a case here.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {cases.map((caseItem) => (
                                    <div key={caseItem.id} className="p-6">
                                        <div className="flex items-start gap-4">
                                            <AlertCircle className={cn(
                                                "h-5 w-5 mt-0.5",
                                                caseItem.status === 'RESOLVED' ? "text-green-500" : "text-orange-500"
                                            )} />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-medium text-gray-900">{caseItem.product.name}</h3>
                                                    <span className={cn(
                                                        "text-xs font-medium px-2 py-1 rounded-full",
                                                        caseItem.status === 'RESOLVED'
                                                            ? "bg-green-100 text-green-700"
                                                            : caseItem.status === 'PENDING'
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-blue-100 text-blue-700"
                                                    )}>
                                                        {caseItem.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{caseItem.reason}</p>
                                                <p className="text-xs text-gray-400">
                                                    Opened on {new Date(caseItem.createdAt).toLocaleDateString()}
                                                </p>
                                                {caseItem.resolution && (
                                                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                                                        Resolution: {caseItem.resolution}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            <FooterSection />

            <ReviewModal
                isOpen={reviewModal.isOpen}
                onClose={() => setReviewModal({ isOpen: false, productId: '', productName: '' })}
                productId={reviewModal.productId}
                productName={reviewModal.productName}
                onSuccess={handleReviewSuccess}
            />
        </div>
    )
}

