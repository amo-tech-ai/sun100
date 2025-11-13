import { supabase } from '../lib/supabaseClient';

export interface Event {
    id: number | string;
    title: string;
    start_date: string; // ISO string format from backend
    location: string;
    description: string;
}

const mockEvents: Event[] = [
    { id: 1, title: "Champions League Screening Night", location: "SkyDome Stadium, Toronto, ON", start_date: "2029-04-20T19:00:00Z", description: "Watch the final match on the big screen with fellow fans. An unforgettable experience for all football lovers." },
    { id: 2, title: "Culinary Delights Festival", location: "Gourmet Plaza, San Francisco, CA", start_date: "2029-03-03T12:00:00Z", description: "A festival for food lovers, featuring top chefs and a variety of cuisines from around the world." },
    { id: 3, title: "Artistry Unveiled: Modern Art Expo", location: "Vogue Hall, Los Angeles, CA", start_date: "2029-03-10T10:00:00Z", description: "Explore modern art from upcoming artists. A day of culture, creativity, and inspiration." },
    { id: 4, title: "Rhythm & Beats Music Festival", location: "Sunset Park, Los Angeles, CA", start_date: "2029-04-20T15:00:00Z", description: "Immerse yourself in electrifying performances by top pop, rock, EDM, and hip-hop artists." }
];

// Fetch live data from Supabase, with a mock fallback
export const getEvents = async (): Promise<Event[]> => {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('start_date', { ascending: true });

        if (error) throw error;
        // If Supabase is configured but returns no data, return empty array
        if (data) return data;
    } catch (err) {
        console.warn("Could not fetch events, Supabase might not be configured. Returning mock data.", err)
    }
    // Fallback to mock data
    return mockEvents;
};

export const getEventById = async (id: string): Promise<Event | null> => {
     try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (data) return data;
    } catch (err) {
        console.warn(`Could not fetch event ${id} from Supabase. Falling back to mock data.`, err);
    }
    // Fallback to mock data
    const numericId = parseInt(id, 10);
    return mockEvents.find(e => e.id === numericId) || null;
};
