import React, { useState } from 'react';

interface AICopilotProps {
    isLoading: boolean;
    onGenerate: (prompt: string) => void;
    suggestions: string[];
    areSuggestionsLoading: boolean;
}

const AICopilot: React.FC<AICopilotProps> = ({ isLoading, onGenerate, suggestions, areSuggestionsLoading }) => {
    const [prompt, setPrompt] = useState('');

    const handleGenerateClick = () => {
        if (prompt.trim()) {
            onGenerate(prompt);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setPrompt(suggestion); // Populate the textarea for user feedback
        onGenerate(suggestion); // Immediately trigger the action
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Copilot</h3>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D] focus:border-transparent transition disabled:bg-gray-200"
                rows={4}
                placeholder="Ask AI to improve this slide... e.g., 'Make it more concise' or 'Add a compelling statistic about AI startups'"
                disabled={isLoading}
            />
            <button
                onClick={handleGenerateClick}
                disabled={isLoading || !prompt.trim()}
                className="mt-2 w-full bg-[#E87C4D] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? (
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
                {areSuggestionsLoading ? (
                    <div className="flex flex-wrap gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-7 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleSuggestionClick(s)}
                                disabled={isLoading}
                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(AICopilot);
