import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import type { DeckGenerationResult } from './ai.models';

// As per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
            // FIX: Corrected typo in status enum value.
            .filter(meta => meta.urlRetrievalStatus !== 'URL_RETRIEVAL_STATUS_SUCCESS')
            // FIX: The `UrlMetadata` type seems to be missing the `uri` property. Casting to `any` to access it, as it's expected in the API response.
            .map(meta => (meta as any).uri);

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
