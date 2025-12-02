
import React, { useState, useEffect, useMemo } from 'react';
import { 
    createCustomer,
    Customer, 
    Insight, 
    Task,
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
import { OnboardingTour, TourStep } from '../components/common/OnboardingTour';
import { CDPIcons } from '../components/crm/CRMIcons';
import { TaskList } from '../components/crm/TaskList';
import { useCRM } from '../hooks/useCRM';
import { CrmStatCard } from '../components/crm/CRMComponents';
import { PipelineVisualizer } from '../components/crm/PipelineVisualizer';
import { CRMInsightsWidget } from '../components/crm/CRMInsightsWidget';
import { CustomerTable } from '../components/crm/CustomerTable';
import { useLocation } from 'react-router-dom';

const CustomerCRM: React.FC = () => {
    const { loading, stats, customers, pipeline, insights, tasks, setInsights, setTasks, load, success, toastError } = useCRM();
    const location = useLocation();
    const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
    const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [minHealth, setMinHealth] = useState(0);
    const [pipelineFilter, setPipelineFilter] = useState<string | null>(null);

    // UI State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [emailTarget, setEmailTarget] = useState<Customer | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isTourOpen, setIsTourOpen] = useState(false);
    
    // Action Intent State
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenCRMTour');
        if (!hasSeenTour) setTimeout(() => setIsTourOpen(true), 1000);
    }, []);

    // Handle Navigation Intent
    useEffect(() => {
        if (location.state?.action) {
            setPendingAction(location.state.action);
            // Clear state to avoid loop
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // --- Computed Data ---
    const filteredCustomers = useMemo(() => {
        let result = customers;
        
        if (pipelineFilter) {
             const statusMap: Record<string, string> = { 'Lead': 'Lead', 'Closed Won': 'Active' };
             const targetStatus = statusMap[pipelineFilter];
             if (targetStatus) result = result.filter(c => c.status === targetStatus);
        }

        return result.filter(c => {
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

    // --- Handlers ---
    const handleRefreshInsights = async () => {
        setIsRefreshingInsights(true);
        try {
            if (customers.length > 0) {
                 const newInsights = await generateCRMInsights(customers);
                 setInsights(newInsights as Insight[]);
                 success("Insights updated.");
            }
        } catch (e) {
            toastError("Failed to refresh insights.");
        } finally {
            setIsRefreshingInsights(false);
        }
    };

    const handleInsightAction = (insight: Insight) => {
        if (insight.action?.includes("Follow up with")) {
             const name = insight.action.replace("Follow up with ", "").trim();
             const target = customers.find(c => c.name === name);
             if (target) setEmailTarget(target);
        } else if (insight.action?.includes("Upsell")) {
             const name = insight.action.replace("Upsell ", "").trim();
             const target = customers.find(c => c.name === name);
             if (target) setSelectedCustomer(target);
        } else if (insight.action?.includes("Close")) {
            const name = insight.action.replace("Close ", "").trim();
            const target = customers.find(c => c.name === name);
            if (target) setSelectedCustomer(target);
        }
    };

    const handleTaskToggle = async (taskId: string, completed: boolean) => {
        try {
            await toggleTask(taskId, completed);
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed } : t));
        } catch (e) {
            toastError("Failed to update task.");
            load();
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await deleteTask(taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
            success("Task deleted.");
        } catch (e) {
            toastError("Failed to delete task.");
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} customers?`)) return;
        try {
            await bulkDeleteCustomers(Array.from(selectedIds));
            setSelectedIds(new Set());
            success(`Deleted ${selectedIds.size} customers.`);
            load();
        } catch (e) {
            toastError("Failed to delete selected customers.");
        }
    };

    const handleCreateCustomer = async (customerData: Omit<Customer, 'id' | 'lastInteraction' | 'owner' | 'healthScore'>) => {
        try {
            await createCustomer(customerData);
            success("Customer created successfully.");
            load();
        } catch (e) {
            console.error("Failed to create customer", e);
            toastError("Failed to create customer.");
        }
    };

    // If an action is pending, intercept selection
    const handleCustomerSelect = (customer: Customer) => {
        setSelectedCustomer(customer);
        // The logic to switch tab to 'sales' and trigger generation is inside DetailPanel based on props,
        // or handled here if DetailPanel exposes that control. 
        // For simplicity, we rely on the user seeing the panel open. 
        // Refinement: We could pass an `initialTab` prop to CustomerDetailPanel.
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FBF8F5]">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-orange"></div>
            </div>
        );
    }

    const tourSteps: TourStep[] = [
        { targetId: 'crm-enriched-col', title: 'AI Data Enrichment', content: 'Gemini 3 automatically researches your leads to find CEO names, LinkedIn profiles, and recent news.', position: 'bottom' },
        { targetId: 'crm-insights-widget', title: 'Strategic Intelligence', content: 'This widget analyzes your entire CRM to find churn risks and upsell opportunities automatically.', position: 'left' },
        { targetId: 'crm-import-btn', title: 'Smart CSV Import', content: 'Upload any messy CSV. Our AI will map the columns to the right fields for you.', position: 'bottom' }
    ];

    return (
        <div className="min-h-screen bg-[#FBF8F5] font-display pb-20 relative">
            
            {/* Action Intent Banner */}
            {pendingAction === 'generate-battlecard' && (
                <div className="bg-indigo-600 text-white px-6 py-3 flex justify-between items-center animate-fade-in-up sticky top-[64px] z-20 shadow-md">
                    <div className="flex items-center gap-2">
                        <CDPIcons.Sparkles className="w-5 h-5 text-yellow-300" />
                        <span className="font-bold">Battlecard Generator Active:</span>
                        <span className="text-indigo-100 text-sm">Select a customer below to generate a competitive analysis.</span>
                    </div>
                    <button onClick={() => setPendingAction(null)} className="text-white/80 hover:text-white"><CDPIcons.X className="w-5 h-5" /></button>
                </div>
            )}

            {/* Bulk Actions Floating Bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-xl rounded-full px-6 py-3 flex items-center gap-4 animate-fade-in-up">
                    <span className="font-bold text-sm text-gray-800">{selectedIds.size} Selected</span>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <button onClick={handleBulkDelete} className="text-red-600 hover:text-red-800 text-sm font-bold flex items-center gap-1">
                        <CDPIcons.Trash className="w-4 h-4" /> Delete
                    </button>
                    <button onClick={() => setSelectedIds(new Set())} className="text-gray-500 hover:text-gray-700 text-sm font-bold ml-2">Cancel</button>
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
                            <div className="bg-gray-100 p-1 rounded-lg flex items-center border border-gray-200">
                                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow text-brand-blue' : 'text-gray-500 hover:text-gray-700'}`} title="List View"><CDPIcons.List className="w-4 h-4" /></button>
                                <button onClick={() => setViewMode('board')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'board' ? 'bg-white shadow text-brand-blue' : 'text-gray-500 hover:text-gray-700'}`} title="Pipeline Board"><CDPIcons.Layout className="w-4 h-4" /></button>
                            </div>
                            <button id="crm-import-btn" onClick={() => setIsImportModalOpen(true)} className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
                                <CDPIcons.Upload className="w-4 h-4" /> Import CSV
                            </button>
                            <button onClick={() => setIsFormOpen(true)} className="flex-1 sm:flex-none px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors shadow-sm flex items-center justify-center gap-2">
                                <CDPIcons.Plus className="w-4 h-4"/> New Customer
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* KPI Stats Row */}
                {stats && viewMode === 'list' && (
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CrmStatCard title="Total Customers" value={stats.totalCustomers} trend="+12%" trendUp={true} icon={<CDPIcons.User className="w-5 h-5" />} color="blue" />
                        <CrmStatCard title="Active Accounts" value={stats.activeAccounts} trend="+5%" trendUp={true} icon={<CDPIcons.Activity className="w-5 h-5" />} color="green" />
                        <CrmStatCard title="Renewal Rate" value={`${stats.renewalRate}%`} trend="-2%" trendUp={false} icon={<CDPIcons.Refresh className="w-5 h-5" />} color="orange" />
                        <CrmStatCard title="At-Risk Accounts" value={stats.atRisk} trend="Action Needed" trendUp={false} icon={<CDPIcons.Alert className="w-5 h-5" />} color="red" />
                    </section>
                )}

                {viewMode === 'board' ? (
                    <div className="h-[calc(100vh-240px)] w-full overflow-hidden">
                        <DealBoard />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column (Main Data) */}
                        <div className="lg:col-span-2 space-y-8">
                            <PipelineVisualizer 
                                pipeline={pipeline} 
                                pipelineFilter={pipelineFilter} 
                                setPipelineFilter={setPipelineFilter} 
                            />

                            <CustomerTable 
                                customers={filteredCustomers}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                minHealth={minHealth}
                                setMinHealth={setMinHealth}
                                showFilters={showFilters}
                                setShowFilters={setShowFilters}
                                selectedIds={selectedIds}
                                setSelectedIds={setSelectedIds}
                                onCustomerClick={handleCustomerSelect}
                                onEmailClick={setEmailTarget}
                            />
                        </div>

                        {/* Right Sidebar (Intelligence & Tasks) */}
                        <aside className="space-y-6">
                            <CRMInsightsWidget 
                                insights={insights} 
                                onRefresh={handleRefreshInsights} 
                                isRefreshing={isRefreshingInsights} 
                                onAction={handleInsightAction}
                            />

                            <TaskList 
                                tasks={tasks}
                                onAddTask={() => { setEditingTask(undefined); setIsTaskModalOpen(true); }}
                                onToggle={handleTaskToggle}
                                onDelete={handleDeleteTask}
                                onEdit={(task) => { setEditingTask(task); setIsTaskModalOpen(true); }}
                                title="Tasks & Follow-ups"
                                compact={false}
                            />
                        </aside>
                    </div>
                )}
            </main>

            {/* Dialogs & Modals */}
            <CustomerFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleCreateCustomer} />
            <CSVImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onComplete={load} />
            <TaskFormModal isOpen={isTaskModalOpen} onClose={() => { setIsTaskModalOpen(false); setEditingTask(undefined); }} onComplete={load} taskToEdit={editingTask} />
            
            <CustomerDetailPanel 
                isOpen={!!selectedCustomer} 
                customer={selectedCustomer} 
                onClose={() => { setSelectedCustomer(null); setPendingAction(null); }} 
                initialTab={pendingAction === 'generate-battlecard' ? 'sales' : 'overview'}
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
                onComplete={() => { setIsTourOpen(false); localStorage.setItem('hasSeenCRMTour', 'true'); }} 
                onSkip={() => { setIsTourOpen(false); localStorage.setItem('hasSeenCRMTour', 'true'); }} 
            />
        </div>
    );
};

export default CustomerCRM;
