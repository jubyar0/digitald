import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getSellerRefunds, updateRefundStatus } from "@/actions/refunds"
import { formatDistanceToNow } from "date-fns"
import { Check, X } from "lucide-react"
import { RefundActionButtons } from "./refund-action-buttons"

export default async function ReturnsPage() {
    const refunds = await getSellerRefunds()

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="flex flex-1 flex-col gap-8 dashboard-padding">
                <div className="dashboard-card p-6">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Returns & Refunds</h3>
                        <p className="dashboard-card-description">
                            Manage refund requests from your customers
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Refund Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {refunds.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No refund requests found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    refunds.map((refund) => (
                                        <TableRow key={refund.id}>
                                            <TableCell className="font-medium">
                                                #{refund.order.id.slice(0, 8)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{refund.order.user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{refund.order.user.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>${refund.amount.toFixed(2)}</TableCell>
                                            <TableCell className="max-w-[200px] truncate" title={refund.reason}>
                                                {refund.reason}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    refund.status === 'APPROVED' ? 'secondary' :
                                                        refund.status === 'REJECTED' ? 'destructive' :
                                                            refund.status === 'COMPLETED' ? 'secondary' : 'outline'
                                                }>
                                                    {refund.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {formatDistanceToNow(new Date(refund.createdAt), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {refund.status === 'PENDING' && (
                                                    <RefundActionButtons refundId={refund.id} />
                                                )}
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
    )
}
