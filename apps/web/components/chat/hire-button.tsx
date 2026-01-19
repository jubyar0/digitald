'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Briefcase, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createJobOffer } from '@/actions/jobs'

interface HireButtonProps {
    conversationId: string
    vendorId: string
    vendorName: string
}

export function HireButton({ conversationId, vendorId, vendorName }: HireButtonProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: ''
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!formData.title || !formData.description || !formData.budget) {
            toast.error('Please fill in all fields')
            return
        }

        const budget = parseFloat(formData.budget)
        if (isNaN(budget) || budget <= 0) {
            toast.error('Please enter a valid budget')
            return
        }

        setLoading(true)
        try {
            const result = await createJobOffer({
                conversationId,
                vendorId,
                title: formData.title,
                description: formData.description,
                budget
            })

            if (result.success) {
                toast.success('Job offer sent!')
                setOpen(false)
                setFormData({ title: '', description: '', budget: '' })
            } else {
                toast.error(result.error || 'Failed to send job offer')
            }
        } catch (error) {
            toast.error('Failed to send job offer')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Hire
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Hire {vendorName}</DialogTitle>
                        <DialogDescription>
                            Send a job offer to {vendorName}. They will be able to accept or reject it.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., 3D Character Model"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the job requirements..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="budget">Budget (USD)</Label>
                            <Input
                                id="budget"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                'Send Offer'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
