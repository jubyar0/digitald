'use client'

import { useState } from 'react'
import { Button } from '@/components/dashboard/ui/button'
import { Input } from '@/components/dashboard/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/dashboard/ui/dialog'
import { updateStoreName } from '@/actions/seller'
import { Pencil, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ShopNameEditorProps {
    initialName: string | null
}

export function ShopNameEditor({ initialName }: ShopNameEditorProps) {
    const [name, setName] = useState(initialName || '')
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        if (!name.trim()) return

        setIsLoading(true)
        try {
            const result = await updateStoreName(name)
            if (result.success) {
                toast.success('Shop name updated successfully')
                setIsOpen(false)
            } else {
                toast.error('Failed to update shop name')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{initialName || 'Add Shop Name'}</h2>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <span className="sr-only">Edit</span>
                        <Pencil className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Shop Name</DialogTitle>
                        <DialogDescription>
                            Enter the name for your shop. This will be visible to your customers.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Awesome Shop"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
