'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
    label: string
    value: string
    onChange: (value: string) => void
    description?: string
    accept?: string
    maxSize?: number // in MB
    aspectRatio?: 'square' | 'wide' | 'tall' // Aspect ratio hint
}

export function ImageUpload({
    label,
    value,
    onChange,
    description,
    accept = "image/*",
    maxSize = 5,
    aspectRatio = 'square'
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(value)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            toast.error(`File size must be less than ${maxSize}MB`)
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        setUploading(true)

        try {
            // Create FormData
            const formData = new FormData()
            formData.append('file', file)

            // Upload to your backend
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()
            const imageUrl = data.url

            // Update preview and value
            setPreview(imageUrl)
            onChange(imageUrl)
            toast.success('Image uploaded successfully')
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        setPreview('')
        onChange('')
    }

    const handleUrlChange = (url: string) => {
        setPreview(url)
        onChange(url)
    }

    return (
        <div className="space-y-3">
            <Label htmlFor={label}>{label}</Label>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}

            {/* Preview */}
            {preview && (
                <div className="relative inline-block">
                    <div className="w-full max-w-xs h-32 border-2 border-dashed rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center">
                        <img
                            src={preview}
                            alt={label}
                            className="max-w-full max-h-full object-contain"
                            onError={() => setPreview('')}
                        />
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={handleRemove}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            )}

            {/* Upload Button */}
            {!preview && (
                <div className="flex flex-col gap-3">
                    <label className="cursor-pointer">
                        <div className="w-full max-w-xs h-32 border-2 border-dashed rounded-lg hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 bg-muted/50">
                            {uploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <p className="text-sm text-muted-foreground">Uploading...</p>
                                </div>
                            ) : (
                                <>
                                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    <div className="text-center">
                                        <p className="text-sm font-medium">Click to upload</p>
                                        <p className="text-xs text-muted-foreground">
                                            or drag and drop
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Max {maxSize}MB
                                    </p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            accept={accept}
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                </div>
            )}

            {/* URL Input (Alternative) */}
            <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Or enter image URL</Label>
                <Input
                    value={value}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com/image.png"
                    disabled={uploading}
                />
            </div>
        </div>
    )
}
