import { Deck, Slide } from '../../data/decks';
import { templates } from '../../styles/templates';
import { invokeEdgeFunction } from '../edgeFunctionService';

const uuidv4 = () => {
    // A simple UUID generator for client-side keying
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
};

interface GenerationPayload {
  businessContext: string;
  urls: string[];
  deckType: string;
  theme: keyof typeof templates;
  companyDetails: {
    name: string;
    industry: string;
    customerType: string;
    revenueModel: string;
    stage: string;
    traction: string;
  };
}

export const generateFullDeck = async (payload: GenerationPayload): Promise<Omit<Deck, 'id'>> => {
    // This now calls a secure backend function instead of the Gemini API directly.
    const deckData = await invokeEdgeFunction<{ title: string; slides: Omit<Slide, 'id'>[] }>('generate-deck', { ...payload });
    
    // Add client-side IDs before returning to the UI for React keys
    const newDeck: Omit<Deck, 'id'> = {
        title: deckData.title,
        template: payload.theme || 'default',
        slides: deckData.slides.map(s => ({ ...s, id: `slide-${uuidv4()}` })),
    };
    return newDeck;
};

export const generateRoadmapSlide = async (companyContext: string): Promise<{ slide: Slide }> => {
    // This now calls a secure backend function.
    const result = await invokeEdgeFunction<{ slide: Omit<Slide, 'id'> }>('generate-roadmap-slide', { companyContext });
    return {
        slide: {
            ...result.slide,
            id: `slide-${uuidv4()}`
        }
    };
};
