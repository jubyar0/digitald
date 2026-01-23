import { getDisputes } from '@/actions/disputes'
import { DisputeStatus } from '@repo/database'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    Search
} from 'lucide-react'

export default async function DisputesPage({
    searchParams
}: {
    searchParams: { status?: DisputeStatus }
}) {
    const disputes = await getDisputes(searchParams.status)

    const stats = {
        total: disputes.length,
        pending: disputes.filter(d => d.status === 'PENDING').length,
        inReview: disputes.filter(d => d.status === 'IN_REVIEW').length,
        resolved: disputes.filter(d => d.status === 'RESOLVED').length
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dispute Management</h1>
                <p className="text-muted-foreground">
                    Manage and resolve customer disputes
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Review</CardTitle>
                        <Search className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inReview}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resolved}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                <Link href="/admin/disputes">
                    <Button variant={!searchParams.status ? 'default' : 'outline'}>
                        All
                    </Button>
                </Link>
                <Link href="/admin/disputes?status=PENDING">
                    <Button variant={searchParams.status === 'PENDING' ? 'default' : 'outline'}>
                        Pending
                    </Button>
                </Link>
                <Link href="/admin/disputes?status=IN_REVIEW">
                    <Button variant={searchParams.status === 'IN_REVIEW' ? 'default' : 'outline'}>
                        In Review
                    </Button>
                </Link>
                <Link href="/admin/disputes?status=RESOLVED">
                    <Button variant={searchParams.status === 'RESOLVED' ? 'default' : 'outline'}>
                        Resolved
                    </Button>
                </Link>
            </div>

            {/* Disputes List */}
            <div className="space-y-4">
                {disputes.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No disputes found</p>
                        </CardContent>
                    </Card>
                ) : (
                    disputes.map((dispute) => (
                        <Card key={dispute.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    dispute.status === 'PENDING'
                                                        ? 'secondary'
                                                        : dispute.status === 'IN_REVIEW'
                                                            ? 'default'
                                                            : 'outline'
                                                }
                                            >
                                                {dispute.status}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                #{dispute.id.slice(0, 8)}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold">{dispute.product.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {dispute.reason}
                                        </p>
                                        <div className="flex gap-4 text-sm">
                                            <span>
                                                <strong>Buyer:</strong> {dispute.order.user.name}
                                            </span>
                                            <span>
                                                <strong>Seller:</strong> {dispute.order.vendor.name}
                                            </span>
                                            <span>
                                                <strong>Order:</strong> #{dispute.orderId.slice(0, 8)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Created {new Date(dispute.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <Link href={`/admin/disputes/${dispute.id}`}>
                                        <Button>
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
