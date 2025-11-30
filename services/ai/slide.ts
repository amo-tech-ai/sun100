
import { templates } from '../../styles/templates';
import { Slide, ChartData, TableData } from '../../data/decks';
import { SlideAnalysis, ExtractedMetric, BioSummary, FinancialData, GTMStrategy } from './types';
import { handleAIError } from './utils';
import { edgeClient } from './edgeClient';
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
    summarizeBioFunctionDeclaration,
    generateGTMStrategyFunctionDeclaration
} from './prompts';

export const modifySlideContent = async (slideTitle: string, slideContent: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    const prompt = `
    You are a Professional Pitch Deck Editor.
    
    **Task:** Rewrite the slide content based on the user's instruction.
    **Instruction:** "${instruction}"
    
    **Current Slide:**
    - Title: "${slideTitle}"
    - Content: "${slideContent}"
    
    **Requirements:**
    - Maintain a professional, persuasive tone.
    - Keep it concise and readable for a presentation.
    
    Call 'rewriteSlide' with the new title and content.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
        handleAIError(error);
    }
};

export const analyzeSlide = async (slideTitle: string, slideContent: string): Promise<SlideAnalysis> => {
    const prompt = `
    You are a Venture Capital Associate.
    
    **Task:** Analyze this slide for:
    1. **Clarity:** Is the message instant?
    2. **Impact:** Is it persuasive?
    3. **Tone:** Is it professional and confident?
    
    **Slide:**
    Title: "${slideTitle}"
    Content: "${slideContent}"
    
    **Output:** Provide a rating and *specific, actionable* feedback for improvement.
    
    Call 'analyzeSlideContent' with your analysis.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
        handleAIError(error);
    }
};

export const suggestLayout = async (slideTitle: string, slideContent: string): Promise<{ layout: keyof typeof templates }> => {
    const prompt = `
    You are a Presentation Designer.
    
    **Task:** Choose the most effective visual layout for this slide.
    **Content:** Title: "${slideTitle}", Body: "${slideContent}"
    
    **Layout Options:** ${Object.keys(templates).join(', ')}.
    
    **Rules:**
    - Use 'vibrantCover' for title slides.
    - Use 'vibrantTimeline' if the content lists dates or steps.
    - Use 'vibrantVision' for high-level mission statements.
    - Use 'vibrantSolutions' for feature lists.
    
    Call 'chooseLayout' with the key.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
        handleAIError(error);
    }
};

export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[], imageSuggestions: string[], researchSuggestions: string[] }> => {
    let suggestionsPrompt = `
    Analyze the slide content and generate three sets of suggestions.
    
    1. **Copilot (Text):** Actionable ways to improve the copy (e.g., "Make it punchier").
    2. **Image (Visuals):** Creative prompts for a background image or diagram.
    3. **Research (Data):** Specific Google Search queries to find supporting evidence.
    
    **Slide Context:**
    - Title: "${slide.title}"
    - Content: "${slide.content}"
    - Type: "${slide.type || 'generic'}"
    `;

    if (slide.type === 'solution') {
        suggestionsPrompt += `
        **Specific Solution Context:**
        - Copilot: Suggest "Rewrite to focus on benefits".
        - Image: Suggest a "How it Works" workflow diagram.
        `;
    } else if (slide.type === 'product') {
        suggestionsPrompt += `
        **Specific Product Context:**
        - Copilot: Suggest "Simplify technical language".
        `;
    } else if (slide.type === 'traction') {
        suggestionsPrompt += `
        **Specific Traction Context:**
        - Copilot: Suggest "Highlight key metrics" (bolding).
        `;
    } else if (slide.type === 'competition') {
        suggestionsPrompt += `
        **Specific Competition Context:**
        - Copilot: Suggest "Create a 'Why We Win' summary".
        - Image: Suggest a "2x2 competitive matrix".
        `;
    }

    suggestionsPrompt += `\nCall 'generateAllSuggestions' with the lists.`;

    try {
        const response = await edgeClient.models.generateContent({
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
        handleAIError(error);
        return { copilotSuggestions: [], imageSuggestions: [], researchSuggestions: [] };
    }
};

export const suggestChart = async (slideTitle: string, slideContent: string): Promise<{ chartData: ChartData | null }> => {
    const prompt = `
    You are a Data Visualization Expert.
    
    **Task:** Analyze text for numerical data suitable for a Bar Chart.
    **Content:** "${slideContent}"
    
    **Rule:** Only call the function if you find at least 2 comparable data points (e.g. "Revenue 2023 vs 2024").
    
    Call 'suggestChart' if applicable.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
        handleAIError(error);
    }
};

