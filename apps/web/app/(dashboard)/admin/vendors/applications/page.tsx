'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { Badge } from '@/components/dashboard/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/dashboard/ui/table'
import { getVendorApplications, approveVendorApplication, rejectVendorApplication } from '@/actions/admin'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

interface VendorApplication {
    id: string
    status: string
    createdAt: Date
    vendor: {
        name: string
        user: {
            name: string | null
            email: string
        }
    }
    reviewer: {
        name: string | null
    } | null
}

export default function VendorApplicationsPage() {
    const { data: session } = useSession()
    const [applications, setApplications] = useState<VendorApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10

    const fetchApplications = async () => {
        setLoading(true)
        try {
            const result = await getVendorApplications(page, pageSize)
            setApplications(result.data as any)
            setTotal(result.total)
        } catch (error) {
            console.error('Failed to fetch applications:', error)
            toast.error('Failed to load applications')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [page])

    const handleApprove = async (id: string) => {
        if (!session?.user?.id) return
        try {
            await approveVendorApplication(id, session.user.id)
            toast.success('Application approved')
            fetchApplications()
        } catch (error) {
            toast.error('Failed to approve application')
        }
    }

    const handleReject = async (id: string) => {
        if (!session?.user?.id) return
        try {
            await rejectVendorApplication(id, session.user.id, 'Application rejected by admin')
            toast.success('Application rejected')
            fetchApplications()
        } catch (error) {
            toast.error('Failed to reject application')
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <Badge variant="default">Approved</Badge>
            case 'REJECTED':
                return <Badge variant="destructive">Rejected</Badge>
            default:
                return <Badge variant="secondary">Pending</Badge>
        }
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Vendor Applications</h3>
                            <p className="dashboard-card-description">
                                Review and manage vendor applications
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vendor Name</TableHead>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Applied</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                Loading...
                                            </TableCell>
                                        </TableRow>
                                    ) : applications.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No applications found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        applications.map((app) => (
                                            <TableRow key={app.id}>
                                                <TableCell className="font-medium">{app.vendor.name}</TableCell>
                                                <TableCell>{app.vendor.user.name || 'N/A'}</TableCell>
                                                <TableCell>{app.vendor.user.email}</TableCell>
                                                <TableCell>{getStatusBadge(app.status)}</TableCell>
                                                <TableCell>
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {app.status === 'PENDING' && (
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleApprove(app.id)}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleReject(app.id)}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    )}
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
                            Showing {applications.length} of {total} applications
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page * pageSize >= total}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
