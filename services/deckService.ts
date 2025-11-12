import { supabase } from '../lib/supabaseClient';
import { Deck, Slide } from '../data/decks';

export const getDecks = async (): Promise<Deck[]> => {
    const { data, error } = await supabase
        .from('decks')
        .select('*, slides(*)')
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
};

export const getDeckById = async (id: string): Promise<Deck | null> => {
    const { data, error } = await supabase
        .from('decks')
        .select('*, slides(*)')
        .eq('id', id)
        .order('position', { referencedTable: 'slides', ascending: true })
        .single();
    
    if (error && error.code !== 'PGRST116') { // Don't throw error if just no rows found
        console.error("Error fetching deck by ID:", error);
        throw error;
    };
    return data;
};

export const updateDeck = async (id: string, updates: Partial<Deck>): Promise<Deck | null> => {
    const { data, error } = await supabase
        .from('decks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    
    if (error) throw error;
    return data;
};

export const updateSlide = async (id: string, updates: Partial<Slide>): Promise<Slide | null> => {
    const { data, error } = await supabase
        .from('slides')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
    if (error) throw error;
    return data;
};

export const pollForDeckSlides = async (deckId: string): Promise<boolean> => {
    const { data, error } = await supabase
        .from('slides')
        .select('id')
        .eq('deck_id', deckId)
        .limit(1);

    if (error) {
        console.error('Polling error:', error);
        return false; // Continue polling on error
    }

    return data && data.length > 0;
};