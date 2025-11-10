import React from 'react';
import { Link } from 'react-router-dom';

const mockEvents = [
  {
    id: 'ai-demo-day-summer-24',
    title: 'AI Demo Day: Summer \'24 Showcase',
    date: 'August 30, 2024',
    time: '1:00 PM EST',
    location: 'Virtual',
    category: 'Tech & Innovation',
    description: 'Watch the most promising AI startups from our latest cohort pitch to a panel of top-tier investors and industry experts.',
    image: 'https://images.unsplash.com/photo-1678496223218-c2c9d1789647?q=80&w=2070&auto=format&fit=crop',
    status: 'Few Seats Left',
  },
  {
    id: 'founder-mixer-nyc',
    title: 'Founder & Investor Mixer',
    date: 'September 12, 2024',
    time: '6:00 PM EST',
    location: 'New York, NY',
    category: 'Networking',
    description: 'An exclusive, in-person networking event for AI founders and investors in the New York area. Connect, share insights, and build relationships.',
    image: 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?q=80&w=1974&auto=format&fit=crop',
    status: null,
  },
  {
    id: 'llm-workshop',
    title: 'Workshop: Scaling with LLMs',
    date: 'September 25, 2024',
    time: '11:00 AM EST',
    location: 'Virtual',
    category: 'Workshop',
    description: 'A technical deep-dive into the architecture and strategies for scaling applications built on LLMs. Led by industry veterans.',
    image: 'https://images.unsplash.com/photo-1696238399331-5642a8b9e6a0?q=80&w=2070&auto=format&fit=crop',
    status: null,
  },
  {
    id: 'pitch-deck-masterclass',
    title: 'Masterclass: Perfecting Your Pitch',
    date: 'October 5, 2024',
    time: '2:00 PM EST',
    location: 'Virtual',
    category: 'Masterclass',
    description: 'Learn the art and science of crafting a compelling pitch deck that gets funded. This masterclass is led by a partner at a leading VC firm.',
    image: 'https://images.unsplash.com/photo-1556761175-577380e057a3?q=80&w=1974&auto=format&fit=crop',
    status: null,
  },
];

const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

// --- Filter Icons ---
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;


const Events: React.FC = () => (
    <div className="bg-[#FBF8F5]">
        {/* --- Hero Section --- */}
        <section className="bg-brand-deep-blue text-white text-center py-20 md:py-28 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] animate-pulse" style={{ animationDuration: '10s' }}></div>
            <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold font-heading">Explore Events That Shape the Future of AI</h1>
                <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">Join founders, investors, and creators at global AI-powered gatherings.</p>
                <div className="mt-8 flex justify-center gap-4">
                    <a href="#events-grid" className="bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">View Upcoming Events</a>
                    <a href="#" className="bg-white/10 border border-white/20 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-colors">Host an Event</a>
                </div>
            </div>
        </section>

        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* --- Filter Bar --- */}
            <div className="sticky top-[80px] z-10 bg-[#FBF8F5]/80 backdrop-blur-sm py-4 mb-8">
                <div className="flex flex-col gap-4">
                    {/* Row 1: Primary Tabs */}
                    <div className="flex items-center border-b border-gray-200">
                        <button className="px-4 py-2 text-sm font-semibold text-brand-orange border-b-2 border-brand-orange">Upcoming</button>
                        <button className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-brand-orange border-b-2 border-transparent">Past</button>
                        <button className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-brand-orange border-b-2 border-transparent">Featured</button>
                    </div>

                    {/* Row 2: Search and Filters */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-grow w-full">
                            <input type="search" placeholder="Search by name or location..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"/>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                <FilterIcon />
                                <span>Category</span>
                                <ChevronDownIcon />
                            </button>
                            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                <MapPinIcon />
                                <span>City</span>
                                <ChevronDownIcon />
                            </button>
                            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                <CalendarIcon />
                                <span>Date Range</span>
                                <ChevronDownIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Events Grid --- */}
            <div id="events-grid" className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {mockEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200/80">
                        <div className="relative">
                            <img src={event.image} alt={event.title} className="h-48 w-full object-cover" />
                            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-brand-orange border border-brand-orange/50">{event.category}</div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                            <h2 className="text-xl font-bold font-heading text-gray-800 mb-2">{event.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <span>📅 {event.date}</span>
                                <span>📍 {event.location}</span>
                            </div>
                            <p className="text-gray-600 flex-grow">{event.description}</p>
                            <div className="mt-6 flex justify-between items-center">
                                <Link to={`/events/${event.id}`} className="font-bold text-brand-orange group-hover:underline flex items-center gap-2">
                                    Learn More <ArrowRightIcon />
                                </Link>
                                {event.status && <span className="text-sm font-semibold bg-brand-pastel-teal/50 text-teal-800 px-3 py-1 rounded-full">{event.status}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

             {/* --- Featured Highlight Section --- */}
            <section className="mt-24 bg-brand-deep-blue rounded-xl text-white p-12 text-center relative overflow-hidden">
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-brand-orange/20 rounded-full"></div>
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-brand-orange/20 rounded-full"></div>
                <h2 className="text-3xl font-bold font-heading">Featured Event: AI Founder & Investor Mixer</h2>
                <p className="mt-3 max-w-2xl mx-auto text-slate-300">Join us in New York for an exclusive evening of networking, insights, and opportunities with the leading minds in AI.</p>
                <Link to="/events/founder-mixer-nyc" className="mt-6 inline-block bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">Secure Your Spot</Link>
            </section>
        </div>

        {/* --- Community CTA --- */}
        <section className="bg-white/50 py-20 mt-12 border-t border-gray-200">
            <div className="max-w-2xl mx-auto text-center px-4">
                <h2 className="text-3xl font-bold font-heading text-gray-800">Stay Updated on New AI Events</h2>
                <p className="mt-3 text-lg text-gray-600">Be the first to know about upcoming workshops, demo days, and networking opportunities.</p>
                <form className="mt-6 flex flex-col sm:flex-row gap-3">
                    <input type="email" placeholder="Enter your email" required className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"/>
                    <button type="submit" className="bg-brand-deep-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">Subscribe</button>
                </form>
            </div>
        </section>
        <style>{`
            .bg-grid-white\\/10 {
                background-image: linear-gradient(white .5px, transparent .5px), linear-gradient(to right, white .5px, transparent .5px);
                background-size: 24px 24px;
            }
        `}</style>
    </div>
);

export default Events;