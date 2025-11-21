
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import { generateMarketSizing } from '../services/ai/investor';
import { MarketSizeAnalysis } from '../services/ai/types';

const DocumentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;

const MetricCard: React.FC<{ label: string; value: string; trend?: string; trendUp?: boolean }> = ({ label, value, trend, trendUp }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <div className="flex items-end justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            {trend && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trend}
                </span>
            )}
        </div>
    </div>
);

const DocRow: React.FC<{ title: string; type: string; date: string; status: string }> = ({ title, type, date, status }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <DocumentIcon />
            </div>
            <div>
                <h4 className="font-semibold text-slate-800">{title}</h4>
                <p className="text-xs text-gray-500 capitalize">{type} • {date}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${status === 'final' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {status}
            </span>
            <button className="text-sm font-medium text-gray-400 hover:text-brand-orange transition-colors">Edit</button>
        </div>
    </div>
);

const InvestorDashboard: React.FC = () => {
    const [marketData, setMarketData] = useState<MarketSizeAnalysis | null>(null);
    const [isCalculatingMarket, setIsCalculatingMarket] = useState(false);
    
    // Initial mock data state
    const [tam, setTam] = useState("$45B");
    const [sam, setSam] = useState("$12B");
    const [som, setSom] = useState("$150M");

    const handleRecalculateMarket = async () => {
        setIsCalculatingMarket(true);
        try {
            // Trigger the AI agent (currently mocked in edgeFunctionService)
            const result = await generateMarketSizing("SaaS", "US", "Subscription");
            setMarketData(result);
            setTam(result.tam.value);
            setSam(result.sam.value);
            setSom(result.som.value);
        } catch (error) {
            console.error("Failed to calculate market size", error);
        } finally {
            setIsCalculatingMarket(false);
        }
    };

    return (
        <div className="space-y-8 font-display animate-fade-in-up">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-blue flex items-center gap-3">
                        <BriefcaseIcon /> Investor Command Center
                    </h1>
                    <p className="text-gray-500 mt-1">Manage fundraising, track metrics, and generate investor updates.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-green-100 border border-green-200 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-green-700 uppercase">Fundraising Active</span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Seed Round • 8 Months Runway</span>
                </div>
            </header>

            {/* KPI Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard label="MRR" value="$12,450" trend="+15% MoM" trendUp={true} />
                <MetricCard label="Net Burn" value="$45,000" trend="-5% MoM" trendUp={true} />
                <MetricCard label="Cash on Hand" value="$320,000" />
                <MetricCard label="Commitments" value="$1.2M" trend="80% of Goal" trendUp={true} />
            </section>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Documents List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-lg text-brand-blue">Investor Documents</h3>
                            <Link to="/dashboard/investor-docs/new" className="bg-brand-blue text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2">
                                <PlusIcon /> New Doc
                            </Link>
                        </div>
                        <div>
                            <DocRow title="Seed Round One-Pager" type="One-Pager" date="Aug 28, 2024" status="final" />
                            <DocRow title="August Investor Update" type="Update" date="Sep 01, 2024" status="draft" />
                            <DocRow title="GTM Strategy Q4" type="Strategy" date="Aug 15, 2024" status="final" />
                            <DocRow title="Series A Deal Memo" type="Memo" date="Aug 10, 2024" status="draft" />
                        </div>
                    </div>

                    {/* Market Sizing Widget */}
                    <div className="bg-indigo-900 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden transition-all duration-500">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        Market Sizing Agent 
                                        {isCalculatingMarket && <span className="text-xs bg-indigo-700 px-2 py-1 rounded animate-pulse">Gemini Thinking...</span>}
                                    </h3>
                                    <p className="text-indigo-200 text-sm mt-1">Powered by Gemini 3 Google Search Grounding</p>
                                </div>
                                <TrendingUpIcon />
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                    <p className="text-xs text-indigo-300 uppercase font-bold mb-1">TAM</p>
                                    <p className="text-2xl font-bold">{tam}</p>
                                </div>
                                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                    <p className="text-xs text-indigo-300 uppercase font-bold mb-1">SAM</p>
                                    <p className="text-2xl font-bold">{sam}</p>
                                </div>
                                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-green-400/50 hover:bg-white/20 transition-colors">
                                    <p className="text-xs text-green-300 uppercase font-bold mb-1">SOM</p>
                                    <p className="text-2xl font-bold text-green-400">{som}</p>
                                </div>
                            </div>

                            {marketData && (
                                <div className="mt-6 p-4 bg-indigo-800/50 rounded-lg text-sm text-indigo-100">
                                    <p><span className="font-bold">Insight:</span> {marketData.methodology}</p>
                                    {marketData.tam.sourceUrl && (
                                        <a href={marketData.tam.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-300 hover:text-white underline mt-2 inline-block flex items-center gap-1">
                                            <SearchIcon /> Source Verified
                                        </a>
                                    )}
                                </div>
                            )}

                            <div className="mt-6 text-center">
                                <button 
                                    onClick={handleRecalculateMarket}
                                    disabled={isCalculatingMarket}
                                    className="text-sm font-semibold text-indigo-200 hover:text-white transition-colors underline disabled:opacity-50"
                                >
                                    {isCalculatingMarket ? 'Calculating...' : 'Recalculate Market Size'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Action Items */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-lg text-brand-blue mb-4">Data Room Readiness</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative w-16 h-16">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E87C4D" strokeWidth="3" strokeDasharray="65, 100" transform="rotate(-90 18 18)" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-brand-blue">65%</div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Your data room is missing critical documents for Due Diligence.</p>
                            </div>
                        </div>
                        <ul className="space-y-3">
                            {['IP Assignment Agreements', 'Cap Table (Current)', 'Financial Model (XLS)'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full mt-6 py-2 bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-sm">
                            Fix with AI
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorDashboard;
