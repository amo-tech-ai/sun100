
import { supabase, IS_MOCK_MODE } from '../lib/supabaseClient';

export interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    type: string; // 'Full-time', 'Contract', etc.
    postedAt: string;
    salaryRange?: string;
    startupId: string;
    startupName: string;
    startupLogo: string;
    isActive?: boolean;
    applicantCount?: number;
}

export interface JobApplication {
    id: string;
    jobId: string;
    jobTitle: string;
    userId: string;
    applicantName: string;
    applicantEmail: string;
    coverLetter: string;
    status: 'New' | 'Reviewing' | 'Interview' | 'Offer' | 'Rejected';
    appliedAt: string;
}

const MOCK_JOBS: Job[] = [
    {
        id: '1',
        title: "AI Prompt Engineer",
        description: "We are looking for a creative and technical AI Prompt Engineer to help us build the next generation of AI-powered tools. You will design, test, and refine prompts for large language models.",
        location: "Remote",
        type: "Full-time",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        salaryRange: "$120k - $160k",
        startupId: 's1',
        startupName: "Nexus AI",
        startupLogo: "N",
        isActive: true,
        applicantCount: 12
    },
    {
        id: '2',
        title: "Senior Frontend Developer",
        description: "Join our core product team to build responsive, high-performance interfaces using React and Tailwind CSS.",
        location: "San Francisco, CA",
        type: "Full-time",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        salaryRange: "$150k - $200k",
        startupId: 's2',
        startupName: "FlowStack",
        startupLogo: "F",
        isActive: true,
        applicantCount: 5
    },
    {
        id: '3',
        title: "Growth Marketing Manager",
        description: "Lead our user acquisition strategy. You should be data-driven and experienced with B2B SaaS growth funnels.",
        location: "New York, NY",
        type: "Full-time",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        salaryRange: "$100k - $140k",
        startupId: 's3',
        startupName: "HealthSync",
        startupLogo: "H",
        isActive: true,
        applicantCount: 0
    },
    {
        id: '4',
        title: "Freelance UX Designer",
        description: "We need a talented designer to help redesign our mobile onboarding flow. Project-based engagement.",
        location: "Remote",
        type: "Contract",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
        salaryRange: "$80 - $120 / hr",
        startupId: 's1',
        startupName: "Nexus AI",
        startupLogo: "N",
        isActive: true,
        applicantCount: 3
    }
];

let MOCK_APPLICATIONS: JobApplication[] = [
    {
        id: 'app-1',
        jobId: '1',
        jobTitle: 'AI Prompt Engineer',
        userId: 'u1',
        applicantName: 'Sarah Jenkins',
        applicantEmail: 'sarah.j@example.com',
        coverLetter: 'I have 3 years of experience fine-tuning LLMs and building RAG pipelines.',
        status: 'New',
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
        id: 'app-2',
        jobId: '1',
        jobTitle: 'AI Prompt Engineer',
        userId: 'u2',
        applicantName: 'David Chen',
        applicantEmail: 'd.chen@test.com',
        coverLetter: 'Huge fan of Nexus AI. I built a similar tool for my last startup.',
        status: 'Interview',
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
        id: 'app-3',
        jobId: '4',
        jobTitle: 'Freelance UX Designer',
        userId: 'u3',
        applicantName: 'Emily Wong',
        applicantEmail: 'emily.design@studio.io',
        coverLetter: 'Here is a link to my portfolio. I specialize in mobile-first SaaS.',
        status: 'Reviewing',
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    }
];

export const getJobs = async (): Promise<Job[]> => {
    if (IS_MOCK_MODE) {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_JOBS), 800));
    }

    try {
        // Fetch jobs and join with startups table for name/logo
        const { data, error } = await supabase
            .from('jobs')
            .select('*, startups(name, logo_url)')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((job: any) => ({
            id: job.id,
            title: job.title,
            description: job.description,
            location: job.location,
            type: job.type,
            postedAt: job.created_at,
            salaryRange: job.salary_range, 
            startupId: job.startup_id,
            startupName: job.startups?.name || 'Unknown Startup',
            startupLogo: job.startups?.logo_url || job.startups?.name?.[0] || 'S',
            applicantCount: 0 // In real app, this would be a count query
        }));
    } catch (error) {
        console.warn("Failed to fetch jobs from Supabase, falling back to mock.", error);
        return MOCK_JOBS;
    }
};

