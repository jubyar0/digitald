import { getMyApp } from "@/features/developer/actions"
import { AppSettingsForm } from "@/components/developer/app-settings-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function AppDetailsPage({ params }: { params: { id: string } }) {
    const app = await getMyApp(params.id)

    if (!app) {
        notFound()
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="mb-6">
                <Link href="/developer" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            {app.icon ? (
                                <img src={app.icon} alt={app.name} className="w-8 h-8" />
                            ) : (
                                <div className="w-6 h-6 bg-primary/20 rounded-full" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{app.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${app.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                    {app.status}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Created on {new Date(app.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Link href={`/seller/apps/${app.id}`} target="_blank">
                        <Button variant="outline">View in Store</Button>
                    </Link>
                </div>
            </div>

            <AppSettingsForm app={app} />
        </div>
    )
}
