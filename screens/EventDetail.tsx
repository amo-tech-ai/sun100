import React from 'react';
import { useParams, Link } from 'react-router-dom';

const mockEventDetail = {
  title: "AI Demo Day: Summer '24 Showcase",
  date: "August 30, 2024",
  time: "1:00 PM - 4:00 PM EST",
  location: "Virtual Event",
  image: 'https://images.unsplash.com/photo-1678496223218-c2c9d1789647?q=80&w=2070&auto=format&fit=crop',
  description: "Join us for the culmination of our Summer '24 accelerator program, where the most promising AI startups will present their groundbreaking solutions to a curated audience of top-tier investors, industry leaders, and potential partners. This is a unique opportunity to discover the next wave of AI innovation before anyone else.",
  agenda: [
    { time: "1:00 PM", activity: "Opening Remarks & Welcome" },
    { time: "1:15 PM", activity: "Startup Pitches: Batch 1 (5 companies)" },
    { time: "2:15 PM", activity: "Break & Virtual Networking" },
    { time: "2:30 PM", activity: "Startup Pitches: Batch 2 (5 companies)" },
    { time: "3:30 PM", activity: "Investor Panel Q&A" },
    { time: "4:00 PM", activity: "Closing Remarks & Final Networking" },
  ],
  speakers: [
    { name: "Jane Doe", title: "Partner, Future Ventures", avatar: "https://i.pravatar.cc/150?u=jane" },
    { name: "John Smith", title: "CTO, AI Innovations Corp", avatar: "https://i.pravatar.cc/150?u=john" },
    { name: "Alex Ray", title: "Founder & CEO, ScaleAI (Alum)", avatar: "https://i.pravatar.cc/150?u=alex" },
  ],
};

const EventDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const pageTitle = id?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || mockEventDetail.title;

    return (
        <div className="bg-[#FBF8F5]">
            {/* Hero Section */}
            <div className="relative h-80 md:h-96">
                <img src={mockEventDetail.image} alt={pageTitle} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center text-white px-4 sm:px-6 lg:px-8">
                    <nav className="mb-2 text-sm text-white/80">
                        <Link to="/events" className="hover:underline">Events</Link>
                        <span className="mx-2">/</span>
                        <span className="font-medium">{pageTitle}</span>
                    </nav>
                    <h1 className="text-4xl md:text-6xl font-bold font-heading">{pageTitle}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="lg:w-2/3 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4 border-b pb-2">About this Event</h2>
                            <p className="text-gray-700 leading-relaxed">{mockEventDetail.description}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4 border-b pb-2">Agenda</h2>
                            <ul className="space-y-4">
                                {mockEventDetail.agenda.map(item => (
                                    <li key={item.time} className="flex items-start">
                                        <div className="font-semibold text-brand-orange w-24 flex-shrink-0">{item.time}</div>
                                        <div className="text-gray-700">{item.activity}</div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4 border-b pb-2">Speakers & Panelists</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {mockEventDetail.speakers.map(speaker => (
                                    <div key={speaker.name} className="text-center">
                                        <img src={speaker.avatar} alt={speaker.name} className="w-24 h-24 rounded-full mx-auto mb-3 shadow-md" />
                                        <h3 className="font-bold text-gray-800">{speaker.name}</h3>
                                        <p className="text-sm text-gray-500">{speaker.title}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sticky Sidebar */}
                    <aside className="lg:w-1/3">
                        <div className="sticky top-28 bg-white p-6 rounded-xl shadow-md border border-gray-200/80">
                            <h3 className="text-xl font-bold font-heading text-gray-800 mb-4">Event Details</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                                    <span>{mockEventDetail.date}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <span>{mockEventDetail.time}</span>
                                </li>
                                 <li className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                    <span>{mockEventDetail.location}</span>
                                </li>
                            </ul>
                            <a 
                                href="#" 
                                className="mt-6 block w-full text-center bg-brand-orange text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 shadow-lg"
                            >
                                Register Now
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
