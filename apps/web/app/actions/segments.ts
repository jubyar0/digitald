"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

async function getVendorId() {
    console.log("getVendorId: Starting")
    const session = await getServerSession(authOptions)
    console.log("getVendorId: Session retrieved", session?.user?.id)

    if (!session?.user?.id) {
        console.error("getVendorId: No session user ID")
        throw new Error("Unauthorized")
    }

    const vendor = await prisma.vendor.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
    })
    console.log("getVendorId: Vendor found", vendor)

    if (!vendor) {
        console.error("getVendorId: Vendor not found for user", session.user.id)
        throw new Error("Vendor not found")
    }

    return vendor.id
}

export async function getSegments() {
    try {
        console.log("getSegments: Calling getVendorId")
        const vendorId = await getVendorId()
        console.log("getSegments: Vendor ID", vendorId)

        const segments = await prisma.segment.findMany({
            where: { vendorId },
            orderBy: { createdAt: "desc" },
        })
        console.log("getSegments: Segments fetched", segments.length)
        return { success: true, data: segments }
    } catch (error) {
        console.error("Error fetching segments:", error)
        return { success: false, error: "Failed to fetch segments" }
    }
}

export async function getSegment(id: string) {
    try {
        const vendorId = await getVendorId()
        const segment = await prisma.segment.findFirst({
            where: { id, vendorId },
        })

        if (!segment) {
            return { success: false, error: "Segment not found" }
        }

        return { success: true, data: segment }
    } catch (error) {
        console.error("Error fetching segment:", error)
        return { success: false, error: "Failed to fetch segment" }
    }
}

export async function createSegment(data: { name: string; query: string; description?: string }) {
    try {
        const vendorId = await getVendorId()
        const segment = await prisma.segment.create({
            data: {
                ...data,
                vendorId,
            },
        })
        revalidatePath("/seller/customers/segments")
        return { success: true, data: segment }
    } catch (error) {
        console.error("Error creating segment:", error)
        return { success: false, error: "Failed to create segment" }
    }
}

export async function updateSegment(id: string, data: { name?: string; query?: string; description?: string }) {
    try {
        const vendorId = await getVendorId()
        // Verify ownership
        const existing = await prisma.segment.findFirst({
            where: { id, vendorId },
        })
        if (!existing) {
            throw new Error("Segment not found or unauthorized")
        }

        const segment = await prisma.segment.update({
            where: { id },
            data,
        })
        revalidatePath("/seller/customers/segments")
        return { success: true, data: segment }
    } catch (error) {
        console.error("Error updating segment:", error)
        return { success: false, error: "Failed to update segment" }
    }
}

export async function deleteSegment(id: string) {
    try {
        const vendorId = await getVendorId()
        // Verify ownership
        const existing = await prisma.segment.findFirst({
            where: { id, vendorId },
        })
        if (!existing) {
            throw new Error("Segment not found or unauthorized")
        }

        await prisma.segment.delete({
            where: { id },
        })
        revalidatePath("/seller/customers/segments")
        return { success: true }
    } catch (error) {
        console.error("Error deleting segment:", error)
        return { success: false, error: "Failed to delete segment" }
    }
}

export async function runSegmentQuery(query: string) {
    try {
        const vendorId = await getVendorId()

        // Mock implementation for now
        // In a real scenario, we would parse the 'query' string (DSL) and construct a Prisma query.

        // Simulating a delay
        await new Promise(resolve => setTimeout(resolve, 500))

        if (!query || query.trim() === "") {
            return { success: true, count: 0 }
        }

        // Return a random count for demo purposes
        const mockCount = Math.floor(Math.random() * 100) + 1

        return { success: true, count: mockCount }
    } catch (error) {
        console.error("Error running segment query:", error)
        return { success: false, error: "Failed to execute query" }
    }
}
