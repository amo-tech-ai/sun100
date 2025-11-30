
import { supabase } from '../lib/supabaseClient';

export interface Investor {
    id: string;
    name: string;
    type: 'vc' | 'accelerator' | 'angel_group' | 'corporate_vc';
    slug: string;
    logo_url?: string;
    description?: string;
    website_url?: string;
    stages: string[];
    min_check_size?: number;
    max_check_size?: number;
    equity_percent_min?: number;
    equity_percent_max?: number;
    specialties: string[];
    geographies: string[];
    benefits: string[];
    time_to_decision?: string; // e.g. "2-4 weeks"
    notable_investments: string[];
    application_link?: string;
    contact_email?: string;
    terms_summary?: string; // Context on equity (e.g. "SAFE + MFN")
}

const DEFAULT_MOCK_INVESTORS: Investor[] = [
    {
        id: 'yc-1',
        name: 'Y Combinator',
        type: 'accelerator',
        slug: 'y-combinator',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Y_Combinator_logo.svg/1024px-Y_Combinator_logo.svg.png',
        description: 'YC is the world’s most successful startup accelerator. We give startups money, advice, and connections. Twice a year we invest in a large number of startups to help them get into the best possible shape and refine their pitch to investors.',
        website_url: 'https://www.ycombinator.com',
        stages: ['Pre-Seed', 'Seed', 'Early Stage'],
        min_check_size: 125000,
        max_check_size: 500000,
        equity_percent_min: 7,
        equity_percent_max: 7,
        terms_summary: '$125k for 7% equity + $375k on an uncapped SAFE with MFN',
        specialties: ['B2B SaaS', 'Consumer', 'Healthcare', 'Fintech', 'AI', 'Developer Tools', 'Hard Tech'],
        geographies: ['Global', 'San Francisco (HQ)'],
        benefits: ['Weekly Dinners', 'Office Hours', 'Alumni Network (Bookface)', 'Demo Day Exposure', 'Deals & Discounts'],
        time_to_decision: '1-2 weeks (during batch cycle)',
        notable_investments: ['Airbnb', 'Stripe', 'Dropbox', 'Coinbase', 'DoorDash', 'Reddit', 'Twitch'],
        application_link: 'https://www.ycombinator.com/apply'
    },
    {
        id: 'seq-1',
        name: 'Sequoia Capital',
        type: 'vc',
        slug: 'sequoia',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Sequoia_Capital_logo.svg/2560px-Sequoia_Capital_logo.svg.png',
        description: 'We help the daring build legendary companies. From idea to IPO and beyond. Sequoia has partnered with founders to create companies now worth over $3.3 trillion.',
        website_url: 'https://www.sequoiacap.com',
        stages: ['Seed', 'Series A', 'Series B', 'Growth'],
        min_check_size: 500000,
        max_check_size: 50000000,
        equity_percent_min: 10,
        equity_percent_max: 20,
        specialties: ['SaaS', 'AI', 'Fintech', 'Consumer', 'Enterprise', 'Crypto'],
        geographies: ['Global', 'US', 'Europe', 'China', 'India'],
        benefits: ['Top-tier Network', 'Hiring Support', 'Brand Prestige', 'Operational Guidance'],
        time_to_decision: '3-6 weeks',
        notable_investments: ['Apple', 'Google', 'Stripe', 'Airbnb', 'Nvidia'],
        application_link: 'https://www.sequoiacap.com/pitch'
    },
    {
        id: 'a16z-1',
        name: 'a16z (Andreessen Horowitz)',
        type: 'vc',
        slug: 'a16z',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Andreessen_Horowitz_Logo.svg/2560px-Andreessen_Horowitz_Logo.svg.png',
        description: 'A venture capital firm that backs bold entrepreneurs building the future through technology. We provide expertise and capital to help founders build.',
        website_url: 'https://a16z.com',
        stages: ['Seed', 'Series A', 'Series B', 'Growth'],
        min_check_size: 1000000,
        max_check_size: 100000000,
        equity_percent_min: 15,
        equity_percent_max: 25,
        specialties: ['Crypto', 'Bio', 'Health', 'Fintech', 'Games', 'Enterprise', 'American Dynamism'],
        geographies: ['US', 'Europe'],
        benefits: ['Marketing Agency', 'Talent Network', 'Policy Advisory', 'Technical Due Diligence'],
        time_to_decision: '4-8 weeks',
        notable_investments: ['Facebook', 'Slack', 'Instacart', 'Figma', 'GitHub'],
        application_link: 'https://a16z.com/pitch'
    },
    {
        id: 'techstars-1',
        name: 'Techstars',
        type: 'accelerator',
        slug: 'techstars',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Techstars_Logo.svg',
        description: 'Techstars allows you to gain access to capital, mentorship, and other support for your startup. We run 50+ programs worldwide.',
        website_url: 'https://www.techstars.com',
        stages: ['Pre-Seed', 'Seed'],
        min_check_size: 20000,
        max_check_size: 120000,
        equity_percent_min: 6,
        equity_percent_max: 10,
        specialties: ['Generalist', 'Space', 'Energy', 'Fintech', 'Sustainability'],
        geographies: ['Global', 'US', 'Europe', 'APAC'],
        benefits: ['Mentorship Madness', 'Corporate Partnerships', 'Perks Package', 'Global Network'],
        time_to_decision: '2-4 weeks',
        notable_investments: ['DigitalOcean', 'SendGrid', 'PillPack', 'ClassPass'],
        application_link: 'https://www.techstars.com/apply'
    },
    {
        id: 'firstround-1',
        name: 'First Round Capital',
        type: 'vc',
        slug: 'first-round',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/First_Round_Capital_logo.png/800px-First_Round_Capital_logo.png',
        description: 'We specialize in seed-stage investing. We help founders get from 0 to 1 with tactical advice, community, and resources.',
        website_url: 'https://firstround.com',
        stages: ['Pre-Seed', 'Seed'],
        min_check_size: 750000,
        max_check_size: 4000000,
        equity_percent_min: 10,
        equity_percent_max: 15,
        specialties: ['SaaS', 'Marketplace', 'Consumer', 'Fintech'],
        geographies: ['US'],
        benefits: ['First Round Review', 'Co-founder Matching', 'Expert Network'],
        time_to_decision: '2-3 weeks',
        notable_investments: ['Uber', 'Square', 'Notion', 'Roblox'],
        application_link: 'https://firstround.com/pitch'
    }
];