export const suggestPieChart = async (slideContent: string): Promise<{ chartData: ChartData | null }> => {
    const prompt = `
    You are a Data Visualization Expert.
    
    **Task:** Analyze text for percentage allocations (e.g., "Budget breakdown: 40% R&D, 60% Sales").
    
    **Content:** "${slideContent}"
    
    Call 'suggestPieChart' if you find components that sum to ~100%.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
        handleAIError(error);
    }
};

export const generateHeadlineVariations = async (slideTitle: string): Promise<{ headlines: string[] }> => {
    const prompt = `
    You are a Copywriter specializing in Pitch Decks.
    
    **Task:** Brainstorm 5 punchy, investor-focused headlines based on this original title.
    **Original:** "${slideTitle}"
    
    Call 'generateHeadlineVariations' with the list.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
        handleAIError(error);
    }
};

export const extractMetrics = async (slideContent: string): Promise<{ metrics: ExtractedMetric[] }> => {
    const prompt = `
    You are a Business Analyst.
    
    **Task:** Scan this text for impressive numbers/metrics (e.g., "20% Growth", "$1M ARR").
    **Text:** "${slideContent}"
    
    Call 'extractMetrics' with the key findings.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
        handleAIError(error);
    }
};

export const generatePricingTable = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    const prompt = `
    **Task:** Structure this pricing text into a comparison table.
    **Text:** "${slideContent}"
    
    Call 'generatePricingTable'.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
        handleAIError(error);
    }
};

export const summarizeBio = async (bio: string): Promise<BioSummary> => {
    const prompt = `
    You are a PR Specialist.
    
    **Task:** Shorten this bio into a single credibility-building sentence and extract 3 key badges (e.g. "Ex-Google").
    **Bio:** "${bio}"
    
    Call 'summarizeBio'.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
        handleAIError(error);
    }
};

export const generateFinancialProjections = async (assumptions: string): Promise<FinancialData> => {
    const prompt = `
    You are a CFO.
    
    **Task:** Build a 3-year financial projection model based on these assumptions: "${assumptions}".
    **Reasoning:** Calculate logical growth for Revenue and Expenses. Ensure margins make sense for the industry.
    
    Call 'generateFinancials' with the table.
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
        throw new Error("AI did not return financial data.");
    } catch (error) {
        handleAIError(error);
    }
};

export const generateCompetitorSWOT = async (slideContent: string): Promise<{ tableData: TableData | null }> => {
    const prompt = `
    You are a Strategic Consultant.
    
    **Task:**
    1. Identify the company and competitors from this text: "${slideContent}".
    2. Use Google Search to find *current* strengths and weaknesses of these competitors.
    3. Create a SWOT table.
    
    Call 'generateSWOTAnalysis'.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
        handleAIError(error);
    }
};

export const generateGTMStrategy = async (context: string): Promise<GTMStrategy> => {
    const prompt = `
    You are a Chief Marketing Officer (CMO).
    
    **Task:** Develop a high-impact Go-To-Market strategy for this business.
    **Context:** "${context}"
    
    **Reasoning:**
    - Consider the stage (Seed/Series A).
    - Focus on the most efficient channels for this specific customer type.
    
    Call 'generateGTMStrategy'.
    `;

    try {
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateGTMStrategyFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateGTMStrategy' && call.args) {
            return call.args as unknown as GTMStrategy;
        }
        throw new Error("AI did not return GTM strategy.");
    } catch (error) {
        handleAIError(error);
    }
};
