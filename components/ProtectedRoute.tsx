
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Navigate, useLocation } = ReactRouterDOM;

interface ProtectedRouteProps {
    children: React.ReactElement;
}

// Check if auth should be disabled
// Default: disabled in development mode, enabled in production
// Override: Set VITE_DISABLE_AUTH=true to disable, VITE_DISABLE_AUTH=false to enable
const isDev = (import.meta as any).env?.MODE === 'development';
const disableAuthEnv = (import.meta as any).env?.VITE_DISABLE_AUTH;
const DISABLE_AUTH = disableAuthEnv === 'true' || (isDev && disableAuthEnv !== 'false');

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Bypass auth check in development mode
    if (DISABLE_AUTH) {
        if ((import.meta as any).env?.MODE === 'development') {
            console.log('🔓 Auth disabled in development mode');
        }
        return children;
    }

    if (loading) {
        // You can show a loading spinner here while the session is being checked
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#FBF8F5]">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-[#E87C4D]"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;