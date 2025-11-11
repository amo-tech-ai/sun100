import React from 'react';
import { useParams, Link } from 'react-router-dom';

const EventDetail: React.FC = () => {
    const { id } = useParams();
    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-4xl mx-auto">
            <Link to="/events" className="text-[#E87C4D] hover:underline">&larr; Back to all events</Link>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">Pitch Deck Masterclass: From Idea to Investment</h1>
            <p className="text-lg text-gray-500 mt-2">Date: September 15, 2024</p>
            <p className="text-lg text-gray-500">Location: Virtual</p>
            <div className="prose prose-lg mt-6">
                 <p>This is placeholder content for event #{id}. Join us for a deep-dive workshop on crafting a narrative that investors can't ignore.</p>
                <p>In this session, we will cover the 10 essential slides, how to tell a compelling story with data, and common mistakes to avoid when pitching.</p>
            </div>
            <button className="mt-8 inline-block bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200">
                Register Now
            </button>
        </div>
    );
};

export default EventDetail;
