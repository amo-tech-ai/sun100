
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getMyJobs, getJobApplications, updateApplicationStatus, Job, JobApplication } from '../services/jobService';
import { useToast } from '../contexts/ToastContext';

// Icons
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

const StatusBadge: React.FC<{ status: JobApplication['status'] }> = ({ status }) => {
    const styles = {
        'New': 'bg-blue-50 text-blue-700 border-blue-200',
        'Reviewing': 'bg-yellow-50 text-yellow-700 border-yellow-200',
        'Interview': 'bg-purple-50 text-purple-700 border-purple-200',
        'Offer': 'bg-green-50 text-green-700 border-green-200',
        'Rejected': 'bg-gray-50 text-gray-600 border-gray-200'
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status] || styles['New']}`}>
            {status}
        </span>
    );
};

const ApplicationCard: React.FC<{ 
    app: JobApplication; 
    onUpdateStatus: (id: string, status: JobApplication['status']) => void 
}> = ({ app, onUpdateStatus }) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-gray-900">{app.applicantName}</h3>
                    <p className="text-xs text-gray-500">{app.jobTitle}</p>
                </div>
                <StatusBadge status={app.status} />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 italic mb-4 line-clamp-3">
                "{app.coverLetter}"
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                    <ClockIcon /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                </span>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {app.status !== 'Rejected' && (
                        <button 
                            onClick={() => onUpdateStatus(app.id, 'Rejected')}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Reject"
                        >
                            <XCircleIcon />
                        </button>
                    )}
                    {app.status !== 'Interview' && app.status !== 'Offer' && (
                        <button 
                            onClick={() => onUpdateStatus(app.id, 'Interview')}
                            className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded transition-colors"
                            title="Move to Interview"
                        >
                            <UsersIcon />
                        </button>
                    )}
                    {app.status !== 'Offer' && (
                        <button 
                            onClick={() => onUpdateStatus(app.id, 'Offer')}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Make Offer"
                        >
                            <CheckCircleIcon />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const HiringManager: React.FC = () => {
    const { success, error: toastError } = useToast();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'applicants' | 'jobs'>('applicants');
    const [selectedJobId, setSelectedJobId] = useState<string>('all');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [fetchedJobs, fetchedApps] = await Promise.all([
                    getMyJobs(),
                    getJobApplications()
                ]);
                setJobs(fetchedJobs);
                setApplications(fetchedApps);
            } catch (e) {
                console.error(e);
                toastError("Failed to load hiring data.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleStatusUpdate = async (id: string, status: JobApplication['status']) => {
        // Optimistic Update
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        
        try {
            await updateApplicationStatus(id, status);
            success(`Candidate moved to ${status}`);
        } catch (e) {
            // Revert
            toastError("Failed to update status");
            // In a real app, we would revert the state here by re-fetching
        }
    };

    const filteredApps = useMemo(() => {
        let filtered = applications;
        if (selectedJobId !== 'all') {
            filtered = filtered.filter(a => a.jobId === selectedJobId);
        }
        return filtered;
    }, [applications, selectedJobId]);

    // Stats
    const totalApplicants = applications.length;
    const activeCandidates = applications.filter(a => ['New', 'Reviewing', 'Interview'].includes(a.status)).length;
    const openRoles = jobs.filter(j => j.isActive).length;

    return (
        <div className="min-h-screen bg-[#FBF8F5] p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-blue">Hiring Manager</h1>
                        <p className="text-gray-500 mt-1">Manage your open roles and candidate pipeline.</p>
                    </div>
                    <button className="bg-brand-orange text-white font-bold py-2.5 px-5 rounded-xl hover:bg-opacity-90 shadow-lg shadow-brand-orange/20 transition-all flex items-center gap-2">
                        <BriefcaseIcon /> Post New Job
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Open Roles</p>
                        <p className="text-2xl font-extrabold text-gray-900">{openRoles}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Applicants</p>
                        <p className="text-2xl font-extrabold text-brand-blue">{totalApplicants}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Pipeline</p>
                        <p className="text-2xl font-extrabold text-green-600">{activeCandidates}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6">
                    <div className="flex p-1 bg-gray-100 rounded-lg">
                        <button 
                            onClick={() => setActiveTab('applicants')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'applicants' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Applicants
                        </button>
                        <button 
                            onClick={() => setActiveTab('jobs')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'jobs' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            My Jobs
                        </button>
                    </div>

                    {activeTab === 'applicants' && (
                         <select 
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange w-full sm:w-auto"
                        >
                            <option value="all">All Jobs</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex justify-center py-12">
                         <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : activeTab === 'applicants' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredApps.length > 0 ? (
                            filteredApps.map(app => (
                                <ApplicationCard 
                                    key={app.id} 
                                    app={app} 
                                    onUpdateStatus={handleStatusUpdate} 
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 font-medium">No applications found.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                                    <p className="text-sm text-gray-500">{job.type} • {job.location}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <span className="block font-bold text-xl text-brand-blue">{job.applicantCount}</span>
                                        <span className="text-xs text-gray-400 uppercase font-bold">Applicants</span>
                                    </div>
                                    <Link to={`/jobs/${job.id}`} className="text-gray-400 hover:text-brand-orange">
                                        <ChevronRightIcon />
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {jobs.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 font-medium">You haven't posted any jobs yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HiringManager;
