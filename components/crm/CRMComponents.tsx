
import React from 'react';
import { CDPIcons } from './CRMIcons';

export const CrmStatCard: React.FC<{ title: string; value: string | number; trend?: string; trendUp?: boolean; icon: React.ReactNode; color?: string }> = ({ title, value, trend, trendUp, icon, color = 'blue' }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
            <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>{icon}</div>
        </div>
        <div>
            <span className="text-2xl font-extrabold text-gray-900">{value}</span>
            {trend && (
                <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{trend}</span>
                </div>
            )}
        </div>
    </div>
);

export const HealthBadge: React.FC<{ score: number }> = ({ score }) => {
    let colorClass = 'bg-red-100 text-red-700';
    let barColor = 'bg-red-500';
    if (score >= 80) {
        colorClass = 'bg-green-100 text-green-700';
        barColor = 'bg-green-500';
    } else if (score >= 50) {
        colorClass = 'bg-yellow-100 text-yellow-700';
        barColor = 'bg-yellow-500';
    }
    
    return (
        <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }}></div>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colorClass}`}>{score}</span>
        </div>
    );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles: Record<string, string> = {
        'Active': 'bg-green-50 text-green-700 border-green-200',
        'Lead': 'bg-purple-50 text-purple-700 border-purple-200',
        'Trial': 'bg-blue-50 text-blue-700 border-blue-200',
        'Churned': 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${styles[status] || styles['Churned']}`}>
            {status}
        </span>
    );
};
