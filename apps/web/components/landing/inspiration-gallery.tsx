"use client"

import { motion } from "motion/react"
import Image from "next/image"
import { BlurFade } from "@/components/ui/blur-fade"

interface InspirationCard {
    id: number
    image: string
    title: string
    type: 'Model' | 'Texture'
    typeIcon: string
    typeColor: string
    artist: string
}

const inspirationCards: InspirationCard[] = [
    {
        id: 1,
        image: '/media/illustrations/1.svg',
        title: 'Cool Toned Striped Surface',
        type: 'Model',
        typeIcon: '▣',
        typeColor: '#4A4A4A',
        artist: 'Rafael Romero'
    },
    {
        id: 2,
        image: '/media/illustrations/2.svg',
        title: 'Stacked Greybased Brick',
        type: 'Texture',
        typeIcon: '▤',
        typeColor: '#6B5B4F',
        artist: 'Arif Strandberg'
    },
    {
        id: 3,
        image: '/media/illustrations/3.svg',
        title: 'Sunset Stripe Design',
        type: 'Model',
        typeIcon: '▣',
        typeColor: '#4A4A4A',
        artist: 'Studio Design'
    },
    {
        id: 4,
        image: '/media/illustrations/4.svg',
        title: 'Stucco Texture, Earth',
        type: 'Texture',
        typeIcon: '▤',
        typeColor: '#C4A574',
        artist: 'Kamila Anna Kaplon'
    },
    {
        id: 5,
        image: '/media/illustrations/5.svg',
        title: 'Rammed Earth Texture',
        type: 'Texture',
        typeIcon: '▤',
        typeColor: '#8B7355',
        artist: 'Jean-Paul El-Hachem'
    }
]

function InspirationCard({
    card,
    index,
    size = 'normal'
}: {
    card: InspirationCard
    index: number
    size?: 'large' | 'normal'
}) {
    const isLarge = size === 'large'

    return (
        <BlurFade delay={0.1 * index} inView>
            <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`group relative rounded-xl overflow-hidden cursor-pointer ${isLarge ? 'aspect-[16/10]' : 'aspect-[4/3]'
                    }`}
            >
                {/* Image */}
                <div className="absolute inset-0 bg-card">
                    <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Artist Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-medium bg-black/50 text-white backdrop-blur-sm">
                    {card.artist}
                </div>

                {/* Card Info */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div
                        className={`${isLarge ? 'w-10 h-10' : 'w-8 h-8'} rounded-md flex items-center justify-center`}
                        style={{ backgroundColor: card.typeColor }}
                    >
                        <span className={`${isLarge ? 'text-xs' : 'text-[10px]'} font-bold text-white`}>
                            {card.typeIcon}
                        </span>
                    </div>
                    <div>
                        <span className="text-[9px] uppercase tracking-wider text-gray-300">
                            {card.type}
                        </span>
                        <h3 className={`${isLarge ? 'text-sm' : 'text-xs'} font-medium flex items-center gap-1 text-white group-hover:text-primary transition-colors`}>
                            {card.title}
                            <motion.svg
                                className="w-2.5 h-2.5"
                                initial={{ x: 0 }}
                                whileHover={{ x: 3 }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </motion.svg>
                        </h3>
                    </div>
                </div>
            </motion.div>
        </BlurFade>
    )
}

export default function InspirationGallery() {
    return (
        <section className="py-20 relative bg-background">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed text-foreground">
                        Get inspired. See how others
                        <br />
                        are creating with <span className="text-gradient">DigitalStock.</span>
                    </h2>
                </motion.div>

                {/* Top Row - 2 Large Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {inspirationCards.slice(0, 2).map((card, index) => (
                        <InspirationCard key={card.id} card={card} index={index} size="large" />
                    ))}
                </div>

                {/* Bottom Row - 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {inspirationCards.slice(2).map((card, index) => (
                        <InspirationCard key={card.id} card={card} index={index + 2} size="normal" />
                    ))}
                </div>
            </div>
        </section>
    )
}
