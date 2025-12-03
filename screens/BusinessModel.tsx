
import React from 'react';
import { Link } from 'react-router-dom';
import useOnScreen from '../hooks/useOnScreen';
import AnimatedCounter from '../components/AnimatedCounter';

const Section: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <section className={`py-16 sm:py-24 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;


const RevenueStreamCard: React.FC<{ title: string; description: string; visual: React.ReactNode; delay: number }> = ({ title, description, visual, delay }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
    return (
        <div ref={ref} className={`bg-white/50 p-8 rounded-lg border border-gray-200/50 shadow-sm hover:shadow-xl hover:shadow-brand-orange/10 transform hover:-translate-y-1 transition-all duration-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${delay}ms`}}>
            <h3 className="text-2xl font-bold text-brand-blue mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
            <div className="h-24">{visual}</div>
        </div>
    );
};

const BusinessModel: React.FC = () => {
    const [funnelRef, isFunnelVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.5 });
    const [summaryRef, isSummaryVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.8 });

    return (
        <>
            <title>Business Model - StartupAI</title>
            <meta name="description" content="A scalable SaaS model combining subscriptions, partnerships, and marketplace commissions to create a sustainable financial engine." />
            <style>{`
                @keyframes orbit {
                    0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
                    100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
                }
                .animate-orbit { animation: orbit 15s linear infinite; }
                
                @keyframes draw-line {
                    from { stroke-dashoffset: 1000; }
                    to { stroke-dashoffset: 0; }
                }
                .draw-line {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    animation: draw-line 2s ease-out forwards;
                }

                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }

                 @keyframes grow-bar {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }
                .animate-grow-bar { animation: grow-bar 0.8s ease-out forwards; transform-origin: bottom; }

                @keyframes liquid-fill {
                    from { height: 0%; }
                    to { height: 100%; }
                }
                .animate-liquid-fill { animation: liquid-fill 1.5s ease-out forwards; }
                
                @keyframes grow-width {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                .animate-grow-width { animation: grow-width 1s ease-out forwards; }
            `}</style>

            <main>
                {/* 1. Hero Section */}
                <Section className="bg-white">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-blue mb-6">
                                A Scalable SaaS Model Built for Founder Success.
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-8">
                                We combine recurring subscription revenue with strategic ecosystem partnerships and marketplace commissions to create a robust, diversified financial engine.
                            </p>
                        </div>
                        <div className="relative h-96 flex items-center justify-center">
                            <div className="absolute text-brand-blue text-center">
                                <p className="text-2xl font-bold">Founder</p>
                                <p className="text-2xl font-bold">Value</p>
                            </div>
                            <div className="absolute w-24 h-24 bg-brand-orange/20 rounded-full animate-orbit" style={{ animationDelay: '0s' }}><div className="w-full h-full flex items-center justify-center font-semibold text-brand-orange">SaaS</div></div>
                            <div className="absolute w-24 h-24 bg-brand-mustard/20 rounded-full animate-orbit" style={{ animationDelay: '-5s' }}><div className="w-full h-full flex items-center justify-center font-semibold text-brand-mustard">Partners</div></div>
                            <div className="absolute w-24 h-24 bg-brand-blue/20 rounded-full animate-orbit" style={{ animationDelay: '-10s' }}><div className="w-full h-full flex items-center justify-center font-semibold text-brand-blue">Market</div></div>
                            <svg className="absolute w-full h-full" viewBox="0 0 300 300">
                                <circle cx="150" cy="150" r="85" fill="none" stroke="url(#gradient)" strokeWidth="2" className="draw-line" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#E97A41" />
                                        <stop offset="100%" stopColor="#F3B93C" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </Section>

                {/* 2. Core Revenue Streams */}
                <Section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <RevenueStreamCard 
                            title="Subscription Plans (SaaS)"
                            description="Monthly and annual plans for founders and startups to access premium AI tools, analytics, and collaboration features."
                            visual={<svg viewBox="0 0 100 40" className="w-full h-full"><polyline points="0,35 20,20 40,25 60,10 80,15 100,5" fill="none" stroke="#E97A41" strokeWidth="2" className="draw-line" /></svg>}
                            delay={0}
                        />
                         <RevenueStreamCard 
                            title="Accelerator & VC Partnerships"
                            description="Enterprise licenses for accelerators to provide StartupAI to their cohorts, creating B2B revenue and user acquisition channels."
                            visual={
                                <div className="flex justify-around items-end h-full">
                                    {[20, 35, 25, 40].map((h, i) => (
                                        <div key={i} className="w-4 bg-brand-mustard/50 rounded-t-sm animate-grow-bar" style={{ height: `${h * 1.5}%`, animationDelay: `${i * 100}ms` }}></div>
                                    ))}
                                </div>
                            }
                            delay={200}
                        />
                         <RevenueStreamCard 
                            title="Marketplace Commissions"
                            description="A commission-based model on premium job listings, exclusive perks, and introductions to service providers."
                            visual={
                                <div className="flex justify-around items-center h-full text-brand-blue/50">
                                    <BriefcaseIcon />
                                    <GiftIcon />
                                    <TagIcon />
                                </div>
                            }
                            delay={400}
                        />
                    </div>
                </Section>
                
                {/* 3. Customer Acquisition Funnel */}
                 <Section className="bg-white">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold text-brand-blue">A Hybrid Growth Engine.</h2>
                         <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">We acquire users through a mix of organic community engagement, strategic partnerships, and targeted performance marketing.</p>
                    </div>
                    <div ref={funnelRef} className="w-full max-w-4xl mx-auto space-y-2">
                        {['Awareness (Content/Community)', 'Signups (Freemium)', 'Activation (First Deck Created)', 'Conversion (Premium)', 'Referral'].map((stage, i) => (
                            <div key={stage} className="relative bg-gray-100/50 border border-gray-200/80 rounded-sm text-center font-semibold text-brand-blue py-4 overflow-hidden" style={{ width: `${100 - i*10}%`, margin: '0 auto'}}>
                                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-orange/20 to-brand-mustard/20" style={isFunnelVisible ? { width: '100%', animation: `liquid-fill 1.5s ${i*0.2}s ease-out forwards`, height: '0%' } : {height: '0%'}}></div>
                                <span className="relative z-10">{stage}</span>
                            </div>
                        ))}
                    </div>
                </Section>
                
                {/* 4. Key Financials & KPIs */}
                <Section className="bg-brand-blue text-white">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold">Key Performance Indicators</h3>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <p className="text-5xl md:text-6xl font-extrabold text-brand-mustard"><AnimatedCounter value={250} prefix="$" suffix="K+" /></p>
                            <p className="mt-2 text-lg font-semibold text-blue-200">Projected ARR (Year 1)</p>
                        </div>
                         <div className="text-center">
                            <p className="text-5xl md:text-6xl font-extrabold text-brand-mustard"><AnimatedCounter value={8} suffix=":1" /></p>
                            <p className="mt-2 text-lg font-semibold text-blue-200">Target LTV:CAC Ratio</p>
                        </div>
                         <div className="text-center">
                            <p className="text-5xl md:text-6xl font-extrabold text-brand-mustard"><AnimatedCounter value={10} prefix="< $" /></p>
                            <p className="mt-2 text-lg font-semibold text-blue-200">Customer Acquisition Cost</p>
                        </div>
                    </div>
                </Section>
                
                {/* 5. Summary Statement */}
                <Section>
                    <div ref={summaryRef} className="text-center">
                        <h3 className="text-3xl font-bold text-brand-blue">Built for Sustainable Growth and Ecosystem Value.</h3>
                        <div className="mt-4 h-1 max-w-md mx-auto bg-gradient-to-r from-brand-orange to-brand-mustard rounded-full" style={ isSummaryVisible ? {animation: 'grow-width 1s ease-out forwards', width: '0%'} : {width: '0%'} }></div>
                    </div>
                </Section>
            </main>
        </>
    );
};

export default BusinessModel;
