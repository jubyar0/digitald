import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Plus, ChevronRight, Box, Tag } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function MetafieldsPage() {
    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <Database className="h-6 w-6 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Metafields and metaobjects</h1>
            </div>

            <div className="space-y-6">
                {/* Metafield Definitions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Metafield definitions</CardTitle>
                                <CardDescription>Add custom fields to products, collections, and more</CardDescription>
                            </div>
                            <Button size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add definition
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Box className="h-5 w-5 text-muted-foreground" />
                                <span>Products</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">0 definitions</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
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

                {/* Metaobjects */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Metaobjects</CardTitle>
                                <CardDescription>Create custom content types for your store</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add definition
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="border border-dashed rounded-lg p-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                No metaobject definitions yet. Create custom content types like size charts, product specs, or FAQs.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
