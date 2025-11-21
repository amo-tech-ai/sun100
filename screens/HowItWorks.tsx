
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useOnScreen from '../hooks/useOnScreen';

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

// --- DATA ---

const stages = [
    {
        id: 1,
        title: "Idea & Validation",
        subtitle: "Pre-Seed",
        description: "Market research, customer validation, and initial prototype.",
        badges: ["Validation", "Research"],
        status: "Done",
        accent: "text-green-500",
        bgGradient: "from-green-500/20 to-green-500/5",
        iconGradient: "from-green-400 to-emerald-600",
        icon: LightbulbIcon
    },
    {
        id: 2,
        title: "MVP & Seed",
        subtitle: "Seed Round",
        description: "MVP live, early users, first signs of traction.",
        badges: ["Prototype", "Launch"],
        status: "Active",
        accent: "text-teal-500",
        bgGradient: "from-teal-500/20 to-cyan-500/5",
        iconGradient: "from-teal-400 to-cyan-600",
        icon: SproutIcon
    },
    {
        id: 3,
        title: "Early Traction",
        subtitle: "Series A",
        description: "Revenue growth, strong retention, PMF milestones.",
        badges: ["ARR", "PMF"],
        status: "Next",
        accent: "text-blue-500",
        bgGradient: "from-blue-500/20 to-indigo-500/5",
        iconGradient: "from-cyan-400 to-blue-600",
        icon: RocketIcon
    },
    {
        id: 4,
        title: "Scaling",
        subtitle: "Series B",
        description: "Team scaling, systems, marketing expansion.",
        badges: ["CAC", "Growth %"],
        status: "Future",
        accent: "text-purple-500",
        bgGradient: "from-purple-500/20 to-fuchsia-500/5",
        iconGradient: "from-blue-600 to-purple-600",
        icon: ChartIcon
    },
    {
        id: 5,
        title: "Leadership",
        subtitle: "Series C",
        description: "International expansion, acquisitions, market dominance.",
        badges: ["Global", "Scale"],
        status: "Future",
        accent: "text-fuchsia-500",
        bgGradient: "from-fuchsia-500/20 to-pink-500/5",
        iconGradient: "from-purple-600 to-fuchsia-600",
        icon: GlobeIcon
    },
    {
        id: 6,
        title: "Exit Outcomes",
        subtitle: "IPO / M&A",
        description: "IPO, acquisition, investor liquidity events.",
        badges: ["IPO", "M&A"],
        status: "Goal",
        accent: "text-rose-500",
        bgGradient: "from-rose-500/20 to-orange-500/5",
        iconGradient: "from-fuchsia-500 to-rose-600",
        icon: TrophyIcon
    },
    {
        id: 7,
        title: "Liquidity",
        subtitle: "Founder Exit",
        description: "Secondaries, private equity, post-exit roles.",
        badges: ["Wealth", "Legacy"],
        status: "Dream",
        accent: "text-amber-500",
        bgGradient: "from-amber-500/20 to-yellow-500/5",
        iconGradient: "from-rose-500 to-amber-500",
        icon: BanknoteIcon
    }
];

// --- COMPONENTS ---

