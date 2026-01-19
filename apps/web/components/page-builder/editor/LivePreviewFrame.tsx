// components/page-builder/editor/LivePreviewFrame.tsx
// Live iframe preview of the frontend page with real-time sync
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useEditorStore } from '@/lib/page-builder/store';
import { cn } from '@/lib/utils';
import { RefreshCw, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LivePreviewFrameProps {
    pageSlug: string;
    className?: string;
}

export function LivePreviewFrame({ pageSlug, className }: LivePreviewFrameProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const schema = useEditorStore((state) => state.schema);
    const device = useEditorStore((state) => state.device);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Device widths for preview
    const deviceWidths = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
    };

    // Sync preview with editor changes by posting message to iframe
    const syncPreview = useCallback(() => {
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

    // Sync on schema changes
    useEffect(() => {
        syncPreview();
    }, [syncPreview]);

    // Refresh iframe
    const handleRefresh = () => {
        if (iframeRef.current) {
            setIsLoading(true);
            iframeRef.current.src = iframeRef.current.src;
        }
    };

    // Open in new tab
    const handleOpenExternal = () => {
        window.open(`/preview/${pageSlug}`, '_blank');
    };

    // Toggle fullscreen
    const handleToggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div
            className={cn(
                'flex flex-col bg-muted/30 rounded-lg overflow-hidden',
                isFullscreen && 'fixed inset-0 z-50 rounded-none',
                className
            )}
        >
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Live Preview</span>
                    <span className="text-xs text-muted-foreground">
                        ({device})
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleRefresh}
                    >
                        <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleOpenExternal}
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleToggleFullscreen}
                    >
                        {isFullscreen ? (
                            <Minimize2 className="h-4 w-4" />
                        ) : (
                            <Maximize2 className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Preview Container */}
            <div className="flex-1 flex items-start justify-center p-4 overflow-auto bg-muted/20">
                <div
                    className="bg-background shadow-xl rounded-lg overflow-hidden transition-all duration-300"
                    style={{
                        width: deviceWidths[device],
                        maxWidth: deviceWidths[device],
                        minHeight: isFullscreen ? 'calc(100vh - 100px)' : '500px',
                    }}
                >
                    <iframe
                        ref={iframeRef}
                        src={`/preview/${pageSlug}?editor=true`}
                        className="w-full h-full border-0"
                        style={{ minHeight: isFullscreen ? 'calc(100vh - 100px)' : '500px' }}
                        onLoad={() => {
                            setIsLoading(false);
                            // Sync immediately after load
                            setTimeout(syncPreview, 100);
                        }}
                        title="Page Preview"
                    />
                </div>
            </div>
        </div>
    );
}
