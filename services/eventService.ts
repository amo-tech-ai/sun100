
import { supabase } from '../lib/supabaseClient';

export interface Event {
    id: number | string;
    title: string;
    start_date: string; // ISO string format from backend
    location: string;
    description: string;
}

// Fetch live data from Supabase
export const getEvents = async (): Promise<Event[]> => {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('start_date', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.warn("Could not fetch events, Supabase might not be configured.", err)
        return []; // Return empty array on failure
    }
};

export const getEventById = async (id: string): Promise<Event | null> => {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } catch (err) {
        console.warn(`Could not fetch event ${id}, Supabase might not be configured.`, err);
        return null;
    }
};
