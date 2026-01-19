'use client'

import { useState, useCallback, memo } from 'react'
import { Button } from '@/components/dashboard/ui/button'
import { Input } from '@/components/dashboard/ui/input'
import { Label } from '@/components/dashboard/ui/label'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

interface ProfileFormClientProps {
    initialName: string
    initialEmail: string
}

export const ProfileFormClient = memo(function ProfileFormClient({
    initialName,
    initialEmail
}: ProfileFormClientProps) {
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: initialName,
        email: initialEmail
    })

    const handleSave = useCallback(async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                toast.success('Profile updated successfully')
                // Refresh the page to show updated data
                window.location.reload()
            } else {
                const error = await response.json()
                toast.error(error.error || 'Failed to update profile')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }, [formData])

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, name: e.target.value }))
    }, [])

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, email: e.target.value }))
    }, [])

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="Enter your name"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                />
            </div>
            <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </>
                )}
            </Button>
        </div>
    )
})
