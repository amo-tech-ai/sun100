
import { VenueSuggestion, SocialMediaCopy, StructuredAgenda, BudgetEstimate, EmailSequence } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const generateEventDescription = async (details: { title: string; date: string; location: string }): Promise<{ description: string }> => {
    return invokeEdgeFunction<{ description: string }>('generate-event-description', { details });
};

export const generateEventTitles = async (baseTitle: string): Promise<{ titles: string[] }> => {
    return invokeEdgeFunction<{ titles: string[] }>('generate-event-titles', { baseTitle });
};

export const suggestVenues = async (eventType: string, city: string): Promise<VenueSuggestion[]> => {
    const result = await invokeEdgeFunction<{ venues: VenueSuggestion[] }>('suggest-venues', { eventType, city });
    return result.venues || [];
};

export const generateSocialMediaCopy = async (details: { title: string; description: string; date: string; location: string }): Promise<SocialMediaCopy> => {
    return invokeEdgeFunction<SocialMediaCopy>('generate-social-media-copy', { details });
};

export const structureAgenda = async (rawAgenda: string, eventDate: string): Promise<StructuredAgenda> => {
    return invokeEdgeFunction<StructuredAgenda>('structure-agenda', { rawAgenda, eventDate });
};

export const estimateBudget = async (totalBudget: number, attendees: number, eventContext: string): Promise<BudgetEstimate> => {
    return invokeEdgeFunction<BudgetEstimate>('estimate-budget', { totalBudget, attendees, eventContext });
};

export const generateEmailSequence = async (details: { title: string; description: string; date: string; location: string }): Promise<EmailSequence> => {
    return invokeEdgeFunction<EmailSequence>('generate-email-sequence', { details });
};
