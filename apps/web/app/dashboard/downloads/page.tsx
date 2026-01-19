"use client"

import { UnifiedNavbarClient } from "@/components/unified-navbar-client"
import { DynamicFooter } from "@/components/footer/dynamic-footer"
import { RecentlyViewedCard } from "@/components/recently-viewed-card"
import { Button } from "@/components/ui/button"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"
import Link from "next/link"

export default function DownloadsPage() {
    const { items, loading } = useRecentlyViewed();
    const downloads: any[] = []; // Empty for now - will be populated with actual downloads later

    return (
        <div className="flex min-h-screen flex-col bg-[#09090b]">
            <UnifiedNavbarClient />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <div className="mb-2 text-sm text-gray-400">
                            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
                            <span className="mx-2">/</span>
                            <span className="text-white">Downloads</span>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-2">Downloads</h1>
                        <p className="text-sm font-medium text-gray-400">{downloads.length} Assets</p>
                    </div>

                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center py-16 mb-16">
                        <h2 className="text-2xl font-semibold text-white mb-2">
                            You don&apos;t have any assets
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Assets you download will show here.
                        </p>
                        <Link href="/3dm">
                            <Button
                                className="bg-[#00A8FF] hover:bg-[#0096E6] text-white px-6 py-2 rounded-md font-medium transition-colors"
                            >
                                Browse Wares Now
                            </Button>
                        </Link>
                    </div>

                    {/* Recently Viewed Section */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Recently Viewed</h2>
                            <Link
                                href="/dashboard/recently-viewed"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                View All Recent
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex h-64 items-center justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex h-64 flex-col items-center justify-center text-gray-400">
                                <p className="text-lg">No recently viewed items</p>
                                <p className="text-sm">Browse products to see them here</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {items.slice(0, 4).map((asset) => (
                                    <RecentlyViewedCard
                                        key={asset.id}
                                        id={asset.id}
                                        title={asset.title}
                                        type={asset.type}
                                        imageUrl={asset.imageUrl}
                                        date={asset.date}
                                        isFree={asset.isFree}
                                        price={asset.price}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <DynamicFooter />
        </div>
    )
}
