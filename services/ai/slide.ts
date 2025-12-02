import { templates } from '../../styles/templates';
import { Slide, ChartData, TableData } from '../../data/decks';
import { SlideAnalysis, ExtractedMetric, BioSummary, FinancialData, GTMStrategy } from './types';
import { handleAIError } from './utils';
import { edgeClient } from './edgeClient';
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
    summarizeBioFunctionDeclaration,
    generateFinancialsFunctionDeclaration,
    generateSWOTAnalysisFunctionDeclaration,
    generateGTMStrategyFunctionDeclaration
} from './prompts';

export const modifySlideContent = async (slideTitle: string, slideContent: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    try {
        const prompt = `
            You are a pitch deck editor.
            Slide Title: "${slideTitle}"
            Slide Content: "${slideContent}"
            
            Instruction: ${instruction}
            
            Rewrite the title and content to follow the instruction. Keep it concise and professional.
            Call 'rewriteSlide'.
        `;

        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [rewriteSlideFunctionDeclaration] }]
            }
        });

        const call = response.functionCalls?.[0];
        if (call?.name === 'rewriteSlide' && call.args) {
            return { newTitle: call.args.newTitle as string, newContent: call.args.newContent as string };
        }
        throw new Error("Failed to rewrite slide.");
    } catch (e) {
        handleAIError(e);
        throw e;
    }
};

export const analyzeSlide = async (slideTitle: string, slideContent: string): Promise<SlideAnalysis> => {
    try {
        const prompt = `
            Analyze this slide for Clarity, Impact, and Tone.
            Title: ${slideTitle}
            Content: ${slideContent}
            Call 'analyzeSlideContent'.
        `;
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [analyzeSlideContentFunctionDeclaration] }]
            }
        });
        const call = response.functionCalls?.[0];
        if (call?.name === 'analyzeSlideContent' && call.args) {
            return call.args as unknown as SlideAnalysis;
        }
        throw new Error("Analysis failed");
    } catch (e) {
        handleAIError(e);
        throw e;
    }
};

export const suggestLayout = async (slideTitle: string, slideContent: string): Promise<{ layout: keyof typeof templates }> => {
    try {
        const prompt = `
            Suggest the best visual layout for this slide.
            Title: ${slideTitle}
            Content: ${slideContent}
            Available Layouts: ${Object.keys(templates).join(', ')}
            Call 'chooseLayout'.
        `;
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [chooseLayoutFunctionDeclaration] }]
            }
        });
        const call = response.functionCalls?.[0];
        const layout = call?.args?.layout as string;
        
        if (layout && Object.keys(templates).includes(layout)) {
            return { layout: layout as keyof typeof templates };
        }
        return { layout: 'default' };
    } catch (e) {
        return { layout: 'default' };
    }
};

export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] }> => {
    try {
        const prompt = `
            Analyze this slide ("${slide.title}") and provide 3 sets of suggestions:
            1. Copilot: prompts to improve text.
            2. Image: prompts for visuals.
            3. Research: queries for supporting data.
            Call 'generateAllSuggestions'.
        `;
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateAllSuggestionsFunctionDeclaration] }]
            }
        });
        const call = response.functionCalls?.[0];
        if (call?.name === 'generateAllSuggestions' && call.args) {
            return call.args as any;
        }
        return { copilotSuggestions: [], imageSuggestions: [], researchSuggestions: [] };
    } catch (error) {
        return { copilotSuggestions: [], imageSuggestions: [], researchSuggestions: [] };
    }
};

export const suggestChart = async (slideTitle: string, slideContent: string): Promise<{ chartData: ChartData | null }> => {
    try {
        const prompt = `Analyze this slide for numerical data suitable for a bar chart. If found, call 'suggestChart'. Title: ${slideTitle}. Content: ${slideContent}`;
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{ functionDeclarations: [suggestChartFunctionDeclaration] }] }
        });
        const call = response.functionCalls?.[0];
        if (call?.name === 'suggestChart' && call.args) {
             // Explicitly cast the 'type' to the literal type 'bar'
            const data = call.args.data as { label: string, value: number }[];
            if (data && data.length > 0) {
                 return { chartData: { type: 'bar', data } };
            }
        }
        return { chartData: null };
    } catch (e) { return { chartData: null }; }
};

