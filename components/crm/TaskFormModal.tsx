
import React, { useState, useEffect } from 'react';
import { addTask, updateTask, Customer, getCustomers, getTeamMembers, TeamMember, Task } from '../../services/crmService';
import { useToast } from '../../contexts/ToastContext';

interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    initialAccountId?: string;
    taskToEdit?: Task;
}

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onComplete, initialAccountId, taskToEdit }) => {
    const { success, error: toastError } = useToast();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        due: new Date().toISOString().slice(0, 10),
        priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
        accountId: initialAccountId || '',
        assigneeId: '' 
    });
    const [notify, setNotify] = useState(true);

    useEffect(() => {
        if (isOpen) {
            // Fetch Dependencies
            if (!initialAccountId) {
                getCustomers().then(setCustomers).catch(console.error);
            } else {
                 setFormData(prev => ({ ...prev, accountId: initialAccountId }));
            }
            
            getTeamMembers().then(members => {
                setTeamMembers(members);
                // If creating new, set default assignee
                if(!taskToEdit && members.length > 0) {
                    setFormData(prev => ({...prev, assigneeId: members[0].userId}));
                }
            }).catch(console.error);

            // Populate if editing
            if (taskToEdit) {
                setFormData({
                    title: taskToEdit.title,
                    due: new Date(taskToEdit.due).toISOString().slice(0, 10),
                    priority: taskToEdit.priority,
                    accountId: taskToEdit.accountId || initialAccountId || '',
                    assigneeId: taskToEdit.assigneeId || ''
                });
            } else {
                 setFormData({
                    title: '',
                    due: new Date().toISOString().slice(0, 10),
                    priority: 'medium',
                    accountId: initialAccountId || '',
                    assigneeId: '' 
                 });
            }
        }
    }, [isOpen, initialAccountId, taskToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;
        setLoading(true);
        try {
            if (taskToEdit) {
                await updateTask(taskToEdit.id, {
                    title: formData.title,
                    due: formData.due,
                    priority: formData.priority,
                    assigneeId: formData.assigneeId,
                    accountId: formData.accountId || undefined
                });
                success("Task updated successfully");
            } else {
                await addTask({
                    title: formData.title,
                    due: formData.due,
                    priority: formData.priority,
                    completed: false,
                    assignee: teamMembers.find(m => m.userId === formData.assigneeId)?.name || 'Unknown',
                    assigneeId: formData.assigneeId,
                    accountId: formData.accountId || undefined,
                    notify: notify
                });
                success("Task created successfully");
            }
            onComplete();
            onClose();
        } catch (err) {
            console.error(err);
            toastError(taskToEdit ? "Failed to update task" : "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">{taskToEdit ? 'Edit Task' : 'New Task'}</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Task Description</label>
                        <input 
                            required
                            placeholder="e.g. Follow up on contract"
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            autoFocus
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Due Date</label>
                            <input 
                                type="date"
                                required
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                value={formData.due}
                                onChange={e => setFormData({...formData, due: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                            <select 
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                value={formData.priority}
                                onChange={e => setFormData({...formData, priority: e.target.value as any})}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assignee</label>
                         <select
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                            value={formData.assigneeId}
                            onChange={e => setFormData({...formData, assigneeId: e.target.value})}
                         >
                             {teamMembers.map(member => (
                                 <option key={member.userId} value={member.userId}>{member.name}</option>
                             ))}
                             {teamMembers.length === 0 && <option value="">Me (Default)</option>}
                         </select>
                    </div>

                    {!initialAccountId && (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Related Customer (Optional)</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                value={formData.accountId}
                                onChange={e => setFormData({...formData, accountId: e.target.value})}
                            >
                                <option value="">None</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    {!taskToEdit && (
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="notify-assignee" 
                                checked={notify} 
                                onChange={e => setNotify(e.target.checked)}
                                className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                            />
                            <label htmlFor="notify-assignee" className="text-xs text-gray-600 flex items-center gap-1 cursor-pointer select-none">
                                <BellIcon /> Notify assignee via email
                            </label>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-2 bg-brand-orange text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (taskToEdit ? 'Update Task' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
