'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Search, Filter, ArrowUpDown, LayoutGrid, List as ListIcon, Upload, X, Check, MoreHorizontal, FileImage, FileVideo, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface MediaFile {
    id: string
    name: string
    type: 'image' | 'video' | 'document'
    size: string
    url: string
    dateAdded: Date
}

interface MediaUploadDialogProps {
    trigger?: React.ReactNode
    onSelect: (files: MediaFile[]) => void
    maxFiles?: number
    title?: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function MediaUploadDialog({
    trigger,
    onSelect,
    maxFiles = 10,
    title = "Select file",
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange
}: MediaUploadDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [files, setFiles] = useState<MediaFile[]>([])
    const [sortOrder, setSortOrder] = useState('newest')
    const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'image' | 'video' | 'document'>('all')
    const [isUploading, setIsUploading] = useState(false)
    const [urlDialogOpen, setUrlDialogOpen] = useState(false)
    const [urlInput, setUrlInput] = useState('')

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen

    // Handle file upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File too large", {
                description: "Please upload a file smaller than 10MB"
            })
            return
        }

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()

            const newFile: MediaFile = {
                id: Date.now().toString(),
                name: data.filename || file.name,
                type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                url: data.url,
                dateAdded: new Date()
            }

            setFiles(prev => [newFile, ...prev])
            setSelectedFiles(prev => [...prev, newFile.id])
            toast.success("File uploaded successfully")
        } catch (error) {
            console.error('Upload error:', error)
            toast.error("Upload failed", {
                description: "Failed to upload file. Please try again."
            })
        } finally {
            setIsUploading(false)
            e.target.value = ''
        }
    }

    // Handle add from URL
    const handleAddFromUrl = () => {
        if (!urlInput.trim()) {
            toast.error("Please enter a URL")
            return
        }

        // Basic URL validation
        try {
            new URL(urlInput)
        } catch {
            toast.error("Invalid URL", {
                description: "Please enter a valid URL"
            })
            return
        }

        // Detect file type from URL extension
        const extension = urlInput.split('.').pop()?.toLowerCase() || ''
        let fileType: 'image' | 'video' | 'document' = 'document'

        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'heic'].includes(extension)) {
            fileType = 'image'
        } else if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
            fileType = 'video'
        }

        const fileName = urlInput.split('/').pop() || 'file-from-url'

        const newFile: MediaFile = {
            id: Date.now().toString(),
            name: fileName,
            type: fileType,
            size: 'Unknown',
            url: urlInput,
            dateAdded: new Date()
        }

        setFiles(prev => [newFile, ...prev])
        setSelectedFiles(prev => [...prev, newFile.id])
        setUrlInput('')
        setUrlDialogOpen(false)
        toast.success("File added from URL")
    }

    const triggerUpload = () => {
        document.getElementById('media-upload-input')?.click()
    }

    const toggleSelection = (id: string) => {
        setSelectedFiles(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        )
    }

    const handleDone = () => {
        const selected = files.filter(f => selectedFiles.includes(f.id))
        onSelect(selected)
        if (setOpen) setOpen(false)
        setSelectedFiles([])
    }

    // Apply filtering and sorting
    let processedFiles = files.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = fileTypeFilter === 'all' || f.type === fileTypeFilter
        return matchesSearch && matchesType
    })

    // Apply sorting
    processedFiles = [...processedFiles].sort((a, b) => {
        switch (sortOrder) {
            case 'newest':
                return b.dateAdded.getTime() - a.dateAdded.getTime()
            case 'oldest':
                return a.dateAdded.getTime() - b.dateAdded.getTime()
            case 'az':
                return a.name.localeCompare(b.name)
            case 'za':
                return b.name.localeCompare(a.name)
            case 'small':
                return parseFloat(a.size) - parseFloat(b.size)
            case 'large':
                return parseFloat(b.size) - parseFloat(a.size)
            default:
                return 0
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline">Select File</Button>}
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0 gap-0">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <DialogTitle>{title}</DialogTitle>
                </div>

                <div className="flex flex-col flex-1 overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-6 py-3 border-b bg-muted/10 gap-4">
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="mediaSearchFiles"
                                    name="mediaSearchFiles"
                                    placeholder="Search files"
                                    className="pl-9 bg-background"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-9 gap-1">
                                        File type <ArrowUpDown className="h-3 w-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuCheckboxItem
                                        checked={fileTypeFilter === 'all'}
                                        onCheckedChange={() => setFileTypeFilter('all')}
                                    >
                                        All
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={fileTypeFilter === 'image'}
                                        onCheckedChange={() => setFileTypeFilter('image')}
                                    >
                                        Images
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={fileTypeFilter === 'video'}
                                        onCheckedChange={() => setFileTypeFilter('video')}
                                    >
                                        Videos
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={fileTypeFilter === 'document'}
                                        onCheckedChange={() => setFileTypeFilter('document')}
                                    >
                                        Documents
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-9 gap-1">
                                        Sort <ArrowUpDown className="h-3 w-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem checked={sortOrder === 'newest'} onCheckedChange={() => setSortOrder('newest')}>
                                        Date added (newest first)
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={sortOrder === 'oldest'} onCheckedChange={() => setSortOrder('oldest')}>
                                        Date added (oldest first)
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={sortOrder === 'az'} onCheckedChange={() => setSortOrder('az')}>
                                        File name (A-Z)
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={sortOrder === 'za'} onCheckedChange={() => setSortOrder('za')}>
                                        File name (Z-A)
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={sortOrder === 'small'} onCheckedChange={() => setSortOrder('small')}>
                                        File size (smallest first)
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={sortOrder === 'large'} onCheckedChange={() => setSortOrder('large')}>
                                        File size (largest first)
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="flex items-center border rounded-md bg-background">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-9 w-9 rounded-none rounded-l-md", view === 'list' && "bg-muted")}
                                    onClick={() => setView('list')}
                                >
                                    <ListIcon className="h-4 w-4" />
                                </Button>
                                <div className="w-[1px] h-9 bg-border" />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-9 w-9 rounded-none rounded-r-md", view === 'grid' && "bg-muted")}
                                    onClick={() => setView('grid')}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div className="px-6 py-8 border-b border-dashed bg-muted/5 flex flex-col items-center justify-center text-center gap-2">
                        <input
                            type="file"
                            id="media-upload-input"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2" disabled={isUploading}>
                                    {isUploading ? "Uploading..." : "Add media"} <ArrowUpDown className="h-3 w-3 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={triggerUpload}>Upload files</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setUrlDialogOpen(true)}>Add from URL</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <p className="text-sm text-muted-foreground">Drag and drop images, videos, 3D models, and files</p>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-muted/5">
                        {files.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
                                <div className="w-32 h-32 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                                    <div className="relative">
                                        <FileImage className="h-16 w-16 text-muted-foreground/50 absolute -left-4 -top-4" />
                                        <FileVideo className="h-16 w-16 text-muted-foreground/50 absolute left-4 top-4" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium">No files yet</h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Upload files to make a selection. You'll also be able to reuse the files in other areas.
                                </p>
                                <div className="flex gap-2 mt-4">
                                    <Button onClick={triggerUpload} disabled={isUploading}>
                                        {isUploading ? "Uploading..." : "Upload file"}
                                    </Button>
                                    <Button variant="ghost" onClick={() => setUrlDialogOpen(true)}>Add from URL</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {view === 'grid' ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {processedFiles.map((file) => (
                                            <div
                                                key={file.id}
                                                className={cn(
                                                    "group relative aspect-square rounded-lg border bg-background overflow-hidden cursor-pointer hover:border-primary transition-colors",
                                                    selectedFiles.includes(file.id) && "border-primary ring-2 ring-primary ring-offset-2"
                                                )}
                                                onClick={() => toggleSelection(file.id)}
                                            >
                                                {file.type === 'image' ? (
                                                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                                        {file.type === 'video' ? <FileVideo className="h-12 w-12 text-muted-foreground" /> : <FileText className="h-12 w-12 text-muted-foreground" />}
                                                    </div>
                                                )}

                                                <div className={cn(
                                                    "absolute top-2 left-2 h-5 w-5 rounded border bg-background flex items-center justify-center transition-opacity",
                                                    selectedFiles.includes(file.id) ? "opacity-100 border-primary bg-primary text-primary-foreground" : "opacity-0 group-hover:opacity-100"
                                                )}>
                                                    {selectedFiles.includes(file.id) && <Check className="h-3 w-3" />}
                                                </div>

                                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-xs truncate">{file.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {processedFiles.map((file) => (
                                            <div
                                                key={file.id}
                                                className={cn(
                                                    "flex items-center gap-4 p-3 rounded-lg border bg-background cursor-pointer hover:bg-muted/50 transition-colors",
                                                    selectedFiles.includes(file.id) && "border-primary bg-muted/20"
                                                )}
                                                onClick={() => toggleSelection(file.id)}
                                            >
                                                <div className="h-10 w-10 rounded overflow-hidden bg-muted flex items-center justify-center shrink-0">
                                                    {file.type === 'image' ? (
                                                        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        file.type === 'video' ? <FileVideo className="h-5 w-5 text-muted-foreground" /> : <FileText className="h-5 w-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground">{file.size}</p>
                                                </div>
                                                {selectedFiles.includes(file.id) && <Check className="h-4 w-4 text-primary" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t bg-background">
                    <div className="text-sm text-muted-foreground">
                        {selectedFiles.length} file{selectedFiles.length !== 1 && 's'} selected
                    </div>
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleDone} disabled={selectedFiles.length === 0}>Done</Button>
                    </div>
                </div>
            </DialogContent>

            {/* URL Dialog */}
            <Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add from URL</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="url-input">Image URL</Label>
                            <Input
                                id="url-input"
                                placeholder="https://example.com/image.png"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddFromUrl()
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUrlDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddFromUrl}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    )
}
