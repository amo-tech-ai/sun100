import { GoogleGenAI } from '@google/genai';
import { ResearchResult } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const researchTopic = async (query: string): Promise<ResearchResult> => {
    const model = 'gemini-2.5-flash';
    const prompt = `Provide a concise summary for the query: "${query}". Include a list of sources used.`;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const summary = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
            .filter(chunk => chunk.web && chunk.web.uri)
            .map(chunk => ({
                title: chunk.web!.title || chunk.web!.uri!,
                uri: chunk.web!.uri!
            }));

        return { summary, sources };
    } catch (error) {
        console.error("Error researching topic:", error);
        throw new Error("Failed to perform research.");
    }
};
