import React, { useState } from 'react';
import { useDeckEditor } from '../screens/DeckEditor';

const AICopilot: React.FC = () => {
    const { 
        handleCopilotGenerate, 
        isCopilotLoading, 
        copilotSuggestions,
        handleGenerateHeadlines,
        isGeneratingHeadlines,
        headlineError,
        headlineIdeas,
        selectedSlide,
        handleSummarizeBio
    } = useDeckEditor();

    const [prompt, setPrompt] = useState('');

    const handleGenerateClick = () => {
        if (prompt.trim()) {
            handleCopilotGenerate(prompt);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setPrompt(suggestion);
        handleCopilotGenerate(suggestion);
    };
    
    const onApplyHeadline = (idea: string) => {
        handleCopilotGenerate(`Set the title to "${idea}"`, idea);
    }

    return (
        <div className="p-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Copilot</h3>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D] focus:border-transparent transition disabled:bg-gray-200"
                    rows={4}
                    placeholder="Ask AI to improve this slide... e.g., 'Make it more concise' or 'Add a compelling statistic about AI startups'"
                    disabled={isCopilotLoading}
                />
                <button
                    onClick={handleGenerateClick}
                    disabled={isCopilotLoading || !prompt.trim()}
                    className="mt-2 w-full bg-[#E87C4D] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isCopilotLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        'Generate Suggestions'
                    )}
                </button>

                <div className="border-t border-gray-200 mt-4 pt-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Suggestions</h4>
                    <div className="flex flex-wrap gap-2">
                        {copilotSuggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleSuggestionClick(s)}
                                disabled={isCopilotLoading}
                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedSlide?.type === 'vision' && (
                    <div className="border-t border-gray-200 mt-4 pt-3">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Headline Studio</h4>
                        <button onClick={handleGenerateHeadlines} disabled={isGeneratingHeadlines} className="w-full text-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed">
                            {isGeneratingHeadlines ? 'Generating Ideas...' : 'Generate Headline Ideas'}
                        </button>
                        {headlineError && <p className="text-red-600 text-sm mt-2">{headlineError}</p>}
                        {headlineIdeas.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {headlineIdeas.map((idea, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md border">
                                        <p className="text-sm text-gray-700">{idea}</p>
                                        <button onClick={() => onApplyHeadline(idea)} className="text-sm bg-[#E87C4D] text-white font-semibold py-1 px-3 rounded-md hover:bg-opacity-90">
                                            Use
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                 {selectedSlide?.type === 'team' && (
                    <div className="border-t border-gray-200 mt-4 pt-3">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Team Bio Tools</h4>
                        <p className="text-sm text-gray-500 mb-2">Paste a full bio in the slide content area and use this tool.</p>
                        <button onClick={handleSummarizeBio} disabled={isCopilotLoading} className="w-full text-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed">
                            {isCopilotLoading ? 'Summarizing...' : 'Summarize Bio & Get Highlights'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AICopilot;
