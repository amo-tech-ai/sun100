
import { GoogleGenAI, Type } from "@google/genai";
import { Deck, Slide } from '../data/decks';
import { templates } from '../styles/templates';

// This file was restored. It now contains the core AI logic for deck generation.

// In a real app, this would be a secure environment variable.
// For this context, we assume process.env.API_KEY is available.
let ai: GoogleGenAI;
try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
} catch (e) {
    console.error("Gemini API key not found. AI features will be disabled.", e);
}


const deckSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'A catchy, professional title for the entire pitch deck.' },
    slides: {
      type: Type.ARRAY,
      description: 'An array of exactly 10 slide objects.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'The title of the slide.' },
          content: { type: Type.STRING, description: 'The main content of the slide, formatted as bullet points separated by newlines. Each bullet point should start on a new line.' },
          imageUrl: { type: Type.STRING, description: 'A descriptive, creative prompt for an AI image generator to create a relevant visual for this slide.' },
          type: { 
            type: Type.STRING, 
            description: "The type of slide (e.g., 'vision', 'problem', 'solution', 'market', 'product', 'traction', 'competition', 'team', 'ask', 'roadmap', 'generic')."
          }
        },
        required: ['title', 'content', 'imageUrl', 'type']
      }
    }
  },
  required: ['title', 'slides']
};


export const generateFullDeck = async ({ text, urls, fileContext, template }: { text?: string; urls?: string[], fileContext?: any, template?: keyof typeof templates }): Promise<Omit<Deck, 'id'>> => {
    if (!ai) {
        throw new Error("AI Service is not initialized. Please check your API key.");
    }

    let prompt = `You are a world-class venture capital analyst and startup consultant. Your task is to generate a complete, investor-ready 10-slide pitch deck based on the provided business context. The tone should be professional, confident, and compelling.

    **Business Context:**
    `;

    if (text) {
        prompt += text;
    } else if (urls && urls.length > 0) {
        prompt += `Generate the deck based on the content of these URLs: ${urls.join(', ')}`;
    } else {
        throw new Error("No context provided for deck generation.");
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: deckSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const deckData = JSON.parse(jsonText) as { title: string; slides: Omit<Slide, 'id'>[] };
        
        if (!deckData || !deckData.title || !Array.isArray(deckData.slides) || deckData.slides.length === 0) {
            throw new Error("AI returned invalid or empty deck structure.");
        }
        
        const newDeck: Omit<Deck, 'id'> = {
            title: deckData.title,
            template: template || 'default',
            slides: deckData.slides.map(s => ({ ...s, id: `slide-${crypto.randomUUID()}` })),
        };

        return newDeck;

    } catch (err) {
        console.error("Error during AI deck generation:", err);
        if (err instanceof Error && err.message.includes('API key not valid')) {
             throw new Error("The provided Gemini API key is not valid. Please check your configuration.");
        }
        throw new Error("The AI failed to generate the pitch deck. It might be due to a content safety policy or an issue with the provided context. Please try again with a different prompt.");
    }
};
