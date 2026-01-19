'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { Input } from '@/components/dashboard/ui/input'
import { Label } from '@/components/dashboard/ui/label'
import { Textarea } from '@/components/dashboard/ui/textarea'
import { ImageUpload } from '@/components/dashboard/ui/image-upload'
import { Badge } from '@/components/dashboard/ui/badge'
import { toast } from 'sonner'
import { Loader2, Eye, Save } from 'lucide-react'

interface SoftwareTool {
    id: string
    name: string
    logoUrl: string
    category?: string
}

export default function SellerProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [availableTools, setAvailableTools] = useState<SoftwareTool[]>([])

    const [profileId, setProfileId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        bio: '',
        specializations: [] as string[],
        location: '',
        avatar: '',
        coverImage: '',
        socialLinks: {
            twitter: '',
            linkedin: '',
            website: ''
        },
        selectedTools: [] as string[]
    })

    const [specializationInput, setSpecializationInput] = useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch current profile
                const profileRes = await fetch('/api/profile')
                if (profileRes.ok) {
                    const profile = await profileRes.json()
                    setProfileId(profile.id)
                    setFormData({
                        bio: profile.bio || '',
                        specializations: profile.specializations || [],
                        location: profile.location || '',
                        avatar: profile.avatar || '',
                        coverImage: profile.coverImage || '',
                        socialLinks: profile.socialLinks || { twitter: '', linkedin: '', website: '' },
                        selectedTools: profile.selectedSoftwareTools || []
                    })
                }

                // Fetch available software tools
                const toolsRes = await fetch('/api/software-tools')
                if (toolsRes.ok) {
                    const data = await toolsRes.json()
                    setAvailableTools(data.tools)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                toast.error('Failed to load profile data')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleAddSpecialization = () => {
        if (specializationInput.trim() && !formData.specializations.includes(specializationInput.trim())) {
            setFormData({
                ...formData,
                specializations: [...formData.specializations, specializationInput.trim()]
            })
            setSpecializationInput('')
        }
    }

    const handleRemoveSpecialization = (spec: string) => {
        setFormData({
            ...formData,
            specializations: formData.specializations.filter(s => s !== spec)
        })
    }

    const toggleTool = (toolId: string) => {
        setFormData({
            ...formData,
            selectedTools: formData.selectedTools.includes(toolId)
                ? formData.selectedTools.filter(id => id !== toolId)
                : [...formData.selectedTools, toolId]
        })
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // Update profile
            const profileRes = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bio: formData.bio,
                    specializations: formData.specializations,
                    location: formData.location,
                    avatar: formData.avatar,
                    coverImage: formData.coverImage,
                    socialLinks: formData.socialLinks
                })
            })

            if (!profileRes.ok) throw new Error('Failed to update profile')

            // Update software tools
            const toolsRes = await fetch('/api/profile/software-tools', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    softwareToolIds: formData.selectedTools
                })
            })

            if (!toolsRes.ok) throw new Error('Failed to update software tools')

            toast.success('Profile updated successfully!')
        } catch (error) {
            console.error('Error saving profile:', error)
            toast.error('Failed to save profile')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Edit Profile</h1>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => profileId && window.open(`/public-profile/profiles/${profileId}`, '_blank')}
                        disabled={!profileId}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Profile
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Cover Image */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cover Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ImageUpload
                            label="Cover Image"
                            value={formData.coverImage}
                            onChange={(url) => setFormData({ ...formData, coverImage: url })}
                            description="Recommended size: 1920x400px"
                            maxSize={5}
                        />
                    </CardContent>
                </Card>

                {/* Avatar */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ImageUpload
                            label="Avatar"
                            value={formData.avatar}
                            onChange={(url) => setFormData({ ...formData, avatar: url })}
                            description="Recommended size: 400x400px"
                            maxSize={2}
                        />
                    </CardContent>
                </Card>

                {/* Bio */}
                <Card>
                    <CardHeader>
                        <CardTitle>About You</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell visitors about yourself and your work..."
                                rows={5}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Location */}
                <Card>
                    <CardHeader>
                        <CardTitle>Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g., San Francisco, CA"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Specializations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Specializations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={specializationInput}
                                    onChange={(e) => setSpecializationInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialization()}
                                    placeholder="e.g., 3D Modeling, Texturing"
                                />
                                <Button onClick={handleAddSpecialization} type="button">
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.specializations.map((spec) => (
                                    <Badge
                                        key={spec}
                                        variant="secondary"
                                        className="cursor-pointer"
                                        onClick={() => handleRemoveSpecialization(spec)}
                                    >
                                        {spec} ×
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Software & Tools */}
                <Card>
                    <CardHeader>
                        <CardTitle>Software & Tools</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {availableTools.map((tool) => (
                                <div
                                    key={tool.id}
                                    onClick={() => toggleTool(tool.id)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.selectedTools.includes(tool.id)
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={tool.logoUrl}
                                            alt={tool.name}
                                            className="w-10 h-10 object-contain"
                                            width={40}
                                            height={40}
                                            unoptimized
                                        />
                                        <span className="font-medium text-sm">{tool.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Social Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="twitter">Twitter</Label>
                                <Input
                                    id="twitter"
                                    value={formData.socialLinks.twitter}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                                        })
                                    }
                                    placeholder="https://twitter.com/username"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <Input
                                    id="linkedin"
                                    value={formData.socialLinks.linkedin}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                                        })
                                    }
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={formData.socialLinks.website}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, website: e.target.value }
                                        })
                                    }
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
