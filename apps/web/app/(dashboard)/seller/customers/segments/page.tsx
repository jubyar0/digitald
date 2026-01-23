import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSegments } from "@/app/actions/segments"
import { SegmentsTable } from "@/components/seller/segments/segments-table"
import { Code2 } from "lucide-react"

export default async function SegmentsPage() {
    const { data: segments, success } = await getSegments()

    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/seller/customers">
                        <Button variant="ghost" size="icon" className="h-10 w-10">
                            <Code2 className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Segments</h1>
                </div>
                <Button asChild className="bg-black text-white hover:bg-black/90">
                    <Link href="/seller/customers/segments/new">Create segment</Link>
                </Button>
            </div>

            {success && segments ? (
                <SegmentsTable initialSegments={segments} />
            ) : (
                <div className="p-4 rounded-lg border bg-destructive/10 text-destructive">
                    Failed to load segments.
                </div>
            )}

            <div className="text-center">
                <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    Learn more about segments
                </Link>
            </div>
        </div>
    )
}
