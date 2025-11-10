import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import type { ExtractedMetric, BioSummary } from './ai.models';
import type { TableData } from '../data/decks';

// As per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Function Declarations ---

const rewriteSlideFunctionDeclaration: FunctionDeclaration = {
    name: 'rewriteSlide',
    description: 'Revises and improves the title and content of a slide based on an instruction.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            newTitle: { type: Type.STRING, description: 'The revised, improved title for the slide.' },
            newContent: { type: Type.STRING, description: 'The revised, improved bulleted content for the slide, with points separated by newlines.' }
        },
        required: ['newTitle', 'newContent']
    },
};

const generateHeadlinesFunctionDeclaration: FunctionDeclaration = {
    name: 'generateHeadlines',
    description: 'Generates 3 alternative, compelling headlines for a slide.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            headlines: {
                type: Type.ARRAY,
                description: 'An array of 3 headline strings.',
                items: { type: Type.STRING }
            }
        },
        required: ['headlines']
    }
};

const extractMetricsFunctionDeclaration: FunctionDeclaration = {
    name: 'extractMetrics',
    description: 'Extracts key business or performance metrics (label and value) from a block of text.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            metrics: {
                type: Type.ARRAY,
                description: 'An array of extracted metric objects.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING, description: 'The name of the metric (e.g., "User Growth").' },
                        value: { type: Type.STRING, description: 'The value of the metric (e.g., "25%").' }
                    },
                    required: ['label', 'value']
                }
            }
        },
        required: ['metrics']
    }
};

const generatePricingTableFunctionDeclaration: FunctionDeclaration = {
    name: 'generatePricingTable',
    description: 'Creates a 3-tier pricing table based on the provided product description.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            tiers: {
                type: Type.ARRAY,
                description: 'An array of 3 pricing tier objects.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: 'Name of the tier (e.g., "Basic").' },
                        price: { type: Type.STRING, description: 'Price of the tier (e.g., "$29/mo").' },
                        features: {
                            type: Type.ARRAY,
                            description: 'List of key features for this tier.',
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['name', 'price', 'features']
                }
            }
        },
        required: ['tiers']
    }
};

const summarizeBioFunctionDeclaration: FunctionDeclaration = {
    name: 'summarizeBio',
    description: 'Summarizes a team member\'s biography and extracts key highlight points.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: 'A concise, one-paragraph summary of the biography.' },
            highlights: {
                type: Type.ARRAY,
                description: 'An array of 3-4 key achievements or skills from the biography.',
                items: { type: Type.STRING }
            }
        },
        required: ['summary', 'highlights']
    }
};

// --- API Functions ---

export const modifySlideContent = async (title: string, content: string, instruction: string): Promise<{ newTitle: string; newContent: string }> => {
    const prompt = `Given the slide with title "${title}" and content:\n${content}\n\nPlease apply the following instruction: "${instruction}". The output must be a function call to 'rewriteSlide'.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [rewriteSlideFunctionDeclaration] }],
        },
    });

    const functionCall = response.functionCalls?.[0];
    if (functionCall?.name === 'rewriteSlide' && functionCall.args) {
        return functionCall.args as { newTitle: string; newContent: string };
    }

    throw new Error("Failed to modify slide content.");
};

export const generateHeadlineVariations = async (currentTitle: string): Promise<string[]> => {
    const prompt = `Generate 3 creative and impactful alternative headlines for a slide currently titled "${currentTitle}". The output must be a function call to 'generateHeadlines'.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [generateHeadlinesFunctionDeclaration] }],
        },
    });

    const functionCall = response.functionCalls?.[0];
    if (functionCall?.name === 'generateHeadlines' && functionCall.args?.headlines) {
        return functionCall.args.headlines as string[];
    }
    
    throw new Error("Failed to generate headline variations.");
};

export const extractMetrics = async (content: string): Promise<ExtractedMetric[]> => {
    const prompt = `From the text below, extract all key metrics. The output must be a function call to 'extractMetrics'.\n\nText:\n${content}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [extractMetricsFunctionDeclaration] }],
        },
    });

    const functionCall = response.functionCalls?.[0];
    if (functionCall?.name === 'extractMetrics' && functionCall.args?.metrics) {
        return functionCall.args.metrics as ExtractedMetric[];
    }
    
    return [];
};

export const generatePricingTable = async (productInfo: string): Promise<TableData> => {
    const prompt = `Based on this product information: "${productInfo}", create a 3-tier pricing table (e.g., Basic, Pro, Enterprise). The output must be a function call to 'generatePricingTable'.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [generatePricingTableFunctionDeclaration] }],
        },
    });

    const functionCall = response.functionCalls?.[0];
    if (functionCall?.name === 'generatePricingTable' && functionCall.args?.tiers) {
        return {
            type: 'pricing',
            // FIX: Cast the tiers property from unknown to the correct TableData['tiers'] type.
            tiers: functionCall.args.tiers as unknown as TableData['tiers']
        };
    }
    
    throw new Error("Failed to generate pricing table.");
};

export const summarizeBio = async (bioText: string): Promise<BioSummary> => {
    const prompt = `Summarize the following biography and extract 3-4 key highlights. The output must be a function call to 'summarizeBio'.\n\nBiography:\n${bioText}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [summarizeBioFunctionDeclaration] }],
        },
    });

    const functionCall = response.functionCalls?.[0];
    if (functionCall?.name === 'summarizeBio' && functionCall.args) {
        // FIX: Cast functionCall.args from Record<string, unknown> to the expected type safely.
        return functionCall.args as unknown as BioSummary;
    }
    
    throw new Error("Failed to summarize biography.");
};
