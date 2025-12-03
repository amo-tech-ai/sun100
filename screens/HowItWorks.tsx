
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useOnScreen from '../hooks/useOnScreen';
import AnimatedCounter from '../components/AnimatedCounter';

// --- ICONS ---
const LightbulbIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-2.5 0-2.2-1.8-4-4-4s-4 1.8-4 4c0 .5.5 1.5 1.5 2.5.8.8 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
    </svg>
);

const SproutIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 20h10" />
        <path d="M10 20c5.5-2.5.8-6.4 3-10" />
        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.2.4-4.8-.3-1.1-.6-2.3-1.9-3-3.2a11 11 0 0 0 5.5-.2z" />
        <path d="M14 8.9c-2.3-.5-4.2 1-5.1 2.6.9.3 1.9.5 3 .5 2.3 0 4.6-1 6.6-3.6a17.9 17.9 0 0 1-4.5.5z" />
    </svg>
);

const RocketIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);

const TrophyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

const BanknoteIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="20" height="12" x="2" y="6" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
    </svg>
);

const BrainIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a3 3 0 1 1 5.997.129 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 9a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 18 18Z"/><path d="M12 5v13"/><path d="M9 13h6"/><path d="M12 18h6"/>
    </svg>
);

const RobotIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8" y2="16" />
        <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
);

const SendIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const styles = `
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    .animate-float { animation: float 6s ease-in-out infinite; }
    
    @keyframes pulse-slow {
        50% { opacity: 0.7; transform: scale(1.05); }
    }
    .animate-pulse-slow { animation: pulse-slow 5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

    @keyframes draw-line {
        from { width: 0%; } to { width: 100%; }
    }
    .animate-draw-line { animation: draw-line 1.5s ease-out forwards; }

    @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
    .animate-scroll { animation: scroll 30s linear infinite; }

    .glass-card {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
    }
`;

const stages = [
    { id: 1, title: "Idea & Validation", subtitle: "Pre-Seed", description: "Market research, customer validation, and initial prototype.", badges: ["Validation", "Research"], accent: "text-green-500", bgGradient: "from-green-500/20 to-green-500/5", iconGradient: "from-green-400 to-emerald-600", icon: LightbulbIcon },
    { id: 2, title: "MVP & Seed", subtitle: "Seed Round", description: "MVP live, early users, first signs of traction.", badges: ["Prototype", "Launch"], accent: "text-teal-500", bgGradient: "from-teal-500/20 to-cyan-500/5", iconGradient: "from-teal-400 to-cyan-600", icon: SproutIcon },
    { id: 3, title: "Early Traction", subtitle: "Series A", description: "Revenue growth, strong retention, PMF milestones.", badges: ["ARR", "PMF"], accent: "text-blue-500", bgGradient: "from-blue-500/20 to-indigo-500/5", iconGradient: "from-cyan-400 to-blue-600", icon: RocketIcon },
    { id: 4, title: "Scaling", subtitle: "Series B", description: "Team scaling, systems, marketing expansion.", badges: ["CAC", "Growth"], accent: "text-purple-500", bgGradient: "from-purple-500/20 to-fuchsia-500/5", iconGradient: "from-blue-600 to-purple-600", icon: ChartIcon },
    { id: 5, title: "Leadership", subtitle: "Series C", description: "International expansion, acquisitions, market dominance.", badges: ["Global", "Scale"], accent: "text-fuchsia-500", bgGradient: "from-fuchsia-500/20 to-pink-500/5", iconGradient: "from-purple-600 to-fuchsia-600", icon: GlobeIcon },
    { id: 6, title: "Exit Outcomes", subtitle: "IPO / M&A", description: "IPO, acquisition, investor liquidity events.", badges: ["IPO", "M&A"], accent: "text-rose-500", bgGradient: "from-rose-500/20 to-orange-500/5", iconGradient: "from-fuchsia-500 to-rose-600", icon: TrophyIcon },
    { id: 7, title: "Founder Liquidity", subtitle: "Exit", description: "Secondaries, private equity, post-exit roles.", badges: ["Wealth", "Legacy"], accent: "text-amber-500", bgGradient: "from-amber-500/20 to-yellow-500/5", iconGradient: "from-rose-500 to-amber-500", icon: BanknoteIcon }
];

