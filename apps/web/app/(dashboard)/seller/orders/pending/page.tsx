import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getSellerOrders } from "@/actions/seller"
import { formatCurrency } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Clock, Eye, Package } from "lucide-react"
import { FulfillOrderButton } from "./_components/fulfill-order-button"

export default async function PendingOrdersPage() {
    const { data: orders, total } = await getSellerOrders(1, 50, 'PENDING')

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="dashboard-card-title">Pending Orders</h3>
                                    <p className="dashboard-card-description">
                                        Orders awaiting fulfillment
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-lg px-4 py-2">
                                        <Clock className="h-4 w-4 mr-2" />
                                        {total} Pending
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <Package className="h-12 w-12" />
                                                    <p className="text-lg font-medium">No pending orders</p>
                                                    <p className="text-sm">All orders have been fulfilled</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">
                                                    #{order.id.slice(-6)}
                                                </TableCell>
                                                <TableCell>{order.customer}</TableCell>
                                                <TableCell>{order.items} items</TableCell>
                                                <TableCell>{formatCurrency(order.total)}</TableCell>
                                                <TableCell>
                                                    {formatDistanceToNow(new Date(order.date), { addSuffix: true })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/seller/orders/${order.id}`}>
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                View
                                                            </Button>
                                                        </Link>
                                                        <FulfillOrderButton orderId={order.id} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
