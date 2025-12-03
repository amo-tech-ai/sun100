import React from 'react';

const TrendIcon = ({ up }: { up: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 ${up ? 'text-emerald-600' : 'text-rose-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {up ? <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /> : <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />}
        {up ? <polyline points="17 6 23 6 23 12" /> : <polyline points="17 18 23 18 23 12" />}
    </svg>
);

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polyline points={points} fill="none" stroke={color} strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const StatCard: React.FC<{ 
    label: string; 
    value: string; 
    trend: string; 
    trendUp?: boolean; 
    sparklineData?: number[];
}> = ({ label, value, trend, trendUp = true, sparklineData = [40, 35, 50, 45, 60, 55, 70] }) => {
    const trendColor = trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50';
    const lineColor = trendUp ? '#10B981' : '#F43F5E';

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${trendColor}`}>
                    {trendUp ? '+' : ''}{trend}
                </span>
            </div>
            
            <div className="mb-4">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
            </div>

            <div className="h-8 w-full mt-auto opacity-80">
                <Sparkline data={sparklineData} color={lineColor} />
            </div>
        </div>
    );
};