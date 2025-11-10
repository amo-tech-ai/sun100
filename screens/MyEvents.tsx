import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Icon ---
const CalendarPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M10 16h4"/><path d="M12 14v4"/></svg>;

const MyEvents: React.FC = () => {
    const [activeTab, setActiveTab] = useState('upcoming');

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl lg:text-3xl font-bold font-heading text-gray-800 mb-6">My Events</h1>

            {/* --- Tabs --- */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm ${
                            activeTab === 'upcoming'
                                ? 'border-[#E87C4D] text-[#E87C4D]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Upcoming (0)
                    </button>
                    <button
                         onClick={() => setActiveTab('past')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm ${
                            activeTab === 'past'
                                ? 'border-[#E87C4D] text-[#E87C4D]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Past (0)
                    </button>
                </nav>
            </div>

            {/* --- Content Area --- */}
            <div>
                {activeTab === 'upcoming' && (
                    <div className="bg-white p-12 rounded-lg shadow-md border border-gray-200/80 text-center">
                        <div className="text-gray-300 w-16 h-16 mx-auto mb-4"><CalendarPlusIcon/></div>
                        <h3 className="text-lg font-bold text-gray-800">No upcoming events yet</h3>
                        <p className="text-gray-500 mt-1 mb-6">You haven’t registered for any upcoming events yet.</p>
                        <Link 
                            to="/events"
                            className="inline-block bg-[#E87C4D] text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            Browse Events
                        </Link>
                    </div>
                )}
                 {activeTab === 'past' && (
                    <div className="bg-white p-12 rounded-lg shadow-md border border-gray-200/80 text-center">
                        <div className="text-gray-300 w-16 h-16 mx-auto mb-4"><CalendarPlusIcon/></div>
                        <h3 className="text-lg font-bold text-gray-800">No past events</h3>
                        <p className="text-gray-500 mt-1">Events you've attended will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEvents;