import { VenueSuggestion, SocialMediaCopy, StructuredAgenda, BudgetEstimate, EmailSequence } from './types';
import { edgeClient } from './edgeClient';
import {
    generateEventDescriptionFunctionDeclaration,
    generateEventTitlesFunctionDeclaration,
    suggestVenuesFunctionDeclaration,
    generateSocialMediaCopyFunctionDeclaration,
    structureAgendaFunctionDeclaration,
    generateBudgetFunctionDeclaration,
    generateEmailSequenceFunctionDeclaration
} from './prompts';

export const generateEventDescription = async (details: { title: string; date: string; location: string }): Promise<{ description: string }> => {
    const prompt = `Generate an exciting event description for "${details.title}" in ${details.location} on ${details.date}. Call 'generateEventDescription'.`;
    const response = await edgeClient.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { tools: [{ functionDeclarations: [generateEventDescriptionFunctionDeclaration] }] }
    });
    return { description: response.functionCalls?.[0]?.args?.description as string || '' };
};

export const generateEventTitles = async (baseTitle: string): Promise<{ titles: string[] }> => {
    const prompt = `Suggest 3 creative titles for an event based on: "${baseTitle}". Call 'generateEventTitles'.`;
    const response = await edgeClient.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { tools: [{ functionDeclarations: [generateEventTitlesFunctionDeclaration] }] }
    });
    return { titles: (response.functionCalls?.[0]?.args?.titles as string[]) || [] };
};

export const suggestVenues = async (eventType: string, city: string): Promise<VenueSuggestion[]> => {
    const prompt = `Suggest 3 venues for a "${eventType}" in ${city}. Call 'suggestVenues'.`;
    const response = await edgeClient.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
            tools: [{ googleMaps: {} }, { functionDeclarations: [suggestVenuesFunctionDeclaration] }] 
        }
    });
    return (response.functionCalls?.[0]?.args?.venues as VenueSuggestion[]) || [];
};

export const generateSocialMediaCopy = async (details: { title: string; description: string; date: string; location: string }): Promise<SocialMediaCopy> => {
    const prompt = `Create social media posts for: ${JSON.stringify(details)}. Call 'generateSocialMediaCopy'.`;
    const response = await edgeClient.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { tools: [{ functionDeclarations: [generateSocialMediaCopyFunctionDeclaration] }] }
    });
    return response.functionCalls?.[0]?.args as unknown as SocialMediaCopy;
};

export const structureAgenda = async (rawAgenda: string, eventDate: string): Promise<StructuredAgenda> => {
    const prompt = `Structure this agenda for ${eventDate}: "${rawAgenda}". Call 'structureAgenda'.`;
    const response = await edgeClient.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { tools: [{ functionDeclarations: [structureAgendaFunctionDeclaration] }] }
    });
    return response.functionCalls?.[0]?.args as unknown as StructuredAgenda;
};

export const estimateBudget = async (totalBudget: number, attendees: number, eventContext: string): Promise<BudgetEstimate> => {
    const prompt = `Create a budget for ${attendees} people with $${totalBudget}. Context: ${eventContext}. Call 'generateBudget'.`;
    const response = await edgeClient.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { tools: [{ functionDeclarations: [generateBudgetFunctionDeclaration] }] }
    });
    return response.functionCalls?.[0]?.args as unknown as BudgetEstimate;
};

export const generateEmailSequence = async (details: { title: string; description: string; date: string; location: string }): Promise<EmailSequence> => {
    const prompt = `Write 3 emails (invite, remind, followup) for: ${JSON.stringify(details)}. Call 'generateEmailSequence'.`;
    const response = await edgeClient.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { tools: [{ functionDeclarations: [generateEmailSequenceFunctionDeclaration] }] }
    });
    return response.functionCalls?.[0]?.args as unknown as EmailSequence;
};