
import React from 'react';
import { Customer } from '../../services/crmService';
import { CDPIcons } from './CRMIcons';
import { HealthBadge, StatusBadge } from './CRMComponents';
import { EmptyState } from '../common/EmptyState';
import { exportToCSV } from '../../services/crm/utils';

interface CustomerTableProps {
    customers: Customer[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    minHealth: number;
    setMinHealth: (score: number) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    selectedIds: Set<string>;
    setSelectedIds: (ids: Set<string>) => void;
    onCustomerClick: (customer: Customer) => void;
    onEmailClick: (customer: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
    customers,
    searchTerm,
    setSearchTerm,
    minHealth,
    setMinHealth,
    showFilters,
    setShowFilters,
    selectedIds,
    setSelectedIds,
    onCustomerClick,
    onEmailClick
}) => {

    const handleExport = () => {
        const dataToExport = customers.map(c => ({
            Name: c.name,
            Segment: c.segment,
            Status: c.status,
            MRR: c.mrr,
            Health: c.healthScore,
            CEO: c.ceoName || '',
            News: c.latestNews || ''
        }));
        exportToCSV(dataToExport, `customers_export_${new Date().toISOString().slice(0,10)}.csv`);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === customers.length && customers.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(customers.map(c => c.id)));
        }
    };

    const toggleSelectRow = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Controls */}
            <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
                    <div className="relative w-full sm:w-64">
                        <CDPIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search customers..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleExport} className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                            <CDPIcons.Download className="w-3 h-3" /> Export
                        </button>
                        <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-2 border rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${showFilters ? 'bg-orange-50 border-brand-orange text-brand-orange' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                            <CDPIcons.Filter className="w-3 h-3" /> Filters
                        </button>
                    </div>
                </div>
                {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 animate-fade-in border-t border-gray-200 mt-2">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Min Health Score: {minHealth}</label>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={minHealth} 
                                onChange={(e) => setMinHealth(parseInt(e.target.value))} 
                                className="w-full accent-brand-orange h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-4 py-3 w-10">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange" 
                                    checked={customers.length > 0 && selectedIds.size === customers.length} 
                                    onChange={toggleSelectAll} 
                                />
                            </th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">CEO</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Health</th>
                            <th id="crm-enriched-col" className="px-6 py-3">Enriched</th>
                            <th className="px-6 py-3">MRR</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customers.length > 0 ? customers.map(c => (
                            <tr key={c.id} onClick={() => onCustomerClick(c)} className={`group hover:bg-blue-50/30 transition-colors cursor-pointer ${selectedIds.has(c.id) ? 'bg-blue-50/50' : ''}`}>
                                <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-brand-orange focus:ring-brand-orange" 
                                        checked={selectedIds.has(c.id)} 
                                        onChange={() => toggleSelectRow(c.id)} 
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-200 text-gray-600 font-bold flex items-center justify-center text-xs">{c.logo}</div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{c.name}</p>
                                            <p className="text-xs text-gray-500">{c.segment}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {c.ceoName ? (
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-900 font-medium">{c.ceoName}</span>
                                            {c.ceoLinkedin && (
                                                <a href={c.ceoLinkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                    <CDPIcons.Linkedin className="w-3 h-3"/> Profile
                                                </a>
                                            )}
                                        </div>
                                    ) : <span className="text-xs text-gray-400">--</span>}
                                </td>
                                <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                                <td className="px-6 py-4"><HealthBadge score={c.healthScore} /></td>
                                <td className="px-6 py-4 text-xs text-gray-500">{c.lastEnrichedAt || 'Never'}</td>
                                <td className="px-6 py-4 text-sm font-mono text-gray-700">${c.mrr.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); onEmailClick(c); }} className="text-gray-400 hover:text-brand-orange p-1 rounded hover:bg-gray-100 transition-colors" title="Draft Email">
                                            <CDPIcons.Mail className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={8} className="px-0 py-0">
                                    <EmptyState 
                                        type="customers" 
                                        title="No customers found" 
                                        description="Try adjusting your filters or add a new customer to get started." 
                                        compact={true} 
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
