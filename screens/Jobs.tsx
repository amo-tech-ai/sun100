import React from 'react';
import { Link } from 'react-router-dom';

const Jobs: React.FC = () => (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-heading text-gray-800">AI Career Board</h1>
        <p className="mt-4 text-lg text-gray-600">This is the job listing page. Content is coming soon.</p>
        <div className="mt-8">
            <Link to="/jobs/mock-job-1" className="text-brand-orange hover:underline">View Example Job</Link>
        </div>
    </div>
);

export default Jobs;
