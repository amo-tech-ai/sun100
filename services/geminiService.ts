import { GoogleGenAI, GenerateContentResponse, Type, Modality, FunctionDeclaration } from "@google/genai";
import { Slide, ChartData } from '../data/decks';
import { templates } from "../styles/templates";

// As per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Function Declarations (Phase 1 Refactor) ---

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
                    },
                    required: ['id', 'title', 'content'],
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
            newContent: { type: Type.STRING, description: 'The revised, improved bullet points for the slide, separated by newlines.' },
        },
        required: ['newTitle', 'newContent'],
    },
};

const analyzeSlideContentFunctionDeclaration: FunctionDeclaration = {
    name: 'analyzeSlideContent',
    description: 'Analyzes a slide for clarity, impact, and tone, providing a rating and feedback for each.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            clarity: {
                type: Type.OBJECT,
                properties: {
                    rating: { type: Type.STRING, description: 'A single-word rating (e.g., "Good", "Average", "Needs Improvement").' },
                    feedback: { type: Type.STRING, description: 'A brief, one-sentence justification for the clarity rating.' },
                },
                required: ['rating', 'feedback'],
            },
            impact: {
                type: Type.OBJECT,
                properties: {
                    rating: { type: Type.STRING, description: 'A single-word rating (e.g., "Good", "Average", "Needs Improvement").' },
                    feedback: { type: Type.STRING, description: 'A brief, one-sentence justification for the impact rating.' },
                },
                required: ['rating', 'feedback'],
            },
            tone: {
                type: Type.OBJECT,
                properties: {
                    rating: { type: Type.STRING, description: 'A single-word rating (e.g., "Good", "Average", "Needs Improvement").' },
                    feedback: { type: Type.STRING, description: 'A brief, one-sentence justification for the tone rating.' },
                },
                required: ['rating', 'feedback'],
            },
        },
        required: ['clarity', 'impact', 'tone'],
    },
};

const chooseLayoutFunctionDeclaration: FunctionDeclaration = {
    name: 'chooseLayout',
    description: 'Based on the slide content, choose the most appropriate layout style.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            layoutName: {
                type: Type.STRING,
                description: 'The name of the chosen layout. Must be one of: "default", "professional".'
            },
        },
        required: ['layoutName'],
    },
};

const imageBriefFunctionDeclaration: FunctionDeclaration = {
    name: 'imageBrief',
    description: 'Generates a creative brief for an image based on slide content.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            keywords: { type: Type.STRING, description: 'The main subjects of the image, e.g., "team collaborating".' },
            style: { type: Type.STRING, description: 'The visual style, e.g., "photorealistic", "minimalist illustration".' },
            palette: { type: Type.STRING, description: 'The desired color palette, e.g., "warm and inviting", "professional blues".' },
            composition: { type: Type.STRING, description: 'A brief description of the shot, e.g., "wide angle shot", "close-up".' },
        },
        required: ['keywords', 'style', 'palette', 'composition'],
    },
};

const suggestImprovementsFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestImprovements',
    description: 'Generates a list of 3-5 short, actionable suggestions to improve a slide.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            suggestions: {
                type: Type.ARRAY,
                description: 'An array of short, actionable suggestion strings (e.g., "Make it more concise", "Add a success metric").',
                items: { type: Type.STRING },
            },
        },
        required: ['suggestions'],
    },
};

const suggestImagePromptsFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestImagePrompts',
    description: 'Generates a list of 3-5 short, creative image prompt ideas to visually enhance a slide.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            prompts: {
                type: Type.ARRAY,
                description: 'An array of short, creative image prompt strings (e.g., "Use a futuristic background", "Incorporate a pastel palette").',
                items: { type: Type.STRING },
            },
        },
        required: ['prompts'],
    },
};

const suggestResearchTopicsFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestResearchTopics',
    description: 'Generates a list of 3-5 relevant research topics to add depth and data to a slide.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            topics: {
                type: Type.ARRAY,
                description: 'An array of short, relevant research topic strings (e.g., "Find latest market trends", "Fetch AI funding statistics").',
                items: { type: Type.STRING },
            },
        },
        required: ['topics'],
    },
};

const chartSuggesterFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestChart',
    description: 'Analyzes slide content for data points and suggests a suitable bar chart representation.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            // FIX: Renamed property to 'type' to align with the ChartData interface.
            type: { type: Type.STRING, description: "The type of chart. Must be 'bar'." },
            // FIX: Renamed property to 'data' to align with the ChartData interface.
            data: {
                type: Type.ARRAY,
                description: 'An array of data objects for the chart.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING, description: 'The label for the data point (e.g., a year or category).' },
                        value: { type: Type.NUMBER, description: 'The numerical value for the data point.' },
                    },
                    required: ['label', 'value'],
                },
            },
        },
        // FIX: Updated required properties to match the changes above.
        required: ['type', 'data'],
    },
};


