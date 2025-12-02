
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import useOnScreen from '../hooks/useOnScreen';

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
        <img src={avatar} alt={name} className="w-16 h-16 rounded-full absolute -top-8 left-8 border-4 border-white shadow-sm" />
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
    <div className="space-y-16 lg:space-y-24 pb-16">
        <style>{`
            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }

            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            .animate-float { animation: float 6s ease-in-out infinite; }

            @keyframes pulse-slow {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.9; transform: scale(1.02); }
            }
            .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }

            .bg-grid-light {
                background-image: linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
                background-size: 2rem 2rem;
            }
        `}</style>
        
        {/* Section 1: Hero - Redesigned */}
        <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[#FBF8F5] -z-20"></div>
            <div className="absolute inset-0 bg-grid-light -z-10"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-brand-orange/10 via-brand-blue/5 to-transparent rounded-[100%] blur-3xl -z-10 opacity-60"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-8 animate-fade-in-up">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
                            </span>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Powered by Gemini 3</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-brand-blue tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            Your AI Command Center for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-mustard">Startups.</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            Build faster, validate smarter, and scale with AI that generates pitch decks, insights, research, tasks, and investor-ready materials — instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <Link to="/dashboard" className="inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-brand-blue hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                                Get Started — Free
                            </Link>
                            <Link to="/how-it-works" className="inline-flex justify-center items-center px-8 py-4 text-lg font-bold rounded-xl text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all">
                                See How It Works
                            </Link>
                        </div>
                        
                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>No credit card required</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>14-day free trial</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual - Floating Interface */}
                    <div className="relative lg:h-[600px] flex items-center justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        {/* Main Dashboard Card */}
                        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-10 transform rotate-1 transition-transform duration-500 hover:rotate-0">
                            {/* UI Header */}
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                </div>
                                <div className="ml-4 h-2 w-32 bg-gray-200 rounded-full"></div>
                            </div>
                            {/* UI Content */}
                            <div className="p-6 space-y-6 bg-white/80 backdrop-blur-sm">
                                {/* Metric Row */}
                                <div className="flex gap-4">
                                     <div className="flex-1 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="h-2 w-12 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-6 w-20 bg-gray-300 rounded"></div>
                                     </div>
                                     <div className="flex-1 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="h-2 w-12 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-6 w-20 bg-gray-300 rounded"></div>
                                     </div>
                                </div>
                                 {/* Chart Mock */}
                                <div className="h-32 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 relative overflow-hidden">
                                     <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-200/50 to-transparent"></div>
                                     <svg className="absolute bottom-0 left-0 right-0 w-full h-full" preserveAspectRatio="none">
                                         <path d="M0 100 C 100 80, 200 100, 300 60 S 400 80, 500 20" stroke="#6366f1" strokeWidth="2" fill="none" />
                                     </svg>
                                </div>
                                 {/* List Items */}
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0"></div>
                                            <div className="flex-1 space-y-1.5">
                                                <div className="h-2 w-full bg-gray-100 rounded"></div>
                                                <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating Card 1: Strategy */}
                        <div className="absolute -top-4 -right-4 lg:right-0 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-float z-20 max-w-[200px]">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-1.5 bg-green-100 text-green-600 rounded-lg">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <span className="text-xs font-bold text-gray-700">GTM Strategy</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-full"></div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2">Generated in 2.4s</p>
                        </div>

                         {/* Floating Card 2: Deck */}
                        <div className="absolute top-1/2 -left-8 lg:-left-12 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-float z-20" style={{ animationDelay: '1.5s' }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-lg">
                                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-800">Pitch Deck</p>
                                    <p className="text-[10px] text-gray-500">Series A Draft</p>
                                </div>
                            </div>
                        </div>

                         {/* Floating Card 3: AI Thinking */}
                        <div className="absolute -bottom-6 right-12 bg-brand-blue text-white px-4 py-3 rounded-full shadow-2xl border border-gray-700 animate-pulse-slow z-30 flex items-center gap-2">
                            <div className="w-2 h-2 bg-brand-orange rounded-full animate-ping"></div>
                            <span className="text-xs font-bold tracking-wide">Gemini 3 Processing...</span>
                        </div>
                        
                        {/* Glow behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-orange/20 via-blue-500/10 to-transparent blur-3xl -z-10 rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 2: Social Proof */}
        <section className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <p className="text-center text-sm font-bold text-gray-400 tracking-widest uppercase mb-8">Trusted by founders from</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 lg:gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {['y-combinator', 'google', 'stripe', 'aws', 'hubspot', 'notion'].map((brand) => (
                        <div key={brand} className="flex justify-center">
                            <img 
                                className="h-8 sm:h-10 object-contain" 
                                src={`https://storage.googleapis.com/aistudio-hosting/brand-logos/${brand}.svg`} 
                                alt={brand} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Section 3: Pain & Promise */}
        <section className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div ref={painRef} className="space-y-8 order-2 lg:order-1">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue leading-tight">
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
                                    className={`flex items-start gap-4 text-lg text-gray-600 transition-all duration-500 ${isPainVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} 
                                    style={{transitionDelay: `${index * 150}ms`}}
                                >
                                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center font-bold text-xs">✕</div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className={`relative order-1 lg:order-2 transition-all duration-1000 ease-out ${isPainVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="aspect-square bg-gray-100 rounded-3xl p-8 relative overflow-hidden">
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
        <section className="bg-gray-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 rounded-3xl mx-4 sm:mx-6 lg:mx-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
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
        <section className="bg-brand-blue text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl">
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
        <section className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-brand-blue">Built for Founders, by Founders</h2>
                </div>
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                    <TestimonialCard
                        quote="Sun AI is my go-to. I found my co-founder at an event and used the AI Deck Wizard for our seed round. A game-changer."
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
        <section className="px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-12 sm:p-16 lg:p-20 text-center max-w-5xl mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-white opacity-50 z-0"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-brand-blue mb-6 tracking-tight">Ready to Build Your Masterpiece?</h2>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Join hundreds of founders accelerating their fundraising journey with Sun AI.</p>
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
