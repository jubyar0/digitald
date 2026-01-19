
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("Prisma keys:", Object.keys(prisma));

    // Check if navigationItem exists
    // @ts-ignore
    if (!prisma.navigationItem) {
        console.error("prisma.navigationItem is undefined!");
        console.log("Available models:", Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$')));
        throw new Error("prisma.navigationItem is undefined. Make sure 'npx prisma generate' has been run.");
    }

    console.log("Seeding navigation items...");

    // Clear existing navigation items
    // @ts-ignore
    await prisma.navigationItem.deleteMany({});

    // 1. Textures
    // @ts-ignore
    const textures = await prisma.navigationItem.create({
        data: {
            label: "Textures",
            url: "/textures",
            order: 0,
            isActive: true,
        },
    });

    const textureSubItems = [
        "Asphalt", "Bark", "Brick", "Ceramic", "Concrete", "Earth",
        "Fabric", "Flooring", "Food", "Free", "Glass", "Leaves",
        "Marble", "Metal", "Paper", "Plaster", "Plastic", "Rock",
        "Roofing", "Sidewalk", "Stone", "Surface Imperfections", "Terrazzo",
        "Tile", "Wall Cladding", "Wood"
    ];

    for (const [index, label] of textureSubItems.entries()) {
        // @ts-ignore
        await prisma.navigationItem.create({
            data: {
                label,
                url: `/textures/${label.toLowerCase().replace(/\s+/g, "-")}`,
                parentId: textures.id,
                order: index,
                isActive: true,
            },
        });
    }

    // Textures Featured
    // @ts-ignore
    await prisma.navigationItem.create({
        data: {
            label: "Delta Millworks",
            url: "/textures/delta-millworks",
            parentId: textures.id,
            order: 100,
            isActive: true,
            isFeatured: true,
            description: "Scanned onsite at Texas based wood manufacturer Delta Millworks.",
            image: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?q=80&w=800&auto=format&fit=crop",
        },
    });

    // @ts-ignore
    await prisma.navigationItem.create({
        data: {
            label: "Free Textures",
            url: "/textures/free",
            parentId: textures.id,
            order: 101,
            isActive: true,
            isFeatured: true,
            description: "Explore a selection of free textures with diverse finishes and styles.",
            image: "https://images.unsplash.com/photo-1584105530253-78988e1165f5?q=80&w=800&auto=format&fit=crop",
        },
    });

    // 2. Models
    // @ts-ignore
    const models = await prisma.navigationItem.create({
        data: {
            label: "Models",
            url: "/models",
            order: 1,
            isActive: true,
        },
    });

    const modelSubItems = [
        "Bathroom", "Brick", "Curtains", "Decoration", "Dining", "Drinks",
        "Electronics", "Fixtures", "Food", "Free", "Furniture", "Kitchen",
        "Lighting", "Nature", "Rocks", "Rugs", "Seating", "Vegetation"
    ];

    for (const [index, label] of modelSubItems.entries()) {
        // @ts-ignore
        await prisma.navigationItem.create({
            data: {
                label,
                url: `/models/${label.toLowerCase().replace(/\s+/g, "-")}`,
                parentId: models.id,
                order: index,
                isActive: true,
            },
        });
    }

    // Models Featured
    // @ts-ignore
    await prisma.navigationItem.create({
        data: {
            label: "Free Models",
            url: "/models/free",
            parentId: models.id,
            order: 100,
            isActive: true,
            isFeatured: true,
            description: "Browse our free, ultra-high res 3D models furniture, decor, and more.",
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
        },
    });

    // 3. HDRIs
    // @ts-ignore
    const hdris = await prisma.navigationItem.create({
        data: {
            label: "HDRIs",
            url: "/hdris",
            order: 2,
            isActive: true,
        },
    });

    const hdriSubItems = [
        "Sky", "Clear", "Evening", "Night", "Overcast",
        "Partly Cloudy", "Sunrise", "Sunset", "Environment", "Free"
    ];

    for (const [index, label] of hdriSubItems.entries()) {
        // @ts-ignore
        await prisma.navigationItem.create({
            data: {
                label,
                url: `/hdris/${label.toLowerCase().replace(/\s+/g, "-")}`,
                parentId: hdris.id,
                order: index,
                isActive: true,
            },
        });
    }

    // HDRIs Featured
    // @ts-ignore
    await prisma.navigationItem.create({
        data: {
            label: "Free HDRIs",
            url: "/hdris/free",
            parentId: hdris.id,
            order: 100,
            isActive: true,
            isFeatured: true,
            description: "Browse our free HDRIs for artists wanting photorealistic renders.",
            image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=800&auto=format&fit=crop",
        },
    });

    // 4. 3DM
    // @ts-ignore
    await prisma.navigationItem.create({
        data: {
            label: "3DM",
            url: "/3dm",
            order: 3,
            isActive: true,
        },
    });

    // 5. Free
    // @ts-ignore
    await prisma.navigationItem.create({
        data: {
            label: "Free",
            url: "/free",
            order: 4,
            isActive: true,
            description: "100+",
        },
    });

    // @ts-ignore
    await prisma.navigationItem.create({
        data: {
            label: "New Assets",
            url: "/new-assets",
            order: 5,
            isActive: true,
        },
    });

    console.log("Seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
