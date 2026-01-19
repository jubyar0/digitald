"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X, Image as ImageIcon } from "lucide-react"
import { MediaUploadDialog } from "@/components/seller/media-upload-dialog"
import { cn } from "@/lib/utils"

interface ImageUploadCardProps {
    value?: string
    onChange: (url: string) => void
    onRemove?: () => void
    title?: string
    description?: string
    recommendedText?: string
    className?: string
    aspectRatio?: "square" | "video" | "wide"
}

export function ImageUploadCard({
    value,
    onChange,
    onRemove,
    title,
    description,
    recommendedText,
    className,
    aspectRatio = "square"
}: ImageUploadCardProps) {
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <div className={cn("space-y-3", className)}>
            {(title || description) && (
                <div className="space-y-1">
                    {title && <h4 className="text-sm font-medium">{title}</h4>}
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            )}

            <div
                className={cn(
                    "border border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between group relative",
                    !value && "hover:border-primary/50"
                )}
                onClick={() => setDialogOpen(true)}
            >
                <div className="flex items-center gap-4 w-full">
                    <div className={cn(
                        "rounded-lg bg-muted flex items-center justify-center overflow-hidden relative shrink-0 border",
                        aspectRatio === "square" && "h-16 w-16",
                        aspectRatio === "video" && "h-16 w-28",
                        aspectRatio === "wide" && "h-16 w-32"
                    )}>
                        {value ? (
                            <img src={value} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium group-hover:underline truncate">
                            {value ? "Change image" : "Upload image"}
                        </p>
                        {recommendedText && (
                            <p className="text-xs text-muted-foreground mt-1">{recommendedText}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {value && onRemove && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 z-10"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRemove()
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                        <Button type="button" variant="ghost" size="icon" className="text-blue-600">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <MediaUploadDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSelect={(files) => {
                    if (files?.[0]?.url) {
                        onChange(files[0].url)
                        setDialogOpen(false)
                    }
                }}
                maxFiles={1}
            />
        </div>
    )
}
