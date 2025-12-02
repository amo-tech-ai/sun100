
import React, { useState, useEffect, useMemo } from 'react';
import { getMetrics, MetricEntry } from '../services/metricsService';

// Icons
const TrendingUpIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const TrendingDownIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>;
const WalletIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>;
const FlameIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3.3 1.8 1.5 2.8 3 3.3z"/></svg>;
const DollarSignIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const ClockIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const PlusIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const DownloadIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const ShareIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>;
const SparklesIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const AlertCircleIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const InfoIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
const CreditCardIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;

// --- COMPONENTS ---

const KPICard: React.FC<{
    title: string;
    subtitle: string;
    value: string;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    neutral?: boolean;
    loading?: boolean;
}> = ({ title, subtitle, value, icon, trend, trendUp, neutral, loading }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.12)] transition-all duration-300 flex flex-col justify-between h-full group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 rounded-xl text-slate-500 group-hover:text-brand-blue group-hover:bg-blue-50 transition-colors">
                {icon}
            </div>
            {trend && (
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${neutral ? 'bg-slate-100 text-slate-500' : trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {neutral ? null : trendUp ? <TrendingUpIcon className="w-3.5 h-3.5" /> : <TrendingDownIcon className="w-3.5 h-3.5" />}
                    {trend}
                </div>
            )}
        </div>
        <div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                {loading ? <span className="animate-pulse bg-slate-100 h-8 w-24 rounded block"></span> : value}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
            <p className="text-xs text-slate-400 mt-1.5">{subtitle}</p>
        </div>
    </div>
);

const DynamicRevenueChart: React.FC<{ data: MetricEntry[] }> = ({ data }) => {
    // Sort chronological
    const sortedData = [...data].sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
    
    const height = 200;
    const width = 500;
    const padding = 20;
    
    if (sortedData.length === 0) return <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>;

    const maxRevenue = Math.max(...sortedData.map(d => d.revenue), 1);
    const maxExpense = Math.max(...sortedData.map(d => d.burn_rate), 1); // Approximating expense as burn rate for now
    const maxVal = Math.max(maxRevenue, maxExpense) * 1.2;

    const getPoints = (type: 'revenue' | 'burn_rate') => {
        return sortedData.map((d, i) => {
            const x = (i / (sortedData.length - 1 || 1)) * width;
            const y = height - ((d[type] / maxVal) * height);
            return `${x},${y}`;
        }).join(' ');
    };

    const revenuePoints = getPoints('revenue');
    const expensePoints = getPoints('burn_rate');

    return (
        <div className="relative h-64 w-full mt-4">
             <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                 {/* Grid Lines */}
                <line x1="0" y1={height*0.25} x2={width} y2={height*0.25} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1={height*0.5} x2={width} y2={height*0.5} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1={height*0.75} x2={width} y2={height*0.75} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />

                 {/* Revenue Line (Blue) */}
                <polyline points={revenuePoints} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                 {/* Gradient Fill for Revenue */}
                <polygon points={`0,${height} ${revenuePoints} ${width},${height}`} fill="url(#revenueGradient)" opacity="0.1" />

                {/* Expense Line (Red) */}
                <polyline points={expensePoints} fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                {sortedData.map(d => (
                    <span key={d.id}>{new Date(d.month).toLocaleDateString(undefined, { month: 'short' })}</span>
                ))}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                    <span className="text-sm font-medium text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="text-sm font-medium text-gray-600">Burn Rate (Proxy)</span>
                </div>
            </div>
        </div>
    );
}

const DynamicBurnChart: React.FC<{ data: MetricEntry[] }> = ({ data }) => {
    const sortedData = [...data].sort((a, b) => a.month.localeCompare(b.month)).slice(-5);
    const max = Math.max(...sortedData.map(d => d.burn_rate), 1);

    if (sortedData.length === 0) return <div className="h-32 flex items-center justify-center text-xs text-gray-400">No data</div>;

    return (
        <div className="flex items-end justify-between h-32 gap-3 mt-4">
            {sortedData.map((d, i) => (
                <div key={d.id} className="w-full flex flex-col items-center group">
                    <div className="text-[10px] font-bold text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        ${(d.burn_rate/1000).toFixed(1)}k
                    </div>
                    <div 
                        className={`w-full rounded-t-md transition-all duration-500 ${i === sortedData.length - 1 ? 'bg-brand-orange' : 'bg-gray-200'}`} 
                        style={{ height: `${(d.burn_rate / max) * 100}%`, minHeight: '4px' }}
                    ></div>
                    <div className="text-[9px] text-gray-400 mt-1">{new Date(d.month).toLocaleDateString(undefined, {month:'short'})}</div>
                </div>
            ))}
        </div>
    );
};

