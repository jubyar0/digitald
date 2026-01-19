'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/dashboard/ui/button';
import { Input } from '@/components/dashboard/ui/input';
import { Label } from '@/components/dashboard/ui/label';
import { Textarea } from '@/components/dashboard/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/dashboard/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/dashboard/ui/select';
import { toast } from 'sonner';
import { Plus, Minus, Clock, RefreshCw } from 'lucide-react';
import { adjustEscrowBalance } from '@/actions/escrow';

interface AdjustBalanceDialogProps {
    vendorId: string;
    vendorName: string;
    currentBalance: number;
}

export function AdjustBalanceDialog({
    vendorId,
    vendorName,
    currentBalance,
}: AdjustBalanceDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [type, setType] = useState<'ADD' | 'SUBTRACT' | 'HOLD' | 'UNHOLD'>('ADD');
    const router = useRouter();

    const handleSubmit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (!reason.trim()) {
            toast.error('Please provide a reason for this adjustment');
            return;
        }

        setIsLoading(true);
        try {
            const result = await adjustEscrowBalance({
                vendorId,
                amount: parseFloat(amount),
                reason: reason.trim(),
                type,
            });

            if (result.success) {
                toast.success(`Balance ${type === 'ADD' ? 'added' : 'subtracted'} successfully`);
                setOpen(false);
                setAmount('');
                setReason('');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to adjust balance');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adjust Balance
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adjust Escrow Balance</DialogTitle>
                    <DialogDescription>
                        Manually adjust the escrow balance for {vendorName}.
                        Current balance: ${currentBalance.toFixed(2)}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="type">Adjustment Type</Label>
                        <Select
                            value={type}
                            onValueChange={(value: 'ADD' | 'SUBTRACT' | 'HOLD' | 'UNHOLD') => setType(value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADD">
                                    <span className="flex items-center gap-2">
                                        <Plus className="h-4 w-4 text-green-600" />
                                        Add Balance
                                    </span>
                                </SelectItem>
                                <SelectItem value="SUBTRACT">
                                    <span className="flex items-center gap-2">
                                        <Minus className="h-4 w-4 text-red-600" />
                                        Subtract Balance (Refund/Correction)
                                    </span>
                                </SelectItem>
                                <SelectItem value="HOLD">
                                    <span className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                        Hold Funds (Freeze)
                                    </span>
                                </SelectItem>
                                <SelectItem value="UNHOLD">
                                    <span className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 text-blue-600" />
                                        Release Held Funds (Unhold)
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (USD)</Label>
                        <Input
                            id="amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                            id="reason"
                            placeholder="Provide a reason for this adjustment..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        variant={type === 'SUBTRACT' ? 'destructive' : 'secondary'}
                    >
                        {isLoading ? 'Processing...' :
                            type === 'ADD' ? 'Add Balance' :
                                type === 'SUBTRACT' ? 'Subtract Balance' :
                                    type === 'HOLD' ? 'Hold Funds' :
                                        'Release Funds'
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}
