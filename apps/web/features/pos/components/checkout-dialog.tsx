'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Banknote, CheckCircle2 } from "lucide-react"

interface CheckoutDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (method: 'CASH' | 'CARD', email?: string) => void
    total: number
    isProcessing: boolean
}

export function CheckoutDialog({ isOpen, onClose, onConfirm, total, isProcessing }: CheckoutDialogProps) {
    const [email, setEmail] = useState('')
    const [method, setMethod] = useState<'CASH' | 'CARD'>('CASH')

    const handleConfirm = () => {
        onConfirm(method, email)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Complete Payment</DialogTitle>
                    <DialogDescription>
                        Choose payment method for amount <span className="font-bold text-foreground">${total.toFixed(2)}</span>
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="cash" onValueChange={(v) => setMethod(v === 'cash' ? 'CASH' : 'CARD')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="cash">
                            <Banknote className="mr-2 h-4 w-4" />
                            Cash
                        </TabsTrigger>
                        <TabsTrigger value="card">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Card
                        </TabsTrigger>
                    </TabsList>
                    
                    <div className="py-6 space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Customer Email (Optional)</Label>
                            <Input
                                id="email"
                                placeholder="customer@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Receipt will be sent to this email
                            </p>
                        </div>

                        {method === 'CASH' && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                                <p className="text-green-800 font-medium">Collect Cash</p>
                                <p className="text-3xl font-bold text-green-900 mt-1">${total.toFixed(2)}</p>
                            </div>
                        )}

                        {method === 'CARD' && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                                <p className="text-blue-800 font-medium">Use External Terminal</p>
                                <p className="text-sm text-blue-600 mt-1">Charge card on your terminal and confirm here</p>
                            </div>
                        )}
                    </div>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : 'Confirm Payment'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
