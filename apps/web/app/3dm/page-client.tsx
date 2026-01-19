"use client";

import { useState, useEffect } from "react";
import { MaterialsSearch } from "@/components/3dm/materials-search";
import { CategoryFilters } from "@/components/3dm/category-filters";
import { MaterialsGrid } from "@/components/3dm/materials-grid";
import { Material } from "@/lib/materials-data";
import { publicApi } from "@/lib/api";
import { UnifiedNavbarClient } from "@/components/unified-navbar-client";
import { DynamicFooter } from "@/components/footer/dynamic-footer";

interface ThreeDMPageClientProps {
    footerSettings: any;
}

export function ThreeDMPageClient({ footerSettings }: ThreeDMPageClientProps) {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch categories
                const categoriesResponse = await publicApi.getCategories();
                if (categoriesResponse.success && categoriesResponse.data) {
                    setCategories(['All', ...categoriesResponse.data.map((c: any) => c.name)]);
                }

                // Fetch products
                const response = await publicApi.getPublishedProducts({
                    search: searchQuery,
                    categoryId: selectedCategory !== 'All' ? categoriesResponse.data?.find((c: any) => c.name === selectedCategory)?.id : undefined
                });

                if (response.success && response.data) {
                    // Map backend product data to frontend Material interface
                    const mappedMaterials: Material[] = response.data.map((product: any) => {
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

                        return {
                            id: product.id,
                            name: product.name,
                            category: product.category?.name || 'Uncategorized',
                            imageUrl: product.thumbnail || productImages[0] || '/placeholder.jpg',
                            tags: product.productTags?.map((pt: any) => pt.tag.name) || [],
                            images: productImages.length > 0 ? productImages : (product.thumbnail ? [product.thumbnail] : []),
                            description: product.description || '',
                            type: 'Model',
                            isFree: product.price === 0,
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
                    });
                    setMaterials(mappedMaterials);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchQuery, selectedCategory]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <UnifiedNavbarClient />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">3D Materials</h1>
                        <p className="text-zinc-400 mt-1">High-quality textures and models for your projects</p>
                    </div>
                    <MaterialsSearch value={searchQuery} onChange={handleSearch} />
                </div>

                <CategoryFilters
                    categories={categories}
                    activeCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : (
                    <MaterialsGrid materials={materials} />
                )}
            </div>
            <DynamicFooter settings={footerSettings} />
        </div>
    );
}