// --- Service Functions ---

export interface DeckGenerationResult {
    title: string;
    slides: Omit<Slide, 'imageUrl'> & { imageUrl?: string }[];
}

export const generateDeckContent = async (companyDetails: string): Promise<DeckGenerationResult> => {
    try {
        const prompt = `
            Based on the following company details, generate a compelling 10-slide pitch deck by calling the 'generateDeckOutline' function.
            The company details are: "${companyDetails}".

            The pitch deck should follow a standard structure:
            1.  **Company Purpose/Vision:** A compelling one-liner.
            2.  **Problem:** Describe the customer's pain point.
            3.  **Solution:** How your product solves this problem.
            4.  **Why Now?:** The market trends making this the right time.
            5.  **Market Size:** The total addressable market (TAM).
            6.  **Product:** How the product works, key features.
            7.  **Team:** Introduce the key team members.
            8.  **Business Model:** How you make money.
            9.  **Competition:** Who are the competitors and what is your advantage.
            10. **Financials/Ask:** Key projections and what you are asking for.

            For each slide, provide a concise title and 2-3 bullet points.
            For the content, separate each bullet point with a newline character (\\n).
            For the 'imageUrl', suggest a simple, descriptive search query for an image that would visually represent the slide's content (e.g., "team working together", "growing market chart", "happy customer").
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateDeckOutlineFunctionDeclaration] }],
            },
        });
        
        const functionCall = response.functionCalls?.[0];

        if (functionCall?.name === 'generateDeckOutline' && functionCall.args) {
            // FIX: Cast function call arguments to 'unknown' first to satisfy TypeScript's type assertion rules.
            const deckData = functionCall.args as unknown as DeckGenerationResult;
             if (!deckData.title || !Array.isArray(deckData.slides)) {
                throw new Error("Invalid data structure in function call arguments.");
            }
            return deckData;
        }

        throw new Error("The AI model did not return the expected function call. Please try again.");

    } catch (error) {
        console.error("Error generating deck content with Gemini:", error);
        throw new Error("Failed to generate pitch deck. Please try again.");
    }
};

export const generateSlideImage = async (title: string, content: string, initialPrompt?: string): Promise<string> => {
    try {
        // Step 1: Generate a creative brief using a function call for structured output.
        const briefPrompt = `
            You are a creative director. Analyze the content of this pitch deck slide and the initial image idea to generate a creative brief for a compelling background image by calling the 'imageBrief' function.
            The image should be professional and align with the slide's message.

            **Slide Title:** "${title}"
            **Slide Content:** "${content}"
            ${initialPrompt ? `**Initial Image Idea:** "${initialPrompt}"` : ''}
        `;

        const briefResponse: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: briefPrompt,
            config: {
                tools: [{ functionDeclarations: [imageBriefFunctionDeclaration] }],
            },
        });

        const briefCall = briefResponse.functionCalls?.[0];
        if (briefCall?.name !== 'imageBrief' || !briefCall.args) {
            throw new Error("Failed to generate a creative brief for the image.");
        }
        const { keywords, style, palette, composition } = briefCall.args as { [key: string]: string };

        // Step 2: Use the structured brief to generate a high-quality prompt for the image model.
        const imagePrompt = `A ${style} image for a business pitch deck. The scene should depict ${keywords}. The composition is a ${composition}, with a ${palette} color palette. The overall mood should be professional and engaging.`;

        const imageResponse: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: imagePrompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const imagePart = imageResponse.candidates?.[0]?.content?.parts?.find(p => !!p.inlineData);

        if (imagePart?.inlineData?.data) {
            return imagePart.inlineData.data;
        }

        throw new Error("The AI model returned an unexpected response after generating the brief.");

    } catch (error) {
        console.error("Error generating slide image with Gemini:", error);
        throw new Error(error instanceof Error ? `Image generation failed: ${error.message}` : "An unknown error occurred during image generation.");
    }
};

export const editSlideImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
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

        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => !!p.inlineData);

        if (imagePart?.inlineData?.data) {
            return imagePart.inlineData.data;
        }

        throw new Error("The AI model returned an unexpected response. Please try a different prompt for editing.");

    } catch (error) {
        console.error("Error editing slide image with Gemini:", error);
        throw new Error(error instanceof Error ? `Image editing failed: ${error.message}` : "An unknown error occurred during image editing.");
    }
};


export interface ModifiedSlideContent {
    newTitle: string;
    newContent: string;
}

export const modifySlideContent = async (
    originalTitle: string,
    originalContent: string,
    instruction: string
): Promise<ModifiedSlideContent> => {
    try {
        const prompt = `
            You are an expert pitch deck editor. Your task is to revise a slide based on a specific instruction by calling the 'rewriteSlide' function.

            **Original Slide Title:**
            "${originalTitle}"

            **Original Slide Content (bullet points):**
            "${originalContent}"

            **Instruction:**
            "${instruction}"

            Please apply the instruction to the original title and content and call the function with the revised text.
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [rewriteSlideFunctionDeclaration] }],
            },
        });
        
        const functionCall = response.functionCalls?.[0];

        if (functionCall?.name === 'rewriteSlide' && functionCall.args) {
            // FIX: Cast function call arguments to 'unknown' first to satisfy TypeScript's type assertion rules.
            const modifiedData = functionCall.args as unknown as ModifiedSlideContent;
            if (!modifiedData.newTitle || typeof modifiedData.newContent === 'undefined') {
                 throw new Error("Invalid data structure in function call arguments for slide modification.");
            }
            return modifiedData;
        }

        throw new Error("The AI model did not return the expected function call for slide modification.");

    } catch (error) {
        console.error("Error modifying slide content with Gemini:", error);
        throw new Error("Failed to modify slide. The AI agent might be busy, please try again.");
    }
};

