import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Base ProtectedRoute that checks for authentication
export const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user) {
        // Redirect to the login page with return path
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children ? children : <Outlet />;
};

// Admin-only route
export const AdminRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user is an admin
    if (user.userType !== 'admin' && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children ? children : <Outlet />;
};

// Salesman-only route
export const SalesmanRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user is a salesman (not an admin)
    if (user.userType !== 'salesman') {
        return <Navigate to="/dashboard" replace />;
    }

    return children ? children : <Outlet />;
};

// Route that allows both admins and salesmen
export const StaffRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user is either admin or salesman
    if (user.userType !== 'admin' && user.userType !== 'salesman') {
        return <Navigate to="/dashboard" replace />;
    }

    return children ? children : <Outlet />;
};