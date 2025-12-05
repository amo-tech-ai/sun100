
import React, { useState, useEffect } from 'react';
import { Job, createJob, updateJob } from '../../services/jobService';

interface JobFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    jobToEdit?: Job;
}

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

export const JobFormModal: React.FC<JobFormModalProps> = ({ isOpen, onClose, onComplete, jobToEdit }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: 'Remote',
        type: 'Full-time',
        salaryRange: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (jobToEdit) {
                setFormData({
                    title: jobToEdit.title,
                    description: jobToEdit.description,
                    location: jobToEdit.location,
                    type: jobToEdit.type,
                    salaryRange: jobToEdit.salaryRange || ''
                });
            } else {
                setFormData({
                    title: '',
                    description: '',
                    location: 'Remote',
                    type: 'Full-time',
                    salaryRange: ''
                });
            }
        }
    }, [isOpen, jobToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (jobToEdit) {
                await updateJob(jobToEdit.id, formData);
            } else {
                await createJob(formData);
            }
            onComplete();
            onClose();
        } catch (error) {
            console.error("Failed to save job:", error);
            alert("Failed to save job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">
                        {jobToEdit ? 'Edit Job Posting' : 'Post New Job'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Title</label>
                            <input 
                                required
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                placeholder="e.g. Senior React Engineer"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                >
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                                <input 
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                    value={formData.location}
                                    onChange={e => setFormData({...formData, location: e.target.value})}
                                    placeholder="e.g. Remote, New York"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Salary Range (Optional)</label>
                            <input 
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                value={formData.salaryRange}
                                onChange={e => setFormData({...formData, salaryRange: e.target.value})}
                                placeholder="e.g. $120k - $160k"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                            <textarea 
                                required
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent min-h-[150px]"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="Describe the role, responsibilities, and requirements..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800">Cancel</button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-6 py-2 bg-brand-blue text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (jobToEdit ? 'Update Job' : 'Post Job')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
