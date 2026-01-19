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
import { Bot, Sparkles, Languages, Save, Volume2 } from 'lucide-react'

export default function AISettingsPage() {
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
                        <Bot className="h-6 w-6 text-purple-500" />
                        AI & Smart Features
                    </h1>
                    <p className="text-muted-foreground">
                        Configure AI chatbot, translation, and text-to-speech
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* AI ChatBot */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-500" />
                            AI ChatBot
                        </CardTitle>
                        <CardDescription>
                            Automatic responses powered by AI
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Enable AI ChatBot</Label>
                            <Switch
                                checked={settings?.aiEnabled || false}
                                onCheckedChange={(checked) => setSettings({ ...settings, aiEnabled: checked })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>AI Model</Label>
                            <Select
                                value={settings?.aiModel || 'gpt-4'}
                                onValueChange={(value) => setSettings({ ...settings, aiModel: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                    <SelectItem value="claude-3">Claude 3</SelectItem>
                                    <SelectItem value="custom">Custom Model</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>System Prompt</Label>
                            <Textarea
                                value={settings?.aiSystemPrompt || ''}
                                onChange={(e) => setSettings({ ...settings, aiSystemPrompt: e.target.value })}
                                placeholder="You are a helpful customer support assistant..."
                                rows={5}
                            />
                            <p className="text-xs text-muted-foreground">
                                Define how the AI should behave and respond
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Auto Translate */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Languages className="h-5 w-5 text-blue-500" />
                            Auto Translate
                        </CardTitle>
                        <CardDescription>
                            Automatically translate messages
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Enable Auto Translate</Label>
                            <Switch
                                checked={settings?.autoTranslateEnabled || false}
                                onCheckedChange={(checked) => setSettings({ ...settings, autoTranslateEnabled: checked })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Default Language</Label>
                            <Select
                                value={settings?.defaultLanguage || 'en'}
                                onValueChange={(value) => setSettings({ ...settings, defaultLanguage: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="es">Spanish</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                    <SelectItem value="de">German</SelectItem>
                                    <SelectItem value="ar">Arabic</SelectItem>
                                    <SelectItem value="zh">Chinese</SelectItem>
                                    <SelectItem value="ja">Japanese</SelectItem>
                                    <SelectItem value="pt">Portuguese</SelectItem>
                                    <SelectItem value="ru">Russian</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Messages will be automatically translated to/from the visitor&apos;s language
                        </p>
                    </CardContent>
                </Card>

                {/* Text-to-Speech */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Volume2 className="h-5 w-5 text-green-500" />
                            Text-to-Speech
                        </CardTitle>
                        <CardDescription>
                            Read messages aloud for accessibility
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div>
                                <p className="font-medium">Coming Soon</p>
                                <p className="text-sm text-muted-foreground">
                                    Text-to-Speech feature is under development
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* SpellCheck */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">SpellCheck & Suggestions</CardTitle>
                        <CardDescription>
                            Automatic spelling corrections and suggestions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div>
                                <p className="font-medium">Browser Native</p>
                                <p className="text-sm text-muted-foreground">
                                    SpellCheck is handled by the browser automatically
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* API Keys Notice */}
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-amber-800 dark:text-amber-200">API Keys Required</p>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                To use AI features, you need to configure API keys in the API Settings section.
                                Go to Settings → API to add your OpenAI or other provider keys.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
