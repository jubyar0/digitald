"use server"

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { revalidatePath } from "next/cache"
import { CampaignStatus, AutomationType, AutomationStatus } from "@repo/database"

export async function getMarketingStats() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { success: false, error: "Vendor not found" }
        }

        // Calculate stats from campaigns
        const campaigns = await prisma.marketingCampaign.findMany({
            where: { vendorId: vendor.id }
        })

        const totalSessions = campaigns.reduce((acc, curr) => acc + curr.sessions, 0)
        const totalSales = campaigns.reduce((acc, curr) => acc + curr.sales, 0)
        const totalOrders = campaigns.reduce((acc, curr) => acc + curr.orders, 0)

        // Calculate conversion rate
        const conversionRate = totalSessions > 0
            ? ((totalOrders / totalSessions) * 100).toFixed(2)
            : "0"

        // Calculate AOV
        const aov = totalOrders > 0
            ? (totalSales / totalOrders).toFixed(2)
            : "0"

        return {
            success: true,
            data: {
                sessions: totalSessions,
                sales: totalSales,
                orders: totalOrders,
                conversionRate: `${conversionRate}%`,
                aov: `DZD ${aov}`
            }
        }
    } catch (error) {
        console.error("Error fetching marketing stats:", error)
        return { success: false, error: "Failed to fetch marketing stats" }
    }
}

export async function getCampaigns() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { success: false, error: "Vendor not found" }
        }

        const campaigns = await prisma.marketingCampaign.findMany({
            where: { vendorId: vendor.id },
            orderBy: { createdAt: 'desc' }
        })

        return { success: true, data: campaigns }
    } catch (error) {
        console.error("Error fetching campaigns:", error)
        return { success: false, error: "Failed to fetch campaigns" }
    }
}

export async function createCampaign(data: {
    name: string,
    budget?: number,
    startDate?: Date,
    endDate?: Date
}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { success: false, error: "Vendor not found" }
        }

        const campaign = await prisma.marketingCampaign.create({
            data: {
                vendorId: vendor.id,
                name: data.name,
                budget: data.budget,
                startDate: data.startDate,
                endDate: data.endDate,
                status: CampaignStatus.ACTIVE
            }
        })

        revalidatePath("/seller/marketing/campaigns")
        return { success: true, data: campaign }
    } catch (error) {
        console.error("Error creating campaign:", error)
        return { success: false, error: "Failed to create campaign" }
    }
}

export async function deleteCampaign(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { success: false, error: "Vendor not found" }
        }

        // Verify ownership
        const campaign = await prisma.marketingCampaign.findUnique({
            where: { id }
        })

        if (!campaign || campaign.vendorId !== vendor.id) {
            return { success: false, error: "Campaign not found or unauthorized" }
        }

        await prisma.marketingCampaign.delete({
            where: { id }
        })

        revalidatePath("/seller/marketing/campaigns")
        return { success: true }
    } catch (error) {
        console.error("Error deleting campaign:", error)
        return { success: false, error: "Failed to delete campaign" }
    }
}

export async function getAutomations() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { success: false, error: "Vendor not found" }
        }

        // Ensure default automations exist
        const defaultTypes = [
            AutomationType.ABANDONED_CART,
            AutomationType.ABANDONED_CHECKOUT,
            AutomationType.WELCOME_SERIES,
            AutomationType.POST_PURCHASE
        ]

        const existingAutomations = await prisma.marketingAutomation.findMany({
            where: { vendorId: vendor.id }
        })

        // Create missing default automations
        for (const type of defaultTypes) {
            if (!existingAutomations.find(a => a.type === type)) {
                let name = ""
                switch (type) {
                    case AutomationType.ABANDONED_CART: name = "Recover abandoned cart"; break;
                    case AutomationType.ABANDONED_CHECKOUT: name = "Recover abandoned checkout"; break;
                    case AutomationType.WELCOME_SERIES: name = "Welcome new subscribers"; break;
                    case AutomationType.POST_PURCHASE: name = "Thank customers after purchase"; break;
                }

                await prisma.marketingAutomation.create({
                    data: {
                        vendorId: vendor.id,
                        type,
                        name,
                        status: AutomationStatus.INACTIVE
                    }
                })
            }
        }

        const automations = await prisma.marketingAutomation.findMany({
            where: { vendorId: vendor.id }
        })

        return { success: true, data: automations }
    } catch (error) {
        console.error("Error fetching automations:", error)
        return { success: false, error: "Failed to fetch automations" }
    }
}

export async function toggleAutomation(id: string, status: AutomationStatus) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        })

        if (!vendor) {
            return { success: false, error: "Vendor not found" }
        }

        const automation = await prisma.marketingAutomation.findUnique({
            where: { id }
        })

        if (!automation || automation.vendorId !== vendor.id) {
            return { success: false, error: "Automation not found or unauthorized" }
        }

        await prisma.marketingAutomation.update({
            where: { id },
            data: { status }
        })

        revalidatePath("/seller/marketing/automations")
        return { success: true }
    } catch (error) {
        console.error("Error toggling automation:", error)
        return { success: false, error: "Failed to toggle automation" }
    }
}
