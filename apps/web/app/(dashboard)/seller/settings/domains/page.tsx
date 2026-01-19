import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Plus, ExternalLink, ChevronRight, Check } from "lucide-react"

export default function DomainsPage() {
    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Globe className="h-6 w-6 text-muted-foreground" />
                    <h1 className="text-2xl font-semibold">Domains</h1>
                </div>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Buy new domain
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
                                        <p className="text-sm text-muted-foreground">3DM subdomain</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-emerald-500">Primary</Badge>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" className="mt-4 gap-2">
                            <Plus className="h-4 w-4" />
                            Connect existing domain
                        </Button>
                    </CardContent>
                </Card>

                {/* Domain Info */}
                <Card>
                    <CardContent className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Connect a custom domain to make your store easier to find. You can buy a new domain directly from 3DM or connect one you already own.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
