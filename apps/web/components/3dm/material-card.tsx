"use client";

import Image from "next/image";
import Link from "next/link";

interface MaterialCardProps {
    id: string;
    name: string;
    imageUrl: string;
    category: string;
}

export function MaterialCard({ id, name, imageUrl, category }: MaterialCardProps) {
    return (
        <Link
            href={`/3dm/${id}`}
            className="group block"
        >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-[#09090b] mb-2 border border-gray-800 hover:border-gray-700 transition-all duration-300">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="space-y-0.5">
                <h3 className="text-gray-300 font-normal text-sm truncate group-hover:text-white transition-colors">
                    {name}
                </h3>
            </div>
        </Link>
    );
}
