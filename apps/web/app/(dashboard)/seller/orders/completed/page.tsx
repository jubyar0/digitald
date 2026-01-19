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
import { CheckCircle, Eye, Package } from "lucide-react"

export default async function CompletedOrdersPage() {
    const { data: orders, total } = await getSellerOrders(1, 50, 'COMPLETED')

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="dashboard-card-title">Completed Orders</h3>
                                    <p className="dashboard-card-description">
                                        Successfully delivered orders
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="text-lg px-4 py-2">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        {total} Completed
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
                                        <TableHead>Completed Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <Package className="h-12 w-12" />
                                                    <p className="text-lg font-medium">No completed orders yet</p>
                                                    <p className="text-sm">Completed orders will appear here</p>
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
                                                <TableCell>
                                                    <Badge>Completed</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/seller/orders/${order.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View Details
                                                        </Button>
                                                    </Link>
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