// --- Analyst Agent ---
export interface SlideAnalysis {
    clarity: { rating: string; feedback: string };
    impact: { rating: string; feedback: string };
    tone: { rating: string; feedback: string };
}


export const analyzeSlide = async (title: string, content: string): Promise<SlideAnalysis> => {
    try {
        const prompt = `
            You are a pitch deck coach. Analyze the following slide for its effectiveness and return the analysis by calling the 'analyzeSlideContent' function.

            **Slide Title:** "${title}"
            **Slide Content:** "${content}"

            Provide a rating ("Good", "Average", "Needs Improvement") and a brief, one-sentence feedback for each of the following categories:
            1.  **Clarity:** Is the message easy to understand?
            2.  **Impact:** Is the content compelling and memorable? Does it use strong language or data?
            3.  **Tone:** Is the tone appropriate for an investor pitch (e.g., confident, professional)?
        `;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [analyzeSlideContentFunctionDeclaration] }],
            },
        });

        const functionCall = response.functionCalls?.[0];

        if (functionCall?.name === 'analyzeSlideContent' && functionCall.args) {
            // FIX: Cast function call arguments to 'unknown' first to satisfy TypeScript's type assertion rules.
            const analysisData = functionCall.args as unknown as SlideAnalysis;
            if (!analysisData.clarity || !analysisData.impact || !analysisData.tone) {
                throw new Error("Invalid format received from Gemini API for slide analysis.");
            }
            return analysisData;
        }
        
        throw new Error("The AI model did not return the expected function call for slide analysis.");

    } catch (error) {
        console.error("Error analyzing slide with Gemini:", error);
        throw new Error("Failed to get slide analysis. Please try again.");
    }
};

// --- Research Agent ---
export interface ResearchResult {
    summary: string;
    sources: {
        uri: string;
        title: string;
    }[];
}

