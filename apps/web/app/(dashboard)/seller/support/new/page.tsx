'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { Input } from '@/components/dashboard/ui/input'
import { Label } from '@/components/dashboard/ui/label'
import { Textarea } from '@/components/dashboard/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/dashboard/ui/select'
import { createTicket } from '@/actions/tickets'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import Link from 'next/link'
import { TicketPriority } from '@repo/database'

export default function NewTicketPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        category: '',
        priority: 'MEDIUM' as TicketPriority
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!session?.user?.id) {
            toast.error('You must be logged in')
            return
        }

        if (!formData.subject || !formData.description || !formData.category) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)

        try {
            const result = await createTicket(
                session.user.id,
                formData.subject,
                formData.description,
                formData.category,
                formData.priority
            )

            if (result.success) {
                toast.success('Ticket created successfully')
                router.push('/seller/support')
            } else {
                toast.error(result.error || 'Failed to create ticket')
            }
        } catch (error) {
            toast.error('Failed to create ticket')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-6 dashboard-padding max-w-3xl mx-auto w-full">
                    {/* Back Button */}
                    <Link href="/seller/support">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Tickets
                        </Button>
                    </Link>

                    {/* Header */}
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Create Support Ticket</h3>
                            <p className="dashboard-card-description">
                                Submit a support request and our team will respond as soon as possible
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <Card>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject *</Label>
                                    <Input
                                        id="subject"
                                        placeholder="Brief description of your issue"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category *</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                                            disabled={isSubmitting}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                                                <SelectItem value="Billing">Billing</SelectItem>
                                                <SelectItem value="Account">Account</SelectItem>
                                                <SelectItem value="Product Upload">Product Upload</SelectItem>
                                                <SelectItem value="Payment">Payment</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select
                                            value={formData.priority}
                                            onValueChange={(value) => setFormData({ ...formData, priority: value as TicketPriority })}
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LOW">Low</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="URGENT">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Please provide details about your issue..."
                                        rows={8}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        disabled={isSubmitting}
                                        required
                                        className="resize-none"
                                    />
                                </div>

                                <div className="flex gap-2 justify-end">
                                    <Link href="/seller/support">
                                        <Button type="button" variant="outline" disabled={isSubmitting}>
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Create Ticket
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
