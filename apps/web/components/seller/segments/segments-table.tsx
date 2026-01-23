"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, PlayCircle, Copy, Download, Pencil, Trash2, Store } from "lucide-react"
import { deleteSegment } from "@/app/actions/segments"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface Segment {
    id: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
}

interface SegmentsTableProps {
    initialSegments: Segment[]
}

export function SegmentsTable({ initialSegments }: SegmentsTableProps) {
    const router = useRouter()
    const [segments, setSegments] = useState(initialSegments)
    const [search, setSearch] = useState("")

    const filteredSegments = segments.filter(segment =>
        segment.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this segment?")) return

        const result = await deleteSegment(id)
        if (result.success) {
            toast.success("Segment deleted")
            setSegments(prev => prev.filter(s => s.id !== id))
            router.refresh()
        } else {
            toast.error(result.error || "Failed to delete segment")
        }
    }

    return (
        <div className="flex flex-col gap-4 rounded-lg border bg-card shadow-sm">
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search segments"
                        className="pl-9 bg-muted/50 border-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">% of customers</TableHead>
                        <TableHead>Last activity</TableHead>
                        <TableHead>Created by</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSegments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No segments found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredSegments.map((segment) => (
                            <TableRow key={segment.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{segment.name}</span>
                                        {segment.description && (
                                            <span className="text-xs text-muted-foreground">{segment.description}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {/* Placeholder for percentage */}
                                    -
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {formatDistanceToNow(new Date(segment.updatedAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Store className="h-4 w-4 text-green-600" />
                                        <span>Vendor</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem onClick={() => router.push(`/seller/customers/segments/${segment.id}`)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem disabled>
                                                <PlayCircle className="mr-2 h-4 w-4" />
                                                Use segment
                                            </DropdownMenuItem>
                                            <DropdownMenuItem disabled>
                                                <Copy className="mr-2 h-4 w-4" />
                                                Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={() => handleDelete(segment.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
