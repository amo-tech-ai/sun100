
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getStartupProfile, updateStartupProfile } from '../../services/startupService';
import { useAuth } from '../../hooks/useAuth';

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
    lookingFor?: string[]; // Added field
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
    lookingFor: [], // Default empty
};

// Updated key for new branding
const STORAGE_KEY = 'startup_ai_profile';

export const StartupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<StartupProfile>(DEFAULT_PROFILE);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Load from DB if authenticated, else localStorage
    useEffect(() => {
        const loadProfile = async () => {
            if (user) {
                try {
                    const dbProfile = await getStartupProfile();
                    if (dbProfile) {
                        setProfile(dbProfile);
                    } else {
                         // If no DB profile, check local storage as fallback or keep default
                         const stored = localStorage.getItem(STORAGE_KEY);
                         if (stored) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(stored) });
                    }
                } catch (err) {
                    console.error("Failed to load startup profile from DB", err);
                }
            } else {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    try {
                        setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(stored) });
                    } catch (e) {
                        console.error("Failed to parse startup profile from storage", e);
                    }
                }
            }
            setLoading(false);
        };

        loadProfile();
    }, [user]);

    // Persist updates
    const updateProfile = async (updates: Partial<StartupProfile>) => {
        setProfile(prev => ({ ...prev, ...updates }));
        
        // Save to LocalStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...profile, ...updates }));

        // Save to DB if authenticated
        if (user) {
            try {
                await updateStartupProfile(updates);
            } catch (err) {
                console.error("Failed to sync profile update to DB", err);
            }
        }
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
