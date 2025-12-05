
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStartup } from '../hooks/useStartup';
import { getDecks } from '../services/deckService';
import { getEvents } from '../services/eventService';
import { getTasks } from '../services/crmService';

// --- ICONS & ASSETS ---
const IconRocket = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
);
const IconPresentation = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>
);
const IconSearch = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const IconUsers = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconChart = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
);
const IconBrain = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a3 3 0 1 1 5.997.129 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 9a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 18 18Z"/><path d="M12 5v13"/><path d="M9 13h6"/><path d="M12 18h6"/></svg>
);
const IconChevronDown = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);
const IconCheck = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>
);
const IconFile = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

// --- SUB-COMPONENTS ---

const ServiceCard = ({ title, desc, icon, link, actionText = "Launch" }: { title: string, desc: string, icon: React.ReactNode, link: string, actionText?: string }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 group flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300 border border-white shadow-sm">
                {icon}
            </div>
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed flex-grow">{desc}</p>
        <div className="mt-6 pt-4 border-t border-slate-50">
            <Link to={link} className="text-sm font-bold text-indigo-600 flex items-center gap-2 hover:gap-3 transition-all">
                {actionText} <IconChevronDown className="w-4 h-4 -rotate-90" />
            </Link>
        </div>
    </div>
);

const MetricCard = ({ label, value, trend, trendUp }: { label: string, value: string, trend: string, trendUp: boolean }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {trendUp ? '↑' : '↓'} {trend}
            </span>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        <div className="mt-2 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${trendUp ? 'bg-emerald-400' : 'bg-rose-400'}`} style={{width: '65%'}}></div>
        </div>
    </div>
);

const AIInsightCard = ({ title, desc, type }: { title: string, desc: string, type: 'opportunity' | 'risk' | 'strategy' }) => {
    const styles = {
        opportunity: 'border-emerald-100 bg-emerald-50/30 text-emerald-900',
        risk: 'border-rose-100 bg-rose-50/30 text-rose-900',
        strategy: 'border-indigo-100 bg-indigo-50/30 text-indigo-900',
    };
    const icons = {
        opportunity: <div className="w-2 h-2 rounded-full bg-emerald-500" />,
        risk: <div className="w-2 h-2 rounded-full bg-rose-500" />,
        strategy: <div className="w-2 h-2 rounded-full bg-indigo-500" />,
    }

    return (
        <div className={`p-4 rounded-lg border ${styles[type]} flex items-start gap-3 hover:bg-white hover:shadow-sm transition-all cursor-pointer`}>
            <div className="mt-1.5">{icons[type]}</div>
            <div>
                <h4 className="text-sm font-bold mb-1">{title}</h4>
                <p className="text-xs opacity-80 leading-relaxed">{desc}</p>
            </div>
            <button className="ml-auto text-xs font-bold underline opacity-60 hover:opacity-100">View</button>
        </div>
    );
};

