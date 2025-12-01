
import React, { useState, useEffect } from 'react';
import { Customer, Task, Interaction, Deal, getTasks, getInteractions, addTask, addInteraction, toggleTask, linkDeckToCustomer, getDealsForCustomer } from '../../services/crmService';
import { analyzeAccountHealth, analyzeDealScore, scoreLead, generateBattlecard } from '../../services/ai/crm';
import { AccountHealth, LeadScoreResult, Battlecard } from '../../services/ai/types';
import { getDecks } from '../../services/deckService';
import { Deck } from '../../data/decks';
import { Link } from 'react-router-dom';

interface CustomerDetailPanelProps {
    customer: Customer | null;
    isOpen: boolean;
    onClose: () => void;
}

const XIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const BrainIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const PlusIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const BellIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const ShieldIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const ClockIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({ customer, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'tasks' | 'sales'>('overview');
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [healthAnalysis, setHealthAnalysis] = useState<AccountHealth | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // Sales/Lead State
    const [leadScore, setLeadScore] = useState<LeadScoreResult | null>(null);
    const [isScoring, setIsScoring] = useState(false);
    const [battlecard, setBattlecard] = useState<Battlecard | null>(null);
    const [isGeneratingBattlecard, setIsGeneratingBattlecard] = useState(false);

    // Deck Linking State
    const [userDecks, setUserDecks] = useState<Deck[]>([]);
    const [selectedDeckId, setSelectedDeckId] = useState('');
    const [isLinkingDeck, setIsLinkingDeck] = useState(false);

    // Interaction Logging State
    const [interactionForm, setInteractionForm] = useState({
        type: 'email' as Interaction['type'],
        summary: '',
        date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
        sentiment: 'Neutral' as Interaction['sentiment']
    });
    const [isLoggingInteraction, setIsLoggingInteraction] = useState(false);

    // New Task State
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDate, setNewTaskDate] = useState('');
    const [setReminder, setSetReminder] = useState(false);

    useEffect(() => {
        if (customer) {
            loadDetails(customer.id);
            loadDecks();
            setHealthAnalysis(null);
            setLeadScore(null);
            setBattlecard(null);
        }
    }, [customer]);

    const loadDetails = async (id: string) => {
        const [ints, ts, ds] = await Promise.all([
            getInteractions(id),
            getTasks(id),
            getDealsForCustomer(id)
        ]);
        setInteractions(ints);
        setTasks(ts);
        setDeals(ds);
    };

    const loadDecks = async () => {
        try {
            const decks = await getDecks();
            setUserDecks(decks);
        } catch (e) {
            console.error("Failed to load decks", e);
        }
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

    const handleScoreLead = async () => {
        if (!customer) return;
        setIsScoring(true);
        try {
            const result = await scoreLead(customer.id);
            setLeadScore(result);
        } catch (e) {
            console.error("Lead scoring failed", e);
        } finally {
            setIsScoring(false);
        }
    };

    const handleGenerateBattlecard = async () => {
        if (!customer) return;
        setIsGeneratingBattlecard(true);
        try {
            // Use a mock URL if website isn't available or parse domain from name
            const website = customer.name.toLowerCase().replace(/ /g, '') + '.com'; 
            const result = await generateBattlecard(customer.name, website);
            setBattlecard(result);
        } catch (e) {
            console.error("Battlecard generation failed", e);
        } finally {
            setIsGeneratingBattlecard(false);
        }
    };

    const handleScoreDeal = async (deal: Deal) => {
        if (!customer) return;
        setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, aiScore: undefined } : d)); 
        try {
            const result = await analyzeDealScore(deal, customer);
            setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, aiScore: result.score, aiReasoning: result.reasoning } : d));
        } catch (e) {
            console.error("Deal scoring failed", e);
        }
    };

    const handleLinkDeck = async () => {
        if (!customer || !selectedDeckId) return;
        try {
            await linkDeckToCustomer(customer.id, selectedDeckId);
            setIsLinkingDeck(false);
            setSelectedDeckId('');
        } catch (e) {
            console.error("Failed to link deck", e);
        }
    };

    const handleLogInteraction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer) return;
        try {
            await addInteraction(customer.id, {
                type: interactionForm.type,
                summary: interactionForm.summary,
                sentiment: interactionForm.sentiment,
            });
            setInteractionForm({ ...interactionForm, summary: '' });
            setIsLoggingInteraction(false);
            await loadDetails(customer.id);
        } catch (e) {
            console.error("Failed to log interaction", e);
        }
    };

    const handleAddTask = async () => {
        if (!customer || !newTaskTitle.trim()) return;
        try {
            // Default to tomorrow if no date picked
            let due = new Date();
            if (newTaskDate) {
                due = new Date(newTaskDate);
            } else {
                due.setDate(due.getDate() + 1);
            }

            await addTask({ 
                title: newTaskTitle, 
                due: due.toISOString(), 
                completed: false, 
                assignee: 'Me', 
                accountId: customer.id 
            });
            
            setNewTaskTitle('');
            setNewTaskDate('');
            setSetReminder(false);
            await loadDetails(customer.id);
        } catch (e) {
            console.error(e);
        }
    };

    const createTaskFromInteraction = (interactionSummary: string) => {
        setNewTaskTitle(`Follow up on: ${interactionSummary}`);
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setNewTaskDate(tomorrow.toISOString().slice(0, 10));
        
        setActiveTab('tasks');
    }

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
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {['overview', 'sales', 'timeline', 'tasks'].map(tab => (
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
                            
                            {/* Enriched Data Block */}
                            {(customer.ceoName || customer.latestNews) && (
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-blue-800 font-bold uppercase text-xs mb-1">
                                        <BrainIcon className="w-3 h-3" /> Enriched Data
                                    </div>
                                    {customer.ceoName && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">CEO</span>
                                            <span className="font-medium text-gray-900">{customer.ceoName}</span>
                                        </div>
                                    )}
                                    {customer.latestNews && (
                                        <div className="pt-2 border-t border-blue-100">
                                             <span className="text-xs text-gray-500 block mb-1">Latest Signal</span>
                                             <p className="italic text-gray-700">"{customer.latestNews}"</p>
                                        </div>
                                    )}
                                </div>
                            )}

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

                    {activeTab === 'sales' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Lead Scoring */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                    <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                                        <BrainIcon className="text-purple-500 w-4 h-4" /> Lead Scoring
                                    </h3>
                                    {!leadScore && (
                                        <button onClick={handleScoreLead} disabled={isScoring} className="text-xs font-bold text-purple-600 border border-purple-200 bg-white px-3 py-1 rounded-full hover:bg-purple-50 disabled:opacity-50">
                                            {isScoring ? 'Scoring...' : 'Score Lead'}
                                        </button>
                                    )}
                                </div>
                                {leadScore ? (
                                    <div className="p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-3xl font-extrabold text-gray-900">{leadScore.overall_score}</span>
                                                <span className="text-xs text-gray-500 ml-2">/ 100</span>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${leadScore.status_band === 'High' ? 'bg-green-100 text-green-700' : leadScore.status_band === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                {leadScore.status_band} Fit
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            {Object.entries(leadScore.fit_breakdown).map(([key, val]) => (
                                                <div key={key} className="flex items-center text-xs">
                                                    <span className="w-32 text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-purple-500 rounded-full" style={{width: `${val}%`}}></div>
                                                    </div>
                                                    <span className="w-8 text-right font-bold text-gray-700">{val}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-2 border-t border-gray-100">
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Recommended Action</p>
                                            <ul className="space-y-1">
                                                {leadScore.recommended_next_actions.map((action, i) => (
                                                    <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                                                        <span className="text-green-500 font-bold">→</span> {action}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-xs text-gray-500">
                                        Generate a score to see breakdown.
                                    </div>
                                )}
                            </div>

                            {/* Competitor Battlecard */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                    <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                                        <ShieldIcon className="text-red-500 w-4 h-4" /> Battlecard
                                    </h3>
                                    {!battlecard && (
                                        <button onClick={handleGenerateBattlecard} disabled={isGeneratingBattlecard} className="text-xs font-bold text-red-600 border border-red-200 bg-white px-3 py-1 rounded-full hover:bg-red-50 disabled:opacity-50">
                                            {isGeneratingBattlecard ? 'Analyzing...' : 'Generate'}
                                        </button>
                                    )}
                                </div>
                                {battlecard ? (
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Kill Points</h4>
                                            <ul className="space-y-1">
                                                {battlecard.competitors[0].kill_points.map((kp, i) => (
                                                    <li key={i} className="text-xs text-gray-700 bg-red-50 p-2 rounded border border-red-100 flex items-start gap-2">
                                                        <span className="text-red-500 font-bold">⚔️</span> {kp}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Objection Handling</h4>
                                            {battlecard.objection_handling.slice(0, 2).map((obj, i) => (
                                                <div key={i} className="mb-2 last:mb-0">
                                                    <p className="text-xs font-bold text-gray-800">"{obj.objection}"</p>
                                                    <p className="text-xs text-gray-600 mt-0.5 italic">{obj.counter}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-xs text-gray-500">
                                        Generate battlecard to see competitor analysis.
                                    </div>
                                )}
                            </div>

                            {/* Active Deals */}
                            {deals.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Active Deals</h3>
                                    <div className="space-y-3">
                                        {deals.map(deal => (
                                            <div key={deal.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-bold text-brand-blue">{deal.name}</p>
                                                        <p className="text-xs text-gray-500">${deal.value.toLocaleString()}</p>
                                                    </div>
                                                    {deal.aiScore !== undefined ? (
                                                         <div className={`text-center px-2 py-1 rounded ${deal.aiScore > 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            <p className="text-xs font-bold uppercase">AI Fit</p>
                                                            <p className="text-lg font-extrabold leading-none">{deal.aiScore}</p>
                                                         </div>
                                                    ) : (
                                                        <button onClick={() => handleScoreDeal(deal)} className="text-xs text-brand-orange font-bold hover:underline">Score Deal</button>
                                                    )}
                                                </div>
                                                {deal.aiReasoning && (
                                                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2 italic">
                                                        <span className="font-bold">AI:</span> {deal.aiReasoning}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="space-y-4">
                            <div className="mb-4">
                                <button 
                                    onClick={() => setIsLoggingInteraction(!isLoggingInteraction)}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold text-sm hover:border-brand-orange hover:text-brand-orange transition-colors flex items-center justify-center gap-2"
                                >
                                    {isLoggingInteraction ? 'Cancel' : '+ Log Interaction'}
                                </button>
                                
                                {isLoggingInteraction && (
                                    <form onSubmit={handleLogInteraction} className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Type</label>
                                                <select 
                                                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                                                    value={interactionForm.type}
                                                    onChange={e => setInteractionForm({...interactionForm, type: e.target.value as any})}
                                                >
                                                    <option value="email">Email</option>
                                                    <option value="call">Call</option>
                                                    <option value="meeting">Meeting</option>
                                                    <option value="note">Note</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Sentiment</label>
                                                <select 
                                                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                                                    value={interactionForm.sentiment}
                                                    onChange={e => setInteractionForm({...interactionForm, sentiment: e.target.value as any})}
                                                >
                                                    <option value="Positive">Positive</option>
                                                    <option value="Neutral">Neutral</option>
                                                    <option value="Negative">Negative</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Summary</label>
                                            <textarea 
                                                className="w-full p-2 text-sm border border-gray-300 rounded-md"
                                                rows={3}
                                                placeholder="What happened?"
                                                value={interactionForm.summary}
                                                onChange={e => setInteractionForm({...interactionForm, summary: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="w-full bg-brand-blue text-white font-bold py-2 rounded-lg text-sm hover:bg-opacity-90">
                                            Save Interaction
                                        </button>
                                    </form>
                                )}
                            </div>

                            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                {interactions.map(item => (
                                    <div key={item.id} className="relative pl-8 animate-fade-in-up group">
                                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
                                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-bold text-gray-700 capitalize">{item.type}</span>
                                                <span className="text-gray-400">{item.date}</span>
                                            </div>
                                            <p className="text-sm text-gray-800">{item.summary}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                {item.sentiment && (
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.sentiment === 'Positive' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                        {item.sentiment}
                                                    </span>
                                                )}
                                                <button 
                                                    onClick={() => createTaskFromInteraction(item.summary)}
                                                    className="text-[10px] font-bold text-brand-orange hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    + Create Task
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <input 
                                    value={newTaskTitle}
                                    onChange={e => setNewTaskTitle(e.target.value)}
                                    placeholder="New task..." 
                                    className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                />
                                <div className="flex gap-2">
                                     <input 
                                        type="date"
                                        value={newTaskDate}
                                        onChange={e => setNewTaskDate(e.target.value)}
                                        className="flex-1 text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                    />
                                    <button onClick={handleAddTask} disabled={!newTaskTitle.trim()} className="bg-brand-blue text-white px-4 rounded-lg text-sm font-bold hover:bg-opacity-90 disabled:opacity-50">
                                        Add
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <input 
                                        type="checkbox" 
                                        id="set-reminder"
                                        checked={setReminder}
                                        onChange={e => setSetReminder(e.target.checked)}
                                        className="w-4 h-4 text-brand-orange focus:ring-brand-orange border-gray-300 rounded"
                                    />
                                    <label htmlFor="set-reminder" className="text-xs text-gray-600 flex items-center gap-1 cursor-pointer">
                                        <BellIcon className="w-3 h-3" /> Set Reminder
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {tasks.map(task => (
                                    <div key={task.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow group">
                                        <button 
                                            onClick={() => toggleTask(task.id, !task.completed)}
                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-gray-400'}`}
                                        >
                                            {task.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                        </button>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                    <ClockIcon className="w-3 h-3" /> {task.due}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{task.assignee}</span>
                                            </div>
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
