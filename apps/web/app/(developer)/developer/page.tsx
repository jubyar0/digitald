import { getMyApps } from "@/features/developer/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Settings, Box } from "lucide-react"
import Link from "next/link"

export default async function DeveloperDashboard() {
    const apps = await getMyApps()

    return (
        <div className="container mx-auto py-8 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Developer Portal</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your apps and integrations.
                    </p>
                </div>
                <Link href="/developer/apps/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New App
                    </Button>
                </Link>
            </div>

            {apps.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <Box className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No apps yet</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Get started by creating your first app. You can build integrations for merchants to use.
                        </p>
                        <Link href="/developer/apps/new">
                            <Button>Create App</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map((app) => (
                        <Card key={app.id} className="hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        {app.icon ? (
                                            <img src={app.icon} alt={app.name} className="w-6 h-6" />
                                        ) : (
                                            <Box className="w-5 h-5 text-primary" />
                                        )}
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${app.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {app.status}
                                    </div>
                                </div>
                                <CardTitle className="line-clamp-1">{app.name}</CardTitle>
                                <CardDescription className="line-clamp-2 h-10">
                                    {app.description || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                    <span>{app._count.installations} installations</span>
                                </div>
                                <Link href={`/developer/apps/${app.id}`}>
                                    <Button variant="outline" className="w-full">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Manage App
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
