
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateMarketSizing, generateFinancialForecast } from '../services/ai/investor';
import { MarketSizeAnalysis, FinancialData, InvestorDoc } from '../services/ai/types';
import { getLatestMetrics, getMetrics, MetricEntry } from '../services/metricsService';
import { getInvestorDocs } from '../services/investorDocService';
import { MetricsTable } from '../components/investor/MetricsTable';
import { InvestorChat } from '../components/investor/InvestorChat';
import Table from '../components/Table';

// --- ICONS ---
const DocumentIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;
const TrendingUpIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const TrendingDownIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>;
const BriefcaseIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const PlusIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const BarChartIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>;
const LockIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const SparklesIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const EyeIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;

// --- UI COMPONENTS ---

const MetricCard: React.FC<{ label: string; value: string; trend?: string; trendUp?: boolean; loading?: boolean }> = ({ label, value, trend, trendUp, loading }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            {trend && (
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ring-1 ring-inset ${trendUp ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'}`}>
                    {trendUp ? <TrendingUpIcon className="w-3 h-3" /> : <TrendingDownIcon className="w-3 h-3" />}
                    {trend}
                </span>
            )}
        </div>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
            {loading ? <span className="animate-pulse bg-slate-100 rounded h-8 w-24 block"></span> : value}
        </h3>
    </div>
);

const DocRow: React.FC<{ doc: InvestorDoc }> = ({ doc }) => (
    <div className="group flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                <DocumentIcon />
            </div>
            <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-brand-blue transition-colors">{doc.title}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="capitalize font-medium bg-slate-100 px-1.5 py-0.5 rounded">{doc.type.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>Updated {doc.lastUpdated}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ring-1 ring-inset ${doc.status === 'final' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'}`}>
                {doc.status}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button className="p-2 text-slate-400 hover:text-brand-blue hover:bg-slate-200 rounded-full transition-colors" title="View">
                    <EyeIcon />
                </button>
            </div>
        </div>
    </div>
);

const SectionHeader: React.FC<{ title: string, action?: React.ReactNode, icon?: React.ReactNode }> = ({ title, action, icon }) => (
    <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            {icon && <span className="text-brand-orange">{icon}</span>}
            {title}
        </h3>
        {action}
    </div>
);

const ProgressRing: React.FC<{ percentage: number, size?: number, stroke?: number, color?: string }> = ({ percentage, size = 60, stroke = 4, color = "text-brand-orange" }) => {
    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    className="text-slate-200"
                    strokeWidth={stroke}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={`${color} transition-all duration-1000 ease-out`}
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <span className="absolute text-xs font-bold text-slate-700">{percentage}%</span>
        </div>
    );
};

// --- MAIN COMPONENT ---

