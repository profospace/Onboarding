// src/components/layout/NotificationDropdown.jsx
import React from 'react';

// Dummy notification data
const notifications = [
    {
        id: 1,
        title: 'New property added',
        message: 'A new property has been added to your portfolio.',
        time: '5 minutes ago',
        read: false,
        type: 'property'
    },
    {
        id: 2,
        title: 'Meeting scheduled',
        message: 'Client meeting scheduled for tomorrow at 2 PM.',
        time: '1 hour ago',
        read: false,
        type: 'meeting'
    },
    {
        id: 3,
        title: 'Property visit reminder',
        message: 'Don\'t forget your property visit at 123 Main St.',
        time: '3 hours ago',
        read: true,
        type: 'reminder'
    },
    {
        id: 4,
        title: 'Monthly report available',
        message: 'February 2025 performance report is now available.',
        time: '1 day ago',
        read: true,
        type: 'report'
    }
];

const NotificationDropdown = () => {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'property':
                return (
                    <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                    </div>
                );
            case 'meeting':
                return (
                    <div className="rounded-full p-2 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                );
            case 'reminder':
                return (
                    <div className="rounded-full p-2 bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                );
            case 'report':
                return (
                    <div className="rounded-full p-2 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="rounded-full p-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                    </div>
                );
        }
    };

    return (
        <div className="absolute right-0 mt-2 w-80 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                    Mark all as read
                </span>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-start gap-3 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                            }`}
                    >
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                                {notification.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block">
                                {notification.time}
                            </span>
                        </div>
                        {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                    </div>
                ))}
            </div>

            <div className="px-4 py-2 text-center">
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    View all notifications
                </button>
            </div>
        </div>
    );
};

export default NotificationDropdown;