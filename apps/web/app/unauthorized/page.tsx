import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Unauthorized Access Page
 * 
 * Shown when a user tries to access a route they don't have permission for
 */
export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full px-6 py-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-destructive/10 p-6">
                        <ShieldAlert className="h-12 w-12 text-destructive" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-3">Access Denied</h1>
                <p className="text-muted-foreground mb-8">
                    You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild variant="primary">
                        <Link href="/">Go to Home</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/api/auth/signout">Sign Out</Link>
                    </Button>
                </div>

                <div className="mt-8 pt-8 border-t">
                    <p className="text-sm text-muted-foreground">
                        Need help?{" "}
                        <Link href="/support" className="text-primary hover:underline">
                            Contact Support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
