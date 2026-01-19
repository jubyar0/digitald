import { getDisputeById, joinDisputeConversation, resolveDispute } from '@/actions/disputes'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DisputeChat } from '../../_components/dispute-chat'
import { RefundDistribution } from '../../_components/refund-distribution'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'

export default async function DisputeDetailPage({
    params
}: {
    params: { id: string }
}) {
    const dispute = params.id ? await getDisputeById(params.id) : null

    if (!dispute) {
        notFound()
    }

    const buyer = dispute.order.user
    const seller = dispute.order.vendor.user
    const isResolved = dispute.status === 'RESOLVED'

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dispute #{dispute.id.slice(0, 8)}</h1>
                    <p className="text-muted-foreground">
                        Created {new Date(dispute.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <Badge
                    variant={
                        dispute.status === 'PENDING'
                            ? 'secondary'
                            : dispute.status === 'IN_REVIEW'
                                ? 'default'
                                : 'outline'
                    }
                    className="text-lg px-4 py-2"
                >
                    {dispute.status}
                </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Dispute Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Product Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {dispute.product.thumbnail && (
                                <div className="relative aspect-video rounded-lg overflow-hidden">
                                    <Image
                                        src={dispute.product.thumbnail}
                                        alt={dispute.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold">{dispute.product.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    ${dispute.product.price}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Parties Involved */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Parties Involved</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{buyer.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">{buyer.name}</p>
                                    <p className="text-sm text-muted-foreground">Buyer</p>
                                </div>
                                <Badge variant="outline">Buyer</Badge>
                            </div>
                            <Separator />
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{seller.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">{seller.name}</p>
                                    <p className="text-sm text-muted-foreground">Seller</p>
                                </div>
                                <Badge variant="outline">Seller</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dispute Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Dispute Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium mb-1">Reason</p>
                                <Badge>{dispute.disputeReason || 'OTHER'}</Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-1">Description</p>
                                <p className="text-sm text-muted-foreground">{dispute.reason}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-1">Order ID</p>
                                <p className="text-sm font-mono">#{dispute.orderId.slice(0, 12)}</p>
                            </div>
                            {dispute.evidenceFiles && Array.isArray(dispute.evidenceFiles) && dispute.evidenceFiles.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Evidence Files</p>
                                    <div className="space-y-2">
                                        {dispute.evidenceFiles.map((file: any, i: number) => (
                                            <a
                                                key={i}
                                                href={typeof file === 'string' ? file : file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-500 hover:underline block"
                                            >
                                                Evidence {i + 1}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Refund Distribution */}
                    {!isResolved && (
                        <RefundDistribution
                            disputeId={dispute.id}
                            orderAmount={dispute.order.totalAmount}
                        />
                    )}

                    {isResolved && dispute.resolution && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Resolution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{dispute.resolution}</p>
                                {dispute.refundAmount && (
                                    <p className="text-sm mt-2">
                                        <strong>Refund Amount:</strong> ${dispute.refundAmount}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Chat */}
                <div className="lg:col-span-2">
                    <DisputeChat
                        disputeId={dispute.id}
                        conversationId={dispute.conversationId || ''}
                        messages={dispute.conversation?.messages || []}
                        isResolved={isResolved}
                    />
                </div>
            </div>
        </div>
    )
}
