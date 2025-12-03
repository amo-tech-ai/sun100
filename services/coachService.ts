
import { supabase, IS_MOCK_MODE } from '../lib/supabaseClient';
import { invokeEdgeFunction } from './edgeFunctionService';

export interface CoachInsight {
    type: 'positive' | 'negative' | 'neutral';
    category: 'growth' | 'finance' | 'fundraising' | 'product';
    title: string;
    description: string;
    metric_highlight?: string;
}

export interface CoachAlert {
    severity: 'high' | 'medium';
    message: string;
    subtext?: string;
}

export interface CoachRecommendation {
    action_id: string;
    label: string;
    reason: string;
}

export interface CoachResponse {
    insights: CoachInsight[];
    alerts: CoachAlert[];
    recommendations: CoachRecommendation[];
    match_score?: number;
    last_updated?: string;
}

// Fetch cached insights from DB (Fast)
export const getCachedInsights = async (): Promise<CoachResponse | null> => {
    if (IS_MOCK_MODE) return getMockCoachData();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: membership } = await supabase.from('team_members').select('startup_id').eq('user_id', user.id).single();
    if (!membership) return null;

    const { data } = await supabase
        .from('ai_coach_insights')
        .select('payload, updated_at')
        .eq('startup_id', membership.startup_id)
        .single();

    if (data && data.payload) {
        return { ...data.payload, last_updated: data.updated_at };
    }
    return null;
};

// Trigger fresh analysis via Edge Function (Slow/Expensive)
export const generateInsights = async (): Promise<CoachResponse> => {
    if (IS_MOCK_MODE) {
        await new Promise(r => setTimeout(r, 3000));
        return getMockCoachData();
    }
    
    const result = await invokeEdgeFunction<CoachResponse>('generate-coach-insights');
    return { ...result, last_updated: new Date().toISOString() };
};

// Mock Data Fallback
const getMockCoachData = (): CoachResponse => ({
    insights: [
        { type: 'positive', category: 'growth', title: 'Momentum Building', description: 'Pipeline velocity increased by 15% this week.', metric_highlight: '+15%' },
        { type: 'neutral', category: 'finance', title: 'Burn Rate Stable', description: 'Expenses are tracking with projections.' }
    ],
    alerts: [
        { severity: 'high', message: 'Update Traction Slide', subtext: 'It has been 14 days since last update.' }
    ],
    recommendations: [
        { action_id: 'draft_email', label: 'Draft Investor Update', reason: 'Good news on growth metrics.' },
        { action_id: 'enrich_crm', label: 'Enrich Top 5 Leads', reason: 'Missing CEO data for key accounts.' }
    ],
    match_score: 82,
    last_updated: new Date().toISOString()
});
