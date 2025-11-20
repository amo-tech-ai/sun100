
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { templates } from '../styles/templates';
import UrlInput from '../components/UrlInput';
import TemplateSelector from '../components/TemplateSelector';
import { FinancialSettings, analyzeFundingGoal } from '../services/ai/deck';
import { useWizardStore } from '../stores/wizardStore';
import { FundingAnalysis } from '../services/ai/types';

// --- ICONS ---
const InfoIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
const CheckIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>;
const SparklesIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const BrainCircuitIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a3 3 0 1 1 5.997.129 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 9a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 18 18Z"/><path d="M12 5v13"/><path d="M9 13h6"/><path d="M12 18h6"/></svg>;
const ChevronDownIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>;
const PaletteIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>;

// --- STEP CONFIGURATION ---
const stepsConfig = [
    { id: 1, title: 'Strategy & Context', description: 'Define your business model.' },
    { id: 2, title: 'Visual Aesthetic', description: 'Choose a theme.' }
];

const ProgressIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="mb-10 flex justify-center">
        <div className="flex items-center gap-4">
            {stepsConfig.map((step, index) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;
                return (
                    <React.Fragment key={step.id}>
                        <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm transition-all duration-300 ${
                                isCompleted ? 'bg-brand-orange text-white' : 
                                isActive ? 'bg-brand-orange text-white ring-4 ring-brand-orange/20' : 
                                'bg-gray-200 text-gray-500'
                            }`}>
                                {isCompleted ? <CheckIcon className="w-4 h-4" /> : step.id}
                            </div>
                            <span className={`font-bold text-sm hidden sm:block ${isActive || isCompleted ? 'text-brand-blue' : 'text-gray-400'}`}>{step.title}</span>
                        </div>
                        {index < stepsConfig.length - 1 && (
                            <div className={`w-12 h-0.5 transition-colors duration-300 ${isCompleted ? 'bg-brand-orange' : 'bg-gray-200'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    </div>
);

const WizardSteps: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // --- ZUSTAND STATE ---
    const {
        step,
        direction,
        businessContext,
        urls,
        financials,
        useThinking,
        selectedTemplate,
        setStep,
        setDirection,
        setBusinessContext,
        setUrls,
        updateFinancials,
        setSelectedTemplate
    } = useWizardStore();

    const totalSteps = stepsConfig.length;

    // Local state for loading during navigation/generation initiation
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.fundingGoal) {
             updateFinancials('fundingGoal', location.state.fundingGoal);
        }
    }, [location.state, updateFinancials]);

    // --- NAVIGATION ---
    const handleNext = () => {
        if (step < totalSteps) {
            if (!businessContext.trim() && urls.length === 0) {
                alert("Please provide a business description or at least one URL to proceed.");
                return;
            }
            setDirection('forward');
            setStep(step + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    const handleBack = () => {
        if (step > 1) {
            setDirection('back');
            setStep(step - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        
        const generationPayload = {
            businessContext,
            urls,
            deckType: 'Investor Pitch',
            theme: selectedTemplate,
            financials: financials, 
            config: {
                model: 'gemini-3-pro-preview',
                thinking_level: useThinking ? 'high' : 'low',
            },
            companyDetails: {
                name: 'New Startup',
                industry: financials.industry,
                customerType: 'B2B',
                revenueModel: financials.revenueModel,
                stage: 'Seed',
                traction: ''
            }
        };
        
        navigate('/pitch-decks/generating', { state: { generationPayload }});
    };

    // --- RENDER LOGIC ---
    return (
        <div className="w-full max-w-6xl mx-auto pb-32 md:pb-24 px-4 sm:px-6 lg:px-8 pt-8">
            <style>{`
                .slide-enter { opacity: 0; transform: translateX(${direction === 'forward' ? '20px' : '-20px'}); }
                .slide-enter-active { opacity: 1; transform: translateX(0); transition: opacity 300ms, transform 300ms; }
                .slide-exit { opacity: 1; transform: translateX(0); }
                .slide-exit-active { opacity: 0; transform: translateX(${direction === 'forward' ? '-20px' : '20px'}); transition: opacity 300ms, transform 300ms; }
            `}</style>

            <header className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-brand-blue mb-2 tracking-tight">Pitch Deck Wizard</h1>
                <p className="text-gray-500 text-lg">Let's start with the core of your business. Provide your context and choose a style.</p>
            </header>

            <ProgressIndicator currentStep={step} />

            <div className={`bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden relative min-h-[600px] ${step === 2 ? 'max-w-full' : 'max-w-4xl mx-auto'}`}>
                {/* Step 1: Strategy & Context */}
                {step === 1 && (
                    <div className="animate-fade-in p-8">
                         <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue font-bold text-lg shadow-sm">1</div>
                            <div>
                                <h2 className="text-xl font-bold text-brand-blue">Provide Business Context</h2>
                                <p className="text-sm text-gray-500">The AI uses this to write your story.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Description</label>
                                <textarea
                                    value={businessContext}
                                    onChange={(e) => setBusinessContext(e.target.value)}
                                    className="w-full h-40 p-4 rounded-xl border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition resize-none text-base placeholder-gray-400"
                                    placeholder="e.g., Sun AI is a platform that helps founders create pitch decks 10x faster..."
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-gray-700">Generate from Website URLs</label>
                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
                                </div>
                                <UrlInput urls={urls} setUrls={setUrls} />
                                <p className="text-xs text-gray-500 mt-2">We'll crawl these pages to gather accurate details about your product and market.</p>
                            </div>

                            {/* Collapsible Advanced Section */}
                            <AdvancedSettings />
                        </div>
                    </div>
                )}

                {/* Step 2: Visual Theme */}
                {step === 2 && (
                    <div className="animate-fade-in p-8 md:p-12">
                        {/* Centered Header for Step 2 */}
                        <div className="text-center mb-10 max-w-2xl mx-auto">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 text-brand-orange mb-4 shadow-sm">
                                <PaletteIcon className="w-6 h-6" />
                            </div>
                            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold tracking-wider uppercase">
                                Step 2 of 2
                            </div>
                            <h2 className="text-3xl font-extrabold text-brand-blue mb-3">Define Your Aesthetic</h2>
                            <p className="text-lg text-gray-600">
                                Choose a visual style. Our AI will adapt your content, fonts, and imagery to match this mood.
                            </p>
                        </div>

                        <div className="mb-12">
                            <TemplateSelector selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
                        </div>
                        
                        {/* Smart AI Tip */}
                         <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-5 shadow-sm">
                            <div className="flex-shrink-0 p-3 bg-white rounded-full shadow-sm text-brand-blue">
                                <SparklesIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-brand-blue text-lg mb-1">AI Design Advice</h4>
                                <p className="text-gray-700">
                                    Not sure? <strong>Professional</strong> is our most versatile theme for Seed Rounds, while <strong>Vibrant</strong> performs best for Consumer Apps. You can always change this later in the editor.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
                    <div className="w-32">
                        {step > 1 ? (
                            <button 
                                onClick={handleBack} 
                                className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-100 transition shadow-sm"
                            >
                                &larr; Back
                            </button>
                        ) : <div />}
                    </div>
                    
                    <div className="w-full sm:w-auto flex justify-end">
                        {step < totalSteps ? (
                            <button 
                                onClick={handleNext} 
                                className="w-full sm:w-auto bg-brand-orange text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 transition shadow-lg shadow-brand-orange/20"
                            >
                                Next: Choose Visual Theme &rarr;
                            </button>
                        ) : (
                            <button 
                                onClick={handleGenerate} 
                                disabled={loading} 
                                className="w-full sm:w-auto bg-brand-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 transition shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Crafting Deck...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5" />
                                        Generate Deck
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Extracted Advanced Settings Component
const AdvancedSettings: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [fundingAnalysis, setFundingAnalysis] = useState<FundingAnalysis | null>(null);
    const [isAnalyzingFunding, setIsAnalyzingFunding] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    
    const { financials, updateFinancials, useThinking, setUseThinking } = useWizardStore();

    const handleFinancialChange = (field: keyof FinancialSettings, value: string) => {
        updateFinancials(field, value);
    };

    const handleAnalyzeFunding = async () => {
        if (!financials.fundingGoal || !financials.industry) {
            alert("Please provide a funding goal and industry to analyze.");
            return;
        }
        setIsAnalyzingFunding(true);
        setAnalysisError(null);
        try {
            const analysis = await analyzeFundingGoal(financials.fundingGoal, financials.industry);
            setFundingAnalysis(analysis);
        } catch (err) {
             setAnalysisError(err instanceof Error ? err.message : "Analysis failed.");
        } finally {
            setIsAnalyzingFunding(false);
        }
    }

    return (
        <div className="border-t border-gray-200 pt-4 mt-6">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-brand-orange transition-colors w-full text-left"
            >
                {isOpen ? 'Hide' : 'Show'} Advanced Strategy & Financials
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="mt-6 space-y-6 animate-fade-in">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                            <select 
                                value={financials.industry} 
                                onChange={(e) => handleFinancialChange('industry', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                            >
                                <option value="SaaS">SaaS</option>
                                <option value="Marketplace">Marketplace</option>
                                <option value="Ecommerce">E-commerce</option>
                                <option value="FinTech">FinTech</option>
                                <option value="HealthTech">HealthTech</option>
                            </select>
                            {financials.industry === 'FinTech' && (
                                <p className="text-xs text-gray-500 mt-1">
                                    FinTech is an ideal example to showcase Gemini 3's reasoning capabilities in generating complex financial models and ensuring data accuracy for investor-grade presentations.
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Revenue Model</label>
                            <select 
                                value={financials.revenueModel} 
                                onChange={(e) => handleFinancialChange('revenueModel', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                            >
                                <option value="Subscription">Subscription / SaaS</option>
                                <option value="Transaction Fees">Transaction Fees</option>
                                <option value="Marketplace Commission">Marketplace Commission</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Avg. Monthly Price ($)</label>
                            <input 
                                type="number"
                                value={financials.pricePoint}
                                onChange={(e) => handleFinancialChange('pricePoint', e.target.value)}
                                placeholder="e.g. 29"
                                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current ARR ($)</label>
                            <input 
                                type="number"
                                value={financials.currentRevenue}
                                onChange={(e) => handleFinancialChange('currentRevenue', e.target.value)}
                                placeholder="0"
                                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Funding Goal ($)</label>
                             <div className="flex gap-2">
                                <input 
                                    type="text"
                                    value={financials.fundingGoal || ''}
                                    onChange={(e) => handleFinancialChange('fundingGoal', e.target.value)}
                                    placeholder="1,500,000"
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
                                />
                                <button
                                    onClick={handleAnalyzeFunding}
                                    disabled={isAnalyzingFunding || !financials.fundingGoal}
                                    className="bg-blue-600 text-white font-bold px-4 py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                                    title="Analyze Funding Goal"
                                >
                                    {isAnalyzingFunding ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                         <BrainCircuitIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Result */}
                    {analysisError && <p className="text-red-600 text-sm">{analysisError}</p>}
                    {fundingAnalysis && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                            <h4 className="font-bold text-blue-800 flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4" />
                                AI Funding Strategy
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {fundingAnalysis.investorTypes.map((type, i) => (
                                    <span key={i} className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded border border-blue-200">{type}</span>
                                ))}
                            </div>
                            <p className="text-sm text-blue-900">{fundingAnalysis.strategicAdvice}</p>
                             <div>
                                <p className="text-xs font-bold text-blue-800 uppercase mb-1">Next Steps:</p>
                                <ul className="list-disc pl-4 text-sm text-blue-900 space-y-1">
                                    {fundingAnalysis.nextSteps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Gemini 3 Feature Toggle */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                                <BrainCircuitIcon className="w-4 h-4 text-indigo-600" />
                                Gemini 3 Deep Reasoning
                            </h3>
                            <p className="text-indigo-700 text-xs mt-1">Enable extended thinking time for a more strategic narrative.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input type="checkbox" checked={useThinking} onChange={(e) => setUseThinking(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WizardSteps;
