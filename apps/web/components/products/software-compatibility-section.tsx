"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Software {
    name: string;
    hasAddon: boolean;
    isAvailable: boolean;
}

interface SoftwareCompatibilitySectionProps {
    compatibleSoftware?: Software[];
    addonSupport?: any;
}

export function SoftwareCompatibilitySection({ compatibleSoftware, addonSupport }: SoftwareCompatibilitySectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Default software based on reference images
    const defaultSoftware: Software[] = [
        { name: "Blender", hasAddon: true, isAvailable: true },
        { name: "3ds Max", hasAddon: true, isAvailable: true },
        { name: "Cinema 4D", hasAddon: true, isAvailable: true },
        { name: "SketchUp", hasAddon: true, isAvailable: true },
        { name: "Maya", hasAddon: true, isAvailable: true },
        { name: "Unreal Engine", hasAddon: true, isAvailable: true },
        { name: "Unity", hasAddon: true, isAvailable: true },
        { name: "Houdini", hasAddon: false, isAvailable: false },
    ];

    const displaySoftware = Array.isArray(compatibleSoftware) && compatibleSoftware.length > 0
        ? compatibleSoftware
        : defaultSoftware;

    return (
        <div className="border-t border-zinc-800">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors"
            >
                <h3 className="text-base font-semibold text-white">
                    Works with your software & render engine
                </h3>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="pb-6">
                    <p className="text-sm text-gray-400 mb-4">
                        Search, download and import assets without leaving your 3D software.
                    </p>

                    {/* Addon Support Table */}
                    <div>
                        <h4 className="text-sm font-medium text-white mb-3">Addon Support</h4>
                        <div className="border border-zinc-800 rounded-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-zinc-900/50">
                                    <tr>
                                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-400">Software</th>
                                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-400">Addon Available</th>
                                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displaySoftware.map((software, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-zinc-800"
                                        >
                                            <td className="py-2.5 px-4 text-sm text-white">
                                                {software.name}
                                            </td>
                                            <td className="py-2.5 px-4 text-sm text-gray-400">
                                                {software.hasAddon ? "Addon Available" : "Coming Soon"}
                                            </td>
                                            <td className="py-2.5 px-4">
                                                {software.isAvailable ? (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                                                        Available
                                                    </span>
                                                ) : (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                        Coming Soon
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
