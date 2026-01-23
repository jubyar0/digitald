"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

// Helper to get authenticated vendor ID
async function getVendorId() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Unauthorized")

    const vendor = await prisma.vendor.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
    })

    if (!vendor) throw new Error("Vendor not found")
    return vendor.id
}

// ==========================================
// Shipping Profiles
// ==========================================

export async function getShippingSettings() {
    try {
        const vendorId = await getVendorId()

        const [profiles, localDelivery, pickup, savedPackages] = await Promise.all([
            prisma.shippingProfile.findMany({
                where: { vendorId },
                include: {
                    zones: {
                        include: {
                            rates: true
                        }
                    },
                    products: {
                        select: { id: true, name: true, thumbnail: true }
                    }
                }
            }),
            prisma.localDeliverySetting.findUnique({ where: { vendorId } }),
            prisma.pickupSetting.findUnique({ where: { vendorId } }),
            prisma.savedPackage.findMany({ where: { vendorId } })
        ])

        return {
            success: true,
            data: { profiles, localDelivery, pickup, savedPackages }
        }
    } catch (error) {
        console.error("Error fetching shipping settings:", error)
        return { success: false, error: "Failed to fetch shipping settings" }
    }
}

export async function createShippingProfile(data: { name: string; isGeneral?: boolean; originAddress?: any }) {
    try {
        const vendorId = await getVendorId()
        const profile = await prisma.shippingProfile.create({
            data: { ...data, vendorId }
        })
        revalidatePath("/seller/settings/shipping")
        return { success: true, data: profile }
    } catch (error) {
        return { success: false, error: "Failed to create profile" }
    }
}

export async function updateShippingProfile(id: string, data: { name?: string; originAddress?: any }) {
    try {
        const vendorId = await getVendorId()
        // Verify ownership
        const existing = await prisma.shippingProfile.findFirst({ where: { id, vendorId } })
        if (!existing) throw new Error("Profile not found")

        const profile = await prisma.shippingProfile.update({
            where: { id },
            data
        })
        revalidatePath("/seller/settings/shipping")
        return { success: true, data: profile }
    } catch (error) {
        return { success: false, error: "Failed to update profile" }
    }
}

// ==========================================
// Shipping Zones & Rates
// ==========================================

export async function createShippingZone(profileId: string, data: { name: string; countries: string[]; regions?: any }) {
    try {
        const vendorId = await getVendorId()
        const profile = await prisma.shippingProfile.findFirst({ where: { id: profileId, vendorId } })
        if (!profile) throw new Error("Profile not found")

        const zone = await prisma.shippingZone.create({
            data: { ...data, profileId }
        })
        revalidatePath("/seller/settings/shipping")
        return { success: true, data: zone }
    } catch (error) {
        return { success: false, error: "Failed to create zone" }
    }
}

export async function createShippingRate(zoneId: string, data: {
    name: string;
    type: string;
    price: number;
    minCondition?: number;
    maxCondition?: number;
    minDeliveryDays?: number;
    maxDeliveryDays?: number;
}) {
    try {
        // In a real app, verify zone ownership via profile -> vendor
        const rate = await prisma.shippingRate.create({
            data: { ...data, zoneId }
        })
        revalidatePath("/seller/settings/shipping")
        return { success: true, data: rate }
    } catch (error) {
        return { success: false, error: "Failed to create rate" }
    }
}

// ==========================================
// Local Delivery & Pickup
// ==========================================

export async function updateLocalDeliverySettings(data: {
    isEnabled: boolean;
    deliveryZoneType?: string;
    radiusValue?: number;
    radiusUnit?: string;
    includeNeighboring?: boolean;
    postalCodes?: string[];
    price?: number;
    minOrderPrice?: number;
    deliveryInfo?: string;
}) {
    try {
        const vendorId = await getVendorId()
        const settings = await prisma.localDeliverySetting.upsert({
            where: { vendorId },
            update: data,
            create: { ...data, vendorId }
        })
        revalidatePath("/seller/settings/shipping")
        return { success: true, data: settings }
    } catch (error) {
        return { success: false, error: "Failed to update local delivery" }
    }
}

export async function updatePickupSettings(data: {
    isEnabled: boolean;
    expectedPickupTime?: string;
    pickupInstructions?: string;
}) {
    try {
        const vendorId = await getVendorId()
        const settings = await prisma.pickupSetting.upsert({
            where: { vendorId },
            update: data,
            create: { ...data, vendorId }
        })
        revalidatePath("/seller/settings/shipping")
        return { success: true, data: settings }
    } catch (error) {
        return { success: false, error: "Failed to update pickup settings" }
    }
}

// ==========================================
// Saved Packages
// ==========================================

export async function createSavedPackage(data: {
    name: string;
    type: string;
    length?: number;
    width?: number;
    height?: number;
    dimensionUnit?: string;
    weight?: number;
    weightUnit?: string;
    isDefault?: boolean;
}) {
    try {
        const vendorId = await getVendorId()

        // If setting as default, unset others
        if (data.isDefault) {
            await prisma.savedPackage.updateMany({
                where: { vendorId },
                data: { isDefault: false }
            })
        }

        const pkg = await prisma.savedPackage.create({
            data: { ...data, vendorId }
        })
        revalidatePath("/seller/settings/shipping")
        return { success: true, data: pkg }
    } catch (error) {
        return { success: false, error: "Failed to create package" }
    }
}

export async function deleteSavedPackage(id: string) {
    try {
        const vendorId = await getVendorId()
        await prisma.savedPackage.deleteMany({
            where: { id, vendorId }
        })
        revalidatePath("/seller/settings/shipping")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete package" }
    }
}
