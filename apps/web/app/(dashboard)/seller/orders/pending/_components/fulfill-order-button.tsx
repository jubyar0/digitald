"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateOrderStatus } from "@/actions/seller"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"

interface FulfillOrderButtonProps {
    orderId: string
}

export function FulfillOrderButton({ orderId }: FulfillOrderButtonProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleFulfill = async () => {
        setIsLoading(true)
        try {
            const result = await updateOrderStatus(orderId, "COMPLETED")
            if (result.success) {
                toast.success("Order marked as fulfilled")
                router.refresh()
            } else {
                toast.error(result.error || "Failed to update order")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            size="sm"
            onClick={handleFulfill}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
                <CheckCircle className="h-4 w-4 mr-1" />
            )}
            Fulfill
        </Button>
    )
}
