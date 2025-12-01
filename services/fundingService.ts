
import { supabase } from '../lib/supabaseClient';
import { Investor } from './vcService';

export type ApplicationStatus = 'Draft' | 'Submitted' | 'In Review' | 'Interview' | 'Due Diligence' | 'Accepted' | 'Rejected';

export interface Application {
    id: string;
    investorId: string; // This links to the 'investors' table if available, or just a placeholder
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

const mapDBToApplication = (dbRecord: any): Application => {
    // Helper to map DB type to Frontend type (case sensitivity handling)
    const mapType = (t: string): 'VC' | 'Accelerator' | 'Angel Group' | 'CVC' => {
        if (t === 'VC') return 'VC';
        if (t === 'Accelerator') return 'Accelerator';
        if (t === 'Angel Group') return 'Angel Group';
        if (t === 'CVC') return 'CVC';
        return 'VC';
    };

    return {
        id: dbRecord.id,
        investorId: dbRecord.investor_id || '',
        investorName: dbRecord.firm_name,
        investorLogo: dbRecord.logo_url || '',
        type: mapType(dbRecord.type),
        stage: 'Seed', // DB schema needs a 'stage' column in investor_contacts to be fully accurate, defaulting for now
        checkSize: dbRecord.check_size || '',
        matchScore: dbRecord.fit_score || 0,
        status: dbRecord.status as ApplicationStatus,
        lastAction: dbRecord.status, // Simplified for now
        lastActionDate: dbRecord.last_interaction_at,
        nextStep: dbRecord.next_step,
        notes: dbRecord.notes
    };
};

export const getApplications = async (): Promise<Application[]> => {
    if (!(supabase as any).realtime) {
         return []; // Mock fallback handled in previous version, simplified here for DB focus
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .single();

    if (!membership) return [];

    const { data, error } = await supabase
        .from('investor_contacts')
        .select('*')
        .eq('startup_id', membership.startup_id)
        .order('last_interaction_at', { ascending: false });

    if (error) throw error;

    return data.map(mapDBToApplication);
};

export const createApplication = async (investor: Investor, matchScore: number = 0): Promise<Application> => {
    if (!(supabase as any).realtime) {
        throw new Error("Database not connected");
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .single();

    if (!membership) throw new Error("Startup profile not found");

    const checkSizeStr = `$${(investor.min_check_size || 0)/1000}k - $${(investor.max_check_size || 0)/1000}k`;
    
    // Map investor type to DB enum
    let dbType: 'VC' | 'Accelerator' | 'Angel Group' | 'CVC' = 'VC';
    if (investor.type === 'accelerator') dbType = 'Accelerator';
    else if (investor.type === 'angel_group') dbType = 'Angel Group';
    else if (investor.type === 'corporate_vc') dbType = 'CVC';

    const payload = {
        startup_id: membership.startup_id,
        investor_id: investor.id,
        firm_name: investor.name,
        logo_url: investor.logo_url,
        type: dbType,
        status: 'Draft' as const,
        check_size: checkSizeStr,
        fit_score: matchScore || 75,
        last_interaction_at: new Date().toISOString(),
        notes: `Added from directory. Specialties: ${investor.specialties.join(', ')}`
    };

    // Check for existing application
    const { data: existing } = await supabase
        .from('investor_contacts')
        .select('id')
        .eq('startup_id', membership.startup_id)
        .eq('investor_id', investor.id)
        .maybeSingle();

    if (existing) {
        throw new Error("Application already exists for this investor.");
    }

    const { data, error } = await supabase
        .from('investor_contacts')
        .insert(payload)
        .select()
        .single();

    if (error) throw error;

    return mapDBToApplication(data);
};
