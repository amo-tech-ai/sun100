
import { supabase } from '../lib/supabaseClient';
import { generateCRMInsights } from './ai/crm';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface Customer {
    id: string;
    name: string;
    logo: string;
    segment: 'Enterprise' | 'SMB' | 'Mid-Market';
    status: 'Active' | 'Churned' | 'Trial' | 'Lead';
    mrr: number;
    healthScore: number; // 0-100
    lastInteraction: string;
    owner: string;
    renewalDate: string;
    // Enriched Data Fields
    ceoName?: string;
    ceoLinkedin?: string;
    lastEnrichedAt?: string;
    latestNews?: string;
    companySummary?: string;
    tags?: string[];
    linkedDeckIds?: string[];
    fundingHistory?: { round: string; amount: string; date: string; investors: string }[];
    hiringTrends?: { trend: 'up' | 'flat' | 'down'; roles: string[] };
}

export interface Contact {
    id: string;
    accountId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    linkedin?: string;
    isPrimary?: boolean;
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

export interface Deal {
    id: string;
    name: string;
    value: number;
    stage: string;
    probability: number;
    expectedCloseDate: string;
    accountId?: string;
    customerName?: string;
    aiScore?: number;
    aiReasoning?: string;
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
    assigneeId?: string;
    accountId?: string;
}

export interface Interaction {
    id: string;
    type: 'email' | 'call' | 'meeting' | 'note';
    summary: string;
    date: string;
    sentiment?: 'Positive' | 'Neutral' | 'Negative';
    user_id?: string;
}

export interface TeamMember {
    userId: string;
    name: string;
    role: string;
    avatar?: string;
}

// ============================================================================
// Mock Data (Mutable state for session)
// ============================================================================

let mockCustomers: Customer[] = [
    { id: '1', name: 'Acme Corp', logo: 'A', segment: 'Enterprise', status: 'Active', mrr: 2500, healthScore: 92, lastInteraction: '2h ago', owner: 'Alex', renewalDate: '2024-12-01', tags: ['High Value', 'Reference'], lastEnrichedAt: '2024-08-20' },
    { id: '2', name: 'Globex Inc', logo: 'G', segment: 'Mid-Market', status: 'Active', mrr: 1200, healthScore: 78, lastInteraction: '1d ago', owner: 'Sarah', renewalDate: '2024-10-15', tags: ['Remote'] },
    { id: '3', name: 'Soylent Corp', logo: 'S', segment: 'SMB', status: 'Trial', mrr: 0, healthScore: 45, lastInteraction: '3d ago', owner: 'Mike', renewalDate: '2024-09-30', tags: ['Pilot'] },
    { id: '4', name: 'Initech', logo: 'I', segment: 'SMB', status: 'Churned', mrr: 0, healthScore: 12, lastInteraction: '2w ago', owner: 'Alex', renewalDate: '2024-01-01' },
    { id: '5', name: 'Umbrella Corp', logo: 'U', segment: 'Enterprise', status: 'Active', mrr: 5000, healthScore: 88, lastInteraction: '5h ago', owner: 'Sarah', renewalDate: '2025-03-01', lastEnrichedAt: '2024-08-25' },
    { id: '6', name: 'Stark Ind', logo: 'S', segment: 'Enterprise', status: 'Active', mrr: 10000, healthScore: 99, lastInteraction: '10m ago', owner: 'Tony', renewalDate: '2024-11-20', ceoName: 'Tony Stark', ceoLinkedin: 'https://linkedin.com/in/tonystark', latestNews: 'Launched new clean energy initiative.', tags: ['VIP', 'Energy'], lastEnrichedAt: 'Today' },
];

let mockContacts: Contact[] = [
    { id: 'c1', accountId: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@acme.com', role: 'CTO', linkedin: 'https://linkedin.com/in/alicesmith', isPrimary: true },
    { id: 'c2', accountId: '1', firstName: 'Bob', lastName: 'Jones', email: 'bob@acme.com', role: 'VP Eng', isPrimary: false },
    { id: 'c3', accountId: '6', firstName: 'Pepper', lastName: 'Potts', email: 'pepper@stark.com', role: 'CEO', linkedin: 'https://linkedin.com/in/pepper', isPrimary: true },
];

let mockTasks: Task[] = [
    { id: '1', title: 'Prepare Q3 Review for Acme', due: 'Today', completed: false, assignee: 'Me', accountId: '1' },
    { id: '2', title: 'Send contract to Stark Ind', due: 'Tomorrow', completed: false, assignee: 'Me', accountId: '6' },
    { id: '3', title: 'Onboarding call with Soylent', due: 'Sep 20', completed: true, assignee: 'Sarah', accountId: '3' },
];

let mockDeals: Deal[] = [
    { id: 'd1', name: 'Enterprise Contract', value: 120000, stage: 'Negotiation', probability: 80, expectedCloseDate: '2024-12-15', accountId: '1', customerName: 'Acme Corp', aiScore: 85, aiReasoning: 'Strong champion in place.' },
    { id: 'd2', name: 'Pilot Expansion', value: 45000, stage: 'Qualified', probability: 40, expectedCloseDate: '2025-01-20', accountId: '2', customerName: 'Globex Inc' },
    { id: 'd3', name: 'New Seat Licenses', value: 85000, stage: 'Proposal', probability: 60, expectedCloseDate: '2024-11-30', accountId: '5', customerName: 'Umbrella Corp', aiScore: 62, aiReasoning: 'Budget approval pending.' },
    { id: 'd4', name: 'API Integration', value: 12000, stage: 'Lead', probability: 20, expectedCloseDate: '2025-02-10', accountId: '6', customerName: 'Stark Ind' },
    { id: 'd5', name: 'Multi-Year Renewal', value: 95000, stage: 'Closed Won', probability: 100, expectedCloseDate: '2024-10-01', accountId: '1', customerName: 'Acme Corp' }
];

const mockInsights: Insight[] = [
    { id: '1', type: 'risk', message: '3 accounts showing declining usage patterns this week.', action: 'View Report' },
    { id: '2', type: 'opportunity', message: 'Enterprise segment growing 15% faster than SMB.', action: 'Adjust Forecast' },
    { id: '3', type: 'info', message: 'Ideally, follow up with "Globex Inc" regarding renewal.', action: 'Draft Email' },
];

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Checks if Supabase is connected and returns the startup_id for the current user.
 * Returns null if in mock mode or not authenticated.
 */
const getContext = async (): Promise<{ isRealtime: boolean; startupId: string | null }> => {
    const isRealtime = !!(supabase as any).realtime;
    
    if (!isRealtime) return { isRealtime: false, startupId: null };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { isRealtime: true, startupId: null };

    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .maybeSingle();

    return { isRealtime: true, startupId: membership?.startup_id || null };
};

// ============================================================================
// Customer Logic
// ============================================================================

export const getCustomers = async (): Promise<Customer[]> => {
    const { isRealtime, startupId } = await getContext();

    if (!isRealtime || !startupId) return mockCustomers;

    const { data, error } = await supabase
        .from('crm_accounts')
        .select('*')
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching customers:", error);
        throw error;
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
        owner: 'Me', // In a real app, join with profiles table
        renewalDate: c.renewal_date ? new Date(c.renewal_date).toLocaleDateString() : 'N/A',
        ...c.extended_info,
        lastEnrichedAt: c.last_enriched_at ? new Date(c.last_enriched_at).toLocaleDateString() : undefined,
    }));
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'lastInteraction' | 'owner' | 'healthScore'>): Promise<Customer> => {
    const { isRealtime, startupId } = await getContext();

    // Check duplicates
    if (!isRealtime) {
        if (mockCustomers.some(c => c.name.toLowerCase() === customer.name.toLowerCase())) {
            throw new Error("Customer already exists.");
        }
        const mockNew = { 
            ...customer, 
            id: Math.random().toString(), 
            healthScore: 50, 
            lastInteraction: 'Just now', 
            owner: 'Me', 
            tags: customer.tags || [] 
        };
        mockCustomers.unshift(mockNew);
        return mockNew;
    }

    if (!startupId) throw new Error("No startup profile found.");

    const { data: existing } = await supabase
        .from('crm_accounts')
        .select('id')
        .eq('startup_id', startupId)
        .ilike('name', customer.name)
        .maybeSingle();

    if (existing) throw new Error("Customer already exists.");

    const enrichedInfo = {
        ceoName: customer.ceoName,
        ceoLinkedin: customer.ceoLinkedin,
        latestNews: customer.latestNews,
        companySummary: customer.companySummary,
        tags: customer.tags || [],
        fundingHistory: customer.fundingHistory,
        hiringTrends: customer.hiringTrends,
        linkedDeckIds: []
    };

    const { data, error } = await supabase.from('crm_accounts').insert({
        startup_id: startupId,
        name: customer.name,
        segment: customer.segment,
        status: customer.status,
        mrr: customer.mrr,
        renewal_date: customer.renewalDate !== 'N/A' && customer.renewalDate ? new Date(customer.renewalDate).toISOString() : null,
        health_score: 50,
        extended_info: enrichedInfo
    }).select().single();

    if (error) throw error;

    return { ...customer, id: data.id, lastInteraction: 'Just now', healthScore: 50, owner: 'Me' };
};

