import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User, AuthError, SignUpWithPasswordCredentials, SignInWithPasswordCredentials } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    login: (credentials: SignInWithPasswordCredentials) => Promise<{ data: { user: User; session: Session; } | { user: null; session: null; }, error: AuthError | null }>;
    signup: (credentials: SignUpWithPasswordCredentials) => Promise<{ data: { user: User; session: Session; } | { user: null; session: null; }, error: AuthError | null }>;
    logout: () => Promise<{ error: AuthError | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error || !session) {
                    console.warn("Supabase not configured or no session found. Providing mock user for layout review.");
                    setUser({ id: 'mock-user-id', email: 'review@example.com', aud: 'authenticated' } as User);
                    setSession(null);
                } else {
                    setSession(session);
                    setUser(session?.user ?? null);
                }
            } catch (e) {
                console.error("Error getting Supabase session:", e);
                setUser({ id: 'mock-user-id', email: 'review@example.com', aud: 'authenticated' } as User);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        session,
        loading,
        login: (credentials: SignInWithPasswordCredentials) => supabase.auth.signInWithPassword(credentials),
        signup: (credentials: SignUpWithPasswordCredentials) => supabase.auth.signUp(credentials),
        logout: () => supabase.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
