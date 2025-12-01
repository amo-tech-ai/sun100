
import { supabase } from '../lib/supabaseClient';
import { Investor } from './vcService';

export type ApplicationStatus = 'Draft' | 'Submitted' | 'In Review' | 'Interview' | 'Due Diligence' | 'Accepted' | 'Rejected';

export interface Application {
    id: string;
    investorId: string;
    investorName: string;
    investorLogo: string;
    type: 'VC' | 'Accelerator' | 'Angel Group' | 'CVC';
    stage: string;
    checkSize: string;
    matchScore: number;
    status: ApplicationStatus;
    lastAction: string;
    lastActionDate: string;
    nextStep?: string;
    notes?: string;
}

const STORAGE_KEY = 'sun_ai_funding_applications';

const DEFAULT_MOCK_APPLICATIONS: Application[] = [
    {
        id: '1',
        investorId: 'yc-1',
        investorName: 'Y Combinator',
        investorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Y_Combinator_logo.svg/1024px-Y_Combinator_logo.svg.png',
        type: 'Accelerator',
        stage: 'Pre-Seed',
        checkSize: '$125k - $500k',
        matchScore: 98,
        status: 'Interview',
        lastAction: 'Partner Interview Scheduled',
        lastActionDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        nextStep: 'Prepare for 10min interview'
    },
    {
        id: '2',
        investorId: 'seq-1',
        investorName: 'Sequoia Capital',
        investorLogo: 'S',
        type: 'VC',
        stage: 'Seed',
        checkSize: '$1M - $5M',
        matchScore: 85,
        status: 'In Review',
        lastAction: 'Application Submitted',
        lastActionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    }
];

const getLocalData = (): Application[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_APPLICATIONS));
    return DEFAULT_MOCK_APPLICATIONS;
};

const saveLocalData = (data: Application[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getApplications = async (): Promise<Application[]> => {
    if ((supabase as any).realtime) {
         const { data, error } = await supabase.from('funding_applications').select('*');
         if (error) throw error;
         return data;
    }
    return new Promise(resolve => setTimeout(() => resolve(getLocalData()), 300));
};

export const createApplication = async (investor: Investor, matchScore: number = 0): Promise<Application> => {
    // Logic to create an application from an Investor profile
    const newApp: Application = {
        id: `app-${Date.now()}`,
        investorId: investor.id,
        investorName: investor.name,
        investorLogo: investor.logo_url || investor.name[0],
        type: investor.type === 'vc' ? 'VC' : investor.type === 'accelerator' ? 'Accelerator' : 'Angel Group',
        stage: investor.stages[0] || 'Seed',
        checkSize: `$${(investor.min_check_size || 0)/1000}k - $${(investor.max_check_size || 0)/1000}k`,
        matchScore: matchScore || 75,
        status: 'Draft',
        lastAction: 'Saved to Tracker',
        lastActionDate: new Date().toISOString()
    };

    if ((supabase as any).realtime) {
         const { data, error } = await supabase.from('funding_applications').insert(newApp).select().single();
         if (error) throw error;
         return data;
    }

    const current = getLocalData();
    // Prevent duplicates
    if (current.find(a => a.investorId === investor.id)) {
        throw new Error("Application already exists for this investor.");
    }

    const updated = [newApp, ...current];
    saveLocalData(updated);
    return new Promise(resolve => setTimeout(() => resolve(newApp), 300));
};
