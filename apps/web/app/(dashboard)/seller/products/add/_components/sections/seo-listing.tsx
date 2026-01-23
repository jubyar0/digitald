'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Search, ChevronDown, ChevronUp, Globe, ExternalLink,
    Eye, Edit3, AlertCircle, CheckCircle2, HelpCircle, Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SEOListingSectionProps {
    productTitle?: string;
    productDescription?: string;
    seoTitle?: string;
    seoDescription?: string;
    urlHandle?: string;
    onSeoTitleChange?: (value: string) => void;
    onSeoDescriptionChange?: (value: string) => void;
    onUrlHandleChange?: (value: string) => void;
}

export function SEOListingSection({
    productTitle = '',
    productDescription = '',
    seoTitle = '',
    seoDescription = '',
    urlHandle = '',
    onSeoTitleChange = () => { },
    onSeoDescriptionChange = () => { },
    onUrlHandleChange = () => { }
}: SEOListingSectionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Generate defaults from product data
    const displayTitle = seoTitle || productTitle || 'Product title';
    const displayDescription = seoDescription || productDescription?.substring(0, 160) || 'Product description will appear here...';
    const displayHandle = urlHandle || productTitle?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'product-url';

    // SEO Score calculation
    const seoScore = useMemo(() => {
        let score = 0;
        if ((seoTitle || productTitle).length >= 30 && (seoTitle || productTitle).length <= 60) score += 25;
        else if ((seoTitle || productTitle).length > 0) score += 10;

        if ((seoDescription || productDescription).length >= 120 && (seoDescription || productDescription).length <= 160) score += 25;
        else if ((seoDescription || productDescription).length > 0) score += 10;

        if (urlHandle || productTitle) score += 25;
        if (productDescription) score += 25;

        return Math.min(score, 100);
    }, [seoTitle, seoDescription, urlHandle, productTitle, productDescription]);

    const seoStatus = seoScore >= 80 ? 'good' : seoScore >= 50 ? 'ok' : 'poor';

    return (
        <Card className="overflow-hidden">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className="px-4 py-3 border-b bg-muted/30">
                    <CollapsibleTrigger className="flex items-center justify-between w-full group">
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-sm font-semibold">Search engine listing</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "h-5 px-2 text-[10px]",
                                    seoStatus === 'good' && "bg-emerald-50 text-emerald-700",
                                    seoStatus === 'ok' && "bg-amber-50 text-amber-700",
                                    seoStatus === 'poor' && "bg-red-50 text-red-700"
                                )}
                            >
                                {seoStatus === 'good' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                {seoStatus === 'ok' && <AlertCircle className="h-3 w-3 mr-1" />}
                                {seoStatus === 'poor' && <AlertCircle className="h-3 w-3 mr-1" />}
                                SEO {seoScore}%
                            </Badge>
                            {isOpen ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            )}
                        </div>
                    </CollapsibleTrigger>
                </CardHeader>

                <CollapsibleContent>
                    <CardContent className="p-4 space-y-4">
                        {/* Google Preview */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                    Search preview
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    <Edit3 className="h-3 w-3 mr-1" />
                                    {isEditing ? 'Done' : 'Edit'}
                                </Button>
                            </div>

                            {/* Google Preview Card */}
                            <div className="p-4 bg-white rounded-lg border shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                                        <Globe className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        yourstore.com › products › {displayHandle}
                                    </div>
                                </div>
                                <h3 className="text-blue-600 hover:underline text-lg font-normal cursor-pointer line-clamp-1">
                                    {displayTitle}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {displayDescription}
                                </p>
                            </div>
                        </div>

                        {isEditing && (
                            <>
                                <Separator />

                                {/* SEO Fields */}
                                <div className="space-y-4">
                                    {/* Page Title */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="page-title" className="text-sm">Page title</Label>
                                            <span className={cn(
                                                "text-xs",
                                                (seoTitle || productTitle).length > 60 ? "text-amber-600" : "text-muted-foreground"
                                            )}>
                                                {(seoTitle || productTitle).length}/60
                                            </span>
                                        </div>
                                        <Input
                                            id="page-title"
                                            value={seoTitle || productTitle}
                                            onChange={(e) => onSeoTitleChange(e.target.value)}
                                            placeholder="Enter page title..."
                                            className="h-9"
                                        />
                                        {(seoTitle || productTitle).length > 60 && (
                                            <p className="text-xs text-amber-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                Title may be truncated in search results
                                            </p>
                                        )}
                                    </div>

                                    {/* Meta Description */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="meta-description" className="text-sm">Meta description</Label>
                                            <span className={cn(
                                                "text-xs",
                                                (seoDescription || productDescription).length > 160 ? "text-amber-600" : "text-muted-foreground"
                                            )}>
                                                {(seoDescription || productDescription).length}/160
                                            </span>
                                        </div>
                                        <Textarea
                                            id="meta-description"
                                            value={seoDescription || productDescription?.substring(0, 160)}
                                            onChange={(e) => onSeoDescriptionChange(e.target.value)}
                                            placeholder="Enter meta description..."
                                            className="min-h-[80px] resize-none"
                                        />
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">
                                                Describe your product in 1-2 sentences for search engines
                                            </p>
                                            <Button variant="ghost" size="sm" className="h-6 text-xs text-purple-600 hover:text-purple-700">
                                                <Wand2 className="h-3 w-3 mr-1" />
                                                Generate
                                            </Button>
                                        </div>
                                    </div>

                                    {/* URL Handle */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5">
                                            <Label htmlFor="url-handle" className="text-sm">URL handle</Label>
                                            <span title="The last part of the product URL" className="flex items-center">
                                                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                            </span>
                                        </div>
                                        <div className="flex gap-0">
                                            <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-xs text-muted-foreground">
                                                yourstore.com/products/
                                            </div>
                                            <Input
                                                id="url-handle"
                                                value={urlHandle || displayHandle}
                                                onChange={(e) => onUrlHandleChange(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                                                className="h-9 rounded-l-none"
                                                placeholder="product-url"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SEO Tips */}
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <h4 className="text-xs font-medium text-blue-900 mb-2">SEO tips</h4>
                                    <ul className="space-y-1">
                                        <li className="text-xs text-blue-700 flex items-start gap-2">
                                            <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-emerald-600" />
                                            Keep title under 60 characters
                                        </li>
                                        <li className="text-xs text-blue-700 flex items-start gap-2">
                                            <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-emerald-600" />
                                            Meta description between 120-160 characters
                                        </li>
                                        <li className="text-xs text-blue-700 flex items-start gap-2">
                                            {urlHandle ? (
                                                <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-emerald-600" />
                                            ) : (
                                                <AlertCircle className="h-3 w-3 mt-0.5 shrink-0 text-amber-600" />
                                            )}
                                            Use descriptive, keyword-rich URLs
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
