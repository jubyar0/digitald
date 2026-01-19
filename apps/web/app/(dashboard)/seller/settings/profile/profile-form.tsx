'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/ui/image-upload"
import { useState } from "react"
import { updateSellerProfile } from "@/actions/seller"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { X, Plus, Link as LinkIcon } from "lucide-react"

interface ProfileFormProps {
    profile: {
        vendorName: string
        description: string
        bio: string
        location: string
        specializations: string[]
        socialLinks: Record<string, string>
        userName: string
        email: string
        avatar: string
        coverImage: string
    }
}

const SOCIAL_PLATFORMS = [
    { key: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/username' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
    { key: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
    { key: 'behance', label: 'Behance', placeholder: 'https://behance.net/username' },
    { key: 'artstation', label: 'ArtStation', placeholder: 'https://artstation.com/username' },
]

export function ProfileForm({ profile }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [vendorName, setVendorName] = useState(profile.vendorName)
    const [description, setDescription] = useState(profile.description)
    const [bio, setBio] = useState(profile.bio)
    const [location, setLocation] = useState(profile.location)
    const [specializations, setSpecializations] = useState<string[]>(profile.specializations)
    const [newSpecialization, setNewSpecialization] = useState('')
    const [socialLinks, setSocialLinks] = useState<Record<string, string>>(profile.socialLinks)
    const [userName, setUserName] = useState(profile.userName)
    const [avatar, setAvatar] = useState(profile.avatar)
    const [coverImage, setCoverImage] = useState(profile.coverImage)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!vendorName.trim()) {
            toast.error("Business name is required")
            return
        }

        if (!userName.trim()) {
            toast.error("Your name is required")
            return
        }

        setIsLoading(true)

        try {
            const result = await updateSellerProfile({
                vendorName: vendorName.trim(),
                description: description.trim(),
                bio: bio.trim(),
                location: location.trim(),
                specializations,
                socialLinks,
                avatar,
                coverImage,
                userName: userName.trim()
            })

            if (result.success) {
                toast.success("Profile updated successfully")
                router.refresh()
            } else {
                toast.error(result.error || "Failed to update profile")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        setVendorName(profile.vendorName)
        setDescription(profile.description)
        setBio(profile.bio)
        setLocation(profile.location)
        setSpecializations(profile.specializations)
        setSocialLinks(profile.socialLinks)
        setUserName(profile.userName)
        setAvatar(profile.avatar)
        setCoverImage(profile.coverImage)
    }

    const addSpecialization = () => {
        if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
            setSpecializations([...specializations, newSpecialization.trim()])
            setNewSpecialization('')
        }
    }

    const removeSpecialization = (spec: string) => {
        setSpecializations(specializations.filter(s => s !== spec))
    }

    const updateSocialLink = (platform: string, url: string) => {
        setSocialLinks({ ...socialLinks, [platform]: url })
    }

    const removeSocialLink = (platform: string) => {
        const newLinks = { ...socialLinks }
        delete newLinks[platform]
        setSocialLinks(newLinks)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Images */}
            <div className="space-y-6">
                <h4 className="font-semibold text-lg">Profile Images</h4>

                <div className="grid gap-6 md:grid-cols-2">
                    <ImageUpload
                        value={avatar}
                        onChange={setAvatar}
                        label="Profile Picture"
                        aspectRatio="square"
                        maxSize={5}
                    />

                    <ImageUpload
                        value={coverImage}
                        onChange={setCoverImage}
                        label="Cover Image"
                        aspectRatio="wide"
                        maxSize={10}
                    />
                </div>
            </div>

            {/* Business Information */}
            <div className="space-y-6 pt-6 border-t">
                <div>
                    <h4 className="font-semibold text-lg mb-4">Business Information</h4>
                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="vendorName">Business Name *</Label>
                                <Input
                                    id="vendorName"
                                    placeholder="Your business or brand name"
                                    value={vendorName}
                                    onChange={(e) => setVendorName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="City, Country"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Business Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Tell customers about your business and what you create..."
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Brief overview of your business (shown on product listings)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Professional Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Share your experience, expertise, and what makes your work unique..."
                                rows={4}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Detailed biography (shown on your profile page)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Specializations</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g., 3D Modeling, Texturing, Animation"
                                    value={newSpecialization}
                                    onChange={(e) => setNewSpecialization(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            addSpecialization()
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addSpecialization}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {specializations.map((spec) => (
                                    <Badge key={spec} variant="secondary" className="gap-1">
                                        {spec}
                                        <button
                                            type="button"
                                            onClick={() => removeSpecialization(spec)}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Add tags to highlight your skills and expertise
                            </p>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="pt-6 border-t">
                    <h4 className="font-semibold text-lg mb-4">Personal Information</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="userName">Your Name *</Label>
                            <Input
                                id="userName"
                                placeholder="John Doe"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profile.email}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                Contact support to change your email
                            </p>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="pt-6 border-t">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        Social Links
                    </h4>
                    <div className="space-y-3">
                        {SOCIAL_PLATFORMS.map((platform) => (
                            <div key={platform.key} className="flex gap-2">
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor={platform.key}>{platform.label}</Label>
                                    <Input
                                        id={platform.key}
                                        type="url"
                                        placeholder={platform.placeholder}
                                        value={socialLinks[platform.key] || ''}
                                        onChange={(e) => updateSocialLink(platform.key, e.target.value)}
                                    />
                                </div>
                                {socialLinks[platform.key] && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="mt-8"
                                        onClick={() => removeSocialLink(platform.key)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Add your social media profiles to help customers connect with you
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
            </div>
        </form>
    )
}
