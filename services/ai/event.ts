
import { GoogleGenAI } from "@google/genai";
import { VenueSuggestion, SocialMediaCopy, StructuredAgenda, BudgetEstimate, EmailSequence } from './types';
import { 
    generateBudgetFunctionDeclaration,
    generateEmailSequenceFunctionDeclaration,
    generateEventDescriptionFunctionDeclaration,
    generateEventTitlesFunctionDeclaration,
    generateSocialMediaCopyFunctionDeclaration,
    structureAgendaFunctionDeclaration,
    suggestVenuesFunctionDeclaration
} from './prompts';

export const generateEventDescription = async (details: { title: string; date: string; location: string }): Promise<{ description: string }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Generate a compelling one-paragraph event description for the following event.
    Title: ${details.title}
    Date: ${details.date}
    Location: ${details.location}
    Call 'generateEventDescription' with the result.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateEventDescriptionFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateEventDescription' && call.args) {
            const args = call.args as any;
            return { description: args.description };
        }
        throw new Error("AI did not return event description.");
    } catch (error) {
        console.error("Error generating description:", error);
        throw new Error("Failed to generate event description.");
    }
};

export const generateEventTitles = async (baseTitle: string): Promise<{ titles: string[] }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Generate 3 creative and engaging alternative titles for an event named "${baseTitle}".
    Call 'generateEventTitles' with the results.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateEventTitlesFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 1024 }
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateEventTitles' && call.args) {
            const args = call.args as any;
            return { titles: args.titles || [] };
        }
        throw new Error("AI did not return titles.");
    } catch (error) {
        console.error("Error generating titles:", error);
        throw new Error("Failed to generate titles.");
    }
};

export const suggestVenues = async (eventType: string, city: string): Promise<VenueSuggestion[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Suggest suitable venues for a "${eventType}" in "${city}".
    Provide the venue name, a reason for the suggestion, and if possible a map link.
    Call 'suggestVenues' with the results.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [suggestVenuesFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'suggestVenues' && call.args) {
            const args = call.args as any;
            return args.venues || [];
        }
        return [];
    } catch (error) {
        console.error("Error suggesting venues:", error);
        return [];
    }
};

export const generateSocialMediaCopy = async (details: { title: string; description: string; date: string; location: string }): Promise<SocialMediaCopy> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Generate promotional copy for Twitter, LinkedIn, and Instagram for this event:
    Title: ${details.title}
    Description: ${details.description}
    When: ${details.date}
    Where: ${details.location}
    Call 'generateSocialMediaCopy' with the results.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateSocialMediaCopyFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateSocialMediaCopy' && call.args) {
            return call.args as unknown as SocialMediaCopy;
        }
        throw new Error("AI did not return social copy.");
    } catch (error) {
        console.error("Error generating social copy:", error);
        throw new Error("Failed to generate social media copy.");
    }
};

export const structureAgenda = async (rawAgenda: string, eventDate: string): Promise<StructuredAgenda> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Format the following raw agenda text into a structured schedule. The event is on ${eventDate}.
    Raw Text: "${rawAgenda}"
    Call 'structureAgenda' with the result.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [structureAgendaFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'structureAgenda' && call.args) {
            return call.args as unknown as StructuredAgenda;
        }
        throw new Error("AI did not return agenda.");
    } catch (error) {
        console.error("Error structuring agenda:", error);
        throw new Error("Failed to structure agenda.");
    }
};

export const estimateBudget = async (totalBudget: number, attendees: number, eventContext: string): Promise<BudgetEstimate> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Estimate budget allocation for an event with total budget $${totalBudget} and ${attendees} attendees.
    Context: ${eventContext}.
    Call 'generateBudget' with the estimates.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateBudgetFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateBudget' && call.args) {
            return call.args as unknown as BudgetEstimate;
        }
        throw new Error("AI did not return budget.");
    } catch (error) {
        console.error("Error estimating budget:", error);
        throw new Error("Failed to estimate budget.");
    }
};

export const generateEmailSequence = async (details: { title: string; description: string; date: string; location: string }): Promise<EmailSequence> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Generate a 3-part email sequence (Invitation, Reminder, Follow-up) for this event:
    Title: ${details.title}
    Description: ${details.description}
    Date: ${details.date}
    Location: ${details.location}
    Call 'generateEmailSequence' with the result.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateEmailSequenceFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateEmailSequence' && call.args) {
            return call.args as unknown as EmailSequence;
        }
        throw new Error("AI did not return emails.");
    } catch (error) {
        console.error("Error generating emails:", error);
        throw new Error("Failed to generate emails.");
    }
};
