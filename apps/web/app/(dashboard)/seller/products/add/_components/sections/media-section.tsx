'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
    Upload, X, Image as ImageIcon, Video, FileUp, Star,
    GripVertical, Trash2, ZoomIn, Edit3, Copy, MoreHorizontal,
    Loader2, Check, AlertCircle
} from 'lucide-react';
import { ImageFile } from '../types';
import { cn } from '@/lib/utils';

interface MediaSectionProps {
    images: ImageFile[];
    thumbnailIndex: number;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeImage: (id: string) => void;
    setThumbnailIndex?: (index: number) => void;
}

interface UploadingFile {
    id: string;
    name: string;
    progress: number;
    status: 'uploading' | 'complete' | 'error';
}

export function MediaSection({
    images,
    thumbnailIndex,
    onImageUpload,
    removeImage,
    setThumbnailIndex
}: MediaSectionProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [previewImage, setPreviewImage] = useState<ImageFile | null>(null);
    const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const input = fileInputRef.current;
            if (input) {
                const dataTransfer = new DataTransfer();
                Array.from(files).forEach(file => dataTransfer.items.add(file));
                input.files = dataTransfer.files;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }, []);

    const handleSetThumbnail = (index: number) => {
        setThumbnailIndex?.(index);
    };

    const totalMedia = images.length;
    const maxMedia = 10;

    return (
        <>
            <Card className="overflow-hidden">
                <CardHeader className="px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-semibold">Media</CardTitle>
                            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {totalMedia}/{maxMedia}
                            </Badge>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => fileInputRef.current?.click()}
                            title="Upload images, videos, or 3D models"
                        >
                            <Upload className="h-3.5 w-3.5 mr-1" />
                            Add
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-4">
                    {/* Upload Zone */}
                    <div
                        className={cn(
                            "relative border-2 border-dashed rounded-lg transition-all duration-200",
                            isDragging
                                ? "border-primary bg-primary/5 scale-[1.02]"
                                : "border-muted-foreground/25 hover:border-muted-foreground/50",
                            images.length === 0 ? "p-8" : "p-4"
                        )}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={onImageUpload}
                        />

                        {images.length === 0 ? (
                            // Empty State
                            <div className="flex flex-col items-center text-center">
                                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h4 className="font-medium text-sm mb-1">Add product media</h4>
                                <p className="text-xs text-muted-foreground mb-4 max-w-xs">
                                    Drag and drop images, videos, or 3D models here, or click to browse
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload files
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        Add from URL
                                    </Button>
                                </div>
                                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <ImageIcon className="h-3 w-3" />
                                        <span>Images</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Video className="h-3 w-3" />
                                        <span>Videos</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Images Grid
                            <div className="space-y-4">
                                {/* Main Thumbnail */}
                                <div className="flex gap-4">
                                    {/* Large Thumbnail Preview */}
                                    <div className="relative w-32 h-32 shrink-0">
                                        <ContextMenu>
                                            <ContextMenuTrigger>
                                                <div
                                                    className="relative h-full w-full rounded-lg overflow-hidden border-2 border-primary bg-muted group cursor-pointer"
                                                    onClick={() => setPreviewImage(images[thumbnailIndex])}
                                                >
                                                    <img
                                                        src={images[thumbnailIndex]?.url}
                                                        alt="Main thumbnail"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <ZoomIn className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div className="absolute top-2 left-2">
                                                        <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                                                            <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                                                            Main
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </ContextMenuTrigger>
                                            <ContextMenuContent>
                                                <ContextMenuItem onClick={() => setPreviewImage(images[thumbnailIndex])}>
                                                    <ZoomIn className="h-4 w-4 mr-2" />
                                                    Preview
                                                </ContextMenuItem>
                                                <ContextMenuItem onClick={() => removeImage(images[thumbnailIndex].id)}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </ContextMenuItem>
                                            </ContextMenuContent>
                                        </ContextMenu>
                                    </div>

                                    {/* Other Images Grid */}
                                    <div className="flex-1 grid grid-cols-4 gap-2">
                                        {images.map((img, index) => (
                                            index !== thumbnailIndex && (
                                                <ContextMenu key={img.id}>
                                                    <ContextMenuTrigger>
                                                        <div
                                                            className="relative aspect-square rounded-md overflow-hidden border bg-muted group cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                                                            draggable
                                                            onDragStart={() => setDraggedImageId(img.id)}
                                                            onDragEnd={() => setDraggedImageId(null)}
                                                        >
                                                            <img
                                                                src={img.url}
                                                                alt={`Product ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setPreviewImage(img);
                                                                    }}
                                                                    className="h-6 w-6 rounded bg-white/20 hover:bg-white/40 flex items-center justify-center"
                                                                >
                                                                    <ZoomIn className="h-3 w-3 text-white" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeImage(img.id);
                                                                    }}
                                                                    className="h-6 w-6 rounded bg-white/20 hover:bg-red-500/80 flex items-center justify-center"
                                                                >
                                                                    <X className="h-3 w-3 text-white" />
                                                                </button>
                                                            </div>
                                                            <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <GripVertical className="h-3 w-3 text-white drop-shadow" />
                                                            </div>
                                                        </div>
                                                    </ContextMenuTrigger>
                                                    <ContextMenuContent>
                                                        <ContextMenuItem onClick={() => handleSetThumbnail(index)}>
                                                            <Star className="h-4 w-4 mr-2" />
                                                            Set as main
                                                        </ContextMenuItem>
                                                        <ContextMenuItem onClick={() => setPreviewImage(img)}>
                                                            <ZoomIn className="h-4 w-4 mr-2" />
                                                            Preview
                                                        </ContextMenuItem>
                                                        <ContextMenuItem
                                                            onClick={() => removeImage(img.id)}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </ContextMenuItem>
                                                    </ContextMenuContent>
                                                </ContextMenu>
                                            )
                                        ))}

                                        {/* Add More Button */}
                                        {images.length < maxMedia && (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-colors"
                                            >
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-[10px] text-muted-foreground">Add</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Upload Progress */}
                                {uploadingFiles.length > 0 && (
                                    <div className="space-y-2">
                                        {uploadingFiles.map((file) => (
                                            <div key={file.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                                                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                                    {file.status === 'uploading' && (
                                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                    )}
                                                    {file.status === 'complete' && (
                                                        <Check className="h-4 w-4 text-emerald-500" />
                                                    )}
                                                    {file.status === 'error' && (
                                                        <AlertCircle className="h-4 w-4 text-destructive" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium truncate">{file.name}</p>
                                                    <div className="h-1 bg-muted rounded-full overflow-hidden mt-1">
                                                        <div
                                                            className="h-full bg-primary transition-all duration-300"
                                                            style={{ width: `${file.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {file.progress}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Tips */}
                                <p className="text-xs text-muted-foreground text-center">
                                    Drag to reorder • Right-click for more options • First image is the main thumbnail
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Image Preview Dialog */}
            <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
                <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
                    <DialogHeader className="px-4 py-3 border-b">
                        <DialogTitle className="text-sm font-medium">Image Preview</DialogTitle>
                    </DialogHeader>
                    <div className="bg-black flex items-center justify-center min-h-[400px] max-h-[70vh]">
                        {previewImage && (
                            <img
                                src={previewImage.url}
                                alt="Preview"
                                className="max-w-full max-h-[70vh] object-contain"
                            />
                        )}
                    </div>
                    <DialogFooter className="px-4 py-3 border-t flex items-center justify-between">
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Edit3 className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
                            <Button variant="outline" size="sm">
                                <Copy className="h-4 w-4 mr-1" />
                                Copy URL
                            </Button>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setPreviewImage(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
