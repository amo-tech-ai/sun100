
import { invokeEdgeFunction } from '../edgeFunctionService';
import { Prospect, LeadSearchCriteria, EnrichedLeadData } from './types';
import { supabase } from '../../lib/supabaseClient';

/**
 * Finds B2B leads using Gemini and Google Search Grounding.
 */
export const findLeads = async (criteria: LeadSearchCriteria): Promise<Prospect[]> => {
    // Mock Fallback
    if (!(supabase as any).realtime) {
        await new Promise(r => setTimeout(r, 2000));
        return [
            { name: "FintechFlow", website: "https://fintechflow.io", description: "Automated payment reconciliation for SMBs.", fitScore: 95, reason: "Matches industry 'Fintech' and stage 'Series A'.", location: "New York, NY", industry: "Fintech" },
            { name: "DataStream AI", website: "https://datastream.ai", description: "Real-time data processing pipeline.", fitScore: 88, reason: "High growth potential in data infra sector.", location: "San Francisco, CA", industry: "Data Infrastructure" },
            { name: "HealthSync", website: "https://healthsync.com", description: "Patient data interoperability platform.", fitScore: 82, reason: "Strong fit for healthcare vertical focus.", location: "Boston, MA", industry: "Healthtech" },
        ];
    }

    const result = await invokeEdgeFunction<{ leads: Prospect[] }>('generate-leads', { criteria });
    return result.leads;
};

/**
 * Enriches a lead with CEO and News data using Gemini Search Grounding.
 */
export const enrichLead = async (companyName: string, websiteUrl: string): Promise<EnrichedLeadData> => {
     // Mock Fallback
     if (!(supabase as any).realtime) {
        await new Promise(r => setTimeout(r, 2000));
        return {
            ceoName: "Jane Doe",
            ceoLinkedin: "https://linkedin.com/in/janedoe",
            latestNews: "Raised $50M Series B led by Sequoia.",
            companySummary: "Leading platform for automated financial reconciliation."
        };
    }

    return invokeEdgeFunction<EnrichedLeadData>('enrich-lead', { companyName, websiteUrl });
};
