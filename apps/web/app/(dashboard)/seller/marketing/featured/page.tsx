'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
    Star,
    Loader2,
    Send,
    Clock,
    CheckCircle,
    XCircle,
    Package,
    Sparkles,
} from 'lucide-react'
import {
    getMyEligibleProducts,
    getMyFeaturedSubmissions,
    submitProductForFeatured,
    cancelFeaturedSubmission,
} from '@/actions/vendor-featured-actions'
import Image from 'next/image'

interface EligibleProduct {
    id: string
    name: string
    price: number
    currency: string
    thumbnail: string | null
    createdAt: string
    featuredSubmissions: {
        id: string
        sectionId: string
        status: string
        submittedAt: string
    }[]
}

interface FeaturedSubmission {
    id: string
    productId: string
    sectionId: string
    status: string
    submittedAt: string
    reviewedAt: string | null
    notes: string | null
    product: {
        id: string
        name: string
        thumbnail: string | null
        price: number
        currency: string
    }
}

const AVAILABLE_SECTIONS = [
    { id: 'fresh-community', name: 'Fresh from the community', description: 'Featured products carousel on landing page' },
]

export default function VendorFeaturedProductsPage() {
    const [eligibleProducts, setEligibleProducts] = useState<EligibleProduct[]>([])
    const [submissions, setSubmissions] = useState<FeaturedSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<string>('')
    const [selectedSection, setSelectedSection] = useState<string>('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [productsResult, submissionsResult] = await Promise.all([
                getMyEligibleProducts(),
                getMyFeaturedSubmissions(),
            ])

            if (productsResult.success) setEligibleProducts(productsResult.data)
            if (submissionsResult.success) setSubmissions(submissionsResult.data)
        } catch (error) {
            toast.error('Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!selectedProduct || !selectedSection) {
            toast.error('Please select a product and section')
            return
        }

        setSubmitting(true)
        try {
            const result = await submitProductForFeatured(selectedProduct, selectedSection)
            if (result.success) {
                toast.success('Product submitted for featured placement!')
                setSubmitDialogOpen(false)
                setSelectedProduct('')
                setSelectedSection('')
                loadData()
            } else {
                toast.error((result as any).error || 'Failed to submit')
            }
        } finally {
            setSubmitting(false)
        }
    }

    const handleCancel = async (submissionId: string) => {
        const result = await cancelFeaturedSubmission(submissionId)
        if (result.success) {
            toast.success('Submission cancelled')
            loadData()
        } else {
            toast.error((result as any).error || 'Failed to cancel')
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
            case 'APPROVED':
                return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>
            case 'REJECTED':
                return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getSectionName = (sectionId: string) => {
        const section = AVAILABLE_SECTIONS.find(s => s.id === sectionId)
        return section?.name || sectionId
    }

    // Get products that haven't been submitted to a section yet
    const productsForSubmission = eligibleProducts.filter(p => {
        const hasPendingSubmission = p.featuredSubmissions.some(s => s.status === 'PENDING')
        return !hasPendingSubmission
    })

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col container mx-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-8 dashboard-padding">
                    <div className="dashboard-card p-6">
                        <div className="dashboard-card-header flex items-center justify-between">
                            <div>
                                <h3 className="dashboard-card-title flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-yellow-500" />
                                    Featured Products
                                </h3>
                                <p className="dashboard-card-description">
                                    Submit your products for featured placement on the landing page
                                </p>
                            </div>
                            <Button onClick={() => setSubmitDialogOpen(true)} disabled={productsForSubmission.length === 0}>
                                <Star className="h-4 w-4 mr-2" />
                                Request Feature
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Eligible Products</CardDescription>
                                <CardTitle className="text-3xl">{eligibleProducts.length}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Approved products available for featuring</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Pending Requests</CardDescription>
                                <CardTitle className="text-3xl text-yellow-600">
                                    {submissions.filter(s => s.status === 'PENDING').length}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Waiting for admin review</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Featured Products</CardDescription>
                                <CardTitle className="text-3xl text-green-600">
                                    {submissions.filter(s => s.status === 'APPROVED').length}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Currently featured on landing page</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Submission History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Submission History</CardTitle>
                            <CardDescription>Track your featured product submissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Section</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {submissions.map((submission) => (
                                        <TableRow key={submission.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-md overflow-hidden bg-muted relative">
                                                        {submission.product.thumbnail ? (
                                                            <Image
                                                                src={submission.product.thumbnail}
                                                                alt={submission.product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{submission.product.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            ${submission.product.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getSectionName(submission.sectionId)}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(submission.submittedAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(submission.status)}</TableCell>
                                            <TableCell className="text-right">
                                                {submission.status === 'PENDING' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCancel(submission.id)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                                {submission.notes && (
                                                    <span className="text-xs text-muted-foreground">{submission.notes}</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {submissions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No submissions yet. Request to feature your products!
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Available Sections Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Featured Sections</CardTitle>
                            <CardDescription>Sections where your products can be featured</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {AVAILABLE_SECTIONS.map((section) => (
                                    <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <h4 className="font-medium">{section.name}</h4>
                                            <p className="text-sm text-muted-foreground">{section.description}</p>
                                        </div>
                                        <Badge variant="outline">{section.id}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Submit Dialog */}
            <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Featured Placement</DialogTitle>
                        <DialogDescription>
                            Select a product and section to request featured placement on the landing page
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Product</label>
                            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a product..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {productsForSubmission.map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                            <div className="flex items-center gap-2">
                                                <span>{product.name}</span>
                                                <span className="text-muted-foreground">${product.price}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {productsForSubmission.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    All your products have pending submissions or no approved products available.
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Section</label>
                            <Select value={selectedSection} onValueChange={setSelectedSection}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a section..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {AVAILABLE_SECTIONS.map((section) => (
                                        <SelectItem key={section.id} value={section.id}>
                                            {section.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting || !selectedProduct || !selectedSection}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Send className="mr-2 h-4 w-4" />
                            Submit Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
