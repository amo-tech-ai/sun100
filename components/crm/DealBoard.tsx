
import React, { useState, useEffect } from 'react';
import { Deal, getAllDeals, getInteractions, getCustomers, Customer, updateDeal, deleteDeal } from '../../services/crmService';
import { analyzeDealScore } from '../../services/ai/crm';
import { useToast } from '../../contexts/ToastContext';
import { DealFormModal } from './DealFormModal';
import { DealColumn } from './DealColumn';

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
                {STAGES.map(stage => (
                    <DealColumn 
                        key={stage}
                        stage={stage}
                        deals={deals.filter(d => d.stage === stage)}
                        scoringDealId={scoringDealId}
                        draggedDealId={draggedDealId}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onEditDeal={openEditDealModal}
                        onDeleteDeal={handleDeleteDeal}
                        onScoreDeal={handleScoreDeal}
                        onNewDeal={openNewDealModal}
                    />
                ))}
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
