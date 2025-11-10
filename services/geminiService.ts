import { GoogleGenAI, GenerateContentResponse, Type, Modality, FunctionDeclaration } from "@google/genai";
import { Slide, ChartData, TableData } from '../data/decks';
import { templates } from "../styles/templates";

// As per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Type Definitions ---
export interface DeckGenerationResult {
    title: string;
    slides: {
        id: string;
        title: string;
        content: string;
        imageUrl?: string;
        type: Slide['type'];
    }[];
}

export interface SlideAnalysis {
    clarity: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
    impact: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
    tone: { rating: 'Good' | 'Average' | 'Needs Improvement'; feedback: string };
}

export interface ResearchResult {
    summary: string;
    sources: { uri: string; title: string }[];
}

export interface ExtractedMetric {
    label: string;
    value: string;
}

export interface BioSummary {
    summary: string;
    highlights: string[];
}


// --- Function Declarations ---

const generateDeckOutlineFunctionDeclaration: FunctionDeclaration = {
    name: 'generateDeckOutline',
    description: 'Generates a structured 10-slide pitch deck outline with a title and slide content.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'A compelling title for the entire pitch deck.' },
            slides: {
                type: Type.ARRAY,
                description: 'An array of slide objects, typically 8-12 slides for a standard pitch deck.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING, description: 'A unique identifier for the slide (e.g., "slide-1")' },
                        title: { type: Type.STRING, description: 'The title of the slide.' },
                        content: { type: Type.STRING, description: 'Bulleted list of content points, separated by newlines.' },
                        imageUrl: { type: Type.STRING, description: '(Optional) A relevant search query for a background image.' },
                        type: { type: Type.STRING, description: "The semantic type of the slide for context-aware features. Can be one of: 'vision', 'problem', 'solution', 'market', 'product', 'traction', 'competition', 'team', 'ask', 'roadmap', 'generic'." },
                    },
                    required: ['id', 'title', 'content', 'type'],
                },
            },
        },
        required: ['title', 'slides'],
    },
};

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

const getSuggestionsFunctionDeclaration: FunctionDeclaration = {
    name: 'getSuggestions',
    description: 'Generates three distinct suggestions for each category: improving slide content (copilot), image prompts, and research queries.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            copilotSuggestions: {
                type: Type.ARRAY,
                description: 'Three short, actionable prompts for the AI copilot to improve the slide.',
                items: { type: Type.STRING }
            },
            imageSuggestions: {
                type: Type.ARRAY,
                description: 'Three creative prompts to generate a relevant image for the slide.',
                items: { type: Type.STRING }
            },
            researchSuggestions: {
                type: Type.ARRAY,
                description: 'Three relevant web search queries to find data or context for the slide.',
                items: { type: Type.STRING }
            }
        },
        required: ['copilotSuggestions', 'imageSuggestions', 'researchSuggestions'],
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


const generateRoadmapSlideFunctionDeclaration: FunctionDeclaration = {
    name: 'generateRoadmapSlide',
    description: 'Generates a new roadmap slide with a title, content, and image prompt.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'The title for the roadmap slide.' },
            content: { type: Type.STRING, description: 'Bulleted list of roadmap items, separated by newlines.' },
            imageUrl: { type: Type.STRING, description: 'A search query for a background image.' }
        },
        required: ['title', 'content', 'imageUrl']
    }
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

export const generateDeckContent = async (companyDetails: string): Promise<DeckGenerationResult> => {
    const prompt = `Based on the following company details, generate a compelling 10-slide pitch deck outline. You must classify each slide by its purpose (e.g., 'problem', 'solution', 'market'). The output must be a function call to 'generateDeckOutline'.\n\nCompany Details:\n${companyDetails}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [generateDeckOutlineFunctionDeclaration] }],
        },
    });

    const functionCall = response.functionCalls?.[0];
    if (functionCall?.name === 'generateDeckOutline' && functionCall.args) {
        // FIX: Cast functionCall.args from Record<string, unknown> to the expected type safely.
        return functionCall.args as unknown as DeckGenerationResult;
    }

    throw new Error("Failed to generate deck outline. The AI did not return the expected structure.");
};

export const generateDeckFromUrls = async (urls: string[]): Promise<DeckGenerationResult> => {
    const prompt = `You are a pitch deck expert. Analyze the content from the provided URLs and generate a complete 10-slide pitch deck by calling the 'generateDeckOutline' function. Extract the company overview, problem, solution, market, traction, and competitors.

    URLs to analyze:
    ${urls.join('\n')}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
            tools: [{ urlContext: {} }, { functionDeclarations: [generateDeckOutlineFunctionDeclaration] }],
        }
    });

    // ADDED: Check for URL retrieval errors as per best practices
    const metadata = response.candidates?.[0]?.urlContextMetadata;
    // FIX: The `urlContextMetadata` object contains a `urlMetadata` array property. The property name was misspelled as `urlMetadatas`.
    if (metadata && metadata.urlMetadata) {
        // FIX: Corrected property 'status' to 'urlRetrievalStatus' to match Gemini API response.
        const failedUrls = metadata.urlMetadata
            .filter(meta => meta.urlRetrievalStatus !== 'URL_RETRIEVAL_STATUS_SUCCESS')
            // FIX: The property for the URL on UrlMetadata is `url`, not `uri`.
            .map(meta => meta.url);

        if (failedUrls.length > 0) {
            throw new Error(`Failed to retrieve content from the following URLs: ${failedUrls.join(', ')}. Please ensure they are public and accessible.`);
        }
    }

    const functionCall = response.functionCalls?.[0];
    if (functionCall?.name === 'generateDeckOutline' && functionCall.args) {
        return functionCall.args as unknown as DeckGenerationResult;
    }

    throw new Error("Failed to generate deck from URLs. The AI did not return the expected structure.");
};

