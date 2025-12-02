
import { supabase } from '../../lib/supabaseClient';
import { Customer } from './types';
import { getContext } from './utils';
import { mockCustomers, mockDeals, mockTasks, mockContacts, setMockCustomers, setMockDeals, setMockTasks, setMockContacts } from './mocks';

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
        owner: 'Me', 
        renewalDate: c.renewal_date ? new Date(c.renewal_date).toLocaleDateString() : 'N/A',
        ...c.extended_info,
        lastEnrichedAt: c.last_enriched_at ? new Date(c.last_enriched_at).toLocaleDateString() : undefined,
    }));
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'lastInteraction' | 'owner' | 'healthScore'>): Promise<Customer> => {
    const { isRealtime, startupId } = await getContext();

    // Mock Mode
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
        if (idx >= 0) {
            const updated = [...mockCustomers];
            updated[idx] = { ...updated[idx], ...updates };
            setMockCustomers(updated);
        }
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
        setMockCustomers(mockCustomers.filter(c => c.id !== id));
        setMockDeals(mockDeals.filter(d => d.accountId !== id));
        setMockTasks(mockTasks.filter(t => t.accountId !== id));
        setMockContacts(mockContacts.filter(c => c.accountId !== id));
        return;
    }
    const { error } = await supabase.from('crm_accounts').delete().eq('id', id);
    if (error) throw error;
};

export const bulkDeleteCustomers = async (ids: string[]): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        setMockCustomers(mockCustomers.filter(c => !ids.includes(c.id)));
        setMockDeals(mockDeals.filter(d => !ids.includes(d.accountId || '')));
        setMockContacts(mockContacts.filter(c => !ids.includes(c.accountId)));
        return;
    }
    const { error } = await supabase.from('crm_accounts').delete().in('id', ids);
    if (error) throw error;
};
