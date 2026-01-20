import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DownloadIcon } from "lucide-react"
import { getSellerInvoices } from "@/actions/seller"
import { InvoiceCreateDialog } from "./invoice-create-dialog"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

export default async function InvoicesPage() {
    const { data: invoices, total } = await getSellerInvoices()

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'default'
            case 'PENDING':
                return 'secondary'
            case 'OVERDUE':
                return 'destructive'
            case 'CANCELLED':
                return 'outline'
            default:
                return 'secondary'
        }
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="dashboard-card-header">
                                <h3 className="dashboard-card-title">Invoices</h3>
                                <p className="dashboard-card-description">Manage and download invoices</p>
                            </div>
                            <InvoiceCreateDialog />
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            {invoices.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <p className="text-muted-foreground mb-4">No invoices yet</p>
                                    <p className="text-sm text-muted-foreground">
                                        Create your first invoice by clicking the button above
                                    </p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice #</TableHead>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Tax</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.map((invoice) => (
                                            <TableRow key={invoice.id}>
                                                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                                <TableCell>{invoice.orderId.slice(0, 8)}...</TableCell>
                                                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                                                <TableCell>${invoice.tax.toFixed(2)}</TableCell>
                                                <TableCell>${invoice.total.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(invoice.status)}>
                                                        {invoice.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm">
                                                        <DownloadIcon className="mr-2 h-4 w-4" />
                                                        Download
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
