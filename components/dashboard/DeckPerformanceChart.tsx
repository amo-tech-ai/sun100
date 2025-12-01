
import React from 'react';

export const DeckPerformanceChart: React.FC = () => {
    const data = [
        { month: 'May', slides: 8, rewrites: 12, visuals: 5 },
        { month: 'Jun', slides: 10, rewrites: 15, visuals: 8 },
        { month: 'Jul', slides: 12, rewrites: 20, visuals: 10 },
        { month: 'Aug', slides: 15, rewrites: 25, visuals: 14 },
    ];
    const maxVal = Math.max(...data.flatMap(d => [d.slides, d.rewrites, d.visuals])) * 1.2;
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-brand-blue">Deck Activity</h3>
                <div className="flex gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-orange/30"></span> Drafts</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-orange"></span> Visuals</span>
                </div>
            </div>

            <div className="flex-1 flex items-end gap-2 sm:gap-6 px-2 relative min-h-[160px]">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 pb-6">
                    {[...Array(4)].map((_, i) => (
                         <div key={i} className="border-t border-dashed border-gray-100 w-full h-px"></div>
                    ))}
                </div>

                {data.map(d => (
                    <div key={d.month} className="flex-1 flex flex-col justify-end items-center gap-2 relative z-10 group cursor-default">
                        <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                            <div className="w-3 sm:w-6 bg-brand-orange/30 rounded-t-sm transition-all duration-500 hover:opacity-80 group-hover:scale-y-105 origin-bottom" style={{ height: `${(d.slides/maxVal)*100}%` }}></div>
                            <div className="w-3 sm:w-6 bg-brand-orange rounded-t-sm transition-all duration-500 hover:opacity-80 group-hover:scale-y-105 origin-bottom shadow-[0_0_10px_rgba(232,124,77,0.2)]" style={{ height: `${(d.visuals/maxVal)*100}%` }}></div>
                        </div>
                        <p className="text-xs font-bold text-gray-400 group-hover:text-brand-blue transition-colors">{d.month}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
