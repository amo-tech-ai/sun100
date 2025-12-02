
import React from 'react';
import { DealStage } from '../../services/crmService';

interface PipelineVisualizerProps {
    pipeline: DealStage[];
    pipelineFilter: string | null;
    setPipelineFilter: (filter: string | null) => void;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ pipeline, pipelineFilter, setPipelineFilter }) => {
    const totalDeals = Math.max(pipeline.reduce((a, b) => a + b.count, 0), 1);

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Deal Pipeline</h3>
                {pipelineFilter && (
                    <button onClick={() => setPipelineFilter(null)} className="text-xs text-gray-500 hover:text-brand-orange flex items-center gap-1">
                        Clear Filter
                    </button>
                )}
            </div>
            <div className="h-12 flex rounded-lg overflow-hidden w-full cursor-pointer ring-1 ring-gray-200">
                {pipeline.map(stage => (
                    <div 
                        key={stage.id} 
                        onClick={() => setPipelineFilter(pipelineFilter === stage.name ? null : stage.name)}
                        className={`${stage.color} relative group flex items-center justify-center transition-all hover:opacity-90 ${pipelineFilter && pipelineFilter !== stage.name ? 'opacity-30 grayscale' : ''}`}
                        style={{ width: `${(stage.count / totalDeals) * 100}%`, minWidth: stage.count > 0 ? '4%' : '0%' }}
                        title={`${stage.name}: ${stage.count} deals`}
                    >
                        {stage.count > 0 && (
                            <span className="text-xs font-bold text-white drop-shadow-md">{stage.count}</span>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
                {pipeline.map(stage => (
                    <div key={stage.id} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                        <span className="text-xs text-gray-500 font-medium">{stage.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
