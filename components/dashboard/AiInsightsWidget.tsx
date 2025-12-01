
import React from 'react';

const Wand2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const LightbulbIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S10 4.8 10 7c0 2 .3 3.2 1.5 4.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;
const TrendingUpIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;

export const AiInsightsWidget: React.FC = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-blue to-slate-900 p-6 rounded-2xl shadow-lg text-white group h-full border border-slate-700/50">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-orange/20 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-1000 group-hover:bg-brand-orange/30"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-mustard/10 rounded-full blur-3xl -ml-10 -mb-10 transition-all duration-1000 group-hover:bg-brand-mustard/20"></div>
        
        <h3 className="font-bold text-base mb-6 flex items-center gap-2 relative z-10">
            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                <Wand2Icon className="w-4 h-4 text-brand-mustard" />
            </div>
            <span>AI Strategic Review</span>
        </h3>
        
        <div className="space-y-3 relative z-10">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer hover:border-brand-orange/30">
                <div className="flex gap-3">
                     <div className="mt-0.5 text-brand-mustard"><LightbulbIcon className="w-4 h-4" /></div>
                     <div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            <span className="font-bold text-white block mb-1">Opportunity Detected</span>
                            25% growth in "AI Tools" interest. Update your Market slide data.
                        </p>
                     </div>
                </div>
            </div>
             <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer hover:border-green-400/30">
                <div className="flex gap-3">
                     <div className="mt-0.5 text-green-400"><TrendingUpIcon className="w-4 h-4" /></div>
                     <div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            <span className="font-bold text-white block mb-1">High Engagement</span>
                            Your "Solution" slide has 40% higher retention. Add a CTA.
                        </p>
                     </div>
                </div>
            </div>
        </div>
        
        <button className="w-full mt-6 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-colors backdrop-blur-sm">
            Generate Full Report
        </button>
    </div>
);
