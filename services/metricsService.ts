
import { supabase } from '../lib/supabaseClient';

export interface MetricEntry {
    id: string;
    month: string; // YYYY-MM format
    revenue: number;
    burn_rate: number;
    cash_balance: number;
    active_users: number;
    churn_rate: number; // Percentage
    startup_id?: string;
}

export const getMetrics = async (): Promise<MetricEntry[]> => {
    // Mock Mode Check
    if (!(supabase as any).realtime) return [];

    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) throw new Error("User not authenticated");

    // Fetch the startup associated with the user via team_members
    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .single();

    if (!membership) return [];

    const { data, error } = await supabase
        .from('financial_metrics')
        .select('*')
        .eq('startup_id', membership.startup_id)
        .order('month', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const saveMetric = async (entry: Omit<MetricEntry, 'id'> & { id?: string }): Promise<MetricEntry> => {
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) throw new Error("User not authenticated");

    // Fetch startup via team_members
    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .single();

    if (!membership) throw new Error("No startup profile found for this user");

    // Prepare payload matching schema
    const payload = {
        startup_id: membership.startup_id,
        month: entry.month,
        revenue: entry.revenue,
        burn_rate: entry.burn_rate,
        cash_balance: entry.cash_balance,
        active_users: entry.active_users,
        churn_rate: entry.churn_rate,
        // If id is 'temp-new' or undefined, we let Postgres generate it
        id: (entry.id && entry.id !== 'temp-new') ? entry.id : undefined
    };

    const { data, error } = await supabase
        .from('financial_metrics')
        .upsert(payload)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getLatestMetrics = async (count: number = 2): Promise<MetricEntry[]> => {
    // Mock Mode Check
    if (!(supabase as any).realtime) return [];

    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) return [];

    const { data: membership } = await supabase
        .from('team_members')
        .select('startup_id')
        .eq('user_id', user.id)
        .single();

    if (!membership) return [];

    const { data, error } = await supabase
        .from('financial_metrics')
        .select('*')
        .eq('startup_id', membership.startup_id)
        .order('month', { ascending: false })
        .limit(count);

    if (error) throw error;
    return data || [];
};