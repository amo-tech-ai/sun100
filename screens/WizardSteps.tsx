
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useWizardStore } from '../stores/wizardStore';
import UrlInput from '../components/UrlInput';
import TemplateSelector from '../components/TemplateSelector';
import { FinancialSettings } from '../services/ai/deck';
import { templates } from '../styles/templates';

const { useNavigate } = ReactRouterDOM;

// --- ICONS ---
const SparklesIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const ArrowRightIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const CheckIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>;
const GlobeIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const PaletteIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>;
const SlidersIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/></svg>;
const BriefcaseIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const ShoppingBagIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;

// --- PROGRESS HEADER ---
const stepsConfig = [
    { id: 1, title: 'Context', icon: <GlobeIcon /> },
    { id: 2, title: 'Aesthetic', icon: <PaletteIcon /> },
    { id: 3, title: 'Details', icon: <BriefcaseIcon /> },
    { id: 4, title: 'Financials', icon: <SlidersIcon /> }
];

// --- HELPER COMPONENTS FOR STEP 3 ---
interface PillButtonProps {
    label: string;
    selected: boolean;
    onClick: () => void;
    multi?: boolean;
}

const PillButton: React.FC<PillButtonProps> = ({ 
    label, 
    selected, 
    onClick,
    multi = false 
}) => (
    <button
        onClick={onClick}
        type="button"
        className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border shadow-sm
            ${selected 
                ? 'bg-brand-orange text-white border-brand-orange ring-2 ring-brand-orange/20 transform scale-105' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange/50 hover:text-brand-orange'
            }
        `}
    >
        {label}
        {selected && multi && <span className="ml-2 text-white/80">✓</span>}
    </button>
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-bold text-brand-blue mb-4">{children}</h3>
);

const WizardSteps: React.FC = () => {
    const navigate = useNavigate();
    const {
        step,
        setStep,
        businessContext,
        setBusinessContext,
        urls,
        setUrls,
        selectedTemplate,
        setSelectedTemplate,
        financials,
        updateFinancials,
        useThinking,
        setUseThinking,
        // Step 3 State
        startupType,
        setStartupType,
        stage,
        setStage,
        primaryFocus,
        setPrimaryFocus,
        teamSize,
        setTeamSize,
        tractionStage,
        setTractionStage,
        // Deck Type
        deckType,
        setDeckType
    } = useWizardStore();

    const [loading, setLoading] = useState(false);

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const handleNext = () => {
        if (step === 1 && !businessContext.trim() && urls.length === 0) {
            alert("Please provide a description or a URL to proceed.");
            return;
        }
        if (step === 3) {
            // Basic validation for Step 3
            if (startupType.length === 0) {
                alert("Please select at least one Startup Type.");
                return;
            }
            if (primaryFocus.length === 0) {
                alert("Please select at least one Main Focus.");
                return;
            }
        }
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleGenerate = () => {
        setLoading(true);
        const generationPayload = {
            businessContext,
            urls,
            deckType, // Use the selected deck type
            theme: selectedTemplate,
            financials,
            config: {
                model: 'gemini-3-pro-preview',
                thinking_level: useThinking ? 'high' : 'low',
            },
            companyDetails: {
                name: 'New Startup',
                industry: startupType.join(', '),
                customerType: 'B2B',
                revenueModel: financials.revenueModel,
                stage: stage,
                traction: tractionStage,
                focus: primaryFocus.join(', '),
                teamSize: teamSize
            }
        };
        // Navigate immediately; GeneratingScreen handles the async call
        navigate('/pitch-decks/generating', { state: { generationPayload }});
    };

    // Step 3 Logic Helpers
    const toggleSelection = (list: string[], item: string, max?: number) => {
        if (list.includes(item)) {
            return list.filter(i => i !== item);
        } else {
            if (max && list.length >= max) return list;
            return [...list, item];
        }
    };

    const formatFundingGoal = (val: number) => {
        if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M+`;
        return `$${(val / 1000).toFixed(0)}k`;
    };

    return (
        <div className="min-h-screen bg-[#FBF8F5] font-display pb-32">
            {/* 1. Header & Progress */}
            <header className="sticky top-0 z-40 bg-[#FBF8F5]/80 backdrop-blur-md border-b border-gray-200/50 pt-4 pb-4 px-4 sm:px-8">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-brand-orange/10 p-2 rounded-lg">
                            <SparklesIcon className="text-brand-orange w-5 h-5" />
                        </div>
                        <span className="font-bold text-brand-blue text-sm tracking-wide uppercase">Pitch Wizard</span>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-4">
                        {stepsConfig.map((s, i) => {
                            const isActive = s.id === step;
                            const isCompleted = s.id < step;
                            return (
                                <div key={s.id} className="flex items-center gap-2">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                                        isActive ? 'bg-brand-blue text-white shadow-lg scale-110' : 
                                        isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        {isCompleted ? <CheckIcon /> : <span className="text-xs font-bold">{s.id}</span>}
                                    </div>
                                    <span className={`hidden sm:block text-xs font-bold uppercase tracking-wider ${isActive ? 'text-brand-blue' : 'text-gray-400'}`}>
                                        {s.title}
                                    </span>
                                    {i < stepsConfig.length - 1 && (
                                        <div className="w-4 sm:w-8 h-0.5 bg-gray-200 mx-1 sm:mx-2 rounded-full" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* 2. Main Content Area */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
                
                {/* STEP 1: CONTEXT (Chat Interface) */}
                {step === 1 && (
                    <div className="animate-fade-in-up max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue mb-4 tracking-tight">
                                Tell me about your business.
                            </h1>
                            <p className="text-lg text-gray-500">
                                I'll use this to structure your narrative, financials, and market slides.
                            </p>
                        </div>

                        {/* Deck Type Selection */}
                        <div className="mb-8 flex justify-center gap-4">
                            <button
                                onClick={() => setDeckType('Investor Pitch')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${deckType === 'Investor Pitch' ? 'bg-brand-blue text-white border-brand-blue shadow-lg' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                            >
                                <BriefcaseIcon className={deckType === 'Investor Pitch' ? 'text-white' : 'text-gray-400'} />
                                Investor Pitch
                            </button>
                            <button
                                onClick={() => setDeckType('Sales Deck')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${deckType === 'Sales Deck' ? 'bg-brand-orange text-white border-brand-orange shadow-lg' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                            >
                                <ShoppingBagIcon className={deckType === 'Sales Deck' ? 'text-white' : 'text-gray-400'} />
                                Sales Deck
                            </button>
                        </div>

                        {/* Chat Input Bubble */}
                        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-brand-blue/5 border border-gray-100 relative mb-8 group focus-within:ring-4 focus-within:ring-brand-orange/10 transition-all">
                            <textarea
                                value={businessContext}
                                onChange={(e) => setBusinessContext(e.target.value)}
                                className="w-full min-h-[160px] p-6 text-lg text-gray-800 placeholder-gray-300 border-none resize-none focus:ring-0 rounded-xl bg-transparent"
                                placeholder={deckType === 'Sales Deck' ? "e.g. We sell CRM software to dentists. Our product saves them 20 hours a week..." : "e.g. We are building 'Airbnb for Campervans'. We take a 15% commission. We have 500 hosts on the waitlist..."}
                                autoFocus
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-gray-300 font-medium">
                                {businessContext.length} chars
                            </div>
                        </div>

                        {/* URL Input Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><GlobeIcon /></div>
                                <div>
                                    <h3 className="font-bold text-gray-800">Have a website?</h3>
                                    <p className="text-sm text-gray-500">We can crawl it to extract features and pricing.</p>
                                </div>
                            </div>
                            <UrlInput urls={urls} setUrls={setUrls} />
                        </div>
                    </div>
                )}

                {/* STEP 2: AESTHETIC (Visual Gallery) */}
                {step === 2 && (
                    <div className="animate-fade-in-up">
                        <div className="text-center mb-10">
                            <span className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-2 block">Step 2 of 4</span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-blue mb-3">
                                Define Your Aesthetic
                            </h1>
                            <p className="text-gray-500 max-w-xl mx-auto">
                                Choose a visual theme. The AI will adapt fonts, layouts, and image generation styles to match.
                            </p>
                        </div>
                        <TemplateSelector selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
                    </div>
                )}

                {/* STEP 3: STARTUP DETAILS (New Screen) */}
                {step === 3 && (
                    <div className="animate-fade-in-up max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <span className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-2 block">Step 3 of 4</span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-blue mb-3">
                                Tell Us About Your Business
                            </h1>
                            <p className="text-gray-500">
                                These details help the AI tailor your {deckType.toLowerCase()} narrative and financial projections.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-10">
                            
                            {/* Row 1: Type */}
                            <div>
                                <SectionLabel>What type of business is this? <span className="text-gray-400 text-sm font-normal ml-2">(Select all that apply)</span></SectionLabel>
                                <div className="flex flex-wrap gap-3">
                                    {['AI SaaS', 'Marketplace', 'B2B SaaS', 'Consumer App', 'Fintech', 'Creator / Media', 'Hardware', 'Other'].map(type => (
                                        <PillButton 
                                            key={type} 
                                            label={type} 
                                            selected={startupType.includes(type)} 
                                            onClick={() => setStartupType(toggleSelection(startupType, type))} 
                                            multi 
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Row 2: Stage */}
                            <div>
                                <SectionLabel>What stage are you at?</SectionLabel>
                                <div className="flex flex-wrap gap-3">
                                    {['Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A+', 'Growth'].map(s => (
                                        <PillButton 
                                            key={s} 
                                            label={s} 
                                            selected={stage === s} 
                                            onClick={() => setStage(s)} 
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Row 3: Focus */}
                            <div>
                                <SectionLabel>What is your main focus for this deck? <span className="text-gray-400 text-sm font-normal ml-2">(Max 3)</span></SectionLabel>
                                <div className="flex flex-wrap gap-3">
                                    {['Raising capital', 'Selling to Customers', 'Joining an accelerator', 'Closing customers', 'Updating existing investors', 'Internal strategy', 'Recruiting'].map(f => (
                                        <PillButton 
                                            key={f} 
                                            label={f} 
                                            selected={primaryFocus.includes(f)} 
                                            onClick={() => setPrimaryFocus(toggleSelection(primaryFocus, f, 3))} 
                                            multi
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Row 4: Team & Traction (Grid) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <SectionLabel>Team Size</SectionLabel>
                                    <div className="flex flex-wrap gap-2">
                                        {['Solo', '2–5', '6–15', '16+'].map(size => (
                                            <PillButton 
                                                key={size} 
                                                label={size} 
                                                selected={teamSize === size} 
                                                onClick={() => setTeamSize(size)} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <SectionLabel>Traction</SectionLabel>
                                    <div className="flex flex-wrap gap-2">
                                        {['Pre-launch', 'Early users', 'Paying customers', 'Growing revenue'].map(t => (
                                            <PillButton 
                                                key={t} 
                                                label={t} 
                                                selected={tractionStage === t} 
                                                onClick={() => setTractionStage(t)} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Row 5: Funding Slider (Only show for Investor Pitch) */}
                            {deckType === 'Investor Pitch' && (
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <SectionLabel>Target Raise Amount</SectionLabel>
                                        <span className="text-2xl font-bold text-brand-orange">{formatFundingGoal(parseInt(financials.fundingGoal || '500000'))}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="100000" 
                                        max="5000000" 
                                        step="100000"
                                        value={financials.fundingGoal || '500000'}
                                        onChange={(e) => updateFinancials('fundingGoal', e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                                        <span>$100k</span>
                                        <span>$1M</span>
                                        <span>$5M+</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 4: FINANCIALS (Refine) */}
                {step === 4 && (
                    <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="col-span-full text-center mb-6">
                             <span className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-2 block">Step 4 of 4</span>
                             <h1 className="text-3xl md:text-4xl font-extrabold text-brand-blue">
                                Final Details
                            </h1>
                        </div>

                        {/* Left Column: Forms */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Revenue Model */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-bold text-brand-blue mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    Business Model Deep Dive
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Revenue Model</label>
                                        <select 
                                            value={financials.revenueModel}
                                            onChange={(e) => updateFinancials('revenueModel', e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent transition font-medium"
                                        >
                                            <option>Subscription</option>
                                            <option>Transaction Fees</option>
                                            <option>Marketplace Commission</option>
                                            <option>One-time Purchase</option>
                                            <option>Ad-supported</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Avg Price / Deal Size ($)</label>
                                        <input 
                                            type="number" 
                                            value={financials.pricePoint}
                                            onChange={(e) => updateFinancials('pricePoint', e.target.value)}
                                            placeholder="49"
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent transition font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Gemini 3 Thinking Toggle */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <SparklesIcon /> Gemini 3 Deep Reasoning
                                    </h3>
                                    <p className="text-indigo-100 text-sm mt-1">Enable for complex strategic analysis (takes ~10s longer).</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={useThinking} onChange={(e) => setUseThinking(e.target.checked)} className="sr-only peer" />
                                    <div className="w-14 h-8 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-white/30"></div>
                                </label>
                            </div>
                        </div>

                        {/* Right Column: Summary Sticky */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-28">
                                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-4">Review Summary</h4>
                                
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">Type</p>
                                    <div className="font-bold text-brand-blue">{deckType}</div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">Theme</p>
                                    <div className="font-bold text-brand-blue flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-brand-orange"></div>
                                        {templates[selectedTemplate]?.title ? String(selectedTemplate).replace(/([A-Z])/g, ' $1').trim() : 'Default'}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">Stage</p>
                                    <div className="font-bold text-brand-blue">{stage}</div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">Focus</p>
                                    <div className="flex flex-wrap gap-1">
                                        {primaryFocus.map((f, i) => <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{f}</span>)}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 my-4 pt-4">
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        The AI will generate 10 slides tailored to {startupType.join(', ')} at the {stage} stage.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* 3. Sticky Footer Navigation */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <button 
                        onClick={handleBack}
                        disabled={step === 1}
                        className="text-gray-500 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 disabled:opacity-0 transition-all"
                    >
                        Back
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right mr-2">
                            <p className="text-xs text-gray-400 font-bold uppercase">Next Step</p>
                            <p className="text-sm font-bold text-brand-blue">
                                {step === 1 ? 'Choose Aesthetic' : step === 2 ? 'Startup Details' : step === 3 ? 'Financials' : 'Generate Deck'}
                            </p>
                        </div>
                        {step < 4 ? (
                            <button 
                                onClick={handleNext}
                                className="bg-brand-blue text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                            >
                                Next <ArrowRightIcon />
                            </button>
                        ) : (
                            <button 
                                onClick={handleGenerate}
                                disabled={loading}
                                className="bg-brand-orange text-white font-bold py-3 px-10 rounded-xl shadow-lg shadow-brand-orange/20 hover:shadow-xl hover:shadow-brand-orange/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon /> Generate Deck
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WizardSteps;