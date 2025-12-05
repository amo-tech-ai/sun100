
import React from 'react';
import { Presentation, Link as LinkIcon, Users, Sparkles, Loader2 } from 'lucide-react';
import { StartupDetails } from '../../types/founder';
import { CompletionIndicator } from '../ui/CompletionIndicator';
import { UseFounderAIReturn } from '../../hooks/useFounderAI';

interface StartupMainCardProps {
    startup: StartupDetails;
    ai: UseFounderAIReturn;
    onGenerateDeck: () => void;
}

export const StartupMainCard: React.FC<StartupMainCardProps> = ({ startup, ai, onGenerateDeck }) => {
    const { isAnalyzingMetadata, metadataAnalysis, handleAnalyzeMetadata } = ai;

    const displayIndustry = metadataAnalysis?.industry || startup.industry;
    const displayStage = metadataAnalysis?.stage || startup.stage;
    const displayModel = metadataAnalysis?.businessModel || startup.businessModel;

    return (
        <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 relative group hover:shadow-md transition-all">
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                    onClick={handleAnalyzeMetadata} 
                    disabled={isAnalyzingMetadata}
                    className="bg-white border border-gray-200 text-gray-600 text-xs font-bold py-2 px-3 rounded-full hover:bg-gray-50 hover:text-brand-orange transition-colors shadow-sm flex items-center gap-1"
                    title="Auto-classify startup details"
                >
                    {isAnalyzingMetadata ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    Auto-Tag
                </button>
                <button 
                    onClick={onGenerateDeck} 
                    className="bg-brand-blue text-white text-xs font-bold py-2 px-4 rounded-full hover:bg-opacity-90 shadow-md flex items-center gap-2 transition-transform hover:scale-105"
                >
                    <Presentation className="w-3 h-3" />
                    Generate Pitch Deck
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2">
                        {startup.logoUrl ? <img src={startup.logoUrl} alt={`${startup.name} logo`} className="w-full h-full object-contain"/> : <div className="text-2xl font-bold text-gray-300">{startup.name[0]}</div>}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-brand-blue flex items-center gap-2">
                            {startup.name}
                            <CompletionIndicator filled={!!startup.name} />
                        </h2>
                        <p className="text-gray-600 text-sm mt-1 max-w-lg leading-relaxed">{startup.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                            <span className={`bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${metadataAnalysis ? 'ring-1 ring-brand-orange/30 text-brand-blue' : ''}`}>
                                {displayIndustry}
                                <CompletionIndicator filled={!!displayIndustry} />
                            </span>
                            <span className={`bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100 text-xs font-medium flex items-center gap-1 ${metadataAnalysis ? 'ring-1 ring-brand-orange/30' : ''}`}>
                                {displayStage}
                                <CompletionIndicator filled={!!displayStage} />
                            </span>
                            <span className={`bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md border border-purple-100 text-xs font-medium flex items-center gap-1 ${metadataAnalysis ? 'ring-1 ring-brand-orange/30' : ''}`}>
                                {displayModel}
                                <CompletionIndicator filled={!!displayModel} />
                            </span>
                            <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-brand-orange font-semibold hover:underline flex items-center gap-1 text-xs ml-2">
                                <LinkIcon className="w-3 h-3" />
                                Website
                                <CompletionIndicator filled={!!startup.website} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center min-w-[140px]">
                    <p className="text-xs text-green-700 font-bold uppercase tracking-wide mb-1">Funding Ask</p>
                    <p className="text-xl font-extrabold text-green-800 flex items-center justify-center gap-1">
                        {startup.fundingGoal}
                        <CompletionIndicator filled={!!startup.fundingGoal} />
                    </p>
                </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Founding Team
                </h4>
                <div className="flex flex-wrap gap-4">
                    {startup.team.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 border-2 border-white shadow-sm">
                                {member.name[0]}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{member.name}</p>
                                <p className="text-[10px] text-gray-500 font-medium">{member.role} • {member.background}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};