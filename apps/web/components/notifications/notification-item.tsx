'use client';

import Link from 'next/link';
import { AdminNotification } from '@/types/notifications';
import { cn } from '@/lib/utils';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    MessageSquare,
    UserPlus,
    Store,
    CreditCard
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
    notification: AdminNotification;
    onClick?: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
    const getIcon = () => {
        switch (notification.type) {
            case 'VENDOR_APPLICATION':
                return <Store className="size-5 text-blue-500" />;
            case 'PRODUCT_PENDING':
                return <FileText className="size-5 text-orange-500" />;
            case 'WITHDRAWAL_REQUEST':
                return <CreditCard className="size-5 text-purple-500" />;
            case 'SUPPORT_TICKET':
                return <MessageSquare className="size-5 text-pink-500" />;
            case 'NEW_USER':
                return <UserPlus className="size-5 text-green-500" />;
            case 'SYSTEM_ALERT':
                return <AlertCircle className="size-5 text-red-500" />;
            default:
                return <AlertCircle className="size-5 text-gray-500" />;
        }
    };

    return (
        <Link
            href={notification.actionUrl || '#'}
            className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-accent/50",
                !notification.isRead && "bg-accent/10"
            )}
            onClick={onClick}
        >
            <div className="mt-1 shrink-0 p-2 bg-background rounded-full border shadow-sm">
                {getIcon()}
            </div>
            <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">
                        {notification.title}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.message}
                </p>
            </div>
            {!notification.isRead && (
                <div className="mt-2 shrink-0 size-2 rounded-full bg-primary" />
            )}
        </Link>
    );
}
