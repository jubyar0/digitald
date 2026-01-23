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
        imageUrl: "/media/illustrations/19.svg",
        tags: ["metal", "steel", "brushed"],
        images: [
            "/media/illustrations/19.svg",
            "/media/illustrations/20.svg",
            "/media/illustrations/21.svg",
            "/media/illustrations/22.svg",
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
    { id: "2", name: "Copper Patina", category: "Metal", imageUrl: "/media/illustrations/23.svg", tags: ["metal", "copper", "aged"] },
    { id: "3", name: "Gold Leaf", category: "Metal", imageUrl: "/media/illustrations/24.svg", tags: ["metal", "gold", "luxury"] },
    { id: "4", name: "Chrome", category: "Metal", imageUrl: "/media/illustrations/25.svg", tags: ["metal", "chrome", "reflective"] },


    // Wood materials
    { id: "5", name: "Oak Wood", category: "Wood", imageUrl: "/media/illustrations/26.svg", tags: ["wood", "oak", "natural"] },
    { id: "6", name: "Walnut", category: "Wood", imageUrl: "/media/illustrations/27.svg", tags: ["wood", "walnut", "dark"] },
    { id: "7", name: "Pine", category: "Wood", imageUrl: "/media/illustrations/28.svg", tags: ["wood", "pine", "light"] },
    { id: "8", name: "Bamboo", category: "Wood", imageUrl: "/media/illustrations/29.svg", tags: ["wood", "bamboo", "sustainable"] },

    // Stone materials
    { id: "9", name: "Granite", category: "Stone", imageUrl: "/media/illustrations/30.svg", tags: ["stone", "granite", "rough"] },
    { id: "10", name: "Limestone", category: "Stone", imageUrl: "/media/illustrations/31.svg", tags: ["stone", "limestone", "smooth"] },
    { id: "11", name: "Slate", category: "Stone", imageUrl: "/media/illustrations/32.svg", tags: ["stone", "slate", "dark"] },
    { id: "12", name: "Sandstone", category: "Stone", imageUrl: "/media/illustrations/33.svg", tags: ["stone", "sandstone", "beige"] },

    // Marble materials
    { id: "13", name: "Carrara Marble", category: "Marble", imageUrl: "/media/illustrations/1.svg", tags: ["marble", "white", "luxury"] },
    { id: "14", name: "Black Marble", category: "Marble", imageUrl: "/media/illustrations/2.svg", tags: ["marble", "black", "elegant"] },
    { id: "15", name: "Green Marble", category: "Marble", imageUrl: "/media/illustrations/3.svg", tags: ["marble", "green", "unique"] },
    { id: "16", name: "Pink Marble", category: "Marble", imageUrl: "/media/illustrations/4.svg", tags: ["marble", "pink", "soft"] },

    // Concrete materials
    { id: "17", name: "Smooth Concrete", category: "Concrete", imageUrl: "/media/illustrations/5.svg", tags: ["concrete", "smooth", "modern"] },
    { id: "18", name: "Rough Concrete", category: "Concrete", imageUrl: "/media/illustrations/6.svg", tags: ["concrete", "rough", "industrial"] },
    { id: "19", name: "Polished Concrete", category: "Concrete", imageUrl: "/media/illustrations/7.svg", tags: ["concrete", "polished", "sleek"] },
    { id: "20", name: "Exposed Aggregate", category: "Concrete", imageUrl: "/media/illustrations/8.svg", tags: ["concrete", "aggregate", "textured"] },

    // Fabric materials
    { id: "21", name: "Linen", category: "Fabric", imageUrl: "/media/illustrations/9.svg", tags: ["fabric", "linen", "natural"] },
    { id: "22", name: "Velvet", category: "Fabric", imageUrl: "/media/illustrations/10.svg", tags: ["fabric", "velvet", "luxury"] },
    { id: "23", name: "Cotton", category: "Fabric", imageUrl: "/media/illustrations/11.svg", tags: ["fabric", "cotton", "soft"] },
    { id: "24", name: "Silk", category: "Fabric", imageUrl: "/media/illustrations/12.svg", tags: ["fabric", "silk", "smooth"] },

    // Glass materials
    { id: "25", name: "Clear Glass", category: "Glass", imageUrl: "/media/illustrations/13.svg", tags: ["glass", "clear", "transparent"] },
    { id: "26", name: "Frosted Glass", category: "Glass", imageUrl: "/media/illustrations/14.svg", tags: ["glass", "frosted", "translucent"] },
    { id: "27", name: "Tinted Glass", category: "Glass", imageUrl: "/media/illustrations/15.svg", tags: ["glass", "tinted", "colored"] },
    { id: "28", name: "Textured Glass", category: "Glass", imageUrl: "/media/illustrations/16.svg", tags: ["glass", "textured", "decorative"] },

    // Tiles materials
    { id: "29", name: "Ceramic Tiles", category: "Tiles", imageUrl: "/media/illustrations/17.svg", tags: ["tiles", "ceramic", "glossy"] },
    { id: "30", name: "Porcelain Tiles", category: "Tiles", imageUrl: "/media/illustrations/18.svg", tags: ["tiles", "porcelain", "durable"] },
    { id: "31", name: "Mosaic Tiles", category: "Tiles", imageUrl: "/media/illustrations/19.svg", tags: ["tiles", "mosaic", "decorative"] },
    { id: "32", name: "Subway Tiles", category: "Tiles", imageUrl: "/media/illustrations/20.svg", tags: ["tiles", "subway", "classic"] },

    // Plaster materials
    { id: "33", name: "Smooth Plaster", category: "Plaster", imageUrl: "/media/illustrations/21.svg", tags: ["plaster", "smooth", "white"] },
    { id: "34", name: "Venetian Plaster", category: "Plaster", imageUrl: "/media/illustrations/22.svg", tags: ["plaster", "venetian", "polished"] },
    { id: "35", name: "Textured Plaster", category: "Plaster", imageUrl: "/media/illustrations/23.svg", tags: ["plaster", "textured", "rough"] },
    { id: "36", name: "Lime Plaster", category: "Plaster", imageUrl: "/media/illustrations/24.svg", tags: ["plaster", "lime", "natural"] },

    // Ground materials
    { id: "37", name: "Grass", category: "Ground", imageUrl: "/media/illustrations/25.svg", tags: ["ground", "grass", "green"] },
    { id: "38", name: "Dirt", category: "Ground", imageUrl: "/media/illustrations/26.svg", tags: ["ground", "dirt", "brown"] },
    { id: "39", name: "Gravel", category: "Ground", imageUrl: "/media/illustrations/27.svg", tags: ["ground", "gravel", "stones"] },
    { id: "40", name: "Sand", category: "Ground", imageUrl: "/media/illustrations/28.svg", tags: ["ground", "sand", "beach"] },

    // Terracotta materials
    { id: "41", name: "Red Terracotta", category: "Terracotta", imageUrl: "/media/illustrations/29.svg", tags: ["terracotta", "red", "clay"] },
    { id: "42", name: "Glazed Terracotta", category: "Terracotta", imageUrl: "/media/illustrations/30.svg", tags: ["terracotta", "glazed", "shiny"] },
    { id: "43", name: "Aged Terracotta", category: "Terracotta", imageUrl: "/media/illustrations/31.svg", tags: ["terracotta", "aged", "weathered"] },
    { id: "44", name: "Terracotta Tiles", category: "Terracotta", imageUrl: "/media/illustrations/32.svg", tags: ["terracotta", "tiles", "rustic"] },
];
