
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

// Mock Data
const MOCK_PROFILE: StartupProfile = {
    name: 'My Startup',
    website: 'https://example.com',
    tagline: 'Revolutionizing the future of AI.',
    description: 'We are building the next generation of intelligent tools to empower creators and businesses worldwide.',
    industry: 'Artificial Intelligence',
    foundedYear: '2024',
    location: 'San Francisco, CA',
    stage: 'Seed',
    teamSize: '1-10',
    fundingAsk: '$2M',
    logoUrl: '',
    coverImageUrl: ''
};

const MOCK_MILESTONES: Milestone[] = [
    { id: '1', title: 'Incorporation', date: 'Jan 15', status: 'done' },
    { id: '2', title: 'MVP Launch', date: 'Mar 01', status: 'done' },
    { id: '3', title: 'First 100 Users', date: 'Apr 10', status: 'active' },
    { id: '4', title: 'Seed Round Close', date: 'Jun 30', status: 'pending' }
];

const MOCK_TEAM_STATS: TeamStats = {
    total: 8,
    openRoles: 3,
    distribution: [
        { department: 'Engineering', count: 4 },
        { department: 'Product', count: 2 },
        { department: 'Sales', count: 1 },
        { department: 'Marketing', count: 1 }
    ]
};

// --- Profile Management ---

export const getStartupProfile = async (): Promise<StartupProfile | null> => {
    try {
        // Mock Check
        if (!(supabase as any).realtime) return MOCK_PROFILE;

        const { data: { user } } = await (supabase.auth as any).getUser();
        if (!user) return MOCK_PROFILE;

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
            return MOCK_PROFILE;
        }

        const { data, error } = await supabase
            .from('startups')
            .select('*')
            .eq('id', startupId)
            .single();

        if (error) throw error;
        if (!data) return MOCK_PROFILE;

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
        console.warn("Failed to fetch startup profile, using mock:", err);
        return MOCK_PROFILE;
    }
};

export const updateStartupProfile = async (updates: Partial<StartupProfile>): Promise<void> => {
    // Mock check
    if (!(supabase as any).realtime) return;

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
        if (!(supabase as any).realtime) return MOCK_TEAM_STATS;

        const { data: { user } } = await (supabase.auth as any).getUser();
        if (!user) return MOCK_TEAM_STATS;

        const { data: membership } = await supabase.from('team_members').select('startup_id').eq('user_id', user.id).maybeSingle();
        if (!membership) return MOCK_TEAM_STATS;

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
        return MOCK_TEAM_STATS;
    }
};

export const getStartupMilestones = async (): Promise<Milestone[]> => {
    try {
        if (!(supabase as any).realtime) return MOCK_MILESTONES;

        const { data: { user } } = await (supabase.auth as any).getUser();
        if (!user) return MOCK_MILESTONES;

        const { data: membership } = await supabase.from('team_members').select('startup_id').eq('user_id', user.id).maybeSingle();
        if (!membership) return MOCK_MILESTONES;

        const { data, error } = await supabase
            .from('milestones')
            .select('*')
            .eq('startup_id', membership.startup_id)
            .order('target_date', { ascending: true });

        if (error) {
             // Graceful fallback if table is missing
             if (error.code === '42P01') return MOCK_MILESTONES; 
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
        return MOCK_MILESTONES;
    }
};