export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<void> => {
    const { isRealtime } = await getContext();

    if (!isRealtime) {
        const idx = mockCustomers.findIndex(c => c.id === id);
        if (idx >= 0) mockCustomers[idx] = { ...mockCustomers[idx], ...updates };
        return;
    }

    const payload: any = { ...updates };
    if (updates.renewalDate && updates.renewalDate !== 'N/A') {
        payload.renewal_date = new Date(updates.renewalDate).toISOString();
    }
    if (updates.healthScore !== undefined) payload.health_score = updates.healthScore;

    const { error } = await supabase.from('crm_accounts').update(payload).eq('id', id);
    if (error) throw error;
};

export const linkDeckToCustomer = async (customerId: string, deckId: string): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        const customer = mockCustomers.find(c => c.id === customerId);
        if (customer) {
            customer.linkedDeckIds = Array.from(new Set([...(customer.linkedDeckIds || []), deckId]));
        }
        return;
    }

    const { data } = await supabase.from('crm_accounts').select('extended_info').eq('id', customerId).single();
    if (!data) throw new Error("Customer not found");
    
    const info: any = data.extended_info || {};
    const linked = info.linkedDeckIds || [];
    if (!linked.includes(deckId)) {
        await supabase.from('crm_accounts').update({
            extended_info: { ...info, linkedDeckIds: [...linked, deckId] }
        }).eq('id', customerId);
    }
};

