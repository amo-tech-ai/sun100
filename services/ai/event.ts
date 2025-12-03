import { VenueSuggestion, SocialMediaCopy, StructuredAgenda, BudgetEstimate, EmailSequence } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const generateEventDescription = async (details: { title: string; date: string; location: string }): Promise<{ description: string }> => {
    return invokeEdgeFunction('event-ai', { action: 'generateDescription', details });
};

export const generateEventTitles = async (baseTitle: string): Promise<{ titles: string[] }> => {
    return invokeEdgeFunction('event-ai', { action: 'generateTitles', baseTitle });
};

export const suggestVenues = async (eventType: string, city: string): Promise<VenueSuggestion[]> => {
    return invokeEdgeFunction('event-ai', { action: 'suggestVenues', eventType, city });
};

export const generateSocialMediaCopy = async (details: { title: string; description: string; date: string; location: string }): Promise<SocialMediaCopy> => {
    return invokeEdgeFunction('event-ai', { action: 'generateSocialCopy', details });
};

export const structureAgenda = async (rawAgenda: string, eventDate: string): Promise<StructuredAgenda> => {
    return invokeEdgeFunction('event-ai', { action: 'structureAgenda', rawAgenda, eventDate });
};

export const estimateBudget = async (totalBudget: number, attendees: number, eventContext: string): Promise<BudgetEstimate> => {
    return invokeEdgeFunction('event-ai', { action: 'estimateBudget', totalBudget, attendees, eventContext });
};

export const generateEmailSequence = async (details: { title: string; description: string; date: string; location: string }): Promise<EmailSequence> => {
    return invokeEdgeFunction('event-ai', { action: 'generateEmailSequence', details });
};
