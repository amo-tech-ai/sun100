import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { Slide } from '../data/decks';

// As per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const slideSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: 'A unique identifier for the slide (e.g., "slide-1")' },
        title: { type: Type.STRING, description: 'The title of the slide.' },
        content: { type: Type.STRING, description: 'Bulleted list of content points, separated by newlines.' },
        imageUrl: { type: Type.STRING, description: '(Optional) A relevant search query for a background image for Unsplash API.' },
    },
    required: ['id', 'title', 'content'],
};

const deckSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A compelling title for the entire pitch deck.' },
        slides: {
            type: Type.ARRAY,
            items: slideSchema,
            description: 'An array of slide objects, typically 8-12 slides for a standard pitch deck.'
        },
    },
    required: ['title', 'slides'],
};

export interface DeckGenerationResult {
    title: string;
    slides: Omit<Slide, 'imageUrl'> & { imageUrl?: string }[];
}

export const generateDeckContent = async (companyDetails: string): Promise<DeckGenerationResult> => {
    try {
        const prompt = `
            Based on the following company details, generate a compelling 10-slide pitch deck.
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
            Return the response as a JSON object matching the provided schema.
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: deckSchema,
            },
        });

        const jsonStr = response.text.trim();
        const deckData: DeckGenerationResult = JSON.parse(jsonStr);
        
        if (!deckData.title || !Array.isArray(deckData.slides)) {
            throw new Error("Invalid format received from Gemini API.");
        }
        
        return deckData;
    } catch (error) {
        console.error("Error generating deck content with Gemini:", error);
        throw new Error("Failed to generate pitch deck. Please try again.");
    }
};

export const generateSlideImage = async (prompt: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: `Generate a visually appealing, professional image for a business pitch deck slide with the following theme: ${prompt}` }],
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

        throw new Error("No image data found in the API response.");

    } catch (error) {
        console.error("Error generating slide image with Gemini:", error);
        throw new Error("Failed to generate slide image. Please check the prompt or try again.");
    }
};

export interface ModifiedSlideContent {
    newTitle: string;
    newContent: string;
}

const modifiedSlideSchema = {
    type: Type.OBJECT,
    properties: {
        newTitle: { type: Type.STRING, description: 'The revised, improved title for the slide.' },
        newContent: { type: Type.STRING, description: 'The revised, improved bullet points for the slide, separated by newlines.' },
    },
    required: ['newTitle', 'newContent'],
};

export const modifySlideContent = async (
    originalTitle: string,
    originalContent: string,
    instruction: string
): Promise<ModifiedSlideContent> => {
    try {
        const prompt = `
            You are an expert pitch deck editor. Your task is to revise a slide based on a specific instruction.

            **Original Slide Title:**
            "${originalTitle}"

            **Original Slide Content (bullet points):**
            "${originalContent}"

            **Instruction:**
            "${instruction}"

            Please apply the instruction to the original title and content.
            Return only the revised title and content as a JSON object matching the provided schema. Do not add any conversational text.
        `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: modifiedSlideSchema,
            },
        });

        const jsonStr = response.text.trim();
        const modifiedData: ModifiedSlideContent = JSON.parse(jsonStr);

        if (!modifiedData.newTitle || !modifiedData.newContent) {
            throw new Error("Invalid format received from Gemini API for slide modification.");
        }

        return modifiedData;

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

const analysisSchema = {
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
};

export const analyzeSlide = async (title: string, content: string): Promise<SlideAnalysis> => {
    try {
        const prompt = `
            You are a pitch deck coach. Analyze the following slide for its effectiveness.

            **Slide Title:** "${title}"
            **Slide Content:** "${content}"

            Provide a rating ("Good", "Average", "Needs Improvement") and a brief, one-sentence feedback for each of the following categories:
            1.  **Clarity:** Is the message easy to understand?
            2.  **Impact:** Is the content compelling and memorable? Does it use strong language or data?
            3.  **Tone:** Is the tone appropriate for an investor pitch (e.g., confident, professional)?

            Return the analysis as a JSON object matching the provided schema.
        `;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonStr = response.text.trim();
        const analysisData: SlideAnalysis = JSON.parse(jsonStr);

        if (!analysisData.clarity || !analysisData.impact || !analysisData.tone) {
            throw new Error("Invalid format received from Gemini API for slide analysis.");
        }

        return analysisData;

    } catch (error) {
        console.error("Error analyzing slide with Gemini:", error);
        throw new Error("Failed to get slide analysis. Please try again.");
    }
};
