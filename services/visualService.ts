import { GoogleGenAI, Modality, Type, FunctionDeclaration } from "@google/genai";
import { Slide } from '../data/decks';
import { templates } from "../styles/templates";

// As per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Function Declarations ---

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

// --- API Functions ---

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
