import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"
import { getVendorApplicationStatus } from "@/actions/user-vendor-application"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Store, CheckCircle2, Clock, XCircle, Briefcase, FileText } from "lucide-react"
import Link from "next/link"

export default async function BecomeSellerPage() {
    const session = await getCurrentSession()
    if (!session?.user) {
        redirect("/signin")
    }

    const status = await getVendorApplicationStatus()

    // If already a vendor, redirect to seller dashboard
    if (status.isVendor && status.application?.status === 'APPROVED') {
        redirect("/seller/dashboard")
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Store className="h-8 w-8" />
                        Become a Seller
                    </h2>
                    <p className="text-muted-foreground">
                        Join our marketplace and start selling your digital products
                    </p>
                </div>
            </div>

            {status.application ? (
                // Application exists - show status
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Application Status</CardTitle>
                            {status.application.status === 'PENDING' && (
                                <Badge variant="secondary">
                                    <Clock className="mr-1 h-3 w-3" />
                                    Pending Review
                                </Badge>
                            )}
                            {status.application.status === 'APPROVED' && (
                                <Badge className="bg-green-500">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Approved
                                </Badge>
                            )}
                            {status.application.status === 'REJECTED' && (
                                <Badge variant="destructive">
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Rejected
                                </Badge>
                            )}
                        </div>
                        <CardDescription>
                            Your vendor application was submitted on{" "}
                            {new Date(status.application.createdAt).toLocaleDateString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {status.application.status === 'PENDING' && (
                            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    Your application is under review
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                    We&apos;ll notify you within 3-5 business days. Thank you for your patience!
                                </p>
                            </div>
                        )}

                        {status.application.status === 'REJECTED' && (
                            <>
                                <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4 border border-red-200 dark:border-red-800">
                                    <p className="text-sm font-medium text-red-900 dark:text-red-100">
                                        Application rejected
                                    </p>
                                    {status.application.notes && (
                                        <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                            Reason: {status.application.notes}
                                        </p>
                                    )}
                                </div>
                                <Button className="w-full">
                                    Resubmit Application
                                </Button>
                            </>
                        )}

                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                                View Details
                            </Button>
                            {status.application.status === 'PENDING' && (
                                <Button variant="destructive" className="flex-1">
                                    Cancel Application
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                // No application - show application form
                <>
                    {/* Benefits Section */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <div className="rounded-full bg-primary/10 p-3">
                                        <Store className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold">Reach Thousands</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Access our global marketplace with thousands of potential customers
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <div className="rounded-full bg-primary/10 p-3">
                                        <Briefcase className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold">Easy Management</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Powerful seller dashboard to manage products, orders, and analytics
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center space-y-2">
                                    <div className="rounded-full bg-primary/10 p-3">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold">Secure Payments</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Get paid securely with multiple payment options and automated payouts
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Application Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Vendor Application</CardTitle>
                            <CardDescription>
                                Fill out the form below to apply as a seller on our platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="businessName">Business/Store Name *</Label>
                                        <Input
                                            id="businessName"
                                            placeholder="My Digital Store"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="businessType">Business Type</Label>
                                        <Input
                                            id="businessType"
                                            placeholder="Individual, Company, etc."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Business Description *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Tell us about your business and the products you plan to sell..."
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                                        <Input
                                            id="taxId"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Business Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="Full address (optional)"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="portfolio">Portfolio/Website URL</Label>
                                    <Input
                                        id="portfolio"
                                        type="url"
                                        placeholder="https://your-portfolio.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="additionalInfo">Additional Information</Label>
                                    <Textarea
                                        id="additionalInfo"
                                        placeholder="Anything else you'd like us to know..."
                                        rows={3}
                                    />
                                </div>

                                <div className="rounded-lg bg-muted p-4">
                                    <p className="text-sm text-muted-foreground">
                                        By submitting this application, you agree to our{" "}
                                        <Link href="/terms" className="text-primary hover:underline">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/seller-agreement" className="text-primary hover:underline">
                                            Seller Agreement
                                        </Link>
                                    </p>
                                </div>

                                <Button type="submit" className="w-full" size="lg">
                                    Submit Application
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
