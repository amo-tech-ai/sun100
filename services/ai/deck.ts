
import { Deck, Slide, mockDeck } from '../../data/decks';
import { templates } from '../../styles/templates';
import { DeckUpdateSuggestion, FundingAnalysis } from './types';
import { invokeEdgeFunction } from '../edgeFunctionService';

export interface FinancialSettings {
    industry: string;
    revenueModel: string;
    currentRevenue: string;
    pricePoint: string;
    customerGrowthRate: string;
    costStructure: {
        burnRate: string;
        marketingBudget: string;
    };
    timeHorizon: string;
    currency: string;
    fundingGoal?: string;
}

interface GenerationPayload {
  businessContext: string;
  urls: string[];
  deckType: string;
  theme: keyof typeof templates;
  config?: {
    model: string;
    thinking_level: 'high' | 'low';
  };
  financials?: FinancialSettings;
  companyDetails?: {
    name: string;
    industry: string;
    customerType: string;
    revenueModel: string;
    stage: string;
    traction: string;
    focus: string; 
    teamSize: string;
  };
}

/**
 * Generates a full pitch deck outline using secure Edge Function.
 * Saves to database if user/org context is available, otherwise falls back to sessionStorage.
 */
export const generateFullDeck = async (payload: GenerationPayload): Promise<{ deckId: string }> => {
    // Get user context if available (for database persistence)
    const user = JSON.parse(sessionStorage.getItem('auth_user') || 'null');
    const orgId = JSON.parse(sessionStorage.getItem('current_org_id') || 'null');
    const startupId = payload.companyDetails ? JSON.parse(sessionStorage.getItem('current_startup_id') || 'null') : null;
    
    // Prepare payload with user context
    const payloadWithContext = {
        ...payload,
        orgId: orgId,
        userId: user?.id,
        startupId: startupId,
        urls: payload.urls || []
    };
    
    const result = await invokeEdgeFunction<{ 
        generatedDeck: any; 
        deckId?: string;
        savedToDatabase?: boolean;
    }>('generate-deck', payloadWithContext as any);
    
    // If saved to database, use the database ID
    const deckId = result.savedToDatabase && result.deckId 
        ? result.deckId 
        : result.generatedDeck.id;
    
    // Fallback to sessionStorage if not saved to database (backward compatibility)
    if (!result.savedToDatabase) {
    sessionStorage.setItem('newlyGeneratedDeck', JSON.stringify(result.generatedDeck));
        console.log('Deck saved to sessionStorage (not persisted to database)');
    } else {
        console.log('Deck saved to database:', deckId);
    }
    
    return { deckId };
};

/**
 * Generates a roadmap slide via Edge Function.
 */
export const generateRoadmapSlide = async (companyContext: string): Promise<{ slide: Slide }> => {
    try {
        return await invokeEdgeFunction<{ slide: Slide }>('slide-ai', { 
        action: 'generateRoadmap',
        context: companyContext 
    });
    } catch (error) {
         console.warn("Edge Function failed. Returning mock roadmap slide.");
         return {
             slide: {
                 id: `slide-roadmap-${Date.now()}`,
                 title: "Strategic Roadmap",
                 content: "Q1: MVP Launch\nQ2: User Growth\nQ3: Revenue\nQ4: Scale",
                 type: 'roadmap',
                 template: 'default',
                 imageUrl: "A roadmap showing milestones"
             }
         };
    }
};

/**
 * Checks for updates via Edge Function.
 */
export const checkForWebsiteUpdates = async (deck: Deck, url: string): Promise<DeckUpdateSuggestion[]> => {
    return invokeEdgeFunction<DeckUpdateSuggestion[]>('slide-ai', {
        action: 'checkUpdates',
        deck,
        url
    });
};

/**
 * Analyzes the funding goal via Edge Function.
 */
export const analyzeFundingGoal = async (amount: string, industry: string): Promise<FundingAnalysis> => {
    return invokeEdgeFunction<FundingAnalysis>('slide-ai', {
        action: 'analyzeFunding',
        amount,
        industry
    });
};
