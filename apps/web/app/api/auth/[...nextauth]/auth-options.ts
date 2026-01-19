import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

/**
 * Validate required environment variables
 */
if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET must be set in environment variables')
}

if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
    throw new Error('NEXTAUTH_URL must be set in production')
}

/**
 * NextAuth Configuration
 * 
 * This file configures authentication providers, session strategy,
 * and callbacks for managing user sessions and JWT tokens.
 */
export const authOptions: NextAuthOptions = {
    providers: [
        /**
         * Google OAuth Provider
         * Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
         */
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),

        /**
         * Credentials Provider (Email + Password)
         * Handles traditional email/password authentication
         */
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Validate credentials exist
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials")
                }

                // Find user in database
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                // Check if user exists and has a password
                if (!user || !user.password) {
                    throw new Error("Invalid credentials")
                }

                // Verify password using bcrypt
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials")
                }

                // Return user object (will be passed to JWT callback)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            }
        })
    ],

    /**
     * Session Strategy: JWT
     * Sessions are stored as JWT tokens (stateless)
     */
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },



    /**
     * Custom Pages
     */
    pages: {
        signIn: "/signin",
        signOut: "/",
        error: "/signin",
    },

    /**
     * Callbacks
     * Used to control what happens during authentication flow
     */
    callbacks: {
        /**
         * JWT Callback
         * Runs whenever a JWT is created or updated
         * Add custom data to the token here
         */
        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                token.id = user.id
                token.role = user.role
            }

            // Google OAuth sign in
            if (account?.provider === "google") {
                // Find or create user for Google OAuth
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email! }
                })

                if (dbUser) {
                    token.id = dbUser.id
                    token.role = dbUser.role
                } else {
                    // Create new user for Google OAuth with CUSTOMER role
                    const newUser = await prisma.user.create({
                        data: {
                            email: token.email!,
                            name: token.name,
                            role: "CUSTOMER", // Explicit role for OAuth users
                        }
                    })
                    token.id = newUser.id
                    token.role = newUser.role
                }
            }

            return token
        },

        /**
         * Session Callback
         * Runs whenever session is checked
         * Add custom data to the session here
         */
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }
            return session
        },

        /**
         * Redirect Callback
         * Controls where users are redirected after sign in
         */
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    },

    /**
     * Secret for JWT encryption
     * MUST be set in production
     */
    secret: process.env.NEXTAUTH_SECRET,

    /**
     * Enable debug messages in development
     */
    debug: process.env.NODE_ENV === "development",
}
