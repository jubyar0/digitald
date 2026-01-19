"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Ban, CheckCircle, XCircle } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface AdminAppTableProps {
    apps: any[]
}

export function AdminAppTable({ apps }: AdminAppTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>App Name</TableHead>
                        <TableHead>Developer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Installs</TableHead>
                        <TableHead className="text-right">Created</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {apps.map((app) => (
                        <TableRow key={app.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded bg-primary/5 flex items-center justify-center">
                                        {app.icon ? (
                                            <img src={app.icon} alt={app.name} className="h-5 w-5 object-contain" />
                                        ) : (
                                            <span className="text-xs font-bold">{app.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span>{app.name}</span>
                                        <span className="text-xs text-muted-foreground">{app.slug}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col text-sm">
                                    <span>{app.developerName || "Unknown"}</span>
                                    <span className="text-xs text-muted-foreground">{app.developerEmail}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(app.status)}>
                                    {app.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {app._count?.installations || 0}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground text-sm">
                                {formatDistanceToNow(new Date(app.createdAt))} ago
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/apps/${app.id}`}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {app.status === "PENDING" && (
                                            <>
                                                <DropdownMenuItem className="text-green-600">
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Approve
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Reject
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {app.status === "APPROVED" && (
                                            <DropdownMenuItem className="text-orange-600">
                                                <Ban className="mr-2 h-4 w-4" />
                                                Suspend
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function getStatusVariant(status: string) {
    switch (status) {
        case "APPROVED":
            return "default" // or "success" if available
        case "PENDING":
            return "secondary"
        case "SUSPENDED":
        case "REJECTED":
            return "destructive"
        default:
            return "outline"
    }
}
