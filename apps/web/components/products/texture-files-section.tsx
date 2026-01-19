"use client";

import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useState } from "react";

interface TextureFile {
    type: string;
    description: string;
    fileName: string;
    formats: string[];
}

interface TextureFilesSectionProps {
    textureFiles?: TextureFile[];
}

export function TextureFilesSection({ textureFiles }: TextureFilesSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Default texture files if none provided
    const defaultTextureFiles: TextureFile[] = [
        {
            type: "Ambient Occlusion",
            description: "Simulates shadows in crevices and corners to enhance depth and realism.",
            fileName: "Poliigon_GroundAsphaltCoarse_10185_AmbientOcclusion",
            formats: [".jpg", ".png", ".tiff", ".exr"],
        },
        {
            type: "Base Color",
            description: "Defines the primary color of a surface without any lighting or shading effects.",
            fileName: "Poliigon_GroundAsphaltCoarse_10185_BaseColor",
            formats: [".jpg", ".png", ".tiff", ".exr"],
        },
        {
            type: "Displacement",
            description: "Defines the surface height information in grayscale. Mid-grey = flat, white = peak, black = depth.",
            fileName: "Poliigon_GroundAsphaltCoarse_10185_Displacement",
            formats: [".tiff", ".exr"],
        },
        {
            type: "Metallic",
            description: "Defines the metallic nature of a material, distinguishing between metal and non-metal surfaces.",
            fileName: "Poliigon_GroundAsphaltCoarse_10185_Metallic",
            formats: [".jpg", ".png", ".tiff", ".exr"],
        },
        {
            type: "Normal",
            description: "Simulates height information by altering the surface normals to create the illusion of bumps.",
            fileName: "Poliigon_GroundAsphaltCoarse_10185_Normal",
            formats: [".jpg", ".png", ".tiff", ".exr"],
        },
        {
            type: "ORM",
            description: "Contains the Ambient Occlusion, Roughness and Metalness information in the individual R, G and B channels. Typically used in real-time rendering applications.",
            fileName: "Poliigon_GroundAsphaltCoarse_10185_ORM",
            formats: [".jpg", ".png", ".tiff", ".exr"],
        },
        {
            type: "Roughness",
            description: "Determines the sharpness of reflections, with darker values giving sharper, clearer reflections.",
            fileName: "Poliigon_GroundAsphaltCoarse_10185_Roughness",
            formats: [".jpg", ".png", ".tiff", ".exr"],
        },
    ];

    const displayTextureFiles = Array.isArray(textureFiles) && textureFiles.length > 0
        ? textureFiles
        : defaultTextureFiles;

    return (
        <div className="border-t border-zinc-800">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors"
            >
                <h3 className="text-base font-semibold text-white">Texture Files & Formats</h3>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="pb-6">
                    <div className="space-y-6">
                        {displayTextureFiles.map((texture, index) => (
                            <div key={index} className="border-t border-zinc-800 pt-4 first:border-t-0 first:pt-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h4 className="text-sm font-medium text-white">{texture.type}</h4>
                                    <button className="flex-shrink-0 text-gray-400 hover:text-white transition-colors">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                                    {texture.description}
                                </p>
                                <div className="mb-2">
                                    <span className="text-xs text-gray-500">File Name: </span>
                                    <code className="text-xs text-gray-300 bg-zinc-900 px-2 py-0.5 rounded">
                                        {texture.fileName}
                                    </code>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {texture.formats.map((format, formatIndex) => (
                                        <span
                                            key={formatIndex}
                                            className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-gray-300 border border-zinc-700"
                                        >
                                            {format}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Format Notes */}
                    <div className="mt-6 p-3 bg-zinc-900/50 rounded border border-zinc-800">
                        <p className="text-xs text-gray-400">
                            <span className="font-medium text-gray-300">Note:</span> TIFFs (excluding displacement) are only available on Business & Enterprise. EXRs are exclusive to Enterprise.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