// --- COMPONENTS ---

const StageCard: React.FC<{ stage: typeof stages[0]; index: number }> = ({ stage, index }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.2 });
    return (
        <div ref={ref} className={`relative group w-full md:w-[280px] flex-shrink-0 transition-all duration-700 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`} style={{ transitionDelay: `${index * 100}ms` }}>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stage.iconGradient} p-0.5 shadow-lg shadow-${stage.accent}/20 group-hover:scale-110 transition-all duration-500`}>
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center relative overflow-hidden">
                        <stage.icon className={`w-8 h-8 ${stage.accent} relative z-10`} />
                    </div>
                </div>
            </div>
            <div className="mt-0 pt-12 pb-8 px-6 h-full glass-card rounded-2xl hover:-translate-y-2 transition-transform duration-500 flex flex-col items-center text-center relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${stage.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative z-10 flex flex-col h-full items-center">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 ${stage.accent} opacity-90`}>{stage.subtitle}</span>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{stage.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">{stage.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-auto">
                        {stage.badges.map((badge, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-white shadow-sm border border-slate-100 text-slate-500">{badge}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; delay: number }> = ({ icon, title, desc, delay }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
    return (
        <div ref={ref} className={`glass-card p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${delay}ms` }}>
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-brand-blue mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{desc}</p>
        </div>
    );
};

const StepCard: React.FC<{ icon: React.ReactNode; step: string; title: string; desc: string; list: string[]; delay: number }> = ({ icon, step, title, desc, list, delay }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.2 });
    return (
        <div ref={ref} className={`bg-white border border-gray-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:border-brand-orange/20 transition-all duration-500 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${delay}ms` }}>
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-blue text-white flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">{icon}</div>
                <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full uppercase tracking-wider">{step}</span>
            </div>
            <h3 className="text-2xl font-bold text-brand-blue mb-3">{title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{desc}</p>
            <ul className="space-y-2">
                {list.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const HowItWorks: React.FC = () => {
    const [heroRef, isHeroVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
    const [timelineRef, isTimelineVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
    const [brainRef, isBrainVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.3 });

    return (
        <div className="min-h-screen bg-[#FBF8F5] relative overflow-hidden font-display">
            <style>{styles}</style>

            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-orange-50/50 to-transparent"></div>
                <div className="absolute top-40 left-1/4 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[120px] animate-float"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* SECTION 1: HERO */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div ref={heroRef} className="max-w-7xl mx-auto text-center relative z-10">
                    <span className={`inline-block py-1.5 px-4 rounded-full bg-white border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-widest mb-6 transition-all duration-700 ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        How StartupAI Works
                    </span>
                    <h1 className={`text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight transition-all duration-700 delay-100 ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        Build. Validate. Fund. <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-mustard">Scale.</span>
                    </h1>
                    <p className={`text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed mb-10 transition-all duration-700 delay-200 ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        StartupAI transforms your idea into investor-ready documents, insights, and funding opportunities with the power of Gemini 3.
                    </p>
                    <div className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-700 delay-300 ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <Link to="/dashboard" className="px-8 py-4 text-lg font-bold text-white bg-brand-blue rounded-xl hover:bg-opacity-90 shadow-lg hover:shadow-brand-blue/20 transition-all transform hover:-translate-y-1">
                            Get Started &rarr;
                        </Link>
                        <button className="px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                            Watch Demo
                        </button>
                    </div>
                    
                    {/* Mockup */}
                    <div className={`mt-16 relative max-w-5xl mx-auto transition-all duration-1000 delay-500 ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="aspect-[16/10] bg-slate-900 rounded-2xl shadow-2xl border-4 border-slate-800 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                <p className="text-slate-600 font-mono">APP INTERFACE MOCKUP</p>
                            </div>
                            {/* Floating Particles */}
                            <div className="absolute top-10 right-10 w-20 h-20 bg-brand-orange/20 rounded-full blur-xl animate-pulse-slow"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: 3-STEP PROCESS */}
            <section className="py-24 px-4 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <StepCard 
                            step="Step 1"
                            icon={<LightbulbIcon />}
                            title="Input Your Startup"
                            desc="StartupAI reads everything — your website, notes, docs — and builds intelligence about your startup using Gemini 3 reasoning."
                            list={["Business Description", "Website Import", "File Uploads"]}
                            delay={0}
                        />
                        <StepCard 
                            step="Step 2"
                            icon={<RobotIcon />}
                            title="AI Generates Everything"
                            desc="Our engines construct a complete data room and pitch materials tailored to your specific industry and stage."
                            list={["Pitch Deck", "Financial Model", "Market Research"]}
                            delay={200}
                        />
                        <StepCard 
                            step="Step 3"
                            icon={<SendIcon />}
                            title="Share With Investors"
                            desc="Send trackable links, manage engagement, and automate follow-ups to close your round faster."
                            list={["Smart Send", "Engagement Tracking", "Investor Matching"]}
                            delay={400}
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 3: JOURNEY DIAGRAM */}
            <section className="py-24 px-4 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50/50"></div>
                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Your Startup Journey</h2>
                        <p className="text-lg text-slate-600">From day zero to exit, we're with you every step.</p>
                    </div>
                    
                    <div ref={timelineRef} className="relative">
                        <div className="hidden md:block absolute -bottom-11 left-0 right-0 h-1 bg-slate-100 rounded-full w-full overflow-hidden mx-auto max-w-[95%]">
                            <div className={`h-full bg-gradient-to-r from-green-400 via-blue-500 via-purple-500 to-amber-500 ${isTimelineVisible ? 'animate-draw-line' : 'w-0'}`}></div>
                        </div>
                        <div className="flex flex-col md:flex-row md:overflow-x-auto md:pb-20 md:pt-10 md:px-4 items-stretch gap-8 scrollbar-hide snap-x">
                            {stages.map((stage, index) => (
                                <div key={stage.id} className="snap-center shrink-0 flex justify-center md:block">
                                    <StageCard stage={stage} index={index} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: AI INSIGHTS (Charts) */}
            <section className="py-24 px-4 bg-slate-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-brand-orange font-bold tracking-widest uppercase text-sm">Data Intelligence</span>
                        <h2 className="text-4xl font-extrabold mt-4 mb-6">Live Insights Dashboard</h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            Stop guessing. Visualize your growth, market size, and financial health with auto-generated, investor-grade charts powered by real-time data.
                        </p>
                        <ul className="space-y-4">
                            {['Revenue Projections', 'Customer Growth', 'TAM / SAM / SOM'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-lg font-medium text-slate-300">
                                    <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange text-xs">✓</div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        {/* Mock Dashboard UI */}
                        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
                            <div className="flex gap-4 mb-6">
                                <div className="flex-1 bg-slate-700/50 rounded-xl p-4">
                                    <p className="text-xs text-slate-400 uppercase">Proj. Revenue</p>
                                    <p className="text-2xl font-bold text-white mt-1">$<AnimatedCounter value={120} />k</p>
                                </div>
                                <div className="flex-1 bg-slate-700/50 rounded-xl p-4">
                                    <p className="text-xs text-slate-400 uppercase">Growth</p>
                                    <p className="text-2xl font-bold text-green-400 mt-1">+<AnimatedCounter value={15} />%</p>
                                </div>
                            </div>
                            {/* Animated Bar Chart */}
                            <div className="h-48 flex items-end gap-2 justify-between px-2">
                                {[30, 45, 35, 50, 65, 55, 70, 85, 95].map((h, i) => (
                                    <div key={i} className="w-full bg-brand-orange rounded-t-md animate-float" style={{ height: `${h}%`, animationDelay: `${i * 100}ms`, animationDuration: '3s' }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: BRAIN FLOW */}
            <section ref={brainRef} className="py-24 px-4 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold text-brand-blue mb-16">Inside the StartupAI Brain</h2>
                    <div className="relative">
                        {/* Vertical connection line */}
                        <div className={`absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-200 via-brand-orange to-slate-200 -translate-x-1/2 transition-all duration-1000 ${isBrainVisible ? 'h-full' : 'h-0'}`}></div>
                        
                        <div className="space-y-12 relative z-10">
                            {[
                                { title: "Inputs", desc: "Text, URLs, PDFs", icon: <LightbulbIcon /> },
                                { title: "Gemini 3 Reasoning", desc: "Deep analysis & logic", icon: <BrainIcon /> },
                                { title: "Enrichment", desc: "Industry benchmarks & data", icon: <ChartIcon /> },
                                { title: "Generation", desc: "Documents & Strategies", icon: <RocketIcon /> },
                            ].map((node, i) => (
                                <div key={i} className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 w-64 mx-auto flex flex-col items-center relative transition-all duration-500 ${isBrainVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{ transitionDelay: `${i * 300}ms` }}>
                                    <div className="w-12 h-12 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-2">{node.icon}</div>
                                    <h3 className="font-bold text-slate-800">{node.title}</h3>
                                    <p className="text-xs text-slate-500">{node.desc}</p>
                                    {/* Glow effect */}
                                    {i === 1 && <div className="absolute inset-0 rounded-2xl ring-4 ring-brand-orange/20 animate-pulse"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6: FEATURES */}
            <section className="py-24 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-blue">Everything You Get</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard icon={<RocketIcon />} title="AI Pitch Deck" desc="10-slide investor ready deck generated in minutes." delay={0} />
                        <FeatureCard icon={<BanknoteIcon />} title="Financial Model" desc="5-year projections, cash flow, and burn rate analysis." delay={100} />
                        <FeatureCard icon={<GlobeIcon />} title="Market Research" desc="Deep dive into TAM/SAM/SOM with cited sources." delay={200} />
                        <FeatureCard icon={<TrophyIcon />} title="Competitor Analysis" desc="SWOT analysis and feature comparison matrix." delay={300} />
                        <FeatureCard icon={<ChartIcon />} title="Traction Insights" desc="Key metrics dashboard and growth forecasting." delay={400} />
                        <FeatureCard icon={<SendIcon />} title="Investor Matching" desc="Smart list of VCs aligned with your industry." delay={500} />
                    </div>
                </div>
            </section>

            {/* SECTION 7: TESTIMONIALS */}
            <section className="py-24 overflow-hidden bg-white">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-brand-blue">Founders Love StartupAI</h2>
                </div>
                <div className="relative w-full">
                    <div className="flex w-[200%] animate-scroll">
                        {[...Array(2)].map((_, setIndex) => (
                            <div key={setIndex} className="flex w-1/2 justify-around px-4 gap-8">
                                {[
                                    { name: "Sarah J.", role: "CEO, FinTech Co", quote: "Raised our seed round in 3 weeks thanks to this deck." },
                                    { name: "Mike R.", role: "Founder, HealthAI", quote: "The financial model generator saved me 40 hours." },
                                    { name: "Elena K.", role: "CTO, DevTool", quote: "Finally, a tool that understands technical founders." },
                                    { name: "David L.", role: "Founder, EdTech", quote: "The market research agent is insanely accurate." }
                                ].map((t, i) => (
                                    <div key={i} className="w-80 flex-shrink-0 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <p className="text-slate-600 italic mb-4">"{t.quote}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-300 rounded-full"></div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                                                <p className="text-xs text-slate-500">{t.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 8: CTA */}
            <section className="py-32 px-4 bg-slate-900 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue to-transparent opacity-80"></div>
                
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
                        Ready to turn your idea into an investor-ready startup?
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/dashboard" className="px-10 py-5 text-xl font-bold text-white bg-brand-orange rounded-full hover:bg-opacity-90 shadow-xl hover:shadow-brand-orange/30 transition-all transform hover:-translate-y-1">
                            Start Free
                        </Link>
                        <button className="px-10 py-5 text-xl font-bold text-white border-2 border-white/20 rounded-full hover:bg-white/10 transition-all">
                            See Templates
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;
