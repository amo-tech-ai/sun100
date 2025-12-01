
import React, { useState, useEffect } from 'react';
import { Customer } from '../../services/crmService';

interface CustomerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (customer: Omit<Customer, 'id' | 'lastInteraction' | 'owner' | 'healthScore'>) => Promise<void>;
    initialData?: Customer;
}

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        segment: initialData?.segment || 'SMB',
        status: initialData?.status || 'Active',
        mrr: initialData?.mrr || 0,
        renewalDate: initialData?.renewalDate || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData as any);
            onClose();
            // Reset if creating new
            if (!initialData) {
                setFormData({ name: '', segment: 'SMB', status: 'Active', mrr: 0, renewalDate: '' });
            }
        } catch (error) {
            console.error("Form error:", error);
            alert("Failed to save customer.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">
                        {initialData ? 'Edit Customer' : 'New Customer'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company Name</label>
                        <input 
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Segment</label>
                            <select 
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                value={formData.segment}
                                onChange={e => setFormData({...formData, segment: e.target.value as any})}
                            >
                                <option value="SMB">SMB</option>
                                <option value="Mid-Market">Mid-Market</option>
                                <option value="Enterprise">Enterprise</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                            <select 
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value as any})}
                            >
                                <option value="Active">Active</option>
                                <option value="Lead">Lead</option>
                                <option value="Trial">Trial</option>
                                <option value="Churned">Churned</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monthly Revenue ($)</label>
                        <input 
                            type="number"
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                            value={formData.mrr}
                            onChange={e => setFormData({...formData, mrr: parseFloat(e.target.value) || 0})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Renewal Date</label>
                        <input 
                            type="date"
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                            value={formData.renewalDate}
                            onChange={e => setFormData({...formData, renewalDate: e.target.value})}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-2 bg-brand-orange text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};