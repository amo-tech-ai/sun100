
import React from 'react';
import { Task } from '../../services/crmService';
import { CDPIcons } from './CRMIcons';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
    compact?: boolean;
}

const priorityColors: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-blue-100 text-blue-700 border-blue-200',
    low: 'bg-gray-100 text-gray-600 border-gray-200'
};

const priorityDot: Record<string, string> = {
    urgent: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-blue-500',
    low: 'bg-gray-400'
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit, compact = false }) => {
    return (
        <div className={`flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow group ${task.completed ? 'opacity-75' : ''}`}>
            <button
                onClick={(e) => { e.stopPropagation(); onToggle(task.id, !task.completed); }}
                className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-brand-orange hover:bg-orange-50'}`}
            >
                {task.completed && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </button>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <p 
                        className={`text-sm font-medium cursor-pointer hover:text-brand-blue transition-colors ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
                        onClick={() => onEdit(task)}
                    >
                        {task.title}
                    </p>
                    {!compact && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="p-1 text-gray-400 hover:text-blue-500 rounded hover:bg-blue-50"><CDPIcons.Edit className="w-3.5 h-3.5"/></button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50"><CDPIcons.Trash className="w-3.5 h-3.5"/></button>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                    <div className={`flex items-center gap-1 text-[11px] ${new Date(task.due) < new Date() && !task.completed ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                        <CDPIcons.Clock className="w-3 h-3" /> 
                        <span>{task.due}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${priorityDot[task.priority] || priorityDot['medium']}`}></div>
                        <span className="text-[11px] text-gray-500 capitalize">{task.priority}</span>
                    </div>

                    {!compact && task.assignee && (
                        <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                            <CDPIcons.User className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] font-medium text-gray-600">{task.assignee}</span>
                        </div>
                    )}
                </div>
            </div>
             
            {compact && (
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="p-1 text-gray-400 hover:text-blue-500"><CDPIcons.Edit className="w-3 h-3"/></button>
                </div>
            )}
        </div>
    );
};
