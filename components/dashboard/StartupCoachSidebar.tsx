
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCachedInsights, generateInsights, trackRecommendationAction, trackInsightFeedback, getActionStatuses, CoachResponse, ActionStatus } from '../../services/coachService';
import { CDPIcons } from '../crm/CRMIcons';

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const ThumbsUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>;
const ThumbsDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>;

export const StartupCoachSidebar: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<CoachResponse | null>(null);
    const [actionStatuses, setActionStatuses] = useState<ActionStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());

    // Initial Load
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [cached, statuses] = await Promise.all([
                    getCachedInsights(),
                    getActionStatuses()
                ]);
                if (cached) setData(cached);
                setActionStatuses(statuses);
            } catch (e) {
                console.error("Failed to load coach data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Refresh Action
    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const fresh = await generateInsights();
            setData(fresh);
            setFeedbackGiven(new Set()); // Reset feedback state on refresh
        } catch (e) {
            console.error("Failed to refresh insights", e);
        } finally {
            setRefreshing(false);
        }
    };

    // Recommendation Actions
    const handleAction = async (actionId: string, status: 'completed' | 'dismissed') => {
        setActionStatuses(prev => [...prev, { action_id: actionId, status }]);
        try {
            await trackRecommendationAction(actionId, status);
        } catch (e) {
            console.error("Failed to track action", e);
        }
    };

    // Feedback Action
    const handleFeedback = async (title: string, useful: boolean) => {
        if (feedbackGiven.has(title)) return;
        setFeedbackGiven(prev => new Set(prev).add(title));
        try {
            await trackInsightFeedback(title, useful);
        } catch (e) {
            console.error("Failed to track feedback", e);
        }
    };

    // Navigation Helper
    const handleNavigate = (path?: string) => {
        if (path) navigate(path);
    };

    // Filter visible items
    const visibleRecommendations = data?.recommendations.filter(
        rec => !actionStatuses.some(s => s.action_id === rec.action_id)
    ) || [];

    const visibleAlerts = data?.alerts || [];

    if (loading && !data) return (
        <div className="p-6 animate-pulse h-full bg-[#FBF8F5] border-l border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-24 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-24 bg-gray-200 rounded-xl mb-4"></div>
        </div>
    );

    return (
        <div className="bg-[#FBF8F5] h-full flex flex-col w-full border-l border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white flex-shrink-0">
                <div>
                    <h3 className="font-bold text-brand-blue flex items-center gap-2 text-lg">
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
                    className={`p-2 text-gray-400 hover:text-brand-blue hover:bg-gray-100 rounded-full transition-all disabled:opacity-50 ${refreshing ? 'animate-spin text-brand-orange' : ''}`}
                    title="Generate New Insights"
                >
                    <CDPIcons.Refresh className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                
                {/* Empty State */}
                {!data && !refreshing && (
                    <div className="text-center py-12 px-4">
                        <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-orange">
                            <CDPIcons.Brain className="w-8 h-8" />
                        </div>
                        <h4 className="text-gray-900 font-bold mb-2">No Intelligence Yet</h4>
                        <p className="text-sm text-gray-500 mb-6">Gemini 3 needs to analyze your startup data to provide coaching.</p>
                        <button onClick={handleRefresh} className="bg-brand-orange text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-opacity-90 transition-colors shadow-lg shadow-brand-orange/20">
                            Start Analysis
                        </button>
                    </div>
                )}

                {/* Alerts Section */}
                {visibleAlerts.length > 0 && (
                    <div className="space-y-3">
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Critical Attention</h4>
                        {visibleAlerts.map((alert, i) => (
                            <div 
                                key={i} 
                                onClick={() => handleNavigate(alert.link)}
                                className={`p-4 rounded-xl border flex gap-3 shadow-sm bg-white cursor-pointer hover:shadow-md transition-all ${alert.severity === 'high' ? 'border-red-100 border-l-4 border-l-red-500' : 'border-orange-100 border-l-4 border-l-orange-500'}`}
                            >
                                <div className={`mt-0.5 flex-shrink-0 ${alert.severity === 'high' ? 'text-red-500' : 'text-orange-500'}`}>
                                    <CDPIcons.Alert className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${alert.severity === 'high' ? 'text-red-900' : 'text-orange-900'}`}>{alert.message}</p>
                                    {alert.subtext && <p className="text-xs text-gray-500 mt-1">{alert.subtext}</p>}
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
                                <div 
                                    key={i} 
                                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative"
                                >
                                    <div onClick={() => handleNavigate(insight.link)} className="cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                insight.type === 'positive' ? 'bg-green-50 text-green-700 border border-green-100' : 
                                                insight.type === 'negative' ? 'bg-red-50 text-red-700 border border-red-100' : 
                                                'bg-gray-50 text-gray-600 border border-gray-100'
                                            }`}>
                                                {insight.category}
                                            </span>
                                            {insight.metric_highlight && (
                                                <span className={`text-xs font-bold ${insight.type === 'positive' ? 'text-green-600' : 'text-brand-blue'}`}>{insight.metric_highlight}</span>
                                            )}
                                        </div>
                                        <h5 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-brand-orange transition-colors">{insight.title}</h5>
                                        <p className="text-xs text-gray-500 leading-relaxed">{insight.description}</p>
                                    </div>
                                    
                                    {/* Feedback Buttons */}
                                    <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleFeedback(insight.title, true); }}
                                            disabled={feedbackGiven.has(insight.title)}
                                            className={`p-1 rounded hover:bg-green-50 ${feedbackGiven.has(insight.title) ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}
                                            title="Helpful"
                                        >
                                            <ThumbsUpIcon />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleFeedback(insight.title, false); }}
                                            disabled={feedbackGiven.has(insight.title)}
                                            className={`p-1 rounded hover:bg-red-50 ${feedbackGiven.has(insight.title) ? 'text-gray-300' : 'text-gray-400 hover:text-red-500'}`}
                                            title="Not Helpful"
                                        >
                                            <ThumbsDownIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations / Playbook */}
                {visibleRecommendations.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Coach's Playbook</h4>
                        <div className="space-y-2">
                            {visibleRecommendations.map((rec, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-brand-orange/50 hover:shadow-md transition-all group relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <CDPIcons.Target className="w-4 h-4 text-gray-400 group-hover:text-brand-orange transition-colors" />
                                            <span className="text-sm font-bold text-brand-blue group-hover:text-brand-orange transition-colors">{rec.label}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 italic mb-3 pl-6">"{rec.reason}"</p>
                                    
                                    <div className="flex justify-end gap-2 pl-6">
                                        <button 
                                            onClick={() => handleAction(rec.action_id, 'dismissed')}
                                            className="text-gray-400 hover:text-gray-600 p-1.5 rounded hover:bg-gray-100"
                                            title="Dismiss"
                                        >
                                            <XIcon />
                                        </button>
                                        <button 
                                            onClick={() => handleAction(rec.action_id, 'completed')}
                                            className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                            title="Mark as Done"
                                        >
                                            <CheckCircleIcon /> Done
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Empty Recommendations State */}
                {data && visibleRecommendations.length === 0 && data.recommendations.length > 0 && (
                     <div className="text-center py-6 bg-green-50/50 rounded-xl border border-dashed border-green-200">
                        <div className="inline-block p-2 bg-green-100 rounded-full text-green-600 mb-2"><CheckCircleIcon /></div>
                        <p className="text-xs font-bold text-green-800">All Caught Up!</p>
                        <p className="text-[10px] text-green-600">You've completed all recommendations.</p>
                     </div>
                )}

                {/* Match Score */}
                {data?.match_score && (
                    <div className="bg-gradient-to-br from-brand-blue to-slate-900 p-5 rounded-xl text-white flex items-center justify-between shadow-lg">
                        <div>
                            <p className="text-xs text-blue-200 font-bold uppercase tracking-wide">Investor Readiness</p>
                            <p className="text-[10px] text-gray-400 mt-1">Based on current traction & assets</p>
                        </div>
                        <div className="text-3xl font-extrabold text-brand-mustard">{data.match_score}</div>
                    </div>
                )}
            </div>
        </div>
    );
};
