
import { supabase, IS_MOCK_MODE } from '../lib/supabaseClient';

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

const mockInvestors: Investor[] = [
    {
        id: 'inv-1',
        name: 'Sequoia Capital',
        type: 'vc',
        slug: 'sequoia',
        description: 'Helps daring founders build legendary companies from idea to IPO and beyond.',
        stages: ['Seed', 'Series A', 'Growth'],
        min_check_size: 500000,
        max_check_size: 10000000,
        specialties: ['SaaS', 'AI', 'Consumer', 'Crypto'],
        geographies: ['Global', 'US'],
        benefits: ['Top-tier network', 'Recruiting support', 'Brand prestige'],
        notable_investments: ['Airbnb', 'Stripe', 'Google'],
        website_url: 'https://sequoiacap.com'
    },
    {
        id: 'inv-2',
        name: 'Y Combinator',
        type: 'accelerator',
        slug: 'yc',
        description: 'The world\'s premier startup accelerator. We help founders make something people want.',
        stages: ['Pre-Seed', 'Seed'],
        min_check_size: 125000,
        max_check_size: 500000,
        equity_percent_min: 7,
        equity_percent_max: 7,
        terms_summary: '$125k for 7% + $375k MFN',
        specialties: ['SaaS', 'B2B', 'Consumer', 'Hardware', 'Bio'],
        geographies: ['Global'],
        benefits: ['Alumni network', 'Demo Day', 'Weekly dinners'],
        notable_investments: ['Coinbase', 'Dropbox', 'Reddit'],
        website_url: 'https://ycombinator.com'
    },
    {
        id: 'inv-3',
        name: 'a16z (Andreessen Horowitz)',
        type: 'vc',
        slug: 'a16z',
        description: 'Backs bold entrepreneurs building the future through technology.',
        stages: ['Seed', 'Series A', 'Series B', 'Growth'],
        min_check_size: 1000000,
        max_check_size: 50000000,
        specialties: ['Crypto', 'Bio', 'Games', 'Fintech', 'Enterprise'],
        geographies: ['US', 'Global'],
        benefits: ['Operational teams', 'Marketing support', 'Policy advocacy'],
        notable_investments: ['Facebook', 'Slack', 'Instacart'],
        website_url: 'https://a16z.com'
    },
    {
        id: 'inv-4',
        name: 'Techstars',
        type: 'accelerator',
        slug: 'techstars',
        description: 'Investment and innovation platform that connects entrepreneurs, investors, and corporations.',
        stages: ['Pre-Seed'],
        min_check_size: 20000,
        max_check_size: 120000,
        equity_percent_min: 6,
        equity_percent_max: 10,
        specialties: ['Generalist', 'City-specific programs'],
        geographies: ['Global'],
        benefits: ['Mentorship', 'Corporate partners', 'Global network'],
        notable_investments: ['SendGrid', 'DigitalOcean', 'ClassPass'],
        website_url: 'https://techstars.com'
    },
    {
        id: 'inv-5',
        name: 'First Round Capital',
        type: 'vc',
        slug: 'first-round',
        description: 'Seed-stage venture firm focused on building a vibrant community of technology entrepreneurs.',
        stages: ['Seed', 'Series A'],
        min_check_size: 750000,
        max_check_size: 4000000,
        specialties: ['SaaS', 'Consumer', 'Fintech', 'Healthcare'],
        geographies: ['US'],
        benefits: ['Knowledge sharing', 'Community events', 'Talent database'],
        notable_investments: ['Uber', 'Square', 'Notion'],
        website_url: 'https://firstround.com'
    },
    {
        id: 'inv-6',
        name: '500 Global',
        type: 'vc',
        slug: '500-global',
        description: 'Venture capital firm with more than $2.4 billion in assets under management that invests early in founders building fast-growing technology companies.',
        stages: ['Pre-Seed', 'Seed'],
        min_check_size: 150000,
        max_check_size: 500000,
        specialties: ['Global Markets', 'SaaS', 'Consumer'],
        geographies: ['Global', 'APAC', 'LATAM', 'MENA'],
        benefits: ['Global reach', 'Growth marketing support', 'Accelerator programs'],
        notable_investments: ['Canva', 'Grab', 'Twilio'],
        website_url: 'https://500.co'
    }
];

export const getInvestors = async (): Promise<Investor[]> => {
    // If Supabase is configured, use it
    if (!IS_MOCK_MODE) {
        const { data, error } = await supabase.from('investors').select('*');
        if (error) {
            console.warn("Failed to fetch investors from DB, using mock data", error);
            return mockInvestors;
        }
        
        // Map DB response to Investor interface if necessary (snake_case to camelCase usually handled, but types might need explicit cast)
        return data.map((inv: any) => ({
            ...inv,
            // Ensure arrays are not null
            stages: inv.stages || [],
            specialties: inv.specialties || [],
            geographies: inv.geographies || [],
            benefits: inv.benefits || [],
            notable_investments: inv.notable_investments || []
        }));
    }
    
    // Fallback to mock data
    return mockInvestors;
};

export const getInvestorById = async (id: string): Promise<Investor | undefined> => {
    if (!IS_MOCK_MODE) {
        const { data, error } = await supabase.from('investors').select('*').eq('id', id).single();
        if (error) {
             return mockInvestors.find(i => i.id === id);
        }
        
        return {
            ...data,
            stages: data.stages || [],
            specialties: data.specialties || [],
            geographies: data.geographies || [],
            benefits: data.benefits || [],
            notable_investments: data.notable_investments || []
        } as Investor;
    }

    return mockInvestors.find(i => i.id === id);
};

export const createInvestor = async (investor: Omit<Investor, 'id'>): Promise<Investor> => {
    if (!IS_MOCK_MODE) {
        const { data, error } = await supabase.from('investors').insert(investor).select().single();
        if (error) throw error;
        return data as Investor;
    }
    const newInvestor = { ...investor, id: `inv-${Date.now()}` };
    mockInvestors.push(newInvestor);
    return newInvestor;
};

export const updateInvestor = async (id: string, updates: Partial<Investor>): Promise<Investor> => {
    if (!IS_MOCK_MODE) {
        const { data, error } = await supabase.from('investors').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data as Investor;
    }
    const index = mockInvestors.findIndex(i => i.id === id);
    if (index !== -1) {
        mockInvestors[index] = { ...mockInvestors[index], ...updates };
        return mockInvestors[index];
    }
    throw new Error("Investor not found");
};

export const deleteInvestor = async (id: string): Promise<void> => {
    if (!IS_MOCK_MODE) {
        const { error } = await supabase.from('investors').delete().eq('id', id);
        if (error) throw error;
        return;
    }
    const index = mockInvestors.findIndex(i => i.id === id);
    if (index !== -1) {
        mockInvestors.splice(index, 1);
    }
};
