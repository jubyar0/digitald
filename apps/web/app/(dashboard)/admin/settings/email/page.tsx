'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { getSettings, updateSetting } from '@/actions/admin'
import { toast } from 'sonner'
import { Loader2Icon, SaveIcon, MailIcon } from 'lucide-react'

export default function EmailSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [smtpHost, setSmtpHost] = useState('')
    const [smtpPort, setSmtpPort] = useState('587')
    const [smtpUsername, setSmtpUsername] = useState('')
    const [smtpPassword, setSmtpPassword] = useState('')
    const [emailFrom, setEmailFrom] = useState('')
    const [emailFromName, setEmailFromName] = useState('')
    const [emailEnabled, setEmailEnabled] = useState(true)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const result = await getSettings('email')
            if (result.data) {
                result.data.forEach((setting: any) => {
                    switch (setting.key) {
                        case 'smtp_host':
                            setSmtpHost(setting.value)
                            break
                        case 'smtp_port':
                            setSmtpPort(setting.value)
                            break
                        case 'smtp_username':
                            setSmtpUsername(setting.value)
                            break
                        case 'smtp_password':
                            setSmtpPassword(setting.value)
                            break
                        case 'email_from':
                            setEmailFrom(setting.value)
                            break
                        case 'email_from_name':
                            setEmailFromName(setting.value)
                            break
                        case 'email_enabled':
                            setEmailEnabled(setting.value === 'true')
                            break
                    }
                })
            }
        } catch (error) {
            toast.error('Failed to load email settings')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await Promise.all([
                updateSetting('smtp_host', smtpHost),
                updateSetting('smtp_port', smtpPort),
                updateSetting('smtp_username', smtpUsername),
                updateSetting('smtp_password', smtpPassword),
                updateSetting('email_from', emailFrom),
                updateSetting('email_from_name', emailFromName),
                updateSetting('email_enabled', emailEnabled.toString()),
            ])
            toast.success('Email settings saved successfully')
        } catch (error) {
            toast.error('Failed to save email settings')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-1 flex-col container mx-auto">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-8 dashboard-padding">
                        <div className="flex items-center justify-center h-64">
                            <Loader2Icon className="h-8 w-8 animate-spin" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Email Settings</h3>
                            <p className="dashboard-card-description">
                                Configure SMTP and email templates
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {/* Email Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Email Notifications</CardTitle>
                                <CardDescription>
                                    Enable or disable email notifications
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="emailEnabled">Enable Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Send automated emails to users
                                        </p>
                                    </div>
                                    <Switch
                                        id="emailEnabled"
                                        checked={emailEnabled}
                                        onCheckedChange={setEmailEnabled}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* SMTP Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>SMTP Configuration</CardTitle>
                                <CardDescription>
                                    Configure your SMTP server settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="smtpHost">SMTP Host</Label>
                                        <Input
                                            id="smtpHost"
                                            placeholder="smtp.example.com"
                                            value={smtpHost}
                                            onChange={(e) => setSmtpHost(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="smtpPort">SMTP Port</Label>
                                        <Input
                                            id="smtpPort"
                                            type="number"
                                            placeholder="587"
                                            value={smtpPort}
                                            onChange={(e) => setSmtpPort(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="smtpUsername">SMTP Username</Label>
                                        <Input
                                            id="smtpUsername"
                                            placeholder="username@example.com"
                                            value={smtpUsername}
                                            onChange={(e) => setSmtpUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                                        <Input
                                            id="smtpPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={smtpPassword}
                                            onChange={(e) => setSmtpPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Email From Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sender Information</CardTitle>
                                <CardDescription>
                                    Configure the default sender email and name
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="emailFrom">From Email Address</Label>
                                        <Input
                                            id="emailFrom"
                                            type="email"
                                            placeholder="noreply@example.com"
                                            value={emailFrom}
                                            onChange={(e) => setEmailFrom(e.target.value)}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            The email address that appears in the &quot;From&quot; field
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="emailFromName">From Name</Label>
                                        <Input
                                            id="emailFromName"
                                            placeholder="Your Platform Name"
                                            value={emailFromName}
                                            onChange={(e) => setEmailFromName(e.target.value)}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            The name that appears in the &quot;From&quot; field
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <div className="flex justify-end gap-2">
                            <Button onClick={handleSave} disabled={saving} size="lg">
                                {saving ? (
                                    <>
                                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <SaveIcon className="mr-2 h-4 w-4" />
                                        Save Settings
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
