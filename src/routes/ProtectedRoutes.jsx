import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/* =========================
   BASE PROTECTED ROUTE
   ========================= */
export const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();

    console.log('[PROTECTED ROUTE]', { user, isLoading });

    // ⏳ Wait for auth to resolve
    if (isLoading) {
        console.log('[PROTECTED ROUTE] waiting...');
        return null; // or loader
    }

    if (!user) {
        console.warn('[PROTECTED ROUTE] no user → redirect login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log('[PROTECTED ROUTE] access granted');
    return children ? children : <Outlet />;
};

/* =========================
   ADMIN ROUTE
   ========================= */
export const AdminRoute = ({ children }) => {
    const { user, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();

    console.log('[ADMIN ROUTE]', { user, isLoading });

    if (isLoading) {
        console.log('[ADMIN ROUTE] waiting...');
        return null;
    }

    if (!user) {
        console.warn('[ADMIN ROUTE] no user → login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.userType !== 'admin' && user.role !== 'admin') {
        console.warn('[ADMIN ROUTE] not admin → dashboard');
        return <Navigate to="/dashboard" replace />;
    }

    console.log('[ADMIN ROUTE] access granted');
    return children ? children : <Outlet />;
};

/* =========================
   SALESMAN ROUTE
   ========================= */
export const SalesmanRoute = ({ children }) => {
    const { user, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();

    console.log('[SALESMAN ROUTE]', { user, isLoading });

    if (isLoading) {
        console.log('[SALESMAN ROUTE] waiting...');
        return null;
    }

    if (!user) {
        console.warn('[SALESMAN ROUTE] no user → login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.userType !== 'salesman') {
        console.warn('[SALESMAN ROUTE] not salesman → dashboard');
        return <Navigate to="/dashboard" replace />;
    }

    console.log('[SALESMAN ROUTE] access granted');
    return children ? children : <Outlet />;
};

/* =========================
   STAFF ROUTE (ADMIN + SALESMAN)
   ========================= */
export const StaffRoute = ({ children }) => {
    const { user, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();

    console.log('[STAFF ROUTE]', { user, isLoading });

    if (isLoading) {
        console.log('[STAFF ROUTE] waiting...');
        return null;
    }

    if (!user) {
        console.warn('[STAFF ROUTE] no user → login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.userType !== 'admin' && user.userType !== 'salesman') {
        console.warn('[STAFF ROUTE] invalid role → dashboard');
        return <Navigate to="/dashboard" replace />;
    }

    console.log('[STAFF ROUTE] access granted');
    return children ? children : <Outlet />;
};
