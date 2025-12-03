
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

export const getInvestors = async (): Promise<Investor[]> => {
    // If Supabase is configured, use it
    if (!IS_MOCK_MODE) {
        const { data, error } = await supabase.from('investors').select('*');
        if (error) throw error;
        
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
    
    // Fallback to empty or mock if DB not ready
    return [];
};

export const getInvestorById = async (id: string): Promise<Investor | undefined> => {
    if (!IS_MOCK_MODE) {
        const { data, error } = await supabase.from('investors').select('*').eq('id', id).single();
        if (error) return undefined;
        
        return {
            ...data,
            stages: data.stages || [],
            specialties: data.specialties || [],
            geographies: data.geographies || [],
            benefits: data.benefits || [],
            notable_investments: data.notable_investments || []
        } as Investor;
    }

    return undefined;
};

export const createInvestor = async (investor: Omit<Investor, 'id'>): Promise<Investor> => {
    if (!IS_MOCK_MODE) {
        const { data, error } = await supabase.from('investors').insert(investor).select().single();
        if (error) throw error;
        return data as Investor;
    }
    throw new Error("Database not available");
};

export const updateInvestor = async (id: string, updates: Partial<Investor>): Promise<Investor> => {
    if (!IS_MOCK_MODE) {
        const { data, error } = await supabase.from('investors').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data as Investor;
    }
     throw new Error("Database not available");
};

export const deleteInvestor = async (id: string): Promise<void> => {
    if (!IS_MOCK_MODE) {
        const { error } = await supabase.from('investors').delete().eq('id', id);
        if (error) throw error;
        return;
    }
     throw new Error("Database not available");
};
