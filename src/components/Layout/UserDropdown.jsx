// src/components/layout/UserDropdown.jsx
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserDropdown = ({ user, isAdmin, getInitials, handleLogout, dropdownOpen, setDropdownOpen }) => {
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [setDropdownOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAdmin ? 'bg-purple-600' : 'bg-blue-600'} text-white`}>
                    {getInitials(user?.name)}
                </div>
                <span className="hidden md:inline font-medium">{user?.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{isAdmin ? 'Administrator' : 'Salesman'}</p>
                    </div>

                    <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                        onClick={() => setDropdownOpen(false)}
                    >
                        Settings
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;