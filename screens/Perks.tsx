
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// --- Icons ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>;
const CreditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;


const mockPerks = [
    { id: 'google-cloud', company: 'Google Cloud', logoChar: 'G', description: 'A full suite of computing services designed to help businesses build, innovate, and scale.', offer: 'Up to $200,000 in Credits', users: '500+', rating: 4.8, type: 'featured' },
    { id: 'hubspot', company: 'HubSpot', logoChar: 'H', description: 'The ultimate platform for inbound marketing, sales, and service under one roof.', offer: '30-75% Off over 1-3 Years', users: '350+', rating: 4.7, type: 'popular' },
    { id: 'stripe', company: 'Stripe', logoChar: 'S', description: 'Payment processing and financial infrastructure for businesses of all sizes.', offer: 'Waived fees on first $1M processed', users: '420+', rating: 4.9, type: null },
    { id: 'notion', company: 'Notion', logoChar: 'N', description: 'Your all-in-one workspace for notes, tasks, wikis, and databases.', offer: '6 Months Free + Unlimited AI', users: '480+', rating: 4.6, type: 'popular' },
    { id: 'zendesk', company: 'Zendesk', logoChar: 'Z', description: 'Customer engagement software putting all interactions in one interface.', offer: '6 months free', users: '280+', rating: 4.6, type: null },
    { id: 'aws', company: 'AWS', logoChar: 'A', description: 'Cloud services for compute power, database storage, and content delivery.', offer: 'Up to $100,000 in Credits', users: '600+', rating: 4.8, type: 'featured' },
    { id: 'openai', company: 'OpenAI', logoChar: 'O', description: 'Advanced AI models and APIs for building intelligent applications.', offer: '$500 in API Credits', users: '320+', rating: 4.9, type: 'new' },
    { id: 'figma', company: 'Figma', logoChar: 'F', description: 'Collaborative interface design tool for teams.', offer: 'Professional Plan Free for 1 Year', users: '380+', rating: 4.8, type: null },
    { id: 'canva', company: 'Canva', logoChar: 'C', description: 'Design presentations, social media graphics, and more with drag-and-drop.', offer: 'Pro Plan for 6 Months', users: '540+', rating: 4.7, type: null },
];

const categories = ['All', 'AI', 'Cloud & Infrastructure', 'Marketing & Sales', 'Development Tools', 'Design & Creative', 'Finance & Legal', 'Analytics', 'HR & Operations'];

const Perks: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
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
            `}</style>
            
            {/* --- Hero Section --- */}
            <section ref={addToRefs} className="fade-in-section text-center py-20 md:py-28">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-brand-accent-teal font-semibold bg-brand-accent-teal/10 px-3 py-1 rounded-full text-sm">PARTNER PERKS</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-slate-800 mt-4">
                        Exclusive Perks for AI Founders
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                        Access $900k+ in credits and discounts from 50+ leading startup tools.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="#perks-grid" className="inline-block bg-brand-accent-teal text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 shadow-sm">
                            Browse All Perks
                        </Link>
                        <Link to="/dashboard" className="inline-block bg-white text-slate-700 font-bold py-3 px-8 rounded-lg text-lg hover:bg-slate-50 transition-colors duration-200 border border-slate-300">
                            Join Community
                        </Link>
                    </div>
                     <div className="mt-12 flex justify-center items-center gap-6 text-slate-600 font-medium">
                        <span>$900k+ Value</span>
                        <span className="text-slate-300">|</span>
                        <span>50+ Partners</span>
                         <span className="text-slate-300">|</span>
                        <span>1,000+ Startups Helped</span>
                    </div>
                </div>
            </section>
            
            {/* --- Filter Bar & Perks Grid --- */}
            <div ref={addToRefs} id="perks-grid" className="fade-in-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* --- Filter Bar --- */}
                <div className="sticky top-[80px] z-10 bg-[#FBF8F5]/80 backdrop-blur-sm py-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:max-w-xs">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input type="search" placeholder="Search perks..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent-teal focus:border-transparent"/>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                    activeCategory === category
                                        ? 'bg-brand-accent-teal text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Perks Grid --- */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {mockPerks.map((perk) => (
                        <div key={perk.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200/60">
                            <div className="p-6">
                                {perk.type && (
                                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full mb-3 inline-block ${perk.type === 'featured' ? 'bg-blue-100 text-blue-800' : perk.type === 'popular' ? 'bg-teal-100 text-teal-800' : 'bg-purple-100 text-purple-800'}`}>
                                        {perk.type}
                                    </span>
                                )}
                                <div className="flex items-start gap-4">
                                     <div className="w-16 h-16 rounded-md bg-slate-100 flex items-center justify-center font-bold text-2xl text-slate-500 flex-shrink-0">{perk.logoChar}</div>
                                    <div>
                                        <h2 className="text-xl font-bold font-heading text-gray-800">{perk.company}</h2>
                                        <p className="text-gray-600 text-sm mt-1">{perk.description}</p>
                                    </div>
                                </div>
                                 <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3">
                                    <CreditIcon />
                                    <span className="font-semibold text-slate-700">{perk.offer}</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-200/80 mt-auto p-4 bg-white flex justify-between items-center">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>{perk.users} using this</span>
                                    <div className="flex items-center gap-1">
                                        <StarIcon />
                                        <span>{perk.rating}</span>
                                    </div>
                                </div>
                                <Link to={`/perks/${perk.id}`} className="font-semibold text-slate-600 hover:text-brand-accent-teal text-sm border border-slate-300 rounded-md px-4 py-2 bg-white hover:border-brand-accent-teal transition-colors">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Stats Section --- */}
            <section ref={addToRefs} className="fade-in-section py-20 sm:py-24 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="bg-white rounded-lg p-12 border border-gray-200/60">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                             {[
                                { value: "$900k+", label: "Total Value in Credits" },
                                { value: "50+", label: "Partner Companies" },
                                { value: "1,000+", label: "Startups Helped" },
                                { value: "100+", label: "Tools & Services" },
                            ].map(metric => (
                                <div key={metric.label}>
                                    <p className="text-4xl md:text-5xl font-extrabold font-heading text-brand-accent-teal">{metric.value}</p>
                                    <p className="text-slate-600 mt-2">{metric.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Join Section --- */}
            <section ref={addToRefs} className="fade-in-section pb-20 sm:pb-24">
                 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800">Ready to unlock exclusive perks?</h2>
                    <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
                        Join the community to access all deals and start saving thousands.
                    </p>
                    <div className="mt-8">
                         <Link
                            to="/dashboard"
                            className="inline-block bg-brand-accent-teal text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200 shadow-sm"
                        >
                            Join Sun AI
                        </Link>
                    </div>
                 </div>
            </section>

        </div>
    );
};

export default Perks;
