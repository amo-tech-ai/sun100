import React, { useState, useEffect } from 'react';
import { Deal, Customer, getCustomers, createDeal, updateDeal } from '../../services/crmService';
import { useToast } from '../../contexts/ToastContext';

interface DealFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    dealToEdit?: Deal;
    initialStage?: string;
}

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

export const DealFormModal: React.FC<DealFormModalProps> = ({ isOpen, onClose, onComplete, dealToEdit, initialStage }) => {
    const { success, error: toastError } = useToast();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        value: 0,
        stage: initialStage || 'Lead',
        probability: 20,
        expectedCloseDate: '',
        accountId: ''
    });

    useEffect(() => {
        if (isOpen) {
            getCustomers().then(setCustomers).catch(console.error);

            if (dealToEdit) {
                setFormData({
                    name: dealToEdit.name,
                    value: dealToEdit.value,
                    stage: dealToEdit.stage,
                    probability: dealToEdit.probability,
                    expectedCloseDate: dealToEdit.expectedCloseDate ? new Date(dealToEdit.expectedCloseDate).toISOString().slice(0, 10) : '',
                    accountId: dealToEdit.accountId || ''
                });
            } else {
                setFormData({
                    name: '',
                    value: 0,
                    stage: initialStage || 'Lead',
                    probability: 20,
                    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // +30 days
                    accountId: ''
                });
            }
        }
    }, [isOpen, dealToEdit, initialStage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.accountId) {
            toastError("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                value: formData.value,
                stage: formData.stage,
                probability: formData.probability,
                expectedCloseDate: formData.expectedCloseDate,
                accountId: formData.accountId
            };

            if (dealToEdit) {
                await updateDeal(dealToEdit.id, payload);
                success("Deal updated successfully.");
            } else {
                await createDeal(payload);
                success("Deal created successfully.");
            }
            onComplete();
            onClose();
        } catch (err) {
            console.error(err);
            toastError("Failed to save deal.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">{dealToEdit ? 'Edit Deal' : 'New Deal'}</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deal Name</label>
                        <input 
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Q4 Expansion"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Customer</label>
                        <select 
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                            value={formData.accountId}
                            onChange={e => setFormData({...formData, accountId: e.target.value})}
                            disabled={!!dealToEdit} // Usually don't change customer of existing deal
                        >
                            <option value="">Select Customer...</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value ($)</label>
                            <input 
                                type="number"
                                required
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                value={formData.value}
                                onChange={e => setFormData({...formData, value: parseFloat(e.target.value) || 0})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Probability (%)</label>
                            <input 
                                type="number"
                                min="0"
                                max="100"
                                required
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                value={formData.probability}
                                onChange={e => setFormData({...formData, probability: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stage</label>
                            <select 
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                value={formData.stage}
                                onChange={e => setFormData({...formData, stage: e.target.value})}
                            >
                                {['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expected Close</label>
                            <input 
                                type="date"
                                required
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                value={formData.expectedCloseDate}
                                onChange={e => setFormData({...formData, expectedCloseDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-2 bg-brand-orange text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (dealToEdit ? 'Update Deal' : 'Create Deal')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};