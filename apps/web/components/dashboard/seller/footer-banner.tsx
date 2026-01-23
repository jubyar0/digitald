import { Button } from '@/components/dashboard/ui/button'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export function FooterBanner() {
    return (
        <div className="relative rounded-xl overflow-hidden bg-zinc-900 text-white mb-8">
            {/* Background Image Placeholder - In a real app, use next/image with the actual asset */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700">
                {/* Abstract shapes to mimic the painting style */}
                <div className="absolute right-0 top-0 h-full w-1/2 opacity-50 bg-[url('/media/illustrations/10.svg')] bg-cover bg-center mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 p-8 md:p-10 flex flex-col justify-center min-h-[180px]">
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">Shopify Editions</span>
                    <span className="text-zinc-400">|</span>
                    <span className="text-zinc-300">Winter 2026</span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold mb-6 max-w-md">
                    The renaissance of commerce is here.
                </h2>

                <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" className="bg-white text-zinc-900 hover:bg-zinc-100 border-0" asChild>
                        <Link href="#">Discover 150+ updates</Link>
                    </Button>
                    <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm" asChild>
                        <Link href="#">
                            <Zap className="mr-2 h-4 w-4" />
                            /editions
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
