"use client"

import { Button } from "@/components/ui/button"
import { useFormActionStore } from "@/stores/form-action-store"
import { Loader2, Save, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export function SidebarFormActions() {
    const { isVisible, isDirty, isPending, onSave, onDiscard } = useFormActionStore()

    // Only show if visible AND dirty (as per user request: "only when the seller changes something")
    const show = isVisible && isDirty

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex flex-col gap-2 p-2 border-t border-sidebar-border bg-sidebar-accent/10 rounded-lg mb-2"
                >
                    <div className="text-xs font-medium text-muted-foreground px-1">
                        Unsaved Changes
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onDiscard}
                            disabled={isPending}
                            className="w-full"
                        >
                            <X className="mr-2 h-3 w-3" />
                            Discard
                        </Button>
                        <Button
                            size="sm"
                            onClick={onSave}
                            disabled={isPending}
                            className="w-full"
                        >
                            {isPending ? (
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-3 w-3" />
                            )}
                            Save
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
