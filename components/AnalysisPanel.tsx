import React from 'react';
import { SlideAnalysis } from '../services/geminiService';

interface AnalysisPanelProps {
    onAnalyze: () => void;
    isLoading: boolean;
    analysis: SlideAnalysis | null;
}

const ratingStyles: { [key: string]: string } = {
    "Good": 'text-green-600 font-semibold',
    "Average": 'text-yellow-600 font-semibold',
    "Needs Improvement": 'text-red-600 font-semibold',
};

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ onAnalyze, isLoading, analysis }) => {
    return (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Slide Analysis</h3>
            
            {isLoading ? (
                 <div className="flex items-center justify-center py-4">
                    <svg className="animate-spin mr-3 h-5 w-5 text-[#E87C4D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600">Analyzing...</span>
                </div>
            ) : analysis ? (
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="font-semibold text-gray-700">Clarity: <span className={ratingStyles[analysis.clarity.rating] || ''}>{analysis.clarity.rating}</span></p>
                        <p className="text-gray-600 pl-2 border-l-2 border-gray-200 ml-1 mt-1 italic">"{analysis.clarity.feedback}"</p>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-700">Impact: <span className={ratingStyles[analysis.impact.rating] || ''}>{analysis.impact.rating}</span></p>
                        <p className="text-gray-600 pl-2 border-l-2 border-gray-200 ml-1 mt-1 italic">"{analysis.impact.feedback}"</p>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-700">Tone: <span className={ratingStyles[analysis.tone.rating] || ''}>{analysis.tone.rating}</span></p>
                        <p className="text-gray-600 pl-2 border-l-2 border-gray-200 ml-1 mt-1 italic">"{analysis.tone.feedback}"</p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Click the button below to get AI-powered feedback on the selected slide.</p>
                </div>
            )}
            
            <button
                onClick={onAnalyze}
                disabled={isLoading}
                className="mt-3 w-full text-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
                Get Detailed Feedback
            </button>
        </div>
    );
};

export default React.memo(AnalysisPanel);
