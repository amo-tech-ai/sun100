import { VenueSuggestion, SocialMediaCopy, StructuredAgenda } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const generateEventDescription = async (details: { title: string; date: string; location: string }): Promise<{ description: string }> => {
    return invokeEdgeFunction('generate-event-description', details);
};

export const generateEventTitles = async (baseTitle: string): Promise<{ titles: string[] }> => {
    return invokeEdgeFunction('generate-event-titles', { baseTitle });
};

export const suggestVenues = async (eventType: string, city: string): Promise<VenueSuggestion[]> => {
    return invokeEdgeFunction('suggest-venues', { eventType, city });
};

export const generateSocialMediaCopy = async (details: { title: string; description: string; date: string; location: string }): Promise<SocialMediaCopy> => {
    return invokeEdgeFunction('generate-social-copy', details);
};

export const structureAgenda = async (rawAgenda: string, eventDate: string): Promise<StructuredAgenda> => {
    return invokeEdgeFunction('structure-agenda', { rawAgenda, eventDate });
};