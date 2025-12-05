
import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { summarizeBio, extractMetrics } from '../services/ai/slide';
import { analyzeStartupStrategy } from '../services/ai/investor';
import { BioSummary, ExtractedMetric, StartupStrategicAnalysis } from '../services/ai/types';

// --- ICONS ---
const LinkIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>;
const LinkedinIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TwitterIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 9.7 0 .3 0 .7-.1 1-.7 2.2-2.5 4.3-5.2 5.5-2.7.7-5.5.5-8.1-.4-2.6-.9-5-2.4-6.9-4.4-1.9-2-3.2-4.3-3.8-6.7 2.4.4 4.8.6 7.2.2-2.3-.5-4.3-1.9-5.7-3.6-1.4-1.7-2.1-3.8-1.9-5.9.8.4 1.7.7 2.6.8-1.5-.9-2.7-2.4-3.4-4 .9 2.1 2.5 3.9 4.6 5.2 2.1 1.2 4.6 1.8 7.1 1.6-1.5-1.1-2.4-2.8-2.1-4.5.3-1.7 1.4-3.1 2.9-3.9 1.5-.8 3.3-.9 4.9-.4.9-.1 1.8-.4 2.6-.8-.3.9-.8 1.7-1.4 2.4.8-.1 1.6-.3 2.3-.6-.6.8-1.2 1.5-1.9 2.1z"/></svg>;
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const WandIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>;
const CheckIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>;
const ClipboardIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>;
const BrainIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const BarChartIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>;
const TargetIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;

const Spinner = () => <svg className="animate-spin h-4 w-4 text-brand-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

// --- HELPER COMPONENTS ---
const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button onClick={handleCopy} className="text-gray-400 hover:text-brand-orange" aria-label="Copy text">
            {copied ? <CheckIcon className="text-green-500" /> : <ClipboardIcon />}
        </button>
    );
};


