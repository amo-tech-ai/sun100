import React from 'react';
import { Link } from 'react-router-dom';

const MyEvents: React.FC = () => {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">My Events</h1>
                 <Link
                    to="/dashboard/events/new"
                    className="inline-block bg-[#E87C4D] text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-md"
                >
                    + Create Event
                </Link>
            </div>
             <div className="bg-white p-6 md:p-8 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold mb-2">No Events Created</h2>
                <p className="text-gray-600">
                Click the "Create Event" button to set up your first community event.
                </p>
            </div>
        </div>
    );
};

export default MyEvents;
