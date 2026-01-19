import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentSession } from "@/lib/auth"
import { getTwoFactorStatus, getAccountType } from "@/actions/user-security"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Smartphone, Key, Lock, CheckCircle2, XCircle } from "lucide-react"

export default async function SecurityPage() {
    const session = await getCurrentSession()
    if (!session?.user) {
        redirect("/signin")
    }

    const [twoFactorStatus, accountType] = await Promise.all([
        getTwoFactorStatus(),
        getAccountType()
    ])

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Shield className="h-8 w-8" />
                        Security Settings
                    </h2>
                    <p className="text-muted-foreground">
                        Manage your account security and authentication methods
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Two-Factor Authentication */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5" />
                                <CardTitle>Two-Factor Authentication</CardTitle>
                            </div>
                            {twoFactorStatus.enabled ? (
                                <Badge className="bg-green-500">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Enabled
                                </Badge>
                            ) : (
                                <Badge variant="secondary">
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Disabled
                                </Badge>
                            )}
                        </div>
                        <CardDescription>
                            Add an extra layer of security to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {twoFactorStatus.enabled ? (
                            <>
                                <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 border border-green-200 dark:border-green-800">
                                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                        ✓ Your account is protected with 2FA
                                    </p>
                                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                        You&apos;ll need to enter a code from your authenticator app when signing in
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full">
                                        <Key className="mr-2 h-4 w-4" />
                                        View Backup Codes
                                    </Button>
                                    <Button variant="destructive" className="w-full">
                                        Disable 2FA
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950 p-4 border border-yellow-200 dark:border-yellow-800">
                                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                                        ⚠️ 2FA is not enabled
                                    </p>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                        Enable 2FA to secure your account with an authenticator app
                                    </p>
                                </div>
                                <Separator />
                                {twoFactorStatus.canEnable ? (
                                    <Button className="w-full">
                                        <Shield className="mr-2 h-4 w-4" />
                                        Enable Two-Factor Authentication
                                    </Button>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center">
                                        2FA is not available for Google-only accounts
                                    </p>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Password Management */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            <CardTitle>Password</CardTitle>
                        </div>
                        <CardDescription>
                            Change your password to keep your account secure
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {accountType.hasPassword ? (
                            <>
                                <div className="rounded-lg bg-muted p-4">
                                    <p className="text-sm font-medium">Password is set</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Last changed: Never
                                    </p>
                                </div>
                                <Separator />
                                <Button variant="outline" className="w-full">
                                    <Key className="mr-2 h-4 w-4" />
                                    Change Password
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        No password set
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                        You&apos;re signing in with Google. Set a password to enable email/password login
                                    </p>
                                </div>
                                <Separator />
                                <Button className="w-full">
                                    <Lock className="mr-2 h-4 w-4" />
                                    Set Password
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Active Sessions */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Active Sessions</CardTitle>
                        <CardDescription>
                            Manage devices where you&apos;re currently signed in
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="space-y-1">
                                    <p className="font-medium">Current Device</p>
                                    <p className="text-sm text-muted-foreground">
                                        Windows • Chrome • Last active: Just now
                                    </p>
                                </div>
                                <Badge>Active</Badge>
                            </div>

                            <p className="text-sm text-center text-muted-foreground py-4">
                                No other active sessions
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Recommendations */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Security Recommendations</CardTitle>
                        <CardDescription>
                            Follow these tips to keep your account secure
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex gap-3 p-4 rounded-lg border">
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Enable 2FA</p>
                                    <p className="text-xs text-muted-foreground">
                                        Add an extra security layer
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-4 rounded-lg border">
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Strong Password</p>
                                    <p className="text-xs text-muted-foreground">
                                        Use a unique, complex password
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-4 rounded-lg border">
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Regular Sign Out</p>
                                    <p className="text-xs text-muted-foreground">
                                        Sign out from shared devices
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-4 rounded-lg border">
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Monitor Activity</p>
                                    <p className="text-xs text-muted-foreground">
                                        Check active sessions regularly
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
