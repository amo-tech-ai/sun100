
import React, { useMemo } from 'react';
import { useStartup } from '../../hooks/useStartup';
import { Link } from 'react-router-dom';

const Wand2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

export const StartupHealthDonut: React.FC = () => {
    const { profile } = useStartup();

    const healthStats = useMemo(() => {
        // Define scoring criteria
        const textFields = [profile.name, profile.tagline, profile.description, profile.industry, profile.location, profile.stage, profile.fundingAsk].filter(val => val && val.trim().length > 0);
        const assets = [profile.logoUrl, profile.coverImageUrl].filter(val => val && val.trim().length > 0 && !val.includes('placeholder'));
        
        // Weights
        const textScore = (textFields.length / 7) * 70; // 70% for text data
        const assetScore = (assets.length / 2) * 30;    // 30% for visual assets
        
        const totalScore = Math.round(textScore + assetScore);
        
        return {
            score: totalScore,
            brandScore: Math.round((textFields.length / 7) * 100),
            visualScore: Math.round((assets.length / 2) * 100)
        };
    }, [profile]);

    const getColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-brand-orange';
        return 'text-red-500';
    };

    const getBarColor = (score: number) => {
        if (score >= 80) return 'bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
        if (score >= 50) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
        return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-brand-blue">Startup Health</h3>
                <Link to="/dashboard/startup-wizard" className="text-xs font-semibold text-brand-orange hover:underline transition-colors">Improve Score</Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 flex-1">
                <div className="relative w-36 h-36 flex-shrink-0 mx-auto sm:mx-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Background Circle */}
                        <path
                            className="text-gray-100"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        {/* Progress Circle */}
                        <path
                            className={`${getColor(healthStats.score)} drop-shadow-sm transition-all duration-1000 ease-out`}
                            strokeDasharray={`${healthStats.score}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-extrabold ${getColor(healthStats.score)}`}>{healthStats.score}%</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Ready</span>
                    </div>
                </div>
                
                <div className="flex-1 space-y-5 w-full">
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-gray-500">Profile Data</span>
                            <span className="text-brand-blue">{healthStats.brandScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className={`h-2 rounded-full transition-all duration-1000 ${getBarColor(healthStats.brandScore)}`} style={{width: `${healthStats.brandScore}%`}}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-gray-500">Visual Assets</span>
                            <span className="text-brand-blue">{healthStats.visualScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                             <div className={`h-2 rounded-full transition-all duration-1000 ${getBarColor(healthStats.visualScore)}`} style={{width: `${healthStats.visualScore}%`}}></div>
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
                        <span className="font-bold text-blue-700">AI Tip:</span> 
                        {healthStats.visualScore < 100 
                            ? " Uploading a logo and cover image increases investor trust by 40%." 
                            : " Great profile! Now generate a pitch deck to boost your traction score."}
                    </p>
                </div>
            </div>
        </div>
    );
};
