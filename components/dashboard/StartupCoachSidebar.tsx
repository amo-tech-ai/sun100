
import React, { useState, useEffect } from 'react';
import { getCachedInsights, generateInsights, CoachResponse } from '../../services/coachService';
import { CDPIcons } from '../crm/CRMIcons';

const RobotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>; // Placeholder

export const StartupCoachSidebar: React.FC = () => {
    const [data, setData] = useState<CoachResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const cached = await getCachedInsights();
            if (cached) setData(cached);
            setLoading(false);
        };
        load();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const fresh = await generateInsights();
            setData(fresh);
        } catch (e) {
            console.error(e);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) return <div className="p-6 animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div><div className="h-32 bg-gray-200 rounded mb-4"></div></div>;

    return (
        <div className="bg-[#FBF8F5] h-full flex flex-col border-l border-gray-200 w-full md:w-80 flex-shrink-0">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white">
                <div>
                    <h3 className="font-bold text-brand-blue flex items-center gap-2">
                        <CDPIcons.Sparkles className="text-brand-orange w-5 h-5" />
                        AI Coach
                    </h3>
                    {data?.last_updated && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            Updated {new Date(data.last_updated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    )}
                </div>
                <button 
                    onClick={handleRefresh} 
                    disabled={refreshing}
                    className="p-2 text-gray-400 hover:text-brand-blue hover:bg-gray-100 rounded-full transition-all disabled:opacity-50"
                    title="Refresh Intelligence"
                >
                    <CDPIcons.Refresh className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                
                {/* Empty State */}
                {!data && !refreshing && (
                    <div className="text-center py-8">
                        <p className="text-sm text-gray-500 mb-4">No insights generated yet.</p>
                        <button onClick={handleRefresh} className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-bold">
                            Start Analysis
                        </button>
                    </div>
                )}

                {/* Alerts Section */}
                {data?.alerts && data.alerts.length > 0 && (
                    <div className="space-y-3">
                        {data.alerts.map((alert, i) => (
                            <div key={i} className={`p-3 rounded-xl border flex gap-3 ${alert.severity === 'high' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
                                <div className={`mt-0.5 ${alert.severity === 'high' ? 'text-red-500' : 'text-orange-500'}`}>
                                    <CDPIcons.Alert className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${alert.severity === 'high' ? 'text-red-800' : 'text-orange-800'}`}>{alert.message}</p>
                                    {alert.subtext && <p className="text-xs text-gray-600 mt-0.5">{alert.subtext}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Insights Feed */}
                {data?.insights && data.insights.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Strategic Pulse</h4>
                        <div className="space-y-3">
                            {data.insights.map((insight, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                            insight.type === 'positive' ? 'bg-green-100 text-green-700' : 
                                            insight.type === 'negative' ? 'bg-red-100 text-red-700' : 
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {insight.category}
                                        </span>
                                        {insight.metric_highlight && (
                                            <span className="text-xs font-bold text-brand-blue">{insight.metric_highlight}</span>
                                        )}
                                    </div>
                                    <h5 className="font-bold text-gray-800 text-sm mb-1">{insight.title}</h5>
                                    <p className="text-xs text-gray-500 leading-relaxed">{insight.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations / Playbook */}
                {data?.recommendations && data.recommendations.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Coach's Playbook</h4>
                        <div className="space-y-2">
                            {data.recommendations.map((rec, i) => (
                                <button key={i} className="w-full text-left bg-white p-3 rounded-lg border border-gray-200 hover:border-brand-orange hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-brand-blue group-hover:text-brand-orange transition-colors">{rec.label}</span>
                                        <CDPIcons.Target className="w-4 h-4 text-gray-300 group-hover:text-brand-orange" />
                                    </div>
                                    <p className="text-xs text-gray-500 italic">"{rec.reason}"</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Match Score */}
                {data?.match_score && (
                    <div className="bg-gradient-to-r from-brand-blue to-slate-800 p-4 rounded-xl text-white flex items-center justify-between">
                        <div>
                            <p className="text-xs text-blue-200 font-bold uppercase">Venture Readiness</p>
                            <p className="text-sm text-gray-300">Based on current data</p>
                        </div>
                        <div className="text-2xl font-extrabold text-brand-mustard">{data.match_score}</div>
                    </div>
                )}
            </div>
        </div>
    );
};
