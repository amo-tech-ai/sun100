
import { supabase } from '../../lib/supabaseClient';
import { Deal, DealStage } from './types';
import { getContext, cleanPayload } from './utils';
import { mockDeals, mockCustomers, setMockDeals } from './mocks';

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
        if (idx >= 0) {
            const updated = [...mockDeals];
            updated[idx] = { ...updated[idx], ...updates };
            setMockDeals(updated);
        }
        return;
    }
    
    const payload = cleanPayload({
        name: updates.name,
        value: updates.value,
        stage: updates.stage,
        probability: updates.probability,
        expected_close_date: updates.expectedCloseDate,
        ai_score: updates.aiScore,
        ai_reasoning: updates.aiReasoning
    });

    const { error } = await supabase.from('crm_deals').update(payload).eq('id', dealId);
    if (error) throw error;
};

export const deleteDeal = async (id: string): Promise<void> => {
    const { isRealtime } = await getContext();
    if (!isRealtime) {
        setMockDeals(mockDeals.filter(d => d.id !== id));
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
