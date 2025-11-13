import React from 'react';
import { useDeckEditor } from '../screens/DeckEditor';

const ratingStyles: { [key: string]: string } = {
    "Good": 'text-green-600 font-semibold',
    "Average": 'text-yellow-600 font-semibold',
    "Needs Improvement": 'text-red-600 font-semibold',
};

const AnalysisPanel: React.FC = () => {
    const { 
        handleAnalyzeSlide, 
        isAnalyzing, 
        analysisResult,
        handleExtractMetrics, 
        isExtractingMetrics, 
        extractedMetrics, 
        metricError
    } = useDeckEditor();

    const renderMetricContent = () => {
        if (isExtractingMetrics) {
            return (
                <div className="mt-3 space-y-2">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center bg-gray-100 p-3 border rounded-md animate-pulse">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            );
        }

        if (metricError) {
            return <p className="text-red-600 text-sm mt-2">{metricError}</p>;
        }

        if (extractedMetrics.length > 0) {
            return (
                <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-500">AI found these metrics in your text:</p>
                    {extractedMetrics.map((metric, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-2 border rounded-md">
                            <p className="text-sm"><span className="font-semibold">{metric.label}:</span> {metric.value}</p>
                        </div>
                    ))}
                </div>
            );
        }
        
        return <p className="text-sm text-gray-500 mt-2">No key metrics found yet. Click the button to analyze.</p>;
    };

    return (
        <div className="p-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Slide Analysis</h3>
                
                {isAnalyzing ? (
                     <div className="space-y-3 text-sm animate-pulse">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="py-1">
                                <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
                                <div className="h-10 bg-gray-200 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : analysisResult ? (
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="font-semibold text-gray-700">Clarity: <span className={ratingStyles[analysisResult.clarity.rating] || ''}>{analysisResult.clarity.rating}</span></p>
                            <p className="text-gray-600 pl-2 border-l-2 border-gray-200 ml-1 mt-1 italic">"{analysisResult.clarity.feedback}"</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Impact: <span className={ratingStyles[analysisResult.impact.rating] || ''}>{analysisResult.impact.rating}</span></p>
                            <p className="text-gray-600 pl-2 border-l-2 border-gray-200 ml-1 mt-1 italic">"{analysisResult.impact.feedback}"</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Tone: <span className={ratingStyles[analysisResult.tone.rating] || ''}>{analysisResult.tone.rating}</span></p>
                            <p className="text-gray-600 pl-2 border-l-2 border-gray-200 ml-1 mt-1 italic">"{analysisResult.tone.feedback}"</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-500">Click the button below to get AI-powered feedback on the selected slide.</p>
                    </div>
                )}
                
                <button
                    onClick={handleAnalyzeSlide}
                    disabled={isAnalyzing}
                    className="mt-3 w-full text-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isAnalyzing ? (
                         <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#E87C4D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : 'Get Detailed Feedback'}
                </button>

                {/* Key Metric Extraction UI */}
                <div className="border-t border-gray-200 mt-4 pt-3">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Key Metric Extraction</h4>
                    <button onClick={handleExtractMetrics} disabled={isExtractingMetrics} className="w-full text-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center">
                        {isExtractingMetrics ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Extracting...
                            </>
                        ) : 'Extract Key Metrics'}
                    </button>
                    {renderMetricContent()}
                </div>
            </div>
        </div>
    );
};

export default React.memo(AnalysisPanel);
