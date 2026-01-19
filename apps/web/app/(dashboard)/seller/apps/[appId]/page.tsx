"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    Star,
    Loader2,
    Check,
    ChevronLeft,
    ChevronRight,
    Zap,
    ThumbsUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { getAppDetails, installApp, getInstalledApps, getSimilarApps } from "@/actions/app-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { InstallModal } from "@/components/apps/install-modal"
import { ReviewModal } from "@/components/apps/review-modal"

export default function AppDetailsPage({ params }: { params: { appId: string } }) {
    const [app, setApp] = useState<any>(null)
    const [isInstalled, setIsInstalled] = useState(false)
    const [similarApps, setSimilarApps] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isInstalling, setIsInstalling] = useState(false)
    const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const router = useRouter()

    useEffect(() => {
        loadData()
    }, [params.appId])

    const loadData = async () => {
        try {
            const appData = await getAppDetails(params.appId)

            if (appData) {
                setApp(appData)
                setIsInstalled(appData.isInstalled)

                const similar = await getSimilarApps(params.appId, appData.category)
                setSimilarApps(similar)
            }
        } catch (error) {
            console.error("Failed to load app details:", error)
            toast.error("Failed to load app details")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInstall = async () => {
        setIsInstalling(true)
        try {
            const result = await installApp(params.appId)
            if (result.success) {
                toast.success(`${app.name} installed successfully`)
                setIsInstalled(true)
                setIsInstallModalOpen(false)
                router.refresh()
            } else {
                toast.error(result.error || "Failed to install app")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsInstalling(false)
        }
    }

    // Mock reviews
    const reviews = [
        { id: 1, author: 'Chief Process BK', store: '10 months using the app', rating: 5, comment: 'Good apps and quick customer support.', date: 'December 5, 2025' },
        { id: 2, author: 'OuraiJewels', store: '5 months using the app', rating: 5, comment: 'Very smooth integration. Reports are accurate, and now I have full visibility of all my payments. Totally worth it!', date: 'August 19, 2025' },
        { id: 3, author: 'MerchantStore', store: '18 days using the app', rating: 5, comment: 'Managing disputes and tracking updates manually was a hassle. This app completely streamlined this process for us!', date: 'March 06, 2025' },
    ]

    // Mock slides
    const slides = [
        { title: 'Dashboard Overview', image: app?.icon },
        { title: 'Analytics', image: app?.icon },
        { title: 'Reports', image: app?.icon },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!app) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h1 className="text-2xl font-bold">App not found</h1>
                <Button asChild>
                    <Link href="/seller/app-store">Back to App Store</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">
                    <Link href="/seller/app-store" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        dIGO App Store
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex gap-12 justify-center">
                    {/* Left Sidebar - Fixed width */}
                    <div className="w-[220px] shrink-0 space-y-5">
                        {/* App Icon */}
                        <div className="h-16 w-16 rounded-xl border bg-white shadow-sm flex items-center justify-center overflow-hidden">
                            {app.icon ? (
                                <img src={app.icon} alt={app.name} className="h-12 w-12 object-contain" />
                            ) : (
                                <span className="text-xl font-bold text-primary">{app.name.charAt(0)}</span>
                            )}
                        </div>

                        {/* App Name */}
                        <div>
                            <h1 className="text-lg font-bold leading-tight">{app.name}</h1>
                            {app.createdByAdmin && (
                                <Badge variant="outline" className="mt-2 gap-1 text-[10px] px-2 py-0.5 border-orange-300 text-orange-700 bg-orange-50 font-normal">
                                    <Zap className="h-2.5 w-2.5 fill-orange-500" />
                                    Built for dIGO
                                </Badge>
                            )}
                        </div>

                        {/* Pricing */}
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Pricing</p>
                            <p className="text-sm">
                                {app.pricingType === 'free' ? 'Free' :
                                    app.pricingType === 'freemium' ? 'Free plan available. Free trial available.' :
                                        `From $${app.price || '4.99'}/month`}
                            </p>
                        </div>

                        {/* Rating */}
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Rating</p>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium">{app.rating.toFixed(1)}</span>
                                <Star className="h-3.5 w-3.5 fill-black" />
                                <span className="text-sm text-muted-foreground">({app.reviewCount})</span>
                            </div>
                        </div>

                        {/* Developer */}
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Developer</p>
                            <p className="text-sm">{app.developerName || 'dIGO Platform'}</p>
                        </div>

                        {/* Install Button */}
                        {isInstalled ? (
                            <Button className="w-full bg-gray-100 text-gray-500 hover:bg-gray-100" disabled>
                                <Check className="mr-2 h-4 w-4" />
                                Installed
                            </Button>
                        ) : (
                            <Button
                                className="w-full bg-black hover:bg-gray-800 text-white"
                                onClick={() => setIsInstallModalOpen(true)}
                                disabled={isInstalling}
                            >
                                {isInstalling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Install
                            </Button>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-10">
                        {/* Hero Banner with Screenshots */}
                        <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-gray-800 to-gray-700 p-6">
                            <div className="flex gap-6">
                                {/* Left - Features */}
                                <div className="w-1/3 text-white space-y-4">
                                    <h2 className="text-xl font-bold leading-tight">
                                        Get your funds faster!
                                    </h2>
                                    <ul className="space-y-2.5 text-sm">
                                        <li className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                                            <span>Minimize disputes & holds</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                                            <span>Boost your seller reputation</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                                            <span>Auto-sync orders in real-time</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                                            <span>Setup in seconds</span>
                                        </li>
                                    </ul>
                                    <Button size="sm" className="bg-white text-black hover:bg-gray-100 text-xs">
                                        Discover Official Tracking app for dIGO
                                    </Button>
                                </div>

                                {/* Right - Screenshots Carousel */}
                                <div className="w-2/3 flex gap-3">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 bg-white/10 rounded-lg p-2 transition-transform ${i === 1 ? 'scale-105 shadow-lg' : 'opacity-80'}`}
                                        >
                                            <div className="aspect-[4/3] bg-white rounded flex items-center justify-center text-muted-foreground text-xs">
                                                {app.icon ? (
                                                    <img src={app.icon} alt="" className="h-10 w-10 object-contain opacity-30" />
                                                ) : (
                                                    <span>Screenshot {i + 1}</span>
                                                )}
                                            </div>
                                            <p className="text-white text-[10px] mt-2 text-center truncate">
                                                {i === 0 ? 'Automate, save effort' : i === 1 ? app.name + ' app' : 'Get paid faster'}
                                            </p>
                                        </div>
                                    ))}
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold">{app.shortDescription}</h2>
                            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                                <p>{app.description}</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Automatic tracking sync app to track orders & cut disputes</li>
                                    <li>Official Partner for PayPal sync. Build trust and get your funds faster!</li>
                                    <li>Gain good standings by syncing orders via tracking autopilot</li>
                                    <li>Monitor status through a powerful, easy-to-use dashboard</li>
                                </ul>
                            </div>
                        </div>

                        {/* Works with / Categories */}
                        <div className="space-y-3 text-sm">
                            <div className="flex border-b py-3">
                                <span className="text-muted-foreground w-32 shrink-0">Languages</span>
                                <span>English, Dutch, French, German, Italian, Polish, Portuguese, Spanish</span>
                            </div>
                            <div className="flex border-b py-3">
                                <span className="text-muted-foreground w-32 shrink-0">Works with</span>
                                <span className="capitalize">{app.category || 'Payments'}, Order tracking, Workflow automation</span>
                            </div>
                            <div className="flex border-b py-3">
                                <span className="text-muted-foreground w-32 shrink-0">Categories</span>
                                <div className="flex gap-6">
                                    <span className="capitalize">{app.category || 'Payments'}</span>
                                    <Link href="#" className="text-primary hover:underline">Show features</Link>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-8" />

                        {/* Pricing */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Pricing</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {/* Free */}
                                <div className="border rounded-xl p-5 space-y-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">Free</p>
                                        <p className="text-2xl font-bold">Free</p>
                                    </div>
                                    <Separator />
                                    <ul className="space-y-2 text-xs text-muted-foreground">
                                        <li>Free plan (no credit card required)</li>
                                        <li>No charges during monthly auto-renew</li>
                                    </ul>
                                </div>

                                {/* Tier 1 */}
                                <div className="border rounded-xl p-5 space-y-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">Tier 1</p>
                                        <p className="text-2xl font-bold">$4.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                                    </div>
                                    <Separator />
                                    <ul className="space-y-2 text-xs text-muted-foreground">
                                        <li>Unlimited accounts sync</li>
                                        <li>Sync up to PayPal order history</li>
                                        <li>24/7 customer support</li>
                                        <li>Zero additional costs</li>
                                    </ul>
                                    <p className="text-[10px] text-muted-foreground">7-day free trial</p>
                                </div>

                                {/* Tier 2 */}
                                <div className="border rounded-xl p-5 space-y-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">Tier 2</p>
                                        <p className="text-2xl font-bold">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                                    </div>
                                    <Separator />
                                    <ul className="space-y-2 text-xs text-muted-foreground">
                                        <li>Unlimited accounts sync</li>
                                        <li>Support for multiple stores</li>
                                        <li>Priority 24/7 support</li>
                                        <li>Access to all features</li>
                                    </ul>
                                    <p className="text-[10px] text-muted-foreground">7-day free trial</p>
                                </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                All charges are billed in USD. Recurring and usage-based charges are billed every 30 days.{' '}
                                <Link href="#" className="text-primary hover:underline">See all pricing options</Link>
                            </p>
                        </div>

                        <Separator className="my-8" />

                        {/* Reviews */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Reviews <span className="font-normal text-muted-foreground">({app.reviewStats?.total || 0})</span></h2>

                            <div className="grid grid-cols-3 gap-10">
                                {/* Left - Rating Summary */}
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Overall rating</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-bold">{(app.reviewStats?.average || 0).toFixed(1)}</span>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} className={`h-4 w-4 ${s <= Math.round(app.reviewStats?.average || 0) ? 'fill-black' : 'fill-muted text-muted'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating Bars */}
                                    <div className="space-y-1.5">
                                        {[5, 4, 3, 2, 1].map((r) => {
                                            const count = app.reviewStats?.breakdown?.[r] || 0
                                            const total = app.reviewStats?.total || 1 // Avoid division by zero
                                            const percentage = (count / total) * 100

                                            return (
                                                <div key={r} className="flex items-center gap-2 text-xs">
                                                    <span className="w-2">{r}</span>
                                                    <Star className="h-2.5 w-2.5 fill-black" />
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-black rounded-full"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="w-6 text-right text-muted-foreground">
                                                        {count}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-8"
                                            onClick={() => setIsReviewModalOpen(true)}
                                            disabled={!isInstalled}
                                        >
                                            Write a review
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-xs h-8">All reviews</Button>
                                    </div>
                                    {!isInstalled && (
                                        <p className="text-[10px] text-muted-foreground">You must install the app to write a review.</p>
                                    )}
                                </div>

                                {/* Right - Reviews List */}
                                <div className="col-span-2 space-y-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ThumbsUp className="h-4 w-4" />
                                        What merchants think
                                    </div>

                                    {app.reviews && app.reviews.length > 0 ? (
                                        <>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Merchants appreciate this app for its ability to automate transaction management, particularly in high-volume businesses. It syncs tracking numbers, speeding up fund release and preventing account restrictions.
                                            </p>

                                            {app.reviews.map((review: any) => (
                                                <div key={review.id} className="border-t pt-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="text-sm font-medium">{review.vendor?.storeName || 'Merchant'}</p>
                                                            <p className="text-xs text-muted-foreground">{review.vendor?.storeName ? 'Verified merchant' : 'Merchant'}</p>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-0.5 mb-2">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'fill-black' : 'fill-muted'}`} />
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="text-center py-10 text-muted-foreground">
                                            <p>No reviews yet. Be the first to review this app!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator className="my-8" />

                        {/* Support */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Support</h2>
                            <div className="grid grid-cols-2 gap-10">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-3">App support provided by {app.developerName || 'dIGO Platform'}.</p>
                                    <Button variant="outline" size="sm">Get support</Button>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Resources</span>
                                        <div className="text-right">
                                            <Link href="#" className="text-primary hover:underline block">Privacy policy</Link>
                                            <Link href="#" className="text-primary hover:underline block">FAQ</Link>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Developer</span>
                                        <div className="text-right">
                                            <Link href="#" className="text-primary hover:underline block">{app.developerName || 'dIGO Platform'}</Link>
                                            <span className="text-muted-foreground text-xs">Victoria, BC, CA</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Launched</span>
                                        <span>{new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t">
                                        <span className="text-muted-foreground">Data access</span>
                                        <div className="text-right text-xs">
                                            <p className="font-medium">View personal data</p>
                                            <p className="text-muted-foreground">Customers, store owner</p>
                                            <p className="font-medium mt-1">View store data</p>
                                            <p className="text-muted-foreground">Customers, orders</p>
                                            <Link href="#" className="text-primary hover:underline block mt-1">See details</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-8" />

                        {/* More Apps */}
                        {similarApps.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold">More apps like this</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {similarApps.map((similarApp) => (
                                        <Link
                                            key={similarApp.id}
                                            href={`/seller/apps/${similarApp.id}`}
                                            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="h-10 w-10 rounded-lg border bg-white flex items-center justify-center shrink-0">
                                                {similarApp.icon ? (
                                                    <img src={similarApp.icon} alt="" className="h-6 w-6 object-contain" />
                                                ) : (
                                                    <span className="text-xs font-bold">{similarApp.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">{similarApp.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Star className="h-2.5 w-2.5 fill-black" />
                                                    <span>{similarApp.rating.toFixed(1)}</span>
                                                    <span>•</span>
                                                    <span>{similarApp.pricingType === 'free' ? 'Free' : 'Free plan available'}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{similarApp.shortDescription}</p>
                                                {similarApp.createdByAdmin && (
                                                    <Badge variant="outline" className="mt-2 gap-1 text-[9px] px-1.5 py-0 h-4 border-orange-300 text-orange-700 bg-orange-50 font-normal">
                                                        <Zap className="h-2 w-2 fill-orange-500" />
                                                        Built for dIGO
                                                    </Badge>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Install Modal */}
            <InstallModal
                isOpen={isInstallModalOpen}
                onClose={() => setIsInstallModalOpen(false)}
                onConfirm={handleInstall}
                app={app}
            />

            {/* Review Modal */}
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                appId={params.appId}
                appName={app.name}
            />
        </div>
    )
}
