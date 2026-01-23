import { SegmentEditor } from "@/components/seller/segments/segment-editor"
import { getSegment } from "@/app/actions/segments"
import { notFound } from "next/navigation"

interface EditSegmentPageProps {
    params: {
        id: string
    }
}

export default async function EditSegmentPage({ params }: EditSegmentPageProps) {
    const { data: segment, success } = await getSegment(params.id)

    if (!success || !segment) {
        notFound()
    }

    return (
        <div className="flex flex-col h-full p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Edit Segment</h1>
                <p className="text-muted-foreground">
                    Update your customer segment criteria.
                </p>
            </div>
            <SegmentEditor initialData={segment} />
        </div>
    )
}
