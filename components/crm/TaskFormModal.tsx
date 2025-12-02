
import React, { useState, useEffect } from 'react';
import { addTask, Customer, getCustomers } from '../../services/crmService';
import { useToast } from '../../contexts/ToastContext';

interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    initialAccountId?: string;
}

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onComplete, initialAccountId }) => {
    const { success, error: toastError } = useToast();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        due: new Date().toISOString().slice(0, 10),
        accountId: initialAccountId || '',
        assignee: 'Me' // Simplified for now, ideally map to user ID
    });

    useEffect(() => {
        if (isOpen && !initialAccountId) {
            // Fetch customers for dropdown if not pre-selected
            getCustomers().then(setCustomers).catch(console.error);
        }
        if (isOpen && initialAccountId) {
             setFormData(prev => ({ ...prev, accountId: initialAccountId }));
        }
    }, [isOpen, initialAccountId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;
        setLoading(true);
        try {
            await addTask({
                title: formData.title,
                due: formData.due,
                completed: false,
                assignee: formData.assignee,
                accountId: formData.accountId || undefined
            });
            success("Task created successfully");
            onComplete();
            onClose();
            setFormData({ title: '', due: new Date().toISOString().slice(0, 10), accountId: '', assignee: 'Me' });
        } catch (err) {
            console.error(err);
            toastError("Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">New Task</h2>
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
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assignee</label>
                             <select
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                value={formData.assignee}
                                onChange={e => setFormData({...formData, assignee: e.target.value})}
                             >
                                 <option value="Me">Me</option>
                                 {/* Future: Map team members */}
                             </select>
                        </div>
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

                    <div className="pt-4 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-2 bg-brand-orange text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
