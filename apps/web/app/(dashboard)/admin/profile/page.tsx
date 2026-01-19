import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, User, Shield, Activity } from 'lucide-react'
import { ProfileFormClient } from './_components/profile-form-client'

interface AdminProfile {
    id: string
    user: {
        id: string
        name: string | null
        email: string
        image: string | null
        role: string
        createdAt: string
    }
    permissions: any
    isSuperAdmin: boolean
    lastLogin: string | null
    createdAt: string
}

// Loading skeleton
function ProfilePageSkeleton() {
    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="h-9 w-48 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-5 w-64 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </div>
            </div>

            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
                ))}
            </div>
        </div>
    )
}

// Server Component to fetch data
async function ProfileData() {
    const response = await fetch(process.env.NEXT_PUBLIC_APP_URL + '/api/admin/profile', {
        cache: 'no-store',
    })

    if (!response.ok) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
                    <p className="text-muted-foreground">Unable to load admin profile</p>
                </div>
            </div>
        )
    }

    const profile: AdminProfile = await response.json()

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Admin Profile</h1>
                    <p className="text-muted-foreground">Manage your admin account settings</p>
                </div>
                <div className="flex items-center gap-2">
                    {profile.isSuperAdmin && (
                        <Badge variant="default" className="gap-1.5">
                            <Shield className="h-3.5 w-3.5" />
                            Super Admin
                        </Badge>
                    )}
                    <Badge variant="secondary" className="gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {profile.user.role}
                    </Badge>
                </div>
            </div>

            <div className="space-y-6">
                {/* Account Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Your basic admin account details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileFormClient
                            initialName={profile.user.name || ''}
                            initialEmail={profile.user.email}
                        />
                    </CardContent>
                </Card>

                {/* Account Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Statistics</CardTitle>
                        <CardDescription>Your admin account activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">Last Login</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {profile.lastLogin
                                        ? new Date(profile.lastLogin).toLocaleString()
                                        : 'Never'
                                    }
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">Account Created</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(profile.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">Admin Type</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {profile.isSuperAdmin ? 'Super Admin' : 'Admin'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Permissions */}
                {profile.permissions && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                            <CardDescription>Your admin access permissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Object.keys(profile.permissions).length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(profile.permissions).map(([key, value]) =>
                                            value ? (
                                                <Badge key={key} variant="outline">
                                                    {key.replace(/_/g, ' ').toUpperCase()}
                                                </Badge>
                                            ) : null
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {profile.isSuperAdmin
                                            ? 'You have full access to all features'
                                            : 'No specific permissions set'
                                        }
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

// Main page component (Server Component)
export default function AdminProfilePage() {
    return (
        <Suspense fallback={<ProfilePageSkeleton />}>
            <ProfileData />
        </Suspense>
    )
}
