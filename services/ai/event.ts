import { GoogleGenAI } from '@google/genai';
import { VenueSuggestion, SocialMediaCopy, StructuredAgenda, AgendaItem } from './types';
import { 
    generateEventDescriptionFunctionDeclaration, 
    generateEventTitlesFunctionDeclaration,
    generateSocialMediaCopyFunctionDeclaration,
    structureAgendaFunctionDeclaration
} from './prompts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEventDescription = async (details: { title: string; date: string; location: string }): Promise<{ description: string }> => {
    const prompt = `Write a compelling one-paragraph description for an event titled "${details.title}" on ${details.date} at ${details.location}. Call 'generateEventDescription' with the result.`;
    
    try {
        const response = await ai.models.generateContent({ 
            model: 'gemini-2.5-pro', 
            contents: prompt,
            config: { tools: [{ functionDeclarations: [generateEventDescriptionFunctionDeclaration] }] }
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'generateEventDescription' && functionCall.args?.description != null) {
            const value = functionCall.args.description;
            // The value can be a number, string, or boolean. Check for null and convert.
            return { description: value.toString() };
        }
        throw new Error("AI did not generate a description.");
    } catch (error) {
        console.error("Error generating event description:", error);
        throw new Error("Failed to generate event description.");
    }
};

export const generateEventTitles = async (baseTitle: string): Promise<{ titles: string[] }> => {
    const prompt = `Based on the title "${baseTitle}", generate 3 creative alternatives using the 'generateEventTitles' function.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: { tools: [{ functionDeclarations: [generateEventTitlesFunctionDeclaration] }] }
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'generateEventTitles' && Array.isArray(functionCall.args?.titles)) {
            return { titles: functionCall.args.titles as string[] };
        }
        throw new Error("The AI did not suggest titles as expected.");
    } catch (error) {
        console.error("Error generating event titles:", error);
        throw new Error("Failed to generate event titles.");
    }
};

export const suggestVenues = async (eventType: string, city: string): Promise<VenueSuggestion[]> => {
    const model = 'gemini-2.5-flash';
    const prompt = `You are an expert event planner. For an event of type "${eventType}" in "${city}", suggest 3 suitable venues. For each venue, provide its name and a brief, one-sentence reason why it's a good choice.
    Return your response as a valid JSON object with a single key "venues", which is an array of objects. Each object should have "name" and "reason" properties. Do not include any text outside of the JSON object. Do not use markdown backticks.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                 responseMimeType: 'application/json',
            },
        });

        let venues: VenueSuggestion[] = [];
        try {
            const parsedResult = JSON.parse(response.text);
            venues = parsedResult.venues || [];
        } catch (e) {
            console.error("Failed to parse AI response for venues as JSON:", response.text, e);
            throw new Error("The AI returned an invalid format for venues.");
        }
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        if (venues.length > 0 && groundingChunks.length > 0) {
            return venues.map(venue => {
                const matchingChunk = groundingChunks.find(chunk => 
                    chunk.maps?.title && venue.name.toLowerCase().includes(chunk.maps.title.toLowerCase())
                );
                return matchingChunk?.maps?.uri ? { ...venue, mapLink: matchingChunk.maps.uri } : venue;
            });
        }
        
        return venues;

    } catch (error) {
        console.error("Error suggesting venues:", error);
        throw new Error("Failed to suggest venues.");
    }
};

export const generateSocialMediaCopy = async (details: { title: string; description: string; date: string; location: string }): Promise<SocialMediaCopy> => {
    const prompt = `For an event titled "${details.title}", generate promotional copy for Twitter, LinkedIn, and Instagram by calling the 'generateSocialMediaCopy' function.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: { tools: [{ functionDeclarations: [generateSocialMediaCopyFunctionDeclaration] }] }
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'generateSocialMediaCopy' && functionCall.args) {
            return functionCall.args as unknown as SocialMediaCopy;
        }
        throw new Error("The AI did not generate social media copy as expected.");
    } catch (error) {
        console.error("Error generating social media copy:", error);
        throw new Error("Failed to generate social media copy.");
    }
};

export const structureAgenda = async (rawAgenda: string, eventDate: string): Promise<StructuredAgenda> => {
    const prompt = `Structure the following raw text for an event schedule into a timed agenda using the 'structureAgenda' function. The event is on ${new Date(eventDate).toLocaleDateString()}. Raw Agenda: "${rawAgenda}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: { tools: [{ functionDeclarations: [structureAgendaFunctionDeclaration] }] }
        });
        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'structureAgenda' && functionCall.args?.schedule) {
            return { schedule: functionCall.args.schedule as AgendaItem[] };
        }
        throw new Error("The AI did not generate a structured agenda as expected.");
    } catch (error) {
        console.error("Error structuring agenda:", error);
        throw new Error("Failed to structure the event agenda.");
    }
};
