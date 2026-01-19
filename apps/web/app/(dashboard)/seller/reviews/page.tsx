import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { StarIcon, MessageSquareIcon } from "lucide-react"

const mockReviews = [
    { id: "1", product: "WordPress Theme Pro", customer: "John Doe", rating: 5, comment: "Excellent theme! Very customizable.", date: "2024-01-15", replied: false },
    { id: "2", product: "React Component Library", customer: "Jane Smith", rating: 4, comment: "Good components, could use more documentation.", date: "2024-01-14", replied: true },
    { id: "3", product: "UI Kit Premium", customer: "Bob Johnson", rating: 5, comment: "Perfect for my project!", date: "2024-01-13", replied: false },
]

export default function ReviewsPage() {
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
                                        <p className="text-2xl font-bold">4.7</p>
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
                                        <p className="text-2xl font-bold">342</p>
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
                                        <p className="text-2xl font-bold">12</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        {mockReviews.map((review) => (
                            <Card key={review.id}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium">{review.product}</p>
                                                <p className="text-sm text-muted-foreground">{review.customer}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: review.rating }).map((_, i) => (
                                                    <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-sm">{review.comment}</p>

                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">{review.date}</p>
                                            {review.replied ? (
                                                <Badge variant="outline">Replied</Badge>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Textarea placeholder="Write your reply..." className="h-20" />
                                                    <Button size="sm">Reply</Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
