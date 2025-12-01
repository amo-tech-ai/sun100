
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Fetch the startup associated with the user
    const { data: startup } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!startup) return [];

    const { data, error } = await supabase
        .from('startup_metrics')
        .select('*')
        .eq('startup_id', startup.id)
        .order('month', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const saveMetric = async (entry: Omit<MetricEntry, 'id'> & { id?: string }): Promise<MetricEntry> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: startup } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!startup) throw new Error("No startup profile found for this user");

    // Prepare payload ensuring startup_id is set
    const payload = {
        ...entry,
        startup_id: startup.id,
        // If id is 'temp-new', remove it so Postgres generates a UUID
        id: entry.id === 'temp-new' ? undefined : entry.id
    };

    const { data, error } = await supabase
        .from('startup_metrics')
        .upsert(payload)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getLatestMetrics = async (count: number = 2): Promise<MetricEntry[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: startup } = await supabase
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!startup) return [];

    const { data, error } = await supabase
        .from('startup_metrics')
        .select('*')
        .eq('startup_id', startup.id)
        .order('month', { ascending: false })
        .limit(count);

    if (error) throw error;
    return data || [];
};
