import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, Event } from '../services/eventService';

const EventCard: React.FC<Event> = ({ id, title, start_date, location, description }) => {
    const eventDate = new Date(start_date);
    const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = eventDate.getDate();

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row gap-6">
           <div className="flex-shrink-0 text-center">
                <div className="text-lg font-bold text-[#E87C4D]">{month}</div>
                <div className="text-3xl font-bold text-gray-800">{day}</div>
           </div>
           <div className="flex-grow">
                <p className="text-sm font-semibold text-gray-500">{location}</p>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600 mb-4">{description}</p>
                <Link to={`/events/${id}`} className="font-semibold text-[#E87C4D] hover:underline">
                    View Details &rarr;
                </Link>
           </div>
        </div>
    );
};


const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedEvents = await getEvents();
                setEvents(fetchedEvents);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex gap-6 animate-pulse">
                            <div className="flex-shrink-0 text-center">
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                <div className="h-8 w-10 bg-gray-300 rounded mt-1"></div>
                            </div>
                            <div className="flex-grow space-y-3">
                                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                                <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                                <div className="h-4 w-full bg-gray-200 rounded"></div>
                                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            );
        }

        if (events.length === 0) {
            return (
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
                    <h3 className="text-xl font-semibold text-gray-800">No Events Found</h3>
                    <p className="text-gray-600 mt-2">There are no upcoming events at this time. Please check back later!</p>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {events.map(event => (
                    <EventCard key={event.id} {...event} />
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Community Events</h1>
                <p className="text-xl text-gray-600 mt-4">Join our workshops, networking sessions, and talks.</p>
            </div>
            {renderContent()}
        </div>
    );
};

export default Events;