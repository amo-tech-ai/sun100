
import { GoogleGenAI } from "@google/genai";
import { StartupProfile, VCMatchAnalysis, InvestorRanking } from './types';
import { analyzeInvestorFitFunctionDeclaration, rankInvestorsFunctionDeclaration } from './prompts';
import { Investor } from "../vcService";

/**
 * Uses Gemini 3 Pro with Thinking capability to analyze investor fit.
 */
export const matchInvestor = async (startup: StartupProfile, investorProfile: Investor): Promise<VCMatchAnalysis> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct a rich prompt that encourages reasoning
    const prompt = `
    You are a Senior Venture Capital Analyst. Your job is to rigorously evaluate the fit between a startup and an investor.
    
    Use the 'Thinking' process to evaluate:
    1. **Stage Alignment:** Does the startup's stage (${startup.stage}) match the investor's focus (${investorProfile.stages.join(', ')})?
    2. **Check Size:** Is the ask ($${startup.fundingAsk}) within the investor's range ($${investorProfile.min_check_size?.toLocaleString()} - $${investorProfile.max_check_size?.toLocaleString()})?
    3. **Sector Fit:** Does the industry (${startup.industry}) align with their specialties (${investorProfile.specialties.join(', ')})?
    4. **Geographic Fit:** Is the location (${startup.location}) in their region (${investorProfile.geographies.join(', ')})?
    
    **Startup Profile:**
    ${JSON.stringify(startup)}
    
    **Investor Profile:**
    ${JSON.stringify(investorProfile)}
    
    After reasoning, call the 'analyzeInvestorFit' function with your detailed findings.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [analyzeInvestorFitFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 } // Enable thinking for better reasoning
            }
        });

        const call = response.functionCalls?.[0];
        
        if (call && call.name === 'analyzeInvestorFit' && call.args) {
            const result = call.args as unknown as Omit<VCMatchAnalysis, 'investorId'>;
            return {
                investorId: investorProfile.id,
                ...result
            };
        }
        
        throw new Error("AI did not return a valid match analysis.");
    } catch (error) {
        console.error("Error matching investor:", error);
        // Fallback for safety, though Gemini 3 is usually reliable with function calling
        return {
            investorId: investorProfile.id,
            matchScore: 0,
            status: 'Low Fit',
            reasoning: "Analysis failed due to technical error. Please try again.",
            alignment: { stage: false, check_size: false, industry: false, geo: false },
            strengths: [],
            risks: ["System error"],
            recommendedAction: "Retry analysis"
        };
    }
};

/**
 * Finds the top 5 investors from a list that best match the startup profile.
 */
export const findBestInvestors = async (startup: StartupProfile, allInvestors: Investor[]): Promise<InvestorRanking> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Optimize context by sending only relevant fields to LLM
    const optimizedInvestors = allInvestors.map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type,
        stages: inv.stages,
        check_range: `${inv.min_check_size || 0} - ${inv.max_check_size || 'Unlimited'}`,
        specialties: inv.specialties,
        geographies: inv.geographies
    }));

    const prompt = `
    You are a VC Matchmaker. I have a startup and a list of investors.
    
    **Task:**
    Analyze the startup profile against the list of investors.
    Identify the TOP 5 investors that are the best fit based on Stage, Sector, Check Size, and Geography.
    
    **Startup Profile:**
    ${JSON.stringify(startup)}
    
    **Investor List:**
    ${JSON.stringify(optimizedInvestors)}
    
    Call 'rankInvestors' with the top 5 matches, providing a match score (0-100) and a brief reasoning for each.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [rankInvestorsFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 4096 } // Higher budget for sorting/ranking task
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'rankInvestors' && call.args) {
            return call.args as unknown as InvestorRanking;
        }
        
        throw new Error("AI did not return rankings.");
    } catch (error) {
        console.error("Error finding best investors:", error);
        return { matches: [] };
    }
};
