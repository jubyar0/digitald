import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Enable Edge Runtime for faster execution
export const config = {
    // runtime: 'experimental-edge', // Removed to fix warnings
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (images, etc.)
         * - api/health (health check endpoint)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$|api/health).*)',
    ],
}

// Simple in-memory cache for session tokens (Edge Runtime compatible)
const sessionCache = new Map<string, { token: any; expires: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname

    // Define protected paths
    const isAuthPath = pathname.startsWith("/signin") || pathname.startsWith("/signup")
    const isProtectedPath =
        pathname.startsWith("/admin") ||
        pathname.startsWith("/seller") ||
        pathname.startsWith("/dashboard")

    // Get session token with caching
    let token: any = null
    const authHeader = req.headers.get('authorization')
    const cookieToken = req.cookies.get('next-auth.session-token')?.value ||
        req.cookies.get('__Secure-next-auth.session-token')?.value

    const cacheKey = cookieToken || authHeader || ''

    if (cacheKey) {
        const cached = sessionCache.get(cacheKey)
        if (cached && cached.expires > Date.now()) {
            token = cached.token
        } else {
            // Fetch token only if not cached
            token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
            if (token) {
                sessionCache.set(cacheKey, {
                    token,
                    expires: Date.now() + CACHE_TTL
                })
            }
        }
    }

    // Clean up expired cache entries (simple cleanup)
    if (sessionCache.size > 1000) {
        const now = Date.now()
        const entries = Array.from(sessionCache.entries())
        for (const [key, value] of entries) {
            if (value.expires < now) {
                sessionCache.delete(key)
            }
        }
    }

    // 1. Handle Unauthenticated Users
    if (!token) {
        // Redirect to signin if trying to access protected routes
        if (isProtectedPath) {
            const url = new URL("/signin", req.url)
            url.searchParams.set("callbackUrl", encodeURI(req.url))
            return NextResponse.redirect(url)
        }
        // Allow access to public routes
        return NextResponse.next()
    }

    // 2. Handle Authenticated Users (Role Checks)
    const role = token.role as string

    // If user is already logged in and tries to access auth pages, redirect to dashboard
    if (isAuthPath) {
        if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        if (role === "VENDOR") return NextResponse.redirect(new URL("/seller/dashboard", req.url))
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Admin Routes Protection
    if (pathname.startsWith("/admin")) {
        if (role !== "ADMIN") {
            return NextResponse.redirect(new URL("/unauthorized", req.url))
        }
    }

    // Seller Routes Protection
    if (pathname.startsWith("/seller")) {
        // Allow both VENDOR and ADMIN to access seller routes
        if (role !== "VENDOR" && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/unauthorized", req.url))
        }
    }

    // Dashboard Routes (General User)
    // Already protected by the !token check above. 
    // Any authenticated user can access /dashboard/*

    return NextResponse.next()
}
