import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

/**
 * GET /api/auth/seed-users
 * 
 * Creates test users with hashed passwords for development
 * 
 * WARNING: This should be disabled in production!
 */
export async function GET(req: NextRequest) {
    // Prevent in production
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
            { message: "Not available in production" },
            { status: 403 }
        )
    }

    try {
        const hashedPassword = await bcrypt.hash("password123", 10)

        // Create or update Admin User
        const admin = await prisma.user.upsert({
            where: { email: "admin@example.com" },
            update: { password: hashedPassword },
            create: {
                email: "admin@example.com",
                name: "Admin User",
                role: "ADMIN",
                password: hashedPassword,
            },
        })

        // Create or update Seller/Vendor User
        const seller = await prisma.user.upsert({
            where: { email: "seller@example.com" },
            update: { password: hashedPassword },
            create: {
                email: "seller@example.com",
                name: "Seller User",
                role: "VENDOR",
                password: hashedPassword,
            },
        })

        // Create vendor record for seller if not exists
        await prisma.vendor.upsert({
            where: { userId: seller.id },
            update: {},
            create: {
                userId: seller.id,
                name: "Test Shop",
                description: "A test vendor shop",
            },
        })

        // Create or update Customer User
        const customer = await prisma.user.upsert({
            where: { email: "customer@example.com" },
            update: { password: hashedPassword },
            create: {
                email: "customer@example.com",
                name: "Customer User",
                role: "CUSTOMER",
                password: hashedPassword,
            },
        })

        return NextResponse.json({
            message: "Test users created/updated successfully",
            users: [
                { email: admin.email, role: admin.role, name: admin.name },
                { email: seller.email, role: seller.role, name: seller.name },
                { email: customer.email, role: customer.role, name: customer.name },
            ],
            credentials: {
                password: "password123",
                note: "All test users use this password"
            }
        }, { status: 200 })

    } catch (error) {
        console.error("Seed users error:", error)
        return NextResponse.json(
            { message: "Internal server error", error: String(error) },
            { status: 500 }
        )
    }
}