export const deleteCustomer = async (id: string): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        mockCustomers = mockCustomers.filter(c => c.id !== id);
        // Also cleanup deals & contacts
        mockDeals = mockDeals.filter(d => d.accountId !== id);
        mockTasks = mockTasks.filter(t => t.accountId !== id);
        mockContacts = mockContacts.filter(c => c.accountId !== id);
        return;
    }
    const { error } = await supabase.from('crm_accounts').delete().eq('id', id);
    if (error) throw error;
};

export const bulkDeleteCustomers = async (ids: string[]): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        mockCustomers = mockCustomers.filter(c => !ids.includes(c.id));
        mockDeals = mockDeals.filter(d => !ids.includes(d.accountId || ''));
        mockContacts = mockContacts.filter(c => !ids.includes(c.accountId));
        return;
    }
    const { error } = await supabase.from('crm_accounts').delete().in('id', ids);
    if (error) throw error;
};

// ============================================================================
// Contact Logic
// ============================================================================

export const getContacts = async (accountId: string): Promise<Contact[]> => {
    const { isRealtime, startupId } = await getContext();

    if (!isRealtime) {
        return mockContacts.filter(c => c.accountId === accountId);
    }
    
    if (!startupId) return [];

    const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('account_id', accountId)
        .order('first_name', { ascending: true });
    
    if (error) throw error;

    return data.map((c: any) => ({
        id: c.id,
        accountId: c.account_id,
        firstName: c.first_name,
        lastName: c.last_name || '',
        email: c.email,
        role: c.role || '',
        linkedin: c.linkedin_url,
        isPrimary: false // Schema needs update to support this, defaulting to false
    }));
};

export const createContact = async (contact: Omit<Contact, 'id'>): Promise<Contact> => {
    const { isRealtime, startupId } = await getContext();

    if (!isRealtime || !startupId) {
        const newContact = { ...contact, id: `contact-${Date.now()}` };
        mockContacts.push(newContact);
        return newContact;
    }

    const { data, error } = await supabase
        .from('crm_contacts')
        .insert({
            startup_id: startupId,
            account_id: contact.accountId,
            first_name: contact.firstName,
            last_name: contact.lastName,
            email: contact.email,
            role: contact.role,
            linkedin_url: contact.linkedin
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        accountId: data.account_id,
        firstName: data.first_name,
        lastName: data.last_name || '',
        email: data.email,
        role: data.role || '',
        linkedin: data.linkedin_url,
        isPrimary: false
    };
};

export const updateContact = async (contactId: string, updates: Partial<Contact>): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        const idx = mockContacts.findIndex(c => c.id === contactId);
        if (idx >= 0) mockContacts[idx] = { ...mockContacts[idx], ...updates };
        return;
    }

    const payload: any = {
        first_name: updates.firstName,
        last_name: updates.lastName,
        email: updates.email,
        role: updates.role,
        linkedin_url: updates.linkedin
    };
    // Remove undefined keys
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    const { error } = await supabase.from('crm_contacts').update(payload).eq('id', contactId);
    if (error) throw error;
};

