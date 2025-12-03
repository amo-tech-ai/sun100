
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
 * Includes a fallback to mock data if the backend fails during development.
 */
export const generateFullDeck = async (payload: GenerationPayload): Promise<{ deckId: string }> => {
    try {
        const result = await invokeEdgeFunction<{ generatedDeck: any }>('generate-deck', payload as any);
        
        // Save to session storage for retrieval by DeckEditor
        sessionStorage.setItem('newlyGeneratedDeck', JSON.stringify(result.generatedDeck));
        return { deckId: result.generatedDeck.id };

    } catch (error) {
        console.warn("⚠️ Edge Function 'generate-deck' failed. Falling back to local mock deck for development continuity.", error);
        
        // Create a fallback mock deck so the UI doesn't break
        const fallbackDeck: Deck = {
            ...mockDeck,
            id: `fallback-${Date.now()}`,
            title: payload.companyDetails?.name ? `${payload.companyDetails.name} Pitch Deck` : "New Startup Pitch",
            template: payload.theme || 'default',
            slides: mockDeck.slides.map(s => ({...s, id: `slide-${Math.random().toString(36).substr(2,9)}`}))
        };

        sessionStorage.setItem('newlyGeneratedDeck', JSON.stringify(fallbackDeck));
        return { deckId: fallbackDeck.id };
    }
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
