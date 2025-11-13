
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useOnScreen from '../hooks/useOnScreen';
import AnimatedCounter from '../components/AnimatedCounter';

const Section: React.FC<{ children: React.ReactNode, className?: string, useFadeIn?: boolean }> = ({ children, className = '', useFadeIn = false }) => {
    const [ref, isVisible] = useOnScreen<HTMLElement>({ threshold: 0.1 });
    const animationClass = useFadeIn && isVisible ? 'animate-fade-in-up' : 'opacity-0';

    return (
        <section ref={ref} className={`py-16 sm:py-24 transition-opacity duration-1000 ${className} ${useFadeIn ? animationClass : ''}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    );
};

// Icons for "Choose Your Path" Section
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const WandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M14 19h4"/><path d="M17 22v-2"/></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;


// Icons for Flowchart Section
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>;
const CompassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>;
const WrenchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>;


const PathCard: React.FC<{ icon: React.ReactNode, title: string, description: string, delay?: number }> = ({ icon, title, description, delay = 0 }) => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.1 });
    const animationClass = isVisible ? 'animate-fade-in-up' : 'opacity-0';
    return (
        <div ref={ref} style={{ animationDelay: `${delay}ms` }} className={`bg-white/50 p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-brand-orange/10 transition-shadow duration-300 ${animationClass}`}>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-orange/10 text-brand-orange mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

const TestimonialCard: React.FC<{ quote: string, name: string, title: string, imageUrl: string, delay?: number }> = ({ quote, name, title, imageUrl, delay = 0 }) => {
     const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.2 });
     const animationClass = isVisible ? 'animate-fade-in-up' : 'opacity-0';
    return (
        <div ref={ref} style={{ animationDelay: `${delay}ms` }} className={`bg-white p-8 rounded-lg border border-gray-200 ${animationClass}`}>
            <p className="text-gray-600 text-lg mb-4">"{quote}"</p>
            <div className="flex items-center gap-4">
                <img src={imageUrl} alt={name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                    <p className="font-bold">{name}</p>
                    <p className="text-sm text-gray-500">{title}</p>
                </div>
            </div>
        </div>
    )
}

// New component for the animated ecosystem flowchart
const EcosystemFlowchart: React.FC = () => {
    const [ref, isVisible] = useOnScreen<HTMLDivElement>({ threshold: 0.2 });

    const ecosystemSteps = [
        { step: 1, title: 'Join the Community', description: 'Create your founder profile to get personalized recommendations.', icon: <UserPlusIcon /> },
        { step: 2, title: 'Discover Opportunities', description: 'Explore curated jobs, events, and resources powered by AI.', icon: <CompassIcon /> },
        { step: 3, title: 'Build with AI Tools', description: 'Use our AI wizards to generate pitch decks, business plans, and more.', icon: <WrenchIcon /> },
        { step: 4, title: 'Grow Your Network', description: 'Connect with investors, mentors, and fellow founders.', icon: <BarChartIcon /> },
    ];

    return (
        <div ref={ref}>
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-blue">An Intelligent Ecosystem at Your Fingertips</h2>
                 <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">Our platform guides you through the startup journey with four integrated pillars of growth.</p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-4">
                {ecosystemSteps.map((item, index) => (
                    <React.Fragment key={item.step}>
                        <div
                            className={`flex flex-col text-center items-center p-6 rounded-xl w-64 h-64 justify-center group transition-all duration-300 hover:shadow-2xl hover:shadow-brand-orange/20 hover:-translate-y-2 border-2 border-transparent hover:border-brand-orange/50 bg-white ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                            style={{ animationDelay: `${index * 250}ms` }}
                        >
                            <div className="w-16 h-16 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse-icon">
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-lg text-brand-blue">{item.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>

                        {index < ecosystemSteps.length - 1 && (
                            <div className="relative h-16 w-1 md:h-1 md:w-20">
                                <div className={`absolute top-0 left-0 bg-gradient-to-r from-brand-orange to-brand-mustard rounded-full ${isVisible ? 'animate-line-draw' : 'w-0 h-0'}`}
                                     style={{ animationDelay: `${index * 250 + 250}ms` }}>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};


const Landing: React.FC = () => {
    return (
        <>
            <title>sun ai startup: Your AI-Powered Startup Hub</title>
            <meta name="description" content="sun ai startup connects founders with the tools, jobs, events, and resources they need to grow — all in one intelligent platform." />
            
            <style>{`
                @keyframes sun-glow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .bg-sun-glow {
                    background: radial-gradient(circle at top left, #FFF7F0, #FBF6F1, #FFF7F0);
                    background-size: 200% 200%;
                    animation: sun-glow 15s ease infinite;
                }
                @keyframes blink {
                    50% { opacity: 0; }
                }
                .animate-blink {
                    animation: blink 1s step-end infinite;
                }
                 @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                @keyframes pulse-icon {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }
                .animate-pulse-icon {
                    animation: pulse-icon 1s ease-in-out;
                }
                @keyframes line-draw-x {
                    from { width: 0; }
                    to { width: 100%; height: 4px; }
                }
                 @keyframes line-draw-y {
                    from { height: 0; }
                    to { height: 100%; width: 4px; }
                }
                .animate-line-draw {
                    animation: line-draw-y 0.5s ease-out forwards;
                }
                @media (min-width: 768px) {
                    .animate-line-draw {
                        animation-name: line-draw-x;
                    }
                }
            `}</style>

            <main>
                {/* 1. Hero Section */}
                <section className="py-16 sm:py-24 text-center bg-sun-glow">
                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 animate-fade-in-up">
                            Your AI-Powered Startup Hub for <span className="text-brand-orange">Growth</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                            sun ai startup is the intelligent platform for the entire startup journey, from discovery to funding.
                        </p>
                        <div className="flex justify-center animate-fade-in-up" style={{animationDelay: '400ms'}}>
                            <Link
                                to="/dashboard"
                                className="inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl"
                            >
                                Launch Your Journey &rarr;
                            </Link>
                        </div>
                    </div>
                </section>
                
                {/* 2. Choose Your Path Section */}
                <Section useFadeIn>
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold">Choose Your Path</h2>
                         <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">Whether you're looking for your next role or your next round of funding, our ecosystem has you covered.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                       <PathCard 
                            icon={<BriefcaseIcon />}
                            title="Discover Jobs"
                            description="Find your next role at a top AI startup in our curated jobs board."
                            delay={0}
                       />
                        <PathCard 
                            icon={<CalendarIcon />}
                            title="Find Events"
                            description="Connect with the community through virtual and in-person workshops and networking events."
                             delay={200}
                       />
                        <PathCard 
                            icon={<WandIcon />}
                            title="Build with AI"
                            description="Use our suite of intelligent tools, starting with the AI Pitch Deck wizard, to build and grow."
                             delay={400}
                       />
                       <PathCard 
                            icon={<GiftIcon />}
                            title="Access Perks"
                            description="Save thousands on essential startup software and services with exclusive community perks."
                             delay={600}
                       />
                    </div>
                </Section>

                {/* 3. "How It Works" / Ecosystem Section */}
                <Section className="bg-white">
                    <EcosystemFlowchart />
                </Section>
                
                {/* 4. Data Storytelling Section */}
                <Section className="bg-brand-blue text-white" useFadeIn>
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold">The sun ai startup Advantage</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center">
                        <div>
                            <span className="text-5xl font-extrabold text-brand-mustard"><AnimatedCounter value={500} suffix="+" /></span>
                            <p className="mt-2 font-semibold text-lg">Startups in the Network</p>
                        </div>
                        <div>
                            <span className="text-5xl font-extrabold text-brand-mustard"><AnimatedCounter value={80} suffix="+" /></span>
                            <p className="mt-2 font-semibold text-lg">Community Events Hosted</p>
                        </div>
                         <div>
                            <span className="text-5xl font-extrabold text-brand-mustard"><AnimatedCounter value={1000000} prefix="$" suffix="+" /></span>
                            <p className="mt-2 font-semibold text-lg">in Perks & Savings Claimed</p>
                        </div>
                    </div>
                </Section>

                {/* 5. Testimonials */}
                 <Section useFadeIn>
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold">What Founders Say</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <TestimonialCard 
                            quote="sun ai startup is my go-to. I found my co-founder at an event and used the AI tools to build our first deck."
                            name="Maria Rodriguez"
                            title="Founder, LATAM AI Hub"
                            imageUrl="https://picsum.photos/seed/sunai-t1/200"
                            delay={0}
                        />
                         <TestimonialCard 
                            quote="It's the first platform that understands the entire founder journey, from finding a job to getting funded."
                            name="Chen Wei"
                            title="CEO, SynthFlow"
                            imageUrl="https://picsum.photos/seed/sunai-t2/200"
                            delay={200}
                        />
                    </div>
                </Section>
                
                {/* 6. Final CTA Section */}
                <Section className="bg-brand-blue text-white text-center" useFadeIn>
                    <h2 className="text-3xl md:text-4xl font-bold">Ready to Accelerate Your Growth?</h2>
                    <p className="text-lg text-blue-200 mt-4 mb-8">Join hundreds of founders building smarter, not harder.</p>
                     <Link
                        to="/dashboard"
                        className="inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300 shadow-2xl transform hover:scale-105"
                    >
                        Join the Community &rarr;
                    </Link>
                </Section>
            </main>
        </>
    );
};

export default Landing;
