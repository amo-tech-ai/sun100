
import { supabase } from '../lib/supabaseClient';
import { generateCRMInsights } from './ai/crm';

export interface Customer {
    id: string;
    name: string;
    logo: string;
    segment: 'Enterprise' | 'SMB' | 'Mid-Market';
    status: 'Active' | 'Churned' | 'Trial';
    mrr: number;
    healthScore: number; // 0-100
    lastInteraction: string;
    owner: string;
    renewalDate: string;
}

export interface CRMStats {
    totalCustomers: number;
    activeAccounts: number;
    renewalRate: number;
    atRisk: number;
    totalRevenue: number;
}

export interface DealStage {
    id: string;
    name: string;
    count: number;
    value: number;
    color: string;
}

export interface Insight {
    id: string;
    type: 'risk' | 'opportunity' | 'info';
    message: string;
    action?: string;
}

export interface Task {
    id: string;
    title: string;
    due: string;
    completed: boolean;
    assignee: string;
}

export interface Interaction {
    id: string;
    type: 'email' | 'call' | 'meeting' | 'note';
    summary: string;
    date: string;
    sentiment?: 'Positive' | 'Neutral' | 'Negative';
    user_id?: string;
}

// --- Mock Data ---
const mockCustomers: Customer[] = [
    { id: '1', name: 'Acme Corp', logo: 'A', segment: 'Enterprise', status: 'Active', mrr: 2500, healthScore: 92, lastInteraction: '2h ago', owner: 'Alex', renewalDate: '2024-12-01' },
    { id: '2', name: 'Globex Inc', logo: 'G', segment: 'Mid-Market', status: 'Active', mrr: 1200, healthScore: 78, lastInteraction: '1d ago', owner: 'Sarah', renewalDate: '2024-10-15' },
    { id: '3', name: 'Soylent Corp', logo: 'S', segment: 'SMB', status: 'Trial', mrr: 0, healthScore: 45, lastInteraction: '3d ago', owner: 'Mike', renewalDate: '2024-09-30' },
    { id: '4', name: 'Initech', logo: 'I', segment: 'SMB', status: 'Churned', mrr: 0, healthScore: 12, lastInteraction: '2w ago', owner: 'Alex', renewalDate: '2024-01-01' },
    { id: '5', name: 'Umbrella Corp', logo: 'U', segment: 'Enterprise', status: 'Active', mrr: 5000, healthScore: 88, lastInteraction: '5h ago', owner: 'Sarah', renewalDate: '2025-03-01' },
    { id: '6', name: 'Stark Ind', logo: 'S', segment: 'Enterprise', status: 'Active', mrr: 10000, healthScore: 99, lastInteraction: '10m ago', owner: 'Tony', renewalDate: '2024-11-20' },
];

const mockPipeline: DealStage[] = [
    { id: 'lead', name: 'Lead', count: 45, value: 12000, color: 'bg-gray-300' },
    { id: 'qualified', name: 'Qualified', count: 22, value: 45000, color: 'bg-blue-400' },
    { id: 'proposal', name: 'Proposal', count: 12, value: 85000, color: 'bg-indigo-500' },
    { id: 'negotiation', name: 'Negotiation', count: 5, value: 120000, color: 'bg-orange-400' },
    { id: 'closed', name: 'Closed Won', count: 8, value: 95000, color: 'bg-green-500' },
];

const mockInsights: Insight[] = [
    { id: '1', type: 'risk', message: '3 accounts showing declining usage patterns this week.', action: 'View Report' },
    { id: '2', type: 'opportunity', message: 'Enterprise segment growing 15% faster than SMB.', action: 'Adjust Forecast' },
    { id: '3', type: 'info', message: 'Ideally, follow up with "Globex Inc" regarding renewal.', action: 'Draft Email' },
];

const mockTasks: Task[] = [
    { id: '1', title: 'Prepare Q3 Review for Acme', due: 'Today', completed: false, assignee: 'Me' },
    { id: '2', title: 'Send contract to Stark Ind', due: 'Tomorrow', completed: false, assignee: 'Me' },
    { id: '3', title: 'Onboarding call with Soylent', due: 'Sep 20', completed: true, assignee: 'Sarah' },
];

