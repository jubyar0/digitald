'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamically import Globe with no SSR
const Globe = dynamic(() => import('react-globe.gl'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-cyan-400 border-b-2"></div>
        </div>
    )
})

// Sample visitor/order data points
const SAMPLE_POINTS = [
    { lat: 41.26, lng: -95.94, city: 'Council Bluffs', country: 'USA', type: 'visitor', size: 0.3 },
    { lat: 40.71, lng: -74.01, city: 'New York', country: 'USA', type: 'order', size: 0.5 },
    { lat: 51.51, lng: -0.13, city: 'London', country: 'UK', type: 'visitor', size: 0.3 },
    { lat: 48.86, lng: 2.35, city: 'Paris', country: 'France', type: 'visitor', size: 0.25 },
    { lat: 35.68, lng: 139.69, city: 'Tokyo', country: 'Japan', type: 'order', size: 0.4 },
    { lat: 36.75, lng: 3.06, city: 'Algiers', country: 'Algeria', type: 'visitor', size: 0.5 },
    { lat: -33.87, lng: 151.21, city: 'Sydney', country: 'Australia', type: 'visitor', size: 0.3 },
    { lat: 55.75, lng: 37.62, city: 'Moscow', country: 'Russia', type: 'order', size: 0.35 },
    { lat: 19.43, lng: -99.13, city: 'Mexico City', country: 'Mexico', type: 'visitor', size: 0.25 },
    { lat: -23.55, lng: -46.63, city: 'São Paulo', country: 'Brazil', type: 'order', size: 0.4 },
]

// Generate dots for the globe surface
function generateDots() {
    const dots = []
    for (let lat = -80; lat <= 80; lat += 3) {
        const latRad = (lat * Math.PI) / 180
        const circumference = Math.cos(Math.abs(latRad))
        const step = Math.max(3, 3 / circumference)
        for (let lng = -180; lng < 180; lng += step) {
            if (Math.random() > 0.4) {
                dots.push({ lat, lng, size: 0.08, color: '#22d3ee' })
            }
        }
    }
    return dots
}

export default function Globe3D() {
    const [dots, setDots] = useState<any[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setDots(generateDots())
    }, [])

    if (!mounted) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-cyan-400 border-b-2"></div>
            </div>
        )
    }

    return (
        <div className="w-full h-full">
            <Globe
                backgroundColor="rgba(0,0,0,0)"
                showGlobe={true}
                globeImageUrl=""
                showAtmosphere={true}
                atmosphereColor="#22d3ee"
                atmosphereAltitude={0.15}

                // Dots for globe surface pattern
                customLayerData={[...dots, ...SAMPLE_POINTS.map(p => ({ ...p, size: p.size, color: p.type === 'order' ? '#3b82f6' : '#22d3ee' }))]}
                customThreeObject={(d: any) => {
                    const THREE = require('three')
                    const geometry = new THREE.SphereGeometry(d.size || 0.08, 8, 8)
                    const material = new THREE.MeshBasicMaterial({
                        color: d.color || '#22d3ee',
                        transparent: true,
                        opacity: d.size > 0.1 ? 1 : 0.6
                    })
                    return new THREE.Mesh(geometry, material)
                }}
                customThreeObjectUpdate={(obj: any, d: any) => {
                    const THREE = require('three')
                    const coords = { lat: d.lat, lng: d.lng, altitude: 0.01 }
                    Object.assign(obj.position, (obj as any).__globeObj?.getCoords(coords.lat, coords.lng, coords.altitude) || {})
                }}

                // Ring animations for data points
                ringsData={SAMPLE_POINTS.slice(0, 5)}
                ringLat={(d: any) => d.lat}
                ringLng={(d: any) => d.lng}
                ringColor={() => '#22d3ee'}
                ringMaxRadius={3}
                ringPropagationSpeed={2}
                ringRepeatPeriod={1500}
            />
        </div>
    )
}
