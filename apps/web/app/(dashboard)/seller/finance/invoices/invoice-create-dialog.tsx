'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/dashboard/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/dashboard/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/dashboard/ui/select'
import { Label } from '@/components/dashboard/ui/label'
import { PlusIcon } from 'lucide-react'
import { getOrdersWithoutInvoices, createInvoice } from '@/actions/seller'
import { toast } from 'sonner'

interface Order {
    id: string
    customer: string
    totalAmount: number
    createdAt: Date
}

export function InvoiceCreateDialog() {
    const [open, setOpen] = useState(false)
    const [orders, setOrders] = useState<Order[]>([])
    const [selectedOrderId, setSelectedOrderId] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false)

    // Load orders when dialog opens
    useEffect(() => {
        if (open) {
            loadOrders()
        }
    }, [open])

    const loadOrders = async () => {
        setLoading(true)
        try {
            const data = await getOrdersWithoutInvoices()
            setOrders(data)
        } catch (error) {
            toast.error('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateInvoice = async () => {
        if (!selectedOrderId) {
            toast.error('Please select an order')
            return
        }

        setCreating(true)
        try {
            const result = await createInvoice(selectedOrderId)

            if (result.success) {
                toast.success('Invoice created successfully')
                setOpen(false)
                setSelectedOrderId('')
                // Refresh the page to show the new invoice
                window.location.reload()
            } else {
                toast.error(result.error || 'Failed to create invoice')
            }
        } catch (error) {
            toast.error('Failed to create invoice')
        } finally {
            setCreating(false)
        }
    }

    const selectedOrder = orders.find(o => o.id === selectedOrderId)
    const taxRate = 0 // Default tax rate, will be calculated from vendor settings in backend
    const tax = selectedOrder ? selectedOrder.totalAmount * (taxRate / 100) : 0
    const total = selectedOrder ? selectedOrder.totalAmount + tax : 0

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="btn-primary">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create Invoice
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Invoice</DialogTitle>
                    <DialogDescription>
                        Select an order to create an invoice for
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="order">Order</Label>
                        <Select
                            value={selectedOrderId}
                            onValueChange={setSelectedOrderId}
                            disabled={loading || creating}
                        >
                            <SelectTrigger id="order">
                                <SelectValue placeholder={loading ? "Loading orders..." : "Select an order"} />
                            </SelectTrigger>
                            <SelectContent>
                                {orders.length === 0 && !loading && (
                                    <div className="p-2 text-sm text-muted-foreground">
                                        No orders available for invoicing
                                    </div>
                                )}
                                {orders.map((order) => (
                                    <SelectItem key={order.id} value={order.id}>
                                        {order.customer} - ${order.totalAmount.toFixed(2)} ({new Date(order.createdAt).toLocaleDateString()})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedOrder && (
                        <div className="rounded-lg border p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Customer:</span>
                                <span className="font-medium">{selectedOrder.customer}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Order Date:</span>
                                <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Amount:</span>
                                    <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax:</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={creating}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateInvoice}
                        disabled={!selectedOrderId || creating}
                    >
                        {creating ? 'Creating...' : 'Create Invoice'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
