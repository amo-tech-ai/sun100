import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { templates } from '../styles/templates';
import UrlInput from '../components/UrlInput';
import TemplateSelector from '../components/TemplateSelector';

// --- ICONS ---
const InfoIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
const CheckIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>;
const UploadIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;

// --- STEP COMPONENTS ---
const stepsConfig = [
    { id: 1, title: 'Business Context' },
    { id: 2, title: 'Deck Type' },
    { id: 3, title: 'Visual Theme' },
    { id: 4, title: 'Company Details' }
];

const ProgressIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="w-full lg:w-auto lg:h-full flex lg:flex-col items-start lg:justify-center gap-4 lg:gap-8 p-4 lg:p-0">
        {stepsConfig.map(step => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
                <div key={step.id} className="flex lg:flex-col items-center gap-3 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isActive ? 'bg-brand-orange text-white ring-4 ring-brand-orange/20' : isCompleted ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {isCompleted ? <CheckIcon className="w-4 h-4" /> : step.id}
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-400 hidden lg:block">Step {step.id}</p>
                        <p className={`font-semibold text-sm transition-colors ${isActive || isCompleted ? 'text-brand-blue' : 'text-gray-400'}`}>{step.title}</p>
                    </div>
                </div>
            );
        })}
    </div>
);

