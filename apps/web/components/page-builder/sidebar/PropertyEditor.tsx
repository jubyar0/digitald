// components/page-builder/sidebar/PropertyEditor.tsx
'use client';

import { useEditorStore, useSelectedElement } from '@/lib/page-builder/store';
import { registry } from '@/lib/page-builder/components';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SpacingEditor } from './SpacingEditor';
import { Copy, Trash2, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import type { PropEditor } from '@/lib/page-builder/registry';

// Helper to get nested value by path
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function PropertyEditor() {
    const selectedElement = useSelectedElement();
    const selectedId = useEditorStore((state) => state.selectedId);
    const updateElementProp = useEditorStore((state) => state.updateElementProp);
    const updateElementStyle = useEditorStore((state) => state.updateElementStyle);
    const updateElementMeta = useEditorStore((state) => state.updateElementMeta);
    const toggleLock = useEditorStore((state) => state.toggleLock);
    const toggleVisibility = useEditorStore((state) => state.toggleVisibility);
    const removeElement = useEditorStore((state) => state.removeElement);
    const duplicateElement = useEditorStore((state) => state.duplicateElement);
    const saveToHistory = useEditorStore((state) => state.saveToHistory);

    if (!selectedElement || !selectedId) {
        return (
            <div className="p-6 text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                <div className="mb-2 text-4xl">🎨</div>
                <p className="font-medium">No Element Selected</p>
                <p className="text-sm mt-1">Click on an element to edit its properties</p>
            </div>
        );
    }

    const definition = registry.get(selectedElement.type);
    if (!definition) {
        return (
            <div className="p-4 text-center text-destructive">
                Unknown component type: {selectedElement.type}
            </div>
        );
    }

    const handlePropChange = (editor: PropEditor, value: unknown) => {
        saveToHistory();

        if (editor.key.startsWith('styles.')) {
            updateElementStyle(selectedId, editor.key.replace('styles.', ''), value);
        } else if (editor.key.startsWith('props.')) {
            updateElementProp(selectedId, editor.key.replace('props.', ''), value);
        } else if (editor.key.startsWith('meta.')) {
            updateElementMeta(selectedId, editor.key.replace('meta.', ''), value);
        }
    };

    const getValue = (path: string): any => {
        const prefix = path.split('.')[0];
        const restPath = path.split('.').slice(1).join('.');

        if (prefix === 'props') return getNestedValue(selectedElement.props, restPath);
        if (prefix === 'styles') return getNestedValue(selectedElement.styles, restPath);
        if (prefix === 'meta') return getNestedValue(selectedElement.meta, restPath);
        return undefined;
    };

    const renderPropEditor = (editor: PropEditor) => {
        const currentValue = getValue(editor.key);

        switch (editor.type) {
            case 'text':
                return (
                    <Input
                        value={(currentValue as string) ?? ''}
                        onChange={(e) => handlePropChange(editor, e.target.value)}
                        placeholder={editor.placeholder}
                    />
                );

            case 'textarea':
                return (
                    <Textarea
                        value={(currentValue as string) ?? ''}
                        onChange={(e) => handlePropChange(editor, e.target.value)}
                        placeholder={editor.placeholder}
                        rows={3}
                    />
                );

            case 'number':
                return (
                    <Input
                        type="number"
                        value={(currentValue as number) ?? 0}
                        onChange={(e) => handlePropChange(editor, Number(e.target.value))}
                        min={editor.min}
                        max={editor.max}
                        step={editor.step}
                    />
                );

            case 'color':
                return (
                    <div className="flex gap-2">
                        <div
                            className="h-10 w-10 rounded border cursor-pointer"
                            style={{ backgroundColor: (currentValue as string) ?? '#000000' }}
                        />
                        <Input
                            type="text"
                            value={(currentValue as string) ?? ''}
                            onChange={(e) => handlePropChange(editor, e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                        />
                    </div>
                );

            case 'select':
                return (
                    <Select
                        value={String(currentValue ?? '')}
                        onValueChange={(v) => handlePropChange(editor, v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            {editor.options?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'boolean':
                return (
                    <Switch
                        checked={(currentValue as boolean) ?? false}
                        onCheckedChange={(v) => handlePropChange(editor, v)}
                    />
                );

            case 'spacing':
                return (
                    <SpacingEditor
                        value={currentValue}
                        onChange={(v) => handlePropChange(editor, v)}
                        responsive={editor.responsive}
                    />
                );

            case 'link':
            case 'image':
                return (
                    <Input
                        value={(currentValue as string) ?? ''}
                        onChange={(e) => handlePropChange(editor, e.target.value)}
                        placeholder={editor.type === 'image' ? '/path/to/image.jpg' : 'https://...'}
                    />
                );

            default:
                return <span className="text-sm text-muted-foreground">Unsupported editor: {editor.type}</span>;
        }
    };

    const contentProps = definition.editableProps.filter((e) => e.key.startsWith('props.'));
    const styleProps = definition.editableProps.filter((e) => e.key.startsWith('styles.'));

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
                {/* Element Header */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">{selectedElement.meta.label}</h3>
                            <p className="text-xs text-muted-foreground">{selectedElement.type}</p>
                        </div>
                    </div>

                    {/* Element Actions */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                                saveToHistory();
                                toggleLock(selectedId);
                            }}
                            title={selectedElement.meta.locked ? 'Unlock' : 'Lock'}
                        >
                            {selectedElement.meta.locked ? (
                                <Lock className="h-4 w-4 text-yellow-500" />
                            ) : (
                                <Unlock className="h-4 w-4" />
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                                saveToHistory();
                                toggleVisibility(selectedId);
                            }}
                            title={selectedElement.meta.hidden ? 'Show' : 'Hide'}
                        >
                            {selectedElement.meta.hidden ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>

                        <Separator orientation="vertical" className="h-6 mx-1" />

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                                saveToHistory();
                                duplicateElement(selectedId);
                            }}
                            title="Duplicate"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => {
                                saveToHistory();
                                removeElement(selectedId);
                            }}
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Property Tabs */}
                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="w-full grid grid-cols-3">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="style">Style</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-4 mt-4">
                        {contentProps.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No content properties
                            </p>
                        ) : (
                            contentProps.map((editor) => (
                                <div key={editor.key} className="space-y-2">
                                    <Label className="text-sm">{editor.label}</Label>
                                    {renderPropEditor(editor)}
                                </div>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="style" className="space-y-4 mt-4">
                        {styleProps.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No style properties
                            </p>
                        ) : (
                            styleProps.map((editor) => (
                                <div key={editor.key} className="space-y-2">
                                    <Label className="text-sm">{editor.label}</Label>
                                    {renderPropEditor(editor)}
                                </div>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Label</Label>
                            <Input
                                value={selectedElement.meta.label}
                                onChange={(e) => {
                                    saveToHistory();
                                    updateElementMeta(selectedId, 'label', e.target.value);
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Z-Index</Label>
                            <Input
                                type="number"
                                value={selectedElement.meta.zIndex}
                                onChange={(e) => {
                                    saveToHistory();
                                    updateElementMeta(selectedId, 'zIndex', Number(e.target.value));
                                }}
                                min={0}
                                max={9999}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </ScrollArea>
    );
}
