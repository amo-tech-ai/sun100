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
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

    if (error) {
        console.error("Error fetching events:", error);
        throw new Error(`Failed to fetch events: ${error.message}`);
    }
    
    return data || [];
};

export const getEventById = async (id: string): Promise<Event | null> => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching event ${id}:`, error);
        // Don't throw for "not found", just return null
        if (error.code === 'PGRST116') {
            return null;
        }
        throw new Error(`Failed to fetch event: ${error.message}`);
    }

    return data;
};