const StageCard: React.FC<{ stage: typeof stages[0]; index: number }> = ({ stage, index }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.2 });

    return (
        <div 
            ref={ref}
            className={`relative group w-full md:w-[280px] flex-shrink-0 transition-all duration-700 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            {/* Floating Icon */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stage.iconGradient} p-0.5 shadow-lg shadow-${stage.accent}/20 group-hover:scale-110 group-hover:shadow-${stage.accent}/40 transition-all duration-500 ease-in-out`}>
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center relative overflow-hidden">
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br ${stage.iconGradient} transition-opacity duration-300`}></div>
                        <stage.icon className={`w-8 h-8 ${stage.accent} relative z-10`} />
                    </div>
                </div>
                {/* Pulse Halo */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${stage.iconGradient} opacity-20 animate-ping-slow`} style={{ animationDuration: '3s' }}></div>
            </div>

            {/* Card Body */}
            <div className="mt-0 pt-12 pb-8 px-6 h-full bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden">
                {/* Subtle Gradient BG */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stage.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full items-center">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest mb-2 ${stage.accent} opacity-90`}>{stage.subtitle}</span>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{stage.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">{stage.description}</p>
                    
                    <div className="flex flex-wrap gap-2 justify-center mt-auto">
                        {stage.badges.map((badge, i) => (
                            <span 
                                key={i} 
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-white shadow-sm border border-slate-100 text-slate-500 group-hover:border-${stage.accent}/30 group-hover:text-${stage.accent} group-hover:scale-105 transition-all duration-300`}
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Connector Dot (Desktop) */}
            <div className="hidden md:block absolute -bottom-12 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-slate-200 z-10 group-hover:border-brand-orange group-hover:scale-150 transition-all duration-300"></div>
        </div>
    );
};

const HowItWorks: React.FC = () => {
    const [headerRef, isHeaderVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
    const [timelineRef, isTimelineVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });

    return (
        <div className="min-h-screen bg-[#FBF8F5] relative overflow-hidden font-display">
            <style>{`
                @keyframes draw-line {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                .animate-draw-line { animation: draw-line 2s ease-out forwards; }
                
                @keyframes draw-line-vertical {
                    from { height: 0%; }
                    to { height: 100%; }
                }
                .animate-draw-line-vertical { animation: draw-line-vertical 2s ease-out forwards; }

                @keyframes ping-slow {
                    75%, 100% { transform: scale(1.5); opacity: 0; }
                }
                .animate-ping-slow { animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite; }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>

            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[100px] animate-float"></div>
                <div className="absolute top-1/4 right-[-200px] w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-purple-100/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                {/* Header */}
                <div ref={headerRef} className={`text-center mb-24 transition-all duration-1000 ease-out ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4">The Roadmap</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                        From Idea to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-mustard">Exit</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        A visual guide to the startup lifecycle. Sun AI accelerates every stage of this journey with intelligent tools and insights.
                    </p>
                </div>

                {/* Journey Diagram */}
                <div ref={timelineRef} className="relative">
                    
                    {/* Desktop Timeline Line */}
                    <div className="hidden md:block absolute -bottom-11 left-0 right-0 h-1 bg-slate-100 rounded-full w-full overflow-hidden mx-auto max-w-[95%]">
                        <div 
                            className={`h-full bg-gradient-to-r from-green-400 via-blue-500 via-purple-500 to-amber-500 ${isTimelineVisible ? 'animate-draw-line' : 'w-0'}`}
                        ></div>
                    </div>

                    {/* Mobile Timeline Line */}
                    <div className="md:hidden absolute top-0 left-[50%] -translate-x-1/2 bottom-0 w-1 bg-slate-100 rounded-full overflow-hidden h-full z-0">
                        <div 
                            className={`w-full bg-gradient-to-b from-green-400 via-blue-500 via-purple-500 to-amber-500 ${isTimelineVisible ? 'animate-draw-line-vertical' : 'h-0'}`}
                        ></div>
                    </div>

                    {/* Nodes Container */}
                    {/* Desktop: Horizontal Scroll Container if needed, or Flex Wrap centered */}
                    <div className="flex flex-col md:flex-row md:overflow-x-auto md:pb-20 md:pt-10 md:px-4 items-stretch gap-12 md:gap-8 scrollbar-hide snap-x">
                        {stages.map((stage, index) => (
                            <div key={stage.id} className="snap-center shrink-0 flex justify-center md:block">
                                <StageCard stage={stage} index={index} />
                            </div>
                        ))}
                    </div>

                </div>

                {/* CTA Footer */}
                <div className="mt-32 text-center">
                    <div className="inline-block p-1 rounded-3xl bg-gradient-to-r from-brand-orange/10 to-brand-mustard/10 backdrop-blur-sm">
                        <div className="bg-white/90 rounded-[20px] p-10 md:p-16 border border-white shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                            
                            <h2 className="text-3xl font-bold text-slate-900 mb-4 relative z-10">Ready to Start Your Journey?</h2>
                            <p className="text-slate-600 mb-10 text-lg relative z-10">Use Sun AI's intelligent tools to accelerate every stage of your growth.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                                <Link to="/dashboard" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-brand-orange rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-brand-orange/30 transform hover:-translate-y-1 active:translate-y-0">
                                    Build My Pitch Deck
                                </Link>
                                <Link to="/sunaistartup-deck" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 bg-white border-2 border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all">
                                    View Ecosystem
                                </Link>
                            </div>
                        </div>
                    </div>
                    <p className="mt-12 text-xs font-bold text-slate-400 tracking-widest uppercase">Sun AI — Founder Intelligence Platform</p>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
