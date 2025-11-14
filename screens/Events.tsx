import React, { useState, useEffect, useMemo } from 'react';
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
                <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
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
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'virtual' | 'in-person'>('all');
    const [dateFilter, setDateFilter] = useState<'all' | 'this-week' | 'this-month'>('all');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedEvents = await getEvents();
                setEvents(fetchedEvents);
                 if (fetchedEvents.length === 0) {
                    console.warn("No events found. This could be because Supabase is not configured or the 'events' table is empty. Mock data is being used as a fallback.");
                }
            } catch (err) {
                console.error("Failed to fetch events:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = useMemo(() => {
        return events
            .filter(event => {
                if (categoryFilter === 'all') return true;
                const isVirtual = event.location.toLowerCase() === 'virtual';
                if (categoryFilter === 'virtual') return isVirtual;
                if (categoryFilter === 'in-person') return !isVirtual;
                return true;
            })
            .filter(event => {
                if (dateFilter === 'all') return true;
                
                const eventDate = new Date(event.start_date);

                if (dateFilter === 'this-week') {
                    const today = new Date();
                    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                    firstDayOfWeek.setHours(0, 0, 0, 0);
                    const lastDayOfWeek = new Date(firstDayOfWeek);
                    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                    lastDayOfWeek.setHours(23, 59, 59, 999);
                    return eventDate >= firstDayOfWeek && eventDate <= lastDayOfWeek;
                }

                if (dateFilter === 'this-month') {
                    const today = new Date();
                    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    lastDayOfMonth.setHours(23, 59, 59, 999);
                    return eventDate >= firstDayOfMonth && eventDate <= lastDayOfMonth;
                }
                
                return true;
            });
    }, [events, categoryFilter, dateFilter]);


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
        
        if (filteredEvents.length === 0) {
             return (
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
                    <h3 className="text-xl font-semibold text-gray-800">No Events Match Your Filters</h3>
                    <p className="text-gray-600 mt-2">Try adjusting your category or date range to find more events.</p>
                </div>
            );
        }


        return (
            <div className="space-y-8">
                {filteredEvents.map(event => (
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

            {/* Filters */}
            <div className="bg-white/50 p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Category:</span>
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        {(['all', 'virtual', 'in-person'] as const).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors capitalize ${
                                    categoryFilter === cat
                                        ? 'bg-brand-orange text-white shadow'
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <label htmlFor="date-filter" className="font-semibold text-gray-700">Date:</label>
                    <select
                        id="date-filter"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value as 'all' | 'this-week' | 'this-month')}
                        className="bg-white border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    >
                        <option value="all">All Upcoming</option>
                        <option value="this-week">This Week</option>
                        <option value="this-month">This Month</option>
                    </select>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

export default Events;