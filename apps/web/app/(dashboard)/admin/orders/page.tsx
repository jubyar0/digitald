import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { SearchIcon } from 'lucide-react'
import { getOrders } from '@/actions/admin'

interface PageProps {
    searchParams: {
        page?: string
        search?: string
    }
}

// ✅ Server Component for instant LCP
export default async function OrdersPage({ searchParams }: PageProps) {
    const page = Number(searchParams.page) || 1
    const search = searchParams.search || ''
    const pageSize = 10

    const result = await getOrders(page, pageSize, search)
    const orders = result.data

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Orders</h3>
                            <p className="dashboard-card-description">
                                View and manage all platform orders
                            </p>
                        </div>
                        <form method="get" className="mt-6 flex gap-4">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    name="search"
                                    placeholder="Search by order ID..."
                                    className="pl-10"
                                    defaultValue={search}
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">No orders found</TableCell>
                                        </TableRow>
                                    ) : (
                                        orders.map((order: any) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                                                <TableCell>{order.user.name || order.user.email}</TableCell>
                                                <TableCell>{order.vendor.name}</TableCell>
                                                <TableCell>${order.totalAmount}</TableCell>
                                                <TableCell>
                                                    <Badge variant={order.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {orders.length} of {result.total} orders
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={page === 1} asChild>
                                <a href={`?page=${page - 1}&search=${search}`}>Previous</a>
                            </Button>
                            <Button variant="outline" size="sm" disabled={page * pageSize >= result.total} asChild>
                                <a href={`?page=${page + 1}&search=${search}`}>Next</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
