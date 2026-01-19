'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateStorefrontSettings } from "@/actions/storefront"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutGrid, List, GalleryHorizontal } from "lucide-react"

interface StorefrontCustomizerProps {
    initialSettings: any
}

export function StorefrontCustomizer({ initialSettings }: StorefrontCustomizerProps) {
    const [settings, setSettings] = useState(initialSettings)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (key: string, value: string) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setIsLoading(true)
        const result = await updateStorefrontSettings({
            name: settings.name,
            bio: settings.bio,
            themeColor: settings.themeColor,
            featuredLayout: settings.featuredLayout
        })
        setIsLoading(false)

        if (result.success) {
            toast.success("Storefront updated successfully")
        } else {
            toast.error("Failed to update storefront")
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Panel */}
            <Card>
                <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Store Name</Label>
                        <Input
                            value={settings.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea
                            value={settings.bio || ''}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Theme Color</Label>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="color"
                                value={settings.themeColor || '#000000'}
                                onChange={(e) => handleChange('themeColor', e.target.value)}
                                className="w-12 h-12 p-1 cursor-pointer"
                            />
                            <Input
                                value={settings.themeColor || '#000000'}
                                onChange={(e) => handleChange('themeColor', e.target.value)}
                                className="font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Featured Products Layout</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => handleChange('featuredLayout', 'grid')}
                                className={`p-4 border rounded-lg flex flex-col items-center gap-2 hover:bg-muted ${settings.featuredLayout === 'grid' ? 'border-primary bg-muted' : ''}`}
                            >
                                <LayoutGrid className="h-6 w-6" />
                                <span className="text-xs">Grid</span>
                            </button>
                            <button
                                onClick={() => handleChange('featuredLayout', 'list')}
                                className={`p-4 border rounded-lg flex flex-col items-center gap-2 hover:bg-muted ${settings.featuredLayout === 'list' ? 'border-primary bg-muted' : ''}`}
                            >
                                <List className="h-6 w-6" />
                                <span className="text-xs">List</span>
                            </button>
                            <button
                                onClick={() => handleChange('featuredLayout', 'carousel')}
                                className={`p-4 border rounded-lg flex flex-col items-center gap-2 hover:bg-muted ${settings.featuredLayout === 'carousel' ? 'border-primary bg-muted' : ''}`}
                            >
                                <GalleryHorizontal className="h-6 w-6" />
                                <span className="text-xs">Carousel</span>
                            </button>
                        </div>
                    </div>

                    <Button onClick={handleSave} disabled={isLoading} className="w-full">
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </CardContent>
            </Card>

            {/* Live Preview Panel */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Live Preview</h3>
                <div className="border rounded-xl overflow-hidden bg-background shadow-lg" style={{ borderColor: settings.themeColor }}>
                    {/* Mock Banner */}
                    <div className="h-32 bg-muted relative" style={{ backgroundColor: settings.themeColor + '20' }}>
                        <div className="absolute -bottom-8 left-6">
                            <Avatar className="h-20 w-20 border-4 border-background">
                                <AvatarImage src={settings.avatar} />
                                <AvatarFallback>{settings.name?.[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    <div className="pt-10 px-6 pb-6 space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold">{settings.name}</h2>
                            <p className="text-muted-foreground mt-1">{settings.bio || 'No bio yet'}</p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Featured Products</h4>
                            {/* Mock Products based on layout */}
                            <div className={`
                                ${settings.featuredLayout === 'grid' ? 'grid grid-cols-2 gap-4' : ''}
                                ${settings.featuredLayout === 'list' ? 'flex flex-col gap-4' : ''}
                                ${settings.featuredLayout === 'carousel' ? 'flex gap-4 overflow-x-auto pb-2' : ''}
                            `}>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className={`bg-muted/50 rounded-lg p-3 ${settings.featuredLayout === 'list' ? 'flex gap-4 items-center' : ''} ${settings.featuredLayout === 'carousel' ? 'min-w-[150px]' : ''}`}>
                                        <div className={`bg-muted rounded ${settings.featuredLayout === 'list' ? 'h-12 w-12' : 'h-24 w-full mb-2'}`} />
                                        <div className="space-y-1">
                                            <div className="h-4 w-20 bg-muted rounded" />
                                            <div className="h-3 w-12 bg-muted rounded opacity-70" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
