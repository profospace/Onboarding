// src/components/layout/Sidebar.jsx
import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../redux/features/auth/authSlice';
import SidebarMenu from './SidebarMenu';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeMenu, setActiveMenu }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sidebar = useRef(null);
    const trigger = useRef(null);

    // Check if the user is an admin
    const isAdmin = user?.userType === 'admin' || user?.role === 'admin';

    // Close sidebar on mobile when clicking outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!sidebar.current || !trigger.current) return;
            if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
            setSidebarOpen(false);
        };

        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [sidebarOpen, setSidebarOpen]);

    // Close sidebar on Escape key press
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };

        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    }, [sidebarOpen, setSidebarOpen]);

    // Handle logout
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
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

    return (
        <aside
            ref={sidebar}
            className={`w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <div className="h-full flex flex-col justify-between">
                {/* App Logo at the top of sidebar */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        <span>Real Estate App</span>
                    </Link>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    <SidebarMenu
                        isAdmin={isAdmin}
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        setSidebarOpen={setSidebarOpen}
                    />
                </div>

                {/* User Profile and Logout */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAdmin ? 'bg-purple-600' : 'bg-blue-600'} text-white`}>
                            {getInitials(user?.name)}
                        </div>
                        <div>
                            <h3 className="font-medium">{user?.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{isAdmin ? 'Administrator' : 'Salesman'}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium hover:underline w-full"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Sign out
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;