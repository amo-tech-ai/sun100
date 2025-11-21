
import { GoogleGenAI } from "@google/genai";
import { Deck, Slide } from '../../data/decks';
import { templates } from '../../styles/templates';
import { invokeEdgeFunction } from '../edgeFunctionService';
import { DeckUpdateSuggestion, FundingAnalysis } from './types';
import { analyzeFundingGoalFunctionDeclaration, createRoadmapContentFunctionDeclaration } from './prompts';
import { generateSlideImage } from './image';

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
  };
}

export const generateFullDeck = async (payload: GenerationPayload): Promise<Omit<Deck, 'id'>> => {
    const config = {
        model: 'gemini-3-pro-preview',
        thinking_level: 'high',
        ...payload.config
    };

    const deckData = await invokeEdgeFunction<{ title: string; slides: Omit<Slide, 'id'>[] }>('generate-deck', { 
        ...payload,
        config
    });
    
    const newDeck: Omit<Deck, 'id'> = {
        title: deckData.title,
        template: payload.theme || 'default',
        slides: deckData.slides.map(s => ({ ...s, id: `slide-${uuidv4()}` })),
    };
    return newDeck;
};

export const generateRoadmapSlide = async (companyContext: string): Promise<{ slide: Slide }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let milestones: string[] = ['Launch MVP', 'Gain Traction', 'Scale', 'Series A'];
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Generate 4 strategic, forward-looking roadmap milestones for a startup with this context: "${companyContext}". 
            The milestones should represent:
            1. Early Stage (e.g., MVP, Beta)
            2. Growth (e.g., User milestone, Revenue)
            3. Scaling (e.g., Series A, Expansion)
            4. Future (e.g., Global, Market Leader)
            Call the 'createRoadmapContent' function with these 4 milestones.`,
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
        console.error("Roadmap text generation failed, using fallback.", e);
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
    const response = await invokeEdgeFunction<{ suggestions: DeckUpdateSuggestion[] }>('sync-deck-with-website', {
        deck,
        url,
        config: {
            model: 'gemini-3-pro-preview',
            thinking_level: 'high',
            tools: ['urlContext']
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
                thinkingConfig: { thinkingBudget: 2048 }
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
