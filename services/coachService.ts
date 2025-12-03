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

export interface ActionStatus {
    action_id: string;
    status: 'pending' | 'completed' | 'dismissed';
}

/**
 * Fetches the latest insights from the database cache.
 * This is fast and cheap.
 */
export const getCachedInsights = async (): Promise<CoachResponse | null> => {
    if (IS_MOCK_MODE) return getMockCoachData();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get startup ID
    const { data: membership } = await supabase.from('team_members').select('startup_id').eq('user_id', user.id).maybeSingle();
    if (!membership) return null;

    const { data } = await supabase
        .from('ai_coach_insights')
        .select('payload, updated_at')
        .eq('startup_id', membership.startup_id)
        .maybeSingle();

    if (data && data.payload) {
        return { ...data.payload, last_updated: data.updated_at };
    }
    return null;
};

/**
 * Triggers a fresh analysis via the Edge Function.
 * This uses Gemini tokens and takes time.
 */
export const generateInsights = async (): Promise<CoachResponse> => {
    if (IS_MOCK_MODE) {
        await new Promise(r => setTimeout(r, 2500));
        return getMockCoachData();
    }
    
    const result = await invokeEdgeFunction<CoachResponse>('generate-coach-insights');
    return { ...result, last_updated: new Date().toISOString() };
};

/**
 * Tracks user interaction with recommendations (complete/dismiss).
 */
export const trackRecommendationAction = async (actionId: string, status: 'completed' | 'dismissed'): Promise<void> => {
    if (IS_MOCK_MODE) {
        console.log(`[Mock] Action ${actionId} -> ${status}`);
        return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: membership } = await supabase.from('team_members').select('startup_id').eq('user_id', user.id).single();
    if (!membership) return;

    const { error } = await supabase.from('ai_recommendation_actions').upsert({
        startup_id: membership.startup_id,
        action_id: actionId,
        status: status,
        interacted_at: new Date().toISOString()
    }, { onConflict: 'startup_id, action_id' });

    if (error) throw error;
};

/**
 * Fetches status of actions to hide completed/dismissed items.
 */
export const getActionStatuses = async (): Promise<ActionStatus[]> => {
    if (IS_MOCK_MODE) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: membership } = await supabase.from('team_members').select('startup_id').eq('user_id', user.id).single();
    if (!membership) return [];

    const { data, error } = await supabase
        .from('ai_recommendation_actions')
        .select('action_id, status')
        .eq('startup_id', membership.startup_id);
    
    if (error) {
        console.error("Failed to fetch action statuses", error);
        return [];
    }
    return data as ActionStatus[];
};

// Mock Data for Development
const getMockCoachData = (): CoachResponse => ({
    insights: [
        { type: 'positive', category: 'growth', title: 'Pipeline Velocity Up', description: 'You moved 3 deals to negotiation this week, 15% faster than average.', metric_highlight: '+15%' },
        { type: 'negative', category: 'finance', title: 'Burn Rate Alert', description: 'Expenses increased by 20% due to new software subscriptions.', metric_highlight: '+20%' }
    ],
    alerts: [
        { severity: 'high', message: 'Update Traction Slide', subtext: 'Data is 30 days old.' },
        { severity: 'medium', message: 'Connect Bank Account', subtext: 'For accurate runway calculation.' }
    ],
    recommendations: [
        { action_id: 'email_investor_1', label: 'Email Sequoia', reason: '5 days since last contact.' },
        { action_id: 'update_competitors', label: 'Update Competitor Matrix', reason: 'New entrant "Bolt" detected.' }
    ],
    match_score: 78,
    last_updated: new Date().toISOString()
});