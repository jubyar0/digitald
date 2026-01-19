"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    // Ensure we have at least 4 images for the grid, repeat if necessary
    const displayImages = images.length >= 4 ? images.slice(0, 4) : [...images, ...images, ...images, ...images].slice(0, 4);

    return (
        <div className="space-y-3">
            {/* Main Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900">
                <Image
                    src={images[selectedImage] || images[0]}
                    alt={`${productName} - View ${selectedImage + 1}`}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Thumbnail Grid - 2x2 */}
            <div className="grid grid-cols-2 gap-3">
                {displayImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index % images.length)}
                        className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${selectedImage === (index % images.length)
                                ? "ring-2 ring-blue-500"
                                : "opacity-70 hover:opacity-100"
                            }`}
                    >
                        <Image
                            src={image}
                            alt={`${productName} - Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
