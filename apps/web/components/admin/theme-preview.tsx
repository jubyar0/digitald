'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface ThemePreviewProps {
    theme: any
}

export function ThemePreview({ theme }: ThemePreviewProps) {
    return (
        <Card className="sticky top-4">
            <CardContent className="p-6 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        See how your theme changes affect the UI elements
                    </p>
                </div>

                <div
                    className="space-y-4 p-4 rounded-lg border-2"
                    style={{
                        backgroundColor: theme.backgroundColor,
                        color: theme.foregroundColor,
                        borderColor: theme.borderColor,
                    }}
                >
                    {/* Buttons */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium opacity-70">Buttons</p>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                className="px-4 py-2 rounded text-sm font-medium"
                                style={{
                                    backgroundColor: theme.primaryColor,
                                    color: '#ffffff',
                                }}
                            >
                                Primary
                            </button>
                            <button
                                className="px-4 py-2 rounded text-sm font-medium"
                                style={{
                                    backgroundColor: theme.secondaryColor,
                                    color: theme.foregroundColor,
                                }}
                            >
                                Secondary
                            </button>
                            <button
                                className="px-4 py-2 rounded text-sm font-medium"
                                style={{
                                    backgroundColor: theme.destructiveColor,
                                    color: '#ffffff',
                                }}
                            >
                                Destructive
                            </button>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium opacity-70">Card</p>
                        <div
                            className="p-4 rounded"
                            style={{
                                backgroundColor: theme.cardColor,
                                color: theme.cardForegroundColor,
                                borderRadius: theme.borderRadius,
                            }}
                        >
                            <h4 className="font-semibold mb-2">Card Title</h4>
                            <p className="text-sm opacity-80">
                                This is a sample card component showing how your theme affects card elements.
                            </p>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium opacity-70">Input</p>
                        <input
                            type="text"
                            placeholder="Sample input field"
                            className="w-full px-3 py-2 rounded text-sm"
                            style={{
                                backgroundColor: theme.inputColor,
                                color: theme.foregroundColor,
                                borderColor: theme.borderColor,
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderRadius: theme.borderRadius,
                            }}
                        />
                    </div>

                    {/* Badge */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium opacity-70">Badges</p>
                        <div className="flex gap-2 flex-wrap">
                            <span
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                    backgroundColor: theme.primaryColor,
                                    color: '#ffffff',
                                }}
                            >
                                Primary
                            </span>
                            <span
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                    backgroundColor: theme.accentColor,
                                    color: theme.foregroundColor,
                                }}
                            >
                                Accent
                            </span>
                            <span
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                    backgroundColor: theme.mutedColor,
                                    color: theme.mutedForegroundColor,
                                }}
                            >
                                Muted
                            </span>
                        </div>
                    </div>

                    {/* Typography */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium opacity-70">Typography</p>
                        <div style={{ fontFamily: theme.fontFamily, fontSize: theme.fontSize }}>
                            <h1 className="text-2xl font-bold mb-1">Heading 1</h1>
                            <h2 className="text-xl font-semibold mb-1">Heading 2</h2>
                            <h3 className="text-lg font-medium mb-1">Heading 3</h3>
                            <p className="text-sm">
                                Regular paragraph text with the selected font family and size.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
