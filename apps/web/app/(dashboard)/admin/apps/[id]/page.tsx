"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Shield, CheckCircle, XCircle, Ban, Loader2, Globe, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getAppDetails } from "@/actions/app-actions"
import { approveApp, rejectApp, suspendApp } from "@/actions/admin-app-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AdminAppDetailsPage({ params }: { params: { id: string } }) {
    const [app, setApp] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const router = useRouter()

    useEffect(() => {
        loadData()
    }, [params.id])

    const loadData = async () => {
        try {
            const data = await getAppDetails(params.id)
            setApp(data)
        } catch (error) {
            console.error("Failed to load app:", error)
            toast.error("Failed to load app")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAction = async (action: "approve" | "reject" | "suspend") => {
        if (!confirm(`Are you sure you want to ${action} this app?`)) return

        setIsProcessing(true)
        try {
            let result
            if (action === "approve") {
                result = await approveApp(app.id)
            } else if (action === "reject") {
                const reason = prompt("Enter rejection reason:")
                if (!reason) {
                    setIsProcessing(false)
                    return
                }
                result = await rejectApp(app.id, reason)
            } else if (action === "suspend") {
                const reason = prompt("Enter suspension reason:")
                if (!reason) {
                    setIsProcessing(false)
                    return
                }
                result = await suspendApp(app.id, reason)
            }

            if (result?.success) {
                toast.success(`App ${action}ed successfully`)
                loadData() // Reload to show new status
                router.refresh()
            } else {
                toast.error(result?.error || `Failed to ${action} app`)
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!app) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h1 className="text-2xl font-bold">App not found</h1>
                <Button asChild>
                    <Link href="/admin/apps">Back to Apps</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/apps">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/5 flex items-center justify-center">
                        {app.icon ? (
                            <img src={app.icon} alt={app.name} className="h-6 w-6 object-contain" />
                        ) : (
                            <span className="font-bold text-primary">{app.name.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <h1 className="font-semibold text-xl">{app.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{app.slug}</span>
                            <span>•</span>
                            <span>v1.0.0</span>
                        </div>
                    </div>
                    <Badge variant={
                        app.status === "APPROVED" ? "default" :
                            app.status === "PENDING" ? "secondary" : "destructive"
                    } className="ml-2">
                        {app.status}
                    </Badge>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    {app.status === "PENDING" && (
                        <>
                            <Button
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleAction("approve")}
                                disabled={isProcessing}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                            <Button
                                variant="outline"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleAction("reject")}
                                disabled={isProcessing}
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                        </>
                    )}
                    {app.status === "APPROVED" && (
                        <Button
                            variant="destructive"
                            onClick={() => handleAction("suspend")}
                            disabled={isProcessing}
                        >
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend App
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>About App</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-1">Short Description</h3>
                                <p className="text-sm text-muted-foreground">{app.shortDescription || "-"}</p>
                            </div>
                            <Separator />
                            <div>
                                <h3 className="font-medium mb-1">Full Description</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{app.description || "-"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>Permissions Requested</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {app.permissions.map((perm: any) => (
                                    <div key={perm.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                        <div>
                                            <div className="font-medium text-sm">{perm.permission}</div>
                                            <div className="text-xs text-muted-foreground">{perm.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Developer Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                    <span className="font-bold text-muted-foreground">
                                        {app.developerName?.charAt(0) || "?"}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-medium">{app.developerName || "Unknown"}</div>
                                    <div className="text-xs text-muted-foreground">Joined 2 months ago</div>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <a href={`mailto:${app.developerEmail}`} className="hover:underline">{app.developerEmail || "-"}</a>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Globe className="h-4 w-4" />
                                    <a href={app.developerUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{app.developerUrl || "-"}</a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">App ID</span>
                                <span className="font-mono text-xs">{app.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Created</span>
                                <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Updated</span>
                                <span>{new Date(app.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
