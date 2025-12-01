
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('startups')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

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
            coverImageUrl: data.cover_image_url,
            fundingAsk: data.funding_ask,
        };
    } catch (err) {
        console.warn("Failed to fetch startup profile:", err);
        return null;
    }
};

export const updateStartupProfile = async (updates: Partial<StartupProfile>): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Check if startup exists
    const { data: existing } = await supabase.from('startups').select('id').eq('user_id', user.id).maybeSingle();

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
        cover_image_url: updates.coverImageUrl,
        funding_ask: updates.fundingAsk,
        user_id: user.id, // Ensure user_id is set for insert
        updated_at: new Date().toISOString()
    };

    // Clean undefined values
    Object.keys(dbUpdates).forEach(key => (dbUpdates as any)[key] === undefined && delete (dbUpdates as any)[key]);

    if (existing) {
        const { error } = await supabase.from('startups').update(dbUpdates).eq('id', existing.id);
        if (error) throw error;
    } else {
        // Insert if not exists (Upsert logic usually safer, but manual check helps with explicit creation flow)
        // Ensure name is present for creation
        if (!dbUpdates.name) dbUpdates.name = "My Startup";
        const { error } = await supabase.from('startups').insert(dbUpdates);
        if (error) throw error;
    }
};

// --- Team & Milestones ---

export const getStartupTeamStats = async (): Promise<TeamStats> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { total: 0, openRoles: 0, distribution: [] };

        const { data: startup } = await supabase.from('startups').select('id').eq('user_id', user.id).maybeSingle();
        if (!startup) return { total: 0, openRoles: 0, distribution: [] };

        // Using Promise.allSettled to handle potential missing tables gracefully
        const [membersResult, jobsResult] = await Promise.allSettled([
            supabase.from('team_members').select('department').eq('startup_id', startup.id),
            supabase.from('jobs').select('id').eq('startup_id', startup.id).eq('is_active', true)
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
        console.warn("Error fetching team stats (tables might not exist yet):", err);
        return { total: 0, openRoles: 0, distribution: [] };
    }
};

export const getStartupMilestones = async (): Promise<Milestone[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data: startup } = await supabase.from('startups').select('id').eq('user_id', user.id).maybeSingle();
        if (!startup) return [];

        const { data, error } = await supabase
            .from('milestones')
            .select('*')
            .eq('startup_id', startup.id)
            .order('target_date', { ascending: true });

        if (error) throw error;

        return data.map((m: any) => ({
            id: m.id,
            title: m.title,
            date: new Date(m.target_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            status: m.status
        }));
    } catch (err) {
        console.warn("Error fetching milestones (tables might not exist yet):", err);
        return [];
    }
};