export const deleteContact = async (id: string): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        mockContacts = mockContacts.filter(c => c.id !== id);
        return;
    }
    const { error } = await supabase.from('crm_contacts').delete().eq('id', id);
    if (error) throw error;
};

// ============================================================================
// Deal Logic
// ============================================================================

export const getAllDeals = async (): Promise<Deal[]> => {
    const { isRealtime, startupId } = await getContext();

    if (!isRealtime) {
        return mockDeals;
    }

    if (!startupId) return [];

    const { data, error } = await supabase
        .from('crm_deals')
        .select('*, crm_accounts(name)')
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        value: d.value,
        stage: d.stage,
        probability: d.probability,
        expectedCloseDate: d.expected_close_date,
        accountId: d.account_id,
        customerName: d.crm_accounts?.name,
        aiScore: d.ai_score,
        aiReasoning: d.ai_reasoning
    }));
};

export const createDeal = async (deal: Omit<Deal, 'id'>): Promise<Deal> => {
    const { isRealtime, startupId } = await getContext();

    if (!isRealtime || !startupId) {
        const newDeal: Deal = {
            ...deal,
            id: `d-${Date.now()}`,
            customerName: mockCustomers.find(c => c.id === deal.accountId)?.name
        };
        mockDeals.unshift(newDeal);
        return newDeal;
    }

    const { data, error } = await supabase.from('crm_deals').insert({
        startup_id: startupId,
        account_id: deal.accountId,
        name: deal.name,
        value: deal.value,
        stage: deal.stage,
        probability: deal.probability,
        expected_close_date: deal.expectedCloseDate,
        ai_score: deal.aiScore,
        ai_reasoning: deal.aiReasoning
    }).select('*, crm_accounts(name)').single();

    if (error) throw error;

    return {
        id: data.id,
        name: data.name,
        value: data.value,
        stage: data.stage,
        probability: data.probability,
        expectedCloseDate: data.expected_close_date,
        accountId: data.account_id,
        customerName: data.crm_accounts?.name,
        aiScore: data.ai_score,
        aiReasoning: data.ai_reasoning
    };
};

export const updateDeal = async (dealId: string, updates: Partial<Deal>): Promise<void> => {
    const { isRealtime } = await getContext();
    
    if (!isRealtime) {
        const idx = mockDeals.findIndex(d => d.id === dealId);
        if (idx >= 0) mockDeals[idx] = { ...mockDeals[idx], ...updates };
        return;
    }
    
    const payload: any = {};
    if (updates.name) payload.name = updates.name;
    if (updates.value !== undefined) payload.value = updates.value;
    if (updates.stage) payload.stage = updates.stage;
    if (updates.probability !== undefined) payload.probability = updates.probability;
    if (updates.expectedCloseDate) payload.expected_close_date = updates.expectedCloseDate;
    if (updates.aiScore !== undefined) payload.ai_score = updates.aiScore;
    if (updates.aiReasoning) payload.ai_reasoning = updates.aiReasoning;

    const { error } = await supabase.from('crm_deals').update(payload).eq('id', dealId);
    if (error) throw error;
};

export const deleteDeal = async (id: string): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        mockDeals = mockDeals.filter(d => d.id !== id);
        return;
    }
    const { error } = await supabase.from('crm_deals').delete().eq('id', id);
    if (error) throw error;
};

export const getDealsForCustomer = async (customerId: string): Promise<Deal[]> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
         return mockDeals.filter(d => d.accountId === customerId);
    }
    
    const { data, error } = await supabase.from('crm_deals').select('*, crm_accounts(name)').eq('account_id', customerId);
    if (error) return [];
    
    return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        value: d.value,
        stage: d.stage,
        probability: d.probability,
        expectedCloseDate: d.expected_close_date,
        accountId: d.account_id,
        customerName: d.crm_accounts?.name,
        aiScore: d.ai_score,
        aiReasoning: d.ai_reasoning
    }));
};

