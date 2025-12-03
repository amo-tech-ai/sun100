import { Deck, Slide } from '../../data/decks';
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
 */
export const generateFullDeck = async (payload: GenerationPayload): Promise<{ deckId: string }> => {
    const result = await invokeEdgeFunction<{ generatedDeck: any }>('generate-deck', payload as any);
    
    // Maintain existing prototype flow by saving to session storage
    // In a full DB implementation, the Edge Function would save to DB and return ID.
    sessionStorage.setItem('newlyGeneratedDeck', JSON.stringify(result.generatedDeck));
    
    return { deckId: result.generatedDeck.id };
};

/**
 * Generates a roadmap slide via Edge Function.
 */
export const generateRoadmapSlide = async (companyContext: string): Promise<{ slide: Slide }> => {
    return invokeEdgeFunction<{ slide: Slide }>('slide-ai', { 
        action: 'generateRoadmap',
        context: companyContext 
    });
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