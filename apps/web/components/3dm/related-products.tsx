"use client";

import { ProductCard } from "./product-card";
import type { Material } from "@/lib/materials-data";

interface RelatedProductsProps {
    materials: Material[];
}

export function RelatedProducts({ materials }: RelatedProductsProps) {
    if (materials.length === 0) return null;

    return (
        <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {materials.map((material) => (
                    <ProductCard
                        key={material.id}
                        id={material.id}
                        name={material.name}
                        imageUrl={material.imageUrl}
                        type={material.type || "Texture"}
                        isFree={material.isFree || false}
                    />
                ))}
            </div>
        </div>
    );
}
