'use client'

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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { updateOrderStatus } from "@/actions/seller"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Order {
    id: string
    customer: string
    total: number
    status: string
    date: Date
    items: number
}

interface OrdersTableProps {
    orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
    const router = useRouter()
    const [isUpdating, setIsUpdating] = useState(false)

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setIsUpdating(true)
        try {
            const result = await updateOrderStatus(orderId, newStatus)
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
            case 'DELIVERED':
                return 'default' // or success if available
            case 'PENDING':
                return 'secondary'
            case 'CANCELLED':
                return 'destructive'
            default:
                return 'outline'
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No orders found.
                        </TableCell>
                    </TableRow>
                ) : (
                    orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id.slice(-6)}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell>{formatCurrency(order.total)}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusColor(order.status) as any}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/seller/orders/${order.id}`}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                <Truck className="mr-2 h-4 w-4" />
                                                Update Status
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuRadioGroup
                                                    value={order.status}
                                                    onValueChange={(value) => handleStatusUpdate(order.id, value)}
                                                >
                                                    <DropdownMenuRadioItem value="PENDING">
                                                        <Clock className="mr-2 h-4 w-4" /> Pending
                                                    </DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="PROCESSING">
                                                        <Truck className="mr-2 h-4 w-4" /> Processing
                                                    </DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="SHIPPED">
                                                        <Truck className="mr-2 h-4 w-4" /> Shipped
                                                    </DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="DELIVERED">
                                                        <CheckCircle className="mr-2 h-4 w-4" /> Delivered
                                                    </DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="CANCELLED">
                                                        <XCircle className="mr-2 h-4 w-4" /> Cancelled
                                                    </DropdownMenuRadioItem>
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
