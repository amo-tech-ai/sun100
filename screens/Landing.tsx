import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import useOnScreen from '../hooks/useOnScreen';

const FeatureHighlightCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: number }> = ({ icon, title, description, delay }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
    return (
        <div ref={ref} className={`bg-white p-8 rounded-lg border border-gray-200/50 shadow-sm hover:shadow-xl hover:shadow-brand-orange/10 transform hover:-translate-y-1 transition-all duration-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${delay}ms`}}>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-orange/10 text-brand-orange mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-brand-blue">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

const TestimonialCard: React.FC<{ quote: string; name: string; title: string; avatar: string; }> = ({ quote, name, title, avatar }) => (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg relative">
        <img src={avatar} alt={name} className="w-16 h-16 rounded-full absolute -top-8 left-8 border-4 border-white" />
        <p className="mt-8 text-gray-700 italic">"{quote}"</p>
        <div className="mt-4 text-right">
            <p className="font-bold text-brand-blue">{name}</p>
            <p className="text-sm text-gray-500">{title}</p>
        </div>
    </div>
);


const Landing: React.FC = () => {
    const [painRef, isPainVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.2 });

    return (
    <>
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
        <section className="bg-brand-blue text-white py-20 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-50"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left animate-fade-in-up">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            From Idea to Investor-Ready. <span className="text-brand-mustard">Instantly.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-blue-200 max-w-xl mx-auto lg:mx-0 mb-8">
                            Sun AI is the intelligent platform that automates your pitch deck creation, so you can focus on building what matters.
                        </p>
                        <Link to="/dashboard" className="inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-200 shadow-xl">
                            Start Building for Free
                        </Link>
                    </div>
                    <div className="relative h-80 rounded-lg bg-white/10 p-2 shadow-2xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="h-full w-full rounded-md bg-brand-blue flex items-center justify-center font-semibold text-blue-300">
                            [Product Demo Video Placeholder]
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 2: Social Proof */}
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm font-semibold text-gray-500 tracking-wider">TRUSTED BY FOUNDERS AND INNOVATORS FROM:</p>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center">
                    <div className="flex justify-center"><img className="h-8 opacity-50" src="https://storage.googleapis.com/aistudio-hosting/docs/yc-logo.svg" alt="Y Combinator" /></div>
                    <div className="flex justify-center"><img className="h-8 opacity-50" src="https://storage.googleapis.com/aistudio-hosting/docs/google-logo.svg" alt="Google" /></div>
                    <div className="flex justify-center"><img className="h-6 opacity-50" src="https://storage.googleapis.com/aistudio-hosting/docs/stripe-logo.svg" alt="Stripe" /></div>
                    <div className="flex justify-center"><img className="h-8 opacity-50" src="https://storage.googleapis.com/aistudio-hosting/docs/aws-logo.svg" alt="AWS" /></div>
                    <div className="flex justify-center"><img className="h-8 opacity-50" src="https://storage.googleapis.com/aistudio-hosting/docs/hubspot-logo.svg" alt="HubSpot" /></div>
                    <div className="flex justify-center"><img className="h-8 opacity-50" src="https://storage.googleapis.com/aistudio-hosting/docs/notion-logo.svg" alt="Notion" /></div>
                </div>
            </div>
        </section>

        {/* Section 3: Pain & Promise */}
        <section className="py-20 md:py-28 bg-brand-off-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div ref={painRef} className="space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-blue">Stop Wrestling With Slides.</h2>
                        <ul className="space-y-4 text-lg text-gray-600">
                            <li className={`flex items-start gap-3 transition-all duration-500 ${isPainVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: '100ms'}}><span className="text-brand-orange font-bold mt-1">&#10007;</span> <span>Hours wasted on tedious formatting and design tweaks.</span></li>
                            <li className={`flex items-start gap-3 transition-all duration-500 ${isPainVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: '300ms'}}><span className="text-brand-orange font-bold mt-1">&#10007;</span> <span>Stale, uninspired content that fails to capture your vision.</span></li>
                            <li className={`flex items-start gap-3 transition-all duration-500 ${isPainVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{transitionDelay: '500ms'}}><span className="text-brand-orange font-bold mt-1">&#10007;</span> <span>The constant struggle to find compelling visuals and data.</span></li>
                        </ul>
                    </div>
                     <div className={`relative h-80 rounded-lg bg-white p-2 shadow-2xl transition-all duration-700 ease-out ${isPainVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{transitionDelay: '200ms' }}>
                        <div className="h-full w-full rounded-md bg-brand-blue flex items-center justify-center font-semibold text-blue-300">
                            [Video showing AI editor solving these problems]
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 4: Core Features */}
        <section className="py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-blue">Your Intelligent Co-Pilot for Fundraising</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Go from zero to a complete, professional pitch deck with a suite of powerful AI tools at your fingertips.</p>
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
        <section className="py-20 md:py-28 bg-brand-blue text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <p className="text-5xl md:text-6xl font-extrabold text-brand-mustard"><AnimatedCounter value={75} suffix="%" /></p>
                        <p className="mt-2 text-lg font-semibold text-blue-200">Faster Deck Creation</p>
                    </div>
                     <div className="text-center">
                        <p className="text-5xl md:text-6xl font-extrabold text-brand-mustard"><AnimatedCounter value={50} suffix="%" /></p>
                        <p className="mt-2 text-lg font-semibold text-blue-200">Increased Investor Meetings</p>
                    </div>
                     <div className="text-center">
                        <p className="text-5xl md:text-6xl font-extrabold text-brand-mustard"><AnimatedCounter value={90} suffix="%" /></p>
                        <p className="mt-2 text-lg font-semibold text-blue-200">Founder Satisfaction Rate</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 6: Testimonials */}
        <section className="py-20 md:py-28 bg-brand-off-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-blue">Built for Founders, by Founders</h2>
                </div>
                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <TestimonialCard
                        quote="Sun AI is my go-to. I found my co-founder at an event and used the AI Deck Wizard for our seed round. A game-changer."
                        name="Maria Rodriguez"
                        title="Founder, InnovateHub"
                        avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCppGncG4NIlQhP-Mm6ydP25B3hbY93ccUrHDGiSO2teieVc19d4z-z4lIXv-SUmE3Y-VYlpDGUb_yEzMMpIiY9x_QVKR1r1W710kuqh4RB8G-EtR_POxU5_0JxRMRWHomvzmniYkzcRzF8xztKdrSWwdV2Qlk-ZhIo0ZdaW6TCv-9-whx1f42MsrFVPubntiFaUrwfayffzgHyxfPiC6FHovruULy2MAsMcK5el4cmhcqYjWdc7hTkVLprPJDAO_z41k_62V9aDSo"
                    />
                     <TestimonialCard
                        quote="It's the first platform that understands the entire founder journey, from pitching to product-market fit."
                        name="Chen Wei"
                        title="CEO, NextLayer"
                        avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuD91z1jOzow1ZHS1VbQbH3qwrYp3Kv0t9oXBZF0-AZ86pKCW88K-KSfltfWrQiQ8oECc8-7knImh8bbp1Z0HI9DUOOFJXDSb8jNJSzxJQWdgJkvHIYWCgoYtjPEMolrZPmkjOPkNyZB8ZNaVffFwyd78iiJHCiCLby_qUOiHBE_wNJkM987QZffxnd0_NiuNqzSLvTIgi2j6mHZlFlRI5lD1IaALbflk9iQyGr5H9QoICxTC58R0V-ONsa_vZnbEd-GYWiXhqMSZ5g"
                    />
                </div>
            </div>
        </section>

        {/* Section 7: Final CTA */}
        <section className="py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-blue">Ready to Build Your Masterpiece?</h2>
                <p className="mt-4 text-lg text-gray-600">Join hundreds of VCs, accelerating angels and AI startups</p>
                <div className="mt-8">
                    <Link to="/dashboard" className="bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-opacity shadow-xl">Start Your Free Trial</Link>
                </div>
            </div>
        </section>
    </>
    );
};

export default Landing;