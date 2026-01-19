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
import { formatDistanceToNow } from "date-fns"
import { Activity, Shield, Key, Trash2, Download } from "lucide-react"

interface ActivityLog {
    id: string
    action: string
    createdAt: Date
    metadata: any
}

interface AppActivityTableProps {
    logs: ActivityLog[]
}

export function AppActivityTable({ logs }: AppActivityTableProps) {
    if (logs.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/10">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No activity recorded yet.</p>
            </div>
        )
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    {getActionIcon(log.action)}
                                    <span className="capitalize">
                                        {log.action.replace(/_/g, " ")}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {renderMetadata(log.metadata)}
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(log.createdAt))} ago
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function getActionIcon(action: string) {
    switch (action) {
        case "app_installed":
            return <Download className="h-4 w-4 text-green-500" />
        case "app_uninstalled":
            return <Trash2 className="h-4 w-4 text-red-500" />
        case "token_regenerated":
            return <Key className="h-4 w-4 text-orange-500" />
        case "installation_revoked_by_admin":
            return <Shield className="h-4 w-4 text-destructive" />
        default:
            return <Activity className="h-4 w-4 text-blue-500" />
    }
}

function renderMetadata(metadata: any) {
    if (!metadata) return "-"

    if (typeof metadata === "object") {
        if (metadata.reason) return `Reason: ${metadata.reason}`
        if (metadata.ipAddress) return `IP: ${metadata.ipAddress}`
        return JSON.stringify(metadata).slice(0, 50) + (JSON.stringify(metadata).length > 50 ? "..." : "")
    }

    return String(metadata)
}
