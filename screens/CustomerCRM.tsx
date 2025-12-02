
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
    getCRMData, 
    createCustomer,
    Customer, 
    CRMStats, 
    DealStage, 
    Insight, 
    Task,
    getDealsForCustomer,
    bulkDeleteCustomers,
    toggleTask,
    deleteTask
} from '../services/crmService';
import { generateCRMInsights } from '../services/ai/crm';
import { CustomerFormModal } from '../components/crm/CustomerFormModal';
import { CustomerDetailPanel } from '../components/crm/CustomerDetailPanel';
import { EmailComposeModal } from '../components/crm/EmailComposeModal';
import { CSVImportModal } from '../components/crm/CSVImportModal';
import { DealBoard } from '../components/crm/DealBoard';
import { TaskFormModal } from '../components/crm/TaskFormModal';
import { EmptyState } from '../components/common/EmptyState';
import { OnboardingTour, TourStep } from '../components/common/OnboardingTour';
import { useToast } from '../contexts/ToastContext';

// --- Icons ---
const UsersIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ActivityIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const AlertIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const RefreshIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>;
const PlusIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const FilterIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const MailIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const MoreHorizontalIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
const SparklesIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const TargetIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const UploadIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const LinkedinIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const LayoutIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>;
const ListIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>;
const DownloadIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const TrashIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const EditIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;


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
    if (score >= 80) { colorClass = 'bg-green-100 text-green-700'; }
    else if (score >= 50) { colorClass = 'bg-yellow-100 text-yellow-700'; }
    
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
        'Lead': 'bg-purple-50 text-purple-700 border-purple-200',
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
    const { success, error: toastError } = useToast();
    const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
    const [stats, setStats] = useState<CRMStats | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [pipeline, setPipeline] = useState<DealStage[]>([]);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [minHealth, setMinHealth] = useState(0);
    const [lastInteractionDays, setLastInteractionDays] = useState<number | ''>('');
    const [pipelineFilter, setPipelineFilter] = useState<string | null>(null);

    // Interaction State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    // Email State
    const [emailTarget, setEmailTarget] = useState<Customer | null>(null);

    // Bulk Actions
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Tour State
    const [isTourOpen, setIsTourOpen] = useState(false);

    const tourSteps: TourStep[] = [
        {
            targetId: 'crm-enriched-col',
            title: 'AI Data Enrichment',
            content: 'Gemini 3 automatically researches your leads to find CEO names, LinkedIn profiles, and recent news. Look for this data here.',
            position: 'bottom'
        },
        {
            targetId: 'crm-insights-widget',
            title: 'Strategic Intelligence',
            content: 'This widget analyzes your entire CRM to find churn risks and upsell opportunities automatically.',
            position: 'left'
        },
        {
            targetId: 'crm-import-btn',
            title: 'Smart CSV Import',
            content: 'Upload any messy CSV. Our AI will map the columns to the right fields for you.',
            position: 'bottom'
        }
    ];

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
            toastError("Failed to load CRM data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        
        // Check if tour has been seen
        const hasSeenTour = localStorage.getItem('hasSeenCRMTour');
        if (!hasSeenTour) {
            // Small delay to ensure layout is ready
            setTimeout(() => setIsTourOpen(true), 1000);
        }
    }, []);

    const handleTourComplete = () => {
        setIsTourOpen(false);
        localStorage.setItem('hasSeenCRMTour', 'true');
    };

    const handleCreateCustomer = async (customerData: any) => {
        await createCustomer(customerData);
        success("Customer created successfully.");
        load(); // Refresh list
    };

    const handleEmailClick = (e: React.MouseEvent, customer: Customer) => {
        e.stopPropagation();
        setEmailTarget(customer);
    }
    
    const handleInsightAction = (insight: Insight) => {
        if (insight.action?.includes("Follow up with")) {
             const name = insight.action.replace("Follow up with ", "").trim();
             const target = customers.find(c => c.name === name);
             if (target) {
                 setEmailTarget(target);
             }
        } else if (insight.action?.includes("Upsell")) {
             const name = insight.action.replace("Upsell ", "").trim();
             const target = customers.find(c => c.name === name);
             if (target) {
                 setSelectedCustomer(target);
             }
        } else if (insight.action?.includes("Close")) {
            const name = insight.action.replace("Close ", "").trim();
            const target = customers.find(c => c.name === name);
            if (target) setSelectedCustomer(target);
        }
    };

    const handleRefreshInsights = async () => {
        setIsRefreshingInsights(true);
        try {
            if (customers.length > 0) {
                 const newInsights = await generateCRMInsights(customers);
                 setInsights(newInsights as Insight[]);
                 success("Insights updated.");
            }
        } catch (e) {
            console.error("Failed to refresh insights", e);
            toastError("Failed to refresh insights.");
        } finally {
            setIsRefreshingInsights(false);
        }
    };

    const handleTaskToggle = async (taskId: string, completed: boolean) => {
        try {
            await toggleTask(taskId, completed);
            // Optimistic update for smoother UI
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed } : t));
        } catch (e) {
            console.error("Failed to toggle task", e);
            toastError("Failed to update task.");
            load(); // Revert on error
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await deleteTask(taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
            success("Task deleted.");
        } catch (e) {
            console.error("Failed to delete task", e);
            toastError("Failed to delete task.");
        }
    };

    const handleCloseTaskModal = () => {
        setIsTaskModalOpen(false);
        setEditingTask(undefined);
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = c.name.toLowerCase().includes(searchLower) || 
                                  c.owner.toLowerCase().includes(searchLower) ||
                                  c.ceoName?.toLowerCase().includes(searchLower) ||
                                  c.latestNews?.toLowerCase().includes(searchLower) ||
                                  c.companySummary?.toLowerCase().includes(searchLower) ||
                                  c.tags?.some(t => t.toLowerCase().includes(searchLower));
            
            const matchesHealth = c.healthScore >= minHealth;
            
            return matchesSearch && matchesHealth;
        });
    }, [customers, searchTerm, minHealth, pipelineFilter]);

    // Bulk Selection Logic
    const toggleSelectAll = () => {
        if (selectedIds.size === filteredCustomers.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredCustomers.map(c => c.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} customers?`)) return;
        
        try {
            await bulkDeleteCustomers(Array.from(selectedIds));
            setSelectedIds(new Set());
            success(`Deleted ${selectedIds.size} customers.`);
            load();
        } catch (e) {
            console.error("Bulk delete failed:", e);
            toastError("Failed to delete selected customers.");
        }
    };

    const handleExportCSV = () => {
        const headers = ['Name', 'Segment', 'Status', 'MRR', 'Health Score', 'Last Interaction', 'CEO', 'News'];
        const csvContent = [
            headers.join(','),
            ...filteredCustomers.map(c => [
                `"${c.name}"`,
                c.segment,
                c.status,
                c.mrr,
                c.healthScore,
                c.lastInteraction,
                `"${c.ceoName || ''}"`,
                `"${c.latestNews ? c.latestNews.replace(/"/g, '""') : ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `crm_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        success("Export started.");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FBF8F5]">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-orange"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBF8F5] font-display pb-20 relative">
            {/* Bulk Actions Floating Bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-xl rounded-full px-6 py-3 flex items-center gap-4 animate-fade-in-up">
                    <span className="font-bold text-sm text-gray-800">{selectedIds.size} Selected</span>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <button 
                        onClick={handleBulkDelete}
                        className="text-red-600 hover:text-red-800 text-sm font-bold flex items-center gap-1"
                    >
                        <TrashIcon className="w-4 h-4" /> Delete
                    </button>
                    <button 
                        onClick={() => setSelectedIds(new Set())}
                        className="text-gray-500 hover:text-gray-700 text-sm font-bold ml-2"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-brand-blue">Customer CRM</h1>
                            <p className="text-sm text-gray-500">Track customers, deals, and retention.</p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto items-center">
                            {/* View Toggle */}
                            <div className="bg-gray-100 p-1 rounded-lg flex items-center border border-gray-200">
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow text-brand-blue' : 'text-gray-500 hover:text-gray-700'}`}
                                    title="List View"
                                >
                                    <ListIcon className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setViewMode('board')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'board' ? 'bg-white shadow text-brand-blue' : 'text-gray-500 hover:text-gray-700'}`}
                                    title="Pipeline Board"
                                >
                                    <LayoutIcon className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <button 
                                id="crm-import-btn"
                                onClick={() => setIsImportModalOpen(true)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center"
                            >
                                <UploadIcon className="w-4 h-4" /> Import CSV
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
                
                {/* KPI Row (Only in List View for cleaner Board) */}
                {stats && viewMode === 'list' && (
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

                {viewMode === 'board' ? (
                    <div className="h-[calc(100vh-240px)] w-full overflow-hidden">
                        <DealBoard />
                    </div>
                ) : (
                    /* Content Grid */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column (Primary Data) */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Pipeline Visualization (Interactive) */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-800">Deal Pipeline</h3>
                                    {pipelineFilter && (
                                        <button 
                                            onClick={() => setPipelineFilter(null)}
                                            className="text-xs text-gray-500 hover:text-brand-orange flex items-center gap-1"
                                        >
                                            Clear Filter ({pipelineFilter})
                                        </button>
                                    )}
                                </div>
                                <div className="h-12 flex rounded-lg overflow-hidden w-full cursor-pointer">
                                    {pipeline.map(stage => (
                                        <div 
                                            key={stage.id} 
                                            onClick={() => setPipelineFilter(pipelineFilter === stage.name ? null : stage.name)}
                                            className={`${stage.color} relative group flex items-center justify-center transition-all hover:opacity-90 ${pipelineFilter && pipelineFilter !== stage.name ? 'opacity-40' : ''}`}
                                            style={{ width: `${(stage.count / Math.max(pipeline.reduce((a,b) => a + b.count, 0), 1)) * 100}%` }}
                                            title={`${stage.name}: ${stage.count} deals`}
                                        >
                                            <span className="text-xs font-bold text-white drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity">{stage.count}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-4 mt-4 justify-between">
                                    {pipeline.map(stage => (
                                        <div 
                                            key={stage.id} 
                                            className={`flex items-center gap-2 cursor-pointer ${pipelineFilter === stage.name ? 'opacity-100 font-bold' : pipelineFilter ? 'opacity-50' : ''}`}
                                            onClick={() => setPipelineFilter(pipelineFilter === stage.name ? null : stage.name)}
                                        >
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
                                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
                                        <div className="relative w-full sm:w-64">
                                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input 
                                                type="text" 
                                                placeholder="Search customers, CEOs, tags..." 
                                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handleExportCSV}
                                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                            >
                                                <DownloadIcon className="w-3 h-3" /> Export
                                            </button>
                                            <button 
                                                onClick={() => setShowFilters(!showFilters)}
                                                className={`px-3 py-2 border rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${showFilters ? 'bg-orange-50 border-brand-orange text-brand-orange' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                <FilterIcon className="w-3 h-3" /> Filters
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {showFilters && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 animate-fade-in">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">Min Health Score: {minHealth}</label>
                                                <input 
                                                    type="range" 
                                                    min="0" 
                                                    max="100" 
                                                    value={minHealth} 
                                                    onChange={(e) => setMinHealth(parseInt(e.target.value))}
                                                    className="w-full accent-brand-orange h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1">Interaction</label>
                                                <select 
                                                    className="w-full p-1.5 text-xs border border-gray-300 rounded bg-white"
                                                    value={lastInteractionDays}
                                                    onChange={e => setLastInteractionDays(e.target.value ? parseInt(e.target.value) : '')}
                                                >
                                                    <option value="">Any Time</option>
                                                    <option value="7">Last 7 Days</option>
                                                    <option value="30">Last 30 Days</option>
                                                    <option value="90">Last 90 Days</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Data Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                <th className="px-4 py-3 w-10">
                                                    <input 
                                                        type="checkbox" 
                                                        className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                                                        checked={filteredCustomers.length > 0 && selectedIds.size === filteredCustomers.length}
                                                        onChange={toggleSelectAll}
                                                    />
                                                </th>
                                                <th className="px-6 py-3">Customer</th>
                                                <th className="px-6 py-3">CEO (Leadership)</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Health</th>
                                                <th id="crm-enriched-col" className="px-6 py-3">Enriched</th>
                                                <th className="px-6 py-3">MRR</th>
                                                <th className="px-6 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                                                <tr key={c.id} onClick={() => setSelectedCustomer(c)} className={`group hover:bg-blue-50/30 transition-colors cursor-pointer ${selectedIds.has(c.id) ? 'bg-blue-50/50' : ''}`}>
                                                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                                                        <input 
                                                            type="checkbox" 
                                                            className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                                                            checked={selectedIds.has(c.id)}
                                                            onChange={() => toggleSelect(c.id)}
                                                        />
                                                    </td>
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
                                                         {c.ceoName ? (
                                                             <div className="flex flex-col">
                                                                 <span className="text-sm text-gray-900 font-medium">{c.ceoName}</span>
                                                                 {c.ceoLinkedin && <a href={c.ceoLinkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1" onClick={e => e.stopPropagation()}><LinkedinIcon className="w-3 h-3"/> Profile</a>}
                                                             </div>
                                                         ) : <span className="text-xs text-gray-400">--</span>}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge status={c.status} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <HealthBadge score={c.healthScore} />
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-gray-500">
                                                        {c.lastEnrichedAt || 'Never'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-mono text-gray-700">
                                                        ${c.mrr.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button 
                                                                onClick={(e) => handleEmailClick(e, c)}
                                                                className="text-gray-400 hover:text-brand-orange p-1 rounded hover:bg-gray-100 transition-colors"
                                                                title="Draft Email"
                                                            >
                                                                <MailIcon />
                                                            </button>
                                                            <button className="text-gray-400 hover:text-brand-blue p-1">
                                                                <MoreHorizontalIcon />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={8} className="px-0 py-0">
                                                        <EmptyState 
                                                            type="customers" 
                                                            title="No customers found" 
                                                            description="Try adjusting your filters or add a new customer to get started." 
                                                            action={
                                                                <button onClick={() => setIsFormOpen(true)} className="text-brand-orange font-bold text-sm hover:underline">
                                                                    Add New Customer
                                                                </button>
                                                            }
                                                            compact={true}
                                                        />
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
                            
                            {/* Gemini Insights Widget */}
                            <div id="crm-insights-widget" className="bg-white p-0 rounded-2xl border border-indigo-100 shadow-lg overflow-hidden flex flex-col h-auto">
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <SparklesIcon className="text-yellow-300" />
                                        Gemini Insights
                                    </h3>
                                    <button 
                                        onClick={handleRefreshInsights} 
                                        disabled={isRefreshingInsights}
                                        className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all disabled:opacity-50"
                                        title="Refresh AI Recommendations"
                                    >
                                        <RefreshIcon className={`w-4 h-4 ${isRefreshingInsights ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                                
                                <div className="p-5 bg-indigo-50/30 space-y-4">
                                    {insights.length > 0 ? insights.map(insight => (
                                        <div key={insight.id} className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3 relative overflow-hidden group">
                                            {/* Decorator */}
                                            <div className={`absolute top-0 left-0 w-1 h-full ${insight.type === 'risk' ? 'bg-red-500' : insight.type === 'opportunity' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                            
                                            <div className="pl-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {insight.type === 'risk' && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">RISK</span>}
                                                    {insight.type === 'opportunity' && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">OPPORTUNITY</span>}
                                                    {insight.type === 'info' && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">INFO</span>}
                                                </div>
                                                <p className="text-sm text-gray-800 leading-snug font-medium">{insight.message}</p>
                                            </div>
                                            
                                            {insight.action && (
                                                <button 
                                                    onClick={() => handleInsightAction(insight)}
                                                    className={`self-end w-full text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 ${
                                                        insight.type === 'risk' ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' : 
                                                        insight.type === 'opportunity' ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' : 
                                                        'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                                                    }`}
                                                >
                                                    {insight.action.includes("Follow up") ? <MailIcon className="w-3 h-3" /> : <TargetIcon className="w-3 h-3" />}
                                                    {insight.action} 
                                                </button>
                                            )}
                                        </div>
                                    )) : (
                                        <EmptyState 
                                            type="search" 
                                            title="No insights yet" 
                                            description="Add more customer data to get AI-powered recommendations."
                                            compact={true}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Tasks Panel */}
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-gray-800">Tasks & Follow-ups</h3>
                                    <button 
                                        onClick={() => setIsTaskModalOpen(true)}
                                        className="text-xs font-bold text-brand-orange hover:underline"
                                    >
                                        + Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {tasks.length > 0 ? tasks.map(task => (
                                        <div key={task.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                                            <button 
                                                onClick={() => handleTaskToggle(task.id, !task.completed)}
                                                className={`mt-0.5 w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-gray-400'}`}
                                            >
                                                {task.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                            </button>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                        <span className="opacity-75">📅</span> {task.due}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{task.assignee}</span>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <button onClick={() => handleEditTask(task)} className="p-1 text-gray-400 hover:text-blue-500">
                                                    <EditIcon className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => handleDeleteTask(task.id)} className="p-1 text-gray-400 hover:text-red-500">
                                                    <TrashIcon className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <EmptyState 
                                            type="tasks" 
                                            title="All caught up!" 
                                            description="No pending tasks. Great job!"
                                            compact={true}
                                        />
                                    )}
                                </div>
                            </div>

                        </aside>
                    </div>
                )}
            </main>

            {/* Modals / Drawers */}
            <CustomerFormModal 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                onSubmit={handleCreateCustomer} 
            />
            
            <CSVImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onComplete={load}
            />
            
            <TaskFormModal
                isOpen={isTaskModalOpen}
                onClose={handleCloseTaskModal}
                onComplete={load}
                taskToEdit={editingTask}
            />
            
            <CustomerDetailPanel 
                isOpen={!!selectedCustomer} 
                customer={selectedCustomer} 
                onClose={() => setSelectedCustomer(null)} 
            />

            {emailTarget && (
                <EmailComposeModal
                    isOpen={!!emailTarget}
                    onClose={() => setEmailTarget(null)}
                    recipientName="Contact"
                    companyName={emailTarget.name}
                    accountId={emailTarget.id}
                    customer={emailTarget}
                />
            )}

            <OnboardingTour 
                steps={tourSteps}
                isOpen={isTourOpen}
                onComplete={handleTourComplete}
                onSkip={handleTourComplete}
            />
        </div>
    );
};

export default CustomerCRM;
