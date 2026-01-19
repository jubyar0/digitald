'use client'

import { registerApp } from "@/features/developer/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function CreateAppPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function onSubmit(formData: FormData) {
        setIsSubmitting(true)
        try {
            const name = formData.get("name") as string
            const description = formData.get("description") as string
            const webhookUrl = formData.get("webhookUrl") as string

            if (!name) {
                toast.error("App name is required")
                return
            }

            const result = await registerApp({
                name,
                description,
                webhookUrl: webhookUrl || undefined
            })

            if (result.success) {
                toast.success("App created successfully")
                router.push(`/developer/apps/${result.appId}`)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to create app")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <Link href="/developer" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Create New App</CardTitle>
                    <CardDescription>
                        Register a new application to integrate with the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">App Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Analytics Pro" required />
                            <p className="text-xs text-muted-foreground">
                                This is the name merchants will see in the App Store.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe what your app does..."
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                            <Input id="webhookUrl" name="webhookUrl" placeholder="https://api.yourapp.com/webhooks" />
                            <p className="text-xs text-muted-foreground">
                                We'll send events like <code>app.installed</code> to this URL.
                            </p>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create App
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
