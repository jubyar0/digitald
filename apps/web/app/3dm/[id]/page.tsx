"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UnifiedNavbarClient } from "@/components/unified-navbar-client";
import { DynamicFooter } from "@/components/footer/dynamic-footer";
import { ProductDetailContent } from "@/components/3dm/product-detail-content";
import { publicApi } from "@/lib/api";
import { Material } from "@/lib/materials-data";

import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

export default function ProductPage() {
    const params = useParams();
    const id = params.id as string;
    const [material, setMaterial] = useState<Material | null>(null);
    const [loading, setLoading] = useState(true);
    const { addProduct } = useRecentlyViewed();

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const response = await publicApi.getPublishedProduct(id);
                if (response.success && response.data) {
                    const product = response.data;

                    // Add to recently viewed
                    addProduct(product.id);

                    // Parse images from JSON
                    let productImages: string[] = [];
                    if (product.images) {
                        try {
                            const parsed = typeof product.images === 'string'
                                ? JSON.parse(product.images)
                                : product.images;
                            productImages = Array.isArray(parsed) ? parsed : [];
                        } catch (e) {
                            console.error('Failed to parse images for product:', product.id);
                        }
                    }

                    const mappedMaterial: Material = {
                        id: product.id,
                        name: product.name,
                        category: product.category?.name || 'Uncategorized',
                        imageUrl: product.thumbnail || productImages[0] || '/placeholder.jpg',
                        tags: product.productTags?.map((pt: { tag: { name: string } }) => pt.tag.name) || [],
                        images: productImages.length > 0 ? productImages : (product.thumbnail ? [product.thumbnail] : []),
                        description: product.description || '',
                        type: 'Model',
                        isFree: product.price === 0,
                        price: product.price,
                        // fileUrl: product.fileUrl,
                        fileFormat: 'Various',
                        fileSize: 'Unknown',
                        resolution: 'Unknown',
                        license: 'Standard',
                        specifications: [],
                        artist: product.vendor?.name || 'Unknown',
                        publishedDate: product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '',
                        views: product.views?.toString() || '0',
                        downloads: product.downloads?.toString() || '0',
                        likes: product.likes?.toString() || '0',
                        textureMaps: [],
                        includes: []
                    };
                    setMaterial(mappedMaterial);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <UnifiedNavbarClient />
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <div className="animate-pulse text-zinc-400">Loading product details...</div>
                </div>
                <DynamicFooter />
            </div>
        );
    }

    if (!material) {
        return (
            <div className="min-h-screen bg-black text-white">
                <UnifiedNavbarClient />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
                    <h1 className="text-2xl font-bold">Product Not Found</h1>
                    <p className="text-zinc-400">The product you are looking for does not exist or has been removed.</p>
                </div>
                <DynamicFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <UnifiedNavbarClient />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <ProductDetailContent material={material} />
            </div>
            <DynamicFooter />
        </div>
    );
}
