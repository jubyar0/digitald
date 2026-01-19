'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { getLivechatSettings, updateLivechatSettings } from '@/actions/livechat-settings'
import { toast } from 'sonner'
import { Palette, MessageSquare, Clock, Bell, Save } from 'lucide-react'

export default function LivechatAppearancePage() {
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const result = await getLivechatSettings()
                if (result.success) {
                    setSettings(result.data)
                }
            } catch (error) {
                toast.error('Failed to load settings')
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const result = await updateLivechatSettings(settings)
            if (result.success) {
                toast.success('Settings saved successfully')
            } else {
                toast.error('Failed to save settings')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>
    }

    return (
        <div className="flex flex-col container mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Palette className="h-6 w-6 text-primary" />
                        Livechat Appearance
                    </h1>
                    <p className="text-muted-foreground">
                        Customize how the chat widget looks and behaves
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Widget Appearance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Widget Style
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Widget Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={settings?.widgetColor || '#f97316'}
                                    onChange={(e) => setSettings({ ...settings, widgetColor: e.target.value })}
                                    className="w-16 h-10 p-1"
                                />
                                <Input
                                    value={settings?.widgetColor || '#f97316'}
                                    onChange={(e) => setSettings({ ...settings, widgetColor: e.target.value })}
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Widget Position</Label>
                            <Select
                                value={settings?.widgetPosition || 'bottom-right'}
                                onValueChange={(value) => setSettings({ ...settings, widgetPosition: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                    <SelectItem value="top-right">Top Right</SelectItem>
                                    <SelectItem value="top-left">Top Left</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Welcome Message</Label>
                            <Textarea
                                value={settings?.welcomeMessage || ''}
                                onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                                placeholder="Hi! How can we help you today?"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Offline Message</Label>
                            <Textarea
                                value={settings?.offlineMessage || ''}
                                onChange={(e) => setSettings({ ...settings, offlineMessage: e.target.value })}
                                placeholder="We're currently offline. Leave a message!"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Eye Catcher */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Eye Catcher
                        </CardTitle>
                        <CardDescription>
                            A popup message to attract visitor attention
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Enable Eye Catcher</Label>
                            <Switch
                                checked={settings?.eyeCatcherEnabled || false}
                                onCheckedChange={(checked) => setSettings({ ...settings, eyeCatcherEnabled: checked })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Eye Catcher Text</Label>
                            <Input
                                value={settings?.eyeCatcherText || ''}
                                onChange={(e) => setSettings({ ...settings, eyeCatcherText: e.target.value })}
                                placeholder="Need help? Chat with us!"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Delay (ms)</Label>
                            <Input
                                type="number"
                                value={settings?.eyeCatcherDelay || 3000}
                                onChange={(e) => setSettings({ ...settings, eyeCatcherDelay: parseInt(e.target.value) })}
                            />
                            <p className="text-xs text-muted-foreground">
                                How long to wait before showing the eye catcher
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Features */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Sound Notifications</Label>
                                <p className="text-xs text-muted-foreground">Play sound on new messages</p>
                            </div>
                            <Switch
                                checked={settings?.soundEnabled || false}
                                onCheckedChange={(checked) => setSettings({ ...settings, soundEnabled: checked })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label>File Sharing</Label>
                                <p className="text-xs text-muted-foreground">Allow visitors to upload files</p>
                            </div>
                            <Switch
                                checked={settings?.fileShareEnabled || false}
                                onCheckedChange={(checked) => setSettings({ ...settings, fileShareEnabled: checked })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Voice Calls</Label>
                                <p className="text-xs text-muted-foreground">Enable voice calling feature</p>
                            </div>
                            <Switch
                                checked={settings?.voiceEnabled || false}
                                onCheckedChange={(checked) => setSettings({ ...settings, voiceEnabled: checked })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Video Calls</Label>
                                <p className="text-xs text-muted-foreground">Enable video calling feature</p>
                            </div>
                            <Switch
                                checked={settings?.videoEnabled || false}
                                onCheckedChange={(checked) => setSettings({ ...settings, videoEnabled: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Operating Hours */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Operating Hours
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Enable Operating Hours</Label>
                            <Switch
                                checked={settings?.operatingHoursEnabled || false}
                                onCheckedChange={(checked) => setSettings({ ...settings, operatingHoursEnabled: checked })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Timezone</Label>
                            <Select
                                value={settings?.timezone || 'UTC'}
                                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UTC">UTC</SelectItem>
                                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                                    <SelectItem value="Europe/London">London</SelectItem>
                                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Configure specific operating hours in the full settings page
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Preview */}
            <Card>
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg">
                    {/* Mock browser window */}
                    <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="h-8 bg-gray-100 dark:bg-gray-700 flex items-center gap-1.5 px-3">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="p-4 text-muted-foreground text-sm">
                            Your website content here...
                        </div>
                    </div>

                    {/* Chat bubble preview */}
                    <div
                        className="absolute w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
                        style={{
                            backgroundColor: settings?.widgetColor || '#f97316',
                            ...(settings?.widgetPosition === 'bottom-right' || !settings?.widgetPosition
                                ? { bottom: 8, right: 8 }
                                : settings?.widgetPosition === 'bottom-left'
                                    ? { bottom: 8, left: 8 }
                                    : settings?.widgetPosition === 'top-right'
                                        ? { top: 40, right: 8 }
                                        : { top: 40, left: 8 }),
                        }}
                    >
                        <MessageSquare className="h-6 w-6" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
