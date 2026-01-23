'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TicketCard } from '@/components/tickets/ticket-card'
import { createTicket, getMyTickets } from '@/actions/tickets'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { TicketPriority } from '@repo/database'
import { Headphones, Send, Ticket, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SupportPage() {
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState<'submit' | 'tickets'>('submit')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [tickets, setTickets] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        category: '',
        priority: 'MEDIUM' as TicketPriority
    })

    const fetchTickets = async () => {
        if (!session?.user?.id) return

        setLoading(true)
        try {
            const result = await getMyTickets(session.user.id, 1, 20)
            if (result.success) {
                setTickets(result.data || [])
            }
        } catch (error) {
            toast.error('Failed to load tickets')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'tickets') {
            fetchTickets()
        }
    }, [activeTab, session?.user?.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!session?.user?.id) {
            toast.error('Please login to submit a ticket')
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
                toast.success('Ticket submitted successfully! Our team will respond soon.')
                setFormData({
                    subject: '',
                    description: '',
                    category: '',
                    priority: 'MEDIUM'
                })
                setActiveTab('tickets')
            } else {
                toast.error(result.error || 'Failed to submit ticket')
            }
        } catch (error) {
            toast.error('Failed to submit ticket')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                    <Headphones className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Support Center</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Need help? We&apos;re here for you! Submit a support ticket and our team will respond as soon as possible.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-8">
                <Button
                    variant={activeTab === 'submit' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('submit')}
                    className="gap-2"
                >
                    <Send className="h-4 w-4" />
                    Submit Ticket
                </Button>
                <Button
                    variant={activeTab === 'tickets' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('tickets')}
                    className="gap-2"
                >
                    <Ticket className="h-4 w-4" />
                    My Tickets
                </Button>
            </div>

            {/* Content */}
            {activeTab === 'submit' ? (
                <Card className="max-w-3xl mx-auto">
                    <CardContent className="p-8">
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
                                            <SelectItem value="Product Question">Product Question</SelectItem>
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

                            <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 mr-2" />
                                        Submit Ticket
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {!session?.user ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <p className="text-muted-foreground mb-4">Please login to view your tickets</p>
                                <Link href="/login">
                                    <Button>Login</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : loading ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                Loading your tickets...
                            </CardContent>
                        </Card>
                    ) : tickets.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center space-y-4">
                                <p className="text-muted-foreground">You haven&apos;t submitted any tickets yet</p>
                                <Button onClick={() => setActiveTab('submit')}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Submit Your First Ticket
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        tickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                viewPath="/support/tickets"
                                showUser={false}
                            />
                        ))
                    )}
                </div>
            )}

            {/* FAQ Section */}
            <div className="mt-16 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-2">How long does it take to get a response?</h3>
                            <p className="text-muted-foreground">
                                Our support team typically responds within 24 hours for standard tickets and within 4 hours for urgent tickets.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-2">Can I track my ticket status?</h3>
                            <p className="text-muted-foreground">
                                Yes! You can view all your tickets and their current status in the &quot;My Tickets&quot; tab. You&apos;ll also receive notifications when there are updates.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-2">What happens after I submit a ticket?</h3>
                            <p className="text-muted-foreground">
                                Once submitted, your ticket is assigned to our support team. You&apos;ll receive updates via notifications and can reply to messages directly from the ticket page.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
