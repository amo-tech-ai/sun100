
import React, { useState } from 'react';

// Icons
const RefreshIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>;
const DownloadIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const ShareIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>;
const TrendingUpIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const SparklesIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const GlobeIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const InfoIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;

// --- SUB-COMPONENTS ---

const KpiCard = ({ label, value, subtext, trend }: { label: string, value: string, subtext: string, trend?: string }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
        <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-brand-blue">{value}</h3>
            {trend && (
                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <TrendingUpIcon /> {trend}
                </span>
            )}
        </div>
        <p className="text-sm text-gray-400 mt-auto pt-2">{subtext}</p>
    </div>
);

const MarketFunnelChart = () => {
    return (
        <div className="relative h-64 w-full flex flex-col justify-center gap-4 pt-4">
            {/* TAM */}
            <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-blue-100 rounded-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative z-10 h-16 bg-blue-200/50 border border-blue-300 rounded-lg flex items-center px-6" style={{ width: '100%' }}>
                    <div className="w-full flex justify-between text-blue-900">
                        <span className="font-bold text-sm">TAM</span>
                    </div>
                </div>
                <div className="absolute top-0 right-4 h-full flex items-center text-blue-900 font-bold z-20">100%</div>
            </div>

            {/* SAM */}
            <div className="relative group cursor-pointer" style={{ width: '75%' }}>
                 {/* Dotted Line Connector */}
                 <div className="absolute -top-4 left-0 h-4 w-px border-l border-dashed border-gray-300"></div>
                 <div className="absolute -top-4 right-0 h-4 w-px border-l border-dashed border-gray-300"></div>

                <div className="absolute inset-0 bg-indigo-100 rounded-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative z-10 h-16 bg-indigo-200/50 border border-indigo-300 rounded-lg flex items-center px-6">
                    <div className="w-full flex justify-between text-indigo-900">
                        <span className="font-bold text-sm">SAM</span>
                    </div>
                </div>
                <div className="absolute top-0 right-4 h-full flex items-center text-indigo-900 font-bold z-20">28%</div>
            </div>

            {/* SOM */}
            <div className="relative group cursor-pointer" style={{ width: '25%' }}>
                <div className="absolute -top-4 left-0 h-4 w-px border-l border-dashed border-gray-300"></div>
                 <div className="absolute -top-4 right-0 h-4 w-px border-l border-dashed border-gray-300"></div>

                <div className="absolute inset-0 bg-brand-orange/10 rounded-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative z-10 h-16 bg-brand-orange/20 border border-brand-orange/40 rounded-lg flex items-center px-6">
                    <div className="w-full flex justify-between text-orange-900">
                        <span className="font-bold text-sm">SOM</span>
                    </div>
                </div>
                <div className="absolute top-0 right-4 h-full flex items-center text-orange-900 font-bold z-20">2%</div>
            </div>
        </div>
    );
};