const DocumentRow = ({ title, type, updated, status }: { title: string, type: string, updated: string, status: 'Draft' | 'Final' | 'Sent' }) => (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0 group cursor-pointer">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-white group-hover:text-indigo-500 group-hover:shadow-sm transition-all">
                <IconFile className="w-4 h-4" />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{title}</p>
                <p className="text-[10px] text-slate-400">{type} • {updated}</p>
            </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
            status === 'Final' ? 'bg-emerald-100 text-emerald-700' : 
            status === 'Sent' ? 'bg-blue-100 text-blue-700' : 
            'bg-slate-100 text-slate-500'
        }`}>
            {status}
        </span>
    </div>
);

// --- MAIN DASHBOARD ---

const Dashboard: React.FC = () => {
    const { profile } = useStartup();
    const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
    const [activeAiTab, setActiveAiTab] = useState<'Strategy' | 'Risks' | 'Opportunities'>('Strategy');
    
    // Mock Loading Data
    useEffect(() => {
        // In a real scenario, we'd fetch specific dashboard aggregation data here
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
            
            {/* Top Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 shadow-subtle flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Command Center</h1>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Overview for {profile.name || 'My Startup'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold border border-indigo-100">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        AI Agent Active
                    </div>
                    <Link to="/pitch-decks/new" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
                        <IconRocket className="w-3 h-3" /> Launch New Project
                    </Link>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

                {/* SECTION 1: FEATURE HUB */}
                <section>
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Startup Services</h2>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded cursor-pointer hover:bg-indigo-100 transition-colors">View All Tools</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ServiceCard 
                            title="AI Startup Profile" 
                            desc="Centralize your mission, vision, and core data to power all other AI agents." 
                            icon={<IconRocket />} 
                            link="/dashboard/startup-wizard"
                            actionText="Manage Profile"
                        />
                        <ServiceCard 
                            title="Pitch Deck Generator" 
                            desc="Create investor-ready slides instantly using Gemini 3's structured reasoning." 
                            icon={<IconPresentation />} 
                            link="/pitch-decks"
                            actionText="Create Deck"
                        />
                        <ServiceCard 
                            title="Market Research" 
                            desc="Deep dive into TAM/SAM/SOM and competitors with Google Search Grounding." 
                            icon={<IconSearch />} 
                            link="/dashboard/market-size"
                            actionText="Research"
                        />
                        <ServiceCard 
                            title="CRM & Prospector" 
                            desc="Find leads, enrich contact info, and manage deal pipelines automatically." 
                            icon={<IconUsers />} 
                            link="/dashboard/crm"
                            actionText="Find Leads"
                        />
                        <ServiceCard 
                            title="Financial Intelligence" 
                            desc="Track burn rate, runway, and forecast revenue scenarios." 
                            icon={<IconChart />} 
                            link="/dashboard/financial-overview"
                            actionText="View Financials"
                        />
                        <ServiceCard 
                            title="AI Strategic Coach" 
                            desc="Always-on analysis of your startup's health, risks, and next moves." 
                            icon={<IconBrain />} 
                            link="/dashboard" // Opens sidebar context usually
                            actionText="Ask Coach"
                        />
                    </div>
                </section>

                {/* SECTION 2: AI COMMAND PANEL */}
                <section className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl overflow-hidden relative ring-1 ring-indigo-900/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50 -z-10"></div>
                    
                    {/* Panel Header */}
                    <div 
                        className="px-6 py-4 border-b border-indigo-100/50 flex justify-between items-center cursor-pointer hover:bg-white/40 transition-colors"
                        onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-lg shadow-md">
                                <IconBrain className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">AI Command Panel</h3>
                                <p className="text-xs text-slate-500 font-medium">Real-time strategic insights based on your live metrics.</p>
                            </div>
                        </div>
                        <IconChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isAiPanelOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Panel Body */}
                    {isAiPanelOpen && (
                        <div className="p-6 animate-fade-in">
                            {/* Tabs */}
                            <div className="flex gap-4 mb-6 border-b border-slate-200/60">
                                {['Strategy', 'Risks', 'Opportunities'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveAiTab(tab as any)}
                                        className={`pb-2 text-sm font-bold transition-colors relative ${activeAiTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab}
                                        {activeAiTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
                                    </button>
                                ))}
                            </div>

                            {/* Insights Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeAiTab === 'Strategy' && (
                                    <>
                                        <AIInsightCard type="strategy" title="Pivot Validation" desc="Market signals suggest a shift to B2B Enterprise could increase LTV by 40%." />
                                        <AIInsightCard type="strategy" title="Hiring Roadmap" desc="Based on runway, delay hiring Head of Sales until Q3." />
                                    </>
                                )}
                                {activeAiTab === 'Risks' && (
                                    <>
                                        <AIInsightCard type="risk" title="High Churn Detected" desc="User retention dropped 5% last month. Review onboarding flow." />
                                        <AIInsightCard type="risk" title="Competitor Alert" desc="Competitor X just released a feature overlapping with your core USP." />
                                    </>
                                )}
                                {activeAiTab === 'Opportunities' && (
                                    <>
                                        <AIInsightCard type="opportunity" title="Grant Available" desc="Your startup qualifies for a new $50k AI innovation grant." />
                                        <AIInsightCard type="opportunity" title="Expansion Market" desc="Search trends for your product are spiking in the UK." />
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* SECTION 3: KPI OVERVIEW */}
                <section>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 pl-1">Performance Snapshot</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard label="Revenue (MRR)" value="$12,450" trend="12%" trendUp={true} />
                        <MetricCard label="Monthly Spend" value="$8,200" trend="5%" trendUp={false} />
                        <MetricCard label="Cash Available" value="$145,000" trend="Stable" trendUp={true} />
                        <MetricCard label="Runway" value="14 Mo" trend="1 Mo" trendUp={false} />
                    </div>
                </section>

                {/* SECTION 4 & 5: SPLIT LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* GROWTH & INSIGHTS */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800">Growth & Usage</h3>
                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">Last 30 Days</span>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-slate-500">Activation Rate</span>
                                    <span className="text-slate-900">24%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-slate-800 h-2 rounded-full" style={{ width: '24%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-slate-500">Retention (Week 4)</span>
                                    <span className="text-slate-900">45%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">NPS</p>
                                    <p className="text-xl font-extrabold text-slate-800">68</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Power Users</p>
                                    <p className="text-xl font-extrabold text-slate-800">128</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Session</p>
                                    <p className="text-xl font-extrabold text-slate-800">14m</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FUNDRAISING COMMAND CENTER */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl shadow-lg text-white flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-lg">Fundraising</h3>
                                    <p className="text-xs text-slate-400">Seed Round • Q1 2025 Goal</p>
                                </div>
                                <span className="bg-white/10 text-xs font-bold px-3 py-1 rounded-full border border-white/10">Active</span>
                            </div>
                            
                            <div className="mb-8">
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-bold">$850k</span>
                                    <span className="text-sm text-slate-400 mb-1">/ $1.5M Committed</span>
                                </div>
                                <div className="w-full bg-black/30 rounded-full h-3 border border-white/5">
                                    <div className="bg-blue-500 h-full rounded-full relative" style={{ width: '56%' }}>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-full bg-white/50"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold">Leads</p>
                                    <p className="text-lg font-bold">42</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold">Meetings</p>
                                    <p className="text-lg font-bold text-blue-400">8</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold">Offers</p>
                                    <p className="text-lg font-bold text-green-400">1</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <Link to="/dashboard/funding-manager" className="flex-1 bg-white text-slate-900 text-center text-xs font-bold py-3 rounded-lg hover:bg-slate-100 transition-colors">
                                Manage Pipeline
                            </Link>
                            <button className="flex-1 bg-transparent border border-white/20 text-white text-center text-xs font-bold py-3 rounded-lg hover:bg-white/5 transition-colors">
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>

                {/* SECTION 6: DOCUMENTS WORKSPACE */}
                <section className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-slate-800">Recent Documents</h3>
                        <Link to="/dashboard/investor-docs" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">View All</Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        <DocumentRow title="Seed Pitch Deck v3" type="Pitch Deck" updated="2 hours ago" status="Draft" />
                        <DocumentRow title="One Pager (Tech)" type="One Pager" updated="1 day ago" status="Final" />
                        <DocumentRow title="Financial Model 2025" type="Spreadsheet" updated="3 days ago" status="Draft" />
                        <DocumentRow title="Investor Update - October" type="Update" updated="1 week ago" status="Sent" />
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Dashboard;
