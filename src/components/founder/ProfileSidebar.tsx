import React from 'react';
import { Target, Link as LinkIcon, Linkedin, Twitter } from 'lucide-react';
import { UserProfile } from '../../types/founder';
import { StartupStrategicAnalysis } from '../../services/ai/types';
import { UseFounderAIReturn } from '../../hooks/useFounderAI';
import { AIBadge } from '../ui/AIBadge';
import { BioSection } from './BioSection';

interface ProfileSidebarProps {
    profile: UserProfile;
    strength: number;
    strategicAnalysis: StartupStrategicAnalysis | null;
    ai: UseFounderAIReturn;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
    profile, 
    strength, 
    strategicAnalysis,
    ai 
}) => {
    const getScoreColorText = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center sticky top-28">
            <div className="relative inline-block mb-4">
                <img 
                    src={profile.avatarUrl} 
                    alt={profile.name} 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover" 
                />
                <div className="absolute bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <h1 className="text-3xl font-bold text-brand-blue">{profile.name}</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">{profile.title}</p>
            
            {/* Profile Strength */}
            <div className="mt-6 mb-6">
                <div className="flex justify-between text-xs font-bold uppercase text-gray-400 mb-1">
                    <span>Profile Strength</span>
                    <span>{strength}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out ${strength === 100 ? 'bg-green-500' : 'bg-brand-orange'}`} 
                        style={{ width: `${strength}%` }}
                    ></div>
                </div>
            </div>

            {/* Viability Score (AI) */}
            {strategicAnalysis && (
                <div className="mt-6 mb-2 bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-2 right-2"><AIBadge /></div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
                        <Target className="w-4 h-4 text-brand-orange" /> Viability Score
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <span className={`text-5xl font-extrabold ${getScoreColorText(strategicAnalysis.investorReadinessScore)}`}>
                            {strategicAnalysis.investorReadinessScore}
                        </span>
                        <span className="text-lg text-gray-400 font-medium">/100</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 italic opacity-75 group-hover:opacity-100 transition-opacity">AI-analyzed Investor Readiness</p>
                </div>
            )}

            <button className="mt-6 w-full bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors shadow-sm hover:shadow">
                Connect
            </button>
            
            <div className="border-t border-gray-200 my-6"></div>
            
            {/* Bio Section with AI Tools */}
            <BioSection profile={profile} ai={ai} />

            <div className="border-t border-gray-200 my-6"></div>
            <div className="flex justify-center gap-6 text-gray-400">
                <a href={profile.socials.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors"><LinkIcon className="w-5 h-5" /></a>
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors"><Linkedin className="w-5 h-5" /></a>
                <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
        </div>
    );
};
