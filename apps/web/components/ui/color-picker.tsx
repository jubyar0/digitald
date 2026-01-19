'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

interface ColorPickerProps {
    label: string
    value: string
    onChange: (value: string) => void
    description?: string
}

export function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="space-y-2">
            <Label htmlFor={label}>{label}</Label>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <div className="flex gap-2">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-[60px] h-[40px] p-0 border-2"
                            style={{ backgroundColor: value }}
                        >
                            <span className="sr-only">Pick color</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                        <div className="space-y-4">
                            <div>
                                <Label>Color Picker</Label>
                                <input
                                    type="color"
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    className="w-full h-32 cursor-pointer rounded border"
                                />
                            </div>
                            <div>
                                <Label>Hex Value</Label>
                                <Input
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    placeholder="#000000"
                                />
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <Input
                    id={label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                />
            </div>
        </div>
    )
}
