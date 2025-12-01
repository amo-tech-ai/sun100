
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    getCRMData, 
    createCustomer,
    Customer, 
    CRMStats, 
    DealStage, 
    Insight, 
    Task 
} from '../services/crmService';
import { CustomerFormModal } from '../components/crm/CustomerFormModal';
import { CustomerDetailPanel } from '../components/crm/CustomerDetailPanel';

// --- Icons ---
const UsersIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ActivityIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const AlertIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const RefreshIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>;
const PlusIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const FilterIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const SparklesIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const MoreHorizontalIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;

// --- Components ---

const CrmStatCard: React.FC<{ title: string; value: string | number; trend?: string; trendUp?: boolean; icon: React.ReactNode; color?: string }> = ({ title, value, trend, trendUp, icon, color = 'blue' }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
            <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>{icon}</div>
        </div>
        <div>
            <span className="text-2xl font-extrabold text-gray-900">{value}</span>
            {trend && (
                <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{trend}</span>
                </div>
            )}
        </div>
    </div>
);

const HealthBadge: React.FC<{ score: number }> = ({ score }) => {
    let colorClass = 'bg-red-100 text-red-700';
    let width = '30%';
    if (score >= 80) { colorClass = 'bg-green-100 text-green-700'; width = '90%'; }
    else if (score >= 50) { colorClass = 'bg-yellow-100 text-yellow-700'; width = '60%'; }
    
    return (
        <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
            </div>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${colorClass}`}>{score}</span>
        </div>
    );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles: any = {
        'Active': 'bg-green-50 text-green-700 border-green-200',
        'Trial': 'bg-blue-50 text-blue-700 border-blue-200',
        'Churned': 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${styles[status] || styles['Churned']}`}>
            {status}
        </span>
    );
};

const CustomerCRM: React.FC = () => {
    const [stats, setStats] = useState<CRMStats | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [pipeline, setPipeline] = useState<DealStage[]>([]);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Interaction State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getCRMData();
            setStats(data.stats);
            setCustomers(data.customers);
            setPipeline(data.pipeline);
            setInsights(data.insights);
            setTasks(data.tasks);
        } catch (error) {
            console.error("Error fetching CRM data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleCreateCustomer = async (customerData: any) => {
        await createCustomer(customerData);
        load(); // Refresh list
    };

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && customers.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FBF8F5]">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-orange"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBF8F5] font-display pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-brand-blue">Customer CRM</h1>
                            <p className="text-sm text-gray-500">Track customers, deals, and retention.</p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                Import CSV
                            </button>
                            <button 
                                onClick={() => setIsFormOpen(true)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <PlusIcon /> New Customer
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* KPI Row */}
                {stats && (
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CrmStatCard 
                            title="Total Customers" 
                            value={stats.totalCustomers} 
                            trend="+12%" trendUp={true} 
                            icon={<UsersIcon className="w-5 h-5" />} 
                            color="blue" 
                        />
                        <CrmStatCard 
                            title="Active Accounts" 
                            value={stats.activeAccounts} 
                            trend="+5%" trendUp={true} 
                            icon={<ActivityIcon className="w-5 h-5" />} 
                            color="green" 
                        />
                        <CrmStatCard 
                            title="Renewal Rate" 
                            value={`${stats.renewalRate}%`} 
                            trend="-2%" trendUp={false} 
                            icon={<RefreshIcon className="w-5 h-5" />} 
                            color="orange" 
                        />
                        <CrmStatCard 
                            title="At-Risk Accounts" 
                            value={stats.atRisk} 
                            trend="Action Needed" trendUp={false} 
                            icon={<AlertIcon className="w-5 h-5" />} 
                            color="red" 
                        />
                    </section>
                )}

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column (Primary Data) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Pipeline Visualization */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4">Deal Pipeline</h3>
                            <div className="h-12 flex rounded-lg overflow-hidden w-full">
                                {pipeline.map(stage => (
                                    <div 
                                        key={stage.id} 
                                        className={`${stage.color} relative group flex items-center justify-center transition-all hover:opacity-90 cursor-pointer`}
                                        style={{ width: `${(stage.count / Math.max(pipeline.reduce((a,b) => a + b.count, 0), 1)) * 100}%` }}
                                        title={`${stage.name}: ${stage.count} deals`}
                                    >
                                        <span className="text-xs font-bold text-white drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity">{stage.count}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-4 mt-4 justify-between">
                                {pipeline.map(stage => (
                                    <div key={stage.id} className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-700">{stage.name}</p>
                                            <p className="text-[10px] text-gray-500">${stage.value.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer Table */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Table Toolbar */}
                            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
                                <div className="relative w-full sm:w-64">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input 
                                        type="text" 
                                        placeholder="Search customers..." 
                                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                                        <FilterIcon className="w-3 h-3" /> Filter
                                    </button>
                                    <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">
                                        Sort: Last Seen
                                    </button>
                                </div>
                            </div>

                            {/* Data Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            <th className="px-6 py-3">Customer</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Health</th>
                                            <th className="px-6 py-3">MRR</th>
                                            <th className="px-6 py-3">Renewal</th>
                                            <th className="px-6 py-3">Owner</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                                            <tr key={c.id} onClick={() => setSelectedCustomer(c)} className="group hover:bg-blue-50/30 transition-colors cursor-pointer">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-gray-200 text-gray-600 font-bold flex items-center justify-center text-xs">
                                                            {c.logo}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{c.name}</p>
                                                            <p className="text-xs text-gray-500">{c.segment}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={c.status} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <HealthBadge score={c.healthScore} />
                                                </td>
                                                <td className="px-6 py-4 text-sm font-mono text-gray-700">
                                                    ${c.mrr.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500">
                                                    {c.renewalDate}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="w-6 h-6 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-bold flex items-center justify-center border border-brand-orange/20">
                                                        {c.owner.substring(0, 2).toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-gray-400 hover:text-brand-blue p-1">
                                                        <MoreHorizontalIcon />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                    No customers found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Intelligence Sidebar) */}
                    <aside className="space-y-6">
                        
                        {/* AI Insights */}
                        <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                            <h3 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                <SparklesIcon className="text-indigo-500" />
                                Gemini Insights
                            </h3>
                            <div className="space-y-3">
                                {insights.map(insight => (
                                    <div key={insight.id} className="bg-white p-3 rounded-lg border border-indigo-50 shadow-sm">
                                        <p className="text-xs text-gray-700 leading-relaxed mb-2">{insight.message}</p>
                                        {insight.action && (
                                            <button className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-wide">
                                                {insight.action} &rarr;
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tasks Panel */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-gray-800">Tasks & Follow-ups</h3>
                                <button className="text-xs font-bold text-brand-orange hover:underline">+ Add</button>
                            </div>
                            <div className="space-y-2">
                                {tasks.map(task => (
                                    <div key={task.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                                        <div className={`mt-0.5 w-4 h-4 border-2 rounded ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'} flex items-center justify-center`}>
                                            {task.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-[10px] text-gray-500">{task.due}</span>
                                                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{task.assignee}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </aside>
                </div>
            </main>

            {/* Modals / Drawers */}
            <CustomerFormModal 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                onSubmit={handleCreateCustomer} 
            />
            
            <CustomerDetailPanel 
                isOpen={!!selectedCustomer} 
                customer={selectedCustomer} 
                onClose={() => setSelectedCustomer(null)} 
            />
        </div>
    );
};

export default CustomerCRM;
