
import React, { useState, useEffect } from 'react';
import { MetricEntry, getMetrics, saveMetric } from '../../services/metricsService';

const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

export const MetricsTable: React.FC = () => {
    const [metrics, setMetrics] = useState<MetricEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<MetricEntry>>({});

    useEffect(() => {
        loadMetrics();
    }, []);

    const loadMetrics = async () => {
        setLoading(true);
        const data = await getMetrics();
        setMetrics(data);
        setLoading(false);
    };

    const handleEdit = (metric: MetricEntry) => {
        setEditingId(metric.id);
        setEditForm(metric);
    };

    const handleAddNew = () => {
        const today = new Date();
        const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM
        
        // Check if current month already exists
        if (metrics.some(m => m.month === currentMonth)) {
            alert(`Metrics for ${currentMonth} already exist. Edit the existing entry.`);
            return;
        }

        const newEntry: MetricEntry = {
            id: 'temp-new',
            month: currentMonth,
            revenue: 0,
            burn_rate: 0,
            cash_balance: 0,
            active_users: 0,
            churn_rate: 0
        };
        
        setMetrics([newEntry, ...metrics]);
        setEditingId('temp-new');
        setEditForm(newEntry);
    };

    const handleSave = async () => {
        if (!editForm.month) return;
        
        try {
            // Type assertion safe here because form is initialized with defaults
            await saveMetric(editForm as MetricEntry);
            setEditingId(null);
            await loadMetrics();
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save metrics.");
        }
    };

    const handleChange = (field: keyof MetricEntry, value: string | number) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading metrics...</div>;

    // Helper for rendering inputs
    const renderInput = (field: keyof MetricEntry, type: 'number' | 'month' = 'number', step?: string) => (
        <input
            type={type}
            className="border border-gray-300 rounded p-2 w-full text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            value={editForm[field] as string | number}
            step={step}
            onChange={e => handleChange(field, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
        />
    );

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Historical Performance</h3>
                <button 
                    onClick={handleAddNew}
                    className="text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-semibold shadow-sm"
                >
                    <PlusIcon /> Add Month
                </button>
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Month</th>
                            <th className="px-6 py-3 font-semibold">Revenue</th>
                            <th className="px-6 py-3 font-semibold">Burn Rate</th>
                            <th className="px-6 py-3 font-semibold">Cash Balance</th>
                            <th className="px-6 py-3 font-semibold">Active Users</th>
                            <th className="px-6 py-3 font-semibold">Churn %</th>
                            <th className="px-6 py-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {metrics.map((metric) => {
                            const isEditing = editingId === metric.id;
                            return (
                                <tr key={metric.id} className={`hover:bg-gray-50/50 transition-colors ${isEditing ? 'bg-orange-50/30' : ''}`}>
                                    {isEditing ? (
                                        <>
                                            <td className="px-6 py-3 w-32">{renderInput('month', 'month')}</td>
                                            <td className="px-6 py-3 w-32">{renderInput('revenue')}</td>
                                            <td className="px-6 py-3 w-32">{renderInput('burn_rate')}</td>
                                            <td className="px-6 py-3 w-32">{renderInput('cash_balance')}</td>
                                            <td className="px-6 py-3 w-24">{renderInput('active_users')}</td>
                                            <td className="px-6 py-3 w-20">{renderInput('churn_rate', 'number', '0.1')}</td>
                                            <td className="px-6 py-3 text-right">
                                                <button onClick={handleSave} className="text-green-600 hover:text-green-800 font-bold flex items-center justify-end gap-1 w-full"><SaveIcon /> Save</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 font-medium text-gray-900">{metric.month}</td>
                                            <td className={`px-6 py-4 font-semibold ${metric.revenue > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                                ${metric.revenue.toLocaleString()}
                                            </td>
                                            <td className={`px-6 py-4 font-semibold ${metric.burn_rate > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                                -${metric.burn_rate.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 font-mono">${metric.cash_balance.toLocaleString()}</td>
                                            <td className="px-6 py-4">{metric.active_users.toLocaleString()}</td>
                                            <td className="px-6 py-4">{metric.churn_rate}%</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleEdit(metric)} className="text-brand-blue hover:text-brand-orange font-medium">Edit</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Cards) */}
            <div className="md:hidden p-4 bg-gray-50 space-y-4">
                {metrics.map((metric) => {
                     const isEditing = editingId === metric.id;
                     return (
                        <div key={metric.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Month</label>
                                        {renderInput('month', 'month')}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Revenue</label>
                                            {renderInput('revenue')}
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Burn Rate</label>
                                            {renderInput('burn_rate')}
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Cash</label>
                                            {renderInput('cash_balance')}
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Users</label>
                                            {renderInput('active_users')}
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Churn %</label>
                                            {renderInput('churn_rate', 'number', '0.1')}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleSave} 
                                        className="w-full mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                                    >
                                        <SaveIcon /> Save Changes
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                                        <span className="font-bold text-lg text-gray-900">{metric.month}</span>
                                        <button onClick={() => handleEdit(metric)} className="text-gray-400 hover:text-brand-orange p-1">
                                            <EditIcon />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Revenue</p>
                                            <p className={`font-semibold text-lg ${metric.revenue > 0 ? 'text-green-600' : 'text-gray-700'}`}>${metric.revenue.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Burn Rate</p>
                                            <p className={`font-semibold text-lg ${metric.burn_rate > 0 ? 'text-red-600' : 'text-gray-700'}`}>-${metric.burn_rate.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Cash Balance</p>
                                            <p className="font-mono text-gray-700">${metric.cash_balance.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Active Users</p>
                                            <p className="font-semibold text-gray-700">{metric.active_users.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                     );
                })}
            </div>
        </div>
    );
};
