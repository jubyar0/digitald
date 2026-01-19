export interface Material {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    tags: string[];
    // Extended fields for product detail page
    images?: string[];
    description?: string;
    type?: "Texture" | "Model" | "HDRI";
    isFree?: boolean;
    price?: number;
    fileUrl?: string;
    fileFormat?: string;
    fileSize?: string;
    resolution?: string;
    license?: string;
    specifications?: {
        label: string;
        value: string;
    }[];
    // New fields for exact design match
    artist?: string;
    publishedDate?: string;
    views?: string;
    downloads?: string;
    likes?: string;
    textureMaps?: string[];
    includes?: string[];
}

export const categories = [
    "All",
    "Concrete",
    "Fabric",
    "Glass",
    "Ground",
    "Marble",
    "Metal",
    "Plaster",
    "Stone",
    "Terracotta",
    "Tiles",
    "Wood",
];

export const materials: Material[] = [
    // Metal materials
    {
        id: "1",
        name: "Ink Spot Glazed Ceramic Pottery Texture, Beige",
        category: "Metal",
        imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop",
        tags: ["metal", "steel", "brushed"],
        images: [
            "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=800&fit=crop",
        ],
        description: "This is a texture of a beige ceramic pottery with ink spots. It has a smooth surface with some imperfections. It can be used for realistic 3D models of pottery, vases, and other ceramic objects.",
        type: "Texture",
        isFree: true,
        fileFormat: "JPG, 4K",
        fileSize: "45 MB",
        resolution: "4096 x 4096",
        license: "Standard License",
        artist: "Adam Guzman",
        publishedDate: "Nov 29, 2025",
        views: "1.2k",
        downloads: "856",
        likes: "124",
        includes: ["Albedo", "Normal", "Roughness", "Displacement", "Ambient Occlusion"],
        textureMaps: [
            "4K JPG Albedo",
            "4K JPG Normal",
            "4K JPG Roughness",
            "4K JPG Displacement",
            "4K JPG Ambient Occlusion"
        ],
        specifications: [
            { label: "Real World Scale", value: "100cm x 100cm" },
            { label: "Seamless", value: "Yes" },
            { label: "Texture Type", value: "PBR" },
            { label: "Method", value: "Scanning" },
        ]
    },
    { id: "2", name: "Copper Patina", category: "Metal", imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop", tags: ["metal", "copper", "aged"] },
    { id: "3", name: "Gold Leaf", category: "Metal", imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=400&fit=crop", tags: ["metal", "gold", "luxury"] },
    { id: "4", name: "Chrome", category: "Metal", imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop", tags: ["metal", "chrome", "reflective"] },


    // Wood materials
    { id: "5", name: "Oak Wood", category: "Wood", imageUrl: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop", tags: ["wood", "oak", "natural"] },
    { id: "6", name: "Walnut", category: "Wood", imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop", tags: ["wood", "walnut", "dark"] },
    { id: "7", name: "Pine", category: "Wood", imageUrl: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&h=400&fit=crop", tags: ["wood", "pine", "light"] },
    { id: "8", name: "Bamboo", category: "Wood", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop", tags: ["wood", "bamboo", "sustainable"] },

    // Stone materials
    { id: "9", name: "Granite", category: "Stone", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["stone", "granite", "rough"] },
    { id: "10", name: "Limestone", category: "Stone", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["stone", "limestone", "smooth"] },
    { id: "11", name: "Slate", category: "Stone", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["stone", "slate", "dark"] },
    { id: "12", name: "Sandstone", category: "Stone", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["stone", "sandstone", "beige"] },

    // Marble materials
    { id: "13", name: "Carrara Marble", category: "Marble", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["marble", "white", "luxury"] },
    { id: "14", name: "Black Marble", category: "Marble", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["marble", "black", "elegant"] },
    { id: "15", name: "Green Marble", category: "Marble", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["marble", "green", "unique"] },
    { id: "16", name: "Pink Marble", category: "Marble", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["marble", "pink", "soft"] },

    // Concrete materials
    { id: "17", name: "Smooth Concrete", category: "Concrete", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["concrete", "smooth", "modern"] },
    { id: "18", name: "Rough Concrete", category: "Concrete", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["concrete", "rough", "industrial"] },
    { id: "19", name: "Polished Concrete", category: "Concrete", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["concrete", "polished", "sleek"] },
    { id: "20", name: "Exposed Aggregate", category: "Concrete", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["concrete", "aggregate", "textured"] },

    // Fabric materials
    { id: "21", name: "Linen", category: "Fabric", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["fabric", "linen", "natural"] },
    { id: "22", name: "Velvet", category: "Fabric", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["fabric", "velvet", "luxury"] },
    { id: "23", name: "Cotton", category: "Fabric", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["fabric", "cotton", "soft"] },
    { id: "24", name: "Silk", category: "Fabric", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["fabric", "silk", "smooth"] },

    // Glass materials
    { id: "25", name: "Clear Glass", category: "Glass", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["glass", "clear", "transparent"] },
    { id: "26", name: "Frosted Glass", category: "Glass", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["glass", "frosted", "translucent"] },
    { id: "27", name: "Tinted Glass", category: "Glass", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["glass", "tinted", "colored"] },
    { id: "28", name: "Textured Glass", category: "Glass", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["glass", "textured", "decorative"] },

    // Tiles materials
    { id: "29", name: "Ceramic Tiles", category: "Tiles", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["tiles", "ceramic", "glossy"] },
    { id: "30", name: "Porcelain Tiles", category: "Tiles", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["tiles", "porcelain", "durable"] },
    { id: "31", name: "Mosaic Tiles", category: "Tiles", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["tiles", "mosaic", "decorative"] },
    { id: "32", name: "Subway Tiles", category: "Tiles", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["tiles", "subway", "classic"] },

    // Plaster materials
    { id: "33", name: "Smooth Plaster", category: "Plaster", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["plaster", "smooth", "white"] },
    { id: "34", name: "Venetian Plaster", category: "Plaster", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["plaster", "venetian", "polished"] },
    { id: "35", name: "Textured Plaster", category: "Plaster", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["plaster", "textured", "rough"] },
    { id: "36", name: "Lime Plaster", category: "Plaster", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["plaster", "lime", "natural"] },

    // Ground materials
    { id: "37", name: "Grass", category: "Ground", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["ground", "grass", "green"] },
    { id: "38", name: "Dirt", category: "Ground", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["ground", "dirt", "brown"] },
    { id: "39", name: "Gravel", category: "Ground", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["ground", "gravel", "stones"] },
    { id: "40", name: "Sand", category: "Ground", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["ground", "sand", "beach"] },

    // Terracotta materials
    { id: "41", name: "Red Terracotta", category: "Terracotta", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["terracotta", "red", "clay"] },
    { id: "42", name: "Glazed Terracotta", category: "Terracotta", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["terracotta", "glazed", "shiny"] },
    { id: "43", name: "Aged Terracotta", category: "Terracotta", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["terracotta", "aged", "weathered"] },
    { id: "44", name: "Terracotta Tiles", category: "Terracotta", imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=400&h=400&fit=crop", tags: ["terracotta", "tiles", "rustic"] },
];
