"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Truck, Mail, Award, ChevronLeft, ChevronRight, Loader2, UserPlus, UserCheck } from "lucide-react";
import { followVendor, unfollowVendor, isFollowingVendor } from "@/actions/vendor-follow";
import { createConversationWithVendor } from "@/actions/messages";
import { toast } from "sonner";

interface SellerCardProps {
    vendor: {
        id: string;
        name: string;
        avatar?: string | null;
        rating?: number;
        reviewCount?: number;
        salesCount?: number;
        location?: string;
        yearsOnPlatform?: number;
    };
    products?: any[];
}

// Mock shop reviews
const mockShopReviews = [
    { id: "1", user: "Marci", date: "29 Dec, 2025", content: "It is cute and the material was good but the personalization could have been better.", product: "Personalised Leather P...", avatar: null },
    { id: "2", user: "Anne", date: "29 Dec, 2025", content: "very pretty, a nice Christmas gift", product: "Personalised Leather P...", avatar: null },
    { id: "3", user: "jenniv350", date: "29 Dec, 2025", content: "Great little stocking filler gift for the reader in your life.", product: "Personalised...", avatar: null },
    { id: "4", user: "Fay", date: "28 Dec, 2025", content: "Great gift - my dad loved it!", product: "Personalised Leather P...", avatar: null },
    { id: "5", user: "Michael", date: "26 Dec, 2025", content: "Fine quality product with service to match.", product: "Personalised Leather P...", avatar: null },
];

