
import { GoogleGenAI } from "@google/genai";
import { OnePagerContent, MarketSizeAnalysis, InvestorUpdateContent, StartupStrategicAnalysis, FinancialData, InvestmentMemoContent } from './types';
import { 
    generateInvestorUpdateFunctionDeclaration, 
    generateMarketSizingFunctionDeclaration, 
    generateOnePagerFunctionDeclaration,
    analyzeStartupStrategyFunctionDeclaration,
    generateFinancialsFunctionDeclaration,
    generateInvestmentMemoFunctionDeclaration
} from './prompts';
import { edgeClient } from './edgeClient';
import { handleAIError } from './utils';

export const generateOnePager = async (startupProfile: any): Promise<OnePagerContent> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Generate a one-pager for the following startup profile:
    ${JSON.stringify(startupProfile)}
    Call 'generateOnePager' with the result.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateOnePagerFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 1024 }
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateOnePager' && call.args) {
            return call.args as unknown as OnePagerContent;
        }
        throw new Error("AI did not return one pager content.");
    } catch (error) {
        console.error("Error generating one pager:", error);
        throw new Error("Failed to generate one-pager.");
    }
};

export const generateMarketSizing = async (industry: string, location: string, businessModel: string): Promise<MarketSizeAnalysis> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Perform market sizing research for a ${industry} startup in ${location} with business model: ${businessModel}.
    Search for TAM, SAM, SOM data and provide sources.
    Call 'generateMarketSizing' with the analysis.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Use Flash for Search Grounding
            contents: prompt,
            config: {
                tools: [
                    { googleSearch: {} },
                    { functionDeclarations: [generateMarketSizingFunctionDeclaration] }
                ]
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateMarketSizing' && call.args) {
            return call.args as unknown as MarketSizeAnalysis;
        }
        throw new Error("AI did not return market sizing.");
    } catch (error) {
        console.error("Error generating market sizing:", error);
        throw new Error("Failed to generate market sizing.");
    }
};

export const generateInvestorUpdate = async (currentMetrics: any, previousMetrics: any, notes: string): Promise<InvestorUpdateContent> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Act as a professional startup founder writing a monthly investor update.

    Task:
    1. Compare the Current Metrics against the Previous Metrics. Calculate the percentage growth (or decline) for each.
    2. Analyze the provided 'Notes' to extract key wins (Highlights) and blockers (Lowlights).
    3. Draft a professional, transparent update email content by calling 'generateInvestorUpdate'.

    Data:
    Current Metrics: ${JSON.stringify(currentMetrics)}
    Previous Metrics: ${JSON.stringify(previousMetrics)}
    Notes: "${notes}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateInvestorUpdateFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 1024 }
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateInvestorUpdate' && call.args) {
            return call.args as unknown as InvestorUpdateContent;
        }
        throw new Error("AI did not return investor update.");
    } catch (error) {
        console.error("Error generating investor update:", error);
        throw new Error("Failed to generate investor update.");
    }
};

export const analyzeStartupStrategy = async (profileContext: string): Promise<StartupStrategicAnalysis> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
    You are a Senior Investment Analyst.
    
    **Task:**
    1. Analyze the provided startup profile.
    2. Perform a Google Search to identify current market trends and key competitors in this specific industry.
    3. Use 'Thinking' to synthesize this external data with the startup's internal strengths and weaknesses.
    4. Generate a comprehensive SWOT analysis.
    5. Calculate an 'Investor Readiness Score' (0-100) based on market timing, competitive positioning, and clarity of value prop.
    
    **Startup Profile:**
    ${profileContext}
    
    Call 'analyzeStartupStrategy' with the detailed results.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [
                    { googleSearch: {} },
                    { functionDeclarations: [analyzeStartupStrategyFunctionDeclaration] }
                ],
                thinkingConfig: { thinkingBudget: 4096 } // High reasoning for strategic analysis
            }
        });

        const call = response.functionCalls?.[0];
        
        if (call && call.name === 'analyzeStartupStrategy' && call.args) {
            return call.args as unknown as StartupStrategicAnalysis;
        }
        
        throw new Error("AI did not return a valid strategic analysis.");
    } catch (error) {
        console.error("Error analyzing startup strategy:", error);
        throw new Error("Failed to perform strategic analysis.");
    }
};

export const generateFinancialForecast = async (historicalMetrics: any[]): Promise<FinancialData> => {
    const prompt = `
    You are a startup CFO and Financial Analyst.
    
    **Task:** Generate a 3-year financial projection (forecast) based on the provided historical performance.
    
    **Historical Data (Recent Months):**
    ${JSON.stringify(historicalMetrics)}
    
    **Reasoning & Requirements:**
    1. Analyze the growth trends in Revenue, User Base, and Burn Rate from the history.
    2. Project Revenue, Expenses (Burn Rate), and Cash Balance for the next 3 years (e.g., Year 1, Year 2, Year 3).
    3. Ensure Cash Balance accurately reflects the cumulative burn and revenue.
    4. Include a 'Net Income' or 'Net Burn' row.
    5. Provide a concise summary of the financial outlook and key assumptions (e.g., "Assuming 10% MoM growth").
    
    Call 'generateFinancials' with the structured projection table and summary.
    `;

    try {
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateFinancialsFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateFinancials' && call.args) {
            return call.args as unknown as FinancialData;
        }
        throw new Error("AI did not return financial projections.");
    } catch (error) {
        handleAIError(error);
    }
};

export const generateInvestmentMemo = async (startupProfile: any): Promise<InvestmentMemoContent> => {
    const prompt = `
    Act as a cynical but fair General Partner at a VC firm. Write an Investment Memo for the following startup.
    
    **Startup Profile:**
    ${JSON.stringify(startupProfile)}
    
    **Task:**
    1. Analyze the startup's potential strengths and critical weaknesses.
    2. Evaluate the market dynamics and competition.
    3. Assess the team's capability.
    4. Provide a final verdict score and summary.
    
    Call 'generateInvestmentMemo' with your analysis.
    `;

    try {
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateInvestmentMemoFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 4096 }
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateInvestmentMemo' && call.args) {
            return call.args as unknown as InvestmentMemoContent;
        }
        throw new Error("AI did not return investment memo.");
    } catch (error) {
        handleAIError(error);
    }
};

export const askInvestorData = async (query: string, metricsContext: any[]): Promise<string> => {
    // Limit context to recent history to save tokens/bandwidth
    const context = metricsContext.slice(0, 12); 
    
    const prompt = `
    You are a sophisticated Financial Analyst Assistant for a startup founder.
    
    **Financial Data Context (Last 12 Months):**
    ${JSON.stringify(context)}
    
    **User Query:** "${query}"
    
    **Instructions:**
    1. Analyze the provided metrics data to answer the user's question.
    2. Perform calculations if necessary (e.g., average burn, runway, growth rate).
    3. If the answer involves a trend, describe it (e.g., "increasing month-over-month").
    4. Keep the answer concise, professional, and data-driven. Do not hallucinate numbers not present or derivable from the data.
    
    **Response:**
    `;

    try {
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        if (response.text) {
            return response.text;
        }
        
        throw new Error("AI did not return a response.");
    } catch (error) {
        handleAIError(error);
        return "I'm sorry, I couldn't analyze your data at this moment.";
    }
};