// Mock Data
const mockProfile = {
    username: 'alex-chen',
    name: 'Alex Chen',
    title: 'Founder & CEO, StartupAI',
    avatarUrl: 'https://storage.googleapis.com/aistudio-hosting/profile-placeholders/person3.jpg',
    bio: "Obsessed with democratizing access to AI for the next generation of founders. Building tools that make professional design and storytelling effortless. Previously at Google AI, scaling infrastructure for machine learning models to millions of users. Passionate about the intersection of design, code, and business strategy.",
    socials: {
        linkedin: '#',
        twitter: '#',
        website: 'https://startupai.com'
    },
    startup: {
        name: 'StartupAI',
        logoUrl: 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png', // Placeholder
        tagline: 'Your AI-Powered Startup Hub for Growth.',
        website: 'https://startupai.com',
        fundingGoal: '$1.5M Seed',
        industry: 'Generative AI / SaaS',
        stage: 'Seed',
        traction: '500+ Beta Users, $10k MRR'
    },
    lookingFor: ['Seed Funding', 'Technical Co-founder', 'Beta Testers'],
    publicDecks: [
        { id: 'deck-1', title: 'StartupAI Seed Round Pitch', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/docs/service-web.png' },
        { id: 'deck-2', title: 'Q3 Product Update', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/docs/service-mvp.png' },
    ]
};

const FounderProfile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const profile = mockProfile; // In a real app, you'd fetch this based on username

    // AI State
    const [showAiTools, setShowAiTools] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryAndHighlights, setSummaryAndHighlights] = useState<BioSummary | null>(null);
    
    const [isExtractingMetrics, setIsExtractingMetrics] = useState(false);
    const [extractedMetrics, setExtractedMetrics] = useState<ExtractedMetric[] | null>(null);

    const [isAnalyzingStrategy, setIsAnalyzingStrategy] = useState(false);
    const [strategicAnalysis, setStrategicAnalysis] = useState<StartupStrategicAnalysis | null>(null);

    const [aiError, setAiError] = useState<string | null>(null);

    const handleSummarize = useCallback(async () => {
        setIsSummarizing(true);
        setAiError(null);
        try {
            const result = await summarizeBio(profile.bio);
            setSummaryAndHighlights(result);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsSummarizing(false);
        }
    }, [profile.bio]);

    const handleExtractMetrics = useCallback(async () => {
        setIsExtractingMetrics(true);
        setAiError(null);
        try {
            // Combine bio and tagline for context
            const textToAnalyze = `${profile.startup.tagline} ${profile.bio} ${profile.startup.traction}`;
            const { metrics } = await extractMetrics(textToAnalyze);
            setExtractedMetrics(metrics);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : "Failed to extract metrics.");
        } finally {
            setIsExtractingMetrics(false);
        }
    }, [profile.bio, profile.startup.tagline, profile.startup.traction]);

    const handleStrategicAnalysis = useCallback(async () => {
        setIsAnalyzingStrategy(true);
        setAiError(null);
        try {
            const context = `Startup: ${profile.startup.name}. Industry: ${profile.startup.industry}. Stage: ${profile.startup.stage}. Traction: ${profile.startup.traction}. Tagline: ${profile.startup.tagline}. Founder Bio: ${profile.bio}`;
            const result = await analyzeStartupStrategy(context);
            setStrategicAnalysis(result);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : "Failed to perform strategic analysis.");
        } finally {
            setIsAnalyzingStrategy(false);
        }
    }, [profile]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 border-green-500 bg-green-50';
        if (score >= 60) return 'text-yellow-600 border-yellow-500 bg-yellow-50';
        return 'text-red-600 border-red-500 bg-red-50';
    };
    
    const getScoreColorText = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };


    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column / Profile Sidebar */}
            <aside className="w-full lg:w-1/3 lg:flex-shrink-0">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center sticky top-28 relative">
                    {strategicAnalysis && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg border border-gray-200 flex flex-col items-center animate-fade-in z-10">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                                <TargetIcon className="w-3 h-3" /> Viability
                            </span>
                            <span className={`text-3xl font-extrabold ${getScoreColorText(strategicAnalysis.investorReadinessScore)}`}>
                                {strategicAnalysis.investorReadinessScore}
                            </span>
                        </div>
                    )}
                    
                    <img src={profile.avatarUrl} alt={profile.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
                    <h1 className="text-3xl font-bold text-brand-blue">{profile.name}</h1>
                    <p className="text-gray-500 mt-1">{profile.title}</p>
                    <button className="mt-6 w-full bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
                        Connect
                    </button>
                    <div className="border-t border-gray-200 my-6"></div>
                    <div className="text-left">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-brand-blue">About</h3>
                            <button 
                                onClick={() => setShowAiTools(!showAiTools)} 
                                className="p-1 text-gray-400 hover:text-brand-orange rounded-full transition-colors"
                                title="AI Founder Tools"
                                aria-label="Toggle AI Tools"
                                aria-expanded={showAiTools}
                            >
                                <WandIcon />
                            </button>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>
                        
                        {showAiTools && (
                            <div className="mt-4 p-4 bg-orange-50/50 border border-brand-orange/20 rounded-lg space-y-4 animate-fade-in">
                                <div className="flex justify-between items-center border-b border-brand-orange/10 pb-2">
                                    <h4 className="font-bold text-xs text-brand-orange uppercase tracking-wider">Gemini 3 Assistant</h4>
                                </div>
                                
                                {/* Tool 1: Bio Summarizer */}
                                <div className="space-y-2">
                                    <button 
                                        onClick={handleSummarize} 
                                        disabled={isSummarizing}
                                        className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-brand-blue bg-white p-2 rounded border border-gray-200 hover:border-brand-orange/50 transition-all"
                                    >
                                        <span className="flex items-center gap-2"><BrainIcon className="w-4 h-4 text-purple-500"/> Summarize Bio</span>
                                        {isSummarizing && <Spinner />}
                                    </button>
                                    {summaryAndHighlights && (
                                        <div className="bg-white p-3 rounded border border-gray-200 text-xs text-gray-600 space-y-2">
                                            <p className="italic">"{summaryAndHighlights.summary}"</p>
                                            <div className="flex flex-wrap gap-1">
                                                {summaryAndHighlights.highlights.map((h, i) => (
                                                    <span key={i} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">{h}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Tool 2: Metric Extractor */}
                                <div className="space-y-2">
                                    <button 
                                        onClick={handleExtractMetrics} 
                                        disabled={isExtractingMetrics}
                                        className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-brand-blue bg-white p-2 rounded border border-gray-200 hover:border-brand-orange/50 transition-all"
                                    >
                                        <span className="flex items-center gap-2"><BarChartIcon className="w-4 h-4 text-green-500"/> Extract Key Metrics</span>
                                        {isExtractingMetrics && <Spinner />}
                                    </button>
                                     {extractedMetrics && (
                                        <div className="bg-white p-3 rounded border border-gray-200 text-xs space-y-1">
                                            {extractedMetrics.length > 0 ? extractedMetrics.map((m, i) => (
                                                <div key={i} className="flex justify-between">
                                                    <span className="text-gray-500">{m.label}:</span>
                                                    <span className="font-bold text-gray-800">{m.value}</span>
                                                </div>
                                            )) : <p className="text-gray-400 italic">No metrics found in bio.</p>}
                                        </div>
                                    )}
                                </div>

                                {aiError && <p className="text-red-500 text-xs">{aiError}</p>}
                            </div>
                        )}
                    </div>
                    <div className="border-t border-gray-200 my-6"></div>
                    <div className="flex justify-center gap-4">
                        <a href={profile.socials.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-orange"><LinkIcon /></a>
                        <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-orange"><LinkedinIcon /></a>
                        <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-orange"><TwitterIcon /></a>
                    </div>
                </div>
            </aside>

            {/* Right Column / Main Content */}
            <main className="flex-1 space-y-8">
                {/* Startup Card */}
                <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <img src={profile.startup.logoUrl} alt={`${profile.startup.name} logo`} className="w-16 h-16"/>
                            <div>
                                <h2 className="text-2xl font-bold text-brand-blue">{profile.startup.name}</h2>
                                <p className="text-gray-600">{profile.startup.tagline}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="bg-gray-100 px-2 py-1 rounded">{profile.startup.industry}</span>
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">{profile.startup.stage}</span>
                                    <a href={profile.startup.website} target="_blank" rel="noopener noreferrer" className="text-brand-orange font-semibold hover:underline flex items-center gap-1">
                                        <LinkIcon className="w-3 h-3" />
                                        {profile.startup.website.replace('https://', '')}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center min-w-[150px]">
                            <p className="text-xs text-green-600 font-bold uppercase tracking-wide">Funding Goal</p>
                            <p className="text-xl font-bold text-green-800 mt-1">{profile.startup.fundingGoal}</p>
                        </div>
                    </div>

                    {/* Strategic Analysis Section (Gemini 3) */}
                    <div className="mt-8 border-t border-gray-100 pt-6">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-brand-blue flex items-center gap-2">
                                <BrainIcon className="text-brand-orange" />
                                Strategic Analysis
                            </h3>
                             <button 
                                onClick={handleStrategicAnalysis} 
                                disabled={isAnalyzingStrategy}
                                className="text-sm bg-white border border-gray-300 text-gray-700 font-semibold py-1.5 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {isAnalyzingStrategy ? 'Calculating Viability...' : 'Calculate Viability Score'}
                            </button>
                        </div>
                        
                        {strategicAnalysis ? (
                            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden animate-fade-in-up">
                                {/* Score Header */}
                                <div className="flex items-center gap-6 p-6 bg-white border-b border-gray-100">
                                    <div className={`w-20 h-20 rounded-full border-8 flex items-center justify-center flex-shrink-0 ${getScoreColor(strategicAnalysis.investorReadinessScore)}`}>
                                        <span className="text-2xl font-extrabold">{strategicAnalysis.investorReadinessScore}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Startup Viability Report</h4>
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{strategicAnalysis.readinessReasoning}</p>
                                    </div>
                                </div>

                                {/* SWOT Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-gray-200 border-b border-gray-200">
                                    <div className="bg-white p-5">
                                        <h5 className="text-xs font-bold text-green-600 uppercase mb-3">Strengths</h5>
                                        <ul className="space-y-2">
                                            {strategicAnalysis.swot.strengths.map((item, i) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-green-400 text-xs mt-1">●</span> {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white p-5">
                                        <h5 className="text-xs font-bold text-red-500 uppercase mb-3">Weaknesses</h5>
                                        <ul className="space-y-2">
                                            {strategicAnalysis.swot.weaknesses.map((item, i) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-red-400 text-xs mt-1">●</span> {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white p-5">
                                        <h5 className="text-xs font-bold text-blue-500 uppercase mb-3">Opportunities</h5>
                                        <ul className="space-y-2">
                                            {strategicAnalysis.swot.opportunities.map((item, i) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-blue-400 text-xs mt-1">●</span> {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white p-5">
                                        <h5 className="text-xs font-bold text-orange-500 uppercase mb-3">Threats</h5>
                                        <ul className="space-y-2">
                                            {strategicAnalysis.swot.threats.map((item, i) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-orange-400 text-xs mt-1">●</span> {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Market Trends & Competitors */}
                                <div className="p-6 bg-gray-50 grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h5 className="font-bold text-sm text-gray-900 mb-3">Live Market Trends</h5>
                                        <ul className="space-y-2">
                                            {strategicAnalysis.marketTrends.map((trend, i) => (
                                                <li key={i} className="text-xs text-gray-600 bg-white px-3 py-2 rounded border border-gray-200 shadow-sm">
                                                    🔥 {trend}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-sm text-gray-900 mb-3">Key Competitors</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {strategicAnalysis.keyCompetitors.map((comp, i) => (
                                                <span key={i} className="text-xs font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            !isAnalyzingStrategy && (
                                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <p className="text-gray-500 text-sm">
                                        Gemini 3 will research live market data, evaluate team strength, and score startup viability.
                                    </p>
                                </div>
                            )
                        )}
                        
                        {isAnalyzingStrategy && (
                             <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                                <div className="w-12 h-12 mx-auto mb-4 border-4 border-dashed rounded-full animate-spin border-brand-orange"></div>
                                <p className="text-gray-800 font-semibold">Gemini 3 is thinking...</p>
                                <p className="text-gray-500 text-sm mt-2">Evaluating Team, Market, Product, and Traction.</p>
                            </div>
                        )}
                    </div>
                </section>
                
                {/* Looking For Card */}
                <section className="bg-orange-50 p-8 rounded-lg border border-brand-orange/30">
                     <h3 className="text-xl font-semibold text-brand-blue mb-4 flex items-center gap-2">
                         <SearchIcon className="text-brand-orange"/>
                         Currently Looking For
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.lookingFor.map(item => (
                            <span key={item} className="bg-white border border-gray-300 text-gray-700 font-semibold text-sm px-3 py-1 rounded-full">
                                {item}
                            </span>
                        ))}
                    </div>
                </section>
                
                {/* Public Decks Section */}
                <section>
                     <h3 className="text-xl font-semibold text-brand-blue mb-4">Public Pitch Decks</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {profile.publicDecks.map(deck => (
                            <Link key={deck.id} to={`/pitch-decks/${deck.id}/present`} className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                                <div className="aspect-video bg-gray-100">
                                    <img src={deck.imageUrl} alt={deck.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-brand-blue group-hover:text-brand-orange transition-colors">{deck.title}</h4>
                                </div>
                            </Link>
                        ))}
                     </div>
                </section>
            </main>
        </div>
    );
};

export default FounderProfile;
