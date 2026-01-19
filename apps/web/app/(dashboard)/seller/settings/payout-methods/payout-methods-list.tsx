'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PayoutMethodCard } from "./payout-method-card"
import { PayoutMethodForm } from "./payout-method-form"

interface PayoutMethodsListProps {
    initialMethods: any[]
}

export function PayoutMethodsList({ initialMethods }: PayoutMethodsListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingMethod, setEditingMethod] = useState<any>(null)

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Payout Method
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add Payout Method</DialogTitle>
                            <DialogDescription>
                                Add a new payment method to receive your earnings.
                            </DialogDescription>
                        </DialogHeader>
                        <PayoutMethodForm
                            onSuccess={() => setIsAddOpen(false)}
                            onCancel={() => setIsAddOpen(false)}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={!!editingMethod} onOpenChange={(open) => !open && setEditingMethod(null)}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Edit Payout Method</DialogTitle>
                            <DialogDescription>
                                Update your payment method details.
                            </DialogDescription>
                        </DialogHeader>
                        {editingMethod && (
                            <PayoutMethodForm
                                method={editingMethod}
                                onSuccess={() => setEditingMethod(null)}
                                onCancel={() => setEditingMethod(null)}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {initialMethods.length === 0 ? (
                <Card>
                    <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No payout methods yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            Add a payment method to start withdrawing your earnings. You can add PayPal, bank accounts, or crypto wallets.
                        </p>
                        <Button onClick={() => setIsAddOpen(true)}>
                            Add Your First Method
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {initialMethods.map((method) => (
                        <PayoutMethodCard
                            key={method.id}
                            method={method}
                            onEdit={setEditingMethod}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
