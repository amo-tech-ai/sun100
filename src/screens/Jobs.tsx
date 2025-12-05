
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getJobs, Job } from '../services/jobService';
import { MapPin, Clock, Briefcase, Search } from 'lucide-react';

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

const JobListing: React.FC<{ job: Job }> = ({ job }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group">
       <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
           {/* Logo */}
           <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 text-lg font-bold text-gray-500 group-hover:border-brand-orange/30 group-hover:text-brand-orange transition-colors">
               {job.startupLogo.startsWith('http') ? (
                   <img src={job.startupLogo} alt={job.startupName} className="w-full h-full object-contain rounded-lg" />
               ) : (
                   job.startupLogo
               )}
           </div>

           {/* Content */}
           <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors">{job.title}</h2>
                        <p className="text-sm font-medium text-brand-orange mb-2">{job.startupName}</p>
                    </div>
                    {job.salaryRange && (
                        <span className="inline-block bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-100">
                            {job.salaryRange}
                        </span>
                    )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.type}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {timeAgo(job.postedAt)}</span>
                </div>
           </div>

           {/* Action */}
           <div className="flex-shrink-0 mt-4 sm:mt-0 self-start sm:self-center">
                <Link to={`/jobs/${job.id}`} className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-5 rounded-lg hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-200 text-sm shadow-sm">
                    View Details
                </Link>
           </div>
       </div>
    </div>
);

const Jobs: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const data = await getJobs();
                setJobs(data);
            } catch (error) {
                console.error("Failed to load jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredAndSortedJobs = useMemo(() => {
        return jobs
            .filter(job => {
                const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                      job.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      job.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesType = filterType === 'All' || job.type === filterType;
                return matchesSearch && matchesType;
            })
            .sort((a, b) => {
                const dateA = new Date(a.postedAt).getTime();
                const dateB = new Date(b.postedAt).getTime();
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });
    }, [jobs, searchTerm, filterType, sortOrder]);

    const jobTypes = ['All', ...Array.from(new Set(jobs.map(j => j.type)))];

    return (
        <div className="min-h-screen bg-[#FBF8F5]">
            <div className="bg-white border-b border-gray-200 py-12 md:py-16 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue mb-4 tracking-tight">Join a Top AI Startup</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Find your next role at a high-growth company in the sun ai startup community.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search by role, company, or keywords..." 
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                         <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded-lg py-2.5 px-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        >
                            {jobTypes.map(type => <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>)}
                        </select>

                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                            className="bg-gray-50 border border-gray-300 rounded-lg py-2.5 px-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Job List */}
                {loading ? (
                     <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-pulse h-32"></div>
                        ))}
                    </div>
                ) : filteredAndSortedJobs.length > 0 ? (
                    <div className="space-y-4">
                        {filteredAndSortedJobs.map(job => (
                            <JobListing key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No jobs found</h3>
                        <p className="text-gray-500">Try adjusting your search filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
