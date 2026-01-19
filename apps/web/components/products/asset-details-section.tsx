"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Resolution {
    name: string;
    size: string;
    texelDensity: string;
}

interface AssetDetailsSectionProps {
    resolutions?: Resolution[];
    physicalSize?: {
        height?: number;
        width?: number;
        depth?: number;
    };
    creationMethod?: string;
    assetDetails?: string;
}

export function AssetDetailsSection({
    resolutions,
    physicalSize,
    creationMethod,
    assetDetails,
}: AssetDetailsSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Default resolutions if none provided
    const defaultResolutions: Resolution[] = [
        { name: "8K", size: "8192 x 8192", texelDensity: "32 px/cm" },
        { name: "4K", size: "4096 x 4096", texelDensity: "16 px/cm" },
        { name: "2K", size: "2048 x 2048", texelDensity: "8 px/cm" },
        { name: "1K", size: "1024 x 1024", texelDensity: "4 px/cm" },
    ];

    const displayResolutions = resolutions || defaultResolutions;

    return (
        <div className="border-t border-zinc-800">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors"
            >
                <h3 className="text-base font-semibold text-white">Asset Details</h3>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="pb-6 space-y-6">
                    {/* Asset Details Description */}
                    {assetDetails && (
                        <div>
                            <p className="text-sm text-gray-400 leading-relaxed">{assetDetails}</p>
                        </div>
                    )}

                    {/* Resolutions Table */}
                    <div>
                        <h4 className="text-sm font-medium text-white mb-3">Resolutions</h4>
                        <div className="border border-zinc-800 rounded-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-zinc-900/50">
                                    <tr>
                                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-400">Resolution</th>
                                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-400">Texel Density</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayResolutions.map((resolution, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-zinc-800"
                                        >
                                            <td className="py-2.5 px-4 text-sm text-white">
                                                {resolution.name} ({resolution.size})
                                            </td>
                                            <td className="py-2.5 px-4 text-sm text-gray-400">
                                                {resolution.texelDensity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Physical Size */}
                    {physicalSize && (physicalSize.height || physicalSize.width || physicalSize.depth) && (
                        <div>
                            <h4 className="text-sm font-medium text-white mb-3">Physical Size</h4>
                            <div className="border border-zinc-800 rounded-md p-4">
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    {physicalSize.height && (
                                        <div>
                                            <span className="text-gray-400">Height: </span>
                                            <span className="text-white">{physicalSize.height.toFixed(2)} m</span>
                                        </div>
                                    )}
                                    {physicalSize.width && (
                                        <div>
                                            <span className="text-gray-400">Width: </span>
                                            <span className="text-white">{physicalSize.width.toFixed(2)} m</span>
                                        </div>
                                    )}
                                    {physicalSize.depth && (
                                        <div>
                                            <span className="text-gray-400">Depth: </span>
                                            <span className="text-white">{physicalSize.depth.toFixed(2)} m</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Creation Method */}
                    {creationMethod && (
                        <div>
                            <h4 className="text-sm font-medium text-white mb-3">Creation Method</h4>
                            <div className="border border-zinc-800 rounded-md p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white mb-1">{creationMethod}</p>
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            This texture is a photoscan of a real world surface. Typically created from hundreds of photographs to reconstruct an accurate surface appearance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
