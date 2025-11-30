
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

            .bg-grid {
                background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                background-size: 2rem 2rem;
            }
        `}</style>
        
        {/* Section 1: Hero */}
        <section className="bg-brand-blue text-white relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6">
            <div className="absolute inset-0 bg-grid opacity-50"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="text-center lg:text-left animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 lg:mb-8 leading-tight">
                            From Idea to Investor-Ready. <span className="text-brand-mustard">Instantly.</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-blue-200 max-w-2xl mx-auto lg:mx-0 mb-8 lg:mb-10 leading-relaxed">
                            Sun AI is the intelligent platform that automates your pitch deck creation, so you can focus on building what matters.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/dashboard" className="inline-flex justify-center items-center bg-brand-orange text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-opacity-90 transition-all duration-200 shadow-xl hover:-translate-y-0.5">
                                Start Building for Free
                            </Link>
                             <Link to="/how-it-works" className="inline-flex justify-center items-center bg-white/10 backdrop-blur-sm text-white border border-white/20 font-bold py-4 px-8 rounded-xl text-lg hover:bg-white/20 transition-all duration-200">
                                See How It Works
                            </Link>
                        </div>
                    </div>
                    <div className="relative mt-12 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="relative rounded-2xl bg-white/5 p-4 shadow-2xl border border-white/10 backdrop-blur-sm transform rotate-1 lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                             <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/5">
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/10">
                                        <span className="text-2xl">▶️</span>
                                    </div>
                                    <p className="font-semibold text-blue-200">Watch the Demo</p>
                                </div>
                            </div>
                        </div>
                         {/* Decorative blobs */}
                         <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-orange/30 rounded-full blur-3xl -z-10"></div>
                         <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-mustard/30 rounded-full blur-3xl -z-10"></div>
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
