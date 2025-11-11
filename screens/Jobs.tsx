import React from 'react';
import { Link } from 'react-router-dom';

const Jobs: React.FC = () => {
    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md prose max-w-4xl mx-auto">
            <h1>AI Startup Job Board</h1>
            <p>This is a placeholder page for a career board for AI startups.</p>
             <ul>
                <li><Link to="/jobs/1">Job Detail Page (Example)</Link></li>
            </ul>
        </div>
    );
};

export default Jobs;
