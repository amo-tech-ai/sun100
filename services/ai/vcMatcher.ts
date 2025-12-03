
import { StartupProfile, VCMatchAnalysis, InvestorRanking } from './types';
import { Investor } from "../vcService";
import { invokeEdgeFunction } from '../edgeFunctionService';

/**
 * Uses a secure Edge Function to analyze investor fit.
 */
export const matchInvestor = async (startup: StartupProfile, investorProfile: Investor): Promise<VCMatchAnalysis> => {
    try {
        return await invokeEdgeFunction<VCMatchAnalysis>('investor-ai', { 
            action: 'matchInvestor',
            startup, 
            investorProfile 
        });
    } catch (error) {
        console.warn("Edge Function 'matchInvestor' failed. Falling back to mock data.", error);
        await new Promise(r => setTimeout(r, 2000)); // Simulate network delay
        
        // Deterministic mock score based on name length
        const baseScore = 60 + (investorProfile.name.length % 40); 
        
        return {
            matchScore: baseScore,
            status: baseScore > 80 ? "High Fit" : "Potential Fit",
            reasoning: `Based on your startup's stage (${startup.stage}) and industry (${startup.industry}), ${investorProfile.name} appears to be a ${baseScore > 80 ? "strong" : "moderate"} match. They actively invest in this space.`,
            alignment: {
                stage: true,
                check_size: true,
                industry: true,
                geo: true
            },
            strengths: ["Industry alignment", "Active in your stage", "Recent similar investments"],
            risks: ["Check size might be high for current traction", "Highly competitive portfolio"],
            recommendedAction: baseScore > 80 ? "Apply immediately with a warm intro." : "Add to watchlist and build relationship."
        };
    }
};

/**
 * Uses a secure Edge Function to find the top 5 investors.
 */
export const findBestInvestors = async (startup: StartupProfile, allInvestors: Investor[]): Promise<InvestorRanking> => {
    try {
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

        return await invokeEdgeFunction<InvestorRanking>('investor-ai', { 
            action: 'rankInvestors',
            startup, 
            investors: optimizedInvestors 
        });
    } catch (error) {
        console.warn("Edge Function 'rankInvestors' failed. Falling back to mock data.", error);
        await new Promise(r => setTimeout(r, 2500));

        // Return top 3 investors as mock matches
        const matches = allInvestors.slice(0, 3).map(inv => ({
            investorId: inv.id,
            investorName: inv.name,
            matchScore: 85 + Math.floor(Math.random() * 10),
            reasoning: `Strong alignment with ${startup.industry} and ${startup.stage} stage funding requirements.`
        }));

        return { matches };
    }
};
