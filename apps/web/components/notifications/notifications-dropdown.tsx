"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className="p-2.5 rounded-full hover:bg-muted/50 transition-colors relative"
                    aria-label="Notifications"
                >
                    <Bell className="h-6 w-6 stroke-[1.5]" />
                    {/* Notification badge - hide for now since no notifications */}
                    {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span> */}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Notifications</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground"
                            disabled
                        >
                            Mark all as read
                        </Button>
                    </div>
                </div>

                {/* Empty state */}
                <div className="p-8 text-center">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                        We'll notify you when something arrives
                    </p>
                </div>

                {/* Footer */}
                <div className="p-3 border-t bg-muted/30">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-sm"
                        disabled
                    >
                        View all notifications
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
