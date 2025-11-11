import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Event, getEventById } from '../services/eventService';

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const EventDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isRsvpd, setIsRsvpd] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const checkRsvp = useCallback(async () => {
        if (!user || !id) return;
        try {
            const { data, error } = await supabase
                .from('rsvps')
                .select('id')
                .eq('user_id', user.id)
                .eq('event_id', id)
                .single();
            if (data && !error) {
                setIsRsvpd(true);
            }
        } catch(e) {
            // .single() throws if no rows are found, which is an expected state.
        }
    }, [user, id]);

    useEffect(() => {
        if (!id) {
            setError("Event ID is missing.");
            setIsLoading(false);
            return;
        }

        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedEvent = await getEventById(id);
                if (fetchedEvent) {
                    setEvent(fetchedEvent);
                } else {
                    setError("Event not found.");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
        if (user) {
            checkRsvp();
        }
    }, [id, user, checkRsvp]);

    const handleRsvp = async () => {
        if (!user) {
            alert("You must be logged in to RSVP.");
            return;
        }
        if (!event) return;
        
        setIsSubmitting(true);
        const { error } = await supabase
            .from('rsvps')
            .insert({ user_id: user.id, event_id: event.id });
        
        if (error) {
            alert(`Error RSVPing: ${error.message}`);
        } else {
            setIsRsvpd(true);
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading event details...</div>;
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <div className="mt-4">
                     <Link to="/events" className="text-[#E87C4D] hover:underline">&larr; Back to all events</Link>
                </div>
            </div>
        );
    }

    if (!event) {
        return null;
    }

    const eventDate = new Date(event.start_date);

    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md">
            <Link to="/events" className="text-[#E87C4D] hover:underline">&larr; Back to all events</Link>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg text-gray-500 mt-2">
                <span>{eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>&bull;</span>
                <span>{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}</span>
                <span>&bull;</span>
                <span>{event.location}</span>
            </div>
            <div className="prose prose-lg mt-6">
                <p>{event.description}</p>
            </div>
            {user && (isRsvpd ? (
                <div className="mt-8 inline-flex items-center bg-green-100 text-green-700 font-bold py-3 px-6 rounded-lg text-lg">
                    <CheckCircleIcon />
                    You're registered!
                </div>
            ) : (
                <button 
                    onClick={handleRsvp} 
                    disabled={isSubmitting}
                    className="mt-8 inline-block bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-400"
                >
                    {isSubmitting ? 'Submitting...' : 'RSVP Now'}
                </button>
            ))}
        </div>
    );
};

export default EventDetail;