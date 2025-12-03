
import { supabase } from '../lib/supabaseClient';
import { StartupProfile } from '../contexts/StartupContext';

export interface Milestone {
    id: string;
    title: string;
    date: string;
    status: 'done' | 'active' | 'pending';
}

export interface TeamStats {
    total: number;
    openRoles: number;
    distribution: { department: string; count: number }[];
}

// --- Profile Management ---

export const getStartupProfile = async (): Promise<StartupProfile | null> => {
    try {
        // Mock Check
        if (!(supabase as any).realtime) return null;

        const { data: { user } } = await (supabase.auth as any).getUser();
        if (!user) return null;

        // First try to get the startup linked via team_members
        let startupId: string | null = null;
        
        const { data: membership } = await supabase
            .from('team_members')
            .select('startup_id')
            .eq('user_id', user.id)
            .maybeSingle();
            
        if (membership) {
            startupId = membership.startup_id;
        } else {
            // Fallback: Check if user owns a startup directly in startups table (if schema allows direct user_id link, though team_members is preferred)
            // Based on schema, startups table DOES NOT have user_id anymore in the final version (it's via orgs/teams)
            // But for safety in transition, we check if any existing logic used it. 
            // The new schema uses team_members. If no membership, user has no startup.
            return null;
        }

        const { data, error } = await supabase
            .from('startups')
            .select('*')
            .eq('id', startupId)
            .single();

        if (error) throw error;
        if (!data) return null;

        // Map DB fields to Frontend fields
        return {
            name: data.name,
            website: data.website_url || '',
            tagline: data.tagline || '',
            description: data.description || '',
            industry: data.industry || 'Technology',
            foundedYear: data.founded_year?.toString() || '',
            location: data.location || '',
            stage: data.stage || 'Seed',
            teamSize: data.team_size || '1-10',
            logoUrl: data.logo_url,
            coverImageUrl: data.cover_image_url || undefined, // Use cover_image_url from DB if available
            fundingAsk: data.funding_ask,
        };
    } catch (err) {
        console.warn("Failed to fetch startup profile:", err);
        return null;
    }
};

export const updateStartupProfile = async (updates: Partial<StartupProfile>): Promise<void> => {
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) throw new Error("User not authenticated");

    // Check if startup exists via team_members
    const { data: membership } = await supabase.from('team_members').select('startup_id').eq('user_id', user.id).maybeSingle();

    const dbUpdates = {
        name: updates.name,
        website_url: updates.website,
        tagline: updates.tagline,
        description: updates.description,
        industry: updates.industry,
        founded_year: updates.foundedYear ? parseInt(updates.foundedYear) : undefined,
        location: updates.location,
        stage: updates.stage,
        team_size: updates.teamSize,
        logo_url: updates.logoUrl,
        cover_image_url: updates.coverImageUrl, // Ensure this field matches DB
        funding_ask: updates.fundingAsk,
        contact_email: (updates as any).email, // Map email from context if present
        socials: (updates as any).socials,
        updated_at: new Date().toISOString()
    };

    // Clean undefined values
    Object.keys(dbUpdates).forEach(key => (dbUpdates as any)[key] === undefined && delete (dbUpdates as any)[key]);

    if (membership) {
        const { error } = await supabase.from('startups').update(dbUpdates).eq('id', membership.startup_id);
        if (error) throw error;
    } else {
        // Create new startup and link member
        // 1. Insert Startup
        if (!dbUpdates.name) dbUpdates.name = "My Startup";
        const { data: newStartup, error: startupError } = await supabase.from('startups').insert(dbUpdates).select().single();
        if (startupError) throw startupError;

        // 2. Create Team Member link
        const { error: memberError } = await supabase.from('team_members').insert({
            startup_id: newStartup.id,
            user_id: user.id,
            role: 'owner'
        });
        if (memberError) throw memberError;
    }
};

// --- Team & Milestones ---

export const getStartupTeamStats = async (): Promise<TeamStats> => {
    try {
        // Mock Check
        if (!(supabase as any).realtime) return { total: 0, openRoles: 0, distribution: [] };

        const { data: { user } } = await (supabase.auth as any).getUser();
        if (!user) return { total: 0, openRoles: 0, distribution: [] };

        const { data: membership } = await supabase.from('team_members').select('startup_id').eq('user_id', user.id).maybeSingle();
        if (!membership) return { total: 0, openRoles: 0, distribution: [] };

        const startupId = membership.startup_id;

        // Using Promise.allSettled to handle potential missing tables gracefully
        const [membersResult, jobsResult] = await Promise.allSettled([
            supabase.from('team_members').select('department').eq('startup_id', startupId),
            supabase.from('jobs').select('id').eq('startup_id', startupId).eq('is_active', true)
        ]);

        let members: any[] = [];
        let jobs: any[] = [];

        if (membersResult.status === 'fulfilled' && !membersResult.value.error) {
            members = membersResult.value.data || [];
        }
        if (jobsResult.status === 'fulfilled' && !jobsResult.value.error) {
            jobs = jobsResult.value.data || [];
        }

        const distributionMap = new Map<string, number>();
        members.forEach(m => {
            const dept = m.department || 'Other';
            distributionMap.set(dept, (distributionMap.get(dept) || 0) + 1);
        });

        const distribution = Array.from(distributionMap.entries()).map(([department, count]) => ({ department, count }));

        return {
            total: members.length,
            openRoles: jobs.length,
            distribution
        };
    } catch (err) {
        console.warn("Error fetching team stats:", err);
        return { total: 0, openRoles: 0, distribution: [] };
    }
};

export const getStartupMilestones = async (): Promise<Milestone[]> => {
    try {
        if (!(supabase as any).realtime) return [];

        const { data: { user } } = await (supabase.auth as any).getUser();
        if (!user) return [];

        const { data: membership } = await supabase.from('team_members').select('startup_id').eq('user_id', user.id).maybeSingle();
        if (!membership) return [];

        // Check if milestones table exists (it might be missing in early schema versions)
        // Ideally we assume schema is correct, but for safety in dev:
        const { data, error } = await supabase
            .from('milestones') // Assuming 'milestones' table exists as per full schema plan
            .select('*')
            .eq('startup_id', membership.startup_id)
            .order('target_date', { ascending: true });

        if (error) {
             // Graceful fallback if table is missing
             if (error.code === '42P01') return []; 
             throw error;
        }

        return data.map((m: any) => ({
            id: m.id,
            title: m.title,
            date: new Date(m.target_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            status: m.status
        }));
    } catch (err) {
        console.warn("Error fetching milestones:", err);
        return [];
    }
};