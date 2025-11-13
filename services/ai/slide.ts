import { GoogleGenAI } from '@google/genai';
import { Slide, ChartData, TableData } from '../../data/decks';
import { templates } from '../../styles/templates';
import { SlideAnalysis, ExtractedMetric, BioSummary } from './types';
import { 
    rewriteSlideFunctionDeclaration, 
    analyzeSlideContentFunctionDeclaration, 
    chooseLayoutFunctionDeclaration,
    generateAllSuggestionsFunctionDeclaration,
    suggestChartFunctionDeclaration,
    suggestPieChartFunctionDeclaration,
    generateHeadlineVariationsFunctionDeclaration,
    extractMetricsFunctionDeclaration,
    generatePricingTableFunctionDeclaration,
    summarizeBioFunctionDeclaration
} from './prompts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const modifySlideContent = async (slideTitle: string, slideContent: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    const prompt = `Given the slide content (Title: "${slideTitle}", Content: "${slideContent}"), apply this instruction: "${instruction}". Then, call the 'rewriteSlide' function with the new title and content.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [rewriteSlideFunctionDeclaration] }],
            },
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'rewriteSlide' && functionCall.args) {
            return functionCall.args as { newTitle: string; newContent: string };
        }
        throw new Error("AI did not rewrite the slide as expected.");
    } catch (error) {
        console.error("Error modifying slide content:", error);
        throw new Error("Failed to modify content.");
    }
};

export const analyzeSlide = async (slideTitle: string, slideContent: string): Promise<SlideAnalysis> => {
    const prompt = `You are a pitch deck coach. Analyze the slide (Title: "${slideTitle}", Content: "${slideContent}") for clarity, impact, and tone. Call the 'analyzeSlideContent' function with your analysis.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [analyzeSlideContentFunctionDeclaration] }],
            },
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'analyzeSlideContent' && functionCall.args) {
            return functionCall.args as unknown as SlideAnalysis;
        }
        throw new Error("AI did not analyze the slide as expected.");
    } catch (error) {
        console.error("Error analyzing slide:", error);
        throw new Error("Failed to analyze slide.");
    }
};

export const suggestLayout = async (slideTitle: string, slideContent: string): Promise<{ layout: keyof typeof templates }> => {
    const templateKeys = Object.keys(templates).join(', ');
    const prompt = `Based on the slide content (Title: "${slideTitle}", Content: "${slideContent}"), which layout template would be most effective? Available templates: ${templateKeys}. Call the 'chooseLayout' function with your suggestion.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [chooseLayoutFunctionDeclaration] }],
            },
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'chooseLayout' && functionCall.args?.layout) {
            // FIX: Argument from Gemini function call can be `string | number`, but `includes` expects `string`. Explicitly convert to string to resolve the type error.
            const layout = String(functionCall.args.layout);
            if (Object.keys(templates).includes(layout)) {
                return { layout: layout as keyof typeof templates };
            }
        }
        return { layout: 'default' }; 
    } catch (error) {
        console.error("Error suggesting layout:", error);
        return { layout: 'default' };
    }
};

export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] }> => {
    const prompt = `For a slide titled "${slide.title}", generate suggestions by calling the 'generateAllSuggestions' function.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateAllSuggestionsFunctionDeclaration] }],
            },
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'generateAllSuggestions' && functionCall.args) {
            return functionCall.args as { copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] };
        }
        throw new Error("AI did not generate suggestions as expected.");
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return { copilotSuggestions: [], imageSuggestions: [], researchSuggestions: [] };
    }
};

export const suggestChart = async (slideTitle: string, slideContent: string): Promise<{ chartData: ChartData | null }> => {
    const prompt = `Analyze the slide (Title: "${slideTitle}", Content: "${slideContent}") for quantitative data. If suitable data is found, call the 'suggestChart' function. Otherwise, do nothing.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [suggestChartFunctionDeclaration] }],
            },
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'suggestChart' && functionCall.args?.data) {
            const data = functionCall.args.data as { label: string, value: number }[];
            if (data.length > 0) {
                return { chartData: { type: 'bar', data } };
            }
        }
        return { chartData: null };
    } catch (error) {
        console.error("Error suggesting chart:", error);
        throw new Error("Could not generate chart data from the slide content.");
    }
};

export const suggestPieChart = async (slideContent: string): Promise<{ chartData: ChartData | null }> => {
    const prompt = `Analyze the content: "${slideContent}" for percentage-based allocations. If found, call the 'suggestPieChart' function. Otherwise, do nothing.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [suggestPieChartFunctionDeclaration] }],
            },
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'suggestPieChart' && functionCall.args?.data) {
            const data = functionCall.args.data as { label: string, value: number }[];
            if (data.length > 0) {
                return { chartData: { type: 'pie', data } };
            }
        }
        return { chartData: null };
    } catch (error) {
        console.error("Error suggesting pie chart:", error);
        throw new Error("Could not generate pie chart data from the slide content.");
    }
};

export const generateHeadlineVariations = async (slideTitle: string): Promise<{ headlines: string[] }> => {
    const prompt = `Generate 5 alternative headlines for the slide titled "${slideTitle}" by calling the 'generateHeadlineVariations' function.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateHeadlineVariationsFunctionDeclaration] }],
            },
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'generateHeadlineVariations' && functionCall.args?.headlines) {
            return functionCall.args as { headlines: string[] };
        }
        throw new Error("Failed to generate headlines.");
    } catch (error) {
        console.error("Error generating headlines:", error);
        throw new Error("Failed to generate headlines.");
    }
};

export const extractMetrics = async (slideContent: string): Promise<{ metrics: ExtractedMetric[] }> => {
    const prompt = `From the text: "${slideContent}", extract key business metrics by calling the 'extractMetrics' function.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [extractMetricsFunctionDeclaration] }],
            },
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'extractMetrics' && functionCall.args?.metrics) {
            return functionCall.args as { metrics: ExtractedMetric[] };
        }
        return { metrics: [] };
    } catch (error) {
        console.error("Error extracting metrics:", error);
        throw new Error("Failed to extract metrics.");
    }
};

export const generatePricingTable = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    const prompt = `Based on this description: "${slideContent}", create a pricing table with 3 tiers by calling the 'generatePricingTable' function.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generatePricingTableFunctionDeclaration] }],
            },
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'generatePricingTable' && functionCall.args?.tiers) {
            return { tableData: { type: 'pricing', tiers: functionCall.args.tiers as TableData['tiers'] } };
        }
        return { tableData: null };
    } catch (error) {
        console.error("Error generating pricing table:", error);
        throw new Error("Failed to generate pricing table.");
    }
};

export const summarizeBio = async (bio: string): Promise<BioSummary> => {
    const prompt = `Summarize the bio: "${bio}", and extract highlights by calling the 'summarizeBio' function.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [summarizeBioFunctionDeclaration] }],
            },
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'summarizeBio' && functionCall.args) {
            return functionCall.args as unknown as BioSummary;
        }
        throw new Error("Failed to summarize biography.");
    } catch (error) {
        console.error("Error summarizing bio:", error);
        throw new Error("Failed to summarize biography.");
    }
};