import { SegmentEditor } from "@/components/seller/segments/segment-editor"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Code2 } from "lucide-react"

export default function NewSegmentPage() {
    return (
        <div className="flex flex-col h-full p-6 max-w-[1600px] mx-auto w-full">
            <div className="mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/seller/customers/segments">
                        <Button variant="ghost" size="icon" className="h-10 w-10">
                            <Code2 className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Segment</h1>
                        <p className="text-sm text-muted-foreground">
                            Define a new customer segment using the query editor.
                        </p>
                    </div>
                </div>
            </div>
            <SegmentEditor />
        </div>
    )
}
