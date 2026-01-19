'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Building, Globe, Fingerprint } from 'lucide-react'
import { format } from 'date-fns'

export default function ApplicationOverview({ application }: { application: any }) {
    return (
        <div className="space-y-6">
            {/* User Information */}
            <Card>
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                            <p className="font-medium">{application.vendor.user.name || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                            <p className="font-medium">{application.vendor.user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Account Created</p>
                            <p className="font-medium">
                                {format(new Date(application.vendor.user.createdAt), 'MMM dd, yyyy')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">User ID</p>
                            <p className="font-medium font-mono text-xs">{application.vendor.user.id}</p>
                        </div>
                        {application.ipAddress && (
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">IP Address</p>
                                <p className="font-medium font-mono text-xs">{application.ipAddress}</p>
                            </div>
                        )}
                        {application.country && (
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Country</p>
                                <p className="font-medium">{application.country}</p>
                            </div>
                        )}
                    </div>

                    {application.vendor.user.bannedUsers && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-sm font-medium text-red-500">⚠️ This user has been banned</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Reason: {application.vendor.user.bannedUsers.reason}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Business Name</p>
                        <p className="font-medium text-lg">{application.vendor.name}</p>
                    </div>
                    {application.vendor.description && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Description</p>
                            <p className="text-sm">{application.vendor.description}</p>
                        </div>
                    )}
                    {application.notes && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Application Data</p>
                            <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-64">
                                {JSON.stringify(JSON.parse(application.notes), null, 2)}
                            </pre>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Application Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Application Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">Created</p>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(application.createdAt), 'PPpp')}
                            </p>
                        </div>
                    </div>

                    {application.submittedAt && (
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Submitted</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(application.submittedAt), 'PPpp')}
                                </p>
                            </div>
                        </div>
                    )}

                    {application.reviewedAt && (
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Reviewed</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(application.reviewedAt), 'PPpp')}
                                    {application.reviewer && ` by ${application.reviewer.name}`}
                                </p>
                            </div>
                        </div>
                    )}

                    {application.approvedAt && (
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-green-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-500">Approved</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(application.approvedAt), 'PPpp')}
                                </p>
                            </div>
                        </div>
                    )}

                    {application.rejectedAt && (
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-red-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-500">Rejected</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(application.rejectedAt), '  PPpp')}
                                </p>
                                {application.rejectionReason && (
                                    <p className="text-sm mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        {application.rejectionReason}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {application.revisionRequested && application.revisionReason && (
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-orange-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-orange-500">Revision Requested</p>
                                {application.revisionRequestedAt && (
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(application.revisionRequestedAt), 'PPpp')}
                                    </p>
                                )}
                                <p className="text-sm mt-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                    {application.revisionReason}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Vendor Stats (if approved) */}
            {application.status === 'APPROVED' && application.vendor.products && (
                <Card>
                    <CardHeader>
                        <CardTitle>Vendor Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                                <p className="text-2xl font-bold">{application.vendor.products.length}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                                <p className="text-2xl font-bold">{application.vendor.totalSales || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                                <p className="text-2xl font-bold">{application.vendor.orders?.length || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
