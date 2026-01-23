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
import { getSellerPayments } from "@/actions/seller"
import { formatCurrency } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { CreditCard, DollarSign, Eye } from "lucide-react"

interface PageProps {
    searchParams: {
        page?: string
        status?: string
    }
}

export default async function PaymentsPage({ searchParams }: PageProps) {
    const page = Number(searchParams.page) || 1
    const status = searchParams.status || 'ALL'
    const { data: payments, total } = await getSellerPayments(page, 50, status)

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'default'
            case 'PENDING':
                return 'secondary'
            case 'FAILED':
                return 'destructive'
            case 'REFUNDED':
                return 'outline'
            default:
                return 'secondary'
        }
    }

    const getProviderIcon = (provider: string) => {
        switch (provider) {
            case 'STRIPE':
                return '💳'
            case 'PAYPAL':
                return '🅿️'
            case 'CRYPTOMUS':
                return '₿'
            case 'BALANCE':
                return '💰'
            default:
                return '💵'
        }
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="dashboard-card-title">Payment History</h3>
                                    <p className="dashboard-card-description">
                                        Track all incoming payments for your orders
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-lg px-4 py-2">
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        {total} Payments
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <Link href="/seller/finance/payments">
                                <Button variant={status === 'ALL' ? 'default' : 'outline'} size="sm">All</Button>
                            </Link>
                            <Link href="/seller/finance/payments?status=COMPLETED">
                                <Button variant={status === 'COMPLETED' ? 'default' : 'outline'} size="sm">Completed</Button>
                            </Link>
                            <Link href="/seller/finance/payments?status=PENDING">
                                <Button variant={status === 'PENDING' ? 'default' : 'outline'} size="sm">Pending</Button>
                            </Link>
                            <Link href="/seller/finance/payments?status=REFUNDED">
                                <Button variant={status === 'REFUNDED' ? 'default' : 'outline'} size="sm">Refunded</Button>
                            </Link>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Payment ID</TableHead>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <CreditCard className="h-12 w-12" />
                                                    <p className="text-lg font-medium">No payments found</p>
                                                    <p className="text-sm">Payments will appear here when customers complete orders</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        payments.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell className="font-mono text-sm">
                                                    #{payment.id.slice(-8)}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/seller/orders/${payment.orderId}`}
                                                        className="text-primary hover:underline"
                                                    >
                                                        #{payment.orderIdShort}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{payment.customer}</TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(payment.amount)}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1">
                                                        {getProviderIcon(payment.provider)}
                                                        {payment.provider}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(payment.status)}>
                                                        {payment.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/seller/orders/${payment.orderId}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View Order
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
