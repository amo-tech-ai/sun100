
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
}> = ({ title, subtitle, value, icon, trend, trendUp, neutral }) => (
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
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">{value}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
            <p className="text-xs text-slate-400 mt-1.5">{subtitle}</p>
        </div>
    </div>
);

const RevenueChart = () => {
    // Mock data points for curved lines
    const revenuePoints = "0,150 50,145 100,140 150,135 200,120 250,90 300,80 350,60 400,50 450,40 500,30";
    const expensePoints = "0,160 50,158 100,155 150,152 200,148 250,140 300,135 350,125 400,120 450,115 500,110";
    
    return (
        <div className="relative h-64 w-full mt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />

                {/* Revenue Line (Blue) */}
                <path d={`M${revenuePoints}`} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
                {/* Gradient Fill for Revenue */}
                <path d={`M${revenuePoints} L500,200 L0,200 Z`} fill="url(#revenueGradient)" opacity="0.1" />

                {/* Expense Line (Red) */}
                <path d={`M${expensePoints}`} fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                
                <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            
            {/* X Axis Labels */}
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                    <span className="text-sm font-medium text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="text-sm font-medium text-gray-600">Expenses</span>
                </div>
            </div>
        </div>
    );
};

const BurnAnalysisChart = () => {
    const data = [12000, 15000, 11000, 18000, 10500]; // Last 5 months
    const max = Math.max(...data);

    return (
        <div className="flex items-end justify-between h-32 gap-3 mt-4">
            {data.map((val, i) => (
                <div key={i} className="w-full flex flex-col items-center group">
                    <div className="text-[10px] font-bold text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">${val/1000}k</div>
                    <div 
                        className={`w-full rounded-t-md transition-all duration-500 ${i === 4 ? 'bg-brand-orange' : 'bg-gray-200'}`} 
                        style={{ height: `${(val / max) * 100}%` }}
                    ></div>
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
                    <span className="mt-0.5 text-gray-400">•</span> {a}
                </li>
            ))}
        </ul>
    </div>
);

const FinancialOverview: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'3M' | '6M' | '12M'>('6M');

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
                        value="$72,000" 
                        icon={<TrendingUpIcon />}
                        trend="18%"
                        trendUp={true}
                    />
                    <KPICard 
                        title="Monthly Spend" 
                        subtitle="Total expenses this month" 
                        value="$51,000" 
                        icon={<WalletIcon />}
                        trend="4%"
                        trendUp={false} // Spend up is usually bad, but red might be alarming. Let's use red to alert.
                    />
                     <KPICard 
                        title="Cash on Hand" 
                        subtitle="Available in bank" 
                        value="$340,000" 
                        icon={<DollarSignIcon />}
                        trend="Stable"
                        neutral
                    />
                     <KPICard 
                        title="Burn Rate" 
                        subtitle="Net cash burn / month" 
                        value="$10,500" 
                        icon={<FlameIcon />}
                        trend="-12%"
                        trendUp={true} // Burn going down is good (green)
                    />
                     <KPICard 
                        title="Runway" 
                        subtitle="Months left at current burn" 
                        value="14.2 Mo" 
                        icon={<ClockIcon />}
                        trend="+2 Mo"
                        trendUp={true}
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
                                    <h3 className="text-lg font-bold text-brand-blue">Revenue vs Expenses</h3>
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
                            <RevenueChart />
                        </div>

                        {/* Row: Burn & Spend */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Burn Analysis */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-sm font-bold text-brand-blue mb-1">Net Burn Analysis</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-extrabold text-slate-900">$10,500</span>
                                        <span className="text-xs text-gray-500">avg / month</span>
                                    </div>
                                </div>
                                <BurnAnalysisChart />
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Burn Multiple</span>
                                    <span className="text-sm font-bold text-slate-900">1.2x</span>
                                </div>
                            </div>

                            {/* Spend Breakdown */}
                             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-bold text-brand-blue mb-4">Spend Breakdown</h3>
                                <div className="space-y-4">
                                    {[
                                        { cat: 'Payroll', val: 28000, pct: 55, color: 'bg-indigo-600' },
                                        { cat: 'Marketing', val: 12000, pct: 24, color: 'bg-indigo-400' },
                                        { cat: 'Tools', val: 5000, pct: 10, color: 'bg-brand-orange' },
                                        { cat: 'Ops', val: 6000, pct: 11, color: 'bg-blue-200' },
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
                                    months="10.5" 
                                    assumptions={["Rev flat", "Exp +10%"]}
                                    color="border-red-100"
                                />
                                <ScenarioCard 
                                    type="Realistic" 
                                    months="14.2" 
                                    assumptions={["Rev +5%", "Exp stable"]}
                                    color="border-blue-100"
                                />
                                <ScenarioCard 
                                    type="Optimistic" 
                                    months="18.5" 
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
                                {[
                                    "Your burn rate decreased 11% from last month due to lower software costs.",
                                    "Upcoming payroll cycle will reduce runway to approx 13.8 months.",
                                    "Marketing ROI is currently 3.2x, higher than industry avg of 2.8x."
                                ].map((insight, i) => (
                                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2.5 bg-indigo-50/30 p-2.5 rounded-lg">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                                        <span className="leading-relaxed">{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Expense Shifts */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide">Top Expense Shifts</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-white rounded text-red-500 shadow-sm"><TrendingUpIcon className="w-3 h-3" /></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Marketing Ads</p>
                                            <p className="text-[10px] text-gray-500">+$2,400 vs last mo</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-red-600">+15%</span>
                                </div>
                                 <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-white rounded text-green-500 shadow-sm"><TrendingDownIcon className="w-3 h-3" /></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Server Costs</p>
                                            <p className="text-[10px] text-gray-500">-$850 vs last mo</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-green-600">-8%</span>
                                </div>
                            </div>
                        </div>

                        {/* Alerts */}
                        <div>
                            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-3">Alerts</h3>
                            <div className="space-y-2">
                                <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-800">
                                    <AlertCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>Runway nearing 12 month threshold</span>
                                </div>
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
                                Review unused SaaS licenses. Detected 4 seats in Linear that have been inactive for {'>'}30 days.
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
