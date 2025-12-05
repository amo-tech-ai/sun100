
import React from 'react';
import { Brain, Loader2, Sparkles, Check, AlertCircle, Target, TrendingUp, Globe, ArrowRight, Clock, Zap } from 'lucide-react';
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
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 relative overflow-hidden">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-brand-blue flex items-center gap-2">
                        <Brain className="text-brand-orange w-5 h-5" />
                        Strategic Analysis
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Deep-dive assessment of your startup's investor readiness.</p>
                </div>
                 {!analysis && (
                     <button 
                        onClick={onAnalyze} 
                        disabled={isAnalyzing}
                        className="text-sm bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                    >
                        {isAnalyzing ? (
                            <> <Loader2 className="w-4 h-4 animate-spin text-brand-orange" /> Evaluating... </>
                        ) : (
                            <> <Sparkles className="w-4 h-4 text-purple-500" /> Analyze Startup </>
                        )}
                    </button>
                 )}
                 {analysis && (
                     <button 
                        onClick={onAnalyze} 
                        disabled={isAnalyzing}
                        className="text-xs text-gray-400 hover:text-brand-orange flex items-center gap-1 transition-colors"
                    >
                        <Zap className="w-3 h-3" /> Refresh Analysis
                    </button>
                 )}
            </div>
            
            {analysis ? (
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden animate-fade-in-up relative">
                    <div className="absolute top-4 right-4 z-10"><AIBadge /></div>
                    
                    {/* Score Header */}
                    <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-white border-b border-gray-200">
                        <div className="flex flex-col items-center">
                             <ScoreRing score={analysis.investorReadinessScore} size="large" />
                             <span className="text-xs font-bold text-gray-400 uppercase mt-2 tracking-wider">Readiness</span>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="font-bold text-gray-900 text-xl mb-2">Executive Summary</h4>
                            <p className="text-gray-700 leading-relaxed text-base">{analysis.readinessReasoning}</p>
                            {analysis.marketTimingVerdict && (
                                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-semibold border border-blue-100">
                                    <Clock className="w-4 h-4 text-blue-600" /> 
                                    <span>Market Timing: {analysis.marketTimingVerdict}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actionable Recommendations */}
                    {analysis.actionableRecommendations && analysis.actionableRecommendations.length > 0 && (
                        <div className="p-6 bg-orange-50/30 border-b border-gray-200">
                            <h5 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <Target className="w-4 h-4 text-brand-orange" /> Key Recommendations
                            </h5>
                            <div className="grid gap-3">
                                {analysis.actionableRecommendations.map((rec, i) => (
                                    <div key={i} className="flex items-start gap-4 bg-white p-4 rounded-lg border border-orange-100/50 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col gap-2 min-w-[80px] pt-1">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded text-center border ${getPriorityColor(rec.priority)}`}>
                                                {rec.priority}
                                            </span>
                                            <span className="text-[10px] font-semibold text-gray-400 text-center uppercase tracking-wide">{rec.category}</span>
                                        </div>
                                        <div>
                                            <h6 className="text-sm font-bold text-gray-900 mb-1">{rec.title}</h6>
                                            <p className="text-sm text-gray-600 leading-relaxed">{rec.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SWOT Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border-b border-gray-200">
                        {[
                            { title: 'Strengths', items: analysis.swot.strengths, color: 'text-green-700', bg: 'bg-green-50/30', icon: <Check className="w-4 h-4" /> },
                            { title: 'Weaknesses', items: analysis.swot.weaknesses, color: 'text-red-700', bg: 'bg-red-50/30', icon: <AlertCircle className="w-4 h-4" /> },
                            { title: 'Opportunities', items: analysis.swot.opportunities, color: 'text-blue-700', bg: 'bg-blue-50/30', icon: <Target className="w-4 h-4" /> },
                            { title: 'Threats', items: analysis.swot.threats, color: 'text-orange-700', bg: 'bg-orange-50/30', icon: <AlertCircle className="w-4 h-4" /> }
                        ].map((section, idx) => (
                            <div key={idx} className={`p-6 bg-white hover:${section.bg} transition-colors`}>
                                <h5 className={`text-xs font-extrabold uppercase mb-4 flex items-center gap-2 ${section.color}`}>
                                    {section.icon} {section.title}
                                </h5>
                                <ul className="space-y-3">
                                    {section.items.map((item, i) => (
                                        <li key={i} className="text-sm text-gray-700 flex items-start gap-3 leading-snug">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"></span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Market Trends & Competitors */}
                    <div className="p-6 bg-gray-50 grid md:grid-cols-2 gap-8">
                        <div>
                            <h5 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                                <TrendingUp className="w-4 h-4 text-gray-400"/> Market Trends
                            </h5>
                            <ul className="space-y-2">
                                {analysis.marketTrends.map((trend, i) => (
                                    <li key={i} className="text-sm text-gray-700 bg-white px-3 py-2 rounded border border-gray-200 shadow-sm flex items-center gap-2">
                                        <span className="text-brand-orange">🔥</span> {trend}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                                <Globe className="w-4 h-4 text-gray-400"/> Competitive Landscape
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
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 text-brand-orange">
                            <Brain className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Ready for Strategic Assessment</h4>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                            Gemini 3 will analyze your profile, bio, traction, and market fit to provide a VC-style due diligence report.
                        </p>
                    </div>
                )
            )}
            
            {isAnalyzing && (
                 <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-12 text-center absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity">
                    <Loader2 className="w-12 h-12 animate-spin text-brand-orange mb-4" />
                    <p className="text-gray-800 font-bold text-lg">Gemini 3 is reasoning...</p>
                    <p className="text-gray-500 text-sm mt-2 animate-pulse">Evaluating founder-market fit, competitive moats, and growth vectors.</p>
                </div>
            )}
        </section>
    );
};
