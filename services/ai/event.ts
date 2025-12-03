
import { VenueSuggestion, SocialMediaCopy, StructuredAgenda, BudgetEstimate, EmailSequence } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export const generateEventDescription = async (details: { title: string; date: string; location: string }): Promise<{ description: string }> => {
    try {
        return await invokeEdgeFunction('event-ai', { action: 'generateDescription', details });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock description.");
        return { description: `Join us for ${details.title}, a premier event in ${details.location}. Expect networking, learning, and great conversations.` };
    }
};

export const generateEventTitles = async (baseTitle: string): Promise<{ titles: string[] }> => {
    try {
        return await invokeEdgeFunction('event-ai', { action: 'generateTitles', baseTitle });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock titles.");
        return { titles: [`${baseTitle} 2025`, `${baseTitle} Summit`, `The ${baseTitle} Experience`] };
    }
};

export const suggestVenues = async (eventType: string, city: string): Promise<VenueSuggestion[]> => {
    try {
        return await invokeEdgeFunction('event-ai', { action: 'suggestVenues', eventType, city });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock venues.");
        return [
            { name: "Innovation Hub", reason: "Great for tech events", mapLink: "#" },
            { name: "The Grand Hall", reason: "Capacity for large audiences", mapLink: "#" },
            { name: "Community Center", reason: "Affordable and accessible", mapLink: "#" }
        ];
    }
};

export const generateSocialMediaCopy = async (details: { title: string; description: string; date: string; location: string }): Promise<SocialMediaCopy> => {
    try {
        return await invokeEdgeFunction('event-ai', { action: 'generateSocialCopy', details });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock social copy.");
        return {
            twitter: `Join us for ${details.title} on ${details.date}! #event #tech`,
            linkedin: `We are excited to announce ${details.title}. A great opportunity for professionals in ${details.location}.`,
            instagram: `Coming soon: ${details.title}! 🚀 Don't miss out.`
        };
    }
};

export const structureAgenda = async (rawAgenda: string, eventDate: string): Promise<StructuredAgenda> => {
    try {
        return await invokeEdgeFunction('event-ai', { action: 'structureAgenda', rawAgenda, eventDate });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock agenda.");
        return {
            schedule: [
                { time: "09:00 AM", topic: "Registration", speaker: "" },
                { time: "10:00 AM", topic: "Keynote", speaker: "Guest Speaker" },
                { time: "12:00 PM", topic: "Lunch", speaker: "" }
            ]
        };
    }
};

export const estimateBudget = async (totalBudget: number, attendees: number, eventContext: string): Promise<BudgetEstimate> => {
    try {
        return await invokeEdgeFunction('event-ai', { action: 'estimateBudget', totalBudget, attendees, eventContext });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock budget.");
        return {
            total: totalBudget,
            perHead: totalBudget / attendees,
            items: [
                { category: "Venue", amount: totalBudget * 0.4, notes: "Estimated rental" },
                { category: "Catering", amount: totalBudget * 0.3, notes: "Food & Drink" },
                { category: "Marketing", amount: totalBudget * 0.1, notes: "Ads & Promo" }
            ]
        };
    }
};

export const generateEmailSequence = async (details: { title: string; description: string; date: string; location: string }): Promise<EmailSequence> => {
    try {
        return await invokeEdgeFunction('event-ai', { action: 'generateEmailSequence', details });
    } catch (error) {
        console.warn("Edge Function failed. Returning mock emails.");
        return {
            invitation: { subject: `You're invited to ${details.title}`, body: `Hi there,\n\nWe'd love to see you at ${details.title} on ${details.date}.` },
            reminder: { subject: `Reminder: ${details.title} is coming up`, body: `Don't forget, ${details.title} is happening soon!` },
            followUp: { subject: `Thanks for attending ${details.title}`, body: `It was great to have you. Let's keep in touch.` }
        };
    }
};
