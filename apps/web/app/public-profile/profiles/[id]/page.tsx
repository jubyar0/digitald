'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    MapPin,
    Calendar,
    Star,
    Package,
    Users,
    TrendingUp,
    Award,
    Share2,
    MessageCircle,
    Heart,
    Download,
    Eye,
    Sparkles,
    Loader2,
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Link from 'next/link'

interface ProfileData {
    id: string
    name: string
    username: string
    avatar?: string
    coverImage?: string
    bio?: string
    location?: string
    joinedDate: string
    stats: {
        products: number
        followers: number
        sales: number
        rating: number
        reviews: number
    }
    badges: {
        id: string
        name: string
        icon: string
        color: string
    }[]
    specializations: string[]
    softwareTools: {
        id: string
        name: string
        logoUrl: string
    }[]
    reviews: {
        id: string
        rating: number
        comment: string
        createdAt: string
        user: {
            name: string
            avatar: string | null
        }
    }[]
    isVerified: boolean
}

export default function PublicProfilePage() {
    const params = useParams()
    const profileId = params.id as string
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('products')
    const [isFollowing, setIsFollowing] = useState(false)
    const [followLoading, setFollowLoading] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [productsLoading, setProductsLoading] = useState(false)
    const [productsPage, setProductsPage] = useState(1)
    const [productsPagination, setProductsPagination] = useState<any>(null)
    const { data: session } = useSession()

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch(`/api/profile/${profileId}`)
                if (!response.ok) {
                    setProfile(null)
                    setLoading(false)
                    return
                }
                const data = await response.json()
                setProfile(data)

                // Check follow status
                if (session?.user) {
                    const followResponse = await fetch(`/api/follow/${data.id}/status`)
                    if (followResponse.ok) {
                        const followData = await followResponse.json()
                        setIsFollowing(followData.isFollowing)
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error)
                setProfile(null)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [profileId, session])

    // Fetch products when tab changes to products
    useEffect(() => {
        if (activeTab === 'products' && profile && products.length === 0) {
            fetchProducts()
        }
    }, [activeTab, profile])

    const fetchProducts = async (page = 1) => {
        if (!profile) return

        setProductsLoading(true)
        try {
            const response = await fetch(`/api/profile/${profile.id}/products?page=${page}&limit=12`)
            if (response.ok) {
                const data = await response.json()
                setProducts(data.products)
                setProductsPagination(data.pagination)
                setProductsPage(page)
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setProductsLoading(false)
        }
    }

    const handleFollow = async () => {
        if (!profile || !session) return

        setFollowLoading(true)
        try {
            const method = isFollowing ? 'DELETE' : 'POST'
            const response = await fetch(`/api/follow/${profile.id}`, {
                method
            })

            if (response.ok) {
                setIsFollowing(!isFollowing)
                // Update follower count
                setProfile({
                    ...profile,
                    stats: {
                        ...profile.stats,
                        followers: profile.stats.followers + (isFollowing ? -1 : 1)
                    }
                })
            }
        } catch (error) {
            console.error('Error toggling follow:', error)
        } finally {
            setFollowLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
            </div>
        )
    }

    const isOwnProfile = session?.user?.id === profileId

    if (!profile) {
        // If user is trying to view their own profile but doesn't have a vendor profile, redirect to create page
        if (isOwnProfile && session) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto px-4">
                        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                            <Package className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold mb-3">No Seller Profile Yet</h1>
                        <p className="text-muted-foreground mb-6">
                            You haven&apos;t created a seller profile yet. Set one up to start selling your products.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link href="/seller/settings/profile">
                                <Button size="lg" className="w-full">
                                    Create Seller Profile
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" size="lg" className="w-full">
                                    <Package className="h-4 w-4 mr-2" />
                                    Browse Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )
        }

        // Profile doesn't exist
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10">
                        <Package className="h-10 w-10 text-destructive" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3">Profile Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        The profile you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link href="/">
                        <Button size="lg" className="w-full">
                            <Package className="h-4 w-4 mr-2" />
                            Browse Products
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Cover Image - Clean Design */}
            <div className="relative h-64 md:h-80 bg-primary/10 border-b">
                {profile.coverImage && (
                    <img
                        src={profile.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-20"
                    />
                )}
            </div>

            {/* Profile Content */}
            <div className="container mx-auto px-4 -mt-24 relative z-10 pb-12">
                <div className="max-w-6xl mx-auto">
                    {/* Profile Header Card */}
                    <Card className="mb-8 border shadow-sm">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <Avatar className="h-36 w-36 border-4 border-background shadow-sm ring-1 ring-border">
                                        <AvatarImage src={profile.avatar} alt={profile.name} />
                                        <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                                            {profile.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h1 className="text-4xl font-bold">
                                                    {profile.name}
                                                </h1>
                                                {profile.isVerified && (
                                                    <Badge variant="default" className="gap-1.5 px-3 py-1">
                                                        <Award className="h-3.5 w-3.5" />
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-lg text-muted-foreground mb-3">
                                                @{profile.username}
                                            </p>
                                            {profile.bio && (
                                                <p className="text-foreground/80 max-w-2xl leading-relaxed">
                                                    {profile.bio}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            {!isOwnProfile && (
                                                <>
                                                    <Button
                                                        size="lg"
                                                        className="shadow-sm hover:shadow-md transition-shadow"
                                                        onClick={handleFollow}
                                                        disabled={followLoading}
                                                    >
                                                        <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                                    </Button>
                                                    <Link href={`/chat?sellerId=${profile.id}`}>
                                                        <Button variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-shadow">
                                                            <MessageCircle className="h-4 w-4 mr-2" />
                                                            Message
                                                        </Button>
                                                    </Link>
                                                </>
                                            )}
                                            <Button variant="outline" size="icon" className="shadow-sm hover:shadow-md transition-shadow">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-5">
                                        {profile.location && (
                                            <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                                                <MapPin className="h-4 w-4" />
                                                {profile.location}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                                            <Calendar className="h-4 w-4" />
                                            Joined {new Date(profile.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    {profile.badges.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {profile.badges.map((badge, index) => (
                                                <Badge key={index} variant="secondary" className="px-3 py-1" style={{ backgroundColor: badge.color + '20', color: badge.color }}>
                                                    <Sparkles className="h-3 w-3 mr-1.5" />
                                                    {badge.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-8 border-t">
                                <div className="text-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Package className="h-5 w-5 text-primary" />
                                        <span className="text-3xl font-bold">
                                            {profile.stats.products}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">Products</p>
                                </div>
                                <div className="text-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        <span className="text-3xl font-bold">
                                            {profile.stats.followers.toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">Followers</p>
                                </div>
                                <div className="text-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                        <span className="text-3xl font-bold">
                                            {profile.stats.sales.toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">Sales</p>
                                </div>
                                <div className="text-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                        <span className="text-3xl font-bold">
                                            {profile.stats.rating.toFixed(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">Rating</p>
                                </div>
                                <div className="text-center p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <MessageCircle className="h-5 w-5 text-primary" />
                                        <span className="text-3xl font-bold">
                                            {profile.stats.reviews}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">Reviews</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="products">Products</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                            <TabsTrigger value="about">About</TabsTrigger>
                        </TabsList>

                        <TabsContent value="products">
                            {productsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : products.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.map((product) => (
                                            <Link key={product.id} href={`/products/${product.id}`}>
                                                <Card className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow border h-full">
                                                    <div className="aspect-square bg-muted relative overflow-hidden">
                                                        {product.thumbnail ? (
                                                            <img
                                                                src={product.thumbnail}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                                                                <Package className="h-20 w-20 text-muted-foreground/40" />
                                                            </div>
                                                        )}
                                                        {product.category && (
                                                            <div className="absolute top-3 right-3">
                                                                <Badge variant="secondary">{product.category.name}</Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <CardContent className="p-5">
                                                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                            {product.description}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-2xl font-bold">
                                                                ${product.price.toFixed(2)}
                                                            </span>
                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                {product.averageRating > 0 && (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                                                        {product.averageRating}
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1.5">
                                                                    <Eye className="h-4 w-4" />
                                                                    {product.views}
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <Download className="h-4 w-4" />
                                                                    {product.downloads}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {productsPagination && productsPagination.totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 mt-8">
                                            <Button
                                                variant="outline"
                                                onClick={() => fetchProducts(productsPage - 1)}
                                                disabled={productsPage === 1 || productsLoading}
                                            >
                                                Previous
                                            </Button>
                                            <span className="text-sm text-muted-foreground">
                                                Page {productsPage} of {productsPagination.totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                onClick={() => fetchProducts(productsPage + 1)}
                                                disabled={productsPage === productsPagination.totalPages || productsLoading}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <Package className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
                                    <p className="text-muted-foreground">
                                        This seller hasn&apos;t listed any products yet.
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="reviews">
                            <Card className="border shadow-sm">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold">Reviews ({profile.stats.reviews})</h3>
                                        {!isOwnProfile && session && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button>Write a Review</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Write a Review for {profile.name}</DialogTitle>
                                                        <DialogDescription>
                                                            Share your experience with this seller. You must have purchased a product to leave a review.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <ReviewForm sellerId={profile.id} onSuccess={() => window.location.reload()} />
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>

                                    {profile.reviews.length > 0 ? (
                                        <div className="space-y-6">
                                            {profile.reviews.map((review) => (
                                                <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                                                    <div className="flex items-start gap-4">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarImage src={review.user.avatar || undefined} />
                                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                                {review.user.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-semibold">{review.user.name}</span>
                                                                <div className="flex items-center gap-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mb-2">
                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                            </p>
                                                            <p className="text-foreground/90 leading-relaxed">
                                                                {review.comment}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground py-8">
                                            No reviews yet. Be the first to review!
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="about">
                            <Card className="border shadow-sm">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold mb-6">About {profile.name}</h3>
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="text-foreground/80 leading-relaxed mb-8">
                                            {profile.bio || 'No additional information available.'}
                                        </p>

                                        {profile.specializations.length > 0 && (
                                            <>
                                                <h4 className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2">
                                                    <Sparkles className="h-5 w-5 text-primary" />
                                                    Specializations
                                                </h4>
                                                <ul className="space-y-2 mb-8">
                                                    {profile.specializations.map((spec, index) => (
                                                        <li key={index} className="flex items-center gap-2 text-foreground/80">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                            {spec}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}

                                        {profile.softwareTools.length > 0 && (
                                            <>
                                                <h4 className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2">
                                                    <Package className="h-5 w-5 text-primary" />
                                                    Software & Tools
                                                </h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {profile.softwareTools.map((tool) => (
                                                        <Badge key={tool.id} variant="outline" className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer flex items-center gap-2">
                                                            {tool.logoUrl && <img src={tool.logoUrl} alt={tool.name} className="w-4 h-4 object-contain" />}
                                                            {tool.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

function ReviewForm({ sellerId, onSuccess }: { sellerId: string, onSuccess: () => void }) {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const response = await fetch(`/api/reviews/seller/${sellerId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comment })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit review')
            }

            toast.success('Review submitted successfully')
            onSuccess()
        } catch (error: any) {
            console.error('Error submitting review:', error)
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                        >
                            <Star
                                className={`h-8 w-8 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                    id="comment"
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="min-h-[100px]"
                />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    'Submit Review'
                )}
            </Button>
        </form>
    )
}
