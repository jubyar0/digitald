"use client"
// re-trigger build

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/dashboard/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarMenuBadge,
} from "@/components/dashboard/ui/sidebar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/dashboard/ui/tooltip"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        tooltip?: string
        badge?: string
        items?: {
            title: string
            url: string
            tooltip?: string
            badge?: string
        }[]
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    // Check if the item has children
                    const hasChildren = item.items && item.items.length > 0

                    if (hasChildren) {
                        return (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={item.isActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    {item.tooltip ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton tooltip={undefined}>
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                        {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" align="center">
                                                {item.tooltip}
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                    )}
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    {subItem.tooltip ? (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <SidebarMenuSubButton asChild>
                                                                    <a href={subItem.url}>
                                                                        <span>{subItem.title}</span>
                                                                        {subItem.badge && <SidebarMenuBadge>{subItem.badge}</SidebarMenuBadge>}
                                                                    </a>
                                                                </SidebarMenuSubButton>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="right" align="center">
                                                                {subItem.tooltip}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ) : (
                                                        <SidebarMenuSubButton asChild>
                                                            <a href={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                                {subItem.badge && <SidebarMenuBadge>{subItem.badge}</SidebarMenuBadge>}
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    )}
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        )
                    }

                    // Render simple item without children
                    return (
                        <SidebarMenuItem key={item.title}>
                            {item.tooltip ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <SidebarMenuButton asChild tooltip={undefined}>
                                            <a href={item.url}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                                            </a>
                                        </SidebarMenuButton>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" align="center">
                                        {item.tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    <a href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                                    </a>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
