
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { templates } from '../styles/templates';
import UrlInput from '../components/UrlInput';
import TemplateSelector from '../components/TemplateSelector';
import { FinancialSettings } from '../services/ai/deck';

// --- ICONS ---
const InfoIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
const CheckIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>;
const SparklesIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const BrainCircuitIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a3 3 0 1 1 5.997.129 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 9a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 18 18Z"/><path d="M12 5v13"/><path d="M9 13h6"/><path d="M12 18h6"/></svg>;
const TrendingUpIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const ChevronDownIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>;

// --- STEP CONFIGURATION ---
const stepsConfig = [
    { id: 1, title: 'Strategy & Financials' },
    { id: 2, title: 'Visual Theme' }
];

const ProgressIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="p-4 lg:p-0">
        {/* Desktop Stepper */}
        <div className="hidden lg:block relative">
            <div className="absolute left-4 top-4 -bottom-4 w-0.5 bg-gray-200" aria-hidden="true" />
            <ul className="space-y-8">
                {stepsConfig.map(step => {
                    const isCompleted = step.id < currentStep;
                    const isActive = step.id === currentStep;
                    return (
                        <li key={step.id} className="flex items-center gap-4">
                            <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                isCompleted ? 'bg-brand-orange text-white scale-100' : 
                                isActive ? 'bg-brand-orange text-white ring-4 ring-brand-orange/20 scale-110' : 
                                'bg-white border-2 border-gray-300 text-gray-500'
                            }`}>
                                {isCompleted ? <CheckIcon className="w-4 h-4" /> : step.id}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Step {step.id}</p>
                                <p className={`font-semibold text-base ${isActive || isCompleted ? 'text-brand-blue' : 'text-gray-500'}`}>{step.title}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>

        {/* Mobile Stepper */}
        <div className="lg:hidden">
            <div className="flex justify-between items-center mb-4">
                {stepsConfig.map((step, index) => {
                    const isCompleted = step.id < currentStep;
                    const isActive = step.id === currentStep;
                    return (
                         <div key={step.id} className="flex items-center gap-2">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                                isCompleted ? 'bg-brand-orange text-white' : 
                                isActive ? 'bg-brand-orange text-white ring-4 ring-brand-orange/20' : 
                                'bg-gray-200 text-gray-500'
                            }`}>
                                {isCompleted ? <CheckIcon className="w-4 h-4" /> : step.id}
                            </div>
                            <span className={`text-sm font-medium ${isActive ? 'text-brand-blue' : 'text-gray-500'}`}>{step.title}</span>
                            {index < stepsConfig.length - 1 && <div className="w-8 h-0.5 bg-gray-200 mx-2" />}
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
);


const WizardSteps: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // --- STATE MANAGEMENT ---
    const [step, setStep] = useState(1);
    const totalSteps = stepsConfig.length;

    // Text & URL Inputs
    const [businessContext, setBusinessContext] = useState('Sun AI is a startup that uses generative AI to create pitch decks for early-stage companies. We leverage large language models to analyze business context and generate compelling narratives, financial projections, and slide designs automatically.');
    const [urls, setUrls] = useState<string[]>([]);
    
    // Financial Inputs
    const [financials, setFinancials] = useState<FinancialSettings>({
        industry: 'SaaS',
        revenueModel: 'Subscription',
        currentRevenue: '0',
        pricePoint: '',
        customerGrowthRate: '10',
        costStructure: { burnRate: '', marketingBudget: '' },
        timeHorizon: '36',
        currency: 'USD'
    });

    // AI Config
    const [useThinking, setUseThinking] = useState(true);

    // Theme
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('default');

    // Global State
    const [loading, setLoading] = useState(false);
    const [animationClass, setAnimationClass] = useState('animate-fade-in');

    useEffect(() => {
        if (location.state?.fundingGoal) {
            // Existing logic to pre-fill from dashboard
        }
    }, [location.state]);

    // --- NAVIGATION ---
    const handleNext = () => {
        if (step < totalSteps) {
            if (!businessContext.trim() && urls.length === 0) {
                alert("Please provide a business description or at least one URL.");
                return;
            }
            setAnimationClass('animate-fade-out');
            setTimeout(() => {
                setStep(s => s + 1);
                setAnimationClass('animate-fade-in');
            }, 300);
        }
    };
    
    const handleBack = () => {
        if (step > 1) {
             setAnimationClass('animate-fade-out');
            setTimeout(() => {
                setStep(s => s - 1);
                setAnimationClass('animate-fade-in');
            }, 300);
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        
        const generationPayload = {
            businessContext,
            urls,
            deckType: 'Investor Pitch', // Defaulting to Investor Pitch for 2-step flow simplicity
            theme: selectedTemplate,
            financials: financials, // Pass the structured financials
            // Passing Gemini 3 config preferences
            config: {
                model: 'gemini-3-pro-preview',
                thinking_level: useThinking ? 'high' : 'low',
            },
            // Legacy props
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
    const renderStepContent = () => {
        switch (step) {
            case 1: return <Step1Content 
                            businessContext={businessContext} 
                            setBusinessContext={setBusinessContext} 
                            urls={urls} 
                            setUrls={setUrls} 
                            useThinking={useThinking}
                            setUseThinking={setUseThinking}
                            financials={financials}
                            setFinancials={setFinancials}
                           />;
            case 2: return <Step2Content selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />;
            default: return null;
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto pb-24 md:pb-0 px-4 sm:px-6 lg:px-8 pt-8">
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes fade-out { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-10px); } }
                .animate-fade-out { animation: fade-out 0.3s ease-in forwards; }
            `}</style>

            <header className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-extrabold text-brand-blue mb-3 tracking-tight">Pitch Deck Wizard</h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">Craft a professional investor deck in minutes using Gemini 3.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Progress Indicator */}
                <aside className="lg:col-span-3 lg:sticky top-28">
                     <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/60">
                        <ProgressIndicator currentStep={step} />
                        
                        <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-sm text-gray-700">
                            <p className="font-bold text-indigo-900 mb-1 flex items-center gap-2">
                                <BrainCircuitIcon className="w-4 h-4" />
                                Gemini 3 Mode
                            </p>
                             {useThinking ? "Deep Reasoning enabled. Expect highly strategic financial projections." : "Standard generation enabled."}
                        </div>
                     </div>
                </aside>
                
                {/* Main Content */}
                <main className={`lg:col-span-9 ${animationClass}`}>
                    {renderStepContent()}
                </main>
            </div>
            
            {/* Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
                    <button 
                        onClick={handleBack} 
                        disabled={step === 1} 
                        className="bg-white border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex-1 md:flex-none"
                    >
                        &larr; Back
                    </button>
                    
                    {step < totalSteps ? (
                        <button 
                            onClick={handleNext} 
                            className="bg-brand-orange text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 transition shadow-lg shadow-brand-orange/20 flex-1 md:flex-none"
                        >
                            Next: Choose Theme &rarr;
                        </button>
                    ) : (
                        <button 
                            onClick={handleGenerate} 
                            disabled={loading} 
                            className="bg-brand-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 transition shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 flex-1 md:flex-none disabled:bg-gray-400 disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Generating...
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
            
            {/* Spacer for fixed footer */}
            <div className="h-24"></div>
        </div>
    );
};

// --- STEP 1 COMPONENT ---
const Step1Content: React.FC<{ 
    businessContext: string; 
    setBusinessContext: (s: string) => void; 
    urls: string[]; 
    setUrls: (u: string[]) => void; 
    useThinking: boolean;
    setUseThinking: (b: boolean) => void;
    financials: FinancialSettings;
    setFinancials: React.Dispatch<React.SetStateAction<FinancialSettings>>;
}> = ({ businessContext, setBusinessContext, urls, setUrls, useThinking, setUseThinking, financials, setFinancials }) => {
    
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleFinancialChange = (field: keyof FinancialSettings, value: string) => {
        setFinancials(prev => ({ ...prev, [field]: value }));
    };

    const handleCostChange = (field: keyof FinancialSettings['costStructure'], value: string) => {
         setFinancials(prev => ({ ...prev, costStructure: { ...prev.costStructure, [field]: value } }));
    };

    return (
    <div className="space-y-8">
        {/* Section A: Context & Strategy */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue">
                    <span className="font-bold text-lg">1</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-brand-blue">Strategy & Context</h2>
                    <p className="text-sm text-gray-500">Tell us about your company or provide a URL.</p>
                </div>
            </div>
            <textarea
                value={businessContext}
                onChange={(e) => setBusinessContext(e.target.value)}
                className="w-full h-32 p-4 rounded-xl border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition resize-none text-base mb-4"
                placeholder="e.g., Sun AI is a platform that helps founders..."
            />
            <div className="mb-2">
                <span className="text-sm font-semibold text-gray-700">Or add URLs for context:</span>
            </div>
            <UrlInput urls={urls} setUrls={setUrls} />
        </div>

        {/* Section B: Financial Parameters */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <TrendingUpIcon className="w-32 h-32 text-brand-orange" />
             </div>
             <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <span className="font-bold text-lg">$</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-brand-blue">Financial Projections</h2>
                    <p className="text-sm text-gray-500">We'll generate a 5-year revenue forecast slide based on these inputs.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <select 
                        value={financials.industry} 
                        onChange={(e) => handleFinancialChange('industry', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    >
                        <option value="SaaS">SaaS</option>
                        <option value="Marketplace">Marketplace</option>
                        <option value="Ecommerce">E-commerce</option>
                        <option value="FinTech">FinTech</option>
                        <option value="HealthTech">HealthTech</option>
                        <option value="Consumer App">Consumer App</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Revenue Model</label>
                    <select 
                        value={financials.revenueModel} 
                        onChange={(e) => handleFinancialChange('revenueModel', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    >
                        <option value="Subscription">Subscription / SaaS</option>
                        <option value="Transaction Fees">Transaction Fees</option>
                        <option value="Marketplace Commission">Marketplace Commission</option>
                        <option value="One-time Sales">One-time Sales</option>
                        <option value="Ads / Sponsorship">Ads / Sponsorship</option>
                        <option value="Freemium">Freemium -> Upsell</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pricing (Avg/Mo)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <input 
                            type="number"
                            value={financials.pricePoint}
                            onChange={(e) => handleFinancialChange('pricePoint', e.target.value)}
                            placeholder="e.g. 29"
                            className="w-full p-3 pl-7 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Starting Revenue (ARR)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <input 
                            type="number"
                            value={financials.currentRevenue}
                            onChange={(e) => handleFinancialChange('currentRevenue', e.target.value)}
                            placeholder="0"
                            className="w-full p-3 pl-7 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        />
                    </div>
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                        <span>Monthly Growth Rate Assumption</span>
                        <span className="text-brand-orange font-bold">{financials.customerGrowthRate}%</span>
                    </label>
                    <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        value={financials.customerGrowthRate} 
                        onChange={(e) => handleFinancialChange('customerGrowthRate', e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Conservative (1%)</span>
                        <span>Hypergrowth (50%)</span>
                    </div>
                </div>
            </div>
            
            {/* Advanced Toggle */}
             <div className="mt-6 relative z-10">
                <button 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-orange transition-colors"
                >
                    {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
                
                {showAdvanced && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Burn Rate</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">$</span>
                                <input 
                                    type="number"
                                    value={financials.costStructure.burnRate}
                                    onChange={(e) => handleCostChange('burnRate', e.target.value)}
                                    placeholder="e.g. 5000"
                                    className="w-full p-3 pl-7 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Time Horizon</label>
                             <select 
                                value={financials.timeHorizon} 
                                onChange={(e) => handleFinancialChange('timeHorizon', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                            >
                                <option value="12">12 Months</option>
                                <option value="24">24 Months</option>
                                <option value="36">36 Months</option>
                                <option value="60">5 Years</option>
                            </select>
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                             <select 
                                value={financials.currency} 
                                onChange={(e) => handleFinancialChange('currency', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="CAD">CAD ($)</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Gemini 3 Feature Toggle */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 flex items-start sm:items-center justify-between gap-4">
            <div>
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                    <BrainCircuitIcon className="w-5 h-5 text-indigo-600" />
                    Gemini 3 Deep Reasoning
                </h3>
                <p className="text-indigo-700 text-sm mt-1">Enable extended thinking time for higher quality, more strategic slide content.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" checked={useThinking} onChange={(e) => setUseThinking(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
        </div>
    </div>
)};

// --- STEP 2 COMPONENT ---
const Step2Content: React.FC<{
    selectedTemplate: keyof typeof templates;
    setSelectedTemplate: (k: keyof typeof templates) => void;
}> = ({ selectedTemplate, setSelectedTemplate }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
         <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-brand-orange">
                <SparklesIcon className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-brand-blue">Select Visual Theme</h2>
                <p className="text-gray-500 text-sm">Choose a style that matches your brand identity.</p>
            </div>
        </div>
        <div className="mt-4">
            <TemplateSelector selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
        </div>
         <div className="mt-8 text-sm bg-blue-50 text-brand-blue p-4 rounded-xl flex items-start gap-3">
            <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/>
            <span>The AI will adapt its image generation prompts to match your selected theme (e.g., "Cyberpunk" vs "Minimalist").</span>
        </div>
    </div>
);

export default WizardSteps;
