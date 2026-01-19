'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { Input } from '@/components/dashboard/ui/input'
import { Label } from '@/components/dashboard/ui/label'
import { Switch } from '@/components/dashboard/ui/switch'
import { Textarea } from '@/components/dashboard/ui/textarea'
import { getSettings, updateSetting } from '@/actions/admin'
import { toast } from 'sonner'
import { Loader2Icon, SaveIcon, ShieldIcon } from 'lucide-react'

export default function SecuritySettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    const [sessionTimeout, setSessionTimeout] = useState('30')
    const [passwordMinLength, setPasswordMinLength] = useState('8')
    const [requireSpecialChars, setRequireSpecialChars] = useState(true)
    const [requireNumbers, setRequireNumbers] = useState(true)
    const [requireUppercase, setRequireUppercase] = useState(true)
    const [ipWhitelist, setIpWhitelist] = useState('')
    const [maxLoginAttempts, setMaxLoginAttempts] = useState('5')
    const [lockoutDuration, setLockoutDuration] = useState('15')

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const result = await getSettings('security')
            if (result.data) {
                result.data.forEach((setting: any) => {
                    switch (setting.key) {
                        case 'two_factor_enabled':
                            setTwoFactorEnabled(setting.value === 'true')
                            break
                        case 'session_timeout':
                            setSessionTimeout(setting.value)
                            break
                        case 'password_min_length':
                            setPasswordMinLength(setting.value)
                            break
                        case 'require_special_chars':
                            setRequireSpecialChars(setting.value === 'true')
                            break
                        case 'require_numbers':
                            setRequireNumbers(setting.value === 'true')
                            break
                        case 'require_uppercase':
                            setRequireUppercase(setting.value === 'true')
                            break
                        case 'ip_whitelist':
                            setIpWhitelist(setting.value)
                            break
                        case 'max_login_attempts':
                            setMaxLoginAttempts(setting.value)
                            break
                        case 'lockout_duration':
                            setLockoutDuration(setting.value)
                            break
                    }
                })
            }
        } catch (error) {
            toast.error('Failed to load security settings')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await Promise.all([
                updateSetting('two_factor_enabled', twoFactorEnabled.toString()),
                updateSetting('session_timeout', sessionTimeout),
                updateSetting('password_min_length', passwordMinLength),
                updateSetting('require_special_chars', requireSpecialChars.toString()),
                updateSetting('require_numbers', requireNumbers.toString()),
                updateSetting('require_uppercase', requireUppercase.toString()),
                updateSetting('ip_whitelist', ipWhitelist),
                updateSetting('max_login_attempts', maxLoginAttempts),
                updateSetting('lockout_duration', lockoutDuration),
            ])
            toast.success('Security settings saved successfully')
        } catch (error) {
            toast.error('Failed to save security settings')
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
                            <h3 className="dashboard-card-title">Security Settings</h3>
                            <p className="dashboard-card-description">
                                Configure security and authentication options
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {/* Authentication */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Authentication</CardTitle>
                                <CardDescription>
                                    Configure authentication and session settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Require 2FA for admin accounts
                                        </p>
                                    </div>
                                    <Switch
                                        id="twoFactor"
                                        checked={twoFactorEnabled}
                                        onCheckedChange={setTwoFactorEnabled}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sessionTimeout">Session Timeout</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="sessionTimeout"
                                            type="number"
                                            min="5"
                                            max="1440"
                                            value={sessionTimeout}
                                            onChange={(e) => setSessionTimeout(e.target.value)}
                                            className="max-w-xs"
                                        />
                                        <span className="text-muted-foreground">minutes</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically log out inactive users
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Password Requirements */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Password Requirements</CardTitle>
                                <CardDescription>
                                    Set password complexity requirements
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="passwordMinLength"
                                            type="number"
                                            min="6"
                                            max="32"
                                            value={passwordMinLength}
                                            onChange={(e) => setPasswordMinLength(e.target.value)}
                                            className="max-w-xs"
                                        />
                                        <span className="text-muted-foreground">characters</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Password must contain special characters (!@#$%^&*)
                                            </p>
                                        </div>
                                        <Switch
                                            id="requireSpecialChars"
                                            checked={requireSpecialChars}
                                            onCheckedChange={setRequireSpecialChars}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="requireNumbers">Require Numbers</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Password must contain at least one number
                                            </p>
                                        </div>
                                        <Switch
                                            id="requireNumbers"
                                            checked={requireNumbers}
                                            onCheckedChange={setRequireNumbers}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Password must contain uppercase letters
                                            </p>
                                        </div>
                                        <Switch
                                            id="requireUppercase"
                                            checked={requireUppercase}
                                            onCheckedChange={setRequireUppercase}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Login Security */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Login Security</CardTitle>
                                <CardDescription>
                                    Configure login attempt limits and lockout settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="maxLoginAttempts">Maximum Login Attempts</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="maxLoginAttempts"
                                            type="number"
                                            min="3"
                                            max="10"
                                            value={maxLoginAttempts}
                                            onChange={(e) => setMaxLoginAttempts(e.target.value)}
                                            className="max-w-xs"
                                        />
                                        <span className="text-muted-foreground">attempts</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Number of failed login attempts before account lockout
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lockoutDuration">Lockout Duration</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="lockoutDuration"
                                            type="number"
                                            min="5"
                                            max="1440"
                                            value={lockoutDuration}
                                            onChange={(e) => setLockoutDuration(e.target.value)}
                                            className="max-w-xs"
                                        />
                                        <span className="text-muted-foreground">minutes</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        How long to lock out accounts after max attempts
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* IP Whitelist */}
                        <Card>
                            <CardHeader>
                                <CardTitle>IP Whitelist</CardTitle>
                                <CardDescription>
                                    Restrict admin access to specific IP addresses
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ipWhitelist">Allowed IP Addresses</Label>
                                    <Textarea
                                        id="ipWhitelist"
                                        placeholder="Enter IP addresses, one per line&#10;192.168.1.1&#10;10.0.0.1"
                                        value={ipWhitelist}
                                        onChange={(e) => setIpWhitelist(e.target.value)}
                                        rows={5}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Leave empty to allow all IPs. Enter one IP address per line.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <div className="flex justify-end">
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
