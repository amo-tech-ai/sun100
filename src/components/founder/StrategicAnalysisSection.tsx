
import React from 'react';
import { Brain, Loader2, Sparkles, Check, AlertCircle, Target, TrendingUp, Globe, ArrowRight, Clock } from 'lucide-react';
import { StartupStrategicAnalysis } from '../../services/ai/types';
import { ScoreRing } from '../ui/ScoreRing';
import { AIBadge } from '../ui/AIBadge';

interface StrategicAnalysisSectionProps {
    analysis: StartupStrategicAnalysis | null;
    isAnalyzing: boolean;
    onAnalyze: () => void;
}

export const StrategicAnalysisSection: React.FC<StrategicAnalysisSectionProps> = ({ 
    analysis, 
    isAnalyzing, 
    onAnalyze 
}) => {
    return (
        <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 relative overflow-hidden">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-brand-blue flex items-center gap-2">
                        <Brain className="text-brand-orange w-5 h-5" />
                        Strategic Analysis
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">AI-driven assessment of strengths, weaknesses, and market position.</p>
                </div>
                 <button 
                    onClick={onAnalyze} 
                    disabled={isAnalyzing}
                    className="text-sm bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                    {isAnalyzing ? (
                        <> <Loader2 className="w-4 h-4 animate-spin text-brand-orange" /> Calculating... </>
                    ) : (
                        <> <Sparkles className="w-4 h-4 text-purple-500" /> Run Analysis </>
                    )}
                </button>
            </div>
            
            {analysis ? (
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden animate-fade-in-up relative">
                    <div className="absolute top-4 right-4 z-10"><AIBadge /></div>
                    
                    {/* Score Header */}
                    <div className="flex items-center gap-6 p-6 bg-white border-b border-gray-200">
                        <ScoreRing score={analysis.investorReadinessScore} />
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg">Startup Viability Report</h4>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed max-w-2xl">{analysis.readinessReasoning}</p>
                            {analysis.marketTimingVerdict && (
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                                    <Clock className="w-3 h-3" /> {analysis.marketTimingVerdict}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actionable Recommendations (New Section) */}
                    {analysis.actionableRecommendations && analysis.actionableRecommendations.length > 0 && (
                        <div className="p-6 bg-orange-50/50 border-b border-gray-200">
                            <h5 className="font-bold text-sm text-orange-900 mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-brand-orange" /> Recommended Actions
                            </h5>
                            <div className="space-y-2">
                                {analysis.actionableRecommendations.map((rec, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-white p-3 rounded border border-orange-100 shadow-sm">
                                        <span className="bg-orange-100 text-brand-orange text-xs font-bold px-2 py-0.5 rounded mt-0.5 flex-shrink-0">
                                            Priority {i + 1}
                                        </span>
                                        <span className="text-sm text-gray-700">{rec}</span>
                                        <ArrowRight className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SWOT Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border-b border-gray-200">
                        {[
                            { title: 'Strengths', items: analysis.swot.strengths, color: 'text-green-600', icon: <Check className="w-3 h-3" /> },
                            { title: 'Weaknesses', items: analysis.swot.weaknesses, color: 'text-red-600', icon: <AlertCircle className="w-3 h-3" /> },
                            { title: 'Opportunities', items: analysis.swot.opportunities, color: 'text-blue-600', icon: <Target className="w-3 h-3" /> },
                            { title: 'Threats', items: analysis.swot.threats, color: 'text-orange-600', icon: <AlertCircle className="w-3 h-3" /> }
                        ].map((section, idx) => (
                            <div key={idx} className="bg-white p-6">
                                <h5 className={`text-xs font-extrabold uppercase mb-3 flex items-center gap-1.5 ${section.color}`}>
                                    {section.icon} {section.title}
                                </h5>
                                <ul className="space-y-2">
                                    {section.items.map((item, i) => (
                                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2.5">
                                            <span className="w-1 h-1 rounded-full bg-gray-300 mt-2 flex-shrink-0"></span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Market Trends & Competitors */}
                    <div className="p-6 bg-gray-50 grid md:grid-cols-2 gap-8">
                        <div>
                            <h5 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-gray-400"/> Live Market Trends
                            </h5>
                            <ul className="space-y-2">
                                {analysis.marketTrends.map((trend, i) => (
                                    <li key={i} className="text-xs text-gray-700 bg-white px-3 py-2 rounded border border-gray-200 shadow-sm flex items-center gap-2">
                                        <span className="text-brand-orange">🔥</span> {trend}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gray-400"/> Key Competitors
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {analysis.keyCompetitors.map((comp, i) => (
                                    <span key={i} className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
                                        {comp}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                !isAnalyzing && (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
                            <Brain className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-gray-900 font-medium">Ready to analyze</p>
                        <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
                            Gemini 3 will research live market data, evaluate team strength, and score startup viability based on your profile.
                        </p>
                    </div>
                )
            )}
            
            {isAnalyzing && (
                 <div className="bg-white border border-gray-200 rounded-xl p-12 text-center absolute inset-0 z-20 flex flex-col items-center justify-center bg-opacity-90 backdrop-blur-sm">
                    <Loader2 className="w-12 h-12 animate-spin text-brand-orange mb-4" />
                    <p className="text-gray-800 font-bold text-lg">Gemini 3 is thinking...</p>
                    <p className="text-gray-500 text-sm mt-2 animate-pulse">Evaluating Team, Market, Product, and Traction.</p>
                </div>
            )}
        </section>
    );
};
