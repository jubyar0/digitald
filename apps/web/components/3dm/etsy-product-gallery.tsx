"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";

interface EtsyProductGalleryProps {
    images: string[];
    productName: string;
}

export function EtsyProductGallery({ images, productName }: EtsyProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);

    // Always show thumbnails - duplicate if only one image
    const displayImages = images.length > 0 ? images : ['/placeholder.jpg'];
    const thumbnailImages = displayImages.length === 1
        ? [displayImages[0], displayImages[0], displayImages[0], displayImages[0], displayImages[0]]
        : displayImages;

    const handlePrevious = () => {
        setSelectedImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="flex gap-4">
            {/* Left Column - Thumbnails */}
            <div className="flex flex-col gap-2 w-[60px] flex-shrink-0">
                {thumbnailImages.slice(0, 6).map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index % displayImages.length)}
                        className={cn(
                            "relative w-[60px] h-[60px] rounded overflow-hidden transition-all duration-200",
                            selectedImage === (index % displayImages.length)
                                ? "ring-2 ring-gray-900 ring-offset-1"
                                : "border border-gray-200 hover:border-gray-400"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`${productName} - View ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="60px"
                        />
                        {/* Etsy&apos;s Pick Badge - Only on first thumbnail */}
                        {index === 1 && (
                            <div className="absolute top-1 left-1 bg-teal-600 text-white text-[8px] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                                <span>✦</span> Etsy&apos;s Pick
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Center - Main Image with Navigation */}
            <div className="flex-1 flex items-center gap-3">
                {/* Left Arrow */}
                <button
                    onClick={handlePrevious}
                    className="flex-shrink-0 h-10 w-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>

                {/* Main Image */}
                <div className="flex-1 flex flex-col">
                    <div className="relative aspect-square w-full max-w-[500px] mx-auto rounded overflow-hidden bg-gray-50">
                        <Image
                            src={displayImages[selectedImage]}
                            alt={`${productName} - View ${selectedImage + 1}`}
                            fill
                            className="object-cover"
                            priority
                            sizes="500px"
                        />

                        {/* Top Right - Favorite Button */}
                        <button
                            onClick={() => setIsFavorited(!isFavorited)}
                            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition-all"
                            aria-label="Add to favorites"
                        >
                            <Heart
                                className={cn(
                                    "h-5 w-5 transition-colors",
                                    isFavorited ? "text-red-500 fill-red-500" : "text-gray-600"
                                )}
                            />
                        </button>

                        {/* Etsy&apos;s Pick Badge on Main Image */}
                        {selectedImage === 1 && (
                            <div className="absolute top-3 left-3 bg-teal-600 text-white text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
                                <span>✦</span> Etsy&apos;s Pick
                            </div>
                        )}
                    </div>

                    {/* Report Link */}
                    <div className="text-center mt-3">
                        <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1.5 mx-auto">
                            <Flag className="h-3 w-3" />
                            Report this item to Etsy
                        </button>
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    onClick={handleNext}
                    className="flex-shrink-0 h-10 w-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                    aria-label="Next image"
                >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
}
