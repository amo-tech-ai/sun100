
import { Deck, Slide, mockDeck } from '../data/decks';
import { supabase, IS_MOCK_MODE } from '../lib/supabaseClient';


export const getDecks = async (): Promise<Deck[]> => {
    if (IS_MOCK_MODE) {
        console.warn("Supabase not configured. Returning mock decks.");
        return [mockDeck];
    }

    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) {
        console.log("No user session. Returning empty array for decks.");
        return [];
    }

    const { data, error } = await supabase
        .from('decks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching decks:', error);
        throw error;
    }

    return (data as any[]) || [];
};

export const getDeckById = async (id: string): Promise<Deck | null> => {
     if (IS_MOCK_MODE) {
        console.warn("Supabase not configured. Returning mock deck.");
        return id === mockDeck.id ? mockDeck : null;
    }
    
    const { data, error } = await supabase
        .from('decks')
        .select('*, slides(*)')
        .eq('id', id)
        .single();
        
    if (error) {
        console.error(`Error fetching deck ${id}:`, error);
        if (error.code !== 'PGRST116') { 
             throw error;
        }
    }
    
    if (data && Array.isArray(data.slides)) {
        data.slides.sort((a: any, b: any) => a.position - b.position);
    }

    return data as Deck | null;
};

export const createDeck = async (deckData: Omit<Deck, 'id'>, userId: string): Promise<Deck> => {
    if (IS_MOCK_MODE) {
        console.warn("Supabase not configured. Creating mock deck in memory.");
        
        const mockId = `mock-deck-${Date.now()}`;
        
        const newMockDeck: Deck = {
            id: mockId,
            title: deckData.title,
            template: deckData.template,
            slides: deckData.slides.map((s, i) => ({
                ...s,
                id: `mock-slide-${mockId}-${i}`,
                position: i,
                content: s.content || ''
            }))
        };
        
        return newMockDeck;
    }

    const { data: newDeck, error: deckError } = await supabase
        .from('decks')
        .insert({
            user_id: userId,
            title: deckData.title,
            template: deckData.template,
        })
        .select()
        .single();
        
    if (deckError) throw deckError;

    const slidesToInsert = deckData.slides.map((slide, index) => ({
        deck_id: newDeck.id,
        position: index,
        title: slide.title,
        content: slide.content,
        imageUrl: slide.imageUrl,
        template: slide.template,
        type: slide.type,
    }));

    const { error: slidesError } = await supabase
        .from('slides')
        .insert(slidesToInsert);

    if (slidesError) throw slidesError;

    const finalDeck = await getDeckById(newDeck.id);
    if (!finalDeck) throw new Error("Failed to retrieve newly created deck.");
    return finalDeck;
};

export const updateDeck = async (deckId: string, updates: Partial<Omit<Deck, 'id' | 'slides'>>) => {
    if (IS_MOCK_MODE) return; 
    const { error } = await supabase
        .from('decks')
        .update(updates)
        .eq('id', deckId);
    if (error) throw error;
};

export const updateSlide = async (slideId: string, updates: Partial<Omit<Slide, 'id'>>) => {
    if (IS_MOCK_MODE) return; 
    const { error } = await supabase
        .from('slides')
        .update(updates)
        .eq('id', slideId);
    if (error) throw error;
};