
import { Deck, Slide } from '../../data/decks';
import { templates } from '../../styles/templates';
import { invokeEdgeFunction } from '../edgeFunctionService';
import { DeckUpdateSuggestion, FundingAnalysis } from './types';

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
  deckType: string; // Updated to include deckType
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
 * Calls the 'generate-pitch-deck' Edge Function.
 * The backend handles Gemini interaction, JSON generation, and database insertion.
 * Returns the ID of the newly created deck.
 */
export const generateFullDeck = async (payload: GenerationPayload): Promise<{ deckId: string }> => {
    return invokeEdgeFunction<{ deckId: string }>('generate-pitch-deck', payload as any);
};

/**
 * Generates a roadmap slide using a secure Edge Function.
 * The backend generates milestones and the corresponding visual.
 */
export const generateRoadmapSlide = async (companyContext: string): Promise<{ slide: Slide }> => {
    return invokeEdgeFunction<{ slide: Slide }>('generate-roadmap-slide', { companyContext });
};

/**
 * Checks for updates between the current deck and the live website using a secure Edge Function.
 */
export const checkForWebsiteUpdates = async (deck: Deck, url: string): Promise<DeckUpdateSuggestion[]> => {
    // We send a summary of the deck to avoid sending too much data
    const deckSummary = deck.slides.map(s => `Slide: ${s.title}\nContent: ${s.content}`).join('\n\n');
    
    const result = await invokeEdgeFunction<{ suggestions: DeckUpdateSuggestion[] }>('check-website-updates', { 
        deckSummary, 
        url 
    });
    return result.suggestions;
};

/**
 * Analyzes the funding goal using a secure Edge Function.
 */
export const analyzeFundingGoal = async (amount: string, industry: string): Promise<FundingAnalysis> => {
    return invokeEdgeFunction<FundingAnalysis>('analyze-funding-goal', { amount, industry });
};
