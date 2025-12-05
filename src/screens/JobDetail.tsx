
import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { getJobById, applyForJob, Job } from '../../services/jobService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { MapPin, Clock, Briefcase, DollarSign, Building2, ArrowLeft } from 'lucide-react';

const { useParams, Link, useNavigate } = ReactRouterDOM;

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const navigate = useNavigate();
    
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [showApplyForm, setShowApplyForm] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getJobById(id);
                setJob(data);
            } catch (error) {
                console.error("Failed to fetch job", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        
        if (!user) {
            navigate('/login', { state: { from: `/jobs/${id}` } });
            return;
        }

        setIsApplying(true);
        try {
            await applyForJob(id, coverLetter);
            success("Application submitted successfully!");
            setShowApplyForm(false);
            setCoverLetter('');
        } catch (err) {
            toastError(err instanceof Error ? err.message : "Failed to submit application.");
        } finally {
            setIsApplying(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!job) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
            <p className="text-gray-500 mb-6">The job posting you are looking for may have been removed or expired.</p>
            <Link to="/jobs" className="text-brand-orange font-bold hover:underline">Browse All Jobs</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FBF8F5] py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Header */}
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <Link to="/jobs" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-orange mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Jobs
                    </Link>
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex items-start gap-5">
                             <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400 shadow-sm">
                                {job.startupLogo.startsWith('http') ? <img src={job.startupLogo} alt={job.startupName} className="w-full h-full object-contain rounded-xl" /> : job.startupLogo}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-brand-blue mb-2">{job.title}</h1>
                                <div className="flex items-center gap-2 text-lg text-gray-700 font-medium">
                                    <Building2 className="w-5 h-5 text-gray-400" />
                                    {job.startupName}
                                </div>
                            </div>
                        </div>
                        
                        {!showApplyForm && (
                            <button 
                                onClick={() => user ? setShowApplyForm(true) : navigate('/login', { state: { from: `/jobs/${id}` } })}
                                className="bg-brand-orange text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-brand-orange/20 transform hover:-translate-y-0.5"
                            >
                                Apply Now
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200/50">
                         <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                            <MapPin className="w-4 h-4 text-brand-orange" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                            <Briefcase className="w-4 h-4 text-brand-blue" /> {job.type}
                        </span>
                        {job.salaryRange && (
                            <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                                <DollarSign className="w-4 h-4 text-green-600" /> {job.salaryRange}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 ml-auto">
                            <Clock className="w-4 h-4" /> Posted {new Date(job.postedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10">
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <h3 className="text-xl font-bold text-brand-blue mb-4">About the Role</h3>
                        <div className="whitespace-pre-line">{job.description}</div>
                        
                        {/* Mock content sections for better layout visualization if description is short */}
                        {!job.description.includes('Responsibilities') && (
                            <>
                                <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">What you'll do</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Collaborate with cross-functional teams to define, design, and ship new features.</li>
                                    <li>Ensure the performance, quality, and responsiveness of applications.</li>
                                    <li>Identify and correct bottlenecks and fix bugs.</li>
                                </ul>

                                <h3 className="text-xl font-bold text-brand-blue mt-8 mb-4">Requirements</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>3+ years of experience in software development.</li>
                                    <li>Strong proficiency in TypeScript and React.</li>
                                    <li>Experience with AI/LLM integration is a plus.</li>
                                </ul>
                            </>
                        )}
                    </div>
                </div>

                {/* Application Form */}
                {showApplyForm && (
                    <div className="p-8 bg-gray-50 border-t border-gray-200 animate-fade-in-up">
                        <h3 className="text-xl font-bold text-brand-blue mb-6">Submit your application</h3>
                        <form onSubmit={handleApply} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Cover Letter / Note</label>
                                <textarea
                                    required
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    rows={6}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                    placeholder="Tell us why you're a great fit..."
                                />
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    type="submit" 
                                    disabled={isApplying}
                                    className="bg-brand-orange text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isApplying ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : 'Send Application'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowApplyForm(false)}
                                    className="bg-white border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetail;
