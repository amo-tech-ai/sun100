
import { Deck, Slide } from '../../data/decks';
import { templates } from '../../styles/templates';
import { invokeEdgeFunction } from '../edgeFunctionService';
import { DeckUpdateSuggestion, FundingAnalysis } from './types';
import { handleAIError } from './utils';
import { analyzeFundingGoalFunctionDeclaration, createRoadmapContentFunctionDeclaration, generateDeckUpdateSuggestionsFunctionDeclaration } from './prompts';
import { generateSlideImage } from './image';
import { edgeClient } from './edgeClient';

const uuidv4 = () => {
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
    try {
        // Call the secure backend function
        const result = await invokeEdgeFunction<{ deckId: string }>('generate-pitch-deck', payload as any);
        
        if (!result || !result.deckId) {
            throw new Error("Backend generation failed to return a deck ID.");
        }

        return result;
    } catch (error) {
        handleAIError(error);
    }
};

export const generateRoadmapSlide = async (companyContext: string): Promise<{ slide: Slide }> => {
    let milestones: string[] = ['Launch MVP', 'Gain Traction', 'Scale', 'Series A'];
    
    try {
        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `
            You are a Startup Strategy Consultant.
            
            **Goal:** Define 4 clear, ambitious, yet realistic strategic milestones for a startup roadmap.
            **Context:** "${companyContext}"
            
            **Requirements:**
            - Milestone 1: Immediate Term (e.g., Launch, Beta)
            - Milestone 2: Early Traction (e.g., 1k Users, First Revenue)
            - Milestone 3: Growth/Scale (e.g., $1M ARR, Series A)
            - Milestone 4: Visionary Future (e.g., Market Leadership)
            
            Call 'createRoadmapContent' with these 4 milestones.
            `,
            config: {
                tools: [{ functionDeclarations: [createRoadmapContentFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });
        
        const call = response.functionCalls?.[0];
        if (call && call.name === 'createRoadmapContent' && call.args) {
            const args = call.args as any;
            if (args.milestones && Array.isArray(args.milestones)) {
                 milestones = args.milestones;
            }
        }
    } catch (e) {
        handleAIError(e);
    }

    const imagePrompt = `A minimalist 'Vision Trail' roadmap diagram on a light beige background (#FBF8F5). 
    A single, clean horizontal line (#1F2937) runs from left to right. 
    Four circular nodes are evenly spaced on the line, with simple, recognizable icons inside. 
    The first circle is green (#10B981), the second is brand orange (#E87C4D), and the last two are gray (#6B7280). 
    A vertical dashed orange line labeled 'Now' passes through the second circle. 
    Below each circle, add a short, dark gray label corresponding to these milestones: '${milestones[0]}', '${milestones[1]}', '${milestones[2]}', '${milestones[3]}'.
    Style: Professional vector art, clean, high resolution.`;
    
    let imageUrl = '';
    try {
        const { base64Image } = await generateSlideImage("Strategic Roadmap", companyContext, imagePrompt);
        imageUrl = `data:image/jpeg;base64,${base64Image}`;
    } catch (e) {
        console.error("Roadmap image generation failed", e);
    }

    return {
        slide: {
            id: `slide-${uuidv4()}`,
            title: "Our Strategic Roadmap",
            content: milestones.map(m => `- ${m}`).join('\n'),
            imageUrl: imageUrl,
            template: 'default',
            type: 'roadmap'
        }
    };
};

export const checkForWebsiteUpdates = async (deck: Deck, url: string): Promise<DeckUpdateSuggestion[]> => {
    const deckSummary = deck.slides.map(s => `Slide: ${s.title}\nContent: ${s.content}`).join('\n\n');
    const prompt = `
    You are an Audit Bot. 
    
    **Task:** Compare the live website content (read via urlContext) against the current Pitch Deck.
    **Goal:** Identify discrepancies (outdated pricing, old messaging, missing features) and suggest specific updates.
    
    **Website URL:** ${url}
    
    **Current Deck Content:**
    ${deckSummary}
    
    Call 'generateDeckUpdateSuggestions' with any findings.
    `;

    try {
        const response = await edgeClient.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                tools: [
                    { urlContext: {} },
                    { functionDeclarations: [generateDeckUpdateSuggestionsFunctionDeclaration] }
                ],
                thinkingConfig: { thinkingBudget: 2048 }
            },
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'generateDeckUpdateSuggestions' && call.args) {
            const args = call.args as any;
            return args.suggestions as DeckUpdateSuggestion[];
        }
        return [];
    } catch (error) {
        handleAIError(error);
    }
};

export const analyzeFundingGoal = async (amount: string, industry: string): Promise<FundingAnalysis> => {
    const prompt = `
    You are a Venture Capital Associate.
    
    **Task:** Analyze the startup's funding request.
    **Ask:** ${amount}
    **Industry:** ${industry}
    
    **Thinking Process:**
    1. Evaluate if the amount is typical for this industry and implied stage.
    2. Identify the right class of investors (Angels vs Pre-Seed Funds vs VCs).
    3. Formulate strategic advice on how to pitch this number (e.g. "Focus on runway").
    4. Define 3 concrete next steps.
    
    Call 'analyzeFundingGoal' with your analysis.
    `;

    try {
        const response = await edgeClient.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [analyzeFundingGoalFunctionDeclaration] }],
                thinkingConfig: { thinkingBudget: 2048 }
            },
        });

        const call = response.functionCalls?.[0];
        if (call && call.name === 'analyzeFundingGoal' && call.args) {
            return call.args as unknown as FundingAnalysis;
        }
        throw new Error("The AI did not return a valid funding analysis.");
    } catch (error) {
        handleAIError(error);
    }
};
