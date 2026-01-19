import { materials } from "@/lib/materials-data";

// Helper function to get material by ID
export function getMaterialById(id: string) {
    return materials.find((material) => material.id === id);
}

// Helper function to get related materials (same category, excluding current)
export function getRelatedMaterials(id: string, limit: number = 4) {
    const currentMaterial = getMaterialById(id);
    if (!currentMaterial) return [];

    return materials
        .filter(
            (material) =>
                material.id !== id && material.category === currentMaterial.category
        )
        .slice(0, limit);
}