const WizardSteps: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // --- STATE MANAGEMENT ---
    const [step, setStep] = useState(1);

    // Step 1 State
    const [businessContext, setBusinessContext] = useState('Sun AI is a startup that uses generative AI to create pitch decks for early-stage companies. We leverage large language models to analyze business context and generate compelling narratives, financial projections, and slide designs automatically.');
    const [urls, setUrls] = useState<string[]>([]);

    // Step 2 State
    const [deckType, setDeckType] = useState('Investor Pitch');
    
    // Step 3 State
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('default');

    // Step 4 State
    const [companyName, setCompanyName] = useState('');
    const [industry, setIndustry] = useState('');
    const [customerType, setCustomerType] = useState('');
    const [revenueModel, setRevenueModel] = useState('');
    const [stage, setStage] = useState('Pre-seed');
    const [traction, setTraction] = useState('');

    // Global State
    const [loading, setLoading] = useState(false);
    const [animationClass, setAnimationClass] = useState('animate-fade-in');

    useEffect(() => {
        if (location.state?.fundingGoal) {
            const goal = location.state.fundingGoal.trim();
            if (goal) {
                const formattedGoal = /^\d+$/.test(goal.replace(/,/g, ''))
                    ? `$${parseInt(goal.replace(/,/g, ''), 10).toLocaleString()}`
                    : goal;
                setTraction(prev => `Our primary goal for this pitch is to secure funding of ${formattedGoal}.\n` + prev);
            }
        }
    }, [location.state]);

    // --- NAVIGATION ---
    const handleNext = () => {
        if (step < 4) {
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
        const isGenerateDisabled = loading || (!businessContext.trim() && urls.length === 0);
        if (isGenerateDisabled) {
            setLoading(false);
            return;
        }
        
        const generationPayload = {
            businessContext,
            urls,
            deckType,
            theme: selectedTemplate,
            companyDetails: {
                name: companyName,
                industry,
                customerType,
                revenueModel,
                stage,
                traction,
            }
        };
        
        navigate('/pitch-decks/generating', { state: { generationPayload }});
    };

    // --- RENDER LOGIC ---
    const renderStepContent = () => {
        switch (step) {
            case 1: return <Step1Content companyDetails={businessContext} setCompanyDetails={setBusinessContext} urls={urls} setUrls={setUrls} />;
            case 2: return <Step2Content deckType={deckType} setDeckType={setDeckType} />;
            case 3: return <Step3Content selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />;
            case 4: return <Step4Content {...{ companyName, setCompanyName, industry, setIndustry, customerType, setCustomerType, revenueModel, setRevenueModel, stage, setStage, traction, setTraction }} />;
            default: return null;
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto pb-24 md:pb-0">
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes fade-out { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-10px); } }
                .animate-fade-out { animation: fade-out 0.3s ease-in forwards; }
            `}</style>

            <header className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-brand-blue mb-2">Pitch Deck Wizard</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Let's craft the perfect pitch for your startup, step by step.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Progress Indicator */}
                <aside className="lg:col-span-3 lg:sticky top-28">
                     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <ProgressIndicator currentStep={step} />
                     </div>
                </aside>
                
                {/* Main Content */}
                <main className={`lg:col-span-9 ${animationClass}`}>
                    {renderStepContent()}
                </main>
            </div>
            
            {/* Desktop Navigation */}
            <div className="mt-8 pt-6 border-t border-gray-200 hidden md:flex justify-between items-center">
                <button onClick={handleBack} disabled={step === 1} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    &larr; Back
                </button>
                {step < 4 ? (
                    <button onClick={handleNext} className="bg-brand-orange text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition">
                        Next &rarr;
                    </button>
                ) : (
                    <button onClick={handleGenerate} disabled={loading} className="bg-brand-orange text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition shadow-lg shadow-brand-orange/30 disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center">
                        {loading ? 'Generating...' : 'Generate Pitch Deck'}
                    </button>
                )}
            </div>
            
             {/* Mobile Sticky Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 flex justify-between gap-4 z-40">
                 <button onClick={handleBack} disabled={step === 1} className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg disabled:opacity-50">
                    Back
                </button>
                {step < 4 ? (
                    <button onClick={handleNext} className="flex-1 bg-brand-orange text-white font-bold py-3 rounded-lg">
                        Next
                    </button>
                ) : (
                     <button onClick={handleGenerate} disabled={loading} className="flex-1 bg-brand-orange text-white font-bold py-3 rounded-lg disabled:bg-gray-400">
                        {loading ? 'Generating...' : 'Generate'}
                    </button>
                )}
            </div>
        </div>
    );
};

// --- STEP 1 COMPONENT ---
const Step1Content: React.FC<{ companyDetails: string; setCompanyDetails: (s: string) => void; urls: string[]; setUrls: (u: string[]) => void; }> = ({ companyDetails, setCompanyDetails, urls, setUrls }) => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-brand-blue">1. Provide Business Context</h2>
                <p className="mt-1 text-sm text-gray-500">Provide a brief, business plan, or any details about your company. The more information you provide, the better the AI can tailor your pitch deck.</p>
                <textarea
                    value={companyDetails}
                    onChange={(e) => setCompanyDetails(e.target.value)}
                    className="mt-4 w-full h-48 p-3 rounded border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition"
                    placeholder="e.g., Sun AI is a startup that uses generative AI..."
                />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-brand-blue">2. Generate from Website URLs</h2>
                <p className="mt-1 text-sm text-gray-500">Or, provide up to 5 URLs. Our AI will crawl these pages to gather context. If business context is also provided above, it will be prioritized.</p>
                <div className="mt-4">
                     <UrlInput urls={urls} setUrls={setUrls} />
                </div>
            </div>
        </div>
        <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center sticky top-28">
                 <h3 className="font-semibold text-brand-blue mb-4">How it Works</h3>
                <svg viewBox="0 0 100 50" className="w-full">
                    <circle cx="15" cy="25" r="10" fill="#E87C4D" fillOpacity="0.1" />
                    <text x="15" y="26" textAnchor="middle" dy=".3em" fontSize="5" fill="#1E29B" fontWeight="bold">Input</text>
                    <path d="M 26 25 L 44 25" stroke="#E87C4D" strokeWidth="1" strokeDasharray="2 2" />
                    <text x="35" y="21" fontSize="4" fill="#E87C4D">&rarr;</text>
                    <circle cx="50" cy="25" r="10" fill="#E87C4D" fillOpacity="0.1" />
                    <text x="50" y="26" textAnchor="middle" dy=".3em" fontSize="5" fill="#1E293B" fontWeight="bold">AI</text>
                    <path d="M 61 25 L 79 25" stroke="#E87C4D" strokeWidth="1" strokeDasharray="2 2" />
                    <text x="70" y="21" fontSize="4" fill="#E87C4D">&rarr;</text>
                    <rect x="85" y="20" width="10" height="10" rx="1" fill="#1E293B" fillOpacity="0.8" />
                    <text x="90" y="26" textAnchor="middle" dy=".3em" fontSize="3" fill="white">Deck</text>
                </svg>
                 <div className="mt-4 text-sm bg-blue-50/50 text-brand-blue p-3 rounded-md flex items-start gap-3">
                    <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/>
                    <span>Provide as much detail as possible. The AI will use this context to generate a narrative, suggest visuals, and create a compelling story for investors.</span>
                </div>
            </div>
        </div>
    </div>
);

// --- STEP 2 COMPONENT ---
const deckTypes = ['Investor Pitch', 'Accelerator', 'Product Launch', 'Sales Deck', 'Go-to-Market', 'Custom'];
const Step2Content: React.FC<{ deckType: string; setDeckType: (s: string) => void; }> = ({ deckType, setDeckType }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-brand-blue">Select Deck Type</h2>
        <p className="mt-1 text-sm text-gray-500">Choose the primary goal of your presentation. This helps the AI tailor the tone and structure.</p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {deckTypes.map(type => (
                <button key={type} onClick={() => setDeckType(type)} className={`p-4 rounded-lg border-2 text-center font-semibold transition-all duration-200 ${deckType === type ? 'bg-brand-orange/10 border-brand-orange text-brand-orange shadow-inner' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                    {type}
                </button>
            ))}
        </div>
    </div>
);

