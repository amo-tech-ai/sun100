
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// --- Icons (self-contained for simplicity) ---
const ReactIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent-teal"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48 0a6 6 0 0 1 0-8.49m11.31-2.83a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>;
const SupabaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M4 12.45v-1.72a2 2 0 0 1 1.33-1.89l5.34-2.4a2 2 0 0 1 1.33 0l5.34 2.4a2 2 0 0 1 1.33 1.89v1.72c0 .54-.23 1.05-.63 1.42l-5.34 4.68a2 2 0 0 1-2.74 0l-5.34-4.68a2 2 0 0 1-.63-1.42Z"/><path d="M4.17 12.45 12 19l7.83-6.55"/><path d="M12 22v-7.5"/></svg>;
const TailwindIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500"><path d="M16.5 20.5C18 22 20 22 21.5 20.5 23 19 23 17 21.5 15.5L12 6 2.5 15.5C1 17 1 19 2.5 20.5 4 22 6 22 7.5 20.5L12 16Z"/><path d="M7.5 12.5C9 14 11 14 12.5 12.5 14 11 14 9 12.5 7.5L12 6 11.5 5.5C10 4 8 4 6.5 5.5 5 7 5 9 6.5 10.5L7.5 11.5Z"/></svg>;
const GeminiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent-coral"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent-teal"><path d="M20 6 9 17l-5-5"/></svg>;