// --- Service Methods ---

const getStartupId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: membership } = await supabase.from('team_members').select('startup_id').eq('user_id', user.id).maybeSingle();
    return membership?.startup_id;
}

export const getCustomers = async (): Promise<Customer[]> => {
    if (!(supabase as any).realtime) return mockCustomers;
    const startupId = await getStartupId();
    if (!startupId) return [];

    const { data, error } = await supabase.from('crm_accounts').select('*').eq('startup_id', startupId).order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching customers:", error);
        return [];
    }

    return data.map((c: any) => ({
        id: c.id,
        name: c.name,
        logo: c.logo_url || c.name[0], 
        segment: c.segment,
        status: c.status,
        mrr: c.mrr,
        healthScore: c.health_score,
        lastInteraction: c.last_interaction_at ? new Date(c.last_interaction_at).toLocaleDateString() : 'Never',
        owner: 'Me', // In a real app, fetch user name
        renewalDate: c.renewal_date ? new Date(c.renewal_date).toLocaleDateString() : 'N/A'
    }));
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'lastInteraction' | 'owner' | 'healthScore'>): Promise<Customer> => {
    const startupId = await getStartupId();
    if (!startupId) throw new Error("No startup profile found.");

    const payload = {
        startup_id: startupId,
        name: customer.name,
        segment: customer.segment,
        status: customer.status,
        mrr: customer.mrr,
        renewal_date: customer.renewalDate !== 'N/A' ? new Date(customer.renewalDate).toISOString() : null,
        health_score: 50 // Default
    };

    if (!(supabase as any).realtime) {
        const mockNew = { ...customer, id: Math.random().toString(), healthScore: 50, lastInteraction: 'Just now', owner: 'Me' };
        mockCustomers.unshift(mockNew);
        return mockNew;
    }

    const { data, error } = await supabase.from('crm_accounts').insert(payload).select().single();
    if (error) throw error;

    return {
        id: data.id,
        name: data.name,
        logo: data.name[0],
        segment: data.segment,
        status: data.status,
        mrr: data.mrr,
        healthScore: data.health_score,
        lastInteraction: 'Just now',
        owner: 'Me',
        renewalDate: data.renewal_date || 'N/A'
    };
};

export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<void> => {
    if (!(supabase as any).realtime) {
        const idx = mockCustomers.findIndex(c => c.id === id);
        if (idx >= 0) mockCustomers[idx] = { ...mockCustomers[idx], ...updates };
        return;
    }

    const payload: any = {};
    if (updates.name) payload.name = updates.name;
    if (updates.segment) payload.segment = updates.segment;
    if (updates.status) payload.status = updates.status;
    if (updates.mrr !== undefined) payload.mrr = updates.mrr;
    if (updates.renewalDate) payload.renewal_date = new Date(updates.renewalDate).toISOString();
    if (updates.healthScore !== undefined) payload.health_score = updates.healthScore;

    const { error } = await supabase.from('crm_accounts').update(payload).eq('id', id);
    if (error) throw error;
};

export const getInteractions = async (accountId: string): Promise<Interaction[]> => {
     if (!(supabase as any).realtime) {
         return [
             { id: '1', type: 'email', summary: 'Sent renewal proposal', date: '2 days ago', sentiment: 'Neutral' },
             { id: '2', type: 'call', summary: 'Quarterly check-in', date: '1 week ago', sentiment: 'Positive' }
         ];
     }

     const { data, error } = await supabase
        .from('crm_interactions')
        .select('*')
        .eq('account_id', accountId)
        .order('date', { ascending: false });
    
    if (error) return [];
    
    return data.map((i: any) => ({
        id: i.id,
        type: i.type,
        summary: i.summary,
        date: new Date(i.date).toLocaleDateString(),
        sentiment: i.sentiment
    }));
}

