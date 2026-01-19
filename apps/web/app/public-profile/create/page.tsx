'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, ArrowRight, Store } from 'lucide-react'
import Link from 'next/link'

export default function CreateProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        // If not authenticated, redirect to login
        if (status === 'unauthenticated') {
            router.push('/signin')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full">
                <CardContent className="p-12 text-center">
                    <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                        <Store className="h-10 w-10 text-primary" />
                    </div>

                    <h1 className="text-3xl font-bold mb-4">Create Your Seller Profile</h1>

                    <p className="text-muted-foreground mb-8 text-lg">
                        You don&apos;t have a seller profile yet. Create one to showcase your products,
                        connect with buyers, and grow your business.
                    </p>

                    <div className="grid gap-4 mb-8">
                        <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-muted/50">
                            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-primary">1</span>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Set Up Your Profile</h3>
                                <p className="text-sm text-muted-foreground">
                                    Add your bio, specializations, and showcase your expertise
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-muted/50">
                            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-primary">2</span>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Upload Products</h3>
                                <p className="text-sm text-muted-foreground">
                                    List your 3D models, assets, and digital products
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-muted/50">
                            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-primary">3</span>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Start Selling</h3>
                                <p className="text-sm text-muted-foreground">
                                    Reach customers and start earning from your creations
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/seller/settings/profile">
                            <Button size="lg" className="w-full sm:w-auto">
                                Create Seller Profile
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                <Package className="mr-2 h-4 w-4" />
                                Browse Products
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
