'use client'

import { Button } from '@/components/ui/button'
import { unbanUser } from '@/actions/admin'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function UnbanButton({ bannedUserId }: { bannedUserId: string }) {
    const router = useRouter()

    const handleUnban = async () => {
        try {
            await unbanUser(bannedUserId)
            toast.success('User unbanned successfully')
            router.refresh()
        } catch (error) {
            console.error('Failed to unban user:', error)
            toast.error('Failed to unban user')
        }
    }

    return (
        <Button variant="outline" size="sm" onClick={handleUnban}>
            Unban
        </Button>
    )
}
