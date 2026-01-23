import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Code2 } from "lucide-react"

export default function SegmentsLoading() {
    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-10 w-10" disabled>
                        <Code2 className="h-5 w-5" />
                    </Button>
                    <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="rounded-md border">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-64" />
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                </div>
                <div className="p-0">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border-b last:border-0">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-96" />
                            </div>
                            <Skeleton className="h-8 w-20" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center">
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
    )
}
