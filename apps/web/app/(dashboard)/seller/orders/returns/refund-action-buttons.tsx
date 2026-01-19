'use client'

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { updateRefundStatus } from "@/actions/refunds"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function RefundActionButtons({ refundId }: { refundId: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
        setIsLoading(true)
        const result = await updateRefundStatus(refundId, status)
        setIsLoading(false)

        if (result.success) {
            toast.success(`Refund ${status.toLowerCase()}`)
            router.refresh()
        } else {
            toast.error("Failed to update refund status")
        }
    }

    return (
        <div className="flex justify-end gap-2">
            <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleAction('APPROVED')}
                disabled={isLoading}
            >
                <Check className="h-4 w-4" />
            </Button>
            <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleAction('REJECTED')}
                disabled={isLoading}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}
