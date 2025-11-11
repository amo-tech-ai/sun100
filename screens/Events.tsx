import React from 'react';
import { Link } from 'react-router-dom';

const mockEvents = [
    { id: 1, title: "Pitch Deck Masterclass: From Idea to Investment", date: "September 15, 2024", location: "Virtual", description: "A deep-dive workshop on crafting a narrative that investors can't ignore." },
    { id: 2, title: "Founder Networking Night", date: "October 5, 2024", location: "San Francisco, CA", description: "Connect with fellow founders, innovators, and potential co-founders in the Bay Area." },
    { id: 3, title: "AMA with a Venture Capitalist", date: "October 20, 2024", location: "Virtual", description: "An open Q&A session with a partner from a leading venture capital firm." },
];

const EventCard: React.FC<typeof mockEvents[0]> = ({ id, title, date, location, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row gap-6">
       <div className="flex-shrink-0 text-center">
            <div className="text-lg font-bold text-[#E87C4D]">{new Date(date).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
            <div className="text-3xl font-bold text-gray-800">{new Date(date).getDate()}</div>
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

const Events: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Community Events</h1>
                <p className="text-xl text-gray-600 mt-4">Join our workshops, networking sessions, and talks.</p>
            </div>
            <div className="space-y-8">
                {mockEvents.map(event => (
                    <EventCard key={event.id} {...event} />
                ))}
            </div>
        </div>
    );
};

export default Events;
