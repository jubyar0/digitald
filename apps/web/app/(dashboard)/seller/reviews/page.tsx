import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon, MessageSquareIcon } from "lucide-react"
import { getSellerReviews, replyToReview } from "@/actions/reviews"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function ReviewsPage() {
    const reviewsResult = await getSellerReviews()
    const reviews = reviewsResult.success && reviewsResult.data ? reviewsResult.data.reviews : []
    const stats = reviewsResult.success && reviewsResult.data ? reviewsResult.data.stats : {
        totalReviews: 0,
        averageRating: "0",
        pendingReplies: 0
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Product Reviews</h3>
                            <p className="dashboard-card-description">
                                Manage customer feedback and ratings
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
                                        <StarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Average Rating</p>
                                        <p className="text-2xl font-bold">{stats.averageRating}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                        <MessageSquareIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Reviews</p>
                                        <p className="text-2xl font-bold">{stats.totalReviews}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                        <MessageSquareIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pending Replies</p>
                                        <p className="text-2xl font-bold">{stats.pendingReplies}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <Card>
                                <CardContent className="p-6 text-center text-muted-foreground">
                                    No reviews found.
                                </CardContent>
                            </Card>
                        ) : (
                            reviews.map((review) => (
                                <Card key={review.id}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium">{review.product.name}</p>
                                                    <p className="text-sm text-muted-foreground">{review.user.name}</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: review.rating }).map((_, i) => (
                                                        <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-sm">{review.comment}</p>

                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>

                                                {/* Placeholder for reply UI - functionality requires schema update */}
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" disabled>Reply (Coming Soon)</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