export const suggestPieChart = async (slideContent: string): Promise<{ chartData: ChartData | null }> => {
    try {
        const prompt = `Analyze this text for percentage/allocation data suitable for a pie chart. Call 'suggestPieChart'. Content: ${slideContent}`;
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{ functionDeclarations: [suggestPieChartFunctionDeclaration] }] }
        });
        const call = response.functionCalls?.[0];
        if (call?.name === 'suggestPieChart' && call.args) {
            const data = call.args.data as { label: string, value: number }[];
            if (data && data.length > 0) {
                 return { chartData: { type: 'pie', data } };
            }
        }
        return { chartData: null };
    } catch (e) { return { chartData: null }; }
};

export const generateHeadlineVariations = async (slideTitle: string): Promise<{ headlines: string[] }> => {
    try {
        const prompt = `Generate 5 headline variations for: "${slideTitle}". Call 'generateHeadlineVariations'.`;
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{ functionDeclarations: [generateHeadlineVariationsFunctionDeclaration] }] }
        });
        const call = response.functionCalls?.[0];
        return { headlines: (call?.args?.headlines as string[]) || [] };
    } catch (e) { return { headlines: [] }; }
};

export const extractMetrics = async (slideContent: string): Promise<{ metrics: ExtractedMetric[] }> => {
    try {
        const prompt = `Extract key metrics from this text: "${slideContent}". Call 'extractMetrics'.`;
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{ functionDeclarations: [extractMetricsFunctionDeclaration] }] }
        });
        const call = response.functionCalls?.[0];
        return { metrics: (call?.args?.metrics as ExtractedMetric[]) || [] };
    } catch (e) { return { metrics: [] }; }
};

export const generatePricingTable = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    try {
        const prompt = `Convert this pricing text into a table structure: "${slideContent}". Call 'generatePricingTable'.`;
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{ functionDeclarations: [generatePricingTableFunctionDeclaration] }] }
        });
        const call = response.functionCalls?.[0];
        if (call?.name === 'generatePricingTable' && call.args) {
            return { tableData: { type: 'pricing', tiers: call.args.tiers as any } };
        }
        return { tableData: null };
    } catch (e) { return { tableData: null }; }
};

export const summarizeBio = async (bio: string): Promise<BioSummary> => {
    try {
        const prompt = `Summarize this bio: "${bio}". Call 'summarizeBio'.`;
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{ functionDeclarations: [summarizeBioFunctionDeclaration] }] }
        });
        const call = response.functionCalls?.[0];
        return call?.args as unknown as BioSummary;
    } catch (e) { throw e; }
};

export const generateFinancialProjections = async (assumptions: string): Promise<FinancialData> => {
    try {
        const prompt = `Generate a 3-year financial projection based on: "${assumptions}". Call 'generateFinancials'.`;
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{ functionDeclarations: [generateFinancialsFunctionDeclaration] }] }
        });
        const call = response.functionCalls?.[0];
        return call?.args as unknown as FinancialData;
    } catch (e) { throw e; }
};

export const generateCompetitorSWOT = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    try {
        const prompt = `Generate a SWOT analysis for competitors mentioned here: "${slideContent}". Call 'generateSWOTAnalysis'.`;
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{ functionDeclarations: [generateSWOTAnalysisFunctionDeclaration] }] }
        });
        const call = response.functionCalls?.[0];
        if(call?.name === 'generateSWOTAnalysis' && call.args) {
             return { tableData: { type: 'comparison', headers: call.args.headers as string[], rows: call.args.rows as string[][] } };
        }
        return { tableData: null };
    } catch (e) { return { tableData: null }; }
};

export const generateGTMStrategy = async (context: string): Promise<GTMStrategy> => {
    try {
        const prompt = `Generate a concise GTM strategy summary for: "${context}". Call 'generateGTMStrategy'.`;
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { tools: [{ functionDeclarations: [generateGTMStrategyFunctionDeclaration] }] }
        });
        const call = response.functionCalls?.[0];
        return call?.args as unknown as GTMStrategy;
    } catch (e) { throw e; }
};