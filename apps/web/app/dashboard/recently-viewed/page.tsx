"use client"

import { UnifiedNavbarClient } from "@/components/unified-navbar-client"
import { DynamicFooter } from "@/components/footer/dynamic-footer"
import { RecentlyViewedCard } from "@/components/recently-viewed-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"

export default function RecentlyViewedPage() {
  const { items, loading } = useRecentlyViewed();

  return (
    <div className="flex min-h-screen flex-col bg-[#09090b]">
      <UnifiedNavbarClient />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb / Header Area */}
          <div className="mb-8">
            <div className="mb-2 text-sm text-gray-400">
              <span className="hover:text-white cursor-pointer">Home</span>
              <span className="mx-2">/</span>
              <span className="text-white">Recent</span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">Recent</h1>
            <p className="text-sm font-medium text-gray-400">{items.length} Assets</p>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-gray-400">
              <p className="text-lg">No recently viewed items</p>
              <p className="text-sm">Browse products to see them here</p>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((asset) => (
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

              {/* Pagination (Hidden for now as we show all local history) */}
              {/* 
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-white/10 bg-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                  disabled
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 min-w-[32px] border-white/10 bg-white/10 text-white hover:bg-white/20"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-white/10 bg-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                Showing 1 to {items.length} of {items.length} assets
              </div>
              */}
            </>
          )}
        </div>
      </main>

      <DynamicFooter />
    </div>
  )
}
