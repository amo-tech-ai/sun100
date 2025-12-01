
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStartup } from '../hooks/useStartup';
import { getApplications, Application, ApplicationStatus } from '../services/fundingService';

// --- ICONS ---
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const PlusIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const BrainIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const ChevronRightIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>;
const SparklesIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const BriefcaseIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const SendIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const ClockIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

// --- SUB-COMPONENTS ---

const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
    const styles: Record<ApplicationStatus, string> = {
        'Draft': 'bg-gray-100 text-gray-600 border-gray-200',
        'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
        'In Review': 'bg-orange-50 text-orange-700 border-orange-200',
        'Interview': 'bg-purple-50 text-purple-700 border-purple-200',
        'Due Diligence': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'Accepted': 'bg-green-50 text-green-700 border-green-200',
        'Rejected': 'bg-red-50 text-red-700 border-red-200',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status]}`}>
            {status}
        </span>
    );
};

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
    const color = score >= 90 ? 'text-green-500' : score >= 70 ? 'text-yellow-500' : 'text-red-500';
    return (
        <div className="flex items-center gap-1.5">
            <div className={`font-bold text-sm ${color}`}>{score}%</div>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );
};

const KPICard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend?: string }> = ({ title, value, icon, trend }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-brand-blue">{value}</h3>
            </div>
            <div className="p-2 bg-gray-50 text-gray-400 rounded-lg">{icon}</div>
        </div>
        {trend && <p className="text-xs font-medium text-green-600 mt-3 bg-green-50 w-fit px-2 py-0.5 rounded-md">{trend}</p>}
    </div>
);

const AIInsightCard: React.FC<{ title: string; content: string; type: 'tip' | 'alert' | 'action' }> = ({ title, content, type }) => {
    const styles = {
        tip: 'bg-blue-50 border-blue-100 text-blue-800',
        alert: 'bg-red-50 border-red-100 text-red-800',
        action: 'bg-green-50 border-green-100 text-green-800',
    };
    const icons = {
        tip: <SparklesIcon className="w-4 h-4" />,
        alert: <div className="w-4 h-4 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold">!</div>,
        action: <div className="w-4 h-4 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">✓</div>
    };

    return (
        <div className={`p-4 rounded-xl border ${styles[type]} text-sm mb-3`}>
            <div className="flex items-center gap-2 font-bold mb-1">
                {icons[type]}
                {title}
            </div>
            <p className="opacity-90 leading-relaxed">{content}</p>
        </div>
    );
};

// --- MAIN COMPONENT ---

const FundingManager: React.FC = () => {
    const { profile } = useStartup();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            setLoading(true);
            try {
                const data = await getApplications();
                setApplications(data);
            } catch (err) {
                console.error("Failed to fetch applications", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const filteredApps = applications.filter(app => {
        const matchesSearch = app.investorName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[#FBF8F5]">
            
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-brand-blue">Funding Applications</h1>
                            <p className="text-gray-500 mt-1">Track and manage your deal flow for <span className="font-semibold text-gray-900">{profile.name}</span>.</p>
                        </div>
                        <Link to="/directory" className="bg-brand-blue text-white font-bold py-2.5 px-5 rounded-xl hover:bg-opacity-90 shadow-lg shadow-brand-blue/10 transition-all flex items-center gap-2">
                            <PlusIcon />
                            New Application
                        </Link>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPICard title="Total Applications" value={applications.length} icon={<BriefcaseIcon />} trend={applications.length > 0 ? "Active Pipeline" : undefined} />
                        <KPICard title="Active Discussions" value={applications.filter(a => ['Interview', 'Due Diligence', 'In Review'].includes(a.status)).length} icon={<SendIcon />} />
                        <KPICard title="Avg. Match Score" value={applications.length > 0 ? Math.round(applications.reduce((a,b) => a + b.matchScore, 0) / applications.length) + "%" : "N/A"} icon={<BrainIcon />} trend="AI Fit Analysis" />
                        <KPICard title="Next Actions" value={applications.filter(a => a.nextStep).length} icon={<ClockIcon />} />
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide p-1">
                            {['All', 'Draft', 'Submitted', 'In Review', 'Interview', 'Accepted'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${statusFilter === status ? 'bg-brand-orange text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full sm:w-64">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search investors..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-brand-orange rounded-lg text-sm focus:ring-0 transition-all"
                            />
                        </div>
                    </div>

                    {/* Application Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        {loading ? (
                             <div className="p-12 text-center text-gray-400">Loading pipeline...</div>
                        ) : filteredApps.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="px-6 py-4">Investor</th>
                                        <th className="px-6 py-4 hidden md:table-cell">Stage & Check</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 hidden sm:table-cell">Fit Score</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredApps.map(app => (
                                        <tr key={app.id} className="group hover:bg-gray-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-1 shadow-sm">
                                                        {app.investorLogo.startsWith('http') ? (
                                                            <img src={app.investorLogo} alt={app.investorName} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <span className="font-bold text-gray-400">{app.investorLogo}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{app.investorName}</div>
                                                        <div className="text-xs text-gray-500">{app.type}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="text-sm font-medium text-gray-800">{app.stage}</div>
                                                <div className="text-xs text-gray-500">{app.checkSize}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <StatusBadge status={app.status} />
                                                    <span className="text-[10px] text-gray-400 font-medium">{timeAgo(app.lastActionDate)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <ScoreRing score={app.matchScore} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-brand-orange transition-colors">
                                                    <ChevronRightIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <SearchIcon />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">No applications found</h3>
                                <p className="text-gray-500 mt-1">Try adjusting your filters or start a new application.</p>
                                <Link to="/directory" className="mt-6 inline-block text-sm font-bold text-brand-orange hover:underline">Browse Directory</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar: AI Assistant */}
            <aside className={`bg-white border-l border-gray-200 w-80 flex-shrink-0 hidden xl:flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full w-0 opacity-0'}`}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-brand-blue flex items-center gap-2">
                        <BrainIcon className="text-brand-orange"/> AI Copilot
                    </h2>
                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">BETA</span>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Active Insights</h3>
                        <AIInsightCard 
                            type="alert"
                            title="Low Action Alert"
                            content="You haven't followed up with Sequoia Capital in 3 days. Standard response time is 2 days."
                        />
                        <AIInsightCard 
                            type="tip"
                            title="Improve Your Odds"
                            content="Startups with a demo video in their YC application are 20% more likely to get an interview."
                        />
                        <AIInsightCard 
                            type="action"
                            title="Next Step: Interview"
                            content="Y Combinator interview scheduled. Would you like to do a mock AI interview session?"
                        />
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default FundingManager;
