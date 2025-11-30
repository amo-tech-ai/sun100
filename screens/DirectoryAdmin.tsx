
import React, { useState, useEffect } from 'react';
import { getInvestors, Investor, createInvestor, updateInvestor, deleteInvestor } from '../services/vcService';
import { InvestorFormModal } from '../components/directory/InvestorFormModal';

const DirectoryAdmin: React.FC = () => {
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInvestor, setEditingInvestor] = useState<Investor | undefined>(undefined);

    const fetchInvestors = async () => {
        setLoading(true);
        const data = await getInvestors();
        setInvestors(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchInvestors();
    }, []);

    const handleCreate = async (data: Omit<Investor, 'id'>) => {
        await createInvestor(data);
        await fetchInvestors(); // Refresh list
    };

    const handleUpdate = async (data: Omit<Investor, 'id'>) => {
        if (editingInvestor) {
            await updateInvestor(editingInvestor.id, data);
            await fetchInvestors();
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this investor? This cannot be undone.")) {
            await deleteInvestor(id);
            await fetchInvestors();
        }
    };

    const openCreateModal = () => {
        setEditingInvestor(undefined);
        setIsModalOpen(true);
    };

    const openEditModal = (investor: Investor) => {
        setEditingInvestor(investor);
        setIsModalOpen(true);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#FBF8F5]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Directory Management</h1>
                    <p className="text-gray-500 text-sm">Manage investors, accelerators, and angel groups.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 shadow-md transition-transform active:scale-95"
                >
                    + Add New Investor
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading directory...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Stages</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Last Updated</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {investors.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {inv.logo_url ? (
                                                    <img src={inv.logo_url} alt="" className="w-8 h-8 object-contain rounded bg-gray-50 border border-gray-100" />
                                                ) : (
                                                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">{inv.name[0]}</div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-gray-900">{inv.name}</div>
                                                    <div className="text-xs text-gray-500">{inv.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase border border-blue-100">
                                                {inv.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {inv.stages.slice(0, 2).join(', ')}{inv.stages.length > 2 && '...'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">Today</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button 
                                                onClick={() => openEditModal(inv)}
                                                className="text-brand-blue hover:text-brand-orange font-medium text-sm transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(inv.id)}
                                                className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {investors.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No investors found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <InvestorFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingInvestor ? handleUpdate : handleCreate}
                initialData={editingInvestor}
            />
        </div>
    );
};

export default DirectoryAdmin;
