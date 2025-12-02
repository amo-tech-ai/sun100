
import React, { useState, useEffect, useCallback } from 'react';
import { 
    Customer, Task, Interaction, Deal, Contact, 
    getTasks, getInteractions, addTask, addInteraction, 
    toggleTask, deleteTask, getDealsForCustomer, getContacts, 
    createContact, updateContact, deleteContact 
} from '../../services/crmService';
import { 
    analyzeAccountHealth, analyzeDealScore, scoreLead, generateBattlecard, suggestTasks 
} from '../../services/ai/crm';
import { AccountHealth, LeadScoreResult, Battlecard, TaskSuggestion } from '../../services/ai/types';
import { useToast } from '../../contexts/ToastContext';
import { ContactFormModal } from './ContactFormModal';
import { EmailComposeModal } from './EmailComposeModal';
import { CDPIcons } from './CRMIcons';
import { OverviewTab, ContactsTab, SalesTab, TimelineTab, TasksTab } from './CustomerDetailTabs';

// ============================================================================
// Hook
// ============================================================================

const useCustomerDetail = (customerId: string | undefined) => {
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        if (!customerId) return;
        setLoading(true);
        try {
            const [ints, ts, ds, cs] = await Promise.all([
                getInteractions(customerId),
                getTasks({ accountId: customerId }),
                getDealsForCustomer(customerId),
                getContacts(customerId)
            ]);
            setInteractions(ints);
            setTasks(ts);
            setDeals(ds);
            setContacts(cs);
        } catch (error) {
            console.error("Failed to load customer details:", error);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { interactions, tasks, deals, contacts, loading, refresh, setTasks, setDeals };
};

// ============================================================================
// Main Component
// ============================================================================

interface CustomerDetailPanelProps {
    customer: Customer | null;
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'overview' | 'contacts' | 'sales' | 'timeline' | 'tasks';
}

export const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({ customer, isOpen, onClose, initialTab = 'overview' }) => {
    const { success, error: toastError } = useToast();
    const { interactions, tasks, deals, contacts, loading, refresh, setDeals, setTasks } = useCustomerDetail(customer?.id);
    
    const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'sales' | 'timeline' | 'tasks'>(initialTab);
    const [healthAnalysis, setHealthAnalysis] = useState<AccountHealth | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [leadScore, setLeadScore] = useState<LeadScoreResult | null>(null);
    const [isScoring, setIsScoring] = useState(false);
    const [battlecard, setBattlecard] = useState<Battlecard | null>(null);
    const [isGeneratingBattlecard, setIsGeneratingBattlecard] = useState(false);
    const [taskSuggestions, setTaskSuggestions] = useState<TaskSuggestion[]>([]);
    const [isSuggestingTasks, setIsSuggestingTasks] = useState(false);

    // Modal states
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);
    const [isLoggingInteraction, setIsLoggingInteraction] = useState(false);
    const [emailTargetContact, setEmailTargetContact] = useState<Contact | null>(null);
    
    // Task passing state
    const [taskInitialTitle, setTaskInitialTitle] = useState('');

    // Reset state when customer changes
    useEffect(() => {
        if (customer) {
            setHealthAnalysis(null);
            setLeadScore(null);
            setBattlecard(null);
            setTaskSuggestions([]);
            setIsLoggingInteraction(false);
            setTaskInitialTitle('');
            setActiveTab(initialTab); // Use initialTab when opening
        }
    }, [customer, initialTab]);

    const handleAnalyzeHealth = async () => {
        if (!customer) return;
        setIsAnalyzing(true);
        try {
            const result = await analyzeAccountHealth(customer);
            setHealthAnalysis(result);
            success("Health analysis complete.");
        } catch (e) {
            console.error("Health analysis failed", e);
            toastError("Failed to analyze health.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleScoreLead = async () => {
        if (!customer) return;
        setIsScoring(true);
        try {
            const result = await scoreLead(customer.id);
            setLeadScore(result);
            success("Lead scored successfully.");
        } catch (e) {
            console.error("Lead scoring failed", e);
            toastError("Failed to score lead.");
        } finally {
            setIsScoring(false);
        }
    };

    const handleGenerateBattlecard = async () => {
        if (!customer) return;
        setIsGeneratingBattlecard(true);
        try {
            const website = customer.name.toLowerCase().replace(/ /g, '') + '.com';
            const result = await generateBattlecard(customer.name, website);
            setBattlecard(result);
            success("Battlecard generated.");
        } catch (e) {
            console.error("Battlecard generation failed", e);
            toastError("Failed to generate battlecard.");
        } finally {
            setIsGeneratingBattlecard(false);
        }
    };

    const handleScoreDeal = async (deal: Deal) => {
        if (!customer) return;
        // Optimistic update
        setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, aiScore: undefined } : d));
        try {
            const interactionsContext = interactions.length > 0 ? interactions : await getInteractions(customer.id);
            const result = await analyzeDealScore(deal, customer, interactionsContext);
            setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, aiScore: result.score, aiReasoning: result.reasoning } : d));
            success("Deal scored.");
        } catch (e) {
            console.error("Deal scoring failed", e);
            toastError("Failed to score deal.");
        }
    };

    const handleSaveContact = async (contactData: Omit<Contact, 'id'>) => {
        if (!customer) return;
        try {
            if (editingContact) {
                await updateContact(editingContact.id, contactData);
                success("Contact updated.");
            } else {
                await createContact(contactData);
                success("Contact created.");
            }
            refresh();
        } catch (e) {
            console.error(e);
            toastError("Failed to save contact.");
            throw e;
        }
    };

    const handleDeleteContact = async (contactId: string) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) return;
        try {
            await deleteContact(contactId);
            success("Contact deleted.");
            refresh();
        } catch (e) {
            toastError("Failed to delete contact.");
        }
    };

    const handleEmailContact = (contact: Contact) => {
        setEmailTargetContact(contact);
    };

    const handleLogInteraction = async (e: React.FormEvent, formData: any) => {
        e.preventDefault();
        if (!customer) return;
        try {
            await addInteraction(customer.id, {
                type: formData.type,
                summary: formData.summary,
                sentiment: formData.sentiment,
            });
            setIsLoggingInteraction(false);
            refresh();
            success("Interaction logged.");
        } catch (e) {
            console.error("Failed to log interaction", e);
            toastError("Failed to log interaction.");
        }
    };

    const handleAddTask = async (title: string, date: string, reminder: boolean, priority: string) => {
        if (!customer || !title.trim()) return;
        try {
            let due = new Date();
            if (date) {
                due = new Date(date);
            } else {
                due.setDate(due.getDate() + 1);
            }

            await addTask({
                title: title,
                due: due.toISOString(),
                completed: false,
                assignee: 'Me',
                priority: priority as any,
                accountId: customer.id,
                notify: reminder
            });
            
            refresh();
            success("Task added.");
            setTaskInitialTitle(''); // Reset
            
            // If adding from suggestion, remove suggestion
            setTaskSuggestions(prev => prev.filter(s => s.title !== title));
        } catch (e) {
            console.error(e);
            toastError("Failed to add task.");
        }
    };

    const handleTaskToggle = async (taskId: string, completed: boolean) => {
        try {
            await toggleTask(taskId, completed);
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed } : t));
        } catch (e) {
            toastError("Failed to update task.");
            refresh();
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

    const createTaskFromInteraction = (interactionSummary: string) => {
        setTaskInitialTitle("Follow up: " + interactionSummary);
        setActiveTab('tasks');
        success("Switching to Tasks with pre-filled content.");
    };

    const handleSuggestTasks = async () => {
        if (!customer) return;
        setIsSuggestingTasks(true);
        try {
            const tasks = await suggestTasks(customer.id);
            setTaskSuggestions(tasks);
            success("Tasks suggested.");
        } catch (e) {
            toastError("Failed to suggest tasks.");
        } finally {
            setIsSuggestingTasks(false);
        }
    };

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={onClose}></div>
            <div className="w-full max-w-md bg-white h-full shadow-2xl pointer-events-auto flex flex-col animate-slide-in-right overflow-hidden">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-400">
                            {customer.logo}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
                            <p className="text-sm text-gray-500">{customer.segment} • {customer.status}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><CDPIcons.X /></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {['overview', 'contacts', 'sales', 'timeline', 'tasks'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-3 px-4 text-sm font-medium capitalize transition-colors whitespace-nowrap ${activeTab === tab ? 'text-brand-orange border-b-2 border-brand-orange bg-orange-50/50' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'overview' && (
                                <OverviewTab 
                                    customer={customer} 
                                    onAnalyzeHealth={handleAnalyzeHealth} 
                                    healthAnalysis={healthAnalysis} 
                                    isAnalyzing={isAnalyzing} 
                                />
                            )}
                            {activeTab === 'contacts' && (
                                <ContactsTab 
                                    contacts={contacts} 
                                    onAdd={() => { setEditingContact(undefined); setIsContactModalOpen(true); }}
                                    onEdit={(contact) => { setEditingContact(contact); setIsContactModalOpen(true); }}
                                    onDelete={handleDeleteContact}
                                    onEmail={handleEmailContact}
                                />
                            )}
                            {activeTab === 'sales' && (
                                <SalesTab 
                                    deals={deals} 
                                    leadScore={leadScore} 
                                    battlecard={battlecard} 
                                    isScoring={isScoring} 
                                    isGeneratingBattlecard={isGeneratingBattlecard}
                                    onScoreLead={handleScoreLead} 
                                    onGenerateBattlecard={handleGenerateBattlecard}
                                    onScoreDeal={handleScoreDeal}
                                />
                            )}
                            {activeTab === 'timeline' && (
                                <TimelineTab 
                                    interactions={interactions} 
                                    isLogging={isLoggingInteraction}
                                    onToggleLog={() => setIsLoggingInteraction(!isLoggingInteraction)}
                                    onLog={handleLogInteraction}
                                    onCreateTask={createTaskFromInteraction}
                                />
                            )}
                            {activeTab === 'tasks' && (
                                <TasksTab 
                                    tasks={tasks} 
                                    onAddTask={handleAddTask} 
                                    onToggle={handleTaskToggle} 
                                    onDelete={handleDeleteTask}
                                    onEdit={(task) => { console.log("Edit task", task); }} 
                                    onSuggestTasks={handleSuggestTasks}
                                    initialTitle={taskInitialTitle}
                                    isSuggestingTasks={isSuggestingTasks}
                                    suggestions={taskSuggestions}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            <ContactFormModal 
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                onSubmit={handleSaveContact}
                initialAccountId={customer.id}
                contactToEdit={editingContact}
            />

            {emailTargetContact && (
                <EmailComposeModal 
                    isOpen={!!emailTargetContact}
                    onClose={() => setEmailTargetContact(null)}
                    recipientName={`${emailTargetContact.firstName} ${emailTargetContact.lastName}`}
                    companyName={customer.name}
                    accountId={customer.id}
                    customer={customer}
                />
            )}
        </div>
    );
};