export const addInteraction = async (accountId: string, interaction: Omit<Interaction, 'id' | 'date'>): Promise<void> => {
     const startupId = await getStartupId();
     if (!(supabase as any).realtime || !startupId) return;

     const { error } = await supabase.from('crm_interactions').insert({
         startup_id: startupId,
         account_id: accountId,
         type: interaction.type,
         summary: interaction.summary,
         sentiment: interaction.sentiment,
         date: new Date().toISOString()
     });

     if (error) throw error;
}

export const getPipeline = async (): Promise<DealStage[]> => {
    if (!(supabase as any).realtime) return mockPipeline;
    const startupId = await getStartupId();
    if (!startupId) return [];

    const { data, error } = await supabase.from('crm_deals').select('*').eq('startup_id', startupId);
    if (error) return [];

    // Aggregate deals into stages
    const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
    const stageColors: Record<string, string> = {
        'Lead': 'bg-gray-300', 'Qualified': 'bg-blue-400', 'Proposal': 'bg-indigo-500',
        'Negotiation': 'bg-orange-400', 'Closed Won': 'bg-green-500'
    };

    return stages.map(stage => {
        const dealsInStage = data.filter((d: any) => d.stage === stage);
        return {
            id: stage.toLowerCase().replace(' ', '-'),
            name: stage,
            count: dealsInStage.length,
            value: dealsInStage.reduce((sum: number, d: any) => sum + (d.value || 0), 0),
            color: stageColors[stage]
        };
    });
};

export const getTasks = async (accountId?: string): Promise<Task[]> => {
    if (!(supabase as any).realtime) return mockTasks;
    const startupId = await getStartupId();
    if (!startupId) return [];

    let query = supabase.from('crm_tasks').select('*').eq('startup_id', startupId).order('due_date', { ascending: true });
    if (accountId) {
        query = query.eq('account_id', accountId);
    } else {
        query = query.limit(5);
    }
    
    const { data, error } = await query;
    if (error) return [];

    return data.map((t: any) => ({
        id: t.id,
        title: t.title,
        due: new Date(t.due_date).toLocaleDateString(),
        completed: t.completed,
        assignee: 'Me' // simplified
    }));
};

export const addTask = async (task: Omit<Task, 'id'> & { accountId?: string }): Promise<void> => {
    const startupId = await getStartupId();
    if (!(supabase as any).realtime || !startupId) return;

    const { error } = await supabase.from('crm_tasks').insert({
        startup_id: startupId,
        account_id: task.accountId,
        title: task.title,
        due_date: new Date(task.due).toISOString(),
        completed: task.completed,
        assigned_to: (await supabase.auth.getUser()).data.user?.id // Assign to self
    });

    if (error) throw error;
}

export const toggleTask = async (id: string, completed: boolean): Promise<void> => {
    if (!(supabase as any).realtime) return;
    await supabase.from('crm_tasks').update({ completed }).eq('id', id);
}


export const getCRMData = async () => {
    // Check for Supabase connection (Mock Mode)
    if (!(supabase as any).realtime) {
        return {
            customers: mockCustomers,
            stats: {
                totalCustomers: 124,
                activeAccounts: 89,
                renewalRate: 94,
                atRisk: 12,
                totalRevenue: 450000
            },
            pipeline: mockPipeline,
            insights: mockInsights,
            tasks: mockTasks
        };
    }

    const [customers, pipeline, tasks] = await Promise.all([
        getCustomers(),
        getPipeline(),
        getTasks()
    ]);

    // Calculate Stats
    const totalCustomers = customers.length;
    const activeAccounts = customers.filter(c => c.status === 'Active').length;
    const atRisk = customers.filter(c => c.healthScore < 50).length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.mrr, 0);
    
    // AI Insights (Generate on load or fetch cached)
    let insights = mockInsights; // Fallback
    try {
        const generated = await generateCRMInsights(customers);
        if (generated && generated.length > 0) insights = generated.map((i: any) => ({ ...i, id: Math.random().toString() }));
    } catch (e) {
        console.warn("Failed to generate AI insights for CRM:", e);
    }

    return {
        customers,
        stats: {
            totalCustomers,
            activeAccounts,
            renewalRate: 95, // Hardcoded for MVP until historical data available
            atRisk,
            totalRevenue
        },
        pipeline,
        insights,
        tasks
    };
};
