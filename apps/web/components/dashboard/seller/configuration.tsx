import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { Badge } from '@/components/dashboard/ui/badge'
import { CheckCircle2, CreditCard, Truck, Globe, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function Configuration() {
    return (
        <div className="grid gap-6 md:grid-cols-3 mb-6 mt-14">
            {/* Payment Provider */}
            <Card className="flex flex-col bg-card border-border shadow-sm">
                <CardHeader className="pb-2 pt-5 px-5">
                    <CardTitle className="text-base font-medium leading-tight">Configurer un fournisseur de services de paiement</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col px-5 pb-5">
                    <div className="flex space-x-3 mb-5 mt-2">
                        {/* Payment Icons */}
                        <div className="h-6 w-10 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-bold italic text-xs">Pay</span>
                        </div>
                        <div className="h-6 w-10 bg-background border rounded flex items-center justify-center">
                            <span className="text-blue-800 dark:text-blue-300 font-bold text-[10px]">VISA</span>
                        </div>
                        <div className="h-6 w-10 bg-background border rounded flex items-center justify-center">
                            <div className="flex -space-x-1">
                                <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <Button variant="outline" size="sm" className="h-8" asChild>
                            <Link href="/seller/settings/payments">Activer</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Shipping Rates */}
            <Card className="flex flex-col bg-muted/20 border-border shadow-sm">
                <CardHeader className="pb-2 pt-5 px-5">
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-5 w-5 fill-green-600 text-white dark:text-black" />
                        <CardTitle className="text-base font-medium">Tarifs d'expédition vérifiés</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col px-5 pb-5">
                    <div className="flex items-center space-x-3 mb-5 mt-2">
                        <div className="h-6 w-8 bg-green-800 rounded flex items-center justify-center text-white text-[8px] font-bold">DZ</div>
                        <span className="text-sm font-medium bg-background px-3 py-1 rounded-full border shadow-sm text-foreground">National</span>
                    </div>
                    <div className="mt-auto">
                        <Button variant="outline" size="sm" className="bg-background h-8" asChild>
                            <Link href="/seller/settings/shipping">Modifier</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Domain Customization */}
            <Card className="flex flex-col bg-card border-border shadow-sm">
                <CardHeader className="pb-2 pt-5 px-5">
                    <CardTitle className="text-base font-medium">Personnalisez votre domaine</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col px-5 pb-5">
                    <div className="mb-5 mt-2">
                        <div className="flex items-center justify-between bg-muted/30 rounded-full px-3 py-1.5 border">
                            <span className="text-sm text-muted-foreground truncate max-w-[120px] underline decoration-muted-foreground/50 underline-offset-2">qwjdd1-19.myshopify.com</span>
                            <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <Button variant="outline" size="sm" className="h-8" asChild>
                            <Link href="/seller/settings/domains">Personnaliser</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
