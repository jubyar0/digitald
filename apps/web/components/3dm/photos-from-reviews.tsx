"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewPhoto {
    id: string;
    imageUrl: string;
    reviewerName: string;
    reviewerAvatar?: string;
    date: string;
    rating: number;
    comment: string;
    customization?: string;
    purchasedItem: {
        name: string;
        thumbnail: string;
        price: string;
    };
}

interface PhotosFromReviewsProps {
    photos?: ReviewPhoto[];
}

// Mock data for review photos
const mockReviewPhotos: ReviewPhoto[] = [
    {
        id: "1",
        imageUrl: "/media/illustrations/15.svg",
        reviewerName: "Sean Trexell",
        date: "13 Feb, 2024",
        rating: 5,
        comment: "A very nice quality coin purse that can be used for a variety of things. I bought it as a gift and the personalization on both the inside and outside is terrific. She loves it!!",
        customization: "Yes please",
        purchasedItem: {
            name: "Personalised Leather Coin Purse Wo...",
            thumbnail: "/media/illustrations/15.svg",
            price: "USD 42.39"
        }
    },
    {
        id: "2",
        imageUrl: "/media/illustrations/16.svg",
        reviewerName: "Emma Wilson",
        date: "10 Feb, 2024",
        rating: 5,
        comment: "Beautiful quality leather! The personalization was perfect and it arrived quickly. Will definitely order again!",
        purchasedItem: {
            name: "Personalised Leather Bookmark...",
            thumbnail: "/media/illustrations/16.svg",
            price: "USD 18.50"
        }
    },
    {
        id: "3",
        imageUrl: "/media/illustrations/17.svg",
        reviewerName: "Marcus Chen",
        date: "05 Feb, 2024",
        rating: 5,
        comment: "Exceeded my expectations! The leather quality is amazing and the gold initials look so elegant.",
        purchasedItem: {
            name: "Leather Keyring with Gold Foil...",
            thumbnail: "/media/illustrations/17.svg",
            price: "USD 15.99"
        }
    },
    {
        id: "4",
        imageUrl: "/media/illustrations/18.svg",
        reviewerName: "Sophia Martinez",
        date: "01 Feb, 2024",
        rating: 5,
        comment: "Perfect gift for my mom! She absolutely loved the personalization. Fast shipping too!",
        purchasedItem: {
            name: "Personalised Pet Name Tag...",
            thumbnail: "/media/illustrations/18.svg",
            price: "USD 24.99"
        }
    }
];

// Modal component that renders via portal to body
function ReviewPhotoModal({
    photo,
    photos,
    currentIndex,
    onClose,
    onPrevious,
    onNext
}: {
    photo: ReviewPhoto;
    photos: ReviewPhoto[];
    currentIndex: number;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!mounted) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
            onClick={onClose}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
            <div
                className="relative bg-white rounded-xl max-w-4xl w-[90vw] max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
                >
                    <X className="h-5 w-5 text-gray-700" />
                </button>

                {/* Left - Image */}
                <div className="relative flex-1 bg-gray-100 min-h-[300px] md:min-h-[500px]">
                    <Image
                        src={photo.imageUrl}
                        alt={`Review by ${photo.reviewerName}`}
                        fill
                        className="object-contain"
                    />

                    {/* Navigation Arrows */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrevious(); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50"
                    >
                        <ChevronLeft className="h-6 w-6 text-gray-700" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50"
                    >
                        <ChevronRight className="h-6 w-6 text-gray-700" />
                    </button>
                </div>

                {/* Right - Review Info */}
                <div className="w-full md:w-[320px] p-5 overflow-y-auto border-l border-gray-200">
                    {/* Date & Reviewer */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                            {photo.reviewerAvatar ? (
                                <Image
                                    src={photo.reviewerAvatar}
                                    alt={photo.reviewerName}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-medium text-gray-600">
                                    {photo.reviewerName.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">{photo.date}</p>
                            <p className="text-sm font-medium text-green-700">{photo.reviewerName}</p>
                        </div>
                    </div>

                    {/* Stars */}
                    <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "h-4 w-4",
                                    i < photo.rating
                                        ? "text-gray-900 fill-gray-900"
                                        : "text-gray-300"
                                )}
                            />
                        ))}
                    </div>

                    {/* Customization Question */}
                    {photo.customization && (
                        <p className="text-sm text-gray-700 mb-3">
                            <span className="font-medium">Add a message inside?:</span>{' '}
                            {photo.customization}
                        </p>
                    )}

                    {/* Review Comment */}
                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                        {photo.comment}
                    </p>

                    {/* Purchased Item */}
                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-500 mb-3">Purchased Item:</p>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                                <Image
                                    src={photo.purchasedItem.thumbnail}
                                    alt={photo.purchasedItem.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 truncate">{photo.purchasedItem.name}</p>
                                <p className="text-sm font-medium text-gray-900">{photo.purchasedItem.price}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

export function PhotosFromReviews({ photos = mockReviewPhotos }: PhotosFromReviewsProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<ReviewPhoto | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openModal = (photo: ReviewPhoto, index: number) => {
        setSelectedPhoto(photo);
        setCurrentIndex(index);
    };

    const closeModal = () => {
        setSelectedPhoto(null);
    };

    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        setSelectedPhoto(photos[newIndex]);
    };

    const goToNext = () => {
        const newIndex = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        setSelectedPhoto(photos[newIndex]);
    };

    const photosScrollRef = React.useRef<HTMLDivElement>(null);

    const scrollPhotos = (direction: 'left' | 'right') => {
        if (photosScrollRef.current) {
            const scrollAmount = 220;
            photosScrollRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            {/* Photos Grid */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Photos from reviews</h3>
                <div className="relative group">
                    <div
                        ref={photosScrollRef}
                        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
                    >
                        {photos.map((photo, index) => (
                            <button
                                key={photo.id}
                                onClick={() => openModal(photo, index)}
                                className="flex-shrink-0 w-[200px] h-[200px] rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity"
                            >
                                <Image
                                    src={photo.imageUrl}
                                    alt={`Review by ${photo.reviewerName}`}
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                    {/* Navigation Arrows - Visible on Hover */}
                    <button
                        onClick={() => scrollPhotos('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 z-10"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                        onClick={() => scrollPhotos('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 z-10"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Modal - Rendered via Portal */}
            {selectedPhoto && (
                <ReviewPhotoModal
                    photo={selectedPhoto}
                    photos={photos}
                    currentIndex={currentIndex}
                    onClose={closeModal}
                    onPrevious={goToPrevious}
                    onNext={goToNext}
                />
            )}
        </>
    );
}
