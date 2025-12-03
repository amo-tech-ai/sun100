import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

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
        // DEVELOPMENT OVERRIDE: Disable auth check and force mock user
        console.log("🔓 Auth disabled for development. Using mock user.");
        setUser({ id: 'mock-user-id', email: 'dev@sunaistartup.com', aud: 'authenticated' });
        setLoading(false);

        // Original auth logic preserved below for future reference:
        /*
        const getSession = async () => {
            try {
                // Cast to any to bypass potential type mismatch with v1/v2 definitions
                const { data: { session }, error } = await (supabase.auth as any).getSession();
                
                if (error || !session) {
                    console.warn("Supabase not configured or no session found. Providing mock user for layout review.");
                    setUser({ id: 'mock-user-id', email: 'review@example.com', aud: 'authenticated' });
                    setSession(null);
                } else {
                    setSession(session);
                    setUser(session?.user ?? null);
                }
            } catch (e) {
                console.error("Error getting Supabase session:", e);
                setUser({ id: 'mock-user-id', email: 'review@example.com', aud: 'authenticated' });
            } finally {
                setLoading(false);
            }
        };

        getSession();

        const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((_event: any, session: any) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
        */
    }, []);

    const value = {
        user,
        session,
        loading,
        login: (credentials: any) => (supabase.auth as any).signInWithPassword(credentials),
        signup: (credentials: any) => (supabase.auth as any).signUp(credentials),
        logout: () => (supabase.auth as any).signOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};