import React from 'react';
import { Link } from 'react-router-dom';

const mockEvents = [
  {
    id: 'ai-demo-day-summer-24',
    title: 'AI Demo Day: Summer \'24 Showcase',
    date: 'August 30, 2024',
    location: 'Virtual',
    description: 'Watch the most promising AI startups from our latest cohort pitch to a panel of top-tier investors and industry experts.',
  },
  {
    id: 'founder-mixer-nyc',
    title: 'Founder & Investor Mixer',
    date: 'September 12, 2024',
    location: 'New York, NY',
    description: 'An exclusive, in-person networking event for AI founders and investors in the New York area. Connect, share insights, and build relationships.',
  },
  {
    id: 'llm-workshop',
    title: 'Workshop: Scaling with Large Language Models',
    date: 'September 25, 2024',
    location: 'Virtual',
    description: 'A technical deep-dive into the architecture and strategies for scaling applications built on LLMs. Led by industry veterans.',
  },
  {
    id: 'pitch-deck-masterclass',
    title: 'Masterclass: Perfecting Your Pitch',
    date: 'October 5, 2024',
    location: 'Virtual',
    description: 'Learn the art and science of crafting a compelling pitch deck that gets funded. This masterclass is led by a partner at a leading VC firm.',
  },
];

const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

const Events: React.FC = () => (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold font-heading text-gray-800">Community Events</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Connect with founders, learn from experts, and showcase your work at our exclusive events.
            </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mockEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="p-6 flex-grow">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                            <span>{event.date}</span>
                            <span>{event.location}</span>
                        </div>
                        <h2 className="text-xl font-bold font-heading text-gray-800 mb-3">{event.title}</h2>
                        <p className="text-gray-600">{event.description}</p>
                    </div>
                    <div className="p-6 bg-gray-50">
                        <Link 
                            to={`/events/${event.id}`} 
                            className="font-bold text-brand-orange group-hover:underline flex items-center gap-2"
                        >
                            View Details <ArrowRightIcon />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default Events;