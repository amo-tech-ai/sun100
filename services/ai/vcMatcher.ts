
import { StartupProfile, VCMatchAnalysis, InvestorRanking } from './types';
import { Investor } from "../vcService";
import { invokeEdgeFunction } from '../edgeFunctionService';

/**
 * Uses a secure Edge Function to analyze investor fit.
 */
export const matchInvestor = async (startup: StartupProfile, investorProfile: Investor): Promise<VCMatchAnalysis> => {
    return invokeEdgeFunction<VCMatchAnalysis>('investor-ai', { 
        action: 'matchInvestor',
        startup, 
        investorProfile 
    });
};

/**
 * Uses a secure Edge Function to find the top 5 investors.
 */
export const findBestInvestors = async (startup: StartupProfile, allInvestors: Investor[]): Promise<InvestorRanking> => {
    // Optimize context by sending only relevant fields to save bandwidth
    const optimizedInvestors = allInvestors.map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type,
        stages: inv.stages,
        check_range: `${inv.min_check_size || 0} - ${inv.max_check_size || 'Unlimited'}`,
        specialties: inv.specialties,
        geographies: inv.geographies
    }));

    return invokeEdgeFunction<InvestorRanking>('investor-ai', { 
        action: 'rankInvestors',
        startup, 
        investors: optimizedInvestors 
    });
};
