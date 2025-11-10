import React from 'react';
import { Link } from 'react-router-dom';

// --- Icons (self-contained for simplicity) ---
const FounderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const EventsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const PerksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/><path d="m9 12 2 2 4-4"/></svg>;
const CreditsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const ArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;


const Landing: React.FC = () => {
    return (
        <>
            <title>Sun AI: Build. Connect. Grow.</title>
            <meta name="description" content="Join Sun AI — the most vibrant AI startup community for founders, innovators, and event organizers." />
            
            {/* --- Hero Section --- */}
            <section className="relative text-center py-20 md:py-32 overflow-hidden bg-gradient-to-br from-brand-deep-blue to-teal-800 text-white">
                 <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-heading leading-tight mb-4 tracking-tight">
                        Build. Connect. Grow.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                        Join Sun AI — your AI startup hub.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/dashboard"
                            className="inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 shadow-lg"
                        >
                            Join the Community
                        </Link>
                         <Link
                            to="/dashboard"
                            className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-white/20 transition-colors duration-200"
                        >
                            Explore Opportunities
                        </Link>
                    </div>
                </div>
            </section>

             {/* --- Metrics Section --- */}
             <section className="py-20 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: <FounderIcon />, value: "500+", label: "Founders" },
                            { icon: <EventsIcon />, value: "80+", label: "Events" },
                            { icon: <PerksIcon />, value: "50+", label: "Perks" },
                            { icon: <CreditsIcon />, value: "$1M+", label: "in Credits" },
                        ].map(metric => (
                            <div key={metric.label} className="flex flex-col items-center">
                                <div className="text-brand-orange mb-3">{metric.icon}</div>
                                <p className="text-3xl md:text-4xl font-bold font-heading text-slate-800">{metric.value}</p>
                                <p className="text-slate-600 mt-1">{metric.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Choose Your Path Section --- */}
            <section className="py-20 sm:py-24 bg-white/50">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800">Choose Your Path</h2>
                         <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">From idea to impact — find your path.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Submit Startup", desc: "Get feedback, find co-founders, and connect with investors." },
                            { title: "Join Community", desc: "Access a global network of AI builders and innovators." },
                            { title: "AI Events", desc: "Participate in workshops, hackathons, and demo days." },
                            { title: "AI Projects", desc: "Collaborate on cutting-edge projects and build your portfolio." },
                        ].map(path => (
                             <div key={path.title} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <h3 className="text-xl font-bold font-heading text-slate-800 mb-2">{path.title}</h3>
                                <p className="text-slate-600 mb-4">{path.desc}</p>
                                <a href="/dashboard" className="font-bold text-brand-orange group-hover:underline flex items-center gap-2">
                                    Get Started <ArrowRight />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* --- Feature Highlights --- */}
             <section className="py-20 sm:py-24">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800">Everything You Need to Succeed</h2>
                         <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">From mentors to tools, Sun AI helps you grow.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            { title: "Accelerator Program", desc: "Structured mentorship, funding opportunities, and RLS programs to fast-track your growth." },
                            { title: "Vibrant Community", desc: "Connect with a curated network of founders, mentors, and industry experts at exclusive events." },
                            { title: "Exclusive Perks", desc: "Access over $1M+ in credits from partners like AWS, Google Cloud, and OpenAI." },
                            { title: "Growth Support", desc: "Leverage AI-powered tools for market analysis, pitch deck creation, and performance insights." },
                        ].map(feature => (
                             <div key={feature.title} className="bg-white p-6 rounded-lg border border-gray-200/80">
                                <h3 className="font-bold font-heading text-slate-800">{feature.title}</h3>
                                <p className="text-slate-600 mt-1">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                 </div>
            </section>

             {/* --- Community Stories Section --- */}
            <section className="py-20 sm:py-24 bg-white/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800">The Founder Journey</h2>
                    </div>
                    {/* Founder Flow Chart */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 text-center">
                        {['Founder', 'Mentor', 'Investor', 'Scale'].map((step, index, arr) => (
                            <React.Fragment key={step}>
                                <div className="flex flex-col items-center">
                                    <div className="bg-white border-2 border-brand-orange text-brand-orange rounded-full h-24 w-24 flex items-center justify-center font-bold font-heading text-lg shadow-lg">
                                        {step}
                                    </div>
                                </div>
                                {index < arr.length - 1 && (
                                     <div className="w-1 h-12 md:w-24 md:h-1 bg-gray-300"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Call to Action Section --- */}
            <section className="py-20 sm:py-24">
                 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800">Ready to Accelerate Your AI Journey?</h2>
                    <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
                        Join 500+ founders shaping the AI future.
                    </p>
                    <div className="mt-8">
                         <Link
                            to="/dashboard"
                            className="inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 shadow-lg"
                        >
                            Start Your Journey
                        </Link>
                    </div>
                 </div>
            </section>
             <style>{`
                .bg-grid-white\\/10 {
                    background-image: linear-gradient(white .5px, transparent .5px), linear-gradient(to right, white .5px, transparent .5px);
                    background-size: 20px 20px;
                    opacity: 0.1;
                }
            `}</style>
        </>
    );
};

export default Landing;