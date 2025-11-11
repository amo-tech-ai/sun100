import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const mockJobs = [
    { id: 1, title: "AI Prompt Engineer", location: "Remote", type: "Full-time", postedDate: "2024-08-20T10:00:00Z" },
    { id: 2, title: "Senior Frontend Developer (React)", location: "San Francisco, CA", type: "Full-time", postedDate: "2024-08-18T14:00:00Z" },
    { id: 3, title: "Product Manager, AI Tools", location: "Remote", type: "Full-time", postedDate: "2024-08-15T09:00:00Z" },
    { id: 4, title: "UX/UI Designer", location: "New York, NY", type: "Contract", postedDate: "2024-08-21T11:00:00Z" },
];

const timeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `Posted ${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `Posted ${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `Posted ${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `Posted ${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `Posted ${Math.floor(interval)} minutes ago`;
    return `Posted ${Math.floor(seconds)} seconds ago`;
};


const JobListing: React.FC<typeof mockJobs[0]> = ({ id, title, location, type, postedDate }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
       <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <div className="flex items-center gap-4 text-gray-500 mt-1">
                <span>{location}</span>
                <span>&bull;</span>
                <span>{type}</span>
                <span>&bull;</span>
                <span className="text-sm">{timeAgo(postedDate)}</span>
            </div>
       </div>
        <Link to={`/jobs/${id}`} className="mt-4 sm:mt-0 inline-block bg-[#E87C4D] text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-200 self-start sm:self-center">
            View Job
        </Link>
    </div>
);

const Jobs: React.FC = () => {
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    const sortedJobs = useMemo(() => {
        return [...mockJobs].sort((a, b) => {
            const dateA = new Date(a.postedDate).getTime();
            const dateB = new Date(b.postedDate).getTime();
            if (sortOrder === 'newest') {
                return dateB - dateA; // Newest first
            } else {
                return dateA - dateB; // Oldest first
            }
        });
    }, [sortOrder]);

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Join a Top AI Startup</h1>
                <p className="text-xl text-gray-600 mt-4">Find your next role at a company in the sun ai startup community.</p>
            </div>

            <div className="flex justify-end mb-6">
                <div className="relative">
                    <label htmlFor="sort-jobs" className="sr-only">Sort by</label>
                    <select
                        id="sort-jobs"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                        className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E87C4D] focus:border-transparent"
                    >
                        <option value="newest">Sort by Newest</option>
                        <option value="oldest">Sort by Oldest</option>
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>

            <div className="space-y-6">
                {sortedJobs.map(job => (
                    <JobListing key={job.id} {...job} />
                ))}
            </div>
        </div>
    );
};

export default Jobs;