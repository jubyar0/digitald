"use client";

import { Download, Heart, Share2, ShoppingCart, Eye, ThumbsUp, Package, Info, FileText, Layers, Shield, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Material } from "@/lib/materials-data";
import { PurchaseDrawer } from "./purchase-drawer";
import { useState, useEffect } from "react";
import { publicApi } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

interface ProductDetailContentProps {
    material: Material;
}

export function ProductDetailContent({ material }: ProductDetailContentProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"download" | "cart">("download");
    const [similarMaterials, setSimilarMaterials] = useState<Material[]>([]);
    const [selectedImage, setSelectedImage] = useState(material.imageUrl);

    useEffect(() => {
        const fetchSimilar = async () => {
            try {
                const response = await publicApi.getPublishedProducts({
                    categoryId: material.category === 'Uncategorized' ? undefined : undefined, // Ideally pass category ID if available, else rely on name/tags search if API supports
                    limit: 4
                });

                if (response.success && response.data) {
                    // Filter out current product and map to Material
                    const mapped = response.data
                        .filter((p: any) => p.id !== material.id)
                        .slice(0, 4)
                        .map((product: any) => {
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
                                tags: [],
                                price: product.price
                            } as Material;
                        });
                    setSimilarMaterials(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch similar materials:", error);
            }
        };

        fetchSimilar();
    }, [material.id, material.category]);

    const handleAction = (mode: "download" | "cart") => {
        setDrawerMode(mode);
        setIsDrawerOpen(true);
    };

    // Use material images if available, otherwise fallback to imageUrl
    const displayImages = material.images && material.images.length > 0
        ? material.images
        : [material.imageUrl];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Images */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                        <Image
                            src={selectedImage}
                            alt={material.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    {displayImages.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {displayImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === img ? "border-blue-500" : "border-transparent hover:border-zinc-700"
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${material.name} view ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Details */}
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 text-xs">
                                {material.type || "Texture"}
                            </Badge>
                            {material.category && (
                                <Badge variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300 text-xs">
                                    {material.category}
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                            {material.name}
                        </h1>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                            <div className="flex items-center gap-1.5" title="Views">
                                <Eye className="w-4 h-4" />
                                <span>{material.views || "0"}</span>
                            </div>
                            <div className="flex items-center gap-1.5" title="Likes">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{material.likes || "0"}</span>
                            </div>
                            <div className="flex items-center gap-1.5" title="Downloads">
                                <Download className="w-4 h-4" />
                                <span>{material.downloads || "0"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white h-11"
                            onClick={() => handleAction("download")}
                            disabled={!material.fileUrl}
                            title={!material.fileUrl ? "No file available for download" : "Download"}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                        <Button
                            variant="outline"
                            className="border-zinc-700 hover:bg-zinc-800 text-white h-11"
                            onClick={() => handleAction("cart")}
                            disabled={!material.fileUrl}
                            title={!material.fileUrl ? "No file available" : "Add to Cart"}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="border-zinc-700 hover:bg-zinc-800 text-white">
                            <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="border-zinc-700 hover:bg-zinc-800 text-white">
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <Separator className="bg-zinc-800" />

                    {/* Asset Details */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white">
                            <Info className="w-4 h-4" />
                            <h3 className="text-sm font-semibold">Asset Details</h3>
                        </div>

                        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-zinc-800">
                                    <tr className="hover:bg-zinc-800/50">
                                        <td className="py-2.5 px-4 text-zinc-400 w-1/2">Resolution</td>
                                        <td className="py-2.5 px-4 text-white">{material.resolution || "Unknown"}</td>
                                    </tr>
                                    <tr className="hover:bg-zinc-800/50">
                                        <td className="py-2.5 px-4 text-zinc-400">File Size</td>
                                        <td className="py-2.5 px-4 text-white">{material.fileSize || "Unknown"}</td>
                                    </tr>
                                    <tr className="hover:bg-zinc-800/50">
                                        <td className="py-2.5 px-4 text-zinc-400">Format</td>
                                        <td className="py-2.5 px-4 text-white">{material.fileFormat || "Unknown"}</td>
                                    </tr>
                                    {material.specifications?.map((spec, idx) => (
                                        <tr key={idx} className="hover:bg-zinc-800/50">
                                            <td className="py-2.5 px-4 text-zinc-400">{spec.label}</td>
                                            <td className="py-2.5 px-4 text-white">{spec.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Separator className="bg-zinc-800" />

                    {/* Description */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white">
                            <FileText className="w-4 h-4" />
                            <h3 className="text-sm font-semibold">Description</h3>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            {material.description || "No description available."}
                        </p>
                    </div>

                    {/* Texture Maps */}
                    {material.textureMaps && material.textureMaps.length > 0 && (
                        <>
                            <Separator className="bg-zinc-800" />
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-white">
                                    <Layers className="w-4 h-4" />
                                    <h3 className="text-sm font-semibold">Texture Maps & Channels</h3>
                                </div>
                                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                                    <ul className="space-y-2">
                                        {material.textureMaps.map((map, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-zinc-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                {map}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}

                    <Separator className="bg-zinc-800" />

                    {/* Artist Information */}
                    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs text-zinc-500 uppercase">Artist</p>
                                <p className="text-sm text-white font-medium">{material.artist || "Unknown Artist"}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-xs text-zinc-500 uppercase">Published</p>
                                <p className="text-sm text-white font-medium">{material.publishedDate || "Recently"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Materials Section */}
            {similarMaterials.length > 0 && (
                <div className="pt-12 border-t border-zinc-800">
                    <h3 className="text-xl font-semibold text-white mb-6">Similar Materials</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {similarMaterials.map((item) => (
                            <Link href={`/3dm/${item.id}`} key={item.id} className="group block" prefetch={true}>
                                <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900 mb-3 border border-zinc-800 group-hover:border-zinc-600 transition-colors">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white truncate">
                                    {item.name}
                                </h4>
                                <p className="text-xs text-zinc-500 mt-1">{item.category}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <PurchaseDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                material={material}
                mode={drawerMode}
            />
        </div>
    );
}
