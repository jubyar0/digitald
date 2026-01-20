import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ExternalLink, MoreHorizontal, ShoppingCart, Search, Filter, ArrowUpDown } from "lucide-react"
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

export const dynamic = 'force-dynamic'

interface Location {
    id: string
    name: string
    address: string
    status: "active" | "inactive"
}

const locations: Location[] = [
    {
        id: "1",
        name: "Shop location",
        address: "Algeria",
        status: "active",
    },
]

export default function LocationsPage() {
    return (
        <div className="p-6 max-w-4xl">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-muted-foreground" />
                    <h1 className="text-2xl font-semibold">Locations</h1>
                </div>
            </div>

            {/* All Locations */}
            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base">All locations</CardTitle>
                            <CardDescription className="text-sm">
                                Using 1 of 2 active locations available on your plan
                            </CardDescription>
                        </div>
                        <Button size="sm">Add location</Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {/* Tabs and Filters */}
                    <div className="flex items-center justify-between mb-4">
                        <Tabs defaultValue="all" className="w-auto">
                            <TabsList className="h-8">
                                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                                <TabsTrigger value="active" className="text-xs">Active</TabsTrigger>
                                <TabsTrigger value="inactive" className="text-xs">Inactive</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Search className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Filter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Locations Table */}
                    <div className="border rounded-lg">
                        <div className="grid grid-cols-[1fr_100px] text-xs text-muted-foreground px-4 py-2 border-b bg-muted/30">
                            <span>Location</span>
                            <span className="text-right">Status</span>
                        </div>
                        {locations.map((location) => (
                            <div
                                key={location.id}
                                className="grid grid-cols-[1fr_100px] items-center px-4 py-3 hover:bg-muted/30 transition-colors"
                            >
                                <div>
                                    <p className="font-medium">{location.name}</p>
                                    <p className="text-sm text-muted-foreground">{location.address}</p>
                                </div>
                                <div className="text-right">
                                    <Badge
                                        variant={location.status === "active" ? "default" : "secondary"}
                                        className={location.status === "active" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                                    >
                                        {location.status === "active" ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Point of Sale Subscriptions */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-base">Point of Sale subscriptions</CardTitle>
                        <span className="text-muted-foreground text-sm">ⓘ</span>
                    </div>
                    <CardDescription className="text-sm">
                        Start selling in person from any location with the in-person selling features included in your 3DM plan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                <ShoppingCart className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium">Point of Sale</p>
                                <p className="text-sm text-muted-foreground">Installed</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Open</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Learn More Link */}
            <div className="flex justify-center mt-6">
                <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                    Learn more about locations
                    <ExternalLink className="h-3 w-3" />
                </a>
            </div>
        </div>
    )
}
