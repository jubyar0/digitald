import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, ExternalLink, MoreHorizontal, ShoppingCart, Globe } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

interface SalesChannel {
    id: string
    name: string
    icon: React.ReactNode
    status: "installed" | "available"
}

const salesChannels: SalesChannel[] = [
    {
        id: "pos",
        name: "Point of Sale",
        icon: <ShoppingCart className="h-5 w-5 text-white" />,
        status: "installed",
    },
    {
        id: "online-store",
        name: "Online Store",
        icon: <Globe className="h-5 w-5 text-white" />,
        status: "installed",
    },
]

export default function SalesChannelsPage() {
    return (
        <div className="p-6 max-w-4xl">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Store className="h-6 w-6 text-muted-foreground" />
                    <h1 className="text-2xl font-semibold">Sales channels</h1>
                </div>
                <Button size="sm" className="bg-[#008060] hover:bg-[#006e52] text-white">
                    3DM App Store
                </Button>
            </div>

            {/* Channels List */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <Tabs defaultValue="installed" className="w-auto">
                            <TabsList className="h-8">
                                <TabsTrigger value="installed" className="text-xs">Installed</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 6h18M3 12h18M3 18h18" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="divide-y">
                        {salesChannels.map((channel) => (
                            <div
                                key={channel.id}
                                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${channel.id === "pos" ? "bg-blue-600" : "bg-emerald-600"
                                        }`}>
                                        {channel.icon}
                                    </div>
                                    <span className="font-medium">{channel.name}</span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Manage settings</DropdownMenuItem>
                                        <DropdownMenuItem>View store</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Remove channel</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Learn More Link */}
            <div className="flex justify-center mt-6">
                <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                    Learn more about sales channels
                    <ExternalLink className="h-3 w-3" />
                </a>
            </div>
        </div>
    )
}
