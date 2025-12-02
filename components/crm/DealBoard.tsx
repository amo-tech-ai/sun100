import React, { useState, useEffect, useRef } from 'react';
import { Deal, getAllDeals, getInteractions, getCustomers, Customer, updateDeal, deleteDeal } from '../../services/crmService';
import { analyzeDealScore } from '../../services/ai/crm';
import { EmptyState } from '../common/EmptyState';
import { useToast } from '../../contexts/ToastContext';
import { DealFormModal } from './DealFormModal';

// Icons
const BrainIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const SparklesIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const PlusIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const EditIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const TrashIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;


const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];

export const DealBoard: React.FC = () => {
    const { success, error: toastError } = useToast();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [scoringDealId, setScoringDealId] = useState<string | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDeal, setEditingDeal] = useState<Deal | undefined>(undefined);
    const [targetStage, setTargetStage] = useState<string | undefined>(undefined);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [dealsData, customersData] = await Promise.all([
                getAllDeals(),
                getCustomers()
            ]);
            setDeals(dealsData);
            setCustomers(customersData);
        } catch (error) {
            console.error("Failed to load deals:", error);
            toastError("Failed to load deals.");
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, dealId: string) => {
        setDraggedDealId(dealId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", dealId); // For compatibility
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, targetStage: string) => {
        e.preventDefault();
        if (!draggedDealId) return;

        const dealToMove = deals.find(d => d.id === draggedDealId);
        if (!dealToMove || dealToMove.stage === targetStage) {
            setDraggedDealId(null);
            return;
        }

        // Optimistic Update
        const originalStage = dealToMove.stage;
        setDeals(prev => prev.map(d => d.id === draggedDealId ? { ...d, stage: targetStage } : d));
        setDraggedDealId(null);

        try {
            await updateDeal(draggedDealId, { stage: targetStage });
            success(`Deal moved to ${targetStage}`);
        } catch (err) {
            console.error("Failed to move deal:", err);
            // Revert on error
            setDeals(prev => prev.map(d => d.id === draggedDealId ? { ...d, stage: originalStage } : d));
            toastError("Failed to move deal.");
        }
    };

    const handleScoreDeal = async (deal: Deal) => {
        if (!deal.accountId) {
            toastError("Cannot score deal without an associated customer account.");
            return;
        }
        
        const customer = customers.find(c => c.id === deal.accountId);
        if (!customer) {
            toastError("Associated customer not found.");
            return;
        }

        setScoringDealId(deal.id);
        try {
            // Fetch interactions for context
            const interactions = await getInteractions(deal.accountId);
            
            // Call AI
            const result = await analyzeDealScore(deal, customer, interactions);
            
            // Update local state
            const updatedDeal = { ...deal, aiScore: result.score, aiReasoning: result.reasoning };
            setDeals(prev => prev.map(d => d.id === deal.id ? updatedDeal : d));
            
            // Persist
            await updateDeal(deal.id, { aiScore: result.score, aiReasoning: result.reasoning });
            success("Deal scored successfully.");

        } catch (error) {
            console.error("Failed to score deal:", error);
            toastError("AI scoring failed.");
        } finally {
            setScoringDealId(null);
        }
    };

    const handleDeleteDeal = async (id: string) => {
        if(!window.confirm("Are you sure you want to delete this deal?")) return;
        try {
            await deleteDeal(id);
            setDeals(prev => prev.filter(d => d.id !== id));
            success("Deal deleted.");
        } catch (e) {
            toastError("Failed to delete deal.");
        }
    };

    const openNewDealModal = (stage: string) => {
        setEditingDeal(undefined);
        setTargetStage(stage);
        setIsModalOpen(true);
    };

    const openEditDealModal = (deal: Deal) => {
        setEditingDeal(deal);
        setTargetStage(deal.stage);
        setIsModalOpen(true);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    if (loading) {
        return (
             <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-240px)] select-none items-start">
                {STAGES.map(stage => {
                    const stageDeals = deals.filter(d => d.stage === stage);
                    const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

                    return (
                        <div 
                            key={stage} 
                            className="flex-shrink-0 w-80 flex flex-col h-full bg-gray-100/50 rounded-xl border border-gray-200"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stage)}
                        >
                            {/* Column Header */}
                            <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-xl flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-700 text-sm">{stage}</h3>
                                    <p className="text-xs text-gray-500 font-medium">${stageValue.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-white text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">
                                        {stageDeals.length}
                                    </span>
                                    <button onClick={() => openNewDealModal(stage)} className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors" title="Add Deal">
                                        <PlusIcon />
                                    </button>
                                </div>
                            </div>

                            {/* Drop Zone / List */}
                            <div className="flex-1 p-2 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                                {stageDeals.map(deal => (
                                    <div 
                                        key={deal.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, deal.id)}
                                        onClick={() => openEditDealModal(deal)}
                                        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-brand-orange/30 transition-all group cursor-grab active:cursor-grabbing relative ${draggedDealId === deal.id ? 'opacity-50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-brand-blue text-sm line-clamp-1">{deal.name}</h4>
                                            <span className="text-xs font-bold text-gray-600">${deal.value.toLocaleString()}</span>
                                        </div>
                                        
                                        <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                            {deal.customerName || 'Unknown Customer'}
                                        </p>

                                        {/* Probability Bar */}
                                        <div className="mb-3">
                                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                                <span>Probability</span>
                                                <span>{deal.probability}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${deal.probability >= 80 ? 'bg-green-500' : deal.probability >= 50 ? 'bg-yellow-500' : 'bg-gray-400'}`} 
                                                    style={{ width: `${deal.probability}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                            {deal.aiScore !== undefined && deal.aiScore !== null ? (
                                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded border ${getScoreColor(deal.aiScore)}`} title={deal.aiReasoning}>
                                                    <BrainIcon className="w-3 h-3" />
                                                    <span className="text-xs font-extrabold">{deal.aiScore}</span>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleScoreDeal(deal); }}
                                                    disabled={scoringDealId === deal.id}
                                                    className="text-xs font-bold text-brand-orange flex items-center gap-1 hover:bg-orange-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                                                >
                                                    {scoringDealId === deal.id ? (
                                                        <span className="animate-pulse">Scoring...</span>
                                                    ) : (
                                                        <>
                                                            <SparklesIcon className="w-3 h-3" /> Score
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(deal.expectedCloseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        
                                        {deal.aiReasoning && (
                                            <p className="text-[10px] text-gray-500 mt-2 bg-gray-50 p-1.5 rounded border border-gray-100 italic line-clamp-2">
                                                "{deal.aiReasoning}"
                                            </p>
                                        )}

                                        {/* Hover Actions */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white rounded shadow-sm border border-gray-100">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); openEditDealModal(deal); }} 
                                                className="p-1 text-gray-400 hover:text-brand-blue"
                                            >
                                                <EditIcon />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteDeal(deal.id); }} 
                                                className="p-1 text-gray-400 hover:text-red-500"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {stageDeals.length === 0 && (
                                    <div className="h-full flex items-center justify-center min-h-[100px]">
                                        <EmptyState 
                                            type="deals"
                                            title=""
                                            description="No deals"
                                            compact={true}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <DealFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onComplete={loadData} 
                dealToEdit={editingDeal} 
                initialStage={targetStage}
            />
        </>
    );
};