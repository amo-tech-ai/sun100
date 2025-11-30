
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import { generateMarketSizing, generateFinancialForecast } from '../services/ai/investor';
import { MarketSizeAnalysis, FinancialData, InvestorDoc } from '../services/ai/types';
import { getLatestMetrics, getMetrics, MetricEntry } from '../services/metricsService';
import { getInvestorDocs } from '../services/investorDocService';
import { MetricsTable } from '../components/investor/MetricsTable';
import Table from '../components/Table';

const DocumentIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;
const TrendingUpIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const BriefcaseIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const PlusIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const BarChartIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>;

const MetricCard: React.FC<{ label: string; value: string; trend?: string; trendUp?: boolean; loading?: boolean }> = ({ label, value, trend, trendUp, loading }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <div className="flex items-end justify-between mt-2">
            <h3 className="text-2xl font-bold text-slate-800">
                {loading ? <span className="animate-pulse bg-gray-200 rounded h-8 w-24 block"></span> : value}
            </h3>
            {!loading && trend && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trend}
                </span>
            )}
        </div>
    </div>
);

const DocRow: React.FC<{ doc: InvestorDoc }> = ({ doc }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <DocumentIcon />
            </div>
            <div>
                <h4 className="font-semibold text-slate-800">{doc.title}</h4>
                <p className="text-xs text-gray-500 capitalize">{doc.type.replace('_', ' ')} • {doc.lastUpdated}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${doc.status === 'final' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {doc.status}
            </span>
            {/* In a real app, this would open an edit view */}
            <button className="text-sm font-medium text-gray-400 hover:text-brand-orange transition-colors">View</button>
        </div>
    </div>
);

const InvestorDashboard: React.FC = () => {
    const [marketData, setMarketData] = useState<MarketSizeAnalysis | null>(null);
    const [isCalculatingMarket, setIsCalculatingMarket] = useState(false);
    
    const [latestMetrics, setLatestMetrics] = useState<MetricEntry | null>(null);
    const [previousMetrics, setPreviousMetrics] = useState<MetricEntry | null>(null);
    const [metricsLoading, setMetricsLoading] = useState(true);
    
    const [showMetricsManager, setShowMetricsManager] = useState(false);

    // Financial Forecasting State
    const [forecastData, setForecastData] = useState<FinancialData | null>(null);
    const [isForecasting, setIsForecasting] = useState(false);
    
    // Docs
    const [docs, setDocs] = useState<InvestorDoc[]>([]);
    const [docsLoading, setDocsLoading] = useState(true);

    // Initial mock data state
    const [tam, setTam] = useState("$45B");
    const [sam, setSam] = useState("$12B");
    const [som, setSom] = useState("$150M");

    useEffect(() => {
        const loadData = async () => {
            setMetricsLoading(true);
            setDocsLoading(true);
            try {
                // Metrics
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
            const history = await getMetrics(); // Fetch all history
            const result = await generateFinancialForecast(history);
            setForecastData(result);
        } catch (error) {
            console.error("Failed to generate forecast", error);
        } finally {
            setIsForecasting(false);
        }
    };

    // Derived Metrics
    const runwayMonths = latestMetrics && latestMetrics.burn_rate > 0 
        ? Math.floor(latestMetrics.cash_balance / latestMetrics.burn_rate) 
        : 0;
    
    const mrrGrowth = latestMetrics && previousMetrics && previousMetrics.revenue > 0
        ? ((latestMetrics.revenue - previousMetrics.revenue) / previousMetrics.revenue * 100).toFixed(1)
        : "0";

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
                    <span className={`text-sm font-medium ${runwayMonths < 6 ? 'text-red-500' : 'text-gray-500'}`}>
                        Seed Round • {runwayMonths > 0 ? `${runwayMonths} Months Runway` : 'Calculating Runway...'}
                    </span>
                </div>
            </header>

            {/* KPI Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                    label="MRR" 
                    value={latestMetrics ? `$${latestMetrics.revenue.toLocaleString()}` : '$0'} 
                    trend={previousMetrics ? `${mrrGrowth}% MoM` : undefined} 
                    trendUp={parseFloat(mrrGrowth) >= 0} 
                    loading={metricsLoading} 
                />
                <MetricCard 
                    label="Net Burn" 
                    value={latestMetrics ? `$${latestMetrics.burn_rate.toLocaleString()}` : '$0'} 
                    trend={latestMetrics && previousMetrics ? `${latestMetrics.burn_rate < previousMetrics.burn_rate ? '-' : '+'}${Math.abs(((latestMetrics.burn_rate - previousMetrics.burn_rate)/previousMetrics.burn_rate)*100).toFixed(1)}%` : undefined} 
                    trendUp={latestMetrics && previousMetrics ? latestMetrics.burn_rate < previousMetrics.burn_rate : true} 
                    loading={metricsLoading} 
                />
                <MetricCard 
                    label="Cash on Hand" 
                    value={latestMetrics ? `$${latestMetrics.cash_balance.toLocaleString()}` : '$0'} 
                    loading={metricsLoading}
                />
                <MetricCard label="Commitments" value="$1.2M" trend="80% of Goal" trendUp={true} />
            </section>

            {/* Metrics Manager Toggle */}
            <div className="flex justify-end">
                 <button 
                    onClick={() => setShowMetricsManager(!showMetricsManager)}
                    className="text-sm font-semibold text-brand-orange hover:underline flex items-center gap-2"
                 >
                    {showMetricsManager ? 'Hide Metrics Table' : 'Manage Monthly Metrics'}
                 </button>
            </div>

            {showMetricsManager && (
                <div className="animate-fade-in-up">
                     <MetricsTable />
                </div>
            )}

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Documents List & Forecasting */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Document List */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-lg text-brand-blue">Investor Documents</h3>
                            <Link to="/dashboard/investor-docs/new" className="bg-brand-blue text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2">
                                <PlusIcon /> New Doc
                            </Link>
                        </div>
                        <div>
                            {docsLoading ? (
                                <div className="p-8 text-center text-gray-400">Loading docs...</div>
                            ) : docs.length > 0 ? (
                                docs.map(doc => <DocRow key={doc.id} doc={doc} />)
                            ) : (
                                <div className="p-8 text-center text-gray-400">No documents yet. Create one to get started.</div>
                            )}
                        </div>
                    </div>

                    {/* Financial Projections AI Widget */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
                            <div>
                                <h3 className="font-bold text-lg text-brand-blue flex items-center gap-2">
                                    <BarChartIcon className="text-purple-600" />
                                    3-Year Projection Agent
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Based on your historical metrics table.</p>
                            </div>
                            <button 
                                onClick={handleGenerateForecast}
                                disabled={isForecasting}
                                className="bg-purple-50 text-purple-700 border border-purple-200 text-sm font-bold py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isForecasting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Forecasting...
                                    </>
                                ) : 'Generate Forecast'}
                            </button>
                        </div>
                        
                        {forecastData ? (
                             <div className="p-0 animate-fade-in-up">
                                <div className="p-4 bg-purple-50/30 border-b border-purple-100">
                                    <p className="text-sm text-gray-700 italic">"{forecastData.summary}"</p>
                                </div>
                                <div className="h-64">
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
                            !isForecasting && (
                                <div className="p-8 text-center text-gray-400 border-t border-gray-100 border-dashed">
                                    Click "Generate Forecast" to calculate a 3-year financial model using your real data.
                                </div>
                            )
                        )}
                        
                        {isForecasting && (
                             <div className="p-12 text-center">
                                <div className="w-12 h-12 mx-auto mb-4 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
                                <p className="text-gray-800 font-semibold">Gemini 3 is crunching the numbers...</p>
                                <p className="text-gray-500 text-sm mt-2">Analyzing revenue growth, burn rate, and margins.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Market Sizing & Actions */}
                <div className="space-y-6">
                    {/* Market Sizing Widget */}
                    <div className="bg-indigo-900 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden transition-all duration-500">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        Market Sizing
                                        {isCalculatingMarket && <span className="text-xs bg-indigo-700 px-2 py-1 rounded animate-pulse">Thinking...</span>}
                                    </h3>
                                    <p className="text-indigo-200 text-sm mt-1">Powered by Google Search Grounding</p>
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
                                <div className="mt-6 p-4 bg-indigo-800/50 rounded-lg text-sm text-indigo-100 animate-fade-in-up">
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
                        <Link to="/dashboard/data-room" className="w-full mt-6 py-2 bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-sm block text-center">
                            Go to Data Room
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorDashboard;
