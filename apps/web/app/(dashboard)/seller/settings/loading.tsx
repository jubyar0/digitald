import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* Sidebar + Content skeleton */}
            <div className="flex gap-6">
                {/* Sidebar skeleton */}
                <div className="hidden md:flex flex-col gap-2 w-56">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded" />
                    ))}
                </div>
                {/* Content skeleton */}
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-[400px] rounded-xl" />
                </div>
            </div>
        </div>
    )
}
