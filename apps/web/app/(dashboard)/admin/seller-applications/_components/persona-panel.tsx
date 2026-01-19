'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    initiatePersonaVerification,
    retryPersonaVerification,
    overridePersonaVerification,
} from '@/actions/persona-verification'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    Play,
    RotateCcw,
    ShieldCheck,
} from 'lucide-react'

const personaStatusConfig = {
    NOT_STARTED: {
        icon: Clock,
        color: 'text-gray-500',
        bgColor: 'bg-gray-500/10',
        label: 'Not Started',
    },
    PENDING: {
        icon: Clock,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        label: 'Pending',
    },
    UNDER_REVIEW: {
        icon: Clock,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        label: 'Under Review',
    },
    VERIFIED: {
        icon: CheckCircle2,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        label: 'Verified',
    },
    FAILED: {
        icon: XCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        label: 'Failed',
    },
    OVERRIDDEN: {
        icon: ShieldCheck,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        label: 'Admin Override',
    },
}

export default function PersonaPanel({
    applicationId,
    application,
}: {
    applicationId: string
    application: any
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [overrideDialogOpen, setOverrideDialogOpen] = useState(false)
    const [overrideReason, setOverrideReason] = useState('')
    const [overrideApprove, setOverrideApprove] = useState(true)

    const config =
        personaStatusConfig[application.personaStatus as keyof typeof personaStatusConfig] ||
        personaStatusConfig.NOT_STARTED
    const Icon = config.icon

    const handleInitiate = () => {
        startTransition(async () => {
            const result = await initiatePersonaVerification(applicationId)
            if (result.success) {
                toast.success('Persona verification initiated')
                router.refresh()
            } else {
                toast.error(result.error || 'Failed to initiate verification')
            }
        })
    }

    const handleRetry = () => {
        startTransition(async () => {
            const result = await retryPersonaVerification(applicationId)
            if (result.success) {
                toast.success('Persona verification retry initiated')
                router.refresh()
            } else {
                toast.error(result.error || 'Failed to retry verification')
            }
        })
    }

    const handleOverride = () => {
        if (!overrideReason.trim()) {
            toast.error('Please provide a reason for override')
            return
        }

        startTransition(async () => {
            const result = await overridePersonaVerification(
                applicationId,
                overrideReason,
                overrideApprove
            )
            if (result.success) {
                toast.success(result.message)
                setOverrideDialogOpen(false)
                setOverrideReason('')
                router.refresh()
            } else {
                toast.error(result.error || 'Failed to override verification')
            }
        })
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${config.color}`} />
                        Persona Verification
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Status Display */}
                    <div className={`p-4 rounded-lg ${config.bgColor} border`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Status</span>
                            <Badge variant="outline" className={config.color}>
                                {config.label}
                            </Badge>
                        </div>

                        {application.personaVerifiedAt && (
                            <p className="text-sm text-muted-foreground">
                                Verified on {format(new Date(application.personaVerifiedAt), 'MMM dd, yyyy')}
                            </p>
                        )}

                        {application.personaOverridden && (
                            <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                <p className="text-sm font-medium text-purple-500 mb-1">
                                    Admin Override Active
                                </p>
                                {application.personaOverrideReason && (
                                    <p className="text-sm text-muted-foreground">
                                        {application.personaOverrideReason}
                                    </p>
                                )}
                                {application.personaOverriddenAt && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        on {format(new Date(application.personaOverriddenAt), 'PPp')}
                                        {application.personaOverriddenByUser && (
                                            <> by {application.personaOverriddenByUser.name}</>
                                        )}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Persona Verification Details */}
                    {application.personaVerification && (
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Inquiry ID:</span>
                                <p className="font-mono text-xs mt-1">
                                    {application.personaVerification.inquiryId}
                                </p>
                            </div>

                            {application.personaVerification.verificationUrl && (
                                <div>
                                    <span className="text-muted-foreground">Verification URL:</span>
                                    <a
                                        href={application.personaVerification.verificationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline block text-xs mt-1"
                                    >
                                        {application.personaVerification.verificationUrl}
                                    </a>
                                </div>
                            )}

                            {application.personaVerification.failureReason && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <span className="text-red-500 font-medium">Failure Reason:</span>
                                    <p className="text-sm mt-1">{application.personaVerification.failureReason}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2 pt-4 border-t">
                        {application.personaStatus === 'NOT_STARTED' && (
                            <Button
                                className="w-full"
                                onClick={handleInitiate}
                                disabled={isPending}
                            >
                                <Play className="h-4 w-4 mr-2" />
                                Initiate Verification
                            </Button>
                        )}

                        {(application.personaStatus === 'FAILED' ||
                            application.personaStatus === 'PENDING') && (
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={handleRetry}
                                    disabled={isPending}
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Retry Verification
                                </Button>
                            )}

                        {application.personaStatus !== 'NOT_STARTED' &&
                            !application.personaOverridden && (
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => setOverrideDialogOpen(true)}
                                    disabled={isPending}
                                >
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Admin Override
                                </Button>
                            )}

                        <p className="text-xs text-muted-foreground text-center">
                            {application.personaStatus === 'NOT_STARTED'
                                ? 'Initiate Persona verification to verify the applicant\'s identity'
                                : 'Manage Persona verification status'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Override Dialog */}
            <Dialog open={overrideDialogOpen} onOpenChange={setOverrideDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Admin Override - Persona Verification</DialogTitle>
                        <DialogDescription>
                            This will bypass the Persona verification requirement. Only use this for exceptional cases.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Button
                                variant={overrideApprove ? 'default' : 'outline'}
                                onClick={() => setOverrideApprove(true)}
                                className="flex-1"
                            >
                                Approve
                            </Button>
                            <Button
                                variant={!overrideApprove ? 'destructive' : 'outline'}
                                onClick={() => setOverrideApprove(false)}
                                className="flex-1"
                            >
                                Reject
                            </Button>
                        </div>

                        <div>
                            <Label htmlFor="override-reason">Reason for Override *</Label>
                            <Textarea
                                id="override-reason"
                                placeholder="Explain why you are overriding Persona verification..."
                                value={overrideReason}
                                onChange={(e) => setOverrideReason(e.target.value)}
                                rows={4}
                                required
                            />
                        </div>

                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                                This action requires Super Admin permissions and will be logged in the audit trail.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOverrideDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleOverride} disabled={isPending || !overrideReason.trim()}>
                            {isPending ? 'Processing...' : 'Confirm Override'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
