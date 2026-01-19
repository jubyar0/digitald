'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { getSecuritySettings, updateSecuritySettings } from '@/actions/livechat-settings'
import { toast } from 'sonner'
import { Shield, Globe, Zap, Save, Plus, X } from 'lucide-react'

export default function SecuritySettingsPage() {
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [newCountry, setNewCountry] = useState('')

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const result = await getSecuritySettings()
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
            const result = await updateSecuritySettings(settings)
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

    const addBlockedCountry = () => {
        if (!newCountry.trim()) return
        const countries = settings?.blockedCountries || []
        if (!countries.includes(newCountry.toUpperCase())) {
            setSettings({
                ...settings,
                blockedCountries: [...countries, newCountry.toUpperCase()],
            })
        }
        setNewCountry('')
    }

    const removeBlockedCountry = (country: string) => {
        setSettings({
            ...settings,
            blockedCountries: (settings?.blockedCountries || []).filter((c: string) => c !== country),
        })
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
                        <Shield className="h-6 w-6 text-red-500" />
                        Security Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Configure access restrictions and protection measures
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Country Restrictions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Country Restrictions
                        </CardTitle>
                        <CardDescription>
                            Block access from specific countries
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Enable Country Restrictions</Label>
                            <Switch
                                checked={settings?.countryRestrictions || false}
                                onCheckedChange={(checked) => setSettings({ ...settings, countryRestrictions: checked })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Blocked Countries</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={newCountry}
                                    onChange={(e) => setNewCountry(e.target.value)}
                                    placeholder="Enter country code (e.g., CN, RU)"
                                    onKeyDown={(e) => e.key === 'Enter' && addBlockedCountry()}
                                />
                                <Button onClick={addBlockedCountry} size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {(settings?.blockedCountries || []).map((country: string) => (
                                    <Badge key={country} variant="secondary" className="gap-1">
                                        {country}
                                        <button onClick={() => removeBlockedCountry(country)}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* DoS Protection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            DoS Protection
                        </CardTitle>
                        <CardDescription>
                            Protect against denial of service attacks
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Enable DoS Protection</Label>
                            <Switch
                                checked={settings?.dosProtectionEnabled || false}
                                onCheckedChange={(checked) => setSettings({ ...settings, dosProtectionEnabled: checked })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Max Requests Per Minute</Label>
                            <Input
                                type="number"
                                value={settings?.maxRequestsPerMinute || 100}
                                onChange={(e) => setSettings({ ...settings, maxRequestsPerMinute: parseInt(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Block Duration (seconds)</Label>
                            <Input
                                type="number"
                                value={settings?.blockDuration || 3600}
                                onChange={(e) => setSettings({ ...settings, blockDuration: parseInt(e.target.value) })}
                            />
                            <p className="text-xs text-muted-foreground">
                                How long to block IPs that exceed the rate limit
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Domain Transfer */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Domain Transfer</CardTitle>
                        <CardDescription>
                            Control which domains can embed your chat
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Allowed Domains</Label>
                            <Input
                                placeholder="yourdomain.com, app.yourdomain.com"
                                value={(settings?.allowedDomains || []).join(', ')}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    allowedDomains: e.target.value.split(',').map((d: string) => d.trim()).filter(Boolean),
                                })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave empty to allow all domains
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* IP Blocking */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">IP Blocking</CardTitle>
                        <CardDescription>
                            Block specific IP addresses
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div>
                                <p className="font-medium">Coming Soon</p>
                                <p className="text-sm text-muted-foreground">
                                    IP blocking feature is under development
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
