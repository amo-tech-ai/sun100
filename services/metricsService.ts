
import { supabase } from '../lib/supabaseClient';

export interface MetricEntry {
    id: string;
    month: string; // YYYY-MM format
    revenue: number;
    burn_rate: number;
    cash_balance: number;
    active_users: number;
    churn_rate: number; // Percentage
}

const DEFAULT_METRICS: MetricEntry[] = [
    { id: 'm1', month: '2024-06', revenue: 9800, burn_rate: 42000, cash_balance: 380000, active_users: 420, churn_rate: 2.1 },
    { id: 'm2', month: '2024-07', revenue: 10500, burn_rate: 44000, cash_balance: 336000, active_users: 480, churn_rate: 2.0 },
    { id: 'm3', month: '2024-08', revenue: 12450, burn_rate: 45000, cash_balance: 291000, active_users: 550, churn_rate: 1.8 },
];

const STORAGE_KEY = 'sun_ai_startup_metrics';

// Helper to get data (Local or DB)
const getLocalData = (): MetricEntry[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored).sort((a: MetricEntry, b: MetricEntry) => b.month.localeCompare(a.month));
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_METRICS));
    return DEFAULT_MOCK_METRICS;
};

const DEFAULT_MOCK_METRICS = DEFAULT_METRICS.sort((a, b) => b.month.localeCompare(a.month));

export const getMetrics = async (): Promise<MetricEntry[]> => {
    if ((supabase as any).realtime) {
        const { data, error } = await supabase
            .from('startup_metrics')
            .select('*')
            .order('month', { ascending: false });
        if (error) throw error;
        return data;
    }
    
    return new Promise(resolve => {
        setTimeout(() => resolve(getLocalData()), 300);
    });
};

export const saveMetric = async (entry: Omit<MetricEntry, 'id'> & { id?: string }): Promise<MetricEntry> => {
    if ((supabase as any).realtime) {
        const { data, error } = await supabase.from('startup_metrics').upsert(entry).select().single();
        if (error) throw error;
        return data;
    }

    const currentData = getLocalData();
    const existingIndex = currentData.findIndex(m => m.month === entry.month);
    
    const newEntry = { 
        ...entry, 
        id: entry.id || `mock-metric-${Date.now()}` 
    };

    if (existingIndex >= 0) {
        currentData[existingIndex] = newEntry;
    } else {
        currentData.push(newEntry);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    return new Promise(resolve => setTimeout(() => resolve(newEntry), 300));
};

export const getLatestMetrics = async (count: number = 2): Promise<MetricEntry[]> => {
    const all = await getMetrics();
    return all.slice(0, count);
};
