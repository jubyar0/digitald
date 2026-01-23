import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Plus, ChevronRight, Box, Tag, AlertCircle } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function MetafieldsPage() {
    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <Database className="h-6 w-6 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Metafields and metaobjects</h1>
                <Badge variant="secondary">Coming Soon</Badge>
            </div>

            <div className="space-y-6">
                {/* Feature Info */}
                <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
                    <CardContent className="py-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Advanced Feature</p>
                            <p className="text-sm text-muted-foreground">
                                Metafields and metaobjects allow you to add custom data to your products, collections, and store. This feature is currently in development.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Metafield Definitions Preview */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Metafield definitions</CardTitle>
                                <CardDescription>Add custom fields to products, collections, and more</CardDescription>
                            </div>
                            <Button size="sm" className="gap-2" disabled>
                                <Plus className="h-4 w-4" />
                                Add definition
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                            <div className="flex items-center gap-3">
                                <Box className="h-5 w-5 text-muted-foreground" />
                                <span>Products</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">0 definitions</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                            <div className="flex items-center gap-3">
                                <Tag className="h-5 w-5 text-muted-foreground" />
                                <span>Collections</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">0 definitions</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metaobjects Preview */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Metaobjects</CardTitle>
                                <CardDescription>Create custom content types for your store</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2" disabled>
                                <Plus className="h-4 w-4" />
                                Add definition
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="border border-dashed rounded-lg p-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                Create custom content types like size charts, product specs, or FAQs. This feature will be available soon.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
