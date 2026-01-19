'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
    approveApplication,
    rejectApplication,
    requestRevision,
    reopenApplication,
    closeApplicationPermanently,
} from '@/actions/admin-vendor-applications'
import { Check, X, RotateCcw, Edit, XCircle, Lock } from 'lucide-react'
import { AlertTriangle } from 'lucide-react'

export default function AdminActionPanel({ application }: { application: any }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [approveDialogOpen, setApproveDialogOpen] = useState(false)
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [revisionDialogOpen, setRevisionDialogOpen] = useState(false)
    const [reopenDialogOpen, setReopenDialogOpen] = useState(false)
    const [closeDialogOpen, setCloseDialogOpen] = useState(false)

    const [reason, setReason] = useState('')
    const [notes, setNotes] = useState('')

    const handleApprove = () => {
        startTransition(async () => {
            const result = await approveApplication(application.id, notes || undefined)
            if (result.success) {
                toast.success(result.message)
                setApproveDialogOpen(false)
                setNotes('')
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleReject = () => {
        if (!reason.trim()) {
            toast.error('Please provide a rejection reason')
            return
        }
        startTransition(async () => {
            const result = await rejectApplication(application.id, reason, true)
            if (result.success) {
                toast.success(result.message)
                setRejectDialogOpen(false)
                setReason('')
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleRequestRevision = () => {
        if (!reason.trim()) {
            toast.error('Please provide a revision reason')
            return
        }
        startTransition(async () => {
            const result = await requestRevision(application.id, reason)
            if (result.success) {
                toast.success(result.message)
                setRevisionDialogOpen(false)
                setReason('')
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleReopen = () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for reopening')
            return
        }
        startTransition(async () => {
            const result = await reopenApplication(application.id, reason)
            if (result.success) {
                toast.success(result.message)
                setReopenDialogOpen(false)
                setReason('')
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleClose = () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for closing')
            return
        }
        startTransition(async () => {
            const result = await closeApplicationPermanently(application.id, reason)
            if (result.success) {
                toast.success(result.message)
                setCloseDialogOpen(false)
                setReason('')
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const canApprove = application.status !== 'APPROVED' && application.status !== 'CLOSED'
    const canReject = application.status !== 'APPROVED' && application.status !== 'CLOSED'
    const canRequestRevision = application.status !== 'APPROVED' && application.status !== 'CLOSED'
    const canReopen = application.status === 'REJECTED' || application.status === 'CLOSED'
    const canClose = application.status !== 'APPROVED'

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Admin Actions</CardTitle>
                    <CardDescription>Manage this application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {canApprove && (
                        <Button
                            className="w-full"
                            onClick={() => setApproveDialogOpen(true)}
                            disabled={isPending}
                        >
                            <Check className="h-4 w-4 mr-2" />
                            Approve Application
                        </Button>
                    )}

                    {canReject && (
                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => setRejectDialogOpen(true)}
                            disabled={isPending}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Reject Application
                        </Button>
                    )}

                    {canRequestRevision && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setRevisionDialogOpen(true)}
                            disabled={isPending}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Request Revision
                        </Button>
                    )}

                    {canReopen && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setReopenDialogOpen(true)}
                            disabled={isPending}
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reopen Application
                        </Button>
                    )}

                    {canClose && (
                        <Button
                            variant="outline"
                            className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => setCloseDialogOpen(true)}
                            disabled={isPending}
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            Close Permanently
                        </Button>
                    )}

                    {application.status === 'APPROVED' && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                            <Lock className="h-8 w-8 mx-auto mb-2 text-green-500" />
                            <p className="text-sm font-medium">Application Approved</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                This application has been approved and cannot be modified.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Approve Dialog */}
            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Application</DialogTitle>
                        <DialogDescription>
                            This will approve the seller application and grant vendor access.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="approve-notes">Admin Notes (Optional)</Label>
                            <Textarea
                                id="approve-notes"
                                placeholder="Add any internal notes about this approval..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleApprove} disabled={isPending}>
                            {isPending ? 'Approving...' : 'Approve'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejection. This will be shared with the applicant.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="reject-reason">Rejection Reason *</Label>
                            <Textarea
                                id="reject-reason"
                                placeholder="Explain why this application is being rejected..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject} disabled={isPending}>
                            {isPending ? 'Rejecting...' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Request Revision Dialog */}
            <Dialog open={revisionDialogOpen} onOpenChange={setRevisionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Revision</DialogTitle>
                        <DialogDescription>
                            Request changes to the application. The applicant will be notified.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="revision-reason">Revision Notes *</Label>
                            <Textarea
                                id="revision-reason"
                                placeholder="Explain what needs to be revised..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRevisionDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleRequestRevision} disabled={isPending}>
                            {isPending ? 'Requesting...' : 'Request Revision'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reopen Dialog */}
            <Dialog open={reopenDialogOpen} onOpenChange={setReopenDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reopen Application</DialogTitle>
                        <DialogDescription>
                            This will change the status to Under Review.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="reopen-reason">Reason for Reopening *</Label>
                            <Textarea
                                id="reopen-reason"
                                placeholder="Why is this application being reopened?"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReopenDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleReopen} disabled={isPending}>
                            {isPending ? 'Reopening...' : 'Reopen'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Close Dialog */}
            <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Close Application Permanently
                        </DialogTitle>
                        <DialogDescription>
                            This action will permanently close this application. This cannot be undone by regular admins.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="close-reason">Reason for Closure *</Label>
                            <Textarea
                                id="close-reason"
                                placeholder="Why is this application being closed permanently?"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleClose} disabled={isPending}>
                            {isPending ? 'Closing...' : 'Close Permanently'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