// --- STEP 3 COMPONENT ---
const Step3Content: React.FC<{ selectedTemplate: keyof typeof templates; setSelectedTemplate: (k: keyof typeof templates) => void; }> = ({ selectedTemplate, setSelectedTemplate }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-brand-blue">Select a Visual Theme</h2>
        <p className="mt-1 text-sm text-gray-500">Choose a theme for your presentation. The AI will adapt the visual suggestions to match your selected style.</p>
        <div className="mt-4">
            <TemplateSelector selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
        </div>
    </div>
);

// --- STEP 4 COMPONENT ---
const Step4Content: React.FC<any> = ({ companyName, setCompanyName, industry, setIndustry, customerType, setCustomerType, revenueModel, setRevenueModel, stage, setStage, traction, setTraction }) => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-brand-blue mb-4">Company Details</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} className="mt-1 w-full p-2 border rounded-md border-gray-300 focus:ring-brand-orange focus:border-brand-orange" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                        <input type="text" id="industry" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g., SaaS, FinTech" className="mt-1 w-full p-2 border rounded-md border-gray-300 focus:ring-brand-orange focus:border-brand-orange" />
                    </div>
                     <div>
                        <label htmlFor="stage" className="block text-sm font-medium text-gray-700">Stage</label>
                        <select id="stage" value={stage} onChange={e => setStage(e.target.value)} className="mt-1 w-full p-2 border rounded-md border-gray-300 focus:ring-brand-orange focus:border-brand-orange bg-white">
                            <option>Pre-seed</option>
                            <option>Seed</option>
                            <option>Series A</option>
                            <option>Growth</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="customerType" className="block text-sm font-medium text-gray-700">Customer Type</label>
                        <input type="text" id="customerType" value={customerType} onChange={e => setCustomerType(e.target.value)} placeholder="e.g., B2B, B2C, Enterprise" className="mt-1 w-full p-2 border rounded-md border-gray-300 focus:ring-brand-orange focus:border-brand-orange" />
                    </div>
                     <div>
                        <label htmlFor="revenueModel" className="block text-sm font-medium text-gray-700">Revenue Model</label>
                        <input type="text" id="revenueModel" value={revenueModel} onChange={e => setRevenueModel(e.target.value)} placeholder="e.g., Subscription, Marketplace" className="mt-1 w-full p-2 border rounded-md border-gray-300 focus:ring-brand-orange focus:border-brand-orange" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="traction" className="block text-sm font-medium text-gray-700">Key Traction (Optional)</label>
                    <textarea id="traction" value={traction} onChange={e => setTraction(e.target.value)} rows={3} placeholder="e.g., 1000+ waitlist signups, $10k MRR" className="mt-1 w-full p-2 border rounded-md border-gray-300 focus:ring-brand-orange focus:border-brand-orange"></textarea>
                </div>
            </div>
        </div>
         <div className="md:col-span-2">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center sticky top-28">
                <h3 className="font-semibold text-brand-blue mb-4">Upload Your Logo</h3>
                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-brand-orange hover:bg-orange-50/50 transition-colors">
                    <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-400">PNG, JPG, or SVG</p>
                </div>
                 <div className="mt-4 text-sm bg-blue-50/50 text-brand-blue p-3 rounded-md flex items-start gap-3">
                    <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/>
                    <span>Providing structured details helps our AI create a more accurate and compelling financial and market analysis for your deck.</span>
                </div>
            </div>
        </div>
    </div>
);

export default WizardSteps;