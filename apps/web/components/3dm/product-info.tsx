import { useState } from "react";
import { Download, Info, CheckCircle, FileText, Layers, Box, Shield, Eye, Heart, Share2, ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PurchaseDrawer } from "./purchase-drawer";
import { Material } from "@/lib/materials-data";

interface ProductInfoProps {
    name: string;
    type: string;
    isFree: boolean;
    description: string;
    fileFormat: string;
    fileSize: string;
    resolution?: string;
    license: string;
    artist?: string;
    publishedDate?: string;
    views?: string;
    downloads?: string;
    likes?: string;
    includes?: string[];
    textureMaps?: string[];
    specifications?: { label: string; value: string }[];
    // We need the full material object for the drawer
    material?: Material;
}

export function ProductInfo({
    name,
    type,
    isFree,
    description,
    fileFormat,
    fileSize,
    resolution,
    license,
    artist,
    publishedDate,
    views,
    downloads,
    likes,
    includes,
    textureMaps,
    specifications,
    material
}: ProductInfoProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"download" | "cart">("download");

    const handleAction = (mode: "download" | "cart") => {
        setDrawerMode(mode);
        setIsDrawerOpen(true);
    };

    // Construct a minimal material object if one isn't provided (fallback)
    const currentMaterial: Material = material || {
        id: "unknown",
        name,
        category: "Uncategorized",
        imageUrl: "/placeholder.jpg",
        tags: [],
        description,
        type: type as any, // Cast to any to avoid strict union type issues with fallback
        isFree,
        fileFormat,
        fileSize,
        resolution,
        license,
        artist,
        publishedDate,
        views,
        downloads,
        likes,
        textureMaps,
        includes,
        specifications
    };

    return (
        <div className="space-y-8 text-gray-300">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
                    <span>{type}</span>
                </div>
                <h1 className="text-3xl font-bold text-white leading-tight">{name}</h1>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                            Premium
                        </Badge>
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Purchase Section */}
            <div className="space-y-4">
                <p className="text-sm text-gray-400">
                    Purchase includes access to all file formats and resolutions.
                </p>

                <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-3 flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>100% Secure checkout & Satisfaction Guarantee</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {isFree ? (
                        <Button
                            className="w-full h-12 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => handleAction("download")}
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Download Free
                        </Button>
                    ) : (
                        <Button
                            className="w-full h-12 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => handleAction("cart")}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart
                        </Button>
                    )}
                </div>

                <div className="bg-[#09090b] rounded-lg p-4 flex items-start gap-3 border border-white/5">
                    <div className="bg-orange-500/10 p-2 rounded-md">
                        <Box className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-sm text-white font-medium">This 3D asset is part of a collection</p>
                        <p className="text-xs text-gray-500 mt-1">Save up to 50% when buying the full set.</p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-white/10">
                <div>
                    <p className="text-xs text-gray-500 uppercase">File Size</p>
                    <p className="text-sm text-white font-medium">{fileSize}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">Resolution</p>
                    <p className="text-sm text-white font-medium">{resolution || "N/A"}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">Format</p>
                    <p className="text-sm text-white font-medium">{fileFormat}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">License</p>
                    <p className="text-sm text-white font-medium">Standard</p>
                </div>
            </div>

            {/* Asset Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold">
                    <Info className="w-4 h-4" />
                    <h3>Asset Details</h3>
                </div>

                <div className="bg-[#09090b] rounded-lg border border-white/5 overflow-hidden">
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-white/5">
                            {specifications?.map((spec, idx) => (
                                <tr key={idx} className="hover:bg-white/5">
                                    <td className="py-3 px-4 text-gray-400 w-1/3">{spec.label}</td>
                                    <td className="py-3 px-4 text-white">{spec.value}</td>
                                </tr>
                            ))}
                            {/* Default rows if no specs provided */}
                            {!specifications && (
                                <>
                                    <tr className="hover:bg-white/5">
                                        <td className="py-3 px-4 text-gray-400 w-1/3">Resolution</td>
                                        <td className="py-3 px-4 text-white">{resolution}</td>
                                    </tr>
                                    <tr className="hover:bg-white/5">
                                        <td className="py-3 px-4 text-gray-400">File Size</td>
                                        <td className="py-3 px-4 text-white">{fileSize}</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold">
                    <FileText className="w-4 h-4" />
                    <h3>Description</h3>
                </div>
                <div className="text-sm text-gray-400 leading-relaxed space-y-4">
                    <p>{description}</p>
                </div>
            </div>

            {/* Texture Maps & Channels */}
            {textureMaps && textureMaps.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white font-semibold">
                        <Layers className="w-4 h-4" />
                        <h3>Texture Maps & Channels</h3>
                    </div>
                    <div className="bg-[#09090b] rounded-lg border border-white/5 p-4">
                        <ul className="space-y-2">
                            {textureMaps.map((map, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    {map}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Free Files */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold">
                    <Download className="w-4 h-4" />
                    <h3>Free Files</h3>
                </div>
                <div className="bg-[#09090b] rounded-lg border border-white/5 p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-white font-medium">Source Files</span>
                        <span className="text-gray-500">{fileSize}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                        Includes all maps, project files, and documentation.
                    </p>
                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download Now
                    </Button>
                </div>
            </div>

            {/* Artist Info */}
            <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase">Artist</p>
                        <p className="text-white font-medium">{artist || "Unknown Artist"}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-xs text-gray-500 uppercase">Published</p>
                        <p className="text-white font-medium">{publishedDate || "Recently"}</p>
                    </div>
                </div>
            </div>

            <PurchaseDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                material={currentMaterial}
                mode={drawerMode}
            />
        </div>
    );
}
