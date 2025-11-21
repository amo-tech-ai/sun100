
import { GoogleGenAI } from "@google/genai";
import { OnePagerContent, MarketSizeAnalysis, InvestorUpdateContent } from './types';
import { 
    generateInvestorUpdateFunctionDeclaration, 
    generateMarketSizingFunctionDeclaration, 
    generateOnePagerFunctionDeclaration 
} from './prompts';

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
    Generate an investor update based on the following data:
    Current Metrics: ${JSON.stringify(currentMetrics)}
    Previous Metrics: ${JSON.stringify(previousMetrics)}
    Notes: "${notes}"
    Call 'generateInvestorUpdate' with the content.
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
