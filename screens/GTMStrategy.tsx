
import React, { useState } from 'react';
import { generateFullGTMStrategy } from '../services/ai/gtm';
import { FullGTMStrategy, GTMInput } from '../services/ai/types';
import { Link } from 'react-router-dom';

// Icons
const StrategyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const BullhornIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>;

const GTMStrategy: React.FC = () => {
    const [step, setStep] = useState<'input' | 'generating' | 'result'>('input');
    const [input, setInput] = useState<GTMInput>({
        startupName: 'My Startup',
        industry: 'SaaS',
        description: 'An AI-powered platform for automated bookkeeping.',
        targetAudience: 'Small Business Owners',
        stage: 'Seed'
    });
    const [strategy, setStrategy] = useState<FullGTMStrategy | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setStep('generating');
        setError(null);
        try {
            const result = await generateFullGTMStrategy(input);
            setStrategy(result);
            setStep('result');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Generation failed");
            setStep('input');
        }
    };

    const renderInput = () => (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-blue flex items-center justify-center gap-2">
                    <StrategyIcon /> Go-To-Market Strategist
                </h2>
                <p className="text-gray-500 mt-2">Gemini 3 will define your ICP, channels, and launch roadmap.</p>
            </div>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Startup Name</label>
                    <input 
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        value={input.startupName}
                        onChange={e => setInput({...input, startupName: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Industry</label>
                        <input 
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                            value={input.industry}
                            onChange={e => setInput({...input, industry: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Stage</label>
                        <select 
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                            value={input.stage}
                            onChange={e => setInput({...input, stage: e.target.value})}
                        >
                            <option>Pre-Seed</option>
                            <option>Seed</option>
                            <option>Series A</option>
                            <option>Growth</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Description</label>
                    <textarea 
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        rows={3}
                        value={input.description}
                        onChange={e => setInput({...input, description: e.target.value})}
                        placeholder="What problem do you solve?"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Target Audience</label>
                    <input 
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        value={input.targetAudience}
                        onChange={e => setInput({...input, targetAudience: e.target.value})}
                        placeholder="e.g. Freelance Designers, Enterprise CTOs"
                    />
                </div>

                {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>}

                <button 
                    onClick={handleGenerate}
                    className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                    <StrategyIcon /> Generate Strategy
                </button>
            </div>
        </div>
    );

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-orange mb-6"></div>
            <h2 className="text-xl font-bold text-gray-800">Constructing Your GTM Strategy</h2>
            <p className="text-gray-500 mt-2">Gemini 3 is analyzing market channels and pricing models...</p>
        </div>
    );

    const renderResult = () => {
        if (!strategy) return null;

        return (
            <div className="space-y-8 animate-fade-in-up pb-20">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-blue">{input.startupName} GTM Strategy</h1>
                        <p className="text-gray-500">Generated by Gemini 3 Pro</p>
                    </div>
                    <button onClick={() => setStep('input')} className="text-gray-600 hover:text-brand-orange font-medium">
                        Create New
                    </button>
                </div>

                {/* Executive Summary */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm tracking-wide">Executive Summary</h3>
                    <p className="text-gray-700 leading-relaxed">{strategy.executiveSummary}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ICP Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TargetIcon /></div>
                            <h3 className="font-bold text-gray-900">Ideal Customer Profile</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase">Persona</span>
                                <p className="font-bold text-lg text-brand-blue">{strategy.icp.personaName}</p>
                                <p className="text-sm text-gray-500">{strategy.icp.role}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase">Pain Points</span>
                                <ul className="mt-1 space-y-1">
                                    {strategy.icp.painPoints.map((p, i) => (
                                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                            <span className="text-red-400 font-bold">•</span> {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase">Motivations</span>
                                <ul className="mt-1 space-y-1">
                                    {strategy.icp.motivations.map((m, i) => (
                                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                            <span className="text-green-400 font-bold">•</span> {m}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Channels Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><BullhornIcon /></div>
                            <h3 className="font-bold text-gray-900">Top Channels</h3>
                        </div>
                        <div className="space-y-3">
                            {strategy.channels.map((channel, i) => (
                                <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-brand-blue">{channel.name}</h4>
                                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${channel.priority === 'High' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                            {channel.priority} Priority
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">{channel.type}</p>
                                    <p className="text-sm text-gray-700">{channel.tactic}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pricing Strategy */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-xl text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/10 rounded-lg"><TagIcon /></div>
                        <div>
                            <h3 className="font-bold text-xl">Pricing Strategy</h3>
                            <p className="text-slate-400 text-sm">{strategy.pricingStrategy.model} Model</p>
                        </div>
                    </div>
                    <p className="mb-8 text-slate-300 max-w-3xl">{strategy.pricingStrategy.recommendation}</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {strategy.pricingStrategy.tiers.map((tier, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/10 hover:bg-white/20 transition-colors">
                                <h4 className="font-bold text-lg mb-1">{tier.name}</h4>
                                <p className="text-2xl font-bold text-brand-mustard mb-4">{tier.price}</p>
                                <ul className="space-y-2">
                                    {tier.features.map((f, j) => (
                                        <li key={j} className="text-sm text-slate-300 flex items-start gap-2">
                                            <span className="text-green-400 font-bold">✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Roadmap */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                        <div className="p-2 bg-orange-50 text-brand-orange rounded-lg"><CalendarIcon /></div>
                        <h3 className="font-bold text-gray-900">90-Day Launch Plan</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-4 left-10 right-10 h-0.5 bg-gray-200 -z-10"></div>
                        
                        {[strategy.launchRoadmap.phase1, strategy.launchRoadmap.phase2, strategy.launchRoadmap.phase3].map((phase, i) => (
                            <div key={i} className="relative bg-gray-50 p-5 rounded-lg border border-gray-200">
                                <div className="absolute -top-3 left-4 bg-white border border-gray-200 px-2 py-1 rounded text-xs font-bold text-gray-500 uppercase">
                                    {phase.duration}
                                </div>
                                <h4 className="font-bold text-brand-blue mt-2">{phase.name}</h4>
                                <p className="text-sm text-brand-orange font-semibold mb-3">{phase.focus}</p>
                                <ul className="space-y-2">
                                    {phase.tasks.map((task, j) => (
                                        <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                                            <span className="text-gray-400 mt-1"><CheckIcon /></span>
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#FBF8F5] p-6 md:p-12">
            {step === 'input' && renderInput()}
            {step === 'generating' && renderLoading()}
            {step === 'result' && renderResult()}
        </div>
    );
};

export default GTMStrategy;
