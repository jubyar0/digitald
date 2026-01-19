'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
    Loader2Icon,
    SaveIcon,
    EyeIcon,
    EyeOffIcon,
    CreditCard,
    Wallet,
    Bot,
    MessageSquare,
    AlertTriangle,
    ShieldCheck,
    Trash2Icon,
    KeyIcon
} from 'lucide-react'
import {
    getApiSettings,
    getApiSettingByProvider,
    updateApiSetting,
    deleteApiSetting,
    toggleApiSetting,
    isAdmin,
    type ApiProvider
} from '@/actions/api-settings'

interface ProviderConfig {
    provider: ApiProvider
    name: string
    description: string
    icon: React.ReactNode
    fields: {
        key: string
        label: string
        placeholder: string
        type?: 'text' | 'password' | 'select'
        options?: { value: string; label: string }[]
    }[]
}

const PROVIDERS: ProviderConfig[] = [
    {
        provider: 'stripe',
        name: 'Stripe',
        description: 'Credit card payment processing',
        icon: <CreditCard className="h-5 w-5" />,
        fields: [
            { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_...', type: 'password' },
            { key: 'publishableKey', label: 'Publishable Key', placeholder: 'pk_live_...', type: 'password' },
            { key: 'webhookSecret', label: 'Webhook Secret', placeholder: 'whsec_...', type: 'password' }
        ]
    },
    {
        provider: 'paypal',
        name: 'PayPal',
        description: 'PayPal payment processing',
        icon: <Wallet className="h-5 w-5" />,
        fields: [
            { key: 'clientId', label: 'Client ID', placeholder: 'Your PayPal Client ID', type: 'password' },
            { key: 'clientSecret', label: 'Client Secret', placeholder: 'Your PayPal Client Secret', type: 'password' },
            {
                key: 'mode', label: 'Environment', placeholder: 'sandbox', type: 'select', options: [
                    { value: 'sandbox', label: 'Sandbox (Testing)' },
                    { value: 'live', label: 'Live (Production)' }
                ]
            }
        ]
    },
    {
        provider: 'cryptomus',
        name: 'Cryptomus',
        description: 'Cryptocurrency payment processing',
        icon: <Wallet className="h-5 w-5" />,
        fields: [
            { key: 'merchantId', label: 'Merchant ID', placeholder: 'Your Cryptomus Merchant ID', type: 'password' },
            { key: 'apiKey', label: 'API Key', placeholder: 'Your Cryptomus API Key', type: 'password' }
        ]
    },
    {
        provider: 'gemini',
        name: 'Google Gemini AI',
        description: 'AI-powered features',
        icon: <Bot className="h-5 w-5" />,
        fields: [
            { key: 'apiKey', label: 'API Key', placeholder: 'Your Gemini API Key', type: 'password' }
        ]
    },
    {
        provider: 'sentry',
        name: 'Sentry',
        description: 'Error monitoring and tracking',
        icon: <AlertTriangle className="h-5 w-5" />,
        fields: [
            { key: 'dsn', label: 'DSN', placeholder: 'https://...@sentry.io/...', type: 'password' }
        ]
    },
    {
        provider: 'crisp',
        name: 'Crisp Chat',
        description: 'Live chat support',
        icon: <MessageSquare className="h-5 w-5" />,
        fields: [
            { key: 'websiteId', label: 'Website ID', placeholder: 'Your Crisp Website ID', type: 'password' }
        ]
    },
    {
        provider: 'google',
        name: 'Google OAuth',
        description: 'Social login with Google',
        icon: <ShieldCheck className="h-5 w-5" />,
        fields: [
            { key: 'clientId', label: 'Client ID', placeholder: 'Your Google Client ID', type: 'password' },
            { key: 'clientSecret', label: 'Client Secret', placeholder: 'Your Google Client Secret', type: 'password' }
        ]
    }
]

function ProviderCard({ config, onSave }: { config: ProviderConfig; onSave: () => void }) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [hasExisting, setHasExisting] = useState(false)
    const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
    const [values, setValues] = useState<Record<string, string>>({})

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        setLoading(true)
        try {
            const result = await getApiSettingByProvider(config.provider)
            if (result.success && result.data) {
                setValues((result.data as any).settings)
                setIsActive((result.data as any).isActive)
                setHasExisting(true)
            } else {
                // Initialize with empty values
                const emptyValues: Record<string, string> = {}
                config.fields.forEach(field => {
                    emptyValues[field.key] = ''
                })
                setValues(emptyValues)
                setHasExisting(false)
            }
        } catch (error) {
            console.error('Error loading settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        // Validate required fields
        const hasEmptyFields = config.fields.some(field => !values[field.key])
        if (hasEmptyFields) {
            toast.error('Please fill in all fields')
            return
        }

        setSaving(true)
        try {
            const result = await updateApiSetting(config.provider, values, isActive)
            if (result.success) {
                toast.success(`${config.name} settings saved successfully`)
                setHasExisting(true)
                onSave()
            } else {
                toast.error((result as any).error || 'Failed to save settings')
            }
        } catch (error) {
            toast.error('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${config.name} settings? The system will fall back to environment variables.`)) {
            return
        }

        setDeleting(true)
        try {
            const result = await deleteApiSetting(config.provider)
            if (result.success) {
                toast.success(`${config.name} settings deleted`)
                setValues({})
                config.fields.forEach(field => {
                    setValues(prev => ({ ...prev, [field.key]: '' }))
                })
                setHasExisting(false)
                setIsActive(false)
                onSave()
            } else {
                toast.error((result as any).error || 'Failed to delete settings')
            }
        } catch (error) {
            toast.error('Failed to delete settings')
        } finally {
            setDeleting(false)
        }
    }

    const toggleShowSecret = (key: string) => {
        setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }))
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2Icon className="h-6 w-6 animate-spin" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {config.icon}
                        <div>
                            <CardTitle className="text-lg">{config.name}</CardTitle>
                            <CardDescription>{config.description}</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasExisting && (
                            <Badge variant={isActive ? "default" : "secondary"}>
                                {isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        )}
                        <Switch
                            checked={isActive}
                            onCheckedChange={setIsActive}
                            disabled={!hasExisting}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {config.fields.map(field => (
                    <div key={field.key} className="space-y-2">
                        <Label htmlFor={`${config.provider}-${field.key}`}>{field.label}</Label>
                        {field.type === 'select' ? (
                            <Select
                                value={values[field.key] || ''}
                                onValueChange={(value) => setValues(prev => ({ ...prev, [field.key]: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={field.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="relative">
                                <Input
                                    id={`${config.provider}-${field.key}`}
                                    type={showSecrets[field.key] ? 'text' : 'password'}
                                    value={values[field.key] || ''}
                                    onChange={(e) => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    placeholder={field.placeholder}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => toggleShowSecret(field.key)}
                                >
                                    {showSecrets[field.key] ? (
                                        <EyeOffIcon className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                ))}

                <Separator className="my-4" />

                <div className="flex justify-between">
                    {hasExisting && (
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting || saving}
                        >
                            {deleting ? (
                                <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Trash2Icon className="h-4 w-4 mr-2" />
                            )}
                            Delete
                        </Button>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={saving || deleting}
                        className={!hasExisting ? 'ml-auto' : ''}
                    >
                        {saving ? (
                            <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <SaveIcon className="h-4 w-4 mr-2" />
                        )}
                        {hasExisting ? 'Update' : 'Save'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default function ApiSettingsPage() {
    const [authorized, setAuthorized] = useState<boolean | null>(null)
    const [activeTab, setActiveTab] = useState('payments')

    useEffect(() => {
        checkAccess()
    }, [])

    const checkAccess = async () => {
        const isAdminUser = await isAdmin()
        setAuthorized(isAdminUser)
    }

    const handleSave = () => {
        // Refresh can be triggered here if needed
    }

    if (authorized === null) {
        return (
            <div className="flex flex-1 flex-col container mx-auto">
                <div className="flex items-center justify-center h-64">
                    <Loader2Icon className="h-8 w-8 animate-spin" />
                </div>
            </div>
        )
    }

    if (!authorized) {
        return (
            <div className="flex flex-1 flex-col container mx-auto">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-8 dashboard-padding">
                        <Card className="border-destructive">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-8 w-8 text-destructive" />
                                    <div>
                                        <CardTitle>Access Denied</CardTitle>
                                        <CardDescription>
                                            Only administrators can access API settings.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Contact your system administrator if you believe you should have access to this page.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    const paymentProviders = PROVIDERS.filter(p => ['stripe', 'paypal', 'cryptomus'].includes(p.provider))
    const integrationProviders = PROVIDERS.filter(p => ['gemini', 'sentry', 'crisp', 'google'].includes(p.provider))

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <div className="flex items-center gap-3">
                                <KeyIcon className="h-6 w-6" />
                                <div>
                                    <h3 className="dashboard-card-title">API Settings</h3>
                                    <p className="dashboard-card-description">
                                        Configure API keys for payment gateways and integrations.
                                        Settings here override environment variables.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-amber-500">Security Notice</p>
                                <p className="text-sm text-muted-foreground">
                                    API keys are encrypted before storage. Changes take effect immediately.
                                    If you delete a configuration, the system will fall back to environment variables.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="payments">Payment Gateways</TabsTrigger>
                            <TabsTrigger value="integrations">Integrations</TabsTrigger>
                        </TabsList>

                        <TabsContent value="payments" className="space-y-4 mt-6">
                            {paymentProviders.map(provider => (
                                <ProviderCard
                                    key={provider.provider}
                                    config={provider}
                                    onSave={handleSave}
                                />
                            ))}
                        </TabsContent>

                        <TabsContent value="integrations" className="space-y-4 mt-6">
                            {integrationProviders.map(provider => (
                                <ProviderCard
                                    key={provider.provider}
                                    config={provider}
                                    onSave={handleSave}
                                />
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
