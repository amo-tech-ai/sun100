
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { suggestNextTasks } from '../../services/ai/advisor';
import { TaskAdvisorResponse, StrategicTask, AIRecommendation } from '../../services/ai/types';

// Icons
const BrainIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 0 14.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const SparklesIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const ArrowRightIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const RefreshIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>;

const TaskItem: React.FC<{ task: StrategicTask }> = ({ task }) => (
    <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow group">
        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
        <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-800">{task.title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
        </div>
        {task.link && (
            <Link to={task.link} className="text-xs font-bold text-brand-blue hover:text-brand-orange px-3 py-1.5 bg-gray-50 rounded-md self-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Go <ArrowRightIcon className="w-3 h-3 inline ml-1" />
            </Link>
        )}
    </div>
);

const AIActionItem: React.FC<{ item: AIRecommendation, onAction: (id: string) => void }> = ({ item, onAction }) => (
    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg flex justify-between items-center">
        <div>
            <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                <SparklesIcon className="text-indigo-500" /> {item.title}
            </h4>
            <p className="text-xs text-indigo-700/80 mt-0.5">{item.description}</p>
        </div>
        <button 
            onClick={() => onAction(item.action_id)}
            className="text-xs font-bold bg-white text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap"
        >
            Run Agent
        </button>
    </div>
);

export const TaskAdvisorWidget: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<TaskAdvisorResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await suggestNextTasks();
            setData(result);
        } catch (err) {
            console.error("Advisor error:", err);
            setError("Failed to load strategic advice.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAIAction = (id: string) => {
        switch(id) {
            case 'auto-prospect':
                navigate('/dashboard/prospecting', { state: { autoRun: true } });
                break;
            case 'generate-battlecard':
                navigate('/dashboard/crm', { state: { action: 'generate-battlecard' } });
                break;
            case 'generate-update':
                navigate('/dashboard/investor-docs/new', { state: { docType: 'update' } });
                break;
            case 'analyze-deck':
                navigate('/pitch-decks');
                break;
            default:
                console.log("Unknown action", id);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-brand-blue flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gray-200 animate-pulse"></div>
                        Strategic Advisor
                    </h3>
                </div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                    <div className="h-12 bg-gray-50 rounded-lg animate-pulse"></div>
                    <div className="h-12 bg-gray-50 rounded-lg animate-pulse"></div>
                    <div className="h-12 bg-gray-50 rounded-lg animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center">
                <p className="text-gray-400 mb-4">AI Advisor currently unavailable.</p>
                <button onClick={fetchData} className="text-brand-orange text-sm font-bold hover:underline">Retry</button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-brand-blue flex items-center gap-2">
                        <BrainIcon className="text-brand-orange" />
                        Strategic Advisor
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Powered by Gemini 3 Reasoning</p>
                </div>
                <button onClick={fetchData} className="text-gray-400 hover:text-brand-blue transition-colors" title="Refresh Analysis">
                    <RefreshIcon />
                </button>
            </div>

            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 mb-5">
                <p className="text-sm text-blue-900 font-medium leading-relaxed">
                    "{data.analysis_summary}"
                </p>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {data.ai_recommendations.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">One-Click Actions</h4>
                        <div className="space-y-2">
                            {data.ai_recommendations.map((item, i) => (
                                <AIActionItem key={i} item={item} onAction={handleAIAction} />
                            ))}
                        </div>
                    </div>
                )}

                {data.core_tasks.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Core Priorities</h4>
                        <div className="space-y-2">
                            {data.core_tasks.map((task, i) => (
                                <TaskItem key={i} task={task} />
                            ))}
                        </div>
                    </div>
                )}

                {data.growth_tasks.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Growth & Sales</h4>
                        <div className="space-y-2">
                            {data.growth_tasks.map((task, i) => (
                                <TaskItem key={i} task={task} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
