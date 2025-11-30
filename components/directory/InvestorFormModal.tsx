
import React, { useState, useEffect } from 'react';
import { Investor } from '../../services/vcService';

interface InvestorFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Investor, 'id'>) => Promise<void>;
    initialData?: Investor;
}

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

export const InvestorFormModal: React.FC<InvestorFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Investor>>({
        name: '',
        type: 'vc',
        website_url: '',
        logo_url: '',
        description: '',
        stages: [],
        specialties: [],
        geographies: [],
        min_check_size: 0,
        max_check_size: 0,
        equity_percent_min: 0,
        equity_percent_max: 0,
        application_link: '',
    });

    // Fields for array inputs (comma separated)
    const [stagesInput, setStagesInput] = useState('');
    const [specialtiesInput, setSpecialtiesInput] = useState('');
    const [geosInput, setGeosInput] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setStagesInput(initialData.stages.join(', '));
            setSpecialtiesInput(initialData.specialties.join(', '));
            setGeosInput(initialData.geographies.join(', '));
        } else {
            // Reset for new entry
            setFormData({
                name: '',
                type: 'vc',
                website_url: '',
                logo_url: '',
                description: '',
                stages: [],
                specialties: [],
                geographies: [],
                min_check_size: 0,
                max_check_size: 0,
                equity_percent_min: 0,
                equity_percent_max: 0,
                application_link: '',
            });
            setStagesInput('');
            setSpecialtiesInput('');
            setGeosInput('');
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const processedData: any = {
            ...formData,
            stages: stagesInput.split(',').map(s => s.trim()).filter(Boolean),
            specialties: specialtiesInput.split(',').map(s => s.trim()).filter(Boolean),
            geographies: geosInput.split(',').map(s => s.trim()).filter(Boolean),
            slug: formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'investor'
        };
        
        // Ensure required arrays exist for type safety
        processedData.notable_investments = processedData.notable_investments || [];
        processedData.benefits = processedData.benefits || [];

        try {
            await onSubmit(processedData);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save investor.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">
                        {initialData ? 'Edit Investor' : 'Add New Investor'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                <input 
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                                >
                                    <option value="vc">Venture Capital</option>
                                    <option value="accelerator">Accelerator</option>
                                    <option value="angel_group">Angel Group</option>
                                    <option value="corporate_vc">Corporate VC</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                            <textarea 
                                required
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                                rows={3}
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Website URL</label>
                                <input 
                                    type="url"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    value={formData.website_url}
                                    onChange={e => setFormData({...formData, website_url: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Logo URL</label>
                                <input 
                                    type="url"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    value={formData.logo_url}
                                    onChange={e => setFormData({...formData, logo_url: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stages (comma separated)</label>
                            <input 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                placeholder="Seed, Series A, Growth"
                                value={stagesInput}
                                onChange={e => setStagesInput(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Specialties (comma separated)</label>
                            <input 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                placeholder="SaaS, AI, Fintech"
                                value={specialtiesInput}
                                onChange={e => setSpecialtiesInput(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min Check ($)</label>
                                <input 
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    value={formData.min_check_size}
                                    onChange={e => setFormData({...formData, min_check_size: parseInt(e.target.value)})}
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max Check ($)</label>
                                <input 
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    value={formData.max_check_size}
                                    onChange={e => setFormData({...formData, max_check_size: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>

                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min Equity (%)</label>
                                <input 
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    value={formData.equity_percent_min}
                                    onChange={e => setFormData({...formData, equity_percent_min: parseFloat(e.target.value)})}
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max Equity (%)</label>
                                <input 
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    value={formData.equity_percent_max}
                                    onChange={e => setFormData({...formData, equity_percent_max: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800">Cancel</button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-6 py-2 bg-brand-blue text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Investor'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
