
import { supabase } from '../lib/supabaseClient';
import { StartupProfile } from '../contexts/StartupContext';
import { UserProfile } from '../types/founder';

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

// Mock Data for Startup Context
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

// Mock Data for Founder Profile (Public View)
const MOCK_FOUNDER_PROFILE: UserProfile = {
    username: 'alex-chen',
    name: 'Alex Chen',
    title: 'Founder & CEO, StartupAI',
    avatarUrl: 'https://storage.googleapis.com/aistudio-hosting/profile-placeholders/person3.jpg',
    bio: "Obsessed with democratizing access to AI for the next generation of founders. Building tools that make professional design and storytelling effortless. Previously at Google AI, scaling infrastructure for machine learning models to millions of users.",
    socials: {
        linkedin: '#',
        twitter: '#',
        website: 'https://startupai.com'
    },
    startup: {
        name: 'StartupAI',
        logoUrl: 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png',
        tagline: 'Your AI-Powered Startup Hub for Growth.',
        description: 'An all-in-one platform that helps founders build pitch decks, find investors, and manage their startup journey using advanced AI tools.',
        website: 'https://startupai.com',
        fundingGoal: '$1.5M Seed',
        industry: 'Generative AI / SaaS',
        stage: 'Seed',
        traction: '500+ Beta Users, $10k MRR',
        businessModel: 'SaaS Subscription ($49/mo)',
        team: [
             { name: 'Alex Chen', role: 'CEO', background: 'Ex-Google AI' },
             { name: 'Samantha Rao', role: 'CTO', background: 'PhD in ML' },
             { name: 'David Kim', role: 'Product', background: '2x Founder' }
        ]
    },
    lookingFor: ['Seed Funding', 'Technical Co-founder', 'Beta Testers'],
    publicDecks: [
        { id: 'deck-1', title: 'StartupAI Seed Round Pitch', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/docs/service-web.png' },
        { id: 'deck-2', title: 'Q3 Product Update', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/docs/service-mvp.png' },
    ]
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

// --- Public Profile Fetching ---

export const getPublicFounderProfile = async (username: string): Promise<UserProfile | null> => {
    try {
        // Mock Check
        if (!(supabase as any).realtime) {
             // Simulate network delay
             await new Promise(r => setTimeout(r, 800));
             // Return mock if username matches mock, else null (simulate 404)
             return username === 'alex-chen' ? MOCK_FOUNDER_PROFILE : null;
        }

        // 1. Get User Profile by username
        const { data: userProfile, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username) // Assumes 'username' column exists in profiles table
            .single();

        if (userError || !userProfile) {
            console.warn("User not found for username:", username);
            return null;
        }

        // 2. Get Associated Startup (Owner/Admin)
        const { data: membership } = await supabase
            .from('team_members')
            .select('startup_id')
            .eq('user_id', userProfile.id)
            .in('role', ['owner', 'admin'])
            .limit(1)
            .single();

        if (!membership) return null;

        const { data: startup } = await supabase
            .from('startups')
            .select('*')
            .eq('id', membership.startup_id)
            .single();

        if (!startup) return null;

        // 3. Get Public Decks
        const { data: decks } = await supabase
            .from('decks')
            .select('id, title, slides(image_url)') // Fetch first slide image roughly
            .eq('startup_id', startup.id)
            .eq('status', 'published') // Assuming 'status' column
            .limit(4);

        const publicDecks = (decks || []).map((d: any) => ({
            id: d.id,
            title: d.title,
            imageUrl: d.slides?.[0]?.image_url || 'https://via.placeholder.com/300x200?text=Deck'
        }));

        // 4. Construct UserProfile object
        return {
            username: userProfile.username || username,
            name: userProfile.full_name || 'Founder',
            title: userProfile.title || 'Founder',
            avatarUrl: userProfile.avatar_url || '',
            bio: userProfile.bio || '',
            socials: {
                linkedin: userProfile.linkedin_url || '#',
                twitter: userProfile.twitter_url || '#',
                website: userProfile.website_url || ''
            },
            startup: {
                name: startup.name,
                logoUrl: startup.logo_url || '',
                tagline: startup.tagline || '',
                description: startup.description || '',
                website: startup.website_url || '',
                fundingGoal: startup.funding_ask || '',
                industry: startup.industry || 'Tech',
                stage: startup.stage || 'Seed',
                traction: 'See deck', // Placeholder if not in DB
                businessModel: 'See deck', // Placeholder
                team: [] // Populate if team data available
            },
            lookingFor: ['Investors', 'Partners'], // Could be a DB field
            publicDecks
        };

    } catch (err) {
        console.error("Error fetching public profile:", err);
        return null;
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
