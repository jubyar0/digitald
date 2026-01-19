"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { UnifiedNavbarClient } from "@/components/unified-navbar-client";
import { DynamicFooter } from "@/components/footer/dynamic-footer";
import { ProductImageGallery } from "@/components/3dm/product-image-gallery";
import { ProductInfo } from "@/components/3dm/product-info";
import { Material } from "@/lib/materials-data";
import { publicApi } from "@/lib/api";

export default function ProductPage() {
    const params = useParams();
    const [material, setMaterial] = useState<Material | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params.id) return;

            setLoading(true);
            try {
                const response = await publicApi.getPublishedProduct(params.id as string);

                if (response) {
                    // The response might be the product object directly or wrapped in { success, data }
                    // Based on controller it returns the product object directly
                    const product = response as any;

                    const mappedMaterial: Material = {
                        id: product.id,
                        name: product.name,
                        category: product.category?.name || 'Uncategorized',
                        imageUrl: product.thumbnail || product.images?.[0]?.url || '/placeholder.jpg',
                        tags: product.productTags?.map((pt: any) => pt.tag.name) || [],
                        images: product.images?.map((img: any) => img.url) || [],
                        description: product.description,
                        type: 'Model',
                        isFree: product.price === 0,
                        fileFormat: product.nativeFileFormats?.[0]?.format || 'Unknown',
                        fileSize: 'Unknown',
                        resolution: product.textureFiles?.defaultResolution || 'Unknown',
                        license: product.licenseInfo?.type || 'Standard',
                        specifications: [
                            { label: 'Vertices', value: product.meshCount?.toString() || 'Unknown' },
                            { label: 'UV Mapped', value: 'Yes' },
                            { label: 'Rigged', value: 'No' },
                        ],
                        artist: product.vendor?.name || 'Unknown',
                        publishedDate: new Date(product.createdAt).toLocaleDateString(),
                        views: product.views?.toString() || '0',
                        downloads: product.downloads?.toString() || '0',
                        likes: product.likes?.toString() || '0',
                        textureMaps: product.textureFiles?.textures?.map((t: any) => t.type) || [],
                        includes: product.universalFileFormats?.map((f: any) => f.format) || []
                    };
                    setMaterial(mappedMaterial);
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!material) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Product not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <UnifiedNavbarClient />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ProductImageGallery
                        images={material.images || [material.imageUrl]}
                        productName={material.name}
                    />
                    <ProductInfo
                        name={material.name}
                        type={material.type || 'Model'}
                        isFree={material.isFree ?? false}
                        description={material.description || ''}
                        fileFormat={material.fileFormat || 'Unknown'}
                        fileSize={material.fileSize || 'Unknown'}
                        resolution={material.resolution}
                        license={material.license || 'Standard'}
                        artist={material.artist}
                        publishedDate={material.publishedDate}
                        views={material.views}
                        downloads={material.downloads}
                        likes={material.likes}
                        includes={material.includes}
                        textureMaps={material.textureMaps}
                        specifications={material.specifications}
                    />
                </div>
            </div>
            <DynamicFooter />
        </div>
    );
}
