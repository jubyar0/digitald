'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Mail, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    UNDER_REVIEW: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    NEEDS_REVISION: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    APPROVED: 'bg-green-500/10 text-green-500 border-green-500/20',
    REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
    CLOSED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

export default function ApplicationHeader({ application }: { application: any }) {
    return (
        <div className="space-y-4">
            <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/seller-applications">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Applications
                </Link>
            </Button>

            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={application.vendor.user.image || undefined} />
                            <AvatarFallback className="text-lg">
                                {application.vendor.user.name?.[0] ||
                                    application.vendor.user.email[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                            <div>
                                <h1 className="text-2xl font-bold">{application.vendor.name}</h1>
                                <p className="text-muted-foreground">{application.vendor.user.name}</p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    {application.vendor.user.email}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Applied {format(new Date(application.createdAt), 'MMM dd, yyyy')}
                                </div>
                                {application.country && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {application.country}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Badge variant="outline" className={statusColors[application.status]}>
                                    {application.status.replace('_', ' ')}
                                </Badge>
                                {application.personaStatus !== 'NOT_STARTED' && (
                                    <Badge variant="secondary">
                                        Persona: {application.personaStatus.replace('_', ' ')}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {application.reviewer && (
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Reviewed by</p>
                            <p className="font-medium">{application.reviewer.name}</p>
                            {application.reviewedAt && (
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(application.reviewedAt), 'MMM dd, yyyy')}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}