export const getPipeline = async (): Promise<DealStage[]> => {
    const { isRealtime, startupId } = await getContext();
    
    // Fetch current deals to calculate stages
    let deals: any[] = [];

    if (!isRealtime) {
        deals = mockDeals;
    } else if (startupId) {
        const { data } = await supabase.from('crm_deals').select('*').eq('startup_id', startupId);
        deals = data || [];
    }

    const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
    const stageColors: Record<string, string> = {
        'Lead': 'bg-gray-300', 'Qualified': 'bg-blue-400', 'Proposal': 'bg-indigo-500',
        'Negotiation': 'bg-orange-400', 'Closed Won': 'bg-green-500'
    };

    return stages.map(stage => {
        const dealsInStage = deals.filter((d: any) => d.stage === stage);
        return {
            id: stage.toLowerCase().replace(' ', '-'),
            name: stage,
            count: dealsInStage.length,
            value: dealsInStage.reduce((sum: number, d: any) => sum + (d.value || 0), 0),
            color: stageColors[stage]
        };
    });
};

// ============================================================================
// Task Logic
// ============================================================================

export const getTasks = async (accountId?: string): Promise<Task[]> => {
    const { isRealtime, startupId } = await getContext();
    
    if (!isRealtime) {
        return accountId ? mockTasks.filter(t => t.accountId === accountId) : mockTasks;
    }
    
    if (!startupId) return [];

    let query = supabase
        .from('crm_tasks')
        .select('*, profiles:assigned_to(full_name)')
        .eq('startup_id', startupId)
        .order('due_date', { ascending: true });
        
    if (accountId) {
        query = query.eq('account_id', accountId);
    } else {
        query = query.limit(10); // Top 10 tasks for dashboard
    }
    
    const { data, error } = await query;
    if (error) return [];

    return data.map((t: any) => ({
        id: t.id,
        title: t.title,
        due: new Date(t.due_date).toLocaleDateString(),
        completed: t.completed,
        assignee: t.profiles?.full_name || 'Unknown',
        assigneeId: t.assigned_to,
        accountId: t.account_id
    }));
};

export const addTask = async (task: Omit<Task, 'id'> & { accountId?: string, notify?: boolean }): Promise<void> => {
    const { isRealtime, startupId } = await getContext();

    if (!isRealtime || !startupId) {
        const newTask = { 
            ...task, 
            id: Math.random().toString(), 
            completed: false, 
            assignee: task.assignee, 
            due: task.due 
        };
        mockTasks.push(newTask);
        if (task.notify) console.log(`[Mock] Sending email notification for task: ${task.title}`);
        return;
    }

    const assigneeId = task.assigneeId || (await supabase.auth.getUser()).data.user?.id;

    const { error } = await supabase.from('crm_tasks').insert({
        startup_id: startupId,
        account_id: task.accountId,
        title: task.title,
        due_date: new Date(task.due).toISOString(),
        completed: task.completed,
        assigned_to: assigneeId
    });

    if (error) throw error;

    if (task.notify && assigneeId) {
        sendTaskNotification(assigneeId, task);
    }
};

export const updateTask = async (id: string, updates: Partial<Omit<Task, 'id'>>): Promise<void> => {
    const { isRealtime } = await getContext();

    if (!isRealtime) {
        const idx = mockTasks.findIndex(t => t.id === id);
        if (idx >= 0) mockTasks[idx] = { ...mockTasks[idx], ...updates };
        return;
    }

    const payload: any = { ...updates };
    if (updates.due) payload.due_date = new Date(updates.due).toISOString();
    if (updates.assigneeId) payload.assigned_to = updates.assigneeId;
    if (updates.accountId) payload.account_id = updates.accountId;

    delete payload.assignee; 
    delete payload.assigneeId;
    delete payload.accountId;
    delete payload.due;

    const { error } = await supabase.from('crm_tasks').update(payload).eq('id', id);
    if (error) throw error;
};

export const deleteTask = async (id: string): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        const idx = mockTasks.findIndex(t => t.id === id);
        if (idx >= 0) mockTasks.splice(idx, 1);
        return;
    }
    const { error } = await supabase.from('crm_tasks').delete().eq('id', id);
    if (error) throw error;
};

export const toggleTask = async (id: string, completed: boolean): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        const idx = mockTasks.findIndex(t => t.id === id);
        if (idx >= 0) mockTasks[idx].completed = completed;
        return;
    }
    await supabase.from('crm_tasks').update({ completed }).eq('id', id);
};

