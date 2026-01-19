'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { addTicketMessage, addInternalNote } from '@/actions/tickets'

interface TicketReplyFormProps {
    ticketId: string
    userId: string
    isAdmin?: boolean
    onMessageAdded?: () => void
}

export function TicketReplyForm({ ticketId, userId, isAdmin = false, onMessageAdded }: TicketReplyFormProps) {
    const [message, setMessage] = useState('')
    const [isInternal, setIsInternal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim()) {
            toast.error('Please enter a message')
            return
        }

        setIsSubmitting(true)

        try {
            const result = isInternal && isAdmin
                ? await addInternalNote(ticketId, userId, message)
                : await addTicketMessage(ticketId, userId, message, [], isInternal)

            if (result.success) {
                toast.success(isInternal ? 'Internal note added' : 'Message sent')
                setMessage('')
                setIsInternal(false)
                if (onMessageAdded) {
                    onMessageAdded()
                }
            } else {
                toast.error(result.error || 'Failed to send message')
            }
        } catch (error) {
            toast.error('Failed to send message')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Textarea
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            disabled={isSubmitting}
                            className="resize-none"
                        />
                    </div>

                    {isAdmin && (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="internal"
                                checked={isInternal}
                                onCheckedChange={(checked) => setIsInternal(checked as boolean)}
                                disabled={isSubmitting}
                            />
                            <Label htmlFor="internal" className="text-sm cursor-pointer">
                                Internal note (only visible to admins)
                            </Label>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
