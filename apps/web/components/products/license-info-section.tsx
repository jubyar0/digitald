"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface License {
    name: string;
    description: string;
    features: string[];
}

interface LicenseInfoSectionProps {
    licenses?: License[];
}

export function LicenseInfoSection({ licenses }: LicenseInfoSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Simple license info - no subscription/monthly pricing
    const defaultLicenses: License[] = [
        {
            name: "Standard License",
            description: "For personal and commercial projects",
            features: [
                "Use in unlimited projects",
                "Royalty-free usage",
                "Commercial use allowed",
                "Cannot redistribute or resell",
            ],
        },
    ];

    const displayLicenses = Array.isArray(licenses) && licenses.length > 0
        ? licenses
        : defaultLicenses;

    return (
        <div className="border-t border-zinc-800">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors"
            >
                <h3 className="text-base font-semibold text-white">License Information</h3>
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
                        All licenses support royalty free personal, educational and commercial use.
                    </p>

                    <div className="space-y-4">
                        {displayLicenses.map((license, index) => (
                            <div key={index} className="border border-zinc-800 rounded-md p-4">
                                <h4 className="text-sm font-medium text-white mb-2">{license.name}</h4>
                                <p className="text-xs text-gray-400 mb-3">{license.description}</p>
                                <ul className="space-y-1.5">
                                    {license.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-2 text-xs text-gray-400">
                                            <span className="text-green-500 mt-0.5">•</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-zinc-900/50 rounded border border-zinc-800">
                        <p className="text-xs text-gray-400">
                            <span className="font-medium text-gray-300">Important:</span> Some further restrictions apply. For full details and information on all our licenses, see our license overview.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
