'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Check, X, Loader2, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { acceptJobOffer, rejectJobOffer } from '@/actions/jobs'
import { cn } from '@/lib/utils'

interface JobOfferMessageProps {
    jobOfferId: string
    title: string
    description: string
    budget: number
    currency?: string
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
    isVendor: boolean // Is current user the vendor receiving the offer
    createdAt: string
}

export function JobOfferMessage({
    jobOfferId,
    title,
    description,
    budget,
    currency = 'USD',
    status,
    isVendor,
    createdAt
}: JobOfferMessageProps) {
    const [loading, setLoading] = useState(false)
    const [currentStatus, setCurrentStatus] = useState(status)

    const handleAccept = async () => {
        setLoading(true)
        try {
            const result = await acceptJobOffer(jobOfferId)
            if (result.success) {
                setCurrentStatus('ACCEPTED')
                toast.success('Job offer accepted!')
            } else {
                toast.error(result.error || 'Failed to accept job offer')
            }
        } catch (error) {
            toast.error('Failed to accept job offer')
        } finally {
            setLoading(false)
        }
    }

    const handleReject = async () => {
        setLoading(true)
        try {
            const result = await rejectJobOffer(jobOfferId)
            if (result.success) {
                setCurrentStatus('REJECTED')
                toast.success('Job offer rejected')
            } else {
                toast.error(result.error || 'Failed to reject job offer')
            }
        } catch (error) {
            toast.error('Failed to reject job offer')
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = () => {
        const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
            PENDING: { variant: 'secondary', label: 'Pending' },
            ACCEPTED: { variant: 'default', label: 'Accepted' },
            REJECTED: { variant: 'destructive', label: 'Rejected' },
            COMPLETED: { variant: 'outline', label: 'Completed' },
            CANCELLED: { variant: 'outline', label: 'Cancelled' }
        }
        const config = variants[currentStatus] || variants.PENDING
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    const showActions = isVendor && currentStatus === 'PENDING'

    return (
        <Card className={cn(
            "p-4 max-w-md border-2",
            currentStatus === 'ACCEPTED' && "border-green-500/50 bg-green-50/50 dark:bg-green-950/20",
            currentStatus === 'REJECTED' && "border-red-500/50 bg-red-50/50 dark:bg-red-950/20",
            currentStatus === 'PENDING' && "border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20"
        )}>
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Briefcase className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Job Offer</p>
                            <h4 className="font-semibold text-sm">{title}</h4>
                        </div>
                    </div>
                    {getStatusBadge()}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {description}
                </p>

                {/* Budget */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-bold text-sm">
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: currency
                            }).format(budget)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                {showActions && (
                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={handleAccept}
                            disabled={loading}
                            className="flex-1"
                            size="sm"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-1" />
                                    Accept
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={handleReject}
                            disabled={loading}
                            variant="outline"
                            className="flex-1"
                            size="sm"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {/* Timestamp */}
                <p className="text-xs text-muted-foreground">
                    {new Date(createdAt).toLocaleString()}
                </p>
            </div>
        </Card>
    )
}
