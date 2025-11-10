import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Mock data to be used for any event detail page for now
const mockEventDetail = {
  title: "AI Demo Day: Summer '24 Showcase",
  date: "August 30, 2024",
  time: "1:00 PM - 4:00 PM EST",
  location: "Virtual (Link will be sent to registered attendees)",
  description: "Join us for the culmination of our Summer '24 accelerator program, where the most promising AI startups will present their groundbreaking solutions to a curated audience of top-tier investors, industry leaders, and potential partners. This is a unique opportunity to discover the next wave of AI innovation before anyone else.",
  schedule: [
    { time: "1:00 PM", activity: "Opening Remarks & Welcome" },
    { time: "1:15 PM", activity: "Startup Pitches: Batch 1 (5 companies)" },
    { time: "2:15 PM", activity: "Break & Virtual Networking" },
    { time: "2:30 PM", activity: "Startup Pitches: Batch 2 (5 companies)" },
    { time: "3:30 PM", activity: "Investor Panel Q&A" },
    { time: "4:00 PM", activity: "Closing Remarks & Networking" },
  ],
  speakers: [
    { name: "Jane Doe", title: "Partner, Future Ventures" },
    { name: "John Smith", title: "CTO, AI Innovations Corp" },
    { name: "Alex Ray", title: "Founder & CEO, ScaleAI (Alum)" },
  ],
};

const EventDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // For this example, we'll display the mock data but use the ID in the title
    // to show it's dynamic.
    const pageTitle = id?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || mockEventDetail.title;

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="mb-6 text-sm">
                        <Link to="/events" className="text-gray-500 hover:text-gray-700">Events</Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-gray-800 font-medium">{pageTitle}</span>
                    </nav>

                    {/* Event Header */}
                    <div className="border-b border-gray-200 pb-8 mb-8">
                        <h1 className="text-4xl font-bold font-heading text-gray-900">{pageTitle}</h1>
                        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
                            <p><strong className="font-semibold text-gray-800">Date:</strong> {mockEventDetail.date}</p>
                            <p><strong className="font-semibold text-gray-800">Time:</strong> {mockEventDetail.time}</p>
                            <p><strong className="font-semibold text-gray-800">Location:</strong> {mockEventDetail.location}</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8 text-lg text-gray-700">
                        <div>
                            <h2 className="text-2xl font-bold font-heading text-gray-800 mb-3">About this Event</h2>
                            <p>{mockEventDetail.description}</p>
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-bold font-heading text-gray-800 mb-3">Schedule</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                {mockEventDetail.schedule.map(item => (
                                    <li key={item.time}><strong className="font-semibold">{item.time}:</strong> {item.activity}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold font-heading text-gray-800 mb-3">Featured Speakers</h2>
                             <ul className="list-disc pl-5 space-y-2">
                                {mockEventDetail.speakers.map(speaker => (
                                    <li key={speaker.name}><strong className="font-semibold">{speaker.name}</strong>, {speaker.title}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="mt-10">
                        <a 
                            href="#" 
                            className="inline-block w-full text-center bg-brand-orange text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 shadow-lg"
                        >
                            Register Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;