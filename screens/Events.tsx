import React from 'react';
import { Link } from 'react-router-dom';

const Events: React.FC = () => {
    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md prose max-w-4xl mx-auto">
            <h1>Community Events</h1>
            <p>This is a placeholder page for listing upcoming community events.</p>
             <ul>
                <li><Link to="/events/1">Event Detail Page (Example)</Link></li>
            </ul>
        </div>
    );
};

export default Events;
