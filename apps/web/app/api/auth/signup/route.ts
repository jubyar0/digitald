import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

/**
 * Signup Schema - Validates user registration data
 */
const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

/**
 * POST /api/auth/signup
 * 
 * Creates a new user account with hashed password
 * 
 * Request Body:
 * - name: string (min 2 chars)
 * - email: string (valid email)
 * - password: string (min 6 chars)
 * - role?: "ADMIN" | "VENDOR" | "CUSTOMER" (default: CUSTOMER)
 * 
 * Returns:
 * - 201: User created successfully
 * - 400: Validation error
 * - 409: Email already exists
 * - 500: Server error
 */
export async function POST(req: NextRequest) {
    try {
        // Parse and validate request body
        const body = await req.json()
        const validatedData = signupSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "Email already registered" },
                { status: 409 }
            )
        }

        // Hash password with bcrypt (salt rounds: 10)
        const hashedPassword = await bcrypt.hash(validatedData.password, 10)

        // Create user in database
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                role: "CUSTOMER",
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        })

        return NextResponse.json(
            {
                message: "User created successfully",
                user,
            },
            { status: 201 }
        )
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    message: "Validation error",
                    errors: error.issues.map((err: z.ZodIssue) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                },
                { status: 400 }
            )
        }

        // Handle other errors
        console.error("Signup error:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
