"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Plus, Code, ChevronRight } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function CustomerEventsPage() {
    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <Activity className="h-6 w-6 text-muted-foreground" />
                <h1 className="text-2xl font-semibold">Customer events</h1>
            </div>

            <div className="space-y-6">
                {/* App Clikoms */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">App Clikoms</CardTitle>
                        <CardDescription>
                            Clikoms installed via marketing and data collection apps.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border border-dashed rounded-lg p-8 text-center">
                            <Code className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground mb-4">
                                No app Clikoms installed. Install marketing apps to automatically add Clikoms.
                            </p>
                            <Button variant="outline" size="sm">
                                Browse marketing apps
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Custom Clikoms */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Custom Clikoms</CardTitle>
                                <CardDescription>
                                    Manually added Clikoms for custom tracking.
                                </CardDescription>
                            </div>
                            <Button size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add custom Clikom
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="border border-dashed rounded-lg p-8 text-center">
                            <Code className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground">
                                No custom Clikoms added yet. Add a custom Clikom to track specific events.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Sharing */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Data sharing</CardTitle>
                        <CardDescription>Control what data is shared with third-party services</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                            <span>Manage data sharing settings</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
