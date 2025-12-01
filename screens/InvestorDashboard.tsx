
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateMarketSizing, generateFinancialForecast } from '../services/ai/investor';
import { MarketSizeAnalysis, FinancialData, InvestorDoc, DataRoomAudit } from '../services/ai/types';
import { getLatestMetrics, getMetrics, MetricEntry } from '../services/metricsService';
import { getInvestorDocs } from '../services/investorDocService';
import { getDataRoomAudit } from '../services/dataRoomService';
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
const UsersIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const TargetIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const CalendarIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;

// --- UI COMPONENTS ---

const DashboardCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; action?: React.ReactNode, className?: string }> = ({ title, icon, children, action, className = '' }) => (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide flex items-center gap-2">
                {icon && <span className="text-brand-orange">{icon}</span>}
                {title}
            </h3>
            {action}
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const MetricCard: React.FC<{ label: string; value: string; trend?: string; trendUp?: boolean; loading?: boolean; subValue?: string }> = ({ label, value, trend, trendUp, loading, subValue }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
            {trend && (
                <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-1 ring-inset ${trendUp ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'}`}>
                    {trendUp ? <TrendingUpIcon className="w-3 h-3" /> : <TrendingDownIcon className="w-3 h-3" />}
                    {trend}
                </span>
            )}
        </div>
        <div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {loading ? <span className="animate-pulse bg-slate-100 rounded h-8 w-24 block"></span> : value}
            </h3>
            {subValue && <p className="text-xs text-slate-400 font-medium mt-1">{subValue}</p>}
        </div>
    </div>
);

const DocRow: React.FC<{ doc: InvestorDoc }> = ({ doc }) => (
    <div className="group flex items-center justify-between p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors cursor-pointer rounded-lg">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                <DocumentIcon className="w-4 h-4" />
            </div>
            <div>
                <h4 className="font-semibold text-slate-900 text-sm group-hover:text-brand-blue transition-colors">{doc.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="capitalize font-medium bg-slate-100 px-1.5 py-0.5 rounded">{doc.type.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>Updated {doc.lastUpdated}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ring-1 ring-inset ${doc.status === 'final' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'}`}>
                {doc.status}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-slate-200 rounded-full transition-colors" title="View">
                    <EyeIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

const ProgressRing: React.FC<{ percentage: number, size?: number, stroke?: number, color?: string }> = ({ percentage, size = 60, stroke = 4, color = "text-brand-orange" }) => {
    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle className="text-slate-100" strokeWidth={stroke} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
                <circle className={`${color} transition-all duration-1000 ease-out`} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
            </svg>
            <span className="absolute text-xs font-bold text-slate-700">{percentage}%</span>
        </div>
    );
};

// --- MAIN COMPONENT ---

const StartupCommandCenter: React.FC = () => {
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
    const [dataRoomAudit, setDataRoomAudit] = useState<DataRoomAudit | null>(null);

    // Mock Values
    const [tam, setTam] = useState("$45B");
    const [sam, setSam] = useState("$12B");
    const [som, setSom] = useState("$150M");

    useEffect(() => {
        const loadData = async () => {
            setMetricsLoading(true);
            setDocsLoading(true);
            try {
                const history = await getMetrics();
                setAllMetrics(history);
                const metricData = await getLatestMetrics(2);
                if (metricData.length > 0) setLatestMetrics(metricData[0]);
                if (metricData.length > 1) setPreviousMetrics(metricData[1]);
                
                const docData = await getInvestorDocs();
                setDocs(docData);
                
                const audit = await getDataRoomAudit();
                setDataRoomAudit(audit);
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

    // Calculations
    const runwayMonths = latestMetrics && latestMetrics.burn_rate > 0 
        ? Math.floor(latestMetrics.cash_balance / latestMetrics.burn_rate) 
        : 0;
    
    const mrrGrowth = latestMetrics && previousMetrics && previousMetrics.revenue > 0
        ? ((latestMetrics.revenue - previousMetrics.revenue) / previousMetrics.revenue * 100).toFixed(1)
        : "0";
    
    const userGrowth = latestMetrics && previousMetrics && previousMetrics.active_users > 0
        ? ((latestMetrics.active_users - previousMetrics.active_users) / previousMetrics.active_users * 100).toFixed(1)
        : "0";

    const readinessScore = dataRoomAudit ? dataRoomAudit.score : 0;
    const readinessStatus = dataRoomAudit ? dataRoomAudit.status : "Not Started";
    const missingDocs = dataRoomAudit ? dataRoomAudit.missing_items : ["Audit Not Run"];

    return (
        <div className="min-h-screen bg-[#FBF8F5] pb-20 font-display">
            {/* 1. Header */}
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-blue text-white flex items-center justify-center shadow-md">
                             <BriefcaseIcon className="w-5 h-5" /> 
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-900">Startup Command Center</h1>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Operations Active
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 border rounded-full bg-white shadow-sm ${runwayMonths < 6 ? 'border-red-200 text-red-700' : 'border-slate-200 text-slate-600'}`}>
                            <span className="text-xs font-bold uppercase tracking-wide">Runway:</span>
                            <span className="text-sm font-mono font-bold">{runwayMonths > 0 ? `${runwayMonths} Mo` : 'N/A'}</span>
                        </div>
                        <Link to="/dashboard/investor-docs/new" className="bg-brand-orange text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                            <PlusIcon className="w-4 h-4" /> New Doc
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                
                {/* 2. Financial Health Strip */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard 
                        label="Revenue (MRR)" 
                        value={latestMetrics ? `$${latestMetrics.revenue.toLocaleString()}` : '$0'} 
                        trend={previousMetrics ? `${mrrGrowth}%` : undefined} 
                        trendUp={parseFloat(mrrGrowth) >= 0} 
                        loading={metricsLoading} 
                    />
                    <MetricCard 
                        label="Monthly Spend" 
                        value={latestMetrics ? `$${latestMetrics.burn_rate.toLocaleString()}` : '$0'} 
                        trend={latestMetrics && previousMetrics ? `${Math.abs(((latestMetrics.burn_rate - previousMetrics.burn_rate)/previousMetrics.burn_rate)*100).toFixed(1)}%` : undefined} 
                        trendUp={latestMetrics && previousMetrics ? latestMetrics.burn_rate < previousMetrics.burn_rate : true} 
                        loading={metricsLoading} 
                    />
                    <MetricCard 
                        label="Cash on Hand" 
                        value={latestMetrics ? `$${latestMetrics.cash_balance.toLocaleString()}` : '$0'} 
                        subValue="vs $450k Target"
                        loading={metricsLoading}
                    />
                     <MetricCard 
                        label="Active Users" 
                        value={latestMetrics ? `${latestMetrics.active_users.toLocaleString()}` : '0'} 
                        trend={previousMetrics ? `${userGrowth}%` : undefined} 
                        trendUp={parseFloat(userGrowth) >= 0} 
                        loading={metricsLoading} 
                    />
                </section>

                <div className="flex justify-end">
                     <button 
                        onClick={() => setShowMetricsManager(!showMetricsManager)}
                        className="text-xs font-bold text-brand-orange hover:text-brand-blue transition-colors flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
                     >
                        <BarChartIcon className="w-3 h-3" />
                        {showMetricsManager ? 'Hide Data Editor' : 'Edit Historical Data'}
                     </button>
                </div>

                {showMetricsManager && (
                    <div className="animate-fade-in-up bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                         <MetricsTable />
                    </div>
                )}

                {/* 3. Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN - Operations (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Growth & Roadmap Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Team Snapshot */}
                            <DashboardCard title="Team Snapshot" icon={<UsersIcon />}>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <span className="text-3xl font-extrabold text-slate-900">8</span>
                                        <span className="text-sm text-slate-500 font-medium ml-2">FTEs</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-extrabold text-brand-orange">2</span>
                                        <span className="text-sm text-slate-500 font-medium ml-2">Open Roles</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                        <span>Engineering</span>
                                        <span className="font-bold">5</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                        <span>Product</span>
                                        <span className="font-bold">2</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                        <span>Growth</span>
                                        <span className="font-bold">1</span>
                                    </div>
                                </div>
                            </DashboardCard>

                            {/* Roadmap Milestones */}
                            <DashboardCard title="Product Milestones" icon={<TargetIcon />}>
                                <div className="space-y-4 relative">
                                    {/* Connector Line */}
                                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                                    
                                    {[
                                        { title: "Mobile App Beta", date: "Sep 15", status: "done" },
                                        { title: "Payments Integration", date: "Oct 01", status: "active" },
                                        { title: "Series A Launch", date: "Nov 15", status: "pending" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 relative z-10">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${item.status === 'done' ? 'border-green-500 text-green-500' : item.status === 'active' ? 'border-brand-orange text-brand-orange' : 'border-slate-300 text-slate-300'}`}>
                                                <div className={`w-2 h-2 rounded-full ${item.status === 'done' ? 'bg-green-500' : item.status === 'active' ? 'bg-brand-orange' : 'bg-slate-300'}`}></div>
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${item.status === 'active' ? 'text-slate-900' : 'text-slate-500'}`}>{item.title}</p>
                                                <p className="text-xs text-slate-400 font-mono">{item.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DashboardCard>
                        </div>

                        {/* Documents Workspace */}
                        <DashboardCard title="Documents & Assets" icon={<DocumentIcon />} action={
                            <Link to="/dashboard/investor-docs/new" className="text-xs font-bold text-brand-orange hover:text-brand-blue transition-colors uppercase tracking-wide">Create New</Link>
                        }>
                            <div className="divide-y divide-slate-100 -mx-2">
                                {docsLoading ? (
                                    <div className="p-4 space-y-3">
                                        <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
                                        <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
                                    </div>
                                ) : docs.length > 0 ? (
                                    docs.map(doc => <DocRow key={doc.id} doc={doc} />)
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-sm">
                                        No documents generated yet.
                                    </div>
                                )}
                            </div>
                        </DashboardCard>

                        {/* Financial Forecast */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden text-white">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-bold text-sm flex items-center gap-2">
                                    <SparklesIcon className="text-brand-mustard" />
                                    AI Forecasting Agent
                                </h3>
                                <button 
                                    onClick={handleGenerateForecast}
                                    disabled={isForecasting}
                                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors disabled:opacity-50"
                                >
                                    {isForecasting ? 'Thinking...' : 'Run 3-Year Projection'}
                                </button>
                            </div>
                            <div className="p-6 min-h-[160px] bg-black/20">
                                {forecastData ? (
                                    <div className="animate-fade-in-up">
                                        <p className="text-xs text-slate-300 mb-4 italic">"{forecastData.summary}"</p>
                                        <div className="overflow-x-auto">
                                            <Table tableData={{
                                                type: 'financials',
                                                financials: { headers: forecastData.headers, rows: forecastData.rows }
                                            }} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 py-4">
                                        <BarChartIcon className="w-8 h-8 opacity-50" />
                                        <p className="text-xs">No active forecast.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN - Intelligence (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* Data Room Readiness */}
                        <DashboardCard title="Due Diligence Ready" icon={<LockIcon />}>
                            <div className="flex items-center gap-5 mb-5">
                                <ProgressRing percentage={readinessScore} size={70} stroke={6} />
                                <div>
                                    <h4 className="font-bold text-slate-900">{readinessStatus}</h4>
                                    <p className="text-xs text-slate-500">Based on {dataRoomAudit?.found_categories.length || 0} items.</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-5">
                                {missingDocs.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-red-50 p-2 rounded border border-red-100">
                                        <span className="text-red-500 font-bold">!</span>
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <Link to="/dashboard/data-room" className="block w-full py-2 bg-brand-blue text-white text-center text-xs font-bold rounded-lg hover:bg-opacity-90 transition-all">
                                Open Data Room
                            </Link>
                        </DashboardCard>

                        {/* Market Sizing */}
                        <DashboardCard title="Market Intelligence" icon={<SearchIcon />}>
                             <div className="space-y-3 mb-4">
                                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">TAM</span>
                                    <span className="font-bold text-sm text-slate-900">{tam}</span>
                                </div>
                                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">SAM</span>
                                    <span className="font-bold text-sm text-slate-900">{sam}</span>
                                </div>
                                <div className="flex justify-between items-center p-2.5 bg-green-50 rounded border border-green-100">
                                    <span className="text-[10px] font-bold text-green-700 uppercase">SOM</span>
                                    <span className="font-bold text-sm text-green-800">{som}</span>
                                </div>
                            </div>
                            <button 
                                onClick={handleRecalculateMarket}
                                disabled={isCalculatingMarket}
                                className="w-full py-2 text-xs font-bold text-brand-blue border border-slate-200 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                {isCalculatingMarket ? 'Researching...' : 'Update Market Data'}
                            </button>
                        </DashboardCard>

                        {/* Investor Chat */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[400px]">
                             <InvestorChat metrics={allMetrics} />
                        </div>

                        {/* Quick Actions List */}
                        <DashboardCard title="Quick Actions" icon={<CalendarIcon />}>
                             <div className="space-y-2">
                                <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded transition-colors flex justify-between group">
                                    <span>Generate Weekly Update</span>
                                    <span className="text-brand-orange opacity-0 group-hover:opacity-100">→</span>
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded transition-colors flex justify-between group">
                                    <span>Schedule Team Sync</span>
                                    <span className="text-brand-orange opacity-0 group-hover:opacity-100">→</span>
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded transition-colors flex justify-between group">
                                    <span>Export Metrics CSV</span>
                                    <span className="text-brand-orange opacity-0 group-hover:opacity-100">→</span>
                                </button>
                             </div>
                        </DashboardCard>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupCommandCenter;
