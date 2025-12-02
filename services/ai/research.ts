import { ResearchResult } from './types';
import { edgeClient } from './edgeClient';

export const researchTopic = async (query: string): Promise<ResearchResult> => {
    try {
        // For research, we don't strictly need a Function Declaration if we just want text + sources.
        // However, structured output is cleaner.
        // Gemini 2.5 Flash with Google Search returns text and grounding metadata.
        
        const response = await edgeClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        
        const summary = response.text || "No summary generated.";
        
        // Extract sources from grounding metadata
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.map((chunk: any) => {
                if (chunk.web) {
                    return { title: chunk.web.title, uri: chunk.web.uri };
                }
                return null;
            })
            .filter(Boolean) as { title: string, uri: string }[] || [];

        return { summary, sources };

    } catch (error) {
        console.error("Research Error:", error);
        throw new Error("Failed to perform research.");
    }
};