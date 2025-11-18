
import { GoogleGenAI } from "@google/genai";
import { templates } from '../../styles/templates';
import { Slide, ChartData, TableData } from '../../data/decks';
import { SlideAnalysis, ExtractedMetric, BioSummary, FinancialData } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';
import { analyzeSlideContentFunctionDeclaration } from './prompts';

export const modifySlideContent = async (slideTitle: string, slideContent: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    // For simple rewrites, we use 'low' thinking to prioritize speed/latency.
    return invokeEdgeFunction('modify-slide-content', { 
        slideTitle, 
        slideContent, 
        instruction,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low'
        }
    });
};

export const analyzeSlide = async (slideTitle: string, slideContent: string): Promise<SlideAnalysis> => {
    // Direct client-side call for immediate feedback
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze the following presentation slide content for Clarity, Impact, and Tone. Provide a rating (Good, Average, Needs Improvement) and specific, actionable feedback for each category.

    Slide Title: "${slideTitle}"
    Slide Content:
    "${slideContent}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [analyzeSlideContentFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 } // Use thinking for deeper analysis
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'analyzeSlideContent') {
            return call.args as unknown as SlideAnalysis;
        }
        throw new Error("The AI did not return a valid analysis.");
    } catch (error) {
        console.error("Error analyzing slide:", error);
        throw new Error("Failed to analyze slide content.");
    }
};

export const suggestLayout = async (slideTitle: string, slideContent: string): Promise<{ layout: keyof typeof templates }> => {
    const result = await invokeEdgeFunction<{ layout: string }>('suggest-layout', { 
        slideTitle, 
        slideContent,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low' // Layout suggestions should be snappy
        }
    });
    if (Object.keys(templates).includes(result.layout)) {
        return { layout: result.layout as keyof typeof templates };
    }
    return { layout: 'default' }; // Fallback
};

export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] }> => {
    // Fast suggestions use 'low' thinking for better UX responsiveness.
    return invokeEdgeFunction('fetch-all-suggestions', { 
        slide,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low'
        }
    });
};

export const suggestChart = async (slideTitle: string, slideContent: string): Promise<{ chartData: ChartData | null }> => {
    return invokeEdgeFunction('suggest-chart', { 
        slideTitle, 
        slideContent,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low' // Extraction task
        }
    });
};

export const suggestPieChart = async (slideContent: string): Promise<{ chartData: ChartData | null }> => {
    return invokeEdgeFunction('suggest-pie-chart', { 
        slideContent,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low' // Extraction task
        }
    });
};

export const generateHeadlineVariations = async (slideTitle: string): Promise<{ headlines: string[] }> => {
    return invokeEdgeFunction('generate-headlines', { 
        slideTitle,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high' // Creative task requires reasoning
        }
    });
};

export const extractMetrics = async (slideContent: string): Promise<{ metrics: ExtractedMetric[] }> => {
    return invokeEdgeFunction('extract-metrics', { 
        slideContent,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low' // Extraction task
        }
    });
};

export const generatePricingTable = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    return invokeEdgeFunction('generate-pricing-table', { 
        slideContent,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'low' // Formatting task
        }
    });
};

export const summarizeBio = async (bio: string): Promise<BioSummary> => {
    return invokeEdgeFunction('summarize-bio', { 
        bio,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high' // Synthesis requires reasoning
        }
    });
};

export const generateFinancialProjections = async (assumptions: string): Promise<FinancialData> => {
    // Financial projections benefit immensely from Code Execution for calculation accuracy
    // and High Thinking for strategic assumption modeling.
    return invokeEdgeFunction('generate-financial-projections', { 
        assumptions,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high',
            tools: ['code_execution'] // Backend should map this string to actual tool config
        }
    });
};
