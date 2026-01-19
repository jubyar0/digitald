"use client";

import { ProductCard } from "./product-card";

interface Product {
    id: string;
    name: string;
    imageUrl: string;
    type: "Texture" | "Model" | "HDRI";
    isFree: boolean;
}

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No products found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    imageUrl={product.imageUrl}
                    type={product.type}
                    isFree={product.isFree}
                />
            ))}
        </div>
    );
}
