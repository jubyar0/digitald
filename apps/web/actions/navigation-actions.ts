"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type NavigationItem = {
    id: string;
    label: string;
    url: string;
    order: number;
    isActive: boolean;
    isSection: boolean;
    parentId: string | null;
    children?: NavigationItem[];
    icon?: string | null;
    description?: string | null;
    image?: string | null;
    isFeatured?: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export async function getNavigationItems() {
    try {
        const items = await prisma.navigationItem.findMany({
            where: {
                isActive: true,
                parentId: null, // Only fetch root items
            },
            include: {
                children: {
                    where: { isActive: true },
                    orderBy: { order: "asc" },
                },
            },
            orderBy: {
                order: "asc",
            },
        });
        return { success: true, data: items };
    } catch (error) {
        console.error("Failed to fetch navigation items:", error);
        return { success: false, error: "Failed to fetch navigation items" };
    }
}

export async function getAllNavigationItems() {
    try {
        // Fetch all items including inactive ones for admin
        const items = await prisma.navigationItem.findMany({
            where: {
                parentId: null,
            },
            include: {
                children: {
                    orderBy: { order: "asc" },
                },
            },
            orderBy: {
                order: "asc",
            },
        });
        return { success: true, data: items };
    } catch (error) {
        console.error("Failed to fetch all navigation items:", error);
        return { success: false, error: "Failed to fetch navigation items" };
    }
}

export async function createNavigationItem(data: {
    label: string;
    url: string;
    parentId?: string | null;
    isSection?: boolean;
    icon?: string | null;
    description?: string | null;
    image?: string | null;
    isFeatured?: boolean;
}) {
    try {
        // Get the highest order to append to the end
        const lastItem = await prisma.navigationItem.findFirst({
            where: { parentId: data.parentId || null },
            orderBy: { order: "desc" },
        });
        const newOrder = lastItem ? lastItem.order + 1 : 0;

        const item = await prisma.navigationItem.create({
            data: {
                label: data.label,
                url: data.url,
                order: newOrder,
                parentId: data.parentId || null,
                isSection: data.isSection || false,
                icon: data.icon,
                description: data.description,
                image: data.image,
                isFeatured: data.isFeatured || false,
            },
        });
        revalidatePath("/");
        return { success: true, data: item };
    } catch (error) {
        console.error("Failed to create navigation item:", error);
        return { success: false, error: "Failed to create navigation item" };
    }
}

export async function updateNavigationItem(id: string, data: {
    label?: string;
    url?: string;
    isActive?: boolean;
    isSection?: boolean;
    parentId?: string | null;
    icon?: string | null;
    description?: string | null;
    image?: string | null;
    isFeatured?: boolean;
}) {
    try {
        const item = await prisma.navigationItem.update({
            where: { id },
            data,
        });
        revalidatePath("/");
        return { success: true, data: item };
    } catch (error) {
        console.error("Failed to update navigation item:", error);
        return { success: false, error: "Failed to update navigation item" };
    }
}

export async function deleteNavigationItem(id: string) {
    try {
        await prisma.navigationItem.delete({
            where: { id },
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete navigation item:", error);
        return { success: false, error: "Failed to delete navigation item" };
    }
}

export async function reorderNavigationItems(items: { id: string; order: number }[]) {
    try {
        await prisma.$transaction(
            items.map((item) =>
                prisma.navigationItem.update({
                    where: { id: item.id },
                    data: { order: item.order },
                })
            )
        );
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to reorder navigation items:", error);
        return { success: false, error: "Failed to reorder navigation items" };
    }
}
