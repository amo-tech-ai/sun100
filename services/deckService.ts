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
    
    if (error) throw error;
    return data;
};

export const updateDeck = async (id: string, updates: Partial<Deck>): Promise<Deck> => {
    const { data, error } = await supabase
        .from('decks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    
    if (error) throw error;
    return data;
};

export const updateSlide = async (id: string, updates: Partial<Slide>): Promise<Slide> => {
    const { data, error } = await supabase
        .from('slides')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
    if (error) throw error;
    return data;
};
