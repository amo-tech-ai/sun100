
import React from 'react';
import { Presentation, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { DeckStrategy } from '../../services/ai/types';
import { AIBadge } from '../../src/components/ui/AIBadge';

interface DeckStrategySectionProps {
    strategy: DeckStrategy | null;
    isAnalyzing: boolean;
    onAnalyze: () => void;
}

export const DeckStrategySection: React.FC<DeckStrategySectionProps> = ({ 
    strategy, 
    isAnalyzing, 
    onAnalyze 
}) => {
    return (
        <section className="bg-indigo-50 p-8 rounded-lg border border-indigo-100 relative overflow-hidden">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                        <Presentation className="text-indigo-500 w-5 h-5" />
                        Pitch Deck Strategy
                    </h3>
                    <p className="text-xs text-indigo-600/80 mt-1">AI recommendation on your most impactful slides.</p>
                </div>
                 <button 
                    onClick={onAnalyze} 
                    disabled={isAnalyzing}
                    className="text-sm bg-white border border-indigo-200 text-indigo-700 font-semibold py-2 px-4 rounded-lg hover:bg-white/80 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                    {isAnalyzing ? (
                        <> <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> Analyzing... </>
                    ) : (
                        <> <Sparkles className="w-4 h-4 text-indigo-500" /> Suggest Focus </>
                    )}
                </button>
            </div>
            
            {strategy ? (
                <div className="bg-white rounded-xl border border-indigo-100 overflow-hidden animate-fade-in-up relative p-6">
                    <div className="absolute top-4 right-4 z-10"><AIBadge /></div>
                    
                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Recommended Narrative Arc</h4>
                        <p className="text-indigo-900 font-medium italic text-sm leading-relaxed">"{strategy.narrativeArc}"</p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Top 3 Key Slides</h4>
                        <div className="grid gap-4">
                            {strategy.topSlides.map((slide, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                                            {slide.title} <span className="text-xs font-normal text-gray-500 bg-white border px-2 rounded-full">{slide.slideType}</span>
                                        </h5>
                                        <p className="text-xs text-gray-600 mb-2">{slide.reason}</p>
                                        <div className="text-xs text-indigo-700 bg-indigo-50/50 p-2 rounded flex items-start gap-2">
                                            <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                            <span>{slide.contentFocus}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                !isAnalyzing && (
                    <div className="text-center py-8">
                        <p className="text-indigo-400 text-sm">No strategy generated yet. Click button to start.</p>
                    </div>
                )
            )}
        </section>
    );
};
