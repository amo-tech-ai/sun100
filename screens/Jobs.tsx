import React from 'react';
import { Link } from 'react-router-dom';

const mockJobs = [
    { id: 1, title: "AI Prompt Engineer", location: "Remote", type: "Full-time" },
    { id: 2, title: "Senior Frontend Developer (React)", location: "San Francisco, CA", type: "Full-time" },
    { id: 3, title: "Product Manager, AI Tools", location: "Remote", type: "Full-time" },
    { id: 4, title: "UX/UI Designer", location: "New York, NY", type: "Contract" },
];

const JobListing: React.FC<typeof mockJobs[0]> = ({ id, title, location, type }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between">
       <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-1">{location} &bull; {type}</p>
       </div>
        <Link to={`/jobs/${id}`} className="inline-block bg-[#E87C4D] text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-200">
            View Job
        </Link>
    </div>
);

const Jobs: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Join a Top AI Startup</h1>
                <p className="text-xl text-gray-600 mt-4">Find your next role at a company in the Sun AI community.</p>
            </div>
            <div className="space-y-6">
                {mockJobs.map(job => (
                    <JobListing key={job.id} {...job} />
                ))}
            </div>
        </div>
    );
};

export default Jobs;
