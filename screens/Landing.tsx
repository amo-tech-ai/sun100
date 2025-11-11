import React from 'react';
import { Link } from 'react-router-dom';

const Section: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <section className={`py-16 sm:py-24 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

// New Icons for Problem Section
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const PaintbrushIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-1.5 1.5M11 11 2 22"/><path d="M14 6 3 17.1C2.5 17.6 2 18.5 2 19.5s.5 2 1.1 2.5c.6.6 1.5 1 2.5 1s2-.5 2.5-1.1L18 10Z"/></svg>;
const RocketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.11.65-.65 3.01-1.63 4.22-2.84.59-.59.59-1.54 0-2.12.65-.65 1-1.93.53-3.32-.47-1.39-1.69-2.32-3.32-.53-.59-.59-1.54-.59-2.12 0-1.21-1.19-3.57-2.84-4.22-2.1-1.39-4.5.21-5.71 2.45-1.2 2.24.84 5.27 2.45 5.71Z"/></svg>;


const BenefitCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="bg-white/50 p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-brand-orange/10 transition-shadow duration-300">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-orange/10 text-brand-orange mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const Landing: React.FC = () => {
    return (
        <>
            <title>Sun AI: AI Pitch Deck Engine</title>
            <meta name="description" content="Create investor-ready pitch decks in minutes. Sun AI is a guided wizard powered by generative AI that turns your business details into a stunning presentation." />

            <main>
                {/* 1. Hero Section */}
                <Section className="text-center bg-gradient-to-b from-white to-brand-off-white">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
                        From Idea to Investor-Ready in Minutes.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Sun AI helps founders write, design, and pitch their startup story with professional polish and speed.
                    </p>
                    <div className="flex justify-center">
                        <Link
                            to="/dashboard"
                            className="inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg"
                        >
                            Create My Pitch Deck &rarr;
                        </Link>
                    </div>
                </Section>
                
                {/* 2. The Problem Section */}
                <Section>
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold">Pitching is Hard. It Shouldn’t Be.</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <BenefitCard 
                            icon={<ClockIcon />}
                            title="Wasted Hours"
                            description="Founders spend 10+ hours on first decks. Sun AI does it in minutes."
                       />
                        <BenefitCard 
                            icon={<PaintbrushIcon />}
                            title="No Design Skills Needed"
                            description="AI applies proven storytelling and layout principles."
                       />
                        <BenefitCard 
                            icon={<RocketIcon />}
                            title="Investor-Ready"
                            description="Looks professional and matches what accelerators expect."
                       />
                    </div>
                </Section>

                {/* 3. The Solution Section */}
                <Section className="bg-white">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold">How Sun AI Works</h2>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">1. Input Your Idea</h3>
                            <p className="text-gray-600">Add your startup name or URL.</p>
                        </div>
                        <svg className="w-8 h-8 text-brand-mustard hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        <svg className="w-8 h-8 text-brand-mustard rotate-90 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        <div className="flex-1">
                             <h3 className="text-xl font-bold mb-2">2. AI Crafts the Narrative</h3>
                            <p className="text-gray-600">Gemini structures slides automatically.</p>
                        </div>
                        <svg className="w-8 h-8 text-brand-mustard hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                         <svg className="w-8 h-8 text-brand-mustard rotate-90 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">3. Review & Refine</h3>
                            <p className="text-gray-600">Edit, reorder, or add visuals.</p>
                        </div>
                        <svg className="w-8 h-8 text-brand-mustard hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                         <svg className="w-8 h-8 text-brand-mustard rotate-90 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">4. Pitch & Share</h3>
                            <p className="text-gray-600">Export and send your deck confidently.</p>
                        </div>
                    </div>
                </Section>
                
                {/* 4. Proof Section */}
                <Section className="bg-brand-blue text-white">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold">The Sun AI Advantage</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center">
                        <div>
                            <span className="text-5xl font-extrabold text-brand-mustard">90%</span>
                            <p className="mt-2 font-semibold text-lg">less time spent creating decks</p>
                        </div>
                        <div>
                            <span className="text-5xl font-extrabold text-brand-mustard">3x</span>
                            <p className="mt-2 font-semibold text-lg">more coherent storylines</p>
                        </div>
                         <div>
                            <span className="text-5xl font-extrabold text-brand-mustard">500+</span>
                            <p className="mt-2 font-semibold text-lg">decks built by founders</p>
                        </div>
                    </div>
                </Section>

                {/* 5. Testimonials */}
                 <Section>
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold">What Founders Say</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-lg border border-gray-200">
                            <p className="text-gray-600 text-lg mb-4">"Sun AI turned my brainstorm into an investor-ready deck in an hour."</p>
                            <div className="flex items-center gap-4">
                               <img src="https://storage.googleapis.com/aistudio-hosting/docs/team1.png" alt="Founder" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold">Maria Rodriguez</p>
                                    <p className="text-sm text-gray-500">Founder, LATAM AI Hub</p>
                                </div>
                            </div>
                        </div>
                         <div className="bg-white p-8 rounded-lg border border-gray-200">
                            <p className="text-gray-600 text-lg mb-4">"It feels like having a designer, writer, and strategist — all in one."</p>
                            <div className="flex items-center gap-4">
                               <img src="https://storage.googleapis.com/aistudio-hosting/docs/team2.png" alt="Founder" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold">Chen Wei</p>
                                    <p className="text-sm text-gray-500">CEO, SynthFlow</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
                
                {/* 6. Final CTA */}
                <Section className="bg-brand-blue text-white text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Ready to Build Your Winning Deck?</h2>
                    <p className="text-lg text-blue-200 mt-4 mb-8">Join hundreds of founders pitching smarter, not harder.</p>
                     <Link
                        to="/dashboard"
                        className="inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-200 shadow-2xl"
                    >
                        Start for Free &rarr;
                    </Link>
                </Section>
            </main>
        </>
    );
};

export default Landing;