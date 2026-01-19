'use client'

import { regenerateAppSecret, updateApp } from "@/features/developer/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, RefreshCw, Copy, Eye, EyeOff, Save } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface AppSettingsFormProps {
    app: {
        id: string
        name: string
        description: string | null
        webhookSecret: string | null
        webhooks: { targetUrl: string }[]
    }
}

export function AppSettingsForm({ app }: AppSettingsFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isRegenerating, setIsRegenerating] = useState(false)
    const [showSecret, setShowSecret] = useState(false)
    const [secret, setSecret] = useState(app.webhookSecret)

    // Get the first webhook URL if available
    const initialWebhookUrl = app.webhooks[0]?.targetUrl || ""

    async function onUpdate(formData: FormData) {
        setIsSubmitting(true)
        try {
            const name = formData.get("name") as string
            const description = formData.get("description") as string
            const webhookUrl = formData.get("webhookUrl") as string

            await updateApp(app.id, {
                name,
                description,
                webhookUrl: webhookUrl || undefined
            })

            toast.success("App updated successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to update app")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function onRegenerateSecret() {
        if (!confirm("Are you sure? This will invalidate the old secret immediately.")) return

        setIsRegenerating(true)
        try {
            const result = await regenerateAppSecret(app.id)
            if (result.success && result.secret) {
                setSecret(result.secret)
                toast.success("Secret regenerated")
            }
        } catch (error) {
            toast.error("Failed to regenerate secret")
        } finally {
            setIsRegenerating(false)
        }
    }

    function copySecret() {
        if (secret) {
            navigator.clipboard.writeText(secret)
            toast.success("Copied to clipboard")
        }
    }

    return (
        <div className="space-y-6">
            {/* Credentials Card */}
            <Card>
                <CardHeader>
                    <CardTitle>API Credentials</CardTitle>
                    <CardDescription>
                        Use these credentials to authenticate your app and verify webhooks.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>App ID</Label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-muted p-2 rounded border font-mono text-sm">
                                {app.id}
                            </code>
                            <Button variant="outline" size="icon" onClick={() => {
                                navigator.clipboard.writeText(app.id)
                                toast.success("Copied ID")
                            }}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>App Secret</Label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted p-2 rounded border font-mono text-sm relative">
                                <span className={showSecret ? "" : "blur-sm select-none"}>
                                    {secret || "No secret generated"}
                                </span>
                            </div>
                            <Button variant="outline" size="icon" onClick={() => setShowSecret(!showSecret)}>
                                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button variant="outline" size="icon" onClick={copySecret}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="pt-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={onRegenerateSecret}
                                disabled={isRegenerating}
                            >
                                {isRegenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                                Regenerate Secret
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Settings Form */}
            <Card>
                <CardHeader>
                    <CardTitle>App Settings</CardTitle>
                    <CardDescription>
                        Update your application details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">App Name</Label>
                            <Input id="name" name="name" defaultValue={app.name} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={app.description || ""}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="webhookUrl">Webhook URL</Label>
                            <Input
                                id="webhookUrl"
                                name="webhookUrl"
                                defaultValue={initialWebhookUrl}
                                placeholder="https://api.yourapp.com/webhooks"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
