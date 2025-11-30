
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInvestorById, Investor } from '../services/vcService';
import { FitCheckModal } from '../components/directory/FitCheckModal';

const DetailItem = ({ label, value, subtext, highlight }: { label: string, value: string | number | undefined, subtext?: string, highlight?: boolean }) => (
    <div className={`p-5 rounded-xl border ${highlight ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
        <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${highlight ? 'text-orange-800' : 'text-gray-500'}`}>{label}</p>
        <p className={`text-lg font-bold ${highlight ? 'text-orange-900' : 'text-gray-900'}`}>{value || 'N/A'}</p>
        {subtext && <p className={`text-xs mt-1 ${highlight ? 'text-orange-700' : 'text-gray-500'}`}>{subtext}</p>}
    </div>
);

const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100">
        <span className="text-brand-orange">{icon}</span>
        {title}
    </h3>
);

const TagList = ({ tags, color = 'blue' }: { tags: string[], color?: string }) => {
    const colors: {[key: string]: string} = {
        blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
        purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
        gray: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
    };
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map(t => (
                <span key={t} className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${colors[color]}`}>
                    {t}
                </span>
            ))}
        </div>
    );
};

const VCDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [investor, setInvestor] = useState<Investor | undefined>();
    const [loading, setLoading] = useState(true);
    const [isFitModalOpen, setIsFitModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            getInvestorById(id).then(data => {
                setInvestor(data);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBF8F5]">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-orange"></div>
        </div>
    );
    
    if (!investor) return <div className="p-8 text-center text-gray-600">Investor not found.</div>;

    const formatMoney = (val?: number) => val ? `$${(val/1000).toLocaleString()}k` : 'N/A';
    const formatMillions = (val?: number) => val ? `$${(val/1000000).toLocaleString()}M` : 'N/A';

    return (
        <div className="min-h-screen bg-[#FBF8F5] pb-20">
            {/* Header / Hero */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                        <Link to="/directory" className="hover:text-brand-orange transition-colors">Directory</Link>
                        <span>/</span>
                        <span className="text-gray-900">{investor.name}</span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-32 h-32 rounded-2xl bg-white border border-gray-200 p-4 shadow-sm flex items-center justify-center flex-shrink-0">
                            {investor.logo_url ? <img src={investor.logo_url} alt={investor.name} className="w-full h-full object-contain" /> : <span className="text-4xl font-bold text-gray-300">{investor.name[0]}</span>}
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{investor.name}</h1>
                                    <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">{investor.description}</p>
                                </div>
                                <div className="flex flex-col gap-3 min-w-[160px]">
                                    <a href={investor.application_link || '#'} target="_blank" rel="noreferrer" className="w-full py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-md text-center">
                                        Apply Now
                                    </a>
                                    <button className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors text-center flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                        Save Profile
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-6">
                                <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                                    {investor.type.replace('_', ' ')}
                                </span>
                                {investor.geographies.map(g => (
                                    <span key={g} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-semibold border border-gray-200">
                                        📍 {g}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Left: Deep Dive */}
                <div className="lg:col-span-2 space-y-10">
                    
                    {/* Investment Strategy Section */}
                    <section>
                        <SectionHeader title="Investment Strategy" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8">
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span>
                                    Target Stages
                                </h4>
                                <TagList tags={investor.stages} color="green" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                    Specialties & Sectors
                                </h4>
                                <TagList tags={investor.specialties} color="blue" />
                            </div>
                        </div>
                    </section>

                    {/* The Deal Section */}
                    <section>
                        <SectionHeader title="The Deal & Equity" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <DetailItem 
                                label="Typical Check Size" 
                                value={`${formatMoney(investor.min_check_size)} - ${formatMillions(investor.max_check_size)}`} 
                                subtext={investor.type === 'accelerator' ? 'Often standardized' : 'Varies by conviction'}
                            />
                            <DetailItem 
                                label="Typical Equity Range" 
                                value={investor.equity_percent_min ? `${investor.equity_percent_min}% - ${investor.equity_percent_max}%` : 'Negotiable'} 
                                subtext={investor.terms_summary ? 'See summary below' : 'Standard Market Terms'}
                                highlight={investor.type === 'accelerator'}
                            />
                        </div>
                        {investor.terms_summary && (
                            <div className="bg-orange-50/50 p-5 rounded-lg border border-orange-100 text-sm text-orange-900 flex gap-3 items-start">
                                <span className="font-bold flex-shrink-0 mt-0.5">Deal Summary:</span> 
                                <span className="leading-relaxed">{investor.terms_summary}</span>
                            </div>
                        )}
                    </section>

                    {/* Benefits */}
                    <section>
                        <SectionHeader title="Founder Benefits" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>} />
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                            <ul className="grid sm:grid-cols-2 gap-4">
                                {investor.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-gray-700 font-medium">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Portfolio */}
                    <section>
                        <SectionHeader title="Notable Alumni" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {investor.notable_investments.map((comp, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow cursor-default">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full mb-3 flex items-center justify-center text-gray-400 font-bold">{comp[0]}</div>
                                    <span className="font-bold text-gray-800">{comp}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right: Quick Stats & AI */}
                <div className="lg:col-span-1 space-y-8">
                    {/* AI Card */}
                    <div className="bg-gradient-to-br from-brand-blue to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </div>
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <span className="bg-brand-orange text-white text-xs px-2 py-0.5 rounded uppercase">AI Power</span>
                            Fit Check
                        </h3>
                        <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                            Don't waste time applying if it's not a match. Use Gemini 3 to analyze your startup against {investor.name}'s thesis.
                        </p>
                        <button 
                            onClick={() => setIsFitModalOpen(true)}
                            className="w-full py-3 bg-white text-brand-blue font-bold rounded-xl hover:bg-brand-orange hover:text-white transition-all shadow-lg transform group-hover:-translate-y-1"
                        >
                            Analyze Compatibility
                        </button>
                    </div>

                    {/* Timeline & Stats */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Process</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Decision Speed</span>
                                <span className="text-sm font-bold text-gray-900">{investor.time_to_decision || 'Unknown'}</span>
                            </div>
                            {investor.time_to_decision && (
                                <>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-400 italic text-center">Faster than 70% of firms</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Connect</h3>
                        <div className="space-y-3">
                            <a href={investor.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium border border-transparent hover:border-gray-200">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                Visit Website
                            </a>
                            <a href={`mailto:${investor.contact_email || 'hello@fund.com'}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium border border-transparent hover:border-gray-200">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Email Team
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <FitCheckModal 
                isOpen={isFitModalOpen} 
                onClose={() => setIsFitModalOpen(false)} 
                investor={investor} 
            />
        </div>
    );
};

export default VCDetail;
