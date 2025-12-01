
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface StartupProfile {
    name: string;
    website: string;
    tagline: string;
    description: string;
    industry: string;
    foundedYear: string;
    location: string;
    stage: string;
    teamSize: string;
    logoUrl?: string;
    coverImageUrl?: string;
    fundingAsk?: string;
}

interface StartupContextType {
    profile: StartupProfile;
    updateProfile: (updates: Partial<StartupProfile>) => void;
    resetProfile: () => void;
    loading: boolean;
}

export const StartupContext = createContext<StartupContextType | undefined>(undefined);

const DEFAULT_PROFILE: StartupProfile = {
    name: 'My Startup',
    website: '',
    tagline: '',
    description: '',
    industry: 'Technology',
    foundedYear: new Date().getFullYear().toString(),
    location: '',
    stage: 'Seed',
    teamSize: '1-10',
    fundingAsk: '$1M',
};

const STORAGE_KEY = 'sun_ai_startup_profile';

export const StartupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<StartupProfile>(DEFAULT_PROFILE);
    const [loading, setLoading] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(stored) });
            } catch (e) {
                console.error("Failed to parse startup profile from storage", e);
            }
        }
        setLoading(false);
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        }
    }, [profile, loading]);

    const updateProfile = (updates: Partial<StartupProfile>) => {
        setProfile(prev => ({ ...prev, ...updates }));
    };

    const resetProfile = () => {
        setProfile(DEFAULT_PROFILE);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <StartupContext.Provider value={{ profile, updateProfile, resetProfile, loading }}>
            {children}
        </StartupContext.Provider>
    );
};
