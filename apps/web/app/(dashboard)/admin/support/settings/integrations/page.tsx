'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { getSocialIntegrations, updateSocialIntegration } from '@/actions/chatbot-settings'
import { toast } from 'sonner'
import { Globe, MessageCircle, Instagram, Save, ExternalLink } from 'lucide-react'

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)

    useEffect(() => {
        const fetchIntegrations = async () => {
            try {
                const result = await getSocialIntegrations()
                if (result.success) {
                    // Ensure we have entries for all platforms
                    const platforms = ['whatsapp', 'instagram', 'facebook', 'twitter', 'telegram']
                    const existing = result.data || []
                    const all = platforms.map(p => {
                        const found = existing.find((i: any) => i.platform === p)
                        return found || { platform: p, isEnabled: false }
                    })
                    setIntegrations(all)
                }
            } catch (error) {
                toast.error('Failed to load integrations')
            } finally {
                setLoading(false)
            }
        }
        fetchIntegrations()
    }, [])

    const handleToggle = async (platform: string, enabled: boolean) => {
        setSaving(platform)
        try {
            const result = await updateSocialIntegration(platform, { isEnabled: enabled })
            if (result.success) {
                setIntegrations(prev =>
                    prev.map(i => i.platform === platform ? { ...i, isEnabled: enabled } : i)
                )
                toast.success(`${platform} ${enabled ? 'enabled' : 'disabled'}`)
            }
        } catch (error) {
            toast.error('Failed to update integration')
        } finally {
            setSaving(null)
        }
    }

    const handleSave = async (platform: string, data: any) => {
        setSaving(platform)
        try {
            const result = await updateSocialIntegration(platform, data)
            if (result.success) {
                toast.success('Settings saved successfully')
            }
        } catch (error) {
            toast.error('Failed to save settings')
        } finally {
            setSaving(null)
        }
    }

    const getIntegration = (platform: string) => {
        return integrations.find(i => i.platform === platform) || { platform, isEnabled: false }
    }

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>
    }

    return (
        <div className="flex flex-col container mx-auto p-4 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Globe className="h-6 w-6 text-green-500" />
                    Social Integrations
                </h1>
                <p className="text-muted-foreground">
                    Connect your social channels to receive messages
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* WhatsApp */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                    <MessageCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">WhatsApp</CardTitle>
                                    <CardDescription>Business API Integration</CardDescription>
                                </div>
                            </div>
                            <Switch
                                checked={getIntegration('whatsapp').isEnabled}
                                onCheckedChange={(checked) => handleToggle('whatsapp', checked)}
                                disabled={saving === 'whatsapp'}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Phone Number ID</Label>
                            <Input placeholder="Enter WhatsApp Phone Number ID" />
                        </div>
                        <div className="space-y-2">
                            <Label>Access Token</Label>
                            <Input type="password" placeholder="Enter Access Token" />
                        </div>
                        <div className="space-y-2">
                            <Label>Webhook URL</Label>
                            <div className="flex gap-2">
                                <Input value="https://yourdomain.com/api/webhook/whatsapp" readOnly />
                                <Button variant="outline" size="icon">
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <Button
                            className="w-full"
                            disabled={saving === 'whatsapp'}
                            onClick={() => handleSave('whatsapp', {})}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save WhatsApp Settings
                        </Button>
                    </CardContent>
                </Card>

                {/* Instagram */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <Instagram className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Instagram</CardTitle>
                                    <CardDescription>Messaging API Integration</CardDescription>
                                </div>
                            </div>
                            <Switch
                                checked={getIntegration('instagram').isEnabled}
                                onCheckedChange={(checked) => handleToggle('instagram', checked)}
                                disabled={saving === 'instagram'}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Instagram Account ID</Label>
                            <Input placeholder="Enter Instagram Account ID" />
                        </div>
                        <div className="space-y-2">
                            <Label>Access Token</Label>
                            <Input type="password" placeholder="Enter Access Token" />
                        </div>
                        <div className="space-y-2">
                            <Label>App Secret</Label>
                            <Input type="password" placeholder="Enter App Secret" />
                        </div>
                        <Button
                            className="w-full"
                            disabled={saving === 'instagram'}
                            onClick={() => handleSave('instagram', {})}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Instagram Settings
                        </Button>
                    </CardContent>
                </Card>

                {/* Facebook Messenger */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <MessageCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Facebook Messenger</CardTitle>
                                    <CardDescription>Page Messaging Integration</CardDescription>
                                </div>
                            </div>
                            <Badge variant="secondary">Coming Soon</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Facebook Messenger integration is under development.
                        </p>
                    </CardContent>
                </Card>

                {/* Telegram */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
                                    <MessageCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Telegram</CardTitle>
                                    <CardDescription>Bot Integration</CardDescription>
                                </div>
                            </div>
                            <Badge variant="secondary">Coming Soon</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Telegram Bot integration is under development.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
