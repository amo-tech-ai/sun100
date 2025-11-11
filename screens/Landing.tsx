import React from 'react';
import { Link } from 'react-router-dom';

const Section: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <section className={`py-16 sm:py-24 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </section>
);

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
                    <span className="inline-block bg-brand-orange/10 text-brand-orange font-semibold px-4 py-1 rounded-full text-sm mb-4">
                        Trusted by 500+ founders and accelerators
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
                        Create Investor-Ready Pitch Decks in Minutes.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Powered by generative AI — turn your idea into an investor-ready story that captivates and converts.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/dashboard"
                            className="inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg"
                        >
                            Start Creating for Free &rarr;
                        </Link>
                         <Link
                            to="#"
                            className="inline-block bg-white text-brand-blue font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg border border-gray-200"
                        >
                            Watch Demo
                        </Link>
                    </div>
                </Section>
                
                {/* 2. Key Benefits Section */}
                <Section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <BenefitCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>}
                            title="AI-Powered Decks"
                            description="Generate investor-ready slides and content from a single prompt or your website URL."
                       />
                        <BenefitCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>}
                            title="Smart Design System"
                            description="Access beautiful, professional layouts that are automatically styled to match your brand."
                       />
                        <BenefitCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>}
                            title="Founder Insights"
                            description="Get AI-powered guidance on storytelling, market data, and what investors want to see."
                       />
                    </div>
                </Section>

                {/* 3. How It Works Section */}
                <Section className="bg-white">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold">A Smarter Way to Build Your Pitch</h2>
                         <p className="text-lg text-gray-600 mt-4">Our AI-native workflow streamlines deck creation from start to finish.</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">1. Input Idea</h3>
                            <p className="text-gray-600">Provide your business context, website URL, or business plan.</p>
                        </div>
                        <svg className="w-8 h-8 text-brand-mustard hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        <svg className="w-8 h-8 text-brand-mustard rotate-90 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        <div className="flex-1">
                             <h3 className="text-xl font-bold mb-2">2. AI Analyzes & Drafts</h3>
                            <p className="text-gray-600">Gemini generates a 10-slide draft with structured content.</p>
                        </div>
                        <svg className="w-8 h-8 text-brand-mustard hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                         <svg className="w-8 h-8 text-brand-mustard rotate-90 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">3. Customize & Present</h3>
                            <p className="text-gray-600">Use our smart editor to refine, add visuals, and present with confidence.</p>
                        </div>
                    </div>
                </Section>
                
                 {/* 4. Demo Preview Section */}
                 <Section>
                    <div className="bg-white rounded-lg shadow-2xl p-4 border border-gray-200">
                        <img 
                            src="https://storage.googleapis.com/aistudio-hosting/docs/landing-placeholder.png" 
                            alt="Sun AI Pitch Deck Editor Screenshot" 
                            className="rounded-md"
                        />
                    </div>
                     <div className="text-center mt-12">
                        <Link to="/dashboard" className="inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg">
                            Start Creating for Free &rarr;
                        </Link>
                    </div>
                </Section>
                
                {/* 5. Data & Metrics Section */}
                <Section className="bg-brand-blue text-white">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div>
                            <span className="text-5xl font-extrabold text-brand-mustard">1,000+</span>
                            <p className="mt-2 font-semibold">Decks Generated</p>
                        </div>
                        <div>
                            <span className="text-5xl font-extrabold text-brand-mustard">$2M+</span>
                            <p className="mt-2 font-semibold">Founder Perks Claimed</p>
                        </div>
                         <div>
                            <span className="text-5xl font-extrabold text-brand-mustard">80+</span>
                            <p className="mt-2 font-semibold">AI Events Hosted</p>
                        </div>
                         <div>
                            <span className="text-5xl font-extrabold text-brand-mustard">50+</span>
                            <p className="mt-2 font-semibold">Partner Startups</p>
                        </div>
                    </div>
                </Section>

                {/* 6. Testimonials */}
                 <Section>
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold">Loved by Founders, Trusted by Accelerators</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {/* Testimonial cards - placeholder */}
                        <div className="bg-white p-8 rounded-lg border border-gray-200">
                            <p className="text-gray-600 mb-4">"Sun AI turned our startup idea into a polished investor pitch in under 10 minutes. A total game-changer."</p>
                            <div className="flex items-center gap-4">
                               <img src="https://storage.googleapis.com/aistudio-hosting/docs/team1.png" alt="Founder" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold">Maria Rodriguez</p>
                                    <p className="text-sm text-gray-500">Founder, LATAM AI Hub</p>
                                </div>
                            </div>
                        </div>
                         <div className="bg-white p-8 rounded-lg border border-gray-200">
                            <p className="text-gray-600 mb-4">"The AI suggestions for each slide are brilliant. It's like having an expert pitch coach at your fingertips."</p>
                            <div className="flex items-center gap-4">
                               <img src="https://storage.googleapis.com/aistudio-hosting/docs/team2.png" alt="Founder" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold">Chen Wei</p>
                                    <p className="text-sm text-gray-500">CEO, SynthFlow</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-lg border border-gray-200">
                            <p className="text-gray-600 mb-4">"We recommend Sun AI to all our portfolio companies. It standardizes quality and saves our founders hundreds of hours."</p>
                             <div className="flex items-center gap-4">
                               <img src="https://storage.googleapis.com/aistudio-hosting/docs/team3.png" alt="Founder" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold">James O'Connell</p>
                                    <p className="text-sm text-gray-500">Partner, Velocity Ventures</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
                
                 {/* 7. Ecosystem Showcase */}
                <Section className="bg-white">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold">More Than a Tool — It's an Ecosystem</h2>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* ecosystem cards - placeholder */}
                        <div className="bg-brand-off-white p-8 rounded-lg border border-gray-200 text-center">
                            <h3 className="text-2xl font-bold mb-2">AI Jobs</h3>
                            <p className="text-gray-600 mb-4">Find your next role in one of our community's top startups.</p>
                             <Link to="/jobs" className="font-semibold text-brand-orange hover:underline">Browse Jobs &rarr;</Link>
                        </div>
                         <div className="bg-brand-off-white p-8 rounded-lg border border-gray-200 text-center">
                            <h3 className="text-2xl font-bold mb-2">Events & Workshops</h3>
                            <p className="text-gray-600 mb-4">Join our expert-led sessions on fundraising, AI, and growth.</p>
                             <Link to="/events" className="font-semibold text-brand-orange hover:underline">View Events &rarr;</Link>
                        </div>
                         <div className="bg-brand-off-white p-8 rounded-lg border border-gray-200 text-center">
                            <h3 className="text-2xl font-bold mb-2">Founder Perks</h3>
                            <p className="text-gray-600 mb-4">Claim exclusive deals on AWS, Stripe, and more.</p>
                             <Link to="/perks" className="font-semibold text-brand-orange hover:underline">Claim Perks &rarr;</Link>
                        </div>
                    </div>
                </Section>


                {/* 9. Final CTA */}
                <Section className="bg-gradient-to-r from-brand-blue to-blue-900 text-white text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Ready to Build Your Investor-Ready Deck?</h2>
                    <p className="text-lg text-blue-200 mt-4 mb-8">Join 500+ founders already raising smarter.</p>
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