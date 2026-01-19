// components/page-builder/editor/EditorLayout.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useEditorStore } from '@/lib/page-builder/store';
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { ComponentPanel } from '../sidebar/ComponentPanel';
import { PropertyEditor } from '../sidebar/PropertyEditor';
import { LayersPanel } from '../sidebar/LayersPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { toast } from 'sonner';
import { Blocks, Settings2, Layers, Eye, PenTool, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PageSchema } from '@/lib/page-builder/types';

interface EditorLayoutProps {
    initialSchema: PageSchema;
    onSave: (schema: PageSchema) => Promise<void>;
}

export function EditorLayout({ initialSchema, onSave }: EditorLayoutProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [viewMode, setViewMode] = useState<'canvas' | 'preview' | 'split'>('canvas');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const setSchema = useEditorStore((state) => state.setSchema);
    const getSchema = useEditorStore((state) => state.getSchema);
    const schema = useEditorStore((state) => state.schema);
    const markClean = useEditorStore((state) => state.markClean);
    const saveToHistory = useEditorStore((state) => state.saveToHistory);
    const undo = useEditorStore((state) => state.undo);
    const redo = useEditorStore((state) => state.redo);
    const device = useEditorStore((state) => state.device);
    const activeSidebarTab = useEditorStore((state) => state.activeSidebarTab);
    const setActiveSidebarTab = useEditorStore((state) => state.setActiveSidebarTab);

    // Device widths for preview
    const deviceWidths = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
    };

    // Initialize schema on mount
    useEffect(() => {
        setSchema(initialSchema);
    }, [initialSchema, setSchema]);

    // Sync preview iframe with schema changes
    useEffect(() => {
        if (iframeRef.current?.contentWindow && schema) {
            iframeRef.current.contentWindow.postMessage(
                {
                    type: 'PAGE_BUILDER_SYNC',
                    schema: schema,
                },
                window.location.origin
            );
        }
    }, [schema]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + Z = Undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y = Redo
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
            // Ctrl/Cmd + S = Save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            // Ctrl/Cmd + P = Toggle Preview
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                setViewMode(viewMode === 'preview' ? 'canvas' : 'preview');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, viewMode]);

    // Warn before leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const currentSchema = getSchema();
            if (currentSchema) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [getSchema]);

    const handleSave = useCallback(async () => {
        const currentSchema = getSchema();
        if (!currentSchema) return;

        setIsSaving(true);
        try {
            // Update timestamps
            const schemaToSave: PageSchema = {
                ...currentSchema,
                updatedAt: new Date().toISOString(),
            };

            await onSave(schemaToSave);
            markClean();
            toast.success('Page saved successfully');
        } catch (error) {
            console.error('Failed to save page:', error);
            toast.error('Failed to save page');
        } finally {
            setIsSaving(false);
        }
    }, [getSchema, onSave, markClean]);

    const handleRefreshPreview = () => {
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
    };

    const handleOpenExternal = () => {
        window.open(`/preview/${initialSchema.slug}`, '_blank');
    };

    // Live Preview Component
    const LivePreview = () => (
        <div className="h-full flex flex-col bg-muted/30">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Live Preview</span>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                        {device}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleRefreshPreview}
                        title="Refresh Preview"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleOpenExternal}
                        title="Open in New Tab"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Preview Container */}
            <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
                <div
                    className="bg-background shadow-xl rounded-lg overflow-hidden transition-all duration-300"
                    style={{
                        width: deviceWidths[device],
                        maxWidth: deviceWidths[device],
                        minHeight: '500px',
                    }}
                >
                    <iframe
                        ref={iframeRef}
                        src={`/preview/${initialSchema.slug}?editor=true`}
                        className="w-full border-0"
                        style={{ minHeight: '600px', height: '100%' }}
                        title="Live Preview"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Toolbar */}
            <EditorToolbar
                onSave={handleSave}
                isSaving={isSaving}
                pageTitle={initialSchema.title}
            />

            {/* View Mode Toggle */}
            <div className="flex items-center justify-center gap-1 py-2 border-b bg-muted/30">
                <Button
                    variant={viewMode === 'canvas' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('canvas')}
                    className="gap-2"
                >
                    <PenTool className="h-4 w-4" />
                    Editor
                </Button>
                <Button
                    variant={viewMode === 'split' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('split')}
                    className="gap-2"
                >
                    <div className="flex gap-0.5">
                        <div className="w-2 h-4 border border-current rounded-sm" />
                        <div className="w-2 h-4 border border-current rounded-sm" />
                    </div>
                    Split
                </Button>
                <Button
                    variant={viewMode === 'preview' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('preview')}
                    className="gap-2"
                >
                    <Eye className="h-4 w-4" />
                    Preview
                </Button>
            </div>

            {/* Main Editor Area */}
            <ResizablePanelGroup direction="horizontal" className="flex-1">
                {/* Left Sidebar - Components (hidden in preview mode) */}
                {viewMode !== 'preview' && (
                    <>
                        <ResizablePanel defaultSize={18} minSize={15} maxSize={25}>
                            <div className="h-full border-r bg-background">
                                <ComponentPanel />
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                    </>
                )}

                {/* Canvas / Preview Area */}
                {viewMode === 'canvas' && (
                    <ResizablePanel defaultSize={57}>
                        <EditorCanvas />
                    </ResizablePanel>
                )}

                {viewMode === 'split' && (
                    <>
                        <ResizablePanel defaultSize={35}>
                            <EditorCanvas />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={35}>
                            <LivePreview />
                        </ResizablePanel>
                    </>
                )}

                {viewMode === 'preview' && (
                    <ResizablePanel defaultSize={75}>
                        <LivePreview />
                    </ResizablePanel>
                )}

                {/* Right Sidebar - Properties/Layers (hidden in preview mode) */}
                {viewMode !== 'preview' && (
                    <>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                            <div className="h-full border-l bg-background">
                                <Tabs
                                    value={activeSidebarTab}
                                    onValueChange={(v) => setActiveSidebarTab(v as any)}
                                    className="h-full flex flex-col"
                                >
                                    <TabsList className="w-full grid grid-cols-3 m-2 mr-4">
                                        <TabsTrigger value="components" className="gap-1">
                                            <Blocks className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Add</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="properties" className="gap-1">
                                            <Settings2 className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Properties</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="layers" className="gap-1">
                                            <Layers className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Layers</span>
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="components" className="flex-1 m-0 overflow-hidden">
                                        <ComponentPanel />
                                    </TabsContent>

                                    <TabsContent value="properties" className="flex-1 m-0 overflow-hidden">
                                        <PropertyEditor />
                                    </TabsContent>

                                    <TabsContent value="layers" className="flex-1 m-0 overflow-hidden">
                                        <LayersPanel />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>
        </div>
    );
}

