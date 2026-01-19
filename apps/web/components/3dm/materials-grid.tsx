"use client";

import { MaterialCard } from "./material-card";
import type { Material } from "@/lib/materials-data";

interface MaterialsGridProps {
    materials: Material[];
}

export function MaterialsGrid({ materials }: MaterialsGridProps) {
    if (materials.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No materials found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {materials.map((material) => (
                <MaterialCard
                    key={material.id}
                    id={material.id}
                    name={material.name}
                    imageUrl={material.imageUrl}
                    category={material.category}
                />
            ))}
        </div>
    );
}
