'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Eye, Mail, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Application {
    id: string
    status: string
    personaStatus: string
    createdAt: Date
    submittedAt?: Date
    currentStep: number
    totalSteps: number
    vendor: {
        name: string
        user: {
            id: string
            name: string | null
            email: string
            image: string | null
        }
    }
    reviewer?: {
        name: string | null
    } | null
    steps: Array<{
        stepNumber: number
        stepName: string
        status: string
    }>
    _count: {
        applicationNotes: number
    }
}

interface Props {
    applications: Application[]
    pagination: {
        total: number
        page: number
        limit: number
        pages: number
    }
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    UNDER_REVIEW: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    NEEDS_REVISION: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    APPROVED: 'bg-green-500/10 text-green-500 border-green-500/20',
    REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
    CLOSED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

const personaStatusColors: Record<string, string> = {
    NOT_STARTED: 'bg-gray-500/10 text-gray-500',
    PENDING: 'bg-yellow-500/10 text-yellow-500',
    VERIFIED: 'bg-green-500/10 text-green-500',
    FAILED: 'bg-red-500/10 text-red-500',
    OVERRIDDEN: 'bg-purple-500/10 text-purple-500',
}

export default function ApplicationsList({ applications, pagination }: Props) {
    const router = useRouter()

    if (applications.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <User className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                    <p className="text-muted-foreground text-center">
                        There are no seller applications matching your filters.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Applications ({pagination.total})</CardTitle>
                    <CardDescription>
                        Showing {applications.length} of {pagination.total} applications
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Business Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Persona</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((app) => (
                                    <TableRow key={app.id} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={app.vendor.user.image || undefined} />
                                                    <AvatarFallback>
                                                        {app.vendor.user.name?.[0] || app.vendor.user.email[0].toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{app.vendor.user.name || 'No name'}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {app.vendor.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">{app.vendor.name}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={statusColors[app.status]}>
                                                {app.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={personaStatusColors[app.personaStatus]}>
                                                {app.personaStatus.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-primary h-full transition-all"
                                                        style={{
                                                            width: `${(app.currentStep / app.totalSteps) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {app.currentStep}/{app.totalSteps}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm">
                                                {app.submittedAt
                                                    ? format(new Date(app.submittedAt), 'MMM dd, yyyy')
                                                    : format(new Date(app.createdAt), 'MMM dd, yyyy')}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={`/admin/seller-applications/${app.id}`}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.pages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page === 1}
                            onClick={() => {
                                const params = new URLSearchParams(window.location.search)
                                params.set('page', String(pagination.page - 1))
                                router.push(`/admin/seller-applications?${params.toString()}`)
                            }}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page === pagination.pages}
                            onClick={() => {
                                const params = new URLSearchParams(window.location.search)
                                params.set('page', String(pagination.page + 1))
                                router.push(`/admin/seller-applications?${params.toString()}`)
                            }}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