// ============================================================================
// Interaction Logic
// ============================================================================

export const getInteractions = async (accountId: string): Promise<Interaction[]> => {
    const { isRealtime } = await getContext();
     if (!isRealtime) {
         return [
             { id: '1', type: 'email', summary: 'Sent renewal proposal', date: '2 days ago', sentiment: 'Neutral' },
             { id: '2', type: 'call', summary: 'Quarterly check-in with Jane. She is happy with the new feature set.', date: '1 week ago', sentiment: 'Positive' }
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
};

export const addInteraction = async (accountId: string, interaction: Omit<Interaction, 'id' | 'date'>): Promise<void> => {
     const { isRealtime, startupId } = await getContext();
     if (!isRealtime || !startupId) {
         console.log("Mock adding interaction", interaction);
         return;
     }

     const timestamp = new Date().toISOString();

     const { error } = await supabase.from('crm_interactions').insert({
         startup_id: startupId,
         account_id: accountId,
         type: interaction.type,
         summary: interaction.summary,
         sentiment: interaction.sentiment,
         date: timestamp
     });

     if (error) throw error;

     // Update Account's timestamp
     await supabase.from('crm_accounts')
        .update({ last_interaction_at: timestamp })
        .eq('id', accountId);
};

// ============================================================================
// Utility & Aggregation
// ============================================================================

export const getTeamMembers = async (): Promise<TeamMember[]> => {
    const { isRealtime, startupId } = await getContext();
    if (!isRealtime || !startupId) return [{ userId: '1', name: 'Me', role: 'Owner' }];

    const { data, error } = await supabase
        .from('team_members')
        .select('user_id, role, profiles(full_name, avatar_url)')
        .eq('startup_id', startupId);

    if (error) {
        console.error("Error fetching team members:", error);
        return [];
    }

    return data.map((m: any) => ({
        userId: m.user_id,
        name: m.profiles?.full_name || 'Unknown',
        role: m.role,
        avatar: m.profiles?.avatar_url
    }));
};

export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        await new Promise(r => setTimeout(r, 1500));
        console.log('Mock email sent to', to);
        return;
    }

    const { error } = await supabase.functions.invoke('send-email', {
        body: { to, subject, body }
    });

    if (error) throw error;
};

/**
 * Main aggregation function for the CRM Dashboard
 */
export const getCRMData = async () => {
    const { isRealtime } = await getContext();

    // Calculate stats dynamically even for mock to reflect changes
    const fetchAndAgg = async (customerLoader: () => Promise<Customer[]>, pipelineLoader: () => Promise<DealStage[]>, taskLoader: () => Promise<Task[]>) => {
        const [customers, pipeline, tasks] = await Promise.all([
            customerLoader(),
            pipelineLoader(),
            taskLoader()
        ]);

        const totalCustomers = customers.length;
        const activeAccounts = customers.filter(c => c.status === 'Active').length;
        const atRisk = customers.filter(c => c.healthScore < 50).length;
        const totalRevenue = customers.reduce((sum, c) => sum + c.mrr, 0);

        // Fetch AI insights separately or use defaults
        let insights = mockInsights;
        try {
            // Only fetch real AI insights if realtime, otherwise keep mock
            if (isRealtime) {
                const generated = await generateCRMInsights(customers);
                if (generated && generated.length > 0) insights = generated.map((i: any) => ({ ...i, id: Math.random().toString() }));
            }
        } catch (e) {
            console.warn("Failed to generate AI insights for CRM:", e);
        }

        return {
            customers,
            stats: {
                totalCustomers,
                activeAccounts,
                renewalRate: 95, 
                atRisk,
                totalRevenue
            },
            pipeline,
            insights,
            tasks
        };
    };

    if (!isRealtime) {
        return fetchAndAgg(
            () => Promise.resolve(mockCustomers), 
            () => getPipeline(), // Use the dynamic mock pipeline
            () => Promise.resolve(mockTasks)
        );
    }

    return fetchAndAgg(getCustomers, getPipeline, getTasks);
};

// Internal notification helper
const sendTaskNotification = async (assigneeId: string, task: any) => {
    try {
         const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', assigneeId)
            .single();
        
        if (profile?.email) {
            await sendEmail(
                profile.email,
                `Task Assigned: ${task.title}`,
                `You have been assigned a new task in the CRM.\n\nTask: ${task.title}\nDue: ${task.due}`
            );
        }
    } catch (e) {
        console.error("Failed to send task notification email", e);
    }
};
