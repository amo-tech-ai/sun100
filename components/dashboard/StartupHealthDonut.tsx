
import React from 'react';

const Wand2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

export const StartupHealthDonut: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-brand-blue">Startup Health</h3>
                <button className="text-xs font-semibold text-brand-orange hover:underline transition-colors">View Report</button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 flex-1">
                <div className="relative w-36 h-36 flex-shrink-0 mx-auto sm:mx-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Background Circle */}
                        <path
                            className="text-gray-50"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        {/* Progress Circle */}
                        <path
                            className="text-brand-orange drop-shadow-sm"
                            strokeDasharray="75, 100"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-brand-blue">75%</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Score</span>
                    </div>
                </div>
                
                <div className="flex-1 space-y-5 w-full">
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-gray-500">Brand Story</span>
                            <span className="text-brand-blue">80/100</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{width: '80%'}}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-gray-500">Traction</span>
                            <span className="text-brand-blue">40/100</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                             <div className="bg-amber-500 h-2 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]" style={{width: '40%'}}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50">
                <div className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    <div className="bg-white p-1 rounded-full shadow-sm text-blue-600 mt-0.5">
                        <Wand2Icon className="w-3 h-3" />
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        <span className="font-bold text-blue-700">AI Tip:</span> Add 'Monthly Active Users' to boost your Traction score.
                    </p>
                </div>
            </div>
        </div>
    );
};
