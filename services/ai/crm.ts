
import { AccountHealth, CRMInsight, LeadEnrichmentResult, LeadScoreResult, Battlecard } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';
import { Customer, Deal, Interaction } from '../crmService';
import { supabase } from '../../lib/supabaseClient';

export const analyzeAccountHealth = async (customer: Customer): Promise<AccountHealth> => {
    if (!(supabase as any).realtime) {
        await new Promise(r => setTimeout(r, 1000));
        const baseScore = customer.healthScore || 50;
        return {
            score: baseScore,
            status: baseScore > 70 ? 'Healthy' : baseScore > 40 ? 'Neutral' : 'At Risk',
            factors: ['High product usage', 'Recent positive interaction'],
            recommendation: 'Schedule a quarterly business review.'
        };
    }
    return invokeEdgeFunction<AccountHealth>('analyze-account-health', { account: customer });
};

export const generateCRMInsights = async (accounts: Customer[]): Promise<CRMInsight[]> => {
    if (!(supabase as any).realtime) {
        await new Promise(r => setTimeout(r, 1000));
        return [
            { type: 'risk', message: 'Three accounts have declining usage.', action: 'Review Risk Report' },
            { type: 'opportunity', message: 'Upsell opportunity detected for Acme Corp.', action: 'Upsell Acme Corp' },
            { type: 'info', message: 'Quarterly reviews due for 5 accounts.', action: 'Schedule Reviews' }
        ];
    }
    return invokeEdgeFunction<CRMInsight[]>('generate-crm-insights', { accounts });
};

export const analyzeDealScore = async (deal: Deal, customer: Customer, interactions: Interaction[] = []): Promise<{ score: number; reasoning: string }> => {
    if (!(supabase as any).realtime) {
        await new Promise(r => setTimeout(r, 1500));
        return { score: 78, reasoning: "Recent positive sentiment in emails suggests high engagement." };
    }
    return invokeEdgeFunction<{ score: number; reasoning: string }>('analyze-deal-score', { deal, customer, interactions });
};

/**
 * Triggers AI Enrichment. Checks for cached data in edge function logic.
 */
export const enrichCRMLead = async (leadId: string, forceRefresh: boolean = false): Promise<LeadEnrichmentResult> => {
    if (!(supabase as any).realtime) {
        await new Promise(r => setTimeout(r, 2000));
        // Return mock data for UI testing
        return {
            ceo_name: "Mock CEO",
            ceo_linkedin: "https://linkedin.com/in/mock",
            linkedin_company_url: "https://linkedin.com/company/mock",
            recent_news: [{ title: "Raised Series A", url: "#", source: "TechCrunch", published_at: "2024-01-01" }],
            funding_history: [{ round: "Series A", amount: "$10M", date: "2024", investors: "Sequoia" }],
            hiring_trends: { trend: "up", roles: ["Engineering", "Sales"] },
            market_presence_score: 85,
            search_trend_score: 70,
            gemini_summary: "A high-growth startup in the AI space.",
            evidence_links: []
        };
    }
    return invokeEdgeFunction<LeadEnrichmentResult>('enrich-lead', { lead_id: leadId, force_refresh: forceRefresh });
};

export const scoreLead = async (leadId: string): Promise<LeadScoreResult> => {
    if (!(supabase as any).realtime) {
        await new Promise(r => setTimeout(r, 2500));
        return {
            overall_score: 88,
            confidence: 0.9,
            status_band: 'High',
            stage_recommendation: 'Qualified',
            fit_breakdown: { industry_fit: 90, company_size_fit: 80, budget_fit: 75, problem_fit: 95, engagement_fit: 60, search_trend_score: 85 },
            risk_score: 10,
            ai_findings: ["Strong funding history", "Active hiring"],
            risks: ["High competitor density"],
            recommended_next_actions: ["Schedule demo"]
        };
    }
    return invokeEdgeFunction<LeadScoreResult>('score-lead', { lead_id: leadId });
};

export const suggestCSVMapping = async (headers: string[]): Promise<{ mapping: Record<string, string> }> => {
    if (!(supabase as any).realtime) {
        await new Promise(r => setTimeout(r, 1000));
        const mapping: Record<string, string> = {};
        headers.forEach(h => {
            const lower = h.toLowerCase();
            if(lower.includes('name') || lower.includes('company')) mapping.name = h;
            if(lower.includes('email')) mapping.email = h;
            if(lower.includes('web') || lower.includes('url')) mapping.website = h;
        });
        return { mapping };
    }
    return invokeEdgeFunction<{ mapping: Record<string, string> }>('suggest-csv-mapping', { headers });
};

export const generateBattlecard = async (companyName: string, website: string): Promise<Battlecard> => {
    if (!(supabase as any).realtime) {
        await new Promise(r => setTimeout(r, 3000));
        return {
            competitors: [{ name: "Competitor A", strengths: ["Brand"], weaknesses: ["Legacy"], pricing_model: "High", kill_points: ["Speed"] }],
            our_advantages: ["AI-native"],
            objection_handling: [{ objection: "Price", counter: "ROI" }]
        };
    }
    return invokeEdgeFunction<Battlecard>('generate-battlecard', { companyName, website });
};