export const researchTopic = async (topic: string): Promise<ResearchResult> => {
    try {
        const prompt = `
            You are a research assistant. Your task is to provide a concise, factual summary on the following topic.
            Topic: "${topic}"
            
            Based on your search, provide a summary of the key findings.
            Do not add any conversational text or introductions like "Here is a summary".
            Just provide the summary directly.
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro", // Using pro for better summarization and grounding
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const summary = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        // FIX: Added a type guard to the filter function to ensure TypeScript correctly infers
        // the type of the `web` object. This resolves an issue where the `sources` array
        // was not strongly typed, causing a downstream error with `uniqueSources`.
        const sources = groundingChunks
            .map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string } => !!(web && web.uri && web.title))
            .map(web => ({ uri: web.uri, title: web.title }));

        // FIX: Replaced source deduplication logic to fix a TypeScript type inference issue.
        // The previous method using `new Map(...).values()` could result in `uniqueSources`
        // being typed as `unknown[]` in some TypeScript configurations.
        // This `filter`/`findIndex` approach is more robust for type inference.
        const uniqueSources = sources.filter((source, index, self) =>
            index === self.findIndex((s) => s.uri === source.uri)
        );
        
        return { summary, sources: uniqueSources };

    } catch (error) {
        console.error("Error researching topic with Gemini:", error);
        throw new Error("Failed to perform research. The AI agent might be busy, please try again.");
    }
};

export const suggestLayout = async (title: string, content: string): Promise<keyof typeof templates> => {
    try {
        const prompt = `
            You are a presentation design expert. Based on the following slide content, choose the best layout to visually represent the information by calling the 'chooseLayout' function.
            
            - A "default" layout is good for mixed content with an image and text side-by-side.
            - A "professional" layout is good for formal, text-heavy, or title slides.

            **Slide Title:** "${title}"
            **Slide Content:** "${content}"
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [chooseLayoutFunctionDeclaration] }],
            },
        });

        const functionCall = response.functionCalls?.[0];

        if (functionCall?.name === 'chooseLayout' && functionCall.args?.layoutName) {
            const layoutName = functionCall.args.layoutName as string;
            if (layoutName in templates) {
                return layoutName as keyof typeof templates;
            }
        }

        throw new Error("The AI model did not suggest a valid layout.");

    } catch (error) {
        console.error("Error suggesting layout with Gemini:", error);
        throw new Error("Failed to suggest a layout. Please try again.");
    }
};

export const suggestChart = async (title: string, content: string): Promise<ChartData | null> => {
    try {
        const prompt = `
            You are a data visualization expert. Analyze the following slide content for numerical data that can be represented as a bar chart. If suitable data is found (at least 2 data points), call the 'suggestChart' function. Otherwise, do not call the function.

            **Slide Title:** "${title}"
            **Slide Content:** "${content}"

            Look for patterns like "Metric: Value", "Category: Amount", or "Year: Number". Extract these into labels and values.
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [chartSuggesterFunctionDeclaration] }],
            },
        });
        
        const functionCall = response.functionCalls?.[0];

        if (functionCall?.name === 'suggestChart' && functionCall.args) {
            const chartResult = functionCall.args as unknown as ChartData;
            // FIX: The property from the function call is now 'data', which matches the 'ChartData' type.
            // This resolves the error "Property 'chartData' does not exist on type 'ChartData'".
            if (chartResult.data?.length > 1) { // Only return if we have a meaningful chart
                // FIX: The property from the function call is now 'data'.
                return { type: 'bar', data: chartResult.data };
            }
        }
        
        return null; // No suitable chart found

    } catch (error) {
        console.error("Error suggesting chart with Gemini:", error);
        throw new Error("Failed to suggest a chart. Please try again.");
    }
};

// --- Suggestion Services ---
const callSuggestionApi = async (prompt: string, tool: FunctionDeclaration): Promise<string[]> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: { tools: [{ functionDeclarations: [tool] }] },
        });

        const functionCall = response.functionCalls?.[0];
        if (functionCall && functionCall.args) {
            const args = functionCall.args as { [key: string]: string[] };
            // The key can be 'suggestions', 'prompts', or 'topics'
            const key = Object.keys(args)[0]; 
            if (key && Array.isArray(args[key])) {
                return args[key];
            }
        }
        return []; // Return empty array if no valid suggestions
    } catch (error) {
        console.error(`Error fetching suggestions with tool ${tool.name}:`, error);
        return []; // Silently fail and return empty array
    }
};

export const suggestImprovements = async (title: string, content: string): Promise<string[]> => {
    const prompt = `Analyze the slide title "${title}" and content "${content}" and call the 'suggestImprovements' function with 3-5 short, actionable suggestions. Examples: "Make it more concise", "Add a success metric", "Reword for investors".`;
    return callSuggestionApi(prompt, suggestImprovementsFunctionDeclaration);
};

export const suggestImagePrompts = async (title: string, content: string): Promise<string[]> => {
    const prompt = `Analyze the slide title "${title}" and content "${content}" and call the 'suggestImagePrompts' function with 3-5 creative and relevant image prompt ideas. Examples: "Add futuristic background", "Use pastel palette", "Match theme to AI concept".`;
    return callSuggestionApi(prompt, suggestImagePromptsFunctionDeclaration);
};

export const suggestResearchTopics = async (title: string, content: string): Promise<string[]> => {
    const prompt = `Analyze the slide title "${title}" and content "${content}" and call the 'suggestResearchTopics' function with 3-5 relevant research topics. Examples: "Find latest market trends", "Fetch AI funding stats", "Get event tech case studies".`;
    return callSuggestionApi(prompt, suggestResearchTopicsFunctionDeclaration);
};