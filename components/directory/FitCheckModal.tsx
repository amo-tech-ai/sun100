
import React, { useState } from 'react';
import { Investor } from '../../services/vcService';
import { matchInvestor } from '../../services/ai/vcMatcher';
import { VCMatchAnalysis } from '../../services/ai/types';

interface FitCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    investor: Investor;
}

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const CheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const AlertCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;

export const FitCheckModal: React.FC<FitCheckModalProps> = ({ isOpen, onClose, investor }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VCMatchAnalysis | null>(null);
    const [formData, setFormData] = useState({
        industry: 'Fintech',
        stage: 'Seed',
        ask: '2000000',
        description: 'An AI-powered financial planning tool for SMBs.'
    });

    if (!isOpen) return null;

    const handleAnalyze = async () => {
        setLoading(true);
        const mockStartup = {
            name: "My Startup",
            industry: formData.industry,
            stage: formData.stage,
            location: "US",
            fundingAsk: parseInt(formData.ask) || 0,
            description: formData.description,
            traction: "Pre-revenue"
        };

        const res = await matchInvestor(mockStartup, investor);
        setResult(res);
        setLoading(false);
        setStep(2);
    };

    const scoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 border-green-500 bg-green-50';
        if (score >= 50) return 'text-yellow-600 border-yellow-500 bg-yellow-50';
        return 'text-red-600 border-red-500 bg-red-50';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <BrainIcon />
                        AI Deal Memo: <span className="text-brand-blue">{investor.name}</span>
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
                                Gemini 3 will act as an Investment Analyst to stress-test your fit with this firm before you apply.
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
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Stage</label>
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

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Funding Ask ($)</label>
                                <input 
                                    type="number" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                    value={formData.ask}
                                    onChange={e => setFormData({...formData, ask: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Startup Pitch</label>
                                <textarea 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && result && (
                        <div className="space-y-6 animate-fade-in-up">
                            {/* Score Header */}
                            <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div className={`w-24 h-24 rounded-full border-8 flex items-center justify-center flex-shrink-0 ${scoreColor(result.matchScore)}`}>
                                    <div className="text-center">
                                        <span className="text-2xl font-extrabold block text-gray-900">{result.matchScore}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{result.status}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{result.reasoning}</p>
                                </div>
                            </div>

                            {/* Alignment Grid */}
                            <div className="grid grid-cols-4 gap-2 text-center">
                                {[
                                    { label: 'Stage', pass: result.alignment.stage },
                                    { label: 'Check Size', pass: result.alignment.check_size },
                                    { label: 'Industry', pass: result.alignment.industry },
                                    { label: 'Geo', pass: result.alignment.geo },
                                ].map((item, i) => (
                                    <div key={i} className={`p-3 rounded-lg border ${item.pass ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                        <div className="flex justify-center mb-1">
                                            {item.pass ? <CheckCircle /> : <AlertCircle />}
                                        </div>
                                        <span className={`text-xs font-bold ${item.pass ? 'text-green-700' : 'text-red-700'}`}>{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-gray-900 font-bold text-sm mb-3 uppercase tracking-wide">Strengths</h4>
                                    <ul className="space-y-2">
                                        {result.strengths.map((s, i) => (
                                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2 bg-green-50/50 p-2 rounded">
                                                <span className="text-green-500 font-bold">✓</span>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-gray-900 font-bold text-sm mb-3 uppercase tracking-wide">Risks & Gaps</h4>
                                    <ul className="space-y-2">
                                        {result.risks.map((w, i) => (
                                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2 bg-red-50/50 p-2 rounded">
                                                <span className="text-red-500 font-bold">!</span>
                                                {w}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-brand-blue/5 p-4 rounded-xl border border-brand-blue/10">
                                <h4 className="text-brand-blue font-bold text-sm mb-2 flex items-center gap-2">
                                    <BrainIcon /> Recommended Strategy
                                </h4>
                                <p className="text-sm text-gray-700">{result.recommendedAction}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    {step === 1 ? (
                        <>
                            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800">Cancel</button>
                            <button 
                                onClick={handleAnalyze} 
                                disabled={loading}
                                className="px-6 py-2 bg-brand-orange text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Gemini Thinking...
                                    </>
                                ) : 'Run Fit Analysis'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setStep(1)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800">Check Another</button>
                            <button onClick={onClose} className="px-6 py-2 bg-brand-blue text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors">Done</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
