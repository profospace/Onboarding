// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../redux/features/auth/authSlice';
import { useTheme } from '../../hooks/useTheme';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const { darkMode, toggleDarkMode } = useTheme();
    // In MainLayout.jsx
    const { darkMode, toggleDarkMode } = useTheme() || { darkMode: localStorage.getItem('darkMode') === 'true' };
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const trigger = useRef(null);
    const notificationRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            // Handle notification dropdown
            if (notificationRef.current && !notificationRef.current.contains(target)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, []);

    // Handle logout
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setDropdownOpen(false);
    };

    // Get user initials for avatar
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    // Check if the user is an admin
    const isAdmin = user?.userType === 'admin' || user?.role === 'admin';

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm z-30 sticky top-0">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Left side - Logo and hamburger */}
                <div className="flex items-center">
                    <button
                        ref={trigger}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-controls="sidebar"
                        className="md:hidden mr-4 focus:outline-none"
                    >
                        {sidebarOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        )}
                    </button>

                    {/* <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        <span className="hidden sm:inline">Real Estate App</span>
                    </Link> */}
                </div>

                {/* Right side - User profile and actions */}
                <div className="flex items-center gap-3">
                    {/* Dark mode toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                            </svg>
                        )}
                    </button>

                    {/* Notification icon */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none relative"
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                        </button>

                        {/* Notification Dropdown */}
                        {notificationsOpen && <NotificationDropdown />}
                    </div>

                    {/* User dropdown */}
                    <UserDropdown
                        user={user}
                        isAdmin={isAdmin}
                        getInitials={getInitials}
                        handleLogout={handleLogout}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;