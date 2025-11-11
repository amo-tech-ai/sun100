import React, { useState } from 'react';
import { useDeckEditor } from '../screens/DeckEditor';

const ResearchResultPanel: React.FC = () => {
    const { 
        handleResearch, 
        isResearching, 
        researchResult, 
        researchSuggestions, 
        areSuggestionsLoading,
        handleCompetitorResearch, 
        handleSocialProofSearch
    } = useDeckEditor();

    const [query, setQuery] = useState('');

    const handleResearchClick = () => {
        if (query.trim()) {
            handleResearch(query);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        handleResearch(suggestion);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Research Assistant</h3>
             <div className="flex gap-2 mb-3">
                 <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleResearchClick()}
                    className="flex-grow w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D] focus:border-transparent transition disabled:bg-gray-200"
                    placeholder="e.g., 'latest AI trends'"
                    disabled={isResearching}
                />
                <button
                    onClick={handleResearchClick}
                    disabled={isResearching || !query.trim()}
                    className="bg-[#E87C4D] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center w-14"
                    aria-label="Perform research"
                >
                    {isResearching ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Go'}
                </button>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
                 <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">One-Click Research</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                     <button onClick={handleCompetitorResearch} disabled={isResearching} className="text-sm text-center w-full bg-white border border-[#E87C4D] text-[#E87C4D] font-semibold py-2 px-3 rounded-lg hover:bg-orange-50 transition-colors duration-200">Research Competitors</button>
                     <button onClick={handleSocialProofSearch} disabled={isResearching} className="text-sm text-center w-full bg-white border border-[#E87C4D] text-[#E87C4D] font-semibold py-2 px-3 rounded-lg hover:bg-orange-50 transition-colors duration-200">Find Social Proof</button>
                 </div>
                 <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Suggestions</h4>
                {areSuggestionsLoading ? (
                     <div className="flex flex-wrap gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-7 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {researchSuggestions.map((s, i) => (
                             <button
                                key={i}
                                onClick={() => handleSuggestionClick(s)}
                                disabled={isResearching}
                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {isResearching && !researchResult && (
                 <div className="text-center py-4 border-t mt-3">
                    <p className="text-gray-600">Researching...</p>
                </div>
            )}
            
            {researchResult && (
                <div className="space-y-3 text-sm border-t pt-3 mt-3">
                    <p className="text-gray-700 whitespace-pre-wrap">{researchResult.summary}</p>
                    {researchResult.sources.length > 0 && (
                        <div>
                            <p className="font-semibold text-gray-800 mt-4 mb-2">Sources:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                {researchResult.sources.map((source, index) => (
                                    <li key={index}>
                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[#E87C4D] hover:underline break-all" title={source.title}>
                                            {source.title || source.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default React.memo(ResearchResultPanel);