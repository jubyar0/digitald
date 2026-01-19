"use client";

import { Search } from "lucide-react";

interface MaterialsSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function MaterialsSearch({ value, onChange }: MaterialsSearchProps) {
    return (
        <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="text"
                placeholder="Search materials..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-[#09090b] border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700 transition-all"
            />
        </div>
    );
}