const MvpDevelopment: React.FC = () => {
    const sectionsRef = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { rootMargin: '0px', threshold: 0.1 }
        );

        sectionsRef.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => {
            sectionsRef.current.forEach((section) => {
                if (section) observer.unobserve(section);
            });
        };
    }, []);

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !sectionsRef.current.includes(el)) {
            sectionsRef.current.push(el);
        }
    };

    return (
        <div className="bg-[#FBF8F5]">
             <style>{`
                .fade-in-section {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                }
                .fade-in-section.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                 .glow-on-hover {
                    transition: box-shadow 0.3s ease-in-out;
                 }
                .glow-on-hover:hover {
                    box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
                }
            `}</style>
            <title>MVP Development for Startups - Sun AI</title>
            <meta name="description" content="From concept to live app — powered by React, Supabase, and Gemini. Launch your MVP in weeks, not months." />

            {/* --- Hero Section --- */}
            <section className="relative text-center py-20 md:py-32 overflow-hidden bg-brand-deep-blue text-white">
                 <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-heading leading-tight mb-4 tracking-tight">
                        Build Your MVP with AI-Powered Speed.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                        From concept to live app — powered by React, Supabase, and Gemini.
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-block bg-brand-accent-teal text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 shadow-lg glow-on-hover"
                    >
                        Schedule a Free Consultation
                    </Link>
                </div>
            </section>
            
            <nav className="bg-white/80 backdrop-blur-sm sticky top-[80px] z-10 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-start gap-4 text-sm font-semibold">
                        <Link to="/services" className="text-gray-500 hover:text-brand-orange py-4">&larr; Back to Services</Link>
                        <span className="text-gray-300">|</span>
                        <a href="#tech" className="text-gray-600 hover:text-brand-orange py-4">Tech Stack</a>
                        <a href="#pricing" className="text-gray-600 hover:text-brand-orange py-4">Pricing</a>
                        <a href="#case-studies" className="text-gray-600 hover:text-brand-orange py-4">Case Studies</a>
                    </div>
                </div>
            </nav>

            {/* --- Tech Stack Section --- */}
            <section id="tech" ref={addToRefs} className="fade-in-section py-20 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800">Our Modern Tech Stack</h2>
                         <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">We build on a foundation of cutting-edge technologies chosen for speed, scalability, and an amazing user experience.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: <ReactIcon />, name: "React & Vite", desc: "For lightning-fast, interactive user interfaces." },
                            { icon: <SupabaseIcon />, name: "Supabase", desc: "A scalable, secure backend with a Postgres database." },
                            { icon: <TailwindIcon />, name: "Tailwind CSS", desc: "For rapid, utility-first UI development." },
                            { icon: <GeminiIcon />, name: "Gemini API", desc: "To integrate powerful generative AI features." },
                        ].map(tech => (
                            <div key={tech.name} className="bg-white p-6 rounded-lg border border-gray-200/80">
                                <div className="flex justify-center mb-4">{tech.icon}</div>
                                <h3 className="font-bold font-heading text-slate-800">{tech.name}</h3>
                                <p className="text-slate-600 text-sm mt-1">{tech.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Pricing Tiers Section --- */}
            <section id="pricing" ref={addToRefs} className="fade-in-section py-20 sm:py-24 bg-white/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800">Transparent Pricing for Startups</h2>
                        <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">Choose the package that fits your vision and budget. No hidden fees.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {[
                            { name: "Starter", price: "$5k", duration: "4 Weeks", features: ["1 Core Feature", "User Authentication", "Database Setup", "Deployment"], popular: false },
                            { name: "Growth", price: "$15k", duration: "8 Weeks", features: ["Up to 3 Core Features", "User Authentication", "AI Feature Integration", "Admin Dashboard", "Stripe Payments"], popular: true },
                            { name: "Scale", price: "Custom", duration: "12+ Weeks", features: ["Unlimited Features", "Custom AI Models", "Advanced Security", "Dedicated Support", "Full Scalability"], popular: false },
                        ].map(tier => (
                            <div key={tier.name} className={`bg-white rounded-xl shadow-sm border ${tier.popular ? 'border-brand-accent-teal shadow-xl' : 'border-gray-200/80'} p-8`}>
                                {tier.popular && <div className="text-center mb-4"><span className="bg-brand-accent-teal text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span></div>}
                                <h3 className="text-2xl font-bold font-heading text-center text-slate-800">{tier.name}</h3>
                                <p className="text-center text-slate-500 mt-2">{tier.duration}</p>
                                <p className="text-5xl font-extrabold text-center text-slate-800 my-6">{tier.price}</p>
                                <ul className="space-y-4">
                                    {tier.features.map(feature => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <CheckIcon />
                                            <span className="text-slate-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full mt-8 font-bold py-3 px-6 rounded-lg transition-colors ${tier.popular ? 'bg-brand-accent-teal text-white glow-on-hover' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>Get Started</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* --- Case Studies Section --- */}
            <section id="case-studies" ref={addToRefs} className="fade-in-section py-20 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800">From Idea to Impact</h2>
                        <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">See how we've helped other founders launch and scale their vision.</p>
                    </div>
                    <div className="space-y-16">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <img src="https://images.unsplash.com/photo-1559028006-44d5a2b3e3f4?q=80&w=1935&auto=format&fit=crop" alt="Case Study 1" className="rounded-lg shadow-lg" />
                            <div>
                                <h3 className="text-2xl font-bold font-heading text-slate-800">Project Insight AI</h3>
                                <p className="text-lg text-slate-600 mt-2">An AI-powered platform for market research analysis.</p>
                                <div className="flex gap-8 mt-6 border-t pt-6">
                                    <div>
                                        <p className="text-3xl font-bold text-brand-accent-teal">6 Weeks</p>
                                        <p className="text-slate-500">From Kickoff to MVP Launch</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-brand-accent-teal">1,000+</p>
                                        <p className="text-slate-500">Waitlist Signups at Launch</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="lg:order-2">
                                <img src="https://images.unsplash.com/photo-1611262588024-d12430b98920?q=80&w=1974&auto=format&fit=crop" alt="Case Study 2" className="rounded-lg shadow-lg" />
                            </div>
                            <div className="lg:order-1">
                                <h3 className="text-2xl font-bold font-heading text-slate-800">ConnectSphere</h3>
                                <p className="text-lg text-slate-600 mt-2">A decentralized social networking app for creators.</p>
                                <div className="flex gap-8 mt-6 border-t pt-6">
                                    <div>
                                        <p className="text-3xl font-bold text-brand-accent-teal">$500k</p>
                                        <p className="text-slate-500">Pre-seed funding secured</p>
                                    </div>
                                     <div>
                                        <p className="text-3xl font-bold text-brand-accent-teal">80%</p>
                                        <p className="text-slate-500">Faster time-to-market</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Final CTA Section --- */}
            <section ref={addToRefs} className="fade-in-section py-20 sm:py-24">
                 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800">Launch your MVP in weeks, not months.</h2>
                    <div className="mt-8">
                         <Link
                            to="/dashboard"
                            className="inline-block bg-brand-accent-teal text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 shadow-lg glow-on-hover"
                        >
                            Start Building Today
                        </Link>
                    </div>
                 </div>
            </section>
        </div>
    );
};

export default MvpDevelopment;