export function SellerCard({ vendor, products = [] }: SellerCardProps) {
    const router = useRouter();
    const reviewsRef = useRef<HTMLDivElement>(null);

    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [isCheckingFollowStatus, setIsCheckingFollowStatus] = useState(true);

    const rating = vendor.rating || 4.9;
    const reviewCount = vendor.reviewCount || 2800;
    const salesCount = vendor.salesCount || 16700;
    const yearsOnPlatform = vendor.yearsOnPlatform || 5;
    const location = vendor.location || "Ringwood, United Kingdom";
    const ownerName = vendor.name?.split(' ')[0] || 'Sbri';

    // Check follow status on mount
    useEffect(() => {
        const checkFollowStatus = async () => {
            if (vendor.id) {
                const result = await isFollowingVendor(vendor.id);
                setIsFollowing(result.isFollowing);
                setIsCheckingFollowStatus(false);
            }
        };
        checkFollowStatus();
    }, [vendor.id]);

    const scrollReviews = (direction: 'left' | 'right') => {
        if (reviewsRef.current) {
            const scrollAmount = 280;
            reviewsRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleFollowClick = async () => {
        try {
            setIsFollowLoading(true);

            if (isFollowing) {
                const result = await unfollowVendor(vendor.id);
                if (result.success) {
                    setIsFollowing(false);
                    toast.success("Unfollowed shop");
                } else {
                    if (result.error?.includes("Unauthorized")) {
                        toast.error("Please login to follow shops", {
                            action: {
                                label: "Login",
                                onClick: () => router.push("/login")
                            }
                        });
                    } else {
                        toast.error(result.error || "Failed to unfollow");
                    }
                }
            } else {
                const result = await followVendor(vendor.id);
                if (result.success) {
                    setIsFollowing(true);
                    toast.success("Now following this shop! 🎉");
                } else {
                    if (result.error?.includes("Unauthorized")) {
                        toast.error("Please login to follow shops", {
                            action: {
                                label: "Login",
                                onClick: () => router.push("/login")
                            }
                        });
                    } else {
                        toast.error(result.error || "Failed to follow");
                    }
                }
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleMessageClick = async () => {
        try {
            setIsMessageLoading(true);
            const result = await createConversationWithVendor(vendor.id);

            if (result.success && result.conversationId) {
                toast.success("Opening conversation...");
                router.push(`/messages?conversation=${result.conversationId}`);
            } else {
                if (result.error?.includes("log in") || result.error?.includes("Unauthorized")) {
                    toast.error("Please login to message sellers", {
                        action: {
                            label: "Login",
                            onClick: () => router.push("/login")
                        }
                    });
                } else {
                    toast.error(result.error || "Failed to start conversation");
                }
            }
        } catch (error) {
            console.error("Error starting conversation:", error);
            toast.error("Failed to message seller. Please try again.");
        } finally {
            setIsMessageLoading(false);
        }
    };

    return (
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
            {/* Centered Header */}
            <div className="text-center mb-6">
                {/* Avatar with Star Badge */}
                <div className="relative inline-block mb-3">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mx-auto">
                        {vendor.avatar ? (
                            <Image src={vendor.avatar} alt={vendor.name} width={80} height={80} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-semibold bg-gradient-to-br from-orange-100 to-amber-100 text-gray-600">
                                {vendor.name?.charAt(0) || 'S'}
                            </div>
                        )}
                    </div>
                    {/* Star Badge */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center">
                        <Star className="h-3 w-3 text-purple-600 fill-purple-600" />
                    </div>
                </div>

                {/* Shop Name - Clickable Link */}
                <Link href={`/shop/${vendor.id}`} className="text-xl font-semibold text-gray-900 mb-1 hover:underline block">
                    {vendor.name || 'SbriStudio'}
                </Link>

                {/* Owner & Location */}
                <p className="text-sm text-gray-600 mb-2">
                    Owned by {ownerName} | {location}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-gray-900 fill-gray-900" />
                        <span className="font-medium">{rating}</span>
                        <span className="text-gray-500">({(reviewCount / 1000).toFixed(1)}k)</span>
                    </div>
                    <span className="text-gray-900">{(salesCount / 1000).toFixed(1)}k sales</span>
                    <span className="text-gray-900">{yearsOnPlatform} years on Etsy</span>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-3 mb-3">
                    <button
                        onClick={handleMessageClick}
                        disabled={isMessageLoading}
                        className="h-10 px-6 rounded-full border border-gray-900 bg-white text-gray-900 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isMessageLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Opening...
                            </>
                        ) : (
                            <>
                                <Mail className="h-4 w-4" />
                                Message seller
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleFollowClick}
                        disabled={isFollowLoading || isCheckingFollowStatus}
                        className={`h-10 px-6 rounded-full border text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${isFollowing
                                ? "border-green-600 bg-green-50 text-green-700 hover:bg-green-100"
                                : "border-gray-900 bg-white text-gray-900 hover:bg-gray-50"
                            }`}
                    >
                        {isFollowLoading || isCheckingFollowStatus ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isFollowing ? (
                            <>
                                <UserCheck className="h-4 w-4" />
                                Following
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-4 w-4" />
                                Follow shop
                            </>
                        )}
                    </button>
                </div>

                {/* Response Time */}
                <p className="text-sm text-gray-500">
                    This seller usually responds within a few hours.
                </p>
            </div>

            {/* Badges Row */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-gray-700" />
                    <p className="text-sm">
                        <span className="font-medium text-gray-900">Smooth dispatch</span>{' '}
                        <span className="text-gray-500">Has a history of dispatching on time with tracking.</span>
                    </p>
                </div>
                <div className="text-center">
                    <Mail className="h-6 w-6 mx-auto mb-2 text-gray-700" />
                    <p className="text-sm">
                        <span className="font-medium text-gray-900">Speedy replies</span>{' '}
                        <span className="text-gray-500">Has a history of replying to messages quickly.</span>
                    </p>
                </div>
                <div className="text-center">
                    <Award className="h-6 w-6 mx-auto mb-2 text-gray-700" />
                    <p className="text-sm">
                        <span className="font-medium text-gray-900">Rave reviews</span>{' '}
                        <span className="text-gray-500">Average review rating is 4.8 or higher.</span>
                    </p>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">
                        All reviews from this shop ({(reviewCount / 1000).toFixed(1)}k)
                    </h3>
                    <Link
                        href={`/shop/${vendor.id}?tab=reviews`}
                        className="px-4 py-1.5 rounded-full border border-gray-300 bg-white text-gray-900 text-sm font-medium hover:bg-gray-50"
                    >
                        Show all
                    </Link>
                </div>

                {/* Review Cards Carousel */}
                <div className="relative group">
                    <div ref={reviewsRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
                        {mockShopReviews.map((review) => (
                            <div key={review.id} className="flex-shrink-0 w-[260px] p-4 border border-gray-200 rounded-lg">
                                {/* Stars */}
                                <div className="flex mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-gray-900 fill-gray-900" />
                                    ))}
                                </div>
                                {/* Content */}
                                <p className="text-sm text-gray-700 mb-3 line-clamp-3">{review.content}</p>
                                {/* User Info */}
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-xs font-medium text-gray-600">
                                        {review.user.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">
                                            <span className="font-medium text-gray-900">{review.user}</span>
                                            <span className="text-gray-500 ml-1">{review.date}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            Purchased: <span className="underline">{review.product}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Navigation Arrows - Visible on Hover */}
                    <button
                        onClick={() => scrollReviews('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 z-10"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                        onClick={() => scrollReviews('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 z-10"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* More from this shop */}
            {products.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900">More from this shop</h3>
                        <Link href={`/shop/${vendor.id}`} className="text-sm text-gray-600 hover:underline">
                            Visit shop
                        </Link>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {products.slice(0, 4).map((product) => (
                            <Link key={product.id} href={`/3d-models/products/${product.id}`} className="group">
                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                                    {product.thumbnail ? (
                                        <Image
                                            src={product.thumbnail}
                                            alt={product.name}
                                            width={150}
                                            height={150}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                    USD {product.price?.toFixed(2) || '0.00'}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