export const generateSlideImage = async (slideTitle: string, slideContent: string, promptOverride?: string): Promise<string> => {
    const prompt = promptOverride || `A professional, visually appealing image for a presentation slide titled "${slideTitle}" with the key message: "${slideContent.split('\n')[0]}". The style should be modern and clean.`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    
    throw new Error("Image generation failed.");
};

export const editSlideImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType,
                    },
                },
                {
                    text: prompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("Image editing failed.");
};

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

export const fetchAllSuggestions = async (slide: Slide): Promise<{ copilotSuggestions: string[]; imageSuggestions: string[]; researchSuggestions: string[] }> => {
    let prompt = `For a slide titled "${slide.title}" with content:\n${slide.content}\n\nGenerate 3 suggestions for each of the following categories: Copilot actions, image generation prompts, and research queries. The output must be a function call to 'getSuggestions'.`;

    // Add context-specific instructions based on the slide type
    switch (slide.type) {
        case 'solution':
            prompt += `\nSince this is a "solution" slide, Copilot suggestions should include "Rewrite to focus on benefits" and "Summarize into 3 core pillars". Image suggestions should include a prompt for a "How it Works" workflow diagram.`;
            break;
        case 'product':
             prompt += `\nSince this is a "product" slide, Copilot suggestions should include "Simplify technical language" and "Format as a numbered list".`;
            break;
        case 'traction':
             prompt += `\nSince this is a "traction" slide, Copilot suggestions should include "Highlight key metrics" and "Format as a testimonial".`;
            break;
         case 'competition':
             prompt += `\nSince this is a "competition" slide, Copilot suggestions should include "Create a 'Why We Win' summary", and Image suggestions should include a detailed prompt for a "2x2 competitive matrix diagram".`;
            break;
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [getSuggestionsFunctionDeclaration] }],
            },
        });

        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'getSuggestions' && functionCall.args) {
            return functionCall.args as { copilotSuggestions: string[]; imageSuggestions: string[]; researchSuggestions: string[] };
        }
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
    
    // Fallback in case of error or invalid response
    return {
        copilotSuggestions: ['Make it more concise', 'Add a statistic', 'Change the tone to be more formal'],
        imageSuggestions: ['A modern office space', 'Team collaborating on a project', 'Upward trending graph'],
        researchSuggestions: [`Market size for ${slide.title}`, `Competitors for ${slide.title}`, `Latest trends in ${slide.title}`]
    };
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

export const generateRoadmapSlide = async (companyContext: string, template: keyof typeof templates): Promise<Slide> => {
    const prompt = `Based on this company context: "${companyContext}", generate a forward-looking product roadmap slide for the next 4 quarters. The output must be a function call to 'generateRoadmapSlide'.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ functionDeclarations: [generateRoadmapSlideFunctionDeclaration] }],
        },
    });

    const functionCall = response.functionCalls?.[0];
    if (functionCall?.name === 'generateRoadmapSlide' && functionCall.args) {
        // FIX: Cast functionCall.args to get typed properties for title, content, and imageUrl.
        const { title, content, imageUrl } = functionCall.args as unknown as { title: string; content: string; imageUrl: string };
        return {
            id: `slide-${Date.now()}`,
            title,
            content,
            imageUrl,
            template,
            type: 'roadmap',
        };
    }

    throw new Error("Failed to generate roadmap slide.");
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
