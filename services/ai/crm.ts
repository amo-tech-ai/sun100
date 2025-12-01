
import { AccountHealth, CRMInsight } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';
import { Customer } from '../crmService';

/**
 * Analyzes the health of a specific account using Gemini.
 */
export const analyzeAccountHealth = async (account: Customer): Promise<AccountHealth> => {
    return invokeEdgeFunction<AccountHealth>('analyze-account-health', { account });
};

/**
 * Generates strategic insights for the CRM dashboard based on a list of customers/accounts.
 */
export const generateCRMInsights = async (accounts: Customer[]): Promise<CRMInsight[]> => {
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
