
import { invokeEdgeFunction } from '../edgeFunctionService';
import { Deck } from '../../data/decks';

/**
 * Calls the 'generate-deck' Edge Function.
 * This uses the specific "Hook-Villain-Hero" narrative structure.
 */
export const generateSalesDeck = async (payload: {
    businessContext: string;
    targetAudience: string;
    deckType: 'Sales Deck';
    theme: string;
}): Promise<{ deckId: string }> => {
    // We re-use the generic generation function signature on the backend,
    // but the backend will detect 'deckType: Sales Deck' and use the sales specific logic/prompts.
    return invokeEdgeFunction<{ deckId: string }>('generate-deck', payload as any);
};