const InvestorDashboard: React.FC = () => {
    // Data State
    const [marketData, setMarketData] = useState<MarketSizeAnalysis | null>(null);
    const [isCalculatingMarket, setIsCalculatingMarket] = useState(false);
    const [latestMetrics, setLatestMetrics] = useState<MetricEntry | null>(null);
    const [previousMetrics, setPreviousMetrics] = useState<MetricEntry | null>(null);
    const [allMetrics, setAllMetrics] = useState<MetricEntry[]>([]);
    const [metricsLoading, setMetricsLoading] = useState(true);
    const [forecastData, setForecastData] = useState<FinancialData | null>(null);
    const [isForecasting, setIsForecasting] = useState(false);
    const [docs, setDocs] = useState<InvestorDoc[]>([]);
    const [docsLoading, setDocsLoading] = useState(true);
    const [showMetricsManager, setShowMetricsManager] = useState(false);

    // Mock Values for Demo
    const [tam, setTam] = useState("$45B");
    const [sam, setSam] = useState("$12B");
    const [som, setSom] = useState("$150M");

    useEffect(() => {
        const loadData = async () => {
            setMetricsLoading(true);
            setDocsLoading(true);
            try {
                // Metrics
                const history = await getMetrics();
                setAllMetrics(history);
                const metricData = await getLatestMetrics(2);
                if (metricData.length > 0) setLatestMetrics(metricData[0]);
                if (metricData.length > 1) setPreviousMetrics(metricData[1]);
                // Docs
                const docData = await getInvestorDocs();
                setDocs(docData);
            } catch (error) {
                console.error(error);
            } finally {
                setMetricsLoading(false);
                setDocsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleRecalculateMarket = async () => {
        setIsCalculatingMarket(true);
        try {
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

    const handleGenerateForecast = async () => {
        setIsForecasting(true);
        try {
            const history = await getMetrics();
            const result = await generateFinancialForecast(history);
            setForecastData(result);
        } catch (error) {
            console.error("Failed to generate forecast", error);
        } finally {
            setIsForecasting(false);
        }
    };

    // Calculated Values
    const runwayMonths = latestMetrics && latestMetrics.burn_rate > 0 
        ? Math.floor(latestMetrics.cash_balance / latestMetrics.burn_rate) 
        : 0;
    
    const mrrGrowth = latestMetrics && previousMetrics && previousMetrics.revenue > 0
        ? ((latestMetrics.revenue - previousMetrics.revenue) / previousMetrics.revenue * 100).toFixed(1)
        : "0";

    return (
        <div className="min-h-screen bg-[#FBF8F5] pb-20 font-display">
            {/* 1. Sticky Header */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <BriefcaseIcon className="text-brand-orange" /> 
                            Startup Command Center
                        </h1>
                        <p className="text-sm text-slate-500 hidden md:block">Manage fundraising, track metrics, and generate investor updates.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Fundraising Active</span>
                        </div>
                        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 border rounded-full ${runwayMonths < 6 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                            <span className="text-xs font-bold uppercase">Runway:</span>
                            <span className="text-xs font-mono font-bold">{runwayMonths > 0 ? `${runwayMonths} Mo` : 'N/A'}</span>
                        </div>
                        <Link to="/dashboard/investor-docs/new" className="bg-brand-blue text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all shadow-sm flex items-center gap-2">
                            <PlusIcon className="w-4 h-4" /> New Doc
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                
                {/* 2. KPI Metric Bar */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard 
                        label="Monthly Recurring Revenue" 
                        value={latestMetrics ? `$${latestMetrics.revenue.toLocaleString()}` : '$0'} 
                        trend={previousMetrics ? `${mrrGrowth}%` : undefined} 
                        trendUp={parseFloat(mrrGrowth) >= 0} 
                        loading={metricsLoading} 
                    />
                    <MetricCard 
                        label="Net Monthly Burn" 
                        value={latestMetrics ? `$${latestMetrics.burn_rate.toLocaleString()}` : '$0'} 
                        trend={latestMetrics && previousMetrics ? `${Math.abs(((latestMetrics.burn_rate - previousMetrics.burn_rate)/previousMetrics.burn_rate)*100).toFixed(1)}%` : undefined} 
                        trendUp={latestMetrics && previousMetrics ? latestMetrics.burn_rate < previousMetrics.burn_rate : true} // Burn going down is good
                        loading={metricsLoading} 
                    />
                    <MetricCard 
                        label="Cash on Hand" 
                        value={latestMetrics ? `$${latestMetrics.cash_balance.toLocaleString()}` : '$0'} 
                        loading={metricsLoading}
                    />
                    <MetricCard 
                        label="Soft Commitments" 
                        value="$1.2M" 
                        trend="80% of Goal" 
                        trendUp={true} 
                    />
                </section>

                {/* Metrics Manager Toggle */}
                <div className="flex justify-end">
                     <button 
                        onClick={() => setShowMetricsManager(!showMetricsManager)}
                        className="text-sm font-semibold text-brand-orange hover:text-brand-blue transition-colors flex items-center gap-2"
                     >
                        <BarChartIcon className="w-4 h-4" />
                        {showMetricsManager ? 'Hide Metrics Manager' : 'Manage Historical Metrics'}
                     </button>
                </div>

                {showMetricsManager && (
                    <div className="animate-fade-in-up bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                         <MetricsTable />
                    </div>
                )}

                {/* 3. Two-Column Flexible Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN - Operational Tools */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* A. Investor Documents */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-slate-800">Investor Documents</h3>
                                <button className="text-xs font-bold text-slate-500 uppercase tracking-wide hover:text-brand-blue transition-colors">View All</button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {docsLoading ? (
                                    <div className="p-8 space-y-4">
                                        <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
                                        <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
                                    </div>
                                ) : docs.length > 0 ? (
                                    docs.map(doc => <DocRow key={doc.id} doc={doc} />)
                                ) : (
                                    <div className="p-12 text-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                                            <DocumentIcon />
                                        </div>
                                        <p className="text-slate-500 text-sm mb-4">No documents yet.</p>
                                        <Link to="/dashboard/investor-docs/new" className="text-brand-orange font-bold text-sm hover:underline">Create your first doc</Link>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* B. 3-Year Projection Agent */}
                        <section className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl border border-indigo-800 shadow-lg overflow-hidden text-white relative">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            
                            <div className="p-6 border-b border-white/10 flex justify-between items-center relative z-10">
                                <div>
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <SparklesIcon className="text-indigo-400" />
                                        Financial Forecasting Agent
                                    </h3>
                                    <p className="text-indigo-200 text-sm mt-1">AI-powered 3-year projections based on your live metrics.</p>
                                </div>
                                <button 
                                    onClick={handleGenerateForecast}
                                    disabled={isForecasting}
                                    className="bg-white text-indigo-900 font-bold py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors text-sm disabled:opacity-70 shadow-md"
                                >
                                    {isForecasting ? 'Crunching Numbers...' : 'Generate Forecast'}
                                </button>
                            </div>

                            <div className="p-6 bg-black/20 min-h-[200px] relative z-10">
                                {forecastData ? (
                                    <div className="animate-fade-in-up">
                                        <div className="mb-4 p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-lg">
                                            <p className="text-sm text-indigo-100 italic leading-relaxed">"{forecastData.summary}"</p>
                                        </div>
                                        <div className="overflow-x-auto rounded-lg border border-white/10">
                                            <Table tableData={{
                                                type: 'financials',
                                                financials: {
                                                    headers: forecastData.headers,
                                                    rows: forecastData.rows
                                                }
                                            }} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-indigo-300/60 py-8">
                                        <BarChartIcon className="w-12 h-12 mb-3 opacity-50" />
                                        <p className="text-sm">No forecast generated yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN - Insights & Readiness */}
                    <div className="space-y-8">
                        
                        {/* A. Market Sizing Module */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="p-6 border-b border-slate-100">
                                <SectionHeader title="Market Sizing" icon={<SearchIcon />} />
                                <p className="text-sm text-slate-500 -mt-4">AI-researched TAM/SAM/SOM estimates.</p>
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TAM</span>
                                        <span className="font-bold text-xl text-slate-900">{tam}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SAM</span>
                                        <span className="font-bold text-xl text-slate-900">{sam}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100 relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                                        <span className="text-xs font-bold text-green-700 uppercase tracking-wider">SOM (Target)</span>
                                        <span className="font-bold text-xl text-green-800">{som}</span>
                                    </div>
                                </div>
                                
                                {marketData && (
                                    <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100">
                                        <span className="font-bold text-slate-700">Source:</span> {marketData.tam.description}
                                    </div>
                                )}

                                <button 
                                    onClick={handleRecalculateMarket}
                                    disabled={isCalculatingMarket}
                                    className="w-full py-2 text-sm font-semibold text-brand-blue bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 mt-auto"
                                >
                                    {isCalculatingMarket ? 'Researching...' : 'Recalculate Market Size'}
                                </button>
                            </div>
                        </section>

                        {/* B. Data Room Readiness */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <SectionHeader title="Readiness Score" icon={<LockIcon />} />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-6 mb-6">
                                    <ProgressRing percentage={65} size={80} stroke={8} />
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Needs Work</h4>
                                        <p className="text-xs text-slate-500">Missing critical docs for Series A.</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold mt-0.5">!</div>
                                        IP Assignment Agreements
                                    </div>
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold mt-0.5">!</div>
                                        Cap Table (Current)
                                    </div>
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold mt-0.5">?</div>
                                        3-Year Financial Model
                                    </div>
                                </div>
                                <Link to="/dashboard/data-room" className="block w-full py-2.5 bg-brand-orange text-white text-center text-sm font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-sm shadow-orange-200">
                                    Go to Data Room
                                </Link>
                            </div>
                        </section>

                        {/* Investor Chat */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                             <InvestorChat metrics={allMetrics} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorDashboard;
