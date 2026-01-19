'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditIcon, TrashIcon, PowerIcon } from "lucide-react"
import { deleteDiscount, toggleDiscountStatus } from "@/actions/seller"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Discount {
    id: string
    name: string
    type: string
    value: number
    startDate: Date
    endDate: Date
    isActive: boolean
    usageCount: number
}

interface DiscountsTableProps {
    discounts: Discount[]
}

export function DiscountsTable({ discounts }: DiscountsTableProps) {
    const router = useRouter()

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteDiscount(id)
            if (result.success) {
                toast.success("Discount deleted")
                router.refresh()
            } else {
                toast.error("Failed to delete discount")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const result = await toggleDiscountStatus(id, !currentStatus)
            if (result.success) {
                toast.success(`Discount ${!currentStatus ? 'activated' : 'deactivated'}`)
                router.refresh()
            } else {
                toast.error("Failed to update status")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {discounts.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No discounts found. Create one to get started.
                        </TableCell>
                    </TableRow>
                ) : (
                    discounts.map((discount) => (
                        <TableRow key={discount.id}>
                            <TableCell className="font-medium">{discount.name}</TableCell>
                            <TableCell><Badge variant="outline">{discount.type}</Badge></TableCell>
                            <TableCell>{discount.type === "PERCENTAGE" ? `${discount.value}%` : `$${discount.value}`}</TableCell>
                            <TableCell className="text-sm">
                                {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Badge variant={discount.isActive ? "default" : "secondary"}>
                                    {discount.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell>{discount.usageCount}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleToggleStatus(discount.id, discount.isActive)}
                                        title={discount.isActive ? "Deactivate" : "Activate"}
                                    >
                                        <PowerIcon className={`h-4 w-4 ${discount.isActive ? "text-green-500" : "text-muted-foreground"}`} />
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <TrashIcon className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the discount.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(discount.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
