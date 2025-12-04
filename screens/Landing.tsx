
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import useOnScreen from '../hooks/useOnScreen';

const { Link } = ReactRouterDOM;

const FeatureHighlightCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: number }> = ({ icon, title, description, delay }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
    return (
        <div ref={ref} className={`bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:shadow-brand-orange/10 transform hover:-translate-y-1 transition-all duration-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${delay}ms`}}>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-orange/10 text-brand-orange mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-brand-blue">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
};

const TestimonialCard: React.FC<{ quote: string; name: string; title: string; avatar: string; }> = ({ quote, name, title, avatar }) => (
    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg relative mt-8 sm:mt-0">
        <img src={avatar} alt={name} className="w-16 h-16 rounded-full absolute -top-8 left-8 border-4 border-white shadow-sm object-cover" />
        <p className="mt-8 text-gray-700 italic text-lg leading-relaxed">"{quote}"</p>
        <div className="mt-6">
            <p className="font-bold text-brand-blue">{name}</p>
            <p className="text-sm text-gray-500">{title}</p>
        </div>
    </div>
);

const Landing: React.FC = () => {
    const [painRef, isPainVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.2 });

    return (
    <div className="font-display bg-[#FBF8F5] overflow-x-hidden">
        <style>{`
            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }

            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            .animate-float { animation: float 6s ease-in-out infinite; will-change: transform; }

            @keyframes float-delayed {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-12px); }
            }
            .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; animation-delay: 1s; will-change: transform; }

            @keyframes pulse-slow {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.9; transform: scale(1.02); }
            }
            .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }

            .bg-grid-slate {
                background-size: 40px 40px;
                background-image: linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
            }
        `}</style>
        
        {/* Section 1: Hero - Redesigned */}
        <section className="relative pt-16 pb-20 lg:pt-32 lg:pb-40 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-slate -z-10"></div>
            <div className="absolute top-[-10%] right-[-5%] w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-brand-orange/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    
                    {/* Left: Text Content */}
                    <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-6 lg:mb-8 animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
                            </span>
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">StartupAI 2.0 Live</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            Your AI Command Center for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-blue-600">Startups.</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-slate-600 mb-8 lg:mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            Build faster, validate smarter, and scale with AI that generates pitch decks, insights, research, tasks, and investor-ready materials — instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <Link to="/dashboard" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 shadow-lg hover:shadow-slate-900/20 transition-all hover:-translate-y-0.5">
                                Get Started — Free
                            </Link>
                            <Link to="/how-it-works" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-xl text-slate-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                                See How It Works
                            </Link>
                        </div>
                    </div>

                    {/* Right: Visual Content - Floating Interface */}
                    <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-in-up mt-8 lg:mt-0" style={{ animationDelay: '400ms' }}>
                        {/* Main Container: The "OS" Window */}
                        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden z-10 transform transition-all hover:scale-[1.01] duration-500">
                            {/* Window Bar */}
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                </div>
                                <div className="ml-4 px-3 py-1 bg-white rounded-md border border-gray-100 text-[10px] font-medium text-gray-400 flex-1 text-center">startupai-dashboard</div>
                            </div>
                            
                            {/* Dashboard Content */}
                            <div className="p-4 sm:p-6 grid gap-4 sm:gap-6 bg-white">
                                {/* Top Row: Stats */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="text-xs text-gray-500 font-medium mb-1">Revenue Forecast</div>
                                        <div className="h-1.5 w-24 bg-gray-200 rounded-full mb-3"></div>
                                        <div className="flex gap-1 items-end">
                                            <div className="w-3 h-8 bg-blue-500/20 rounded-sm"></div>
                                            <div className="w-3 h-12 bg-blue-500/40 rounded-sm"></div>
                                            <div className="w-3 h-10 bg-blue-500/60 rounded-sm"></div>
                                            <div className="w-3 h-16 bg-brand-orange rounded-sm"></div>
                                        </div>
                                    </div>
                                    <div className="p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="text-xs text-gray-500 font-medium mb-2">AI Tasks</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 border border-gray-300 rounded-sm"></div>
                                                <div className="h-1.5 w-16 bg-gray-200 rounded-full"></div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-brand-orange rounded-sm flex items-center justify-center text-[8px] text-white">✓</div>
                                                <div className="h-1.5 w-12 bg-gray-200 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Row: Main Action */}
                                <div className="p-3 sm:p-4 rounded-xl border border-blue-100 bg-blue-50/30 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white border border-blue-100 flex items-center justify-center shadow-sm text-brand-blue">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">Generate Pitch Deck</div>
                                            <div className="text-xs text-slate-500">AI Reasoning Active</div>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                                
                                {/* Bottom: Skeleton List */}
                                <div className="space-y-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                                            <div className="flex-1">
                                                <div className="h-2 w-3/4 bg-gray-100 rounded-full mb-1"></div>
                                                <div className="h-2 w-1/2 bg-gray-50 rounded-full"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating Card 1: Strategy (Hidden on mobile) */}
                        <div className="absolute top-10 -right-12 bg-white p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 animate-float z-20 w-48 hidden lg:block">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div className="text-xs font-bold text-slate-800">Strategy Ready</div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-1.5 bg-gray-100 rounded-full w-full"></div>
                                <div className="h-1.5 bg-gray-100 rounded-full w-2/3"></div>
                            </div>
                        </div>

                        {/* Floating Card 2: Pitch Deck (Hidden on mobile) */}
                        <div className="absolute bottom-20 -left-12 bg-white p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 animate-float-delayed z-20 w-52 hidden lg:block">
                            <div className="flex gap-3">
                                <div className="w-12 h-16 bg-slate-900 rounded-md shadow-md flex flex-col p-1.5 gap-1">
                                    <div className="w-full h-1/3 bg-white/20 rounded-sm"></div>
                                    <div className="w-2/3 h-px bg-white/20"></div>
                                    <div className="w-full h-px bg-white/20"></div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-800 mb-1">Series A Deck</div>
                                    <div className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block">Generated in 30s</div>
                                </div>
                            </div>
                        </div>

                         {/* Decorative Glows */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/30 via-orange-100/20 to-transparent blur-3xl -z-10 rounded-full pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 3: Pain & Promise (Moved up to replace Social Proof gap) */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Order on mobile: Text First (1), Visual Second (2) */}
                    <div ref={painRef} className="space-y-8 order-1 lg:order-1">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                            Stop Wrestling With <br/>
                            <span className="text-brand-orange">PowerPoint.</span>
                        </h2>
                        <ul className="space-y-6">
                            {[
                                "Hours wasted on tedious formatting and design tweaks.",
                                "Stale, uninspired content that fails to capture your vision.",
                                "The constant struggle to find compelling visuals and data."
                            ].map((item, index) => (
                                <li 
                                    key={index}
                                    className={`flex items-start gap-4 text-lg text-slate-600 transition-all duration-500 ${isPainVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} 
                                    style={{transitionDelay: `${index * 150}ms`}}
                                >
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-xs">✕</div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className={`relative order-2 lg:order-2 transition-all duration-1000 ease-out ${isPainVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="aspect-square bg-gray-100 rounded-3xl p-8 relative overflow-hidden border border-gray-200">
                            {/* Abstract representation of chaos vs order */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
                                <div className="bg-white rounded-xl shadow-xl p-6 space-y-4 transform -rotate-3 border border-gray-200">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-20 bg-gray-100 rounded"></div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="h-16 bg-gray-100 rounded"></div>
                                        <div className="h-16 bg-gray-100 rounded"></div>
                                        <div className="h-16 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="absolute -right-4 -bottom-4 bg-brand-orange text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm transform rotate-3">
                                    AI Solves This
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 4: Core Features */}
        <section className="bg-gray-50 py-16 lg:py-24 px-4 sm:px-6 lg:px-8 rounded-none mx-0">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue mb-6">Your Intelligent Co-Pilot</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">Go from zero to a complete, professional pitch deck with a suite of powerful AI tools at your fingertips.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureHighlightCard 
                        title="AI Wizard" 
                        description="Generate a complete 10-slide deck from a single prompt or URL. Our AI structures the narrative, writes the content, and suggests visuals."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>}
                        delay={0}
                    />
                    <FeatureHighlightCard 
                        title="Intelligent Copilot" 
                        description="Rewrite, analyze, and get expert feedback on any slide. Ask the AI to make content more concise, impactful, or data-driven."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z"/></svg>}
                        delay={200}
                    />
                    <FeatureHighlightCard 
                        title="Visual Agent" 
                        description="Create stunning, on-brand visuals with a click. Generate images from text, edit them with simple commands, and visualize your data."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>}
                        delay={400}
                    />
                </div>
            </div>
        </section>

        {/* Section 5: Data Storytelling */}
        <section className="bg-brand-blue text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 mx-0 shadow-2xl">
            <div className="max-w-7xl mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div className="pt-8 md:pt-0">
                        <p className="text-5xl md:text-6xl font-extrabold text-brand-mustard mb-2"><AnimatedCounter value={75} suffix="%" /></p>
                        <p className="text-lg font-medium text-blue-200">Faster Creation Time</p>
                    </div>
                     <div className="pt-8 md:pt-0 md:pl-8">
                        <p className="text-5xl md:text-6xl font-extrabold text-brand-mustard mb-2"><AnimatedCounter value={50} suffix="%" /></p>
                        <p className="text-lg font-medium text-blue-200">More Investor Meetings</p>
                    </div>
                     <div className="pt-8 md:pt-0 md:pl-8">
                        <p className="text-5xl md:text-6xl font-extrabold text-brand-mustard mb-2"><AnimatedCounter value={90} suffix="%" /></p>
                        <p className="text-lg font-medium text-blue-200">Founder Satisfaction</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 6: Testimonials */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-brand-blue">Built for Founders, by Founders</h2>
                </div>
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 max-w-5xl mx-auto">
                    <TestimonialCard
                        quote="StartupAI is my go-to. I found my co-founder at an event and used the AI Deck Wizard for our seed round. A game-changer."
                        name="Maria Rodriguez"
                        title="Founder, InnovateHub"
                        avatar="https://storage.googleapis.com/aistudio-hosting/profile-placeholders/person1.jpg"
                    />
                     <TestimonialCard
                        quote="It's the first platform that understands the entire founder journey, from pitching to product-market fit. The insights are invaluable."
                        name="Chen Wei"
                        title="CEO, NextLayer"
                        avatar="https://storage.googleapis.com/aistudio-hosting/profile-placeholders/person2.jpg"
                    />
                </div>
            </div>
        </section>

        {/* Section 7: Final CTA */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-12 sm:p-16 lg:p-20 text-center max-w-5xl mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-white opacity-50 z-0"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-brand-blue mb-6 tracking-tight">Ready to Build Your Masterpiece?</h2>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Join hundreds of founders accelerating their fundraising journey with StartupAI.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/dashboard" className="bg-brand-orange text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:-translate-y-1">Start Your Free Trial</Link>
                        <Link to="/pitch-decks/new" className="bg-white text-gray-700 border border-gray-300 font-bold py-4 px-10 rounded-xl text-lg hover:bg-gray-50 transition-all duration-200">Create a Deck</Link>
                    </div>
                </div>
            </div>
        </section>
    </div>
    );
};

export default Landing;