export const getJobById = async (id: string): Promise<Job | null> => {
    if (IS_MOCK_MODE) {
        const job = MOCK_JOBS.find(j => j.id === id);
        return new Promise(resolve => setTimeout(() => resolve(job || null), 500));
    }

    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('*, startups(name, logo_url)')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return null;

        return {
            id: data.id,
            title: data.title,
            description: data.description,
            location: data.location,
            type: data.type,
            postedAt: data.created_at,
            salaryRange: data.salary_range,
            startupId: data.startup_id,
            startupName: data.startups?.name || 'Unknown Startup',
            startupLogo: data.startups?.logo_url || data.startups?.name?.[0] || 'S'
        };
    } catch (error) {
        console.warn(`Failed to fetch job ${id}, falling back to mock.`, error);
        return MOCK_JOBS.find(j => j.id === id) || null;
    }
};

export const applyForJob = async (jobId: string, coverLetter: string): Promise<void> => {
    if (IS_MOCK_MODE) {
        console.log(`[Mock] Applied for job ${jobId} with letter: ${coverLetter.substring(0, 20)}...`);
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) throw new Error("You must be logged in to apply.");

    // Check for existing application to prevent duplicates
    const { data: existing } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('user_id', user.id)
        .maybeSingle();

    if (existing) throw new Error("You have already applied for this job.");

    const { error } = await supabase
        .from('job_applications')
        .insert({
            job_id: jobId,
            user_id: user.id,
            cover_letter_text: coverLetter,
            status: 'submitted'
        });

    if (error) throw error;
};

// --- Admin / Founder Functions ---

export const getMyJobs = async (): Promise<Job[]> => {
    if (IS_MOCK_MODE) {
        // Return jobs belonging to 's1' (Nexus AI - the mock user's startup)
        return new Promise(resolve => setTimeout(() => resolve(MOCK_JOBS.filter(j => j.startupId === 's1')), 600));
    }

    try {
        const { data: { user } } = await (supabase.auth as any).getUser();
        if (!user) return [];

        const { data: membership } = await supabase
            .from('team_members')
            .select('startup_id')
            .eq('user_id', user.id)
            .single();

        if (!membership) return [];

        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('startup_id', membership.startup_id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        return data.map((job: any) => ({
            id: job.id,
            title: job.title,
            description: job.description,
            location: job.location,
            type: job.type,
            postedAt: job.created_at,
            salaryRange: job.salary_range,
            startupId: job.startup_id,
            startupName: 'My Startup', 
            startupLogo: '',
            isActive: job.is_active
        }));

    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getJobApplications = async (): Promise<JobApplication[]> => {
    if (IS_MOCK_MODE) {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_APPLICATIONS), 600));
    }

    try {
        const { data: { user } } = await (supabase.auth as any).getUser();
        if (!user) return [];

        const { data: membership } = await supabase
            .from('team_members')
            .select('startup_id')
            .eq('user_id', user.id)
            .single();

        if (!membership) return [];

        // Get jobs for startup to filter applications
        const { data: jobs } = await supabase
            .from('jobs')
            .select('id, title')
            .eq('startup_id', membership.startup_id);
            
        if (!jobs || jobs.length === 0) return [];
        
        const jobIds = jobs.map((j: any) => j.id);

        const { data, error } = await supabase
            .from('job_applications')
            .select('*, profiles(full_name, email)')
            .in('job_id', jobIds)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((app: any) => {
            const job = jobs.find((j: any) => j.id === app.job_id);
            return {
                id: app.id,
                jobId: app.job_id,
                jobTitle: job?.title || 'Unknown Job',
                userId: app.user_id,
                applicantName: app.profiles?.full_name || 'Anonymous',
                applicantEmail: app.profiles?.email || 'No Email',
                coverLetter: app.cover_letter_text,
                status: app.status,
                appliedAt: app.created_at
            };
        });

    } catch (e) {
        console.error(e);
        return [];
    }
};

export const updateApplicationStatus = async (id: string, status: JobApplication['status']): Promise<void> => {
    if (IS_MOCK_MODE) {
        const idx = MOCK_APPLICATIONS.findIndex(a => a.id === id);
        if (idx !== -1) {
            MOCK_APPLICATIONS[idx] = { ...MOCK_APPLICATIONS[idx], status };
        }
        return new Promise(resolve => setTimeout(resolve, 400));
    }

    const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', id);

    if (error) throw error;
};
