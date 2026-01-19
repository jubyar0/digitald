// components/page-builder/sidebar/ComponentPanel.tsx
'use client';

import { useMemo } from 'react';
import { useEditorStore } from '@/lib/page-builder/store';
import { registry, componentCategories } from '@/lib/page-builder/components';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import {
    LayoutTemplate,
    Type,
    Image,
    MousePointerClick,
    Sparkles,
    Square,
    Grid3X3,
    AlignHorizontalJustifyCenter,
    Heading,
    AlignLeft,
    Minus,
    SeparatorVertical,
    Layers,
    SquareDashed,
    MoveHorizontal,
    Hash,
    Grid2X2,
    Wand2,
    Stars,
    Sparkle,
    Circle,
    Lightbulb,
    RectangleHorizontal,
    Scan,
    Zap,
    GripVertical,
    TextCursor,
    AlignJustify,
    PanelTop,
    Quote,
    LayoutGrid,
} from 'lucide-react';
import type { ComponentCategory } from '@/lib/page-builder/registry';

// Icon mapping
const iconMap: Record<string, any> = {
    LayoutTemplate,
    Type,
    Image,
    MousePointerClick,
    Sparkles,
    Square,
    Grid3X3,
    AlignHorizontalJustifyCenter,
    Heading,
    AlignLeft,
    Minus,
    SeparatorVertical,
    Layers,
    SquareDashed,
    MoveHorizontal,
    Hash,
    Grid2X2,
    Wand2,
    Stars,
    Sparkle,
    Circle,
    Lightbulb,
    RectangleHorizontal,
    Scan,
    Zap,
    GripVertical,
    TextCursor,
    AlignJustify,
    PanelTop,
    Quote,
    LayoutGrid,
};

const categoryIcons: Record<string, any> = {
    layout: LayoutTemplate,
    content: Type,
    media: Image,
    interactive: MousePointerClick,
    'magic-ui': Sparkles,
    aceternity: Wand2,
};

interface DraggableComponentProps {
    type: string;
    label: string;
    description?: string;
    icon: string;
}

function DraggableComponent({ type, label, description, icon }: DraggableComponentProps) {
    const addElement = useEditorStore((state) => state.addElement);
    const saveToHistory = useEditorStore((state) => state.saveToHistory);

    const IconComponent = iconMap[icon] || Square;

    const handleClick = () => {
        const definition = registry.get(type);
        if (!definition) return;

        // Save to history before adding
        saveToHistory();

        // Add element with defaults
        addElement({
            type,
            props: { ...definition.defaultProps },
            styles: { ...definition.defaultStyles },
            meta: {
                label: definition.label,
                locked: false,
                hidden: false,
                zIndex: 1,
            },
            children: definition.allowChildren ? [] : undefined,
        });
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('application/page-builder-component', type);
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <button
            onClick={handleClick}
            draggable
            onDragStart={handleDragStart}
            className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg border border-transparent',
                'bg-muted/50 hover:bg-muted hover:border-border',
                'transition-all duration-150 text-left cursor-grab active:cursor-grabbing',
                'hover:shadow-sm'
            )}
        >
            <div className="flex-shrink-0 h-9 w-9 rounded-md bg-background flex items-center justify-center border group-hover:border-primary/20">
                <IconComponent className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{label}</p>
                {description && (
                    <p className="text-xs text-muted-foreground truncate">{description}</p>
                )}
            </div>
            <GripVertical className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}

export function ComponentPanel() {
    const componentsByCategory = useMemo(() => {
        const result: Record<ComponentCategory, Array<{ type: string; label: string; description?: string; icon: string }>> = {
            layout: [],
            content: [],
            media: [],
            interactive: [],
            'magic-ui': [],
            aceternity: [],
        };

        registry.getAll().forEach((def, type) => {
            if (result[def.category]) {
                result[def.category].push({
                    type,
                    label: def.label,
                    description: def.description,
                    icon: def.icon,
                });
            }
        });

        return result;
    }, []);

    return (
        <ScrollArea className="h-full">
            <div className="p-4">
                <h3 className="font-semibold mb-4">Components</h3>

                <Accordion type="multiple" defaultValue={['layout', 'content', 'magic-ui']} className="space-y-2">
                    {componentCategories.map((category) => {
                        const components = componentsByCategory[category.id];
                        if (!components || components.length === 0) return null;

                        const CategoryIcon = categoryIcons[category.id] || Square;

                        return (
                            <AccordionItem key={category.id} value={category.id} className="border rounded-lg">
                                <AccordionTrigger className="px-3 py-2 hover:no-underline">
                                    <div className="flex items-center gap-2">
                                        <CategoryIcon className="h-4 w-4" />
                                        <span className="text-sm font-medium">{category.label}</span>
                                        <span className="text-xs text-muted-foreground">({components.length})</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-2 pb-2">
                                    <div className="space-y-2">
                                        {components.map((comp) => (
                                            <DraggableComponent
                                                key={comp.type}
                                                type={comp.type}
                                                label={comp.label}
                                                description={comp.description}
                                                icon={comp.icon}
                                            />
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </ScrollArea>
    );
}
