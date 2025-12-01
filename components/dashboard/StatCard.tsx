
import React from 'react';
import AnimatedCounter from '../AnimatedCounter';

const ArrowUpRightIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>;

export const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; suffix?: string; trend?: string; trendUp?: boolean }> = ({ icon, label, value, suffix, trend, trendUp }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-md h-full min-w-0">
        <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/5 text-brand-orange flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            {trend && (
                 <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'} flex items-center gap-1`}>
                    {trend} {trendUp ? <ArrowUpRightIcon className="w-3 h-3" /> : <ArrowUpRightIcon className="w-3 h-3 rotate-90" />}
                 </div>
            )}
        </div>
        <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-brand-blue tracking-tight truncate">
                <AnimatedCounter value={value} />{suffix}
            </p>
             <p className="text-sm font-medium text-gray-500 mt-1 truncate">{label}</p>
        </div>
    </div>
);
