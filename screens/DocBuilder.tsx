
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generateOnePager, generateInvestorUpdate, generateInvestmentMemo } from '../services/ai/investor';
import { OnePagerContent, InvestorUpdateContent, InvestmentMemoContent, InvestorDocType } from '../services/ai/types';
import { getLatestMetrics } from '../services/metricsService';
import { saveInvestorDoc } from '../services/investorDocService';
import { DocPreview } from '../components/investor/DocPreview';

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const WandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const PrinterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;

const DocBuilder: React.FC = () => {
    const navigate = useNavigate();
    const [docType, setDocType] = useState<InvestorDocType | null>(null);
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasSavedState, setHasSavedState] = useState(false);
    
    // Form State for Update
    const [updateData, setUpdateData] = useState({
        currentMRR: '',
        prevMRR: '',
        currentUsers: '',
        prevUsers: '',
        wins: 'Closed huge partnership with TechCorp. Launched v2.0.',
        blockers: 'Need to hire a senior engineer. Marketing spend is inefficient.',
    });
    
    // Form State for Memo
    const [memoProfile, setMemoProfile] = useState({
        name: 'Sun AI',
        industry: 'SaaS / AI',
        description: 'An AI-powered platform for startups to generate pitch decks and investor documents.',
        stage: 'Seed',
        traction: '$10k MRR, 500 active users',
        team: 'Ex-Google and Meta engineers.'
    });

    // Results
    const [generatedContent, setGeneratedContent] = useState<OnePagerContent | InvestorUpdateContent | InvestmentMemoContent | null>(null);

    // Load Auto-Saved State on Mount
    useEffect(() => {
        const savedState = localStorage.getItem('doc_builder_draft');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.docType) setDocType(parsed.docType);
                if (parsed.step) setStep(parsed.step);
                if (parsed.updateData) setUpdateData(parsed.updateData);
                if (parsed.memoProfile) setMemoProfile(parsed.memoProfile);
                if (parsed.generatedContent) setGeneratedContent(parsed.generatedContent);
                setHasSavedState(true);
            } catch (e) {
                console.error("Failed to restore draft:", e);
            }
        }
    }, []);

    // Auto-Save Effect
    useEffect(() => {
        if (step > 1) {
            const stateToSave = {
                docType,
                step,
                updateData,
                memoProfile,
                generatedContent
            };
            localStorage.setItem('doc_builder_draft', JSON.stringify(stateToSave));
            setHasSavedState(true);
        }
    }, [docType, step, updateData, memoProfile, generatedContent]);

    const clearDraft = () => {
        localStorage.removeItem('doc_builder_draft');
        setHasSavedState(false);
        setStep(1);
        setDocType(null);
        setGeneratedContent(null);
    };

    // Auto-fill logic for metrics
    useEffect(() => {
        const fetchMetrics = async () => {
            if (docType === 'update' && !updateData.currentMRR) {
                const metrics = await getLatestMetrics(2);
                if (metrics.length > 0) {
                    const latest = metrics[0];
                    const previous = metrics.length > 1 ? metrics[1] : null;
                    
                    setUpdateData(prev => ({
                        ...prev,
                        currentMRR: latest.revenue.toString(),
                        currentUsers: latest.active_users.toString(),
                        prevMRR: previous ? previous.revenue.toString() : prev.prevMRR,
                        prevUsers: previous ? previous.active_users.toString() : prev.prevUsers
                    }));
                }
            }
        };
        fetchMetrics();
    }, [docType]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            let result;
            if (docType === 'one_pager') {
                // In a real app, we'd pull this from the startup profile state
                const mockProfile = { name: "Sun AI", description: "AI platform for startups" }; 
                result = await generateOnePager(mockProfile);
            } else if (docType === 'update') {
                result = await generateInvestorUpdate(
                    { mrr: updateData.currentMRR, active_users: updateData.currentUsers }, 
                    { mrr: updateData.prevMRR, active_users: updateData.prevUsers }, 
                    `Wins: ${updateData.wins}\nBlockers: ${updateData.blockers}`
                );
            } else if (docType === 'memo') {
                result = await generateInvestmentMemo(memoProfile);
            }
            
            setGeneratedContent(result as any);
            setStep(3);
        } catch (e) {
            console.error(e);
            alert("Failed to generate document.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedContent || !docType) return;
        setIsSaving(true);
        try {
            let title = 'Untitled Doc';
            if (docType === 'one_pager') title = (generatedContent as OnePagerContent).headline;
            else if (docType === 'update') title = (generatedContent as InvestorUpdateContent).subject_line;
            else if (docType === 'memo') title = `Investment Memo: ${memoProfile.name}`;

            await saveInvestorDoc({
                title: title,
                type: docType,
                status: 'draft',
                content: generatedContent as any
            });
            
            // Clear auto-save draft after successful save
            clearDraft();
            
            navigate('/dashboard/investor-docs');
        } catch (e) {
            console.error(e);
            alert("Failed to save document.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const renderStep1 = () => (
        <div className="space-y-6 animate-fade-in-up">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-brand-blue">What do you want to create?</h2>
                <p className="text-gray-500 mt-2">Select a document type to get started.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button 
                    onClick={() => { setDocType('one_pager'); setStep(2); }}
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
                 <button 
                    onClick={() => { setDocType('memo'); setStep(2); }}
                    className="flex flex-col items-center p-8 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-orange hover:shadow-lg transition-all group"
                >
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-full mb-4 group-hover:bg-orange-50 group-hover:text-brand-orange transition-colors">
                        <SearchIcon />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Investment Memo</h3>
                    <p className="text-sm text-gray-500 text-center mt-2">A VC-style due diligence memo. Use AI to 'Red Team' your startup.</p>
                </button>
            </div>
            {hasSavedState && step === 1 && (
                <div className="text-center">
                    <button onClick={() => setStep(2)} className="text-sm text-brand-orange hover:underline">
                        Resume draft (Auto-saved)
                    </button>
                </div>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in-up">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-brand-blue">
                        {docType === 'one_pager' && 'Confirm Startup Profile'}
                        {docType === 'update' && 'Enter Update Details'}
                        {docType === 'memo' && 'Analyze Your Startup'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Gemini 3 uses this context to draft your document.
                    </p>
                </div>
                <button onClick={clearDraft} className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1" title="Discard draft">
                    <TrashIcon /> Discard
                </button>
            </div>

            {docType === 'one_pager' && (
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                        <p><strong>Note:</strong> For this demo, we will use the default "Sun AI" startup profile data to generate your One-Pager.</p>
                    </div>
                </div>
            )}

            {docType === 'update' && (
                <div className="space-y-4">
                    <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg text-sm text-orange-800 mb-4">
                         We've pre-filled metrics from your Dashboard. Verify them below.
                    </div>
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

            {docType === 'memo' && (
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Startup Name</label>
                            <input 
                                value={memoProfile.name} 
                                onChange={(e) => setMemoProfile({...memoProfile, name: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                            <input 
                                value={memoProfile.industry} 
                                onChange={(e) => setMemoProfile({...memoProfile, industry: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description / Pitch</label>
                        <textarea 
                            value={memoProfile.description} 
                            onChange={(e) => setMemoProfile({...memoProfile, description: e.target.value})}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Traction (Numbers)</label>
                        <input 
                            value={memoProfile.traction} 
                            onChange={(e) => setMemoProfile({...memoProfile, traction: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                        <input 
                            value={memoProfile.team} 
                            onChange={(e) => setMemoProfile({...memoProfile, team: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md"
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
                            <WandIcon /> Generate {docType === 'one_pager' ? 'One-Pager' : docType === 'update' ? 'Update' : 'Memo'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6 print:hidden">
                <h2 className="text-2xl font-bold text-brand-blue">Your Draft is Ready</h2>
                <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="text-gray-600 hover:text-brand-orange font-medium px-4 py-2">Create New</button>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        {isSaving ? 'Saving...' : <><SaveIcon /> Save Draft</>}
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                    >
                        <PrinterIcon /> Export PDF
                    </button>
                </div>
            </div>
            
            {generatedContent && docType && (
                <DocPreview type={docType} content={generatedContent as any} />
            )}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-8 print:hidden">
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
