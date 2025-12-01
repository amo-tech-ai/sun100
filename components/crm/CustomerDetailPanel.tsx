
import React, { useState, useEffect } from 'react';
import { Customer, Task, Interaction, getTasks, getInteractions, addTask, addInteraction, toggleTask } from '../../services/crmService';
import { analyzeAccountHealth } from '../../services/ai/crm';
import { AccountHealth } from '../../services/ai/types';

interface CustomerDetailPanelProps {
    customer: Customer | null;
    isOpen: boolean;
    onClose: () => void;
}

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;

export const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({ customer, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'tasks'>('overview');
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [healthAnalysis, setHealthAnalysis] = useState<AccountHealth | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // New Entry States
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        if (customer) {
            loadDetails(customer.id);
            setHealthAnalysis(null); // Reset analysis on switch
        }
    }, [customer]);

    const loadDetails = async (id: string) => {
        const [ints, ts] = await Promise.all([
            getInteractions(id),
            getTasks(id)
        ]);
        setInteractions(ints);
        setTasks(ts);
    };

    const handleAnalyzeHealth = async () => {
        if (!customer) return;
        setIsAnalyzing(true);
        try {
            const result = await analyzeAccountHealth(customer);
            setHealthAnalysis(result);
        } catch (e) {
            console.error("Health analysis failed", e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAddTask = async () => {
        if (!customer || !newTaskTitle.trim()) return;
        try {
            await addTask({ title: newTaskTitle, due: new Date().toISOString(), completed: false, assignee: 'Me', accountId: customer.id });
            setNewTaskTitle('');
            await loadDetails(customer.id);
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddNote = async () => {
        if (!customer || !newNote.trim()) return;
        try {
            await addInteraction(customer.id, { type: 'note', summary: newNote, sentiment: 'Neutral' });
            setNewNote('');
            await loadDetails(customer.id);
        } catch (e) {
            console.error(e);
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
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><XIcon /></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    {['overview', 'timeline', 'tasks'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'text-brand-orange border-b-2 border-brand-orange bg-orange-50/50' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-xs font-bold text-gray-500 uppercase">MRR</p>
                                    <p className="text-xl font-bold text-gray-900">${customer.mrr.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Health Score</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${customer.healthScore > 70 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <p className="text-xl font-bold text-gray-900">{customer.healthScore}</p>
                                    </div>
                                </div>
                            </div>

                            {/* AI Health Analysis */}
                            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-5 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                                        <BrainIcon /> Account Intelligence
                                    </h3>
                                    {!healthAnalysis && (
                                        <button 
                                            onClick={handleAnalyzeHealth} 
                                            disabled={isAnalyzing}
                                            className="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-full hover:shadow-sm transition-all disabled:opacity-50"
                                        >
                                            {isAnalyzing ? 'Thinking...' : 'Analyze Health'}
                                        </button>
                                    )}
                                </div>
                                
                                {healthAnalysis ? (
                                    <div className="space-y-3 animate-fade-in">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-500 uppercase">AI Score</span>
                                            <span className={`text-sm font-bold px-2 py-0.5 rounded ${healthAnalysis.score > 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {healthAnalysis.status} ({healthAnalysis.score})
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">{healthAnalysis.recommendation}</p>
                                        <div className="space-y-1">
                                            {healthAnalysis.factors.map((f, i) => (
                                                <div key={i} className="text-xs text-gray-500 flex items-center gap-2">
                                                    <span className="w-1 h-1 bg-indigo-400 rounded-full"></span> {f}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-indigo-400 italic">
                                        Run an AI analysis to detect churn risks and upsell opportunities based on recent interactions.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input 
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                    placeholder="Add a note..." 
                                    className="flex-1 text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                />
                                <button onClick={handleAddNote} disabled={!newNote.trim()} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-gray-600 disabled:opacity-50">
                                    <PlusIcon />
                                </button>
                            </div>
                            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                {interactions.map(item => (
                                    <div key={item.id} className="relative pl-8 animate-fade-in-up">
                                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
                                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-bold text-gray-700 capitalize">{item.type}</span>
                                                <span className="text-gray-400">{item.date}</span>
                                            </div>
                                            <p className="text-sm text-gray-800">{item.summary}</p>
                                            {item.sentiment && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded mt-2 inline-block ${item.sentiment === 'Positive' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    {item.sentiment}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="space-y-4">
                             <div className="flex gap-2">
                                <input 
                                    value={newTaskTitle}
                                    onChange={e => setNewTaskTitle(e.target.value)}
                                    placeholder="New task..." 
                                    className="flex-1 text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                />
                                <button onClick={handleAddTask} disabled={!newTaskTitle.trim()} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-gray-600 disabled:opacity-50">
                                    <PlusIcon />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {tasks.map(task => (
                                    <div key={task.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow group">
                                        <button 
                                            onClick={() => toggleTask(task.id, !task.completed)}
                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-gray-400'}`}
                                        >
                                            {task.completed && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                        </button>
                                        <div className="flex-1">
                                            <p className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</p>
                                            <p className="text-xs text-gray-400">{task.due}</p>
                                        </div>
                                    </div>
                                ))}
                                {tasks.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No open tasks.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
