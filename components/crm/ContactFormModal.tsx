
import React, { useState, useEffect } from 'react';
import { Contact } from '../../services/crmService';

interface ContactFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (contact: Omit<Contact, 'id'>) => Promise<void>;
    initialAccountId: string;
    contactToEdit?: Contact;
}

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

export const ContactFormModal: React.FC<ContactFormModalProps> = ({ isOpen, onClose, onSubmit, initialAccountId, contactToEdit }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        linkedin: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (contactToEdit) {
                setFormData({
                    firstName: contactToEdit.firstName,
                    lastName: contactToEdit.lastName,
                    email: contactToEdit.email,
                    role: contactToEdit.role,
                    linkedin: contactToEdit.linkedin || ''
                });
            } else {
                setFormData({ firstName: '', lastName: '', email: '', role: '', linkedin: '' });
            }
        }
    }, [isOpen, contactToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                accountId: initialAccountId,
                ...formData
            });
            onClose();
        } catch (error) {
            console.error("Contact save error:", error);
            alert("Failed to save contact.");
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
                        {contactToEdit ? 'Edit Contact' : 'New Contact'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
                            <input 
                                required
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                value={formData.firstName}
                                onChange={e => setFormData({...formData, firstName: e.target.value})}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
                            <input 
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                value={formData.lastName}
                                onChange={e => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                        <input 
                            type="email"
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                            <input 
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                                placeholder="e.g. CTO"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">LinkedIn URL</label>
                            <input 
                                type="url"
                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                                value={formData.linkedin}
                                onChange={e => setFormData({...formData, linkedin: e.target.value})}
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
                            {loading ? 'Saving...' : 'Save Contact'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
