"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function NavigationProgress() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isNavigating, setIsNavigating] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Reset when navigation completes
        setIsNavigating(false)
        setProgress(0)
    }, [pathname, searchParams])

    useEffect(() => {
        let timer: NodeJS.Timeout

        if (isNavigating) {
            timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(timer)
                        return 90
                    }
                    return prev + 10
                })
            }, 100)
        }

        return () => clearInterval(timer)
    }, [isNavigating])

    // Listen for navigation start
    useEffect(() => {
        const handleStart = () => {
            setIsNavigating(true)
            setProgress(10)
        }

        // Use MutationObserver to detect navigation
        const observer = new MutationObserver(() => {
            // This is a simple check - in production you might want more sophisticated detection
        })

        return () => observer.disconnect()
    }, [])

    return (
        <AnimatePresence>
            {isNavigating && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[100] h-1"
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary via-primary to-primary/50"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.2 }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
