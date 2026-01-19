'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ColorPicker } from '@/components/ui/color-picker'
import { ImageUpload } from '@/components/ui/image-upload'
import { ThemePreview } from '@/components/admin/theme-preview'
import {
    getThemeSettings,
    updateThemeSettings,
    resetThemeSettings,
    exportThemeSettings,
    importThemeSettings,
    getPlatformSettings,
    updatePlatformSettings
} from '@/actions/admin'
import { toast } from 'sonner'
import { Download, Upload, RotateCcw, Save } from 'lucide-react'

export default function GeneralSettingsPage() {
    const [themeSettings, setThemeSettings] = useState<any>(null)
    const [platformSettings, setPlatformSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [themeResult, platformResult] = await Promise.all([
                    getThemeSettings(),
                    getPlatformSettings()
                ])
                setThemeSettings(themeResult.data)
                setPlatformSettings(platformResult.data)
            } catch (error) {
                toast.error('Failed to load settings')
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSaveTheme = async () => {
        setSaving(true)
        try {
            await updateThemeSettings(themeSettings)
            toast.success('Theme settings saved successfully')
        } catch (error) {
            toast.error('Failed to save theme settings')
        } finally {
            setSaving(false)
        }
    }

    const handleSavePlatform = async () => {
        setSaving(true)
        try {
            await updatePlatformSettings(platformSettings)
            toast.success('Platform settings saved successfully')
        } catch (error) {
            toast.error('Failed to save platform settings')
        } finally {
            setSaving(false)
        }
    }

    const handleResetTheme = async () => {
        if (!confirm('Are you sure you want to reset all theme settings to defaults?')) return

        setSaving(true)
        try {
            await resetThemeSettings()
            const result = await getThemeSettings()
            setThemeSettings(result.data)
            toast.success('Theme reset to defaults')
        } catch (error) {
            toast.error('Failed to reset theme')
        } finally {
            setSaving(false)
        }
    }

    const handleExportTheme = async () => {
        try {
            const result = await exportThemeSettings()
            const dataStr = JSON.stringify(result.data, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(dataBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'theme-settings.json'
            link.click()
            URL.revokeObjectURL(url)
            toast.success('Theme exported successfully')
        } catch (error) {
            toast.error('Failed to export theme')
        }
    }

    const handleImportTheme = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const text = await file.text()
            const themeData = JSON.parse(text)
            await importThemeSettings(themeData)
            const result = await getThemeSettings()
            setThemeSettings(result.data)
            toast.success('Theme imported successfully')
        } catch (error) {
            toast.error('Failed to import theme')
        }
    }

    if (loading) {
        return <div className="flex flex-1 items-center justify-center">Loading...</div>
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    {/* Header */}
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">General Settings</h3>
                            <p className="dashboard-card-description">
                                Customize your website appearance, colors, and platform settings
                            </p>
                        </div>
                    </div>

                    <Tabs defaultValue="theme" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                            <TabsTrigger value="theme">Theme Customization</TabsTrigger>
                            <TabsTrigger value="branding">Branding & Site Info</TabsTrigger>
                            <TabsTrigger value="platform">Platform Settings</TabsTrigger>
                        </TabsList>

                        {/* Theme Customization Tab */}
                        <TabsContent value="theme" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Settings Panel */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Actions */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Theme Management</CardTitle>
                                            <CardDescription>
                                                Save, reset, export, or import your theme settings
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-wrap gap-2">
                                            <Button onClick={handleSaveTheme} disabled={saving}>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Theme
                                            </Button>
                                            <Button onClick={handleResetTheme} variant="outline" disabled={saving}>
                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                Reset to Defaults
                                            </Button>
                                            <Button onClick={handleExportTheme} variant="outline">
                                                <Download className="w-4 h-4 mr-2" />
                                                Export Theme
                                            </Button>
                                            <Button variant="outline" asChild>
                                                <label className="cursor-pointer">
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Import Theme
                                                    <input
                                                        type="file"
                                                        accept=".json"
                                                        className="hidden"
                                                        onChange={handleImportTheme}
                                                    />
                                                </label>
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    {/* Light Mode Colors */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Light Mode Colors</CardTitle>
                                            <CardDescription>
                                                Customize colors for light mode theme
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ColorPicker
                                                    label="Primary Color"
                                                    value={themeSettings?.primaryColor || '#3b82f6'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, primaryColor: value })}
                                                    description="Main brand color"
                                                />
                                                <ColorPicker
                                                    label="Secondary Color"
                                                    value={themeSettings?.secondaryColor || '#f4f4f5'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, secondaryColor: value })}
                                                    description="Secondary elements"
                                                />
                                                <ColorPicker
                                                    label="Accent Color"
                                                    value={themeSettings?.accentColor || '#f4f4f5'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, accentColor: value })}
                                                    description="Accent highlights"
                                                />
                                                <ColorPicker
                                                    label="Background Color"
                                                    value={themeSettings?.backgroundColor || '#ffffff'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, backgroundColor: value })}
                                                    description="Page background"
                                                />
                                                <ColorPicker
                                                    label="Foreground Color"
                                                    value={themeSettings?.foregroundColor || '#09090b'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, foregroundColor: value })}
                                                    description="Text color"
                                                />
                                                <ColorPicker
                                                    label="Card Color"
                                                    value={themeSettings?.cardColor || '#ffffff'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, cardColor: value })}
                                                    description="Card background"
                                                />
                                                <ColorPicker
                                                    label="Border Color"
                                                    value={themeSettings?.borderColor || '#e4e4e7'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, borderColor: value })}
                                                    description="Border elements"
                                                />
                                                <ColorPicker
                                                    label="Input Color"
                                                    value={themeSettings?.inputColor || '#e4e4e7'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, inputColor: value })}
                                                    description="Input backgrounds"
                                                />
                                                <ColorPicker
                                                    label="Muted Color"
                                                    value={themeSettings?.mutedColor || '#f4f4f5'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, mutedColor: value })}
                                                    description="Muted backgrounds"
                                                />
                                                <ColorPicker
                                                    label="Destructive Color"
                                                    value={themeSettings?.destructiveColor || '#dc2626'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, destructiveColor: value })}
                                                    description="Error/delete actions"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Dark Mode Colors */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Dark Mode Colors</CardTitle>
                                            <CardDescription>
                                                Customize colors for dark mode theme
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ColorPicker
                                                    label="Primary Color"
                                                    value={themeSettings?.darkPrimaryColor || '#2563eb'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, darkPrimaryColor: value })}
                                                />
                                                <ColorPicker
                                                    label="Secondary Color"
                                                    value={themeSettings?.darkSecondaryColor || '#27272a'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, darkSecondaryColor: value })}
                                                />
                                                <ColorPicker
                                                    label="Accent Color"
                                                    value={themeSettings?.darkAccentColor || '#18181b'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, darkAccentColor: value })}
                                                />
                                                <ColorPicker
                                                    label="Background Color"
                                                    value={themeSettings?.darkBackgroundColor || '#09090b'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, darkBackgroundColor: value })}
                                                />
                                                <ColorPicker
                                                    label="Foreground Color"
                                                    value={themeSettings?.darkForegroundColor || '#fafafa'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, darkForegroundColor: value })}
                                                />
                                                <ColorPicker
                                                    label="Card Color"
                                                    value={themeSettings?.darkCardColor || '#09090b'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, darkCardColor: value })}
                                                />
                                                <ColorPicker
                                                    label="Border Color"
                                                    value={themeSettings?.darkBorderColor || '#27272a'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, darkBorderColor: value })}
                                                />
                                                <ColorPicker
                                                    label="Input Color"
                                                    value={themeSettings?.darkInputColor || '#27272a'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, darkInputColor: value })}
                                                />
                                                <ColorPicker
                                                    label="Muted Color"
                                                    value={themeSettings?.darkMutedColor || '#18181b'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, darkMutedColor: value })}
                                                />
                                                <ColorPicker
                                                    label="Destructive Color"
                                                    value={themeSettings?.darkDestructiveColor || '#dc2626'}
                                                    onChange={(value) => setThemeSettings({ ...themeSettings, darkDestructiveColor: value })}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Typography */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Typography</CardTitle>
                                            <CardDescription>
                                                Customize fonts and text sizes
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fontFamily">Font Family</Label>
                                                <Select
                                                    value={themeSettings?.fontFamily || 'Inter'}
                                                    onValueChange={(value) => setThemeSettings({ ...themeSettings, fontFamily: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Inter">Inter</SelectItem>
                                                        <SelectItem value="Roboto">Roboto</SelectItem>
                                                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                                                        <SelectItem value="Lato">Lato</SelectItem>
                                                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                                                        <SelectItem value="Poppins">Poppins</SelectItem>
                                                        <SelectItem value="system-ui">System UI</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="fontSize">Base Font Size</Label>
                                                <Input
                                                    id="fontSize"
                                                    value={themeSettings?.fontSize || '14px'}
                                                    onChange={(e) => setThemeSettings({ ...themeSettings, fontSize: e.target.value })}
                                                    placeholder="14px"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Layout */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Layout Settings</CardTitle>
                                            <CardDescription>
                                                Customize layout dimensions and spacing
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="borderRadius">Border Radius</Label>
                                                <Input
                                                    id="borderRadius"
                                                    value={themeSettings?.borderRadius || '0.5rem'}
                                                    onChange={(e) => setThemeSettings({ ...themeSettings, borderRadius: e.target.value })}
                                                    placeholder="0.5rem"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sidebarWidth">Sidebar Width</Label>
                                                <Input
                                                    id="sidebarWidth"
                                                    value={themeSettings?.sidebarWidth || '280px'}
                                                    onChange={(e) => setThemeSettings({ ...themeSettings, sidebarWidth: e.target.value })}
                                                    placeholder="280px"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="headerHeight">Header Height</Label>
                                                <Input
                                                    id="headerHeight"
                                                    value={themeSettings?.headerHeight || '70px'}
                                                    onChange={(e) => setThemeSettings({ ...themeSettings, headerHeight: e.target.value })}
                                                    placeholder="70px"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Default Mode */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Default Theme Mode</CardTitle>
                                            <CardDescription>
                                                Set the default color mode for new users
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Select
                                                value={themeSettings?.defaultMode || 'light'}
                                                onValueChange={(value) => setThemeSettings({ ...themeSettings, defaultMode: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="light">Light Mode</SelectItem>
                                                    <SelectItem value="dark">Dark Mode</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Preview Panel */}
                                <div className="lg:col-span-1">
                                    {themeSettings && <ThemePreview theme={themeSettings} />}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Branding & Site Info Tab */}
                        <TabsContent value="branding" className="space-y-6">
                            {/* Logos & Icons */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Logos & Icons</CardTitle>
                                    <CardDescription>
                                        Upload and configure your brand logos and icons
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ImageUpload
                                            label="Main Logo"
                                            value={themeSettings?.logoUrl || ''}
                                            onChange={(value) => setThemeSettings({ ...themeSettings, logoUrl: value })}
                                            description="Primary logo for your website"
                                            maxSize={5}
                                        />
                                        <ImageUpload
                                            label="Favicon"
                                            value={themeSettings?.faviconUrl || ''}
                                            onChange={(value) => setThemeSettings({ ...themeSettings, faviconUrl: value })}
                                            description="Browser tab icon (16x16 or 32x32px)"
                                            accept="image/x-icon,image/png"
                                            maxSize={1}
                                        />
                                        <ImageUpload
                                            label="Logo (Light Mode)"
                                            value={themeSettings?.logoLightUrl || ''}
                                            onChange={(value) => setThemeSettings({ ...themeSettings, logoLightUrl: value })}
                                            description="Logo variant for light backgrounds"
                                            maxSize={5}
                                        />
                                        <ImageUpload
                                            label="Logo (Dark Mode)"
                                            value={themeSettings?.logoDarkUrl || ''}
                                            onChange={(value) => setThemeSettings({ ...themeSettings, logoDarkUrl: value })}
                                            description="Logo variant for dark backgrounds"
                                            maxSize={5}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="logoWidth">Logo Width</Label>
                                            <Input
                                                id="logoWidth"
                                                value={themeSettings?.logoWidth || '150px'}
                                                onChange={(e) => setThemeSettings({ ...themeSettings, logoWidth: e.target.value })}
                                                placeholder="150px"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="logoHeight">Logo Height</Label>
                                            <Input
                                                id="logoHeight"
                                                value={themeSettings?.logoHeight || '40px'}
                                                onChange={(e) => setThemeSettings({ ...themeSettings, logoHeight: e.target.value })}
                                                placeholder="40px"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Site Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Site Information</CardTitle>
                                    <CardDescription>
                                        Basic information about your website
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="siteName">Site Name</Label>
                                        <Input
                                            id="siteName"
                                            value={themeSettings?.siteName || 'Digital Marketplace'}
                                            onChange={(e) => setThemeSettings({ ...themeSettings, siteName: e.target.value })}
                                            placeholder="Digital Marketplace"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="siteTagline">Site Tagline</Label>
                                        <Input
                                            id="siteTagline"
                                            value={themeSettings?.siteTagline || ''}
                                            onChange={(e) => setThemeSettings({ ...themeSettings, siteTagline: e.target.value })}
                                            placeholder="Your trusted digital marketplace"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="siteDescription">Site Description</Label>
                                        <Input
                                            id="siteDescription"
                                            value={themeSettings?.siteDescription || ''}
                                            onChange={(e) => setThemeSettings({ ...themeSettings, siteDescription: e.target.value })}
                                            placeholder="A brief description of your marketplace"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="copyrightText">Copyright Text</Label>
                                        <Input
                                            id="copyrightText"
                                            value={themeSettings?.copyrightText || ''}
                                            onChange={(e) => setThemeSettings({ ...themeSettings, copyrightText: e.target.value })}
                                            placeholder="© 2024 Your Company. All rights reserved."
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SEO & Meta */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>SEO & Meta Tags</CardTitle>
                                    <CardDescription>
                                        Optimize your site for search engines and social sharing
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="metaTitle">Meta Title</Label>
                                        <Input
                                            id="metaTitle"
                                            value={themeSettings?.metaTitle || ''}
                                            onChange={(e) => setThemeSettings({ ...themeSettings, metaTitle: e.target.value })}
                                            placeholder="Digital Marketplace - Buy & Sell Digital Products"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="metaDescription">Meta Description</Label>
                                        <Input
                                            id="metaDescription"
                                            value={themeSettings?.metaDescription || ''}
                                            onChange={(e) => setThemeSettings({ ...themeSettings, metaDescription: e.target.value })}
                                            placeholder="Discover and purchase high-quality digital products..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="metaKeywords">Meta Keywords</Label>
                                        <Input
                                            id="metaKeywords"
                                            value={themeSettings?.metaKeywords || ''}
                                            onChange={(e) => setThemeSettings({ ...themeSettings, metaKeywords: e.target.value })}
                                            placeholder="digital marketplace, buy digital products, sell online"
                                        />
                                    </div>

                                    <Separator />

                                    <ImageUpload
                                        label="Open Graph Image"
                                        value={themeSettings?.ogImage || ''}
                                        onChange={(value) => setThemeSettings({ ...themeSettings, ogImage: value })}
                                        description="Image shown when sharing on social media (1200x630px recommended)"
                                        maxSize={5}
                                    />
                                </CardContent>
                            </Card>

                            {/* Social Media Links */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Social Media Links</CardTitle>
                                    <CardDescription>
                                        Connect your social media profiles
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="facebookUrl">Facebook URL</Label>
                                            <Input
                                                id="facebookUrl"
                                                value={themeSettings?.facebookUrl || ''}
                                                onChange={(e) => setThemeSettings({ ...themeSettings, facebookUrl: e.target.value })}
                                                placeholder="https://facebook.com/yourpage"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                                            <Input
                                                id="twitterUrl"
                                                value={themeSettings?.twitterUrl || ''}
                                                onChange={(e) => setThemeSettings({ ...themeSettings, twitterUrl: e.target.value })}
                                                placeholder="https://twitter.com/yourhandle"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="instagramUrl">Instagram URL</Label>
                                            <Input
                                                id="instagramUrl"
                                                value={themeSettings?.instagramUrl || ''}
                                                onChange={(e) => setThemeSettings({ ...themeSettings, instagramUrl: e.target.value })}
                                                placeholder="https://instagram.com/yourprofile"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                                            <Input
                                                id="linkedinUrl"
                                                value={themeSettings?.linkedinUrl || ''}
                                                onChange={(e) => setThemeSettings({ ...themeSettings, linkedinUrl: e.target.value })}
                                                placeholder="https://linkedin.com/company/yourcompany"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="youtubeUrl">YouTube URL</Label>
                                            <Input
                                                id="youtubeUrl"
                                                value={themeSettings?.youtubeUrl || ''}
                                                onChange={(e) => setThemeSettings({ ...themeSettings, youtubeUrl: e.target.value })}
                                                placeholder="https://youtube.com/@yourchannel"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="githubUrl">GitHub URL</Label>
                                            <Input
                                                id="githubUrl"
                                                value={themeSettings?.githubUrl || ''}
                                                onChange={(e) => setThemeSettings({ ...themeSettings, githubUrl: e.target.value })}
                                                placeholder="https://github.com/yourorg"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                    <CardDescription>
                                        Your business contact details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="contactEmail">Contact Email</Label>
                                            <Input
                                                id="contactEmail"
                                                type="email"
                                                value={themeSettings?.contactEmail || ''}
                                                onChange={(e) => setThemeSettings({ ...themeSettings, contactEmail: e.target.value })}
                                                placeholder="contact@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="supportEmail">Support Email</Label>
                                            <Input
                                                id="supportEmail"
                                                type="email"
                                                value={themeSettings?.supportEmail || ''}
                                                onChange={(e) => setThemeSettings({ ...themeSettings, supportEmail: e.target.value })}
                                                placeholder="support@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contactPhone">Contact Phone</Label>
                                            <Input
                                                id="contactPhone"
                                                value={themeSettings?.contactPhone || ''}
                                                onChange={(e) => setThemeSettings({ ...themeSettings, contactPhone: e.target.value })}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contactAddress">Business Address</Label>
                                            <Input
                                                id="contactAddress"
                                                value={themeSettings?.contactAddress || ''}
                                                onChange={(e) => setThemeSettings({ ...themeSettings, contactAddress: e.target.value })}
                                                placeholder="123 Main St, City, Country"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Footer Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Footer Settings</CardTitle>
                                    <CardDescription>
                                        Configure your website footer
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="footerText">Footer Text</Label>
                                        <Input
                                            id="footerText"
                                            value={themeSettings?.footerText || ''}
                                            onChange={(e) => setThemeSettings({ ...themeSettings, footerText: e.target.value })}
                                            placeholder="Additional footer information"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="showSocialLinks"
                                            checked={themeSettings?.showSocialLinks ?? true}
                                            onChange={(e) => setThemeSettings({ ...themeSettings, showSocialLinks: e.target.checked })}
                                            className="rounded"
                                        />
                                        <Label htmlFor="showSocialLinks">Show Social Media Links in Footer</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="showContactInfo"
                                            checked={themeSettings?.showContactInfo ?? true}
                                            onChange={(e) => setThemeSettings({ ...themeSettings, showContactInfo: e.target.checked })}
                                            className="rounded"
                                        />
                                        <Label htmlFor="showContactInfo">Show Contact Information in Footer</Label>
                                    </div>

                                    <Separator />

                                    <Button onClick={handleSaveTheme} disabled={saving}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {saving ? 'Saving...' : 'Save Branding Settings'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Platform Settings Tab */}
                        <TabsContent value="platform" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Platform Configuration</CardTitle>
                                    <CardDescription>
                                        Configure platform-wide operational settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="platformFee">Platform Fee (%)</Label>
                                        <Input
                                            id="platformFee"
                                            type="number"
                                            value={platformSettings?.platformFeePercent || 30}
                                            onChange={(e) => setPlatformSettings({ ...platformSettings, platformFeePercent: parseFloat(e.target.value) })}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Percentage fee charged on each transaction
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label htmlFor="disputePeriod">Dispute Period (Days)</Label>
                                        <Input
                                            id="disputePeriod"
                                            type="number"
                                            value={platformSettings?.disputePeriodDays || 14}
                                            onChange={(e) => setPlatformSettings({ ...platformSettings, disputePeriodDays: parseInt(e.target.value) })}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Number of days buyers can open a dispute after purchase
                                        </p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label htmlFor="escrowHold">Escrow Hold Period (Days)</Label>
                                        <Input
                                            id="escrowHold"
                                            type="number"
                                            value={platformSettings?.escrowHoldDays || 7}
                                            onChange={(e) => setPlatformSettings({ ...platformSettings, escrowHoldDays: parseInt(e.target.value) })}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Number of days to hold funds in escrow before release
                                        </p>
                                    </div>

                                    <Separator />

                                    <Button onClick={handleSavePlatform} disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Platform Settings'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
