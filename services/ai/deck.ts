
import { GoogleGenAI } from "@google/genai";
import { Deck, Slide } from '../../data/decks';
import { templates } from '../../styles/templates';
import { invokeEdgeFunction } from '../edgeFunctionService';
import { DeckUpdateSuggestion, FundingAnalysis } from './types';
import { analyzeFundingGoalFunctionDeclaration } from './prompts';

const uuidv4 = () => {
    // A simple UUID generator for client-side keying
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
};

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
  // Legacy props to satisfy type checker if needed
  companyDetails?: {
    name: string;
    industry: string;
    customerType: string;
    revenueModel: string;
    stage: string;
    traction: string;
  };
}

export const generateFullDeck = async (payload: GenerationPayload): Promise<Omit<Deck, 'id'>> => {
    // This calls the secure backend function.
    // We use the config from the payload (user preference) or default to High reasoning.
    const config = {
        model: 'gemini-3-pro-preview',
        thinking_level: 'high', // Default to high if not specified
        ...payload.config
    };

    const deckData = await invokeEdgeFunction<{ title: string; slides: Omit<Slide, 'id'>[] }>('generate-deck', { 
        ...payload,
        config
    });
    
    // Add client-side IDs before returning to the UI for React keys
    const newDeck: Omit<Deck, 'id'> = {
        title: deckData.title,
        template: payload.theme || 'default',
        slides: deckData.slides.map(s => ({ ...s, id: `slide-${uuidv4()}` })),
    };
    return newDeck;
};

export const generateRoadmapSlide = async (companyContext: string): Promise<{ slide: Slide }> => {
    // For roadmap generation, we also want high reasoning to infer strategic milestones.
    const result = await invokeEdgeFunction<{ slide: Omit<Slide, 'id'> }>('generate-roadmap-slide', { 
        companyContext,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high'
        }
    });
    return {
        slide: {
            ...result.slide,
            id: `slide-${uuidv4()}`
        }
    };
};

export const checkForWebsiteUpdates = async (deck: Deck, url: string): Promise<DeckUpdateSuggestion[]> => {
    // This function calls the backend to crawl the URL and compare it with the deck content.
    const response = await invokeEdgeFunction<{ suggestions: DeckUpdateSuggestion[] }>('sync-deck-with-website', {
        deck,
        url,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high', // High reasoning to detect nuanced changes vs semantic similarity
            tools: ['urlContext'] // Enable URL reading capability
        }
    });
    return response.suggestions;
};

export const analyzeFundingGoal = async (amount: string, industry: string): Promise<FundingAnalysis> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    Analyze the following funding goal for a startup in the specified industry.
    Determine the most suitable investor types (e.g., Angel, Pre-Seed VC, Series A VC), provide strategic advice on raising this amount, and list actionable next steps.
    Call 'analyzeFundingGoal' with the results.

    Funding Amount: ${amount}
    Industry: ${industry}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [analyzeFundingGoalFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 } // High reasoning for strategic analysis
            },
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'analyzeFundingGoal' && call.args) {
            return call.args as unknown as FundingAnalysis;
        }
        throw new Error("The AI did not return a valid funding analysis.");
    } catch (error) {
        console.error("Error analyzing funding goal:", error);
        throw new Error("Failed to analyze funding goal.");
    }
};