// --- Local Storage Persistence for Demo Mode ---
const STORAGE_KEY = 'sun_ai_investors_data';

const getLocalData = (): Investor[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with defaults
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_INVESTORS));
    return DEFAULT_MOCK_INVESTORS;
};

const saveLocalData = (data: Investor[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getInvestors = async (): Promise<Investor[]> => {
    // If Supabase is configured, use it
    if ((supabase as any).realtime) {
        const { data, error } = await supabase.from('investors').select('*');
        if (error) throw error;
        return data;
    }
    
    // Otherwise use local mocked data
    return new Promise(resolve => {
        setTimeout(() => resolve(getLocalData()), 300);
    });
};

export const getInvestorById = async (id: string): Promise<Investor | undefined> => {
    if ((supabase as any).realtime) {
        const { data, error } = await supabase.from('investors').select('*').eq('id', id).single();
        if (error) return undefined;
        return data;
    }

    const investors = getLocalData();
    return new Promise(resolve => setTimeout(() => resolve(investors.find(inv => inv.id === id)), 300));
};

export const createInvestor = async (investor: Omit<Investor, 'id'>): Promise<Investor> => {
    if ((supabase as any).realtime) {
        const { data, error } = await supabase.from('investors').insert(investor).select().single();
        if (error) throw error;
        return data;
    }

    const newInvestor = { ...investor, id: `mock-inv-${Date.now()}` };
    const currentData = getLocalData();
    saveLocalData([...currentData, newInvestor]);
    return new Promise(resolve => setTimeout(() => resolve(newInvestor), 500));
};

export const updateInvestor = async (id: string, updates: Partial<Investor>): Promise<Investor> => {
    if ((supabase as any).realtime) {
        const { data, error } = await supabase.from('investors').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    }

    const currentData = getLocalData();
    const index = currentData.findIndex(inv => inv.id === id);
    if (index === -1) throw new Error("Investor not found");
    
    const updatedInvestor = { ...currentData[index], ...updates };
    currentData[index] = updatedInvestor;
    saveLocalData(currentData);
    return new Promise(resolve => setTimeout(() => resolve(updatedInvestor), 500));
};

export const deleteInvestor = async (id: string): Promise<void> => {
    if ((supabase as any).realtime) {
        const { error } = await supabase.from('investors').delete().eq('id', id);
        if (error) throw error;
        return;
    }

    const currentData = getLocalData();
    const newData = currentData.filter(inv => inv.id !== id);
    saveLocalData(newData);
    return new Promise(resolve => setTimeout(() => resolve(), 500));
};
