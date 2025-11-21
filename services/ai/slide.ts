
import { GoogleGenAI } from "@google/genai";
import { templates } from '../../styles/templates';
import { Slide, ChartData, TableData } from '../../data/decks';
import { SlideAnalysis, ExtractedMetric, BioSummary, FinancialData } from './types';
import { 
    analyzeSlideContentFunctionDeclaration, 
    chooseLayoutFunctionDeclaration,
    extractMetricsFunctionDeclaration,
    generateAllSuggestionsFunctionDeclaration,
    generateFinancialsFunctionDeclaration,
    generateHeadlineVariationsFunctionDeclaration,
    generatePricingTableFunctionDeclaration,
    generateSWOTAnalysisFunctionDeclaration,
    rewriteSlideFunctionDeclaration,
    suggestChartFunctionDeclaration,
    suggestPieChartFunctionDeclaration,
    summarizeBioFunctionDeclaration
} from './prompts';

export const modifySlideContent = async (slideTitle: string, slideContent: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Rewrite the following slide content based on the instruction.
    Call 'rewriteSlide' with the new title and content.

    Slide Title: "${slideTitle}"
    Slide Content: "${slideContent}"
    Instruction: "${instruction}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [rewriteSlideFunctionDeclaration] }]
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'rewriteSlide' && call.args) {
            const args = call.args as any;
            return { newTitle: args.newTitle, newContent: args.newContent };
        }
        throw new Error("AI did not return rewritten content.");
    } catch (error) {
        console.error("Error modifying slide content:", error);
        throw new Error("Failed to modify slide content.");
    }
};

export const analyzeSlide = async (slideTitle: string, slideContent: string): Promise<SlideAnalysis> => {
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
                thinkingConfig: { thinkingBudget: 2048 }
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Analyze the slide content and title to determine the most effective visual layout.
    Available layouts: ${Object.keys(templates).join(', ')}.
    Call 'chooseLayout' with the suggested layout key.

    Slide Title: "${slideTitle}"
    Slide Content: "${slideContent}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [chooseLayoutFunctionDeclaration] }]
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'chooseLayout' && call.args) {
            const layout = (call.args as any).layout;
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let suggestionsPrompt = `
    Analyze the slide content below and generate three distinct sets of suggestions:
    1. Copilot: Actionable ideas to improve the text.
    2. Image: Creative visual ideas for the slide.
    3. Research: Relevant topics or queries for supporting data (for Google Search).
    Call 'generateAllSuggestions' with these lists.

    Slide Title: "${slide.title}"
    Slide Content: "${slide.content}"
    Slide Type: "${slide.type || 'generic'}"
    `;

    if (slide.type === 'solution') {
        suggestionsPrompt += `
        Since this is a "Solution" slide, ensure the Copilot suggestions include "Rewrite to focus on benefits" and "Summarize into 3 core pillars".
        Ensure the Image suggestions include prompts for a "How it Works" workflow diagram.
        `;
    } else if (slide.type === 'product') {
        suggestionsPrompt += `
        Since this is a "Product" slide, ensure the Copilot suggestions include "Simplify technical language" and "Format as a numbered list".
        `;
    } else if (slide.type === 'traction') {
        suggestionsPrompt += `
        Since this is a "Traction" slide, ensure the Copilot suggestions include "Highlight key metrics" and "Format as a testimonial".
        `;
    } else if (slide.type === 'competition') {
        suggestionsPrompt += `
        Since this is a "Competition" slide:
        - Copilot suggestions should include "Create a 'Why We Win' summary".
        - Image suggestions should include a detailed prompt for a "2x2 competitive matrix diagram".
        `;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: suggestionsPrompt,
            config: {
                tools: [{ functionDeclarations: [generateAllSuggestionsFunctionDeclaration] }]
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateAllSuggestions' && call.args) {
            const args = call.args as any;
            return {
                copilotSuggestions: args.copilotSuggestions || [],
                imageSuggestions: args.imageSuggestions || [],
                researchSuggestions: args.researchSuggestions || []
            };
        }
        return { copilotSuggestions: [], imageSuggestions: [], researchSuggestions: [] };
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return { copilotSuggestions: [], imageSuggestions: [], researchSuggestions: [] };
    }
};

export const suggestChart = async (slideTitle: string, slideContent: string): Promise<{ chartData: ChartData | null }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    You are a data visualization expert. Analyze the following slide content for numerical data that can be represented as a bar chart. 
    If suitable data is found (at least 2 data points), call the 'suggestChart' function. Otherwise, do not call the function.

    Slide Title: "${slideTitle}"
    Slide Content: "${slideContent}"

    Look for patterns like "Metric: Value", "Category: Amount", or "Year: Number". Extract these into labels and values.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [suggestChartFunctionDeclaration] }]
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'suggestChart' && call.args) {
            const args = call.args as any;
            if (args.data && args.data.length > 1) {
                return { chartData: { type: 'bar', data: args.data } };
            }
        }
        return { chartData: null };
    } catch (error) {
        console.error("Error suggesting chart:", error);
        return { chartData: null };
    }
};

