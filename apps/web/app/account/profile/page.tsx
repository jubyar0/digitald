import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"
import { getUserProfile, getUserStats } from "@/actions/user-profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Camera, Mail, User, Calendar } from "lucide-react"
import { AccountNav } from "@/components/account-nav"
import Link from "next/link"

export default async function ProfilePage() {
    const session = await getCurrentSession()
    if (!session?.user) {
        redirect("/signin")
    }

    const [profile, stats] = await Promise.all([
        getUserProfile(),
        getUserStats()
    ])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-12 gap-6">
                {/* Sidebar */}
                <aside className="col-span-12 md:col-span-3">
                    <AccountNav />
                </aside>

                {/* Main Content */}
                <main className="col-span-12 md:col-span-9 space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold">Profile Settings</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your account settings and profile information
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Profile Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Profile Image */}
                                <div className="flex items-center gap-6">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={profile.image || undefined} />
                                        <AvatarFallback className="text-2xl">
                                            {profile.name?.charAt(0)?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <Button variant="outline" size="sm">
                                            <Camera className="mr-2 h-4 w-4" />
                                            Change Photo
                                        </Button>
                                        <p className="text-sm text-muted-foreground">
                                            JPG, PNG or GIF. Max 2MB
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Profile Form */}
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            <User className="inline mr-2 h-4 w-4" />
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            defaultValue={profile.name || ""}
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            <Mail className="inline mr-2 h-4 w-4" />
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            defaultValue={profile.email}
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            <Calendar className="inline mr-2 h-4 w-4" />
                                            Member Since
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(profile.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Save Changes
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Stats Card */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Statistics</CardTitle>
                                    <CardDescription>Your activity summary</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Total Orders</span>
                                        <span className="text-2xl font-bold">{stats.totalOrders}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Total Spent</span>
                                        <span className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Wishlist Items</span>
                                        <span className="text-2xl font-bold">{stats.wishlistCount}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Cart Items</span>
                                        <span className="text-2xl font-bold">{stats.cartItemsCount}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Type</CardTitle>
                                    <CardDescription>Your login method</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg bg-muted p-4">
                                        <p className="text-sm font-medium">
                                            📧 Standard Account
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Security</CardTitle>
                                    <CardDescription>Two-factor authentication</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">2FA Status</p>
                                            <p className="text-xs text-muted-foreground">
                                                Not enabled
                                            </p>
                                        </div>
                                        <Link href="/account/security">
                                            <Button variant="outline" size="sm">
                                                Enable
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
