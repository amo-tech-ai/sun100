
import { AccountHealth, CRMInsight } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';
import { Customer } from '../crmService';
import { supabase } from '../../lib/supabaseClient';

/**
 * Analyzes the health of a specific account using Gemini.
 */
export const analyzeAccountHealth = async (account: Customer): Promise<AccountHealth> => {
    // Mock Mode Fallback
    if (!(supabase as any).realtime) {
        console.log("Mock Mode: Generating simulated account health...");
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
        
        // Deterministic mock based on customer ID to seem "real"
        const isHealthy = account.mrr > 2000;
        return {
            score: isHealthy ? 85 : 42,
            status: isHealthy ? 'Healthy' : 'At Risk',
            factors: isHealthy 
                ? ['High product usage', 'Recent expansion revenue', 'Positive sentiment in last email'] 
                : ['Declining login frequency', 'Support ticket outstanding > 4 days', 'No executive sponsor identified'],
            recommendation: isHealthy 
                ? 'Propose annual contract upgrade with 10% discount.' 
                : 'Schedule a Quarterly Business Review immediately to address usage drop.'
        };
    }

    return invokeEdgeFunction<AccountHealth>('analyze-account-health', { account });
};

/**
 * Generates strategic insights for the CRM dashboard based on a list of customers/accounts.
 */
export const generateCRMInsights = async (accounts: Customer[]): Promise<CRMInsight[]> => {
    // Mock Mode Fallback
    if (!(supabase as any).realtime) {
        console.log("Mock Mode: Generating simulated CRM insights...");
        // Return cached mock insights if available or generate fresh ones
        return [
            { 
                id: 'mock-1', 
                type: 'risk', 
                message: '3 Enterprise accounts show declining usage patterns this week.', 
                action: 'View Report' 
            },
            { 
                id: 'mock-2', 
                type: 'opportunity', 
                message: 'Mid-Market segment is growing 15% faster than SMB. Consider shifting sales focus.', 
                action: 'Adjust Forecast' 
            },
            { 
                id: 'mock-3', 
                type: 'info', 
                message: 'Acme Corp has a renewal coming up in 30 days. No recent interaction logged.', 
                action: 'Draft Email' 
            }
        ];
    }

    // Send a summarized list to avoid token limits
    const summary = accounts.slice(0, 20).map(a => ({
        name: a.name,
        status: a.status,
        mrr: a.mrr,
        lastInteraction: a.lastInteraction
    }));

    const result = await invokeEdgeFunction<{ insights: CRMInsight[] }>('generate-crm-insights', { accounts: summary });
    return result.insights;
};
