import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import Link from "next/link"
import { getSellerOrders } from "@/actions/seller"
import { OrdersTable } from "./orders-table"

interface PageProps {
    searchParams: {
        page?: string
        status?: string
    }
}

export default async function OrdersPage({ searchParams }: PageProps) {
    const page = Number(searchParams.page) || 1
    const status = searchParams.status || 'ALL'
    const pageSize = 10

    const { data: orders, total } = await getSellerOrders(page, pageSize, status)

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">All Orders</h3>
                            <p className="dashboard-card-description">
                                Manage and track customer orders
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Search orders..." className="pl-10" />
                            </div>
                            <div className="flex gap-2">
                                <Link href="/seller/orders"><Button variant={status === 'ALL' ? 'default' : 'outline'}>All</Button></Link>
                                <Link href="/seller/orders?status=PENDING"><Button variant={status === 'PENDING' ? 'default' : 'outline'}>Pending</Button></Link>
                                <Link href="/seller/orders?status=COMPLETED"><Button variant={status === 'COMPLETED' ? 'default' : 'outline'}>Completed</Button></Link>
                                <Link href="/seller/orders?status=CANCELLED"><Button variant={status === 'CANCELLED' ? 'default' : 'outline'}>Cancelled</Button></Link>
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <OrdersTable orders={orders} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
