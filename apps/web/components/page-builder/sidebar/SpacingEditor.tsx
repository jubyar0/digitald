// components/page-builder/sidebar/SpacingEditor.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Link2, Link2Off, Monitor, Tablet, Smartphone } from 'lucide-react';
import type { SpacingValue, DeviceType, ResponsiveValue } from '@/lib/page-builder/types';

interface SpacingEditorProps {
    value: ResponsiveValue<SpacingValue> | undefined;
    onChange: (value: ResponsiveValue<SpacingValue>) => void;
    responsive?: boolean;
}

const defaultSpacing: SpacingValue = { top: 0, right: 0, bottom: 0, left: 0 };

export function SpacingEditor({ value, onChange, responsive = false }: SpacingEditorProps) {
    const [linked, setLinked] = useState(false);
    const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');

    // Get current spacing for active device
    const getCurrentSpacing = (): SpacingValue => {
        if (!value) return defaultSpacing;
        if (activeDevice === 'desktop') return value.desktop ?? defaultSpacing;
        if (activeDevice === 'tablet') return value.tablet ?? value.desktop ?? defaultSpacing;
        if (activeDevice === 'mobile') return value.mobile ?? value.tablet ?? value.desktop ?? defaultSpacing;
        return defaultSpacing;
    };

    const currentSpacing = getCurrentSpacing();

    const handleChange = (side: keyof SpacingValue, newValue: number) => {
        const newSpacing = linked
            ? { top: newValue, right: newValue, bottom: newValue, left: newValue }
            : { ...currentSpacing, [side]: newValue };

        const newResponsiveValue: ResponsiveValue<SpacingValue> = {
            desktop: value?.desktop ?? defaultSpacing,
            tablet: value?.tablet,
            mobile: value?.mobile,
        };

        newResponsiveValue[activeDevice] = newSpacing;

        onChange(newResponsiveValue);
    };

    return (
        <div className="space-y-3">
            {/* Device Selector (if responsive) */}
            {responsive && (
                <ToggleGroup
                    type="single"
                    value={activeDevice}
                    onValueChange={(v) => v && setActiveDevice(v as DeviceType)}
                    className="justify-start"
                >
                    <ToggleGroupItem value="desktop" size="sm" className="h-7 w-7">
                        <Monitor className="h-3 w-3" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="tablet" size="sm" className="h-7 w-7">
                        <Tablet className="h-3 w-3" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="mobile" size="sm" className="h-7 w-7">
                        <Smartphone className="h-3 w-3" />
                    </ToggleGroupItem>
                </ToggleGroup>
            )}

            {/* Spacing Grid */}
            <div className="grid grid-cols-3 gap-2 items-center">
                {/* Top Row */}
                <div />
                <div className="space-y-1">
                    <Label className="text-xs text-center block">Top</Label>
                    <Input
                        type="number"
                        value={currentSpacing.top}
                        onChange={(e) => handleChange('top', Number(e.target.value))}
                        className="h-8 text-center text-xs"
                        min={0}
                    />
                </div>
                <div />

                {/* Middle Row */}
                <div className="space-y-1">
                    <Label className="text-xs text-center block">Left</Label>
                    <Input
                        type="number"
                        value={currentSpacing.left}
                        onChange={(e) => handleChange('left', Number(e.target.value))}
                        className="h-8 text-center text-xs"
                        min={0}
                    />
                </div>

                {/* Link Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 mx-auto"
                    onClick={() => setLinked(!linked)}
                    title={linked ? 'Unlink values' : 'Link values'}
                >
                    {linked ? (
                        <Link2 className="h-4 w-4 text-primary" />
                    ) : (
                        <Link2Off className="h-4 w-4" />
                    )}
                </Button>

                <div className="space-y-1">
                    <Label className="text-xs text-center block">Right</Label>
                    <Input
                        type="number"
                        value={currentSpacing.right}
                        onChange={(e) => handleChange('right', Number(e.target.value))}
                        className="h-8 text-center text-xs"
                        min={0}
                    />
                </div>

                {/* Bottom Row */}
                <div />
                <div className="space-y-1">
                    <Label className="text-xs text-center block">Bottom</Label>
                    <Input
                        type="number"
                        value={currentSpacing.bottom}
                        onChange={(e) => handleChange('bottom', Number(e.target.value))}
                        className="h-8 text-center text-xs"
                        min={0}
                    />
                </div>
                <div />
            </div>
        </div>
    );
}
