// components/page-builder/editor/EditorToolbar.tsx
'use client';

import { useEditorStore } from '@/lib/page-builder/store';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Monitor,
    Tablet,
    Smartphone,
    Undo2,
    Redo2,
    Eye,
    Pencil,
    Save,
    Loader2,
} from 'lucide-react';

interface EditorToolbarProps {
    onSave: () => void;
    isSaving: boolean;
    pageTitle?: string;
}

export function EditorToolbar({ onSave, isSaving, pageTitle }: EditorToolbarProps) {
    const device = useEditorStore((state) => state.device);
    const setDevice = useEditorStore((state) => state.setDevice);
    const editorMode = useEditorStore((state) => state.editorMode);
    const setEditorMode = useEditorStore((state) => state.setEditorMode);
    const undo = useEditorStore((state) => state.undo);
    const redo = useEditorStore((state) => state.redo);
    const canUndo = useEditorStore((state) => state.canUndo);
    const canRedo = useEditorStore((state) => state.canRedo);
    const isDirty = useEditorStore((state) => state.isDirty);

    return (
        <TooltipProvider>
            <div className="h-14 border-b bg-background flex items-center justify-between px-4 shrink-0">
                {/* Left: Page Title */}
                <div className="flex items-center gap-4">
                    <h1 className="text-sm font-semibold truncate max-w-[200px]">
                        {pageTitle || 'Untitled Page'}
                    </h1>
                    {isDirty && (
                        <span className="text-xs text-muted-foreground">(unsaved)</span>
                    )}
                </div>

                {/* Center: Device Selector + History */}
                <div className="flex items-center gap-2">
                    {/* Device Toggle */}
                    <ToggleGroup
                        type="single"
                        value={device}
                        onValueChange={(v) => v && setDevice(v as 'desktop' | 'tablet' | 'mobile')}
                        className="bg-muted rounded-lg p-0.5"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ToggleGroupItem value="desktop" size="sm" className="h-8 w-8">
                                    <Monitor className="h-4 w-4" />
                                </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>Desktop</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ToggleGroupItem value="tablet" size="sm" className="h-8 w-8">
                                    <Tablet className="h-4 w-4" />
                                </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>Tablet</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ToggleGroupItem value="mobile" size="sm" className="h-8 w-8">
                                    <Smartphone className="h-4 w-4" />
                                </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>Mobile</TooltipContent>
                        </Tooltip>
                    </ToggleGroup>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    {/* History Controls */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={undo}
                                disabled={!canUndo()}
                            >
                                <Undo2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={redo}
                                disabled={!canRedo()}
                            >
                                <Redo2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                    </Tooltip>
                </div>

                {/* Right: Mode Toggle + Save */}
                <div className="flex items-center gap-2">
                    {/* Mode Toggle */}
                    <ToggleGroup
                        type="single"
                        value={editorMode}
                        onValueChange={(v) => v && setEditorMode(v as 'edit' | 'preview')}
                        className="bg-muted rounded-lg p-0.5"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ToggleGroupItem value="edit" size="sm" className="h-8 px-3">
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Edit
                                </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>Edit Mode</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ToggleGroupItem value="preview" size="sm" className="h-8 px-3">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Preview
                                </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent>Preview Mode</TooltipContent>
                        </Tooltip>
                    </ToggleGroup>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    {/* Save Button */}
                    <Button
                        onClick={onSave}
                        disabled={!isDirty || isSaving}
                        className="h-8"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-1" />
                                Save
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </TooltipProvider>
    );
}
