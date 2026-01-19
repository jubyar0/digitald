'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { addAdminNote } from '@/actions/admin-vendor-applications'
import { format } from 'date-fns'
import { Lock, Unlock, User, MessageSquare } from 'lucide-react'

export default function ApplicationNotes({
    applicationId,
    notes,
}: {
    applicationId: string
    notes: any[]
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [noteContent, setNoteContent] = useState('')
    const [isUserFacing, setIsUserFacing] = useState(false)

    const handleAddNote = (userFacing: boolean) => {
        if (!noteContent.trim()) {
            toast.error('Please enter a note')
            return
        }

        startTransition(async () => {
            const result = await addAdminNote(applicationId, noteContent, userFacing)
            if (result.success) {
                toast.success(result.message)
                setNoteContent('')
                router.refresh()
            } else {
                toast.error(result.error)
            }
        })
    }

    const internalNotes = notes.filter((n) => n.type === 'ADMIN_INTERNAL')
    const userFacingNotes = notes.filter((n) => n.type === 'USER_FACING')
    const systemNotes = notes.filter((n) => n.type === 'SYSTEM')

    return (
        <div className="space-y-6">
            {/* Add Note Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Add Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="note-content">Note Content</Label>
                        <Textarea
                            id="note-content"
                            placeholder="Enter your note here..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleAddNote(false)}
                            disabled={isPending || !noteContent.trim()}
                            variant="outline"
                        >
                            <Lock className="h-4 w-4 mr-2" />
                            Add Internal Note
                        </Button>
                        <Button
                            onClick={() => handleAddNote(true)}
                            disabled={isPending || !noteContent.trim()}
                        >
                            <Unlock className="h-4 w-4 mr-2" />
                            Add User-Facing Note
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Internal notes are only visible to admins. User-facing notes will be shown to the applicant and trigger a notification.
                    </p>
                </CardContent>
            </Card>

            {/* Notes List */}
            <Card>
                <CardHeader>
                    <CardTitle>Notes History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all">All ({notes.length})</TabsTrigger>
                            <TabsTrigger value="internal">
                                Internal ({internalNotes.length})
                            </TabsTrigger>
                            <TabsTrigger value="user">
                                User-Facing ({userFacingNotes.length})
                            </TabsTrigger>
                            <TabsTrigger value="system">
                                System ({systemNotes.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-4">
                            <NotesList notes={notes} />
                        </TabsContent>

                        <TabsContent value="internal" className="mt-4">
                            <NotesList notes={internalNotes} />
                        </TabsContent>

                        <TabsContent value="user" className="mt-4">
                            <NotesList notes={userFacingNotes} />
                        </TabsContent>

                        <TabsContent value="system" className="mt-4">
                            <NotesList notes={systemNotes} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

function NotesList({ notes }: { notes: any[] }) {
    if (notes.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No notes yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {notes.map((note) => (
                <div
                    key={note.id}
                    className="flex gap-3 p-4 rounded-lg border bg-card"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={note.author?.image || undefined} />
                        <AvatarFallback>
                            {note.type === 'SYSTEM'
                                ? 'SYS'
                                : note.author?.name?.[0] || note.author?.email?.[0] || '?'}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="font-medium text-sm">
                                    {note.type === 'SYSTEM'
                                        ? 'System'
                                        : note.author?.name || note.author?.email || 'Unknown'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}
                                </p>
                            </div>
                            <Badge
                                variant={
                                    note.type === 'USER_FACING'
                                        ? 'default'
                                        : note.type === 'SYSTEM'
                                            ? 'secondary'
                                            : 'outline'
                                }
                            >
                                {note.type === 'ADMIN_INTERNAL' && <Lock className="h-3 w-3 mr-1" />}
                                {note.type === 'USER_FACING' && <Unlock className="h-3 w-3 mr-1" />}
                                {note.type.replace('_', ' ')}
                            </Badge>
                        </div>

                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
