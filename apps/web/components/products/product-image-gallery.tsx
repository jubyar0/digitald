"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Ensure we have at least 4 images for the 2x2 grid
    const displayImages = images.length > 0 ? images : ["/placeholder.png"];
    const gridImages = displayImages.slice(0, 4);

    const handlePrevious = () => {
        setSelectedImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="space-y-4">
            {/* Main Image Display */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-[#1c1c1c] border border-white/10 group">
                <Image
                    src={displayImages[selectedImage]}
                    alt={`${productName} - Image ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                    priority={selectedImage === 0} // ✅ LCP Optimization
                    loading={selectedImage === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 768px) 100vw, 600px"
                />
                {/* Zoom Button Overlay */}
                <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute top-4 right-4 h-10 w-10 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                    <ZoomIn className="h-5 w-5" />
                </button>
            </div>

            {/* 2x2 Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-3">
                {gridImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden bg-[#1c1c1c] border-2 transition-all hover:border-indigo-500 ${selectedImage === index
                            ? "border-indigo-500 ring-2 ring-indigo-500/50"
                            : "border-white/10"
                            }`}
                    >
                        <Image
                            src={image}
                            alt={`${productName} - Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                        {/* Overlay on non-selected images */}
                        {selectedImage !== index && (
                            <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors" />
                        )}
                    </button>
                ))}
            </div>

            {/* Additional Images Indicator */}
            {displayImages.length > 4 && (
                <div className="text-center">
                    <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        +{displayImages.length - 4} more images
                    </button>
                </div>
            )}

            {/* Lightbox Modal */}
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                <DialogContent className="max-w-7xl w-full h-[90vh] bg-black/95 border-white/10 p-0">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-4 right-4 z-50 h-10 w-10 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Navigation Buttons */}
                        {displayImages.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevious}
                                    className="absolute left-4 z-50 h-12 w-12 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-4 z-50 h-12 w-12 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}

                        {/* Main Image */}
                        <div className="relative w-full h-full p-16">
                            <Image
                                src={displayImages[selectedImage]}
                                alt={`${productName} - Image ${selectedImage + 1}`}
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 text-white text-sm">
                            {selectedImage + 1} / {displayImages.length}
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-2xl overflow-x-auto px-4">
                            {displayImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${selectedImage === index
                                        ? "border-indigo-500 ring-2 ring-indigo-500/50"
                                        : "border-white/20 hover:border-white/40"
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
