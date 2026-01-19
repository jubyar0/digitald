import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card'
import { Button } from '@/components/dashboard/ui/button'
import { CheckCircle2, Wand2 } from 'lucide-react'
import Link from 'next/link'

export function SetupGuide() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Ajouter un nom de boutique</h2>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <span className="sr-only">Edit</span>
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                    >
                        <path
                            d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1464 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89211L2.28989 11.7349C2.14398 12.0769 2.42306 12.356 2.76505 12.2101L5.60789 10.9975C5.72539 10.9474 5.83168 10.8754 5.92164 10.7855L13.3536 3.35355C13.5488 3.15829 13.5488 2.84171 13.3536 2.64645L11.8536 1.14645ZM4.42164 9.28545L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2163L4.85714 9.72099L4.42164 9.28545Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="flex flex-col bg-card border-border shadow-sm">
                    <CardContent className="flex-1 flex flex-col items-center justify-center text-center space-y-4 pt-6 pb-4">
                        <div className="relative w-36 h-44 bg-background rounded-xl overflow-hidden shadow-sm border p-2">
                            {/* Placeholder for product image */}
                            <div className="w-full h-full bg-pink-100 dark:bg-pink-900/20 rounded-lg overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-28 bg-pink-500 rounded-md shadow-lg transform rotate-[-3deg]"></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-sm">Glitter Ball Gown</h4>
                            <p className="text-xs text-muted-foreground">14 519,56 DZD</p>
                        </div>
                    </CardContent>
                    <div className="p-5 pt-0 mt-auto flex items-center justify-between">
                        <div className="flex items-center text-sm text-green-600 dark:text-green-500 font-medium">
                            <CheckCircle2 className="mr-2 h-5 w-5 fill-green-600 text-white dark:text-black" />
                            Produits ajoutés
                        </div>
                        <Button variant="outline" size="sm" className="h-8" asChild>
                            <Link href="/seller/products/add">En ajouter</Link>
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col bg-card border-border shadow-sm">
                    <CardContent className="pt-6 pb-5 px-5 flex-1 flex flex-col justify-center">
                        <div className="relative h-28 mb-4 w-full flex justify-center">
                            {/* Abstract representation of theme selection */}
                            <div className="flex -space-x-8 items-center justify-center scale-100">
                                <div className="w-20 h-28 bg-background border rounded-lg shadow-sm transform -rotate-12 z-0 opacity-80"></div>
                                <div className="w-20 h-28 bg-background border rounded-lg shadow-sm transform rotate-0 z-10 flex flex-col p-2 gap-2">
                                    <div className="flex gap-1">
                                        <div className="h-10 w-1/3 bg-muted rounded-sm"></div>
                                        <div className="h-10 w-2/3 bg-muted rounded-sm"></div>
                                    </div>
                                    <div className="flex gap-1 flex-1">
                                        <div className="w-full bg-muted/30 rounded-sm"></div>
                                    </div>
                                    <div className="mt-auto self-end bg-muted/50 text-[8px] px-1.5 py-0.5 rounded font-bold">Aa</div>
                                </div>
                                <div className="w-20 h-28 bg-background border rounded-lg shadow-sm transform rotate-12 z-0 opacity-80"></div>
                            </div>
                        </div>

                        <h3 className="font-medium mb-1 text-base">Concevez votre boutique</h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            Décrivez votre entreprise pour générer des thèmes personnalisés ou <Link href="/seller/settings/storefront" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">parcourez les thèmes prédéfinis</Link>
                        </p>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Bijoux modernes faits main"
                                className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <Button size="sm" className="bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300 h-9 px-4">
                                <Wand2 className="mr-2 h-4 w-4" /> Générer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
