"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateOrderStatus } from "@/actions/seller"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface OrderStatusSelectorProps {
    orderId: string
    currentStatus: string
}

export function OrderStatusSelector({ orderId, currentStatus }: OrderStatusSelectorProps) {
    const router = useRouter()
    const [isUpdating, setIsUpdating] = useState(false)

    const handleStatusChange = async (value: string) => {
        setIsUpdating(true)
        try {
            const result = await updateOrderStatus(orderId, value)
            if (result.success) {
                toast.success("Order status updated")
                router.refresh()
            } else {
                toast.error("Failed to update status")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <Select
                defaultValue={currentStatus}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