const SegmentationDonut = () => {
    // Simple CSS Conic Gradient
    return (
        <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-40 h-40 flex-shrink-0">
                <div className="w-full h-full rounded-full" 
                     style={{ background: `conic-gradient(#4F46E5 0% 45%, #818CF8 45% 80%, #E87C4D 80% 100%)` }}>
                </div>
                <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-brand-blue">3</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Segments</span>
                </div>
            </div>
            <div className="flex-1 w-full space-y-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                        <span className="text-sm font-medium text-gray-700">Enterprise</span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">45%</div>
                        <div className="text-xs text-gray-400">$19.1B</div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                        <span className="text-sm font-medium text-gray-700">Mid-Market</span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">35%</div>
                        <div className="text-xs text-gray-400">$14.9B</div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-brand-orange"></div>
                        <span className="text-sm font-medium text-gray-700">SMB</span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">20%</div>
                        <div className="text-xs text-gray-400">$8.5B</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ScenarioCard = ({ title, value, confidence, assumptions, color }: { title: string, value: string, confidence: number, assumptions: string[], color: string }) => (
    <div className={`p-5 rounded-xl border bg-white hover:shadow-md transition-shadow cursor-default border-gray-200`}>
        <div className="flex justify-between items-start mb-3">
            <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${color}`}>
                {title}
            </span>
            <span className="text-xs text-gray-500">Confidence: {confidence}%</span>
        </div>
        <h3 className="text-3xl font-extrabold text-gray-900 mb-4">{value}</h3>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Assumptions</p>
            <ul className="space-y-1">
                {assumptions.map((a, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="mt-0.5 text-gray-300">•</span> {a}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const InsightItem = ({ text }: { text: string }) => (
    <li className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed bg-indigo-50/50 p-3 rounded-lg border border-indigo-50">
        <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-indigo-500"></div>
        {text}
    </li>
);

const SourceItem = ({ title, date, url }: { title: string, date: string, url: string }) => (
    <div className="group">
        <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="text-sm font-medium text-brand-blue group-hover:text-brand-orange transition-colors truncate">{title}</h4>
            <div className="flex justify-between items-center mt-1">
                 <span className="text-xs text-gray-400">{date}</span>
                 <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">View Source ↗</span>
            </div>
        </a>
    </div>
);


const MarketSizeAnalysis: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FAFAF8] font-display">
            
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-brand-blue">Market Size Analysis</h1>
                            <p className="text-gray-500 text-sm mt-1">Understand the size, opportunity, and growth of your market.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <ShareIcon /> Share
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <DownloadIcon /> Export Report
                            </button>
                            <button className="px-4 py-2 bg-brand-blue text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-sm">
                                <RefreshIcon /> Recalculate
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* KPI Row */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard 
                        label="TAM (Total Addressable Market)" 
                        value="$42.5B" 
                        subtext="Full potential market" 
                    />
                    <KpiCard 
                        label="SAM (Serviceable Available)" 
                        value="$12.1B" 
                        subtext="Direct reachable segment" 
                        
                    />
                    <KpiCard 
                        label="SOM (Obtainable Market)" 
                        value="$850M" 
                        subtext="Target market share (5-7%)" 
                        
                    />
                    <KpiCard 
                        label="Market Growth Rate" 
                        value="18.4%" 
                        subtext="CAGR (2024-2028)" 
                        trend="Accelerating"
                    />
                </section>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Market Volume Chart */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-brand-blue">Market Volume Breakdown</h3>
                                <p className="text-sm text-gray-500 mt-1">Visualizing the funnel from total market to your obtainable share.</p>
                            </div>
                            <MarketFunnelChart />
                            <div className="flex justify-between mt-8 pt-6 border-t border-dashed border-gray-200">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">1</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Bottom-Up</p>
                                        <p className="text-xs text-gray-500 max-w-[200px]">Calculated based on current pricing ($49/user) × 15M potential active users.</p>
                                    </div>
                                </div>
                                 <div className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">2</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Top-Down</p>
                                        <p className="text-xs text-gray-500 max-w-[200px]">Derived from 4.5% of the global $940B productivity software market.</p>
                                    </div>
                                </div>
                                 <div className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">3</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Value Theory</p>
                                        <p className="text-xs text-gray-500 max-w-[200px]">Based on displacement of 3 legacy tools per customer account.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Segmentation */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Segmentation Card */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
                                <h3 className="text-lg font-bold text-brand-blue mb-6">Customer Segmentation</h3>
                                <SegmentationDonut />
                            </div>

                            {/* Expansion Card */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white shadow-md flex flex-col justify-between">
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                                        <GlobeIcon />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">Global Expansion</h3>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        APAC markets are showing 22% faster adoption for this category than NA/EMEA.
                                    </p>
                                </div>
                                <button className="w-full mt-6 py-2 bg-white text-slate-900 font-bold text-xs rounded-lg hover:bg-gray-100 transition-colors">
                                    View Region Data
                                </button>
                            </div>
                        </div>

                        {/* Scenario Modeling */}
                        <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-brand-blue">Scenario Modeling</h3>
                                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600 border border-gray-200">AI Confidence: High</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <ScenarioCard 
                                    title="Conservative" 
                                    value="$28.4B" 
                                    confidence={95} 
                                    assumptions={["Market grows at 12%", "Current pricing holds", "10% churn rate"]}
                                    color="bg-gray-100 text-gray-700"
                                />
                                <ScenarioCard 
                                    title="Realistic" 
                                    value="$42.5B" 
                                    confidence={82} 
                                    assumptions={["Market grows at 18%", "5% upsell adoption", "Stable churn"]}
                                    color="bg-blue-50 text-blue-700"
                                />
                                <ScenarioCard 
                                    title="Optimistic" 
                                    value="$68.2B" 
                                    confidence={45} 
                                    assumptions={["Market grows at 24%", "Viral loop activation", "Enterprise pivot"]}
                                    color="bg-green-50 text-green-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Sidebar) */}
                    <aside className="space-y-6">
                        
                        {/* AI Insights */}
                        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                            <h3 className="font-bold text-brand-blue mb-4 flex items-center gap-2">
                                <SparklesIcon className="text-brand-orange"/>
                                AI Market Insights
                            </h3>
                            <ul className="space-y-3">
                                <InsightItem text="This market is projected to double in size over the next 5–7 years driven by AI adoption." />
                                <InsightItem text="Competitors are shifting toward verticalized tooling, leaving a gap for horizontal platforms." />
                                <InsightItem text="Emerging demand in APAC outpaces U.S. growth by 22% in Q3 2024." />
                                <InsightItem text="Regulatory changes in EU may expand the compliance-tech sub-segment by $4B." />
                            </ul>
                        </div>

                        {/* Gemini Attribution */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-3">
                            <div className="mt-1 text-blue-500"><InfoIcon /></div>
                            <div>
                                <p className="text-xs font-bold text-gray-900">Powered by Gemini Search</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Market data is aggregated from real-time search results, public financial reports, and industry whitepapers.</p>
                                <button className="text-xs text-blue-600 font-semibold mt-2 hover:underline">View Raw Data Sources →</button>
                            </div>
                        </div>

                        {/* Sources */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 text-sm mb-4">Sources & Citations</h3>
                            <div className="divide-y divide-gray-100">
                                <SourceItem title="Gartner SaaS Market Report 2024" date="Oct 2024" url="#" />
                                <div className="text-xs text-gray-400 mt-1 mb-3 pl-3">Global SaaS spend projected to reach $232B by 2025.</div>

                                <SourceItem title="McKinsey Digital Trends" date="Sep 2024" url="#" />
                                <div className="text-xs text-gray-400 mt-1 mb-3 pl-3">AI integration increases TAM potential by 18-25% across verticals.</div>

                                <SourceItem title="Statista Cloud Services" date="Aug 2024" url="#" />
                                <div className="text-xs text-gray-400 mt-1 mb-3 pl-3">SMB cloud adoption rate growing at 14% CAGR.</div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default MarketSizeAnalysis;
