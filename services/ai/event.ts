
import { VenueSuggestion, SocialMediaCopy, StructuredAgenda, BudgetEstimate, EmailSequence } from './types';
import { edgeClient } from './edgeClient';
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
    const prompt = `
    You are a Senior Event Marketer.
    
    **Task:** Write a compelling, high-conversion event description.
    **Event Details:**
    - Title: ${details.title}
    - Date: ${details.date}
    - Location: ${details.location}
    
    **Instructions:**
    - Start with a strong hook.
    - Clearly articulate the value proposition (WIIFM - What's In It For Me).
    - End with a clear Call to Action.
    - Tone: Professional yet exciting.
    
    Call 'generateEventDescription' with the result.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
    const prompt = `
    You are a Copywriting Expert.
    
    **Task:** Brainstorm 3 creative, engaging alternative titles for an event currently named "${baseTitle}".
    
    **Goal:** Make them catchy, memorable, and optimized for clicks. Avoid generic phrasing.
    
    Call 'generateEventTitles' with the results.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
    const prompt = `
    You are an Expert Event Planner in ${city}.
    
    **Task:** Suggest 3 specific, real-world venues suitable for a "${eventType}".
    
    **Requirements:**
    - Venues must be real places.
    - Provide a specific reason why each is good for this event type (e.g., "Great acoustics", "Intimate vibe").
    - Include a map link if possible.
    
    Call 'suggestVenues' with the results.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
    const prompt = `
    You are a Social Media Manager.
    
    **Task:** Create a promotional kit for this event:
    - Title: ${details.title}
    - Description: ${details.description}
    - When: ${details.date}
    - Where: ${details.location}
    
    **Requirements:**
    - **Twitter:** Short, punchy, under 280 chars, include hashtags.
    - **LinkedIn:** Professional, value-focused, engaging.
    - **Instagram:** Visual, emoji-rich, "link in bio" CTA.
    
    Call 'generateSocialMediaCopy' with the results.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
    const prompt = `
    You are an Event Operations Specialist.
    
    **Task:** Transform this raw note into a professional, structured run-of-show.
    **Event Date:** ${eventDate}
    **Raw Input:** "${rawAgenda}"
    
    **Instructions:**
    - Standardize time formats (e.g., "6:00 PM").
    - Ensure logical flow.
    - Identify speakers if mentioned.
    
    Call 'structureAgenda' with the result.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
    const prompt = `
    You are an Event Producer.
    
    **Task:** Create a realistic budget allocation.
    **Total Budget:** $${totalBudget}
    **Attendees:** ${attendees}
    **Context:** ${eventContext}
    
    **Thinking:**
    - Consider standard industry ratios (e.g., Food & Bev is usually ~30-40%).
    - Ensure specific line items match the event context (e.g., "AV Equipment" for a talk).
    
    Call 'generateBudget' with the estimates.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
    const prompt = `
    You are an Email Marketing Specialist.
    
    **Task:** Write a 3-part email sequence to maximize attendance.
    **Event:** ${details.title}
    
    **Sequence:**
    1. **Invitation:** Exciting, persuasive.
    2. **Reminder:** Urgent, practical (include logistics).
    3. **Follow-up:** Grateful, resource-sharing (post-event).
    
    Call 'generateEmailSequence' with the result.
    `;

    try {
        const response = await edgeClient.models.generateContent({
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
