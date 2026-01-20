"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PlusCircle } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function WebhooksPage() {
    return (
        <div className="p-6 max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/seller/settings/notifications" className="p-2 hover:bg-accent rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </Link>
                <h1 className="text-2xl font-semibold">Webhooks</h1>
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <p className="text-sm text-muted-foreground">Send XML or JSON notifications about store events to a URL</p>

                    <Button variant="outline" className="w-full justify-start gap-2 h-12 text-muted-foreground hover:text-foreground">
                        <PlusCircle className="h-5 w-5" />
                        Create webhook
                    </Button>
                </CardContent>
            </Card>

            <div className="px-1">
                <p className="text-sm text-muted-foreground">
                    Your webhooks will be signed with <br />
                    <span className="font-mono text-xs text-[#262626] dark:text-gray-300">50c00cfa9d5acba5bcf5bff589aa2bbc2979c3aaa8970984d4b79c20a81be56a</span>
                </p>
            </div>
        </div>
    )
}
