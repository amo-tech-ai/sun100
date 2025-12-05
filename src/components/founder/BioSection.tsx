import React, { useState } from 'react';
import { Wand2, Brain, Sparkles, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../../types/founder';
import { UseFounderAIReturn } from '../../hooks/useFounderAI';
import { CompletionIndicator } from '../ui/CompletionIndicator';
import { AIBadge } from '../ui/AIBadge';

interface BioSectionProps {
    profile: UserProfile;
    ai: UseFounderAIReturn;
}

export const BioSection: React.FC<BioSectionProps> = ({ profile, ai }) => {
    const [showTools, setShowTools] = useState(false);

    return (
        <div className="text-left">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-brand-blue flex items-center">
                    About
                    <CompletionIndicator filled={!!profile.bio} />
                </h3>
                <button 
                    onClick={() => setShowTools(!showTools)} 
                    className={`p-1 rounded-full transition-colors ${showTools ? 'bg-brand-orange/10 text-brand-orange' : 'text-gray-400 hover:text-brand-orange'}`}
                    title="AI Founder Tools"
                >
                    <Wand2 className="w-4 h-4" />
                </button>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>
            
            {showTools && (
                <div className="mt-4 p-4 bg-orange-50/50 border border-brand-orange/20 rounded-lg space-y-4 animate-fade-in-up">
                    <div className="flex justify-between items-center border-b border-brand-orange/10 pb-2">
                        <h4 className="font-bold text-xs text-brand-orange uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-3 h-3" /> Gemini 3 Assistant
                        </h4>
                    </div>
                    
                    {/* Bio Summarizer */}
                    <div className="space-y-2">
                        <button 
                            onClick={ai.handleSummarize} 
                            disabled={ai.isSummarizing}
                            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-brand-blue bg-white p-2 rounded border border-gray-200 hover:border-brand-orange/50 transition-all disabled:opacity-50"
                        >
                            <span className="flex items-center gap-2"><Brain className="w-4 h-4 text-purple-500"/> Summarize Bio</span>
                            {ai.isSummarizing && <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />}
                        </button>
                        {ai.summaryAndHighlights && (
                            <div className="bg-white p-3 rounded border border-gray-200 text-xs text-gray-600 space-y-2 relative shadow-sm">
                                <div className="absolute top-2 right-2"><AIBadge /></div>
                                <p className="italic pr-6">"{ai.summaryAndHighlights.summary}"</p>
                                <div className="flex flex-wrap gap-1">
                                    {ai.summaryAndHighlights.highlights.map((h, i) => (
                                        <span key={i} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">{h}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metric Extractor */}
                    <div className="space-y-2">
                        <button 
                            onClick={ai.handleExtractMetrics} 
                            disabled={ai.isExtractingMetrics}
                            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-brand-blue bg-white p-2 rounded border border-gray-200 hover:border-brand-orange/50 transition-all disabled:opacity-50"
                        >
                            <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-green-500"/> Extract Key Metrics</span>
                            {ai.isExtractingMetrics && <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />}
                        </button>
                         {ai.extractedMetrics && (
                            <div className="bg-white p-3 rounded border border-gray-200 text-xs space-y-1 relative shadow-sm">
                                 <div className="absolute top-2 right-2"><AIBadge /></div>
                                {ai.extractedMetrics.length > 0 ? ai.extractedMetrics.map((m, i) => (
                                    <div key={i} className="flex justify-between pr-6">
                                        <span className="text-gray-500">{m.label}:</span>
                                        <span className="font-bold text-gray-800">{m.value}</span>
                                    </div>
                                )) : <p className="text-gray-400 italic">No quantitative metrics found in bio.</p>}
                            </div>
                        )}
                    </div>
                    
                    {ai.error && (
                        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                            <AlertCircle className="w-3 h-3" /> {ai.error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
