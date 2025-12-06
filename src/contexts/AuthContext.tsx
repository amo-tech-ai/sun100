
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase, IS_MOCK_MODE } from '../../lib/supabaseClient';

interface AuthContextType {
    user: any | null;
    session: any | null;
    loading: boolean;
    login: (credentials: any) => Promise<{ data: { user: any; session: any; } | { user: null; session: null; }, error: any | null }>;
    signup: (credentials: any) => Promise<{ data: { user: any; session: any; } | { user: null; session: null; }, error: any | null }>;
    logout: () => Promise<{ error: any | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [session, setSession] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if auth should be disabled
        // Default: disabled in development mode, enabled in production
        const isDev = (import.meta as any).env?.MODE === 'development';
        const disableAuthEnv = (import.meta as any).env?.VITE_DISABLE_AUTH;
        const DISABLE_AUTH = disableAuthEnv === 'true' || (isDev && disableAuthEnv !== 'false');

        // 1. Handle Development Mode (Auth Disabled)
        if (DISABLE_AUTH) {
            if (isDev) {
                console.log("🔓 Auth disabled in development mode. Using demo user.");
            } else {
                console.log("🔓 Auth disabled via VITE_DISABLE_AUTH=true. Using demo user.");
            }
            setUser({ id: 'dev-user-id', email: 'dev@sunaistartup.com', aud: 'authenticated' });
            setSession({ access_token: 'dev-token', user: { id: 'dev-user-id' } });
            setLoading(false);
            return;
        }

        // 2. Handle Mock Mode (No Supabase Env Vars)
        if (IS_MOCK_MODE) {
            console.warn("⚠️ Auth running in MOCK MODE. Using demo user.");
            setUser({ id: 'mock-user-id', email: 'demo@sunaistartup.com', aud: 'authenticated' });
            setSession({ access_token: 'mock-token', user: { id: 'mock-user-id' } });
            setLoading(false);
            return;
        }

        // 2. Handle Real Supabase Auth
        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                setSession(session);
                setUser(session?.user ?? null);
            } catch (e) {
                console.error("Error checking auth session:", e);
                setUser(null);
                setSession(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        session,
        loading,
        login: (credentials: any) => (supabase.auth as any).signInWithPassword(credentials),
        signup: (credentials: any) => (supabase.auth as any).signUp(credentials),
        logout: async () => {
            if (IS_MOCK_MODE) {
                setUser(null);
                setSession(null);
                return { error: null };
            }
            return await (supabase.auth as any).signOut();
        },
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
