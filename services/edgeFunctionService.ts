import { supabase } from '../lib/supabaseClient';
import { mockDeck } from '../data/decks';
import { MarketSizeAnalysis, OnePagerContent } from './ai/types';

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
         return { content: "This month we achieved 15% growth in MRR..." } as unknown as T;
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
