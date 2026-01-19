'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/alert-dialog"
import { MoreVertical, Trash2, Edit, Star, Building, CreditCard, Wallet } from "lucide-react"
import { useState } from "react"
import { deletePayoutMethod, setDefaultPayoutMethod } from "@/actions/seller"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PayoutMethodCardProps {
    method: {
        id: string
        type: string
        label: string
        details: any
        isDefault: boolean
    }
    onEdit: (method: any) => void
}

export function PayoutMethodCard({ method, onEdit }: PayoutMethodCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSettingDefault, setIsSettingDefault] = useState(false)
    const router = useRouter()

    const getIcon = () => {
        switch (method.type) {
            case 'PAYPAL':
                return <CreditCard className="h-5 w-5" />
            case 'BANK_TRANSFER':
                return <Building className="h-5 w-5" />
            case 'CRYPTO':
                return <Wallet className="h-5 w-5" />
            case 'STRIPE':
                return <CreditCard className="h-5 w-5" />
            default:
                return <CreditCard className="h-5 w-5" />
        }
    }

    const getDetailsPreview = () => {
        const details = method.details as any
        switch (method.type) {
            case 'PAYPAL':
                return details.email
            case 'BANK_TRANSFER':
                return `****${details.accountNumber?.slice(-4)}`
            case 'CRYPTO':
                return `${details.chain}: ${details.address?.slice(0, 6)}...${details.address?.slice(-4)}`
            default:
                return 'Details hidden'
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deletePayoutMethod(method.id)
            if (result.success) {
                toast.success("Payout method deleted")
                router.refresh()
            } else {
                toast.error(result.error || "Failed to delete method")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleSetDefault = async () => {
        setIsSettingDefault(true)
        try {
            const result = await setDefaultPayoutMethod(method.id)
            if (result.success) {
                toast.success("Default payment method updated")
                router.refresh()
            } else {
                toast.error(result.error || "Failed to update default method")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsSettingDefault(false)
        }
    }

    return (
        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {getIcon()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-medium">{method.label}</h4>
                            {method.isDefault && (
                                <Badge variant="secondary" className="text-xs">
                                    Default
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {method.type.replace('_', ' ')} • {getDetailsPreview()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!method.isDefault && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSetDefault}
                            disabled={isSettingDefault}
                            className="hidden sm:flex"
                        >
                            <Star className="h-4 w-4 mr-2" />
                            Set Default
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(method)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            {!method.isDefault && (
                                <DropdownMenuItem onClick={handleSetDefault}>
                                    <Star className="h-4 w-4 mr-2" />
                                    Set Default
                                </DropdownMenuItem>
                            )}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Payout Method?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this payout method? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}
