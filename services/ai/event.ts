
import { VenueSuggestion, SocialMediaCopy, StructuredAgenda, BudgetEstimate, EmailSequence } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const generateEventDescription = async (details: { title: string; date: string; location: string }): Promise<{ description: string }> => {
    return invokeEdgeFunction('generate-event-description', {
        ...details,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high' // High reasoning for creative writing
        }
    });
};

export const generateEventTitles = async (baseTitle: string): Promise<{ titles: string[] }> => {
    return invokeEdgeFunction('generate-event-titles', { 
        baseTitle,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high' // High reasoning for creative titles
        }
    });
};

export const suggestVenues = async (eventType: string, city: string): Promise<VenueSuggestion[]> => {
    return invokeEdgeFunction('suggest-venues', { 
        eventType, 
        city,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high' // Reasoning required for location matching
        }
    });
};

export const generateSocialMediaCopy = async (details: { title: string; description: string; date: string; location: string }): Promise<SocialMediaCopy> => {
    return invokeEdgeFunction('generate-social-copy', {
        ...details,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high' // Creative task
        }
    });
};

export const structureAgenda = async (rawAgenda: string, eventDate: string): Promise<StructuredAgenda> => {
    return invokeEdgeFunction('structure-agenda', { 
        rawAgenda, 
        eventDate,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high' // Upgraded to high thinking for complex unstructured text analysis
        }
    });
};

export const estimateBudget = async (totalBudget: number, attendees: number, eventContext: string): Promise<BudgetEstimate> => {
    return invokeEdgeFunction('estimate-budget', {
        totalBudget,
        attendees,
        eventContext,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high', // Critical reasoning/math task
            tools: ['code_execution'] // Enable code execution for accurate calculations
        }
    });
};

export const generateEmailSequence = async (details: { title: string; description: string; date: string; location: string }): Promise<EmailSequence> => {
    return invokeEdgeFunction('generate-email-sequence', {
        ...details,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high' // Creative task
        }
    });
};
