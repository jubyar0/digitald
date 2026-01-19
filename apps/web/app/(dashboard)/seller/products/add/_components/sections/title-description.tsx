'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon,
    Image as ImageIcon, Video, Sparkles, AlignLeft, AlignCenter, AlignRight,
    Baseline, MoreHorizontal, Loader2, Type, Heading1, Heading2, Quote,
    Code, Strikethrough, Undo, Redo, FileText, Wand2, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TitleDescriptionSectionProps {
    name: string;
    description: string;
    aiEnabled: boolean;
    aiDialogOpen: boolean;
    aiPrompt: string;
    isGenerating: boolean;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setAiDialogOpen: (open: boolean) => void;
    setAiPrompt: React.Dispatch<React.SetStateAction<string>>;
    handleAIGenerate: () => void;
}

type TextFormat = 'paragraph' | 'h1' | 'h2' | 'h3' | 'quote' | 'code';

interface ToolbarButton {
    icon: React.ElementType;
    label: string;
    action: () => void;
    active?: boolean;
}

export function TitleDescriptionSection({
    name,
    description,
    aiEnabled,
    aiDialogOpen,
    aiPrompt,
    isGenerating,
    onNameChange,
    onDescriptionChange,
    setAiDialogOpen,
    setAiPrompt,
    handleAIGenerate
}: TitleDescriptionSectionProps) {
    const [charCount, setCharCount] = useState(0);
    const [textFormat, setTextFormat] = useState<TextFormat>('paragraph');
    const [isFocused, setIsFocused] = useState(false);
    const [aiTone, setAiTone] = useState<'professional' | 'casual' | 'persuasive'>('professional');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setCharCount(description.length);
    }, [description]);

    const formatLabel: Record<TextFormat, { label: string; icon: any }> = {
        paragraph: { label: 'Paragraph', icon: Type },
        h1: { label: 'Heading 1', icon: Heading1 },
        h2: { label: 'Heading 2', icon: Heading2 },
        h3: { label: 'Heading 3', icon: Heading2 },
        quote: { label: 'Quote', icon: Quote },
        code: { label: 'Code', icon: Code },
    };

    const CurrentFormatIcon = formatLabel[textFormat].icon;

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                {/* Title Section */}
                <div className="p-4 pb-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="name" className="text-sm font-medium">Title</Label>
                        <span className={cn(
                            "text-xs transition-colors",
                            name.length > 0 ? "text-muted-foreground" : "text-destructive"
                        )}>
                            {name.length > 0 ? `${name.length}/70` : 'Required'}
                        </span>
                    </div>
                    <Input
                        id="name"
                        name="name"
                        value={name}
                        onChange={onNameChange}
                        placeholder="Enter product name..."
                        className={cn(
                            "text-base font-medium h-11 transition-all",
                            name.length > 0 && "border-emerald-200 focus:border-emerald-400"
                        )}
                        required
                    />
                    {name.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Good title length for SEO</span>
                        </div>
                    )}
                </div>

                <Separator />

                {/* Description Section */}
                <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{charCount} characters</span>
                            {aiEnabled && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                onClick={() => setAiDialogOpen(true)}
                                            >
                                                <Sparkles className="h-3.5 w-3.5 mr-1" />
                                                AI Write
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Generate description with AI</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>

                    {/* Editor */}
                    <div className={cn(
                        "border rounded-lg transition-all overflow-hidden",
                        isFocused && "ring-2 ring-ring ring-offset-2"
                    )}>
                        {/* Toolbar */}
                        <div className="flex items-center gap-0.5 p-1.5 border-b bg-muted/20 flex-wrap">
                            {/* Text Format Dropdown */}
                            <Select value={textFormat} onValueChange={(val) => setTextFormat(val as TextFormat)}>
                                <SelectTrigger className="h-7 w-[100px] border-none bg-transparent hover:bg-muted focus:ring-0 text-xs">
                                    <div className="flex items-center gap-1">
                                        <CurrentFormatIcon className="h-3 w-3" />
                                        <SelectValue />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(formatLabel).map(([key, { label, icon: Icon }]) => (
                                        <SelectItem key={key} value={key} className="text-xs">
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-3.5 w-3.5" />
                                                {label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Separator orientation="vertical" className="h-4 mx-1" />

                            {/* Basic Formatting */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <Bold className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Bold (Ctrl+B)</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <Italic className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Italic (Ctrl+I)</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <Underline className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Underline (Ctrl+U)</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <Strikethrough className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Strikethrough</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <Separator orientation="vertical" className="h-4 mx-1" />

                            {/* Alignment */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <AlignLeft className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Align left</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <AlignCenter className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Align center</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Lists */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <List className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Bullet list</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <ListOrdered className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Numbered list</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <Separator orientation="vertical" className="h-4 mx-1" />

                            {/* Media */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <LinkIcon className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Insert link</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <ImageIcon className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Insert image</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <Video className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Insert video</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <div className="flex-1" />

                            {/* Undo/Redo */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                                            <Undo className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Undo (Ctrl+Z)</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                                            <Redo className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">Redo (Ctrl+Y)</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        {/* Text Area */}
                        <Textarea
                            ref={textareaRef}
                            id="description"
                            name="description"
                            value={description}
                            onChange={onDescriptionChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="border-0 focus-visible:ring-0 min-h-[180px] resize-y p-4 text-sm leading-relaxed"
                            placeholder="Write a compelling product description that highlights features, benefits, and what makes your product special..."
                        />

                        {/* Editor Footer */}
                        {description.length > 0 && (
                            <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/10">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span>{description.split(/\s+/).filter(Boolean).length} words</span>
                                    <span>•</span>
                                    <span>~{Math.ceil(description.split(/\s+/).filter(Boolean).length / 200)} min read</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                    onClick={() => setAiDialogOpen(true)}
                                >
                                    <Wand2 className="h-3 w-3 mr-1" />
                                    Improve with AI
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>

            {/* AI Generation Dialog */}
            <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            AI Description Generator
                        </DialogTitle>
                        <DialogDescription>
                            Describe your product and let AI craft a compelling description
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Tone Selection */}
                        <div className="space-y-2">
                            <Label className="text-sm">Tone of voice</Label>
                            <div className="flex gap-2">
                                {(['professional', 'casual', 'persuasive'] as const).map((tone) => (
                                    <Button
                                        key={tone}
                                        type="button"
                                        variant={aiTone === tone ? 'default' : 'outline'}
                                        size="sm"
                                        className="flex-1 capitalize"
                                        onClick={() => setAiTone(tone)}
                                    >
                                        {tone}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Prompt Input */}
                        <div className="space-y-2">
                            <Label className="text-sm">Product details</Label>
                            <Textarea
                                placeholder="E.g., A premium cotton t-shirt, breathable fabric, available in 5 colors, perfect for summer outdoor activities..."
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                className="min-h-[120px] resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                Include key features, materials, use cases, and target audience
                            </p>
                        </div>

                        {/* Quick Prompts */}
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Quick prompts</Label>
                            <div className="flex flex-wrap gap-1.5">
                                {['Include benefits', 'Add specifications', 'Compare to competitors', 'Mention warranty'].map((prompt) => (
                                    <Badge
                                        key={prompt}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-muted transition-colors text-xs"
                                        onClick={() => setAiPrompt(prev => prev + (prev ? '. ' : '') + prompt)}
                                    >
                                        + {prompt}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAiDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleAIGenerate}
                            disabled={isGenerating || !aiPrompt.trim()}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
