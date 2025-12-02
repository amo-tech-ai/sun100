
import React from 'react';
import { Insight } from '../../services/crmService';
import { CDPIcons } from './CRMIcons';
import { EmptyState } from '../common/EmptyState';

interface CRMInsightsWidgetProps {
    insights: Insight[];
    onRefresh: () => void;
    isRefreshing: boolean;
    onAction: (insight: Insight) => void;
}

export const CRMInsightsWidget: React.FC<CRMInsightsWidgetProps> = ({ insights, onRefresh, isRefreshing, onAction }) => {
    return (
        <div id="crm-insights-widget" className="bg-white p-0 rounded-2xl border border-indigo-100 shadow-lg overflow-hidden flex flex-col h-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CDPIcons.Sparkles className="text-yellow-300 w-4 h-4" /> Gemini Insights
                </h3>
                <button 
                    onClick={onRefresh} 
                    disabled={isRefreshing} 
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all disabled:opacity-50" 
                    title="Refresh Analysis"
                >
                    <CDPIcons.Refresh className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>
            <div className="p-5 bg-indigo-50/30 space-y-4 min-h-[200px]">
                {insights.length > 0 ? insights.map(insight => (
                    <div key={insight.id} className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3 relative overflow-hidden group">
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
                            <button onClick={() => onAction(insight)} className={`self-end w-full text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 ${insight.type === 'risk' ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' : insight.type === 'opportunity' ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'}`}>
                                {insight.action.includes("Follow up") ? <CDPIcons.Mail className="w-3 h-3" /> : <CDPIcons.Target className="w-3 h-3" />} {insight.action}
                            </button>
                        )}
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center h-full py-8">
                        <EmptyState type="search" title="No insights yet" description="Add more customer data to get AI-powered recommendations." compact={true} />
                    </div>
                )}
            </div>
        </div>
    );
};
