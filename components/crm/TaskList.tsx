
import React, { useState, useMemo } from 'react';
import { Task } from '../../services/crmService';
import { TaskItem } from './TaskItem';
import { EmptyState } from '../common/EmptyState';
import { CDPIcons } from './CRMIcons';

interface TaskListProps {
    tasks: Task[];
    onAddTask: () => void;
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
    compact?: boolean;
    title?: string;
}

type SortMode = 'due' | 'priority';
type FilterMode = 'all' | 'active' | 'completed';

export const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask, onToggle, onDelete, onEdit, compact = false, title = 'Tasks' }) => {
    const [filterMode, setFilterMode] = useState<FilterMode>('active');
    const [sortMode, setSortMode] = useState<SortMode>('due');
    const [showFilters, setShowFilters] = useState(false);

    const processedTasks = useMemo(() => {
        let filtered = tasks;

        // Filter Status
        if (filterMode === 'active') filtered = filtered.filter(t => !t.completed);
        if (filterMode === 'completed') filtered = filtered.filter(t => t.completed);

        // Sort
        return [...filtered].sort((a, b) => {
            if (sortMode === 'due') {
                return new Date(a.due).getTime() - new Date(b.due).getTime();
            } else {
                const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
                return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
            }
        });
    }, [tasks, filterMode, sortMode]);

    return (
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${compact ? '' : 'h-full flex flex-col'}`}>
            {/* Header */}
            <div className={`p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-3`}>
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-800">{title}</h3>
                    <button onClick={onAddTask} className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
                        <CDPIcons.Plus className="w-3 h-3" /> Add
                    </button>
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex bg-gray-200 p-0.5 rounded-lg">
                        <button 
                            onClick={() => setFilterMode('active')}
                            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${filterMode === 'active' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Active
                        </button>
                         <button 
                            onClick={() => setFilterMode('all')}
                            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${filterMode === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            All
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => setShowFilters(!showFilters)} 
                        className={`p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 ${showFilters ? 'text-brand-orange bg-orange-50' : ''}`}
                        title="Sort & Filter"
                    >
                        <CDPIcons.Target className="w-4 h-4" />
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-2 gap-2 pt-1 animate-fade-in">
                        <div>
                             <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Sort By</label>
                             <select 
                                value={sortMode} 
                                onChange={(e) => setSortMode(e.target.value as SortMode)}
                                className="w-full text-xs border-gray-300 rounded p-1 bg-white"
                             >
                                 <option value="due">Due Date</option>
                                 <option value="priority">Priority</option>
                             </select>
                        </div>
                    </div>
                )}
            </div>

            {/* List */}
            <div className={`p-2 space-y-2 overflow-y-auto ${compact ? '' : 'flex-1'}`}>
                {processedTasks.length > 0 ? (
                    processedTasks.map(task => (
                        <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={onToggle} 
                            onDelete={onDelete} 
                            onEdit={onEdit}
                            compact={compact}
                        />
                    ))
                ) : (
                    <div className="py-6">
                        <EmptyState 
                            type="tasks" 
                            title={filterMode === 'completed' ? "No completed tasks" : "All caught up!"} 
                            description={filterMode === 'completed' ? "" : "You have no pending tasks."} 
                            compact={true} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