export const suggestPieChart = async (slideContent: string): Promise<{ chartData: ChartData | null }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze the text for fund allocation percentages (e.g., "40% to R&D, 30% to Marketing"). Extract this data and call the 'suggestPieChart' function. The total should add up to 100.

    Content: "${slideContent}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [suggestPieChartFunctionDeclaration] }]
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'suggestPieChart' && call.args) {
            const args = call.args as any;
            return { chartData: { type: 'pie', data: args.data } };
        }
        return { chartData: null };
    } catch (error) {
        console.error("Error suggesting pie chart:", error);
        return { chartData: null };
    }
};

export const generateHeadlineVariations = async (slideTitle: string): Promise<{ headlines: string[] }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    You are an expert pitch deck copywriter. Based on the original title, generate five compelling and distinct headline variations that would capture an investor's attention by calling the 'generateHeadlineVariations' function.

    Original Title: "${slideTitle}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateHeadlineVariationsFunctionDeclaration] }]
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateHeadlineVariations' && call.args) {
            const args = call.args as any;
            return { headlines: args.headlines || [] };
        }
        throw new Error("AI did not generate headlines.");
    } catch (error) {
        console.error("Error generating headlines:", error);
        throw new Error("Failed to generate headline ideas.");
    }
};

export const extractMetrics = async (slideContent: string): Promise<{ metrics: ExtractedMetric[] }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Analyze the following text from a pitch deck's "Problem" slide. Identify all quantifiable metrics that highlight the customer's pain point. Call the 'extractMetrics' function with the data you find.

    Slide Content: "${slideContent}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [extractMetricsFunctionDeclaration] }]
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'extractMetrics' && call.args) {
            const args = call.args as any;
            return { metrics: args.metrics || [] };
        }
        return { metrics: [] };
    } catch (error) {
        console.error("Error extracting metrics:", error);
        throw new Error("Failed to extract metrics.");
    }
};

export const generatePricingTable = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze the following text describing a business model and its pricing. Convert it into a structured format by calling the 'generatePricingTable' function.

    Slide Content: "${slideContent}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generatePricingTableFunctionDeclaration] }]
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generatePricingTable' && call.args) {
            const args = call.args as any;
            return { tableData: { type: 'pricing', tiers: args.tiers } };
        }
        return { tableData: null };
    } catch (error) {
        console.error("Error generating pricing table:", error);
        throw new Error("Failed to generate pricing table.");
    }
};

export const summarizeBio = async (bio: string): Promise<BioSummary> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze the following professional bio. Distill it into a powerful one-sentence summary and extract the most impressive highlights by calling the 'summarizeBio' function.

    Original Bio: "${bio}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [summarizeBioFunctionDeclaration] }]
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'summarizeBio' && call.args) {
            return call.args as unknown as BioSummary;
        }
        throw new Error("AI did not summarize bio.");
    } catch (error) {
        console.error("Error summarizing bio:", error);
        throw new Error("Failed to summarize bio.");
    }
};

export const generateFinancialProjections = async (assumptions: string): Promise<FinancialData> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Generate a 3-year financial projection table based on the following assumptions: "${assumptions}".
    Include rows for Revenue, COGS, Gross Margin, Operating Expenses, and Net Income.
    Call 'generateFinancials' with the data.
    `;

    try {
        const response = await ai.models.generateContent({
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
        throw new Error("AI did not return financial data.");
    } catch (error) {
        console.error("Error generating financials:", error);
        throw new Error("Failed to generate financial projections.");
    }
};

export const generateCompetitorSWOT = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Analyze the slide content to identify the user's company and potential competitors.
    Perform a Google Search to find detailed information about these competitors.
    Then, generate a SWOT analysis table for these competitors comparing them to the user's company.
    Call 'generateSWOTAnalysis' with the result.

    Slide Content: "${slideContent}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Use Flash for Search Grounding
            contents: prompt,
            config: {
                tools: [
                    { googleSearch: {} },
                    { functionDeclarations: [generateSWOTAnalysisFunctionDeclaration] }
                ],
            },
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateSWOTAnalysis' && call.args) {
            const args = call.args as any;
            return {
                tableData: {
                    type: 'comparison',
                    headers: args.headers,
                    rows: args.rows
                }
            };
        }
        return { tableData: null };
    } catch (error) {
        console.error("Error generating SWOT:", error);
        throw new Error("Failed to generate SWOT analysis.");
    }
};
