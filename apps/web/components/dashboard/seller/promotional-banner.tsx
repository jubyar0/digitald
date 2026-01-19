import { Button } from '@/components/dashboard/ui/button'
import Link from 'next/link'
import { Card, CardContent } from '@/components/dashboard/ui/card'

export function PromotionalBanner() {
    return (
        <Card className="bg-card border-border shadow-sm overflow-hidden mb-4">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="p-6 md:w-2/3">
                        <h3 className="text-base font-semibold mb-2">Votre forfait peut se rentabiliser</h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            Recevez 1 % sur toutes vos ventes en crédits d'abonnement. Même sans Shopify Payments, vous recevrez tout de même 0,5 %. Les crédits s'appliquent automatiquement à votre facture.
                        </p>
                        <Button variant="outline" size="sm" className="h-8" asChild>
                            <Link href="/seller/settings/billing">En savoir plus</Link>
                        </Button>
                    </div>
                    <div className="md:w-1/3 h-32 md:h-auto relative bg-muted/10 flex items-center justify-center overflow-hidden">
                        {/* Coin illustration placeholder */}
                        <div className="relative w-full h-full min-h-[120px]">
                            <div className="absolute right-4 top-4 w-16 h-16 rounded-full bg-yellow-400 border-4 border-yellow-500 shadow-lg transform rotate-12 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full border-2 border-yellow-600/30"></div>
                            </div>
                            <div className="absolute right-24 top-12 w-12 h-12 rounded-full bg-yellow-400 border-4 border-yellow-500 shadow-md transform -rotate-12 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full border-2 border-yellow-600/30"></div>
                            </div>
                            <div className="absolute right-10 bottom-[-10px] w-20 h-20 rounded-full bg-yellow-400 border-4 border-yellow-500 shadow-xl transform rotate-45 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full border-2 border-yellow-600/30"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
