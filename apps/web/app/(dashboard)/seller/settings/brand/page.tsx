"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Image as ImageIcon, Palette, Type, FileText, Info, Loader2 } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { getBrandSettings, updateBrandSettings } from "@/actions/seller"
import { ImageUploadCard } from "@/components/seller/image-upload-card"

const brandFormSchema = z.object({
    name: z.string().min(1, "Store name is required"),
    description: z.string().optional(), // Slogan
    bio: z.string().optional(), // Short Description
    avatar: z.string().optional(),
    coverImage: z.string().optional(),
    themeColor: z.string().optional(),
    socialLinks: z.any().optional(),
})

type BrandFormValues = z.infer<typeof brandFormSchema>

export default function BrandPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<BrandFormValues>({
        resolver: zodResolver(brandFormSchema),
        defaultValues: {
            name: "",
            description: "",
            bio: "",
            avatar: "",
            coverImage: "",
            themeColor: "#000000",
            socialLinks: {},
        },
    })

    useEffect(() => {
        async function loadSettings() {
            try {
                const settings = await getBrandSettings()
                if (settings) {
                    form.reset({
                        name: settings.name || "",
                        description: settings.description || "",
                        bio: settings.bio || "",
                        avatar: settings.avatar || "",
                        coverImage: settings.coverImage || "",
                        themeColor: settings.themeColor || "#000000",
                        socialLinks: settings.socialLinks || {},
                    })
                }
            } catch (error) {
                toast.error("Failed to load brand settings")
            } finally {
                setIsLoading(false)
            }
        }
        loadSettings()
    }, [form])

    async function onSubmit(data: BrandFormValues) {
        setIsSaving(true)
        try {
            const result = await updateBrandSettings(data)
            if (result.success) {
                toast.success("Brand settings updated successfully")
            } else {
                toast.error(result.error || "Failed to update settings")
            }
        } catch (error) {
            toast.error("An error occurred while saving")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                <Link href="/seller/settings/general">
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <h1 className="text-xl font-semibold">Brand</h1>
                        </div>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {/* Intro Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold mb-4">What should you add?</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Essential</p>
                                                <p className="text-sm text-muted-foreground mb-2">Common brand assets used across apps and channels</p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-center gap-2 text-sm">
                                                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span>Default Logo</span>
                                                    </li>
                                                    <li className="flex items-center gap-2 text-sm">
                                                        <Palette className="h-4 w-4 text-muted-foreground" />
                                                        <span>Colors</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Additional</p>
                                                <p className="text-sm text-muted-foreground mb-2">Used by some apps and social media channels</p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-center gap-2 text-sm">
                                                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span>Cover Image</span>
                                                    </li>
                                                    <li className="flex items-center gap-2 text-sm">
                                                        <Type className="h-4 w-4 text-muted-foreground" />
                                                        <span>Slogan</span>
                                                    </li>
                                                    <li className="flex items-center gap-2 text-sm">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <span>Short Description</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex items-center justify-center w-64 bg-muted/20 rounded-lg p-8">
                                        <div className="flex flex-col items-center gap-4 opacity-50">
                                            <div className="w-32 h-20 bg-muted rounded-md border-2 border-dashed border-muted-foreground/50" />
                                            <div className="w-24 h-24 bg-muted rounded-full border-2 border-dashed border-muted-foreground/50" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Logos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Logos</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="avatar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <ImageUploadCard
                                                title="Default"
                                                description="Used for most common logo applications"
                                                recommendedText="HEIC, WEBP, SVG, PNG, or JPG. Recommended width: 512 pixels minimum."
                                                value={field.value}
                                                onChange={field.onChange}
                                                onRemove={() => field.onChange("")}
                                                aspectRatio="square"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center gap-2 pt-2">
                                    <Info className="h-4 w-4 text-orange-500" />
                                    <Link href="#" className="text-sm text-blue-600 hover:underline">No logo? Create one with Hatchful</Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Colors */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Colors</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="themeColor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="space-y-3">
                                                <FormLabel className="text-sm font-medium">Primary</FormLabel>
                                                <FormDescription>The brand colors that appear on your store, social media, and more</FormDescription>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <Input
                                                            type="color"
                                                            {...field}
                                                            className="h-10 w-10 p-1 rounded-full cursor-pointer border-0"
                                                        />
                                                    </div>
                                                    <Input
                                                        {...field}
                                                        placeholder="#000000"
                                                        className="w-32 font-mono"
                                                    />
                                                </div>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Cover Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Cover image</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="coverImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormDescription>Key image that shows off your brand in profile pages and apps</FormDescription>
                                            <ImageUploadCard
                                                recommendedText="HEIC, WEBP, SVG, PNG, or JPG. Recommended: 1920x1080 pixels minimum."
                                                value={field.value}
                                                onChange={field.onChange}
                                                onRemove={() => field.onChange("")}
                                                aspectRatio="wide"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Slogan */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Slogan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormDescription>Brand statement or tagline often used along with your logo</FormDescription>
                                            <FormControl>
                                                <Input placeholder="Enter your slogan" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Short Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Short description</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormDescription>Description of your business often used in bios and listings</FormDescription>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter a short description of your business"
                                                    className="resize-none h-24"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="flex justify-center pt-4 pb-8">
                            <p className="text-xs text-muted-foreground">
                                Learn more about <Link href="#" className="text-blue-600 hover:underline">managing your brand settings</Link>
                            </p>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}
