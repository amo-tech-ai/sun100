
import React from 'react';
import { Link } from 'react-router-dom';

const mockUpcomingEvent = {
    title: "Rhythm & Beats Music Festival",
    image: "https://storage.googleapis.com/aistudio-hosting/event-placeholders/upcoming.jpg",
    date: "Apr 20, 2029",
    location: "Sunset Park, Los Angeles, CA",
    link: "/events/1"
};

export const UpcomingEvent: React.FC = () => (
    <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 group h-full flex flex-col">
        <div className="relative rounded-xl overflow-hidden aspect-[16/9] flex-shrink-0">
            <img src={mockUpcomingEvent.image} alt={mockUpcomingEvent.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block border border-white/20">Networking</span>
                        <h4 className="font-bold text-lg leading-tight">{mockUpcomingEvent.title}</h4>
                    </div>
                    <div className="text-center bg-brand-orange rounded-lg p-2 min-w-[45px] shadow-lg">
                        <span className="block text-[10px] font-bold text-white uppercase">Apr</span>
                        <span className="block text-lg font-extrabold leading-none">20</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
             <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-4">
                <span className="opacity-75">📍</span> {mockUpcomingEvent.location}
            </p>
            <Link to={mockUpcomingEvent.link} className="block w-full py-2 text-center text-xs font-bold text-gray-700 bg-gray-50 rounded-lg hover:bg-brand-blue hover:text-white transition-all border border-gray-200 hover:border-brand-blue">
                View Details
            </Link>
        </div>
    </div>
);
