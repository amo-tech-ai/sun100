import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import type { SlideAnalysis, ResearchResult } from './ai.models';
import type { ChartData } from '../data/decks';
import { templates } from "../styles/templates";

// As per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Function Declarations ---

const analyzeSlideFunctionDeclaration: FunctionDeclaration = {
    name: 'analyzeSlide',
    description: 'Analyzes a presentation slide for clarity, impact, and tone, providing a rating and feedback for each.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            clarity: {
                type: Type.OBJECT,
                properties: {
                    rating: { type: Type.STRING, enum: ['Good', 'Average', 'Needs Improvement'] },
                    feedback: { type: Type.STRING, description: 'Specific feedback on the clarity of the slide content.' }
                },
                required: ['rating', 'feedback']
            },
            impact: {
                type: Type.OBJECT,
                properties: {
                    rating: { type: Type.STRING, enum: ['Good', 'Average', 'Needs Improvement'] },
                    feedback: { type: Type.STRING, description: 'Feedback on the slide\'s potential impact on the audience.' }
                },
                required: ['rating', 'feedback']
            },
            tone: {
                type: Type.OBJECT,
                properties: {
                    rating: { type: Type.STRING, enum: ['Good', 'Average', 'Needs Improvement'] },
                    feedback: { type: Type.STRING, description: 'Feedback on the appropriateness of the tone for a pitch deck.' }
                },
                required: ['rating', 'feedback']
            },
        },
        required: ['clarity', 'impact', 'tone'],
    },
};

const suggestLayoutFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestLayout',
    description: 'Suggests the most appropriate layout for a slide based on its content.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            layout: { 
                type: Type.STRING, 
                description: 'The suggested layout name.',
                enum: Object.keys(templates)
            },
        },
        required: ['layout'],
    },
};

const suggestChartFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestChart',
    description: 'Analyzes slide content to determine if a chart is appropriate. If so, it generates the data for a bar chart.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            isChartRecommended: { type: Type.BOOLEAN, description: 'Whether a chart is recommended for this content.' },
            chartData: {
                type: Type.OBJECT,
                description: 'The data for the chart, if recommended.',
                properties: {
                    type: { type: Type.STRING, enum: ['bar'] },
                    data: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                label: { type: Type.STRING },
                                value: { type: Type.NUMBER }
                            },
                            required: ['label', 'value']
                        }
                    }
                },
                required: ['type', 'data']
            }
        },
        required: ['isChartRecommended']
    }
};

const suggestPieChartFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestPieChart',
    description: 'Analyzes slide content for data suitable for a pie chart (e.g., budget allocation, market share) and generates the data.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            isChartRecommended: { type: Type.BOOLEAN, description: 'Whether a pie chart is recommended.' },
            chartData: {
                type: Type.OBJECT,
                description: 'The data for the pie chart, if recommended.',
                properties: {
                    type: { type: Type.STRING, enum: ['pie'] },
                    data: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                label: { type: Type.STRING },
                                value: { type: Type.NUMBER, description: 'The percentage value for the slice.' }
                            },
                            required: ['label', 'value']
                        }
                    }
                },
                required: ['type', 'data']
            }
        },
        required: ['isChartRecommended']
    }
};

// --- API Functions ---

export const analyzeSlide = async (title: string, content: string): Promise<SlideAnalysis> => {
    const prompt = `Analyze the following presentation slide for a pitch deck. Provide feedback on its clarity, impact, and tone. The output must be a function call to 'analyzeSlide'.\n\nTitle: ${title}\nContent:\n${content}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [analyzeSlideFunctionDeclaration] }],
        },
    });

    const functionCall = response.functionCalls?.[0];
    if (functionCall?.name === 'analyzeSlide' && functionCall.args) {
        // FIX: Cast functionCall.args from Record<string, unknown> to the expected type safely.
        return functionCall.args as unknown as SlideAnalysis;
    }

    throw new Error("Failed to analyze slide.");
};

export const researchTopic = async (query: string): Promise<ResearchResult> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Provide a concise summary answering the following query, based on web search results: "${query}".`,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const summary = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || '',
    })).filter(source => source.uri) || [];

    if (!summary) {
        throw new Error("Research failed to return a summary.");
    }
    
    return { summary, sources };
};

export const suggestLayout = async (title: string, content: string): Promise<keyof typeof templates> => {
    const prompt = `Based on the title "${title}" and content "${content}", suggest the best layout from the available options. The output must be a function call to 'suggestLayout'.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [suggestLayoutFunctionDeclaration] }],
        },
    });

    const functionCall = response.functionCalls?.[0];
    if (functionCall?.name === 'suggestLayout' && functionCall.args) {
        // FIX: Safely access and validate the layout property from the unknown args object.
        const layoutArg = (functionCall.args as { layout: unknown }).layout;
        if (typeof layoutArg === 'string' && Object.keys(templates).includes(layoutArg)) {
            return layoutArg as keyof typeof templates;
        }
    }
    
    return 'default'; // Fallback
};

export const suggestChart = async (title: string, content: string): Promise<ChartData | null> => {
    const prompt = `Analyze the slide content below. If it contains quantitative data that can be visualized as a bar chart, generate the data. Otherwise, indicate that a chart is not recommended. The output must be a function call to 'suggestChart'.\n\nTitle: ${title}\nContent:\n${content}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [suggestChartFunctionDeclaration] }],
        },
    });

    const functionCall = response.functionCalls?.[0];
    if (functionCall?.name === 'suggestChart' && functionCall.args) {
        if (functionCall.args.isChartRecommended && functionCall.args.chartData) {
            return functionCall.args.chartData as ChartData;
        }
    }

    return null;
};

export const suggestPieChart = async (content: string): Promise<ChartData | null> => {
    const prompt = `Analyze the slide content below. If it describes a distribution of a whole (like budget allocation or market share), generate data for a pie chart where values are percentages. Otherwise, indicate a pie chart is not recommended. The output must be a function call to 'suggestPieChart'.\n\nContent:\n${content}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [suggestPieChartFunctionDeclaration] }],
        },
    });

    const functionCall = response.functionCalls?.[0];
    if (functionCall?.name === 'suggestPieChart' && functionCall.args) {
        if (functionCall.args.isChartRecommended && functionCall.args.chartData) {
            return functionCall.args.chartData as ChartData;
        }
    }

    return null;
};
