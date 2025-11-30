
import { supabase } from '../lib/supabaseClient';
import { mockDeck } from '../data/decks';
import { MarketSizeAnalysis, OnePagerContent, InvestorUpdateContent } from './ai/types';

/**
 * A generic helper function to invoke a Supabase Edge Function.
 * This abstracts the `supabase.functions.invoke` call and provides
 * consistent error handling and response typing.
 *
 * @template T The expected type of the data returned from the Edge Function.
 * @param {string} functionName The name of the Edge Function to invoke.
 * @param {Record<string, unknown>} [payload] The JSON body to send with the request.
 * @returns {Promise<T>} A promise that resolves with the data from the function.
 * @throws {Error} Throws a user-friendly error if the function invocation fails.
 */
export const invokeEdgeFunction = async <T>(
  functionName: string,
  payload?: Record<string, unknown>
): Promise<T> => {
  // Check if we are in mock mode by checking for a mock-specific property or lack of URL
  if (!(supabase as any).realtime) {
     console.warn(`Supabase not configured. Mocking Edge Function "${functionName}".`);
     
     // --- MOCK RESPONSES FOR UI DEVELOPMENT ---
     
     if (functionName === 'generate-deck') {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        const { id, ...deckData } = mockDeck;
        return deckData as unknown as T;
     }

     // New Mock: Full Pitch Deck Generation & Persistence
     if (functionName === 'generate-pitch-deck') {
        await new Promise(resolve => setTimeout(resolve, 4000)); // Simulate AI generation time
        
        // Generate a fake ID
        const newDeckId = `deck-${Date.now()}`;
        
        // Create a mock deck object based on the payload inputs if available
        const inputTitle = (payload?.companyDetails as any)?.name || "New AI Startup";
        const inputIndustry = (payload?.companyDetails as any)?.industry || "Tech";
        
        const generatedDeck = {
            id: newDeckId,
            title: `${inputTitle} Pitch Deck`,
            template: payload?.theme || 'default',
            slides: [
                {
                    id: `slide-${Date.now()}-1`,
                    position: 0,
                    title: "Vision",
                    content: `Our vision is to revolutionize the ${inputIndustry} industry.`,
                    type: 'vision',
                    template: payload?.theme || 'default'
                },
                {
                    id: `slide-${Date.now()}-2`,
                    position: 1,
                    title: "Problem",
                    content: "Current solutions are slow, expensive, and hard to use.",
                    type: 'problem',
                    template: payload?.theme || 'default'
                },
                {
                    id: `slide-${Date.now()}-3`,
                    position: 2,
                    title: "Solution",
                    content: `We use advanced AI to solve this problem 10x faster.`,
                    type: 'solution',
                    template: payload?.theme || 'default'
                },
                // ... (In a real backend, Gemini would generate all 10 slides)
                 {
                    id: `slide-${Date.now()}-10`,
                    position: 9,
                    title: "The Ask",
                    content: "We are raising $2M to scale our operations.",
                    type: 'ask',
                    template: payload?.theme || 'default'
                }
            ]
        };

        // "Persist" to sessionStorage so the DeckEditor can find it
        sessionStorage.setItem('newlyGeneratedDeck', JSON.stringify(generatedDeck));
        
        return { deckId: newDeckId } as unknown as T;
     }

     if (functionName === 'generate-market-sizing') {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate Gemini Thinking
        const mockMarket: MarketSizeAnalysis = {
            icp: "Series A+ B2B SaaS Startups",
            beachhead: "US-based AI-native productivity tools",
            tam: { value: "$45B", description: "Global Productivity Software Market (2025 Est.)", sourceUrl: "https://gartner.com/example" },
            sam: { value: "$12B", description: "North American B2B SaaS Segment", sourceUrl: "https://statista.com/example" },
            som: { value: "$150M", description: "1.2% Market Share (Year 3 Target)", sourceUrl: "" },
            methodology: "Bottom-up calculation based on 50k potential business customers @ $3k ACV."
        };
        return mockMarket as unknown as T;
     }

     if (functionName === 'generate-one-pager') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockOnePager: OnePagerContent = {
            headline: "The Operating System for AI Startups",
            problem_summary: "Founders waste 40% of their time on non-core tasks like deck design and updates.",
            solution_summary: "Sun AI automates fundraising assets using Gemini 3, saving 100+ hours per round.",
            market_opportunity: "$45B Global Productivity Market with 12% CAGR.",
            traction_highlights: ["$12k MRR", "15% MoM Growth", "500+ Active Users"],
            business_model: "SaaS Subscription ($49/mo) + Marketplace Take Rate (15%)",
            ask: "$2M Seed Round for Product Expansion",
            contact_info: { email: "founders@sun.ai", website: "sun.ai" }
        };
        return mockOnePager as unknown as T;
     }

     if (functionName === 'generate-investor-update') {
         await new Promise(resolve => setTimeout(resolve, 1500));
         const mockUpdate: InvestorUpdateContent = {
             subject_line: "September Update: 15% Growth & New AI Features 🚀",
             status_emoji: "🟢",
             status_summary: "We are on track to hit our Q3 goals. Growth is accelerating, and user retention is at an all-time high.",
             highlights: ["Reached $12k MRR (+15% MoM)", "Launched Gemini 3 integration", "Hired lead engineer"],
             lowlights: ["Churn slightly increased to 3%", "Marketing spend efficiency dropped"],
             kpi_summary: "**MRR:** $12k (+15%)\n**Active Users:** 520 (+10%)\n**Runway:** 14 Months",
             ask: "Intros to Series A fintech investors for our upcoming round."
         };
         return mockUpdate as unknown as T;
     }

     // Generic fallback
     return Promise.resolve({} as T);
  }

  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload,
  });

  if (error) {
    console.error(`Error invoking Edge Function "${functionName}":`, error);
    // Create a more generic, user-facing error to avoid exposing implementation details.
    throw new Error(`An error occurred while processing your request via ${functionName}. Please try again.`);
  }

  return data as T;
};
