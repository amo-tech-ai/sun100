
import React from 'react';
import { Deal } from '../../services/crmService';
import { CDPIcons } from './CRMIcons';

interface DealCardProps {
    deal: Deal;
    isScoring: boolean;
    isDragged: boolean;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onEdit: (deal: Deal) => void;
    onDelete: (id: string) => void;
    onScore: (deal: Deal) => void;
}

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
};

export const DealCard: React.FC<DealCardProps> = ({ 
    deal, 
    isScoring, 
    isDragged, 
    onDragStart, 
    onEdit, 
    onDelete, 
    onScore 
}) => {
    return (
        <div 
            draggable
            onDragStart={(e) => onDragStart(e, deal.id)}
            onClick={() => onEdit(deal)}
            className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-brand-orange/30 transition-all group cursor-grab active:cursor-grabbing relative ${isDragged ? 'opacity-50' : ''}`}
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
                        <CDPIcons.Brain className="w-3 h-3" />
                        <span className="text-xs font-extrabold">{deal.aiScore}</span>
                    </div>
                ) : (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onScore(deal); }}
                        disabled={isScoring}
                        className="text-xs font-bold text-brand-orange flex items-center gap-1 hover:bg-orange-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                    >
                        {isScoring ? (
                            <span className="animate-pulse">Scoring...</span>
                        ) : (
                            <>
                                <CDPIcons.Sparkles className="w-3 h-3" /> Score
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
                    onClick={(e) => { e.stopPropagation(); onEdit(deal); }} 
                    className="p-1 text-gray-400 hover:text-brand-blue"
                >
                    <CDPIcons.Edit className="w-3 h-3" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(deal.id); }} 
                    className="p-1 text-gray-400 hover:text-red-500"
                >
                    <CDPIcons.Trash className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};
