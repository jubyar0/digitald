'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/notifications');
            const data = await response.json();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/notifications/${id}/read`, {
                method: 'PUT'
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('http://localhost:3001/notifications/read-all', {
                method: 'PUT'
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/notifications/${id}`, {
                method: 'DELETE'
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        const iconClass = "w-5 h-5";
        switch (type) {
            case 'NEW_SALE':
                return <span className={`${iconClass} text-green-600`}>💰</span>;
            case 'DISPUTE_OPENED':
                return <span className={`${iconClass} text-red-600`}>⚠️</span>;
            case 'REVIEW_RECEIVED':
                return <span className={`${iconClass} text-yellow-600`}>⭐</span>;
            case 'PAYOUT_PROCESSED':
                return <span className={`${iconClass} text-blue-600`}>💳</span>;
            case 'PRODUCT_APPROVED':
                return <span className={`${iconClass} text-green-600`}>✅</span>;
            case 'PRODUCT_REJECTED':
                return <span className={`${iconClass} text-red-600`}>❌</span>;
            default:
                return <Bell className={iconClass} />;
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
                <Bell className="w-6 h-6 text-slate-700" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Panel */}
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-white font-semibold text-lg">Notifications</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Actions */}
                        {notifications.length > 0 && (
                            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                <span className="text-sm text-slate-600">
                                    {unreadCount} unread
                                </span>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">No notifications</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-6 py-4 border-b border-slate-200 hover:bg-slate-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div className="flex-shrink-0 mt-1">
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h4 className="font-semibold text-slate-900 text-sm">
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.isRead && (
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-1 flex-shrink-0">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="p-1 hover:bg-slate-200 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
