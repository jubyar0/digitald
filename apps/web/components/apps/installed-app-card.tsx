"use client"

import { MoreVertical, Settings, Trash2, ExternalLink, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface InstalledAppCardProps {
    installation: {
        id: string
        status: string
        installedAt: Date
        app: {
            id: string
            name: string
            description: string | null
            icon: string | null
            slug: string
        }
    }
    onUninstall: (id: string) => void
}

export function InstalledAppCard({ installation, onUninstall }: InstalledAppCardProps) {
    const isSuspended = installation.status === "SUSPENDED"

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center overflow-hidden">
                        {installation.app.icon ? (
                            <img src={installation.app.icon} alt={installation.app.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="text-lg font-bold text-primary">
                                {installation.app.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">{installation.app.name}</h3>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={isSuspended ? "destructive" : "secondary"}
                                className="text-[10px] h-4 px-1.5"
                            >
                                {installation.status}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                                Installed {formatDistanceToNow(new Date(installation.installedAt))} ago
                            </span>
                        </div>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/seller/apps/${installation.app.id}`}>
                                <Settings className="mr-2 h-4 w-4" />
                                Manage App
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open App
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onUninstall(installation.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Uninstall
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-1 py-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {installation.app.description}
                </p>
                {isSuspended && (
                    <div className="mt-3 p-2 bg-destructive/10 rounded-md flex items-start gap-2 text-xs text-destructive">
                        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <p>This app has been suspended and cannot access your store data.</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/seller/apps/${installation.app.id}`}>
                        Configure
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
