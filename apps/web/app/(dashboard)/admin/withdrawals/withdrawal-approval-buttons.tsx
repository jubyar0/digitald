'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/dashboard/ui/button';
import { approveWithdrawal, rejectWithdrawal } from '@/actions/withdrawals';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/dashboard/ui/alert-dialog';
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';

interface WithdrawalApprovalButtonsProps {
    withdrawalId: string;
    vendorName: string;
    amount: number;
    currency: string;
}

export function WithdrawalApprovalButtons({
    withdrawalId,
    vendorName,
    amount,
    currency,
}: WithdrawalApprovalButtonsProps) {
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/withdrawals/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ withdrawalId }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to approve withdrawal');
            }

            toast.success('Withdrawal approved successfully');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
            setShowApproveDialog(false);
        }
    };

    const handleReject = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/withdrawals/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ withdrawalId }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to reject withdrawal');
            }

            toast.success('Withdrawal rejected');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
            setShowRejectDialog(false);
        }
    };

    return (
        <>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowApproveDialog(true)}
                    disabled={isLoading}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isLoading}
                >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                </Button>
            </div>

            {/* Approve Dialog */}
            <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve Withdrawal Request?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to approve a withdrawal of <strong>{currency} {amount.toFixed(2)}</strong> for{' '}
                            <strong>{vendorName}</strong>.
                            <br />
                            <br />
                            This will deduct the amount from their escrow account and mark the withdrawal as completed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleApprove} disabled={isLoading}>
                            {isLoading ? 'Processing...' : 'Approve'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Dialog */}
            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Withdrawal Request?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to reject a withdrawal of <strong>{currency} {amount.toFixed(2)}</strong> for{' '}
                            <strong>{vendorName}</strong>.
                            <br />
                            <br />
                            The funds will remain in their escrow account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReject} disabled={isLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isLoading ? 'Processing...' : 'Reject'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
