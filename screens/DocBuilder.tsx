
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateOnePager, generateInvestorUpdate } from '../services/ai/investor';
import { OnePagerContent, InvestorUpdateContent } from '../services/ai/types';

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const WandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>;

const DocBuilder: React.FC = () => {
    const [docType, setDocType] = useState<'one-pager' | 'update' | null>(null);
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Form State for Update
    const [updateData, setUpdateData] = useState({
        currentMRR: '12000',
        prevMRR: '10000',
        currentUsers: '150',
        prevUsers: '100',
        wins: 'Closed huge partnership with TechCorp. Launched v2.0.',
        blockers: 'Need to hire a senior engineer. Marketing spend is inefficient.',
    });

    // Results
    const [onePagerResult, setOnePagerResult] = useState<OnePagerContent | null>(null);
    const [updateResult, setUpdateResult] = useState<InvestorUpdateContent | null>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            if (docType === 'one-pager') {
                // In a real app, we'd pull this from the startup profile state
                const mockProfile = { name: "Sun AI", description: "AI platform for startups" }; 
                const result = await generateOnePager(mockProfile);
                setOnePagerResult(result);
            } else {
                const result = await generateInvestorUpdate(
                    { mrr: updateData.currentMRR, active_users: updateData.currentUsers }, 
                    { mrr: updateData.prevMRR, active_users: updateData.prevUsers }, 
                    `Wins: ${updateData.wins}\nBlockers: ${updateData.blockers}`
                );
                setUpdateResult(result);
            }
            setStep(3);
        } catch (e) {
            console.error(e);
            alert("Failed to generate document.");
        } finally {
            setIsGenerating(false);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6 animate-fade-in-up">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-brand-blue">What do you want to create?</h2>
                <p className="text-gray-500 mt-2">Select a document type to get started.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                    onClick={() => { setDocType('one-pager'); setStep(2); }}
                    className="flex flex-col items-center p-8 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-orange hover:shadow-lg transition-all group"
                >
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4 group-hover:bg-orange-50 group-hover:text-brand-orange transition-colors">
                        <FileTextIcon />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">One-Pager</h3>
                    <p className="text-sm text-gray-500 text-center mt-2">A standardized, single-page summary of your startup for intro emails.</p>
                </button>
                <button 
                    onClick={() => { setDocType('update'); setStep(2); }}
                    className="flex flex-col items-center p-8 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-orange hover:shadow-lg transition-all group"
                >
                    <div className="p-4 bg-green-50 text-green-600 rounded-full mb-4 group-hover:bg-orange-50 group-hover:text-brand-orange transition-colors">
                        <SendIcon />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Investor Update</h3>
                    <p className="text-sm text-gray-500 text-center mt-2">A recurring email update comparing metrics and sharing wins/losses.</p>
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in-up">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-brand-blue">
                    {docType === 'one-pager' ? 'Confirm Startup Profile' : 'Enter Update Details'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Gemini 3 uses this context to draft your document.
                </p>
            </div>

            {docType === 'one-pager' ? (
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                        <p><strong>Note:</strong> For this demo, we will use the default "Sun AI" startup profile data to generate your One-Pager.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Previous MRR ($)</label>
                            <input 
                                type="number" 
                                value={updateData.prevMRR} 
                                onChange={(e) => setUpdateData({...updateData, prevMRR: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current MRR ($)</label>
                            <input 
                                type="number" 
                                value={updateData.currentMRR} 
                                onChange={(e) => setUpdateData({...updateData, currentMRR: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Previous Active Users</label>
                            <input 
                                type="number" 
                                value={updateData.prevUsers} 
                                onChange={(e) => setUpdateData({...updateData, prevUsers: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Active Users</label>
                            <input 
                                type="number" 
                                value={updateData.currentUsers} 
                                onChange={(e) => setUpdateData({...updateData, currentUsers: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Key Wins & Highlights</label>
                        <textarea 
                            value={updateData.wins} 
                            onChange={(e) => setUpdateData({...updateData, wins: e.target.value})}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blockers & Asks</label>
                        <textarea 
                            value={updateData.blockers} 
                            onChange={(e) => setUpdateData({...updateData, blockers: e.target.value})}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"
                        />
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-between">
                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-800 font-medium">Back</button>
                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-brand-orange text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isGenerating ? 'Gemini Thinking...' : (
                        <>
                            <WandIcon /> Generate {docType === 'one-pager' ? 'One-Pager' : 'Update'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-brand-blue">Your Draft is Ready</h2>
                <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="text-gray-600 hover:text-brand-orange font-medium">Create New</button>
                    <button className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">Export PDF</button>
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200 min-h-[600px]">
                {docType === 'one-pager' && onePagerResult && (
                    <div className="space-y-6 font-sans">
                        <div className="border-b border-gray-200 pb-6">
                            <h1 className="text-3xl font-extrabold text-gray-900">{onePagerResult.headline}</h1>
                            <div className="flex gap-4 mt-2 text-gray-500">
                                <a href={`https://${onePagerResult.contact_info.website}`} className="hover:text-brand-orange">{onePagerResult.contact_info.website}</a>
                                <span>•</span>
                                <a href={`mailto:${onePagerResult.contact_info.email}`} className="hover:text-brand-orange">{onePagerResult.contact_info.email}</a>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-8">
                            <div className="col-span-2 space-y-6">
                                <section>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Problem</h4>
                                    <p className="text-gray-800 leading-relaxed">{onePagerResult.problem_summary}</p>
                                </section>
                                <section>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Solution</h4>
                                    <p className="text-gray-800 leading-relaxed">{onePagerResult.solution_summary}</p>
                                </section>
                                <section>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Market</h4>
                                    <p className="text-gray-800 leading-relaxed">{onePagerResult.market_opportunity}</p>
                                </section>
                            </div>
                            <div className="col-span-1 bg-gray-50 p-6 rounded-lg h-fit">
                                <section className="mb-6">
                                    <h4 className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-3">Traction</h4>
                                    <ul className="space-y-2">
                                        {onePagerResult.traction_highlights.map((t, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm font-bold text-gray-800">
                                                <span className="text-green-500">✓</span> {t}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                                <section className="mb-6">
                                    <h4 className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">Business Model</h4>
                                    <p className="text-sm text-gray-600">{onePagerResult.business_model}</p>
                                </section>
                                <section>
                                    <h4 className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">The Ask</h4>
                                    <p className="text-lg font-bold text-brand-blue">{onePagerResult.ask}</p>
                                </section>
                            </div>
                        </div>
                    </div>
                )}

                {docType === 'update' && updateResult && (
                    <div className="max-w-2xl mx-auto font-sans text-gray-800">
                        <div className="mb-8 pb-6 border-b border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">Subject Line:</p>
                            <h2 className="text-xl font-semibold">{updateResult.subject_line}</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-lg">
                            <span className="text-2xl">{updateResult.status_emoji}</span>
                            <p className="font-medium">{updateResult.status_summary}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-3">KPI Summary</h3>
                            <div className="whitespace-pre-wrap bg-slate-50 p-4 rounded-lg font-mono text-sm border border-slate-200">
                                {updateResult.kpi_summary}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-3 text-green-700">Highlights</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                {updateResult.highlights.map((h, i) => <li key={i}>{h}</li>)}
                            </ul>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-3 text-red-700">Lowlights</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                {updateResult.lowlights.map((l, i) => <li key={i}>{l}</li>)}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-3 text-brand-orange">Asks</h3>
                            <p>{updateResult.ask}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-8">
                <Link to="/dashboard/investor-docs" className="text-gray-500 hover:text-brand-orange transition-colors">
                    <ArrowLeftIcon />
                </Link>
                <h1 className="text-2xl font-bold text-brand-blue">Document Builder</h1>
            </div>

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </div>
    );
};

export default DocBuilder;
