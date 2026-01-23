import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Plus, ChevronRight, Check, AlertCircle } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function DomainsPage() {
    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Globe className="h-6 w-6 text-muted-foreground" />
                    <h1 className="text-2xl font-semibold">Domains</h1>
                </div>
                <Button size="sm" className="gap-2" disabled>
                    <Plus className="h-4 w-4" />
                    Buy new domain
                    <Badge variant="secondary" className="ml-1 text-xs">Coming Soon</Badge>
                </Button>
            </div>

            <div className="space-y-6">
                {/* Primary Domain */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Your domains</CardTitle>
                        <CardDescription>Manage the domains connected to your store</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg divide-y">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-emerald-500" />
                                    <div>
                                        <p className="font-medium">mystore.3dm.shop</p>
                                        <p className="text-sm text-muted-foreground">3DM subdomain (auto-generated)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-emerald-500">Primary</Badge>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" className="mt-4 gap-2" disabled>
                            <Plus className="h-4 w-4" />
                            Connect existing domain
                            <Badge variant="secondary" className="ml-1 text-xs">Coming Soon</Badge>
                        </Button>
                    </CardContent>
                </Card>

                {/* Domain Info */}
                <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
                    <CardContent className="py-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Custom Domains Feature</p>
                            <p className="text-sm text-muted-foreground">
                                Custom domain connection is coming soon. Your store is currently accessible via your 3DM subdomain.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
