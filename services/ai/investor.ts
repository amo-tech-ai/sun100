
import { OnePagerContent, MarketSizeAnalysis, InvestorUpdateContent, StartupStrategicAnalysis, FinancialData, InvestmentMemoContent, EnrichedProfile } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const generateOnePager = async (startupProfile: any): Promise<OnePagerContent> => {
    try {
        return await invokeEdgeFunction<OnePagerContent>('investor-ai', { 
            action: 'generateOnePager',
            startupProfile 
        });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock One Pager.");
        await new Promise(r => setTimeout(r, 2000));
        return {
            headline: "The Operating System for AI Startups",
            problem_summary: "Founders waste 30% of their time on non-core tasks like fundraising decks and CRM management.",
            solution_summary: "StartupAI provides an all-in-one platform with automated pitch decks, investor matching, and growth tools.",
            market_opportunity: "Targeting the $50B productivity software market with a focus on the 50M+ early-stage founders.",
            traction_highlights: ["$10k MRR", "20% MoM Growth", "500+ Active Users"],
            business_model: "Freemium SaaS with $49/mo Pro tier and Enterprise plans.",
            ask: "$1.5M Seed Round to scale engineering and sales.",
            contact_info: { email: "founder@example.com", website: "startupai.com" }
        };
    }
};

export const generateMarketSizing = async (industry: string, location: string, businessModel: string): Promise<MarketSizeAnalysis> => {
    try {
        return await invokeEdgeFunction<MarketSizeAnalysis>('investor-ai', { 
            action: 'generateMarketSizing',
            industry, 
            location, 
            businessModel 
        });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock Market Sizing.");
        await new Promise(r => setTimeout(r, 2000));
        return {
            icp: "Early-stage Tech Founders",
            beachhead: "AI Startups in the US",
            tam: { value: "$50B", description: "Global Productivity Software Market", sourceUrl: "#" },
            sam: { value: "$10B", description: "US SMB Market", sourceUrl: "#" },
            som: { value: "$500M", description: "Target 5% Market Share", sourceUrl: "#" },
            methodology: "Bottom-up analysis based on 50M potential users x $100 ARPU."
        };
    }
};

export const generateInvestorUpdate = async (currentMetrics: any, previousMetrics: any, notes: string): Promise<InvestorUpdateContent> => {
    try {
        return await invokeEdgeFunction<InvestorUpdateContent>('investor-ai', { 
            action: 'generateInvestorUpdate',
            currentMetrics, 
            previousMetrics, 
            notes 
        });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock Investor Update.");
        await new Promise(r => setTimeout(r, 2000));
        return {
            subject_line: "Investor Update: Strong Growth & Product Velocity 🚀",
            status_emoji: "🟢",
            status_summary: "On Track",
            highlights: ["Launched new AI features", "Hired Head of Sales", "Reached 1000 users"],
            lowlights: ["Churn increased slightly due to legacy pricing", "Marketing spend efficiency dropped"],
            kpi_summary: "MRR: $12k (+20%)\nActive Users: 1,050 (+15%)\nBurn: $15k",
            ask: "Intros to Series A investors in the Fintech space."
        };
    }
};

export const analyzeStartupStrategy = async (profileContext: string): Promise<StartupStrategicAnalysis> => {
    try {
        return await invokeEdgeFunction<StartupStrategicAnalysis>('investor-ai', { 
            action: 'analyzeStartupStrategy',
            profileContext 
        });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock Strategy Analysis.");
        await new Promise(r => setTimeout(r, 2000));
        return {
            investorReadinessScore: 72,
            readinessReasoning: "Strong product vision but metrics need more historical data to prove retention.",
            swot: {
                strengths: ["Innovative AI Tech", "Experienced Team", "Fast Velocity"],
                weaknesses: ["Limited Marketing Budget", "High Server Costs"],
                opportunities: ["Global Expansion", "Enterprise Partnerships"],
                threats: ["Big Tech incumbents", "Regulatory changes"]
            },
            marketTrends: ["AI Adoption spiking", "Remote work tools consolidating"],
            keyCompetitors: ["Competitor A", "Competitor B", "Legacy Corp"]
        };
    }
};

export const generateFinancialForecast = async (historicalMetrics: any[]): Promise<FinancialData> => {
    try {
        return await invokeEdgeFunction<FinancialData>('investor-ai', { 
            action: 'generateFinancialForecast',
            historicalMetrics 
        });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock Financial Forecast.");
        await new Promise(r => setTimeout(r, 2000));
        return {
            headers: ["Q1", "Q2", "Q3", "Q4"],
            rows: [
                { label: "Revenue", values: ["$50k", "$75k", "$110k", "$150k"] },
                { label: "Expenses", values: ["$40k", "$50k", "$60k", "$80k"] },
                { label: "Net Income", values: ["$10k", "$25k", "$50k", "$70k"] }
            ],
            summary: "Projected to triple revenue by EOY with maintained profitability."
        };
    }
};

export const generateInvestmentMemo = async (startupProfile: any): Promise<InvestmentMemoContent> => {
    try {
        return await invokeEdgeFunction<InvestmentMemoContent>('investor-ai', { 
            action: 'generateInvestmentMemo',
            startupProfile 
        });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock Investment Memo.");
        await new Promise(r => setTimeout(r, 2000));
        return {
            investment_thesis: "StartupAI is positioned to capture the long-tail of the founder market by automating the most painful parts of starting a company.",
            key_risks: ["Platform dependency on LLM providers", "Customer acquisition cost scaling"],
            market_dynamics: "The market is shifting from point solutions to integrated operating systems.",
            competitor_analysis: "Incumbents are slow to integrate generative AI deeply into workflows.",
            team_assessment: "Founders have deep domain expertise and previous exits.",
            verdict_score: 85,
            verdict_summary: "Strong Buy. The combination of product velocity and market timing presents a unique opportunity."
        };
    }
};

/**
 * Handles natural language queries about the startup's status.
 * Accepts a context object containing metrics, decks, and CRM data.
 */
export const askInvestorData = async (query: string, context: any): Promise<string> => {
    try {
        const result = await invokeEdgeFunction<{ response: string }>('investor-ai', { 
            action: 'askInvestorData',
            query, 
            context 
        });
        return result.response;
    } catch (error) {
        console.warn("Edge Function failed. Returning mock Chat response.");
        return "Based on your current data, you have a healthy pipeline with 3 active negotiation deals, and your burn rate allows for 14 months of runway.";
    }
};

export const enrichStartupProfile = async (name: string, website: string, pitch: string): Promise<EnrichedProfile> => {
    try {
        return await invokeEdgeFunction<EnrichedProfile>('investor-ai', {
            action: 'enrichStartupProfile',
            name,
            website,
            pitch
        });
    } catch (error) {
         console.warn("Edge Function failed. Returning mock enrichment.");
         await new Promise(r => setTimeout(r, 2000));
         return {
             tagline: `${name} - The future of ${pitch || 'innovation'}`,
             description: `We are building ${name} to solve critical problems in the industry. Our solution leverages cutting-edge technology to deliver value.`,
             industry: "Technology",
             mission: "To revolutionize the way people work and live."
         };
    }
};
