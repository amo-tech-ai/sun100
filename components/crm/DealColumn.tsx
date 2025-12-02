
import React from 'react';
import { Deal } from '../../services/crmService';
import { DealCard } from './DealCard';
import { EmptyState } from '../common/EmptyState';
import { CDPIcons } from './CRMIcons';

interface DealColumnProps {
    stage: string;
    deals: Deal[];
    scoringDealId: string | null;
    draggedDealId: string | null;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, stage: string) => void;
    onEditDeal: (deal: Deal) => void;
    onDeleteDeal: (id: string) => void;
    onScoreDeal: (deal: Deal) => void;
    onNewDeal: (stage: string) => void;
}

export const DealColumn: React.FC<DealColumnProps> = ({
    stage,
    deals,
    scoringDealId,
    draggedDealId,
    onDragStart,
    onDragOver,
    onDrop,
    onEditDeal,
    onDeleteDeal,
    onScoreDeal,
    onNewDeal
}) => {
    const stageValue = deals.reduce((sum, d) => sum + d.value, 0);

    return (
        <div 
            className="flex-shrink-0 w-80 flex flex-col h-full bg-gray-100/50 rounded-xl border border-gray-200"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, stage)}
        >
            {/* Column Header */}
            <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-xl flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-700 text-sm">{stage}</h3>
                    <p className="text-xs text-gray-500 font-medium">${stageValue.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-white text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">
                        {deals.length}
                    </span>
                    <button onClick={() => onNewDeal(stage)} className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors" title="Add Deal">
                        <CDPIcons.Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Drop Zone / List */}
            <div className="flex-1 p-2 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                {deals.map(deal => (
                    <DealCard 
                        key={deal.id}
                        deal={deal}
                        isScoring={scoringDealId === deal.id}
                        isDragged={draggedDealId === deal.id}
                        onDragStart={onDragStart}
                        onEdit={onEditDeal}
                        onDelete={onDeleteDeal}
                        onScore={onScoreDeal}
                    />
                ))}
                {deals.length === 0 && (
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
};
