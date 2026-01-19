import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        console.log("Seeding navigation items...");

        // Clear existing items
        await prisma.navigationItem.deleteMany({});

        // 1. Textures
        const textures = await prisma.navigationItem.create({
            data: {
                label: "Textures",
                url: "/textures",
                order: 1,
                isActive: true,
            },
        });

        const textureItems = [
            "Asphalt", "Bark", "Brick", "Ceramic", "Concrete", "Earth", "Fabric", "Flooring",
            "Food", "Free", "Glass", "Leaves", "Marble", "Metal", "Paper", "Plaster",
            "Plastic", "Rock", "Roofing", "Sidewalk", "Stone", "Surface Imperfections",
            "Terrazzo", "Tile", "Wall Cladding", "Wood"
        ];

        for (const [index, item] of textureItems.entries()) {
            await prisma.navigationItem.create({
                data: {
                    label: item,
                    url: `/textures/${item.toLowerCase().replace(/ /g, "-")}`,
                    order: index,
                    parentId: textures.id,
                    isActive: true,
                },
            });
        }

        await prisma.navigationItem.create({
            data: {
                label: "Delta Millworks",
                url: "/textures/delta-millworks",
                order: 100,
                parentId: textures.id,
                isActive: true,
                isFeatured: true,
                description: "Scanned onsite at Texas based wood manufacturer Delta Millworks.",
                image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop",
            },
        });

        await prisma.navigationItem.create({
            data: {
                label: "Free Textures",
                url: "/textures/free",
                order: 101,
                parentId: textures.id,
                isActive: true,
                isFeatured: true,
                description: "Explore a selection of free textures with diverse finishes and styles.",
                image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop",
            },
        });

        // 2. Models
        const models = await prisma.navigationItem.create({
            data: {
                label: "Models",
                url: "/models",
                order: 2,
                isActive: true,
            },
        });

        const modelItems = [
            "Bathroom", "Brick", "Curtains", "Decoration", "Dining", "Drinks", "Electronics",
            "Fixtures", "Food", "Free", "Furniture", "Kitchen", "Lighting", "Nature",
            "Rocks", "Rugs", "Seating", "Vegetation"
        ];

        for (const [index, item] of modelItems.entries()) {
            await prisma.navigationItem.create({
                data: {
                    label: item,
                    url: `/models/${item.toLowerCase().replace(/ /g, "-")}`,
                    order: index,
                    parentId: models.id,
                    isActive: true,
                },
            });
        }

        // Featured Models
        await prisma.navigationItem.create({
            data: {
                label: "Free Models",
                url: "/models/free",
                order: 100,
                parentId: models.id,
                isActive: true,
                isFeatured: true,
                description: "Browse our free, ultra-high res 3D models furniture, decor, and more.",
                image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
            },
        });

        // 3. HDRIs
        const hdris = await prisma.navigationItem.create({
            data: {
                label: "HDRIs",
                url: "/hdris",
                order: 3,
                isActive: true,
            },
        });

        const hdriItems = [
            "Sky", "Clear", "Evening", "Night", "Overcast", "Partly Cloudy", "Sunrise", "Sunset",
            "Environment", "Free"
        ];

        for (const [index, item] of hdriItems.entries()) {
            await prisma.navigationItem.create({
                data: {
                    label: item,
                    url: `/hdris/${item.toLowerCase().replace(/ /g, "-")}`,
                    order: index,
                    parentId: hdris.id,
                    isActive: true,
                },
            });
        }

        // Featured HDRIs
        await prisma.navigationItem.create({
            data: {
                label: "Free HDRIs",
                url: "/hdris/free",
                order: 100,
                parentId: hdris.id,
                isActive: true,
                isFeatured: true,
                description: "Browse our free HDRIs for artists wanting photorealistic renders.",
                image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2132&auto=format&fit=crop",
            },
        });

        console.log("Seeding completed successfully!");

        return NextResponse.json({
            success: true,
            message: "Navigation items seeded successfully"
        });
    } catch (error) {
        console.error("Error seeding database:", error);
        return NextResponse.json(
            { success: false, error: "Failed to seed navigation items" },
            { status: 500 }
        );
    }
}
