import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppWindow, ExternalLink, Package } from "lucide-react"
import Image from "next/image"

export default function AppsPage() {
    return (
        <div className="p-6 max-w-4xl">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <AppWindow className="h-6 w-6 text-muted-foreground" />
                    <h1 className="text-2xl font-semibold">Apps</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        Develop apps
                    </Button>
                    <Button size="sm" className="bg-[#008060] hover:bg-[#006e52] text-white">
                        3DM App Store
                    </Button>
                </div>
            </div>

            {/* Empty State */}
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    {/* App Illustration */}
                    <div className="relative w-40 h-40 mb-6">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Abstract app icons illustration */}
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500 absolute -top-2 -left-8 rotate-12 shadow-lg" />
                                <div className="w-20 h-20 rounded-2xl bg-teal-600 absolute top-4 left-2 shadow-lg flex items-center justify-center">
                                    <Package className="h-10 w-10 text-white" />
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-amber-500 absolute top-2 left-20 rotate-6 shadow-lg" />
                                <div className="w-10 h-10 rounded-lg bg-rose-400 absolute top-16 left-16 -rotate-6 shadow-lg" />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">Add apps to your store</h3>
                    <p className="text-sm text-muted-foreground max-w-md mb-6">
                        Apps and sales channels add features and tools that take your business to the next level.
                        Choose from thousands of free and paid apps to find what works for you.
                    </p>
                    <Button variant="outline" size="sm">
                        Explore apps
                    </Button>
                </CardContent>
            </Card>

            {/* Learn More Link */}
            <div className="flex justify-center mt-6">
                <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                    Learn more about apps
                    <ExternalLink className="h-3 w-3" />
                </a>
            </div>
        </div>
    )
}
