'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { getPendingProducts, approveProduct, rejectProduct } from '@/actions/admin'
import { toast } from 'sonner'

export default function PendingProductsPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const result = await getPendingProducts(page, pageSize)
            setProducts(result.data)
            setTotal(result.total)
        } catch (error) {
            toast.error('Failed to load pending products')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [page])

    const handleApprove = async (id: string) => {
        try {
            await approveProduct(id)
            toast.success('Product approved')
            fetchProducts()
        } catch (error) {
            toast.error('Failed to approve product')
        }
    }

    const handleReject = async (id: string) => {
        try {
            await rejectProduct(id, 'Product does not meet quality standards')
            toast.success('Product rejected')
            fetchProducts()
        } catch (error) {
            toast.error('Failed to reject product')
        }
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Pending Approval</h3>
                            <p className="dashboard-card-description">
                                Review and approve products awaiting approval
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
                                        </TableRow>
                                    ) : products.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">No pending products</TableCell>
                                        </TableRow>
                                    ) : (
                                        products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>{product.vendor.name}</TableCell>
                                                <TableCell>{product.category.name}</TableCell>
                                                <TableCell>${product.price}</TableCell>
                                                <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="default" size="sm" onClick={() => handleApprove(product.id)}>
                                                            Approve
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => handleReject(product.id)}>
                                                            Reject
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {products.length} of {total} pending products
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total}>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
