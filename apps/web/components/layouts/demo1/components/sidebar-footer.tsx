'use client';

import { useState, createContext, useContext, ReactNode, useCallback } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Code, Save, X, ChevronUp, ChevronDown } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Button } from '@/components/dashboard/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dashboard/ui/dropdown-menu';
import { Switch } from '@/components/dashboard/ui/switch';
import { Badge } from '@/components/dashboard/ui/badge';

// Context for save/discard actions
interface SaveDiscardContextType {
    showSaveDiscard: boolean;
    setShowSaveDiscard: (show: boolean) => void;
    hasChanges: boolean;
    setHasChanges: (has: boolean) => void;
    onSave?: () => void;
    onDiscard?: () => void;
    setOnSave: (fn: (() => void) | undefined) => void;
    setOnDiscard: (fn: (() => void) | undefined) => void;
}

const SaveDiscardContext = createContext<SaveDiscardContextType | undefined>(undefined);

export function useSaveDiscard() {
    const context = useContext(SaveDiscardContext);
    if (!context) {
        // Return a no-op version if not within provider
        return {
            showSaveDiscard: false,
            setShowSaveDiscard: () => { },
            hasChanges: false,
            setHasChanges: () => { },
            onSave: undefined,
            onDiscard: undefined,
            setOnSave: () => { },
            setOnDiscard: () => { },
        };
    }
    return context;
}

export function SaveDiscardProvider({ children }: { children: ReactNode }) {
    const [showSaveDiscard, setShowSaveDiscard] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [onSave, setOnSaveState] = useState<(() => void) | undefined>();
    const [onDiscard, setOnDiscardState] = useState<(() => void) | undefined>();

    const setOnSave = useCallback((fn: (() => void) | undefined) => {
        setOnSaveState(() => fn);
    }, []);

    const setOnDiscard = useCallback((fn: (() => void) | undefined) => {
        setOnDiscardState(() => fn);
    }, []);

    return (
        <SaveDiscardContext.Provider
            value={{
                showSaveDiscard,
                setShowSaveDiscard,
                hasChanges,
                setHasChanges,
                onSave,
                onDiscard,
                setOnSave,
                setOnDiscard,
            }}
        >
            {children}
        </SaveDiscardContext.Provider>
    );
}


import { SidebarFormActions } from "@/components/seller/sidebar-form-actions"

// Default avatar fallback
const DEFAULT_AVATAR = '/media/avatars/300-2.png';

export function SidebarFooter() {
    const { data: session } = useSession();
    const [developerMode, setDeveloperMode] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Use session data or fallback values
    const userAvatar = session?.user?.image || DEFAULT_AVATAR;
    const userName = session?.user?.name || 'aiouana HOUSSAM';
    const userEmail = session?.user?.email || 'seller@example.com';

    return (
        <div className="sidebar-footer border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3">
            {/* Save/Discard Actions */}
            <SidebarFormActions />

            {/* User Profile Dropdown */}
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <button
                        className={cn(
                            "flex items-center gap-3 w-full p-2 rounded-lg transition-colors",
                            "hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            isDropdownOpen && "bg-accent"
                        )}
                    >
                        <img
                            src={userAvatar.startsWith('/') ? toAbsoluteUrl(userAvatar) : userAvatar}
                            alt={userName}
                            width={36}
                            height={36}
                            className="rounded-full border-2 border-primary shrink-0"
                        />
                        <div className="flex flex-col items-start text-left min-w-0 flex-1">
                            <span className="text-sm font-medium text-foreground truncate w-full">
                                {userName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate w-full">
                                {userEmail}
                            </span>
                        </div>
                        <div className="shrink-0">
                            {isDropdownOpen ? (
                                <ChevronUp className="size-4 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="size-4 text-muted-foreground" />
                            )}
                        </div>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="top"
                    align="start"
                    className="w-[calc(var(--sidebar-default-width)-1.5rem)] mb-1"
                >
                    {/* Developer Mode Toggle */}
                    <DropdownMenuItem
                        className="flex items-center justify-between cursor-pointer"
                        onSelect={(e) => {
                            e.preventDefault();
                            setDeveloperMode(!developerMode);
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <Code className="size-4" />
                            <span>Developer Mode</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {developerMode && (
                                <Badge variant="secondary" size="sm">
                                    Active
                                </Badge>
                            )}
                            <Switch
                                checked={developerMode}
                                onCheckedChange={setDeveloperMode}
                                className="scale-75"
                            />
                        </div>
                    </DropdownMenuItem>

                    {developerMode && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                                <span>Developer tools enabled. <br /> Check console for debug info.</span>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
