
import React, { useState, useEffect } from 'react';
import { Investor, getInvestors } from '../../services/vcService';
import { findBestInvestors } from '../../services/ai/vcMatcher';
import { RankedInvestor, StartupProfile } from '../../services/ai/types';
import { Link } from 'react-router-dom';

interface MatchmakingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

export const MatchmakingModal: React.FC<MatchmakingModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState<RankedInvestor[]>([]);
    const [allInvestors, setAllInvestors] = useState<Investor[]>([]);
    
    // Form State
    const [formData, setFormData] = useState<StartupProfile>({
        name: 'My Startup',
        industry: 'B2B SaaS',
        stage: 'Seed',
        location: 'US',
        fundingAsk: 1000000,
        description: 'An AI-powered platform for automating enterprise workflows.',
        traction: 'Launch phase, early pilot users.'
    });

    useEffect(() => {
        // Load investors for matching context
        getInvestors().then(setAllInvestors);
    }, []);

    if (!isOpen) return null;

    const handleMatch = async () => {
        if (allInvestors.length === 0) {
            alert("No investors loaded to match against.");
            return;
        }
        setLoading(true);
        try {
            const results = await findBestInvestors(formData, allInvestors);
            setMatches(results.matches);
            setStep(2);
        } catch (error) {
            console.error(error);
            alert("Failed to find matches. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const scoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-gray-600 bg-gray-50 border-gray-200';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-brand-blue flex items-center gap-2">
                        <SparklesIcon />
                        Find My Investors
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                                <p className="font-semibold mb-1">How it works:</p>
                                Gemini 3 will analyze your profile against our entire directory to find the top 5 investors that fit your stage, sector, and check size.
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Startup Name</label>
                                    <input 
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Industry</label>
                                        <input 
                                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                            value={formData.industry}
                                            onChange={e => setFormData({...formData, industry: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stage</label>
                                        <select 
                                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                            value={formData.stage}
                                            onChange={e => setFormData({...formData, stage: e.target.value})}
                                        >
                                            <option value="Pre-Seed">Pre-Seed</option>
                                            <option value="Seed">Seed</option>
                                            <option value="Series A">Series A</option>
                                            <option value="Series B">Series B</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                                        <input 
                                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                            value={formData.location}
                                            onChange={e => setFormData({...formData, location: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Funding Ask ($)</label>
                                        <input 
                                            type="number"
                                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                            value={formData.fundingAsk}
                                            onChange={e => setFormData({...formData, fundingAsk: parseInt(e.target.value) || 0})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pitch / Description</label>
                                    <textarea 
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-fade-in-up">
                            <h3 className="font-bold text-gray-800 mb-4">Top 5 Matches for {formData.name}</h3>
                            {matches.map((match, i) => (
                                <div key={match.investorId} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex-shrink-0 text-center w-12">
                                        <div className="text-gray-400 font-bold text-xs mb-1">#{i + 1}</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-brand-blue text-lg">{match.investorName}</h4>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${scoreColor(match.matchScore)}`}>
                                                {match.matchScore}% Match
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{match.reasoning}</p>
                                        <Link to={`/directory/${match.investorId}`} className="text-sm font-semibold text-brand-orange hover:underline">
                                            View Profile &rarr;
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {matches.length === 0 && (
                                <div className="text-center py-8 text-gray-500">No strong matches found. Try adjusting your criteria.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    {step === 1 ? (
                        <>
                            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800">Cancel</button>
                            <button 
                                onClick={handleMatch} 
                                disabled={loading}
                                className="px-6 py-2 bg-brand-orange text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Finding Matches...
                                    </>
                                ) : 'Match Me'}
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className="px-6 py-2 bg-brand-blue text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors">Done</button>
                    )}
                </div>
            </div>
        </div>
    );
};
