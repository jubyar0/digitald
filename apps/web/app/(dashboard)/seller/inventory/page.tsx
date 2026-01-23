import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SearchIcon, AlertTriangleIcon, CheckCircleIcon, Package } from "lucide-react"
import { getMyProducts, getInventoryStats } from "@/actions/vendor-products"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
    const [productsResult, stats] = await Promise.all([
        getMyProducts({ limit: 50 }),
        getInventoryStats()
    ])

    const products = productsResult.products || []

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Inventory Management</h3>
                            <p className="dashboard-card-description">
                                Track product availability and status
                            </p>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Search inventory..." className="pl-10" />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                        <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Active Products</p>
                                        <p className="text-2xl font-bold">{stats.activeProducts}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                                        <AlertTriangleIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Draft Products</p>
                                        <p className="text-2xl font-bold">{stats.draftProducts}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                        <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Products</p>
                                        <p className="text-2xl font-bold">{stats.totalProducts}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Total Sales</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-4">
                                                    <img
                                                        src="/media/illustrations/24.svg"
                                                        alt="No products"
                                                        className="h-32 w-32 object-contain dark:opacity-80"
                                                    />
                                                    <div>
                                                        <p className="text-lg font-medium">No products found</p>
                                                        <p className="text-sm text-muted-foreground">Add your first product to get started</p>
                                                    </div>
                                                    <Link href="/seller/products/add">
                                                        <Button className="mt-2">Add Product</Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell>{item.category?.name || 'Uncategorized'}</TableCell>
                                                <TableCell>
                                                    <Badge variant={item.status === 'PUBLISHED' ? "default" : "secondary"}>
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{item._count?.orders || 0}</TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/seller/products/edit/${item.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            Edit
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
