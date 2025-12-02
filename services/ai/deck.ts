import { Deck, Slide } from '../../data/decks';
import { templates } from '../../styles/templates';
import { edgeClient } from './edgeClient';
import { 
    generateDeckOutlineFunctionDeclaration, 
    createRoadmapContentFunctionDeclaration, 
    generateDeckUpdateSuggestionsFunctionDeclaration,
    analyzeFundingGoalFunctionDeclaration
} from './prompts';
import { DeckUpdateSuggestion, FundingAnalysis } from './types';
import { handleAIError } from './utils';

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
 * Generates a full pitch deck outline using Gemini 3.
 */
export const generateFullDeck = async (payload: GenerationPayload): Promise<{ deckId: string }> => {
    try {
        const { businessContext, companyDetails, deckType, theme } = payload;
        
        const prompt = `
            You are a world-class venture capital analyst and pitch deck expert.
            Create a strategic 10-slide ${deckType} for a startup.
            
            **Startup Context:**
            ${businessContext}
            
            ${companyDetails ? `**Company Details:**
            Name: ${companyDetails.name}
            Industry: ${companyDetails.industry}
            Stage: ${companyDetails.stage}
            Revenue Model: ${companyDetails.revenueModel}
            Traction: ${companyDetails.traction}
            Team Size: ${companyDetails.teamSize}
            ` : ''}
            
            **Theme:** ${theme}
            
            **Instructions:**
            1. Structure the deck to tell a compelling narrative (Problem -> Solution -> Market -> Traction).
            2. Ensure the tone matches the '${theme}' aesthetic.
            3. Generate highly detailed, creative image prompts for each slide that match the theme.
            4. Use the 'generateDeckOutline' function to return the structured data.
        `;

        const response = await edgeClient.models.generateContent({
            model: payload.config?.model || 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [generateDeckOutlineFunctionDeclaration] }],
                thinkingConfig: payload.config?.thinking_level === 'high' ? { thinkingBudget: 2048 } : undefined
            }
        });

        const functionCall = response.functionCalls?.[0];

        if (functionCall?.name === 'generateDeckOutline' && functionCall.args) {
             // In a real backend, we would save to DB here. 
             // For client-side prototype, we mock the DB save by returning a mock ID 
             // and letting the caller handle session storage or state.
             
             // We'll attach the generated data to a temporary global or session object to simulate persistence
             // so the next screen can pick it up.
             const generatedDeck = {
                 id: `deck-${Date.now()}`,
                 title: functionCall.args.title as string,
                 template: theme,
                 slides: (functionCall.args.slides as any[]).map((s, i) => ({
                     id: `slide-${Date.now()}-${i}`,
                     position: i,
                     ...s
                 }))
             };
             
             // Store in sessionStorage for the Editor to pick up (Prototype Hack)
             sessionStorage.setItem('newlyGeneratedDeck', JSON.stringify(generatedDeck));
             
             return { deckId: generatedDeck.id };
        }
        
        throw new Error("AI failed to generate a valid deck structure.");

    } catch (error) {
        handleAIError(error);
        throw error;
    }
};

/**
 * Generates a roadmap slide.
 */
export const generateRoadmapSlide = async (companyContext: string): Promise<{ slide: Slide }> => {
    try {
        const prompt = `
            Generate 4 strategic roadmap milestones for this startup based on the context:
            "${companyContext}"
            
            Call 'createRoadmapContent' with the milestones.
        `;

        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [createRoadmapContentFunctionDeclaration] }]
            }
        });

        const functionCall = response.functionCalls?.[0];

        if (functionCall?.name === 'createRoadmapContent' && functionCall.args) {
            const milestones = functionCall.args.milestones as string[];
            const content = milestones.join('\n');
            
            // Generate Visual
            const imagePrompt = `A clean, modern roadmap visualization showing a timeline with 4 milestones: ${milestones.join(', ')}. Minimalist style, vector art, professional business aesthetic.`;
            
            const imageRes = await edgeClient.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: imagePrompt,
                config: { numberOfImages: 1, aspectRatio: '16:9' }
            });
            
            const imageBase64 = imageRes.generatedImages?.[0]?.image?.imageBytes;
            const imageUrl = imageBase64 ? `data:image/png;base64,${imageBase64}` : imagePrompt;

            return {
                slide: {
                    id: `slide-roadmap-${Date.now()}`,
                    title: "Strategic Roadmap",
                    content: content,
                    imageUrl: imageUrl,
                    type: 'roadmap',
                    template: 'default'
                }
            };
        }
        throw new Error("Failed to generate roadmap content.");
    } catch (error) {
        handleAIError(error);
        throw error;
    }
};

/**
 * Checks for updates between the current deck and the live website.
 */
export const checkForWebsiteUpdates = async (deck: Deck, url: string): Promise<DeckUpdateSuggestion[]> => {
    try {
        const deckSummary = deck.slides.map(s => `Slide: ${s.title}\nContent: ${s.content}`).join('\n\n');
        const prompt = `
            Compare the following pitch deck content with the content from the website ${url}.
            Identify any discrepancies (e.g., outdated pricing, new features missing from deck).
            Call 'generateDeckUpdateSuggestions' with a list of suggested updates.
            
            Deck Content:
            ${deckSummary}
        `;

        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }, { functionDeclarations: [generateDeckUpdateSuggestionsFunctionDeclaration] }]
            }
        });

        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'generateDeckUpdateSuggestions' && functionCall.args) {
            return functionCall.args.suggestions as DeckUpdateSuggestion[];
        }
        return [];
    } catch (error) {
        console.error("Website update check failed:", error);
        return [];
    }
};

/**
 * Analyzes the funding goal.
 */
export const analyzeFundingGoal = async (amount: string, industry: string): Promise<FundingAnalysis> => {
    try {
        const prompt = `
            Analyze a funding goal of ${amount} for a ${industry} startup.
            Determine the investor types (Angel, Seed VC, etc.), provide strategic advice, and list next steps.
            Call 'analyzeFundingGoal'.
        `;

        const response = await edgeClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [analyzeFundingGoalFunctionDeclaration] }]
            }
        });

        const functionCall = response.functionCalls?.[0];
        if (functionCall?.name === 'analyzeFundingGoal' && functionCall.args) {
            return functionCall.args as unknown as FundingAnalysis;
        }
        throw new Error("Analysis failed");
    } catch (error) {
        handleAIError(error);
        throw error;
    }
};