const ScenarioCard = ({ type, months, assumptions, color }: { type: string, months: string, assumptions: string[], color: string }) => (
    <div className={`p-5 rounded-2xl border ${color} bg-white flex-1 min-w-[200px] shadow-sm`}>
        <div className="flex justify-between items-center mb-3">
            <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${color.replace('border', 'bg').replace('200', '100')} text-gray-800`}>
                {type}
            </span>
            {type === 'Optimistic' && <TrendingUpIcon className="w-4 h-4 text-green-500" />}
        </div>
        <p className="text-3xl font-extrabold text-gray-900 mb-1">{months} <span className="text-sm font-medium text-gray-500">months</span></p>
        <div className="border-t border-gray-100 my-3"></div>
        <ul className="space-y-1.5">
            {assumptions.map((a, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="mt-0.5 text-gray-300">•</span> {a}
                </li>
            ))}
        </ul>
    </div>
);

const FinancialOverview: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'3M' | '6M' | '12M'>('6M');
    const [metrics, setMetrics] = useState<MetricEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getMetrics();
                setMetrics(data);
            } catch (e) {
                console.error("Failed to load metrics", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const latest = metrics.length > 0 ? metrics[0] : null;
    const previous = metrics.length > 1 ? metrics[1] : null;

    const runwayMonths = latest && latest.burn_rate > 0 
        ? (latest.cash_balance / latest.burn_rate).toFixed(1) 
        : "Unknown";
    
    const revGrowth = latest && previous && previous.revenue > 0 
        ? ((latest.revenue - previous.revenue) / previous.revenue * 100).toFixed(1) + "%"
        : "0%";
        
    const burnDelta = latest && previous 
        ? ((latest.burn_rate - previous.burn_rate) / previous.burn_rate * 100).toFixed(1) + "%"
        : "0%";
    
    const isRevUp = parseFloat(revGrowth) >= 0;
    const isBurnDown = parseFloat(burnDelta) <= 0;

    // Simple Scenario Logic
    const currentCash = latest?.cash_balance || 0;
    const currentBurn = latest?.burn_rate || 10000;
    const realisticRunway = currentBurn > 0 ? (currentCash / currentBurn).toFixed(1) : "∞";
    const conservativeRunway = currentBurn > 0 ? (currentCash / (currentBurn * 1.1)).toFixed(1) : "∞";
    const optimisticRunway = currentBurn > 0 ? (currentCash / (currentBurn * 0.9)).toFixed(1) : "∞";

    return (
        <div className="min-h-screen bg-[#FAFAF8] font-display pb-20">
            
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-brand-blue">Financial Overview</h1>
                            <p className="text-gray-500 text-sm mt-1">Track revenue, spending, runway, and overall financial health.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <ShareIcon /> Share
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <DownloadIcon /> Export
                            </button>
                            <button className="px-4 py-2 bg-brand-blue text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-sm">
                                <PlusIcon /> Add Entry
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* KPI Row */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <KPICard 
                        title="Monthly Revenue" 
                        subtitle="Subscriptions + transactional" 
                        value={latest ? `$${latest.revenue.toLocaleString()}` : '$0'} 
                        icon={<TrendingUpIcon />}
                        trend={revGrowth}
                        trendUp={isRevUp}
                        loading={loading}
                    />
                    <KPICard 
                        title="Monthly Spend" 
                        subtitle="Total expenses this month" 
                        value={latest ? `$${latest.burn_rate.toLocaleString()}` : '$0'} 
                        icon={<WalletIcon />}
                        trend={burnDelta}
                        trendUp={isBurnDown} // Green if spend goes down
                        loading={loading}
                    />
                     <KPICard 
                        title="Cash on Hand" 
                        subtitle="Available in bank" 
                        value={latest ? `$${latest.cash_balance.toLocaleString()}` : '$0'} 
                        icon={<DollarSignIcon />}
                        trend="Stable"
                        neutral
                        loading={loading}
                    />
                     <KPICard 
                        title="Burn Rate" 
                        subtitle="Net cash burn / month" 
                        value={latest ? `$${latest.burn_rate.toLocaleString()}` : '$0'} 
                        icon={<FlameIcon />}
                        trend={burnDelta}
                        trendUp={isBurnDown} 
                        loading={loading}
                    />
                     <KPICard 
                        title="Runway" 
                        subtitle="Months left at current burn" 
                        value={`${runwayMonths} Mo`}
                        icon={<ClockIcon />}
                        trend="Estimated"
                        neutral
                        loading={loading}
                    />
                </section>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Revenue vs Expenses */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-brand-blue">Revenue vs Burn</h3>
                                    <p className="text-sm text-gray-500 mt-1">Comparing income streams against operational costs.</p>
                                </div>
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    {['3M', '6M', '12M'].map(range => (
                                        <button 
                                            key={range} 
                                            onClick={() => setTimeRange(range as any)}
                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeRange === range ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <DynamicRevenueChart data={metrics} />
                        </div>

                        {/* Row: Burn & Spend */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Burn Analysis */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-sm font-bold text-brand-blue mb-1">Net Burn Analysis</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-extrabold text-slate-900">{latest ? `$${latest.burn_rate.toLocaleString()}` : '$0'}</span>
                                        <span className="text-xs text-gray-500">avg / month</span>
                                    </div>
                                </div>
                                <DynamicBurnChart data={metrics} />
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Burn Multiple</span>
                                    <span className="text-sm font-bold text-slate-900">1.2x</span>
                                </div>
                            </div>

                            {/* Spend Breakdown - Static for now as we don't have expense categories in metric entry */}
                             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-bold text-brand-blue mb-4">Spend Breakdown (Est)</h3>
                                <div className="space-y-4">
                                    {[
                                        { cat: 'Payroll', val: (latest?.burn_rate || 0) * 0.6, pct: 60, color: 'bg-indigo-600' },
                                        { cat: 'Marketing', val: (latest?.burn_rate || 0) * 0.2, pct: 20, color: 'bg-indigo-400' },
                                        { cat: 'Tools/Ops', val: (latest?.burn_rate || 0) * 0.2, pct: 20, color: 'bg-brand-orange' },
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs font-medium mb-1">
                                                <span className="text-gray-600">{item.cat}</span>
                                                <div className="flex gap-3">
                                                    <span className="text-gray-400">${item.val.toLocaleString()}</span>
                                                    <span className="font-bold text-gray-900">{item.pct}%</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-6 text-xs font-bold text-gray-500 hover:text-brand-orange transition-colors">
                                    View All Transactions
                                </button>
                            </div>
                        </div>

                        {/* Runway Scenarios */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-brand-blue">Runway Scenarios</h3>
                                <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-500">Based on current cash</span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-2">
                                <ScenarioCard 
                                    type="Conservative" 
                                    months={conservativeRunway} 
                                    assumptions={["Rev flat", "Exp +10%"]}
                                    color="border-red-100"
                                />
                                <ScenarioCard 
                                    type="Realistic" 
                                    months={realisticRunway} 
                                    assumptions={["Rev +5%", "Exp stable"]}
                                    color="border-blue-100"
                                />
                                <ScenarioCard 
                                    type="Optimistic" 
                                    months={optimisticRunway} 
                                    assumptions={["Rev +15%", "Exp -5%"]}
                                    color="border-green-100"
                                />
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <aside className="space-y-6">
                        
                        {/* AI Insights Panel */}
                        <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <h3 className="font-bold text-brand-blue mb-4 flex items-center gap-2 relative z-10">
                                <SparklesIcon className="text-indigo-500" />
                                AI Financial Insights
                            </h3>
                            <ul className="space-y-3 relative z-10">
                                <li className="text-sm text-gray-600 flex items-start gap-2.5 bg-indigo-50/30 p-2.5 rounded-lg">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                                    <span className="leading-relaxed">
                                        {isBurnDown 
                                        ? `Great job! Burn rate decreased by ${Math.abs(parseFloat(burnDelta))}% compared to last month.` 
                                        : `Attention: Burn rate increased by ${burnDelta}. Review marketing spend.`}
                                    </span>
                                </li>
                                <li className="text-sm text-gray-600 flex items-start gap-2.5 bg-indigo-50/30 p-2.5 rounded-lg">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                                    <span className="leading-relaxed">
                                        Runway is currently {realisticRunway} months. 
                                        {parseFloat(realisticRunway) < 12 ? " Consider fundraising soon." : " You are in a healthy position."}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Alerts */}
                        <div>
                            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-3">Alerts</h3>
                            <div className="space-y-2">
                                {parseFloat(realisticRunway) < 12 && (
                                    <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-800">
                                        <AlertCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>Runway nearing 12 month threshold</span>
                                    </div>
                                )}
                                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                                    <InfoIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>Q3 Tax payment due in 15 days</span>
                                </div>
                            </div>
                        </div>

                         {/* Recommendations */}
                        <div className="bg-gray-50 border border-dashed border-gray-300 p-4 rounded-xl">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                <CreditCardIcon className="w-3 h-3" /> Recommendation
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed mb-2">
                                Review unused SaaS licenses. Detected potential savings of $450/mo.
                            </p>
                            <button className="text-xs text-brand-orange font-bold hover:underline">Review Subscriptions →</button>
                        </div>

                    </aside>
                </div>
            </main>
        </div>
    );
};

export default FinancialOverview;
