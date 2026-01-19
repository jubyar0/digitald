'use client';

import { useState, useEffect } from 'react';
import {
    Bell,
    CheckCheck,
    Loader2,
    RefreshCw,
    Check,
    Clock,
    AlertTriangle,
    Info,
    X
} from 'lucide-react';
import { Button } from '@/components/dashboard/ui/button';
import { ScrollArea } from '@/components/dashboard/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/dashboard/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard/ui/tabs';
import { NotificationItem } from '@/components/notifications/notification-item';
import { getAdminNotifications, getNotificationGroups, getUnreadNotificationCount } from '@/actions/admin-notifications';
import { AdminNotification, NotificationGroup } from '@/types/notifications';
import { Badge } from '@/components/dashboard/ui/badge';

export function AdminNotificationsSheet({ trigger }: { trigger: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [groups, setGroups] = useState<NotificationGroup[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeTab, setActiveTab] = useState<string>('all');

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const [fetchedGroups, count] = await Promise.all([
                getNotificationGroups(),
                getUnreadNotificationCount()
            ]);
            setGroups(fetchedGroups);
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchNotifications();

        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const allNotifications = groups.flatMap(g => g.notifications).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <div className="relative">
                    {trigger}
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground ring-2 ring-background">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            </SheetTrigger>
            <SheetContent className="p-0 gap-0 sm:w-[500px] sm:max-w-none inset-5 start-auto h-auto rounded-lg [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
                <SheetHeader className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2">
                            <Bell className="size-4" />
                            Notifications
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {unreadCount} New
                                </Badge>
                            )}
                        </SheetTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={fetchNotifications}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </SheetHeader>

                <div className="p-0">
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="px-4 pt-4 pb-2">
                            <ScrollArea className="w-full whitespace-nowrap pb-2">
                                <TabsList className="w-full justify-start bg-transparent p-0 h-auto gap-2">
                                    <TabsTrigger
                                        value="all"
                                        className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 py-1.5 h-auto border"
                                    >
                                        All
                                    </TabsTrigger>
                                    {groups.map(group => (
                                        <TabsTrigger
                                            key={group.type}
                                            value={group.type}
                                            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 py-1.5 h-auto border"
                                        >
                                            {group.title}
                                            <span className="ml-2 text-xs opacity-70">({group.count})</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </ScrollArea>
                        </div>

                        <ScrollArea className="h-[calc(100vh-12rem)] px-4">
                            <TabsContent value="all" className="mt-0 space-y-1">
                                {allNotifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <Bell className="size-12 mb-4 opacity-20" />
                                        <p>No notifications yet</p>
                                    </div>
                                ) : (
                                    allNotifications.map(notification => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onClick={() => setIsOpen(false)}
                                        />
                                    ))
                                )}
                            </TabsContent>

                            {groups.map(group => (
                                <TabsContent key={group.type} value={group.type} className="mt-0 space-y-1">
                                    {group.notifications.map(notification => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onClick={() => setIsOpen(false)}
                                        />
                                    ))}
                                </TabsContent>
                            ))}
                        </ScrollArea>
                    </Tabs>
                </div>

                <SheetFooter className="p-4 border-t bg-muted/20">
                    <Button variant="outline" className="w-full gap-2" size="sm">
                        <CheckCheck className="size-4" />
                        Mark all as read
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
