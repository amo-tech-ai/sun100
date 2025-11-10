
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// --- Icons ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;

const mockAccelerators = [
    { id: 'y-combinator', name: 'Y Combinator', location: 'USA', description: 'The original and one of the most prestigious startup accelerators.', offer: '$125k for 7% + $375k uncapped SAFE', focus: 'AI' },
    { id: 'techstars', name: 'Techstars', location: 'Global', description: 'A worldwide network that helps entrepreneurs succeed.', offer: '$20k for 6% + $100k convertible note', focus: 'Fintech' },
    { id: '500-global', name: '500 Global', location: 'Global', description: 'An early-stage venture fund and seed accelerator.', offer: '$150k for 6%', focus: 'AI' },
    { id: 'antler', name: 'Antler', location: 'Global', description: 'A global early-stage VC firm that invests in the defining technology companies of tomorrow.', offer: 'Varies by location', focus: 'Climate' },
    { id: 'plug-and-play', name: 'Plug and Play', location: 'USA', description: 'Connects startups to corporations and invests in over 260 companies a year.', offer: 'Corporate partnerships', focus: 'Health' },
    { id: 'seedcamp', name: 'Seedcamp', location: 'UK', description: 'Europe\'s seed fund, identifying and investing early in world-class founders.', offer: '£100k for 7.5%', focus: 'Fintech' },
    { id: 'norrsken', name: 'Norrsken', location: 'Sweden', description: 'An ecosystem for entrepreneurs solving the world’s greatest challenges.', offer: '$125k non-equity grant', focus: 'Climate' },
    { id: 'latitud', name: 'Latitud', location: 'LatAm', description: 'The premier platform for tech entrepreneurs in Latin America.', offer: 'Community & education', focus: 'AI' },
];

const Accelerators: React.FC = () => {
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
                    <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-slate-800">
                        Discover the World’s Top Startup Accelerators
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                        Find the right program to scale your AI startup — from YC to Techstars.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#accelerator-grid" className="inline-block bg-brand-accent-teal text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-colors duration-200">
                            Browse All Accelerators
                        </a>
                        <Link to="/dashboard" className="inline-block bg-white text-slate-700 font-bold py-3 px-8 rounded-lg text-lg hover:bg-slate-50 transition-colors duration-200 border border-slate-300">
                            Apply Now
                        </Link>
                    </div>
                    <div className="mt-12 flex justify-center items-center gap-6 text-slate-600 font-medium">
                        <span>50+ Global Programs</span>
                        <span className="text-slate-300">|</span>
                        <span>20+ Countries</span>
                        <span className="text-slate-300">|</span>
                        <span>$1B+ Combined Funding</span>
                    </div>
                </div>
            </section>
            
            {/* --- Filter Bar & Grid --- */}
            <div id="accelerator-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="sticky top-[80px] z-10 bg-[#FBF8F5]/80 backdrop-blur-sm py-4 mb-8">
                     <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
                        <div className="relative flex-grow w-full">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input type="search" placeholder="Search accelerators..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent-teal focus:border-transparent"/>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                             <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                <span>Region</span>
                                <ChevronDownIcon />
                            </button>
                             <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                <span>Focus</span>
                                <ChevronDownIcon />
                            </button>
                             <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                <span>Stage</span>
                                <ChevronDownIcon />
                            </button>
                              <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                <span>Type</span>
                                <ChevronDownIcon />
                            </button>
                        </div>
                    </div>
                 </div>

                <div ref={addToRefs} className="fade-in-section grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {mockAccelerators.map((accel) => (
                        <div key={accel.id} className="bg-white rounded-lg shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200/60">
                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                     <div className="w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center font-bold text-xl text-slate-500 flex-shrink-0">{accel.name.charAt(0)}</div>
                                    <div>
                                        <h2 className="text-lg font-bold font-heading text-gray-800">{accel.name}</h2>
                                        <p className="text-gray-500 text-sm">{accel.location}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">{accel.description}</p>
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-semibold text-slate-700 text-center">
                                    {accel.offer}
                                </div>
                            </div>
                            <div className="border-t border-gray-200/80 mt-auto p-4 bg-white">
                                 <Link to={`/accelerators/${accel.id}`} className="w-full block text-center font-semibold text-slate-600 hover:text-brand-accent-teal text-sm border border-slate-300 rounded-md px-4 py-2 bg-white hover:border-brand-accent-teal transition-colors">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats + Impact Section */}
            <section ref={addToRefs} className="fade-in-section py-20 sm:py-24 mt-16">
                 <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                         {[
                            { value: "1,000+", label: "Startups Graduated" },
                            { value: "$5B+", label: "Raised by Alumni" },
                            { value: "70%", label: "Receive Follow-on Funding" },
                        ].map(metric => (
                            <div key={metric.label}>
                                <p className="text-4xl md:text-5xl font-extrabold font-heading text-brand-accent-teal">{metric.value}</p>
                                <p className="text-slate-600 mt-2">{metric.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section ref={addToRefs} className="fade-in-section pb-20 sm:pb-24">
                 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-800">Ready to find your perfect accelerator?</h2>
                    <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
                        Compare programs, apply directly, and fast-track your startup’s growth.
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

export default Accelerators;
