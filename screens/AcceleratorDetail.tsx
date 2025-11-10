
import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

// FIX: Moved icon definitions before they are used in `mockAccelerator` to resolve block-scoped variable errors.
// --- Icons ---
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const NetworkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M12 22v-5"/><circle cx="5" cy="12" r="3"/><path d="M22 12h-5"/><circle cx="19" cy="12" r="3"/><path d="M5 12H2"/><path d="M12 5V2"/><path d="m4.2 19.8 1.4-1.4"/><path d="M18.4 5.6 17 7"/><path d="m4.2 4.2 1.4 1.4"/><path d="M18.4 18.4 17 17"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent-teal"><path d="M20 6 9 17l-5-5"/></svg>;

// --- Mock Data ---
const mockAccelerator = {
    id: 'y-combinator',
    name: 'Y Combinator',
    location: 'USA',
    logo: 'Y C',
    headline: 'Empowering founders to build global startups.',
    subtext: 'The original and one of the most prestigious startup accelerators, YC has funded over 3,500 startups including Stripe, Airbnb, and Dropbox.',
    website: 'https://www.ycombinator.com',
    stats: {
        founded: 2005,
        funded: '3,500+',
        investment: '$500k',
        equity: '7%',
        locations: '2',
    },
    about: 'Y Combinator provides seed funding for startups. Seed funding is the earliest stage of venture funding. It pays your expenses while you’re getting started. Y Combinator invests a small amount of money ($500,000) in a large number of startups.',
    programLength: '3-month program',
    focusAreas: ['AI', 'Fintech', 'Healthtech', 'Sustainability', 'B2B SaaS'],
    alumni: [
        { name: 'Stripe', valuation: '$65B' },
        { name: 'Airbnb', valuation: '$100B+' },
        { name: 'Dropbox', valuation: '$9B' },
        { name: 'Coinbase', valuation: '$50B+' },
    ],
    perks: [
        { name: 'Funding', icon: <DollarSignIcon /> },
        { name: 'World-Class Mentorship', icon: <UsersIcon /> },
        { name: 'Vast Alumni Network', icon: <NetworkIcon /> },
        { name: 'Exclusive Partner Deals', icon: <SparklesIcon /> },
    ],
    applicationProcess: [
        { step: 1, name: 'Submit Application', desc: 'Complete the online application with your team and idea.' },
        { step: 2, name: 'Initial Screening', desc: 'Our team reviews your application for fit and potential.' },
        { step: 3, name: 'Interview Round', desc: 'Top candidates are invited for a 10-minute video interview.' },
        { step: 4, name: 'Offer & Onboarding', desc: 'Successful teams receive an offer and begin the program.' },
    ],
    related: [
        { id: 'techstars', name: 'Techstars', location: 'Global' },
        { id: '500-global', name: '500 Global', location: 'Global' },
        { id: 'antler', name: 'Antler', location: 'Global' },
    ],
};

const AcceleratorDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
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
            
            {/* Hero Section */}
            <section ref={addToRefs} className="fade-in-section relative bg-brand-deep-blue text-white py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_top,transparent_30%,black)]"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center font-bold text-4xl text-brand-deep-blue flex-shrink-0">{mockAccelerator.logo}</div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold font-heading">{mockAccelerator.name}</h1>
                            <p className="mt-2 text-xl text-slate-300">{mockAccelerator.headline}</p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <a href="#" className="inline-block bg-brand-accent-teal text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">Apply Now</a>
                                <a href={mockAccelerator.website} target="_blank" rel="noopener noreferrer" className="inline-block bg-white/10 border border-white/20 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-colors">Visit Website</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Facts Bar */}
            <section ref={addToRefs} className="fade-in-section bg-white/50 border-y border-gray-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center py-6">
                        <div><p className="text-2xl font-bold font-heading text-slate-800">{mockAccelerator.stats.founded}</p><p className="text-sm text-slate-500">Founded</p></div>
                        <div><p className="text-2xl font-bold font-heading text-slate-800">{mockAccelerator.stats.funded}</p><p className="text-sm text-slate-500">Startups Funded</p></div>
                        <div><p className="text-2xl font-bold font-heading text-slate-800">{mockAccelerator.stats.investment}</p><p className="text-sm text-slate-500">Standard Deal</p></div>
                        <div><p className="text-2xl font-bold font-heading text-slate-800">{mockAccelerator.stats.equity}</p><p className="text-sm text-slate-500">Equity</p></div>
                        <div><p className="text-2xl font-bold font-heading text-slate-800">{mockAccelerator.stats.locations}</p><p className="text-sm text-slate-500">Global Hubs</p></div>
                    </div>
                </div>
            </section>
            
            <div className="max-w-7xl mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="lg:w-2/3 space-y-16">
                        <section ref={addToRefs} className="fade-in-section">
                            <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4">Program Overview</h2>
                            <p className="text-gray-700 leading-relaxed mb-6">{mockAccelerator.about}</p>
                            <div className="flex flex-wrap gap-2">
                                {mockAccelerator.focusAreas.map(area => <span key={area} className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">{area}</span>)}
                            </div>
                        </section>

                         <section ref={addToRefs} className="fade-in-section">
                            <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4">Alumni Highlights</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                {mockAccelerator.alumni.map(alum => (
                                    <div key={alum.name} className="bg-white p-4 rounded-lg border border-gray-200/80">
                                        <p className="font-bold text-lg text-slate-800">{alum.name}</p>
                                        <p className="text-sm text-slate-500">Valued at {alum.valuation}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section ref={addToRefs} className="fade-in-section">
                            <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4">Application Process</h2>
                            <div className="relative border-l-2 border-dashed border-gray-300 ml-4">
                                {mockAccelerator.applicationProcess.map(item => (
                                    <div key={item.step} className="mb-8 pl-8 relative">
                                        <div className="absolute -left-4 top-1 w-7 h-7 bg-brand-accent-teal text-white rounded-full flex items-center justify-center font-bold">{item.step}</div>
                                        <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sticky Sidebar */}
                    <aside className="lg:w-1/3">
                        <div className="sticky top-28 bg-white p-6 rounded-xl shadow-md border border-gray-200/80">
                            <h3 className="text-xl font-bold font-heading text-gray-800 mb-4">Perks & Support</h3>
                            <ul className="space-y-4">
                                {mockAccelerator.perks.map(perk => (
                                    <li key={perk.name} className="flex items-center gap-3">
                                        <div className="bg-brand-accent-teal/10 p-2 rounded-full text-brand-accent-teal">{perk.icon}</div>
                                        <span className="font-semibold text-gray-700">{perk.name}</span>
                                    </li>
                                ))}
                            </ul>
                            <a href="#" className="mt-6 block w-full text-center bg-brand-accent-teal text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-colors">Apply by Oct 1st</a>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Related Accelerators */}
            <section ref={addToRefs} className="fade-in-section py-20 bg-white/50 border-t border-gray-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold font-heading text-center text-gray-800 mb-8">Related Accelerators</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                         {mockAccelerator.related.map(accel => (
                            <Link to={`/accelerators/${accel.id}`} key={accel.id} className="bg-white p-6 rounded-lg border border-gray-200/80 hover:shadow-lg hover:-translate-y-1 transition-all">
                                <h3 className="font-bold text-lg text-gray-800">{accel.name}</h3>
                                <p className="text-sm text-gray-500">{accel.location}</p>
                            </Link>
                         ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link to="/accelerators" className="font-bold text-brand-orange hover:underline">View All Accelerators &rarr;</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AcceleratorDetail;
