import React from 'react';

const AICopilot: React.FC = () => {
    return (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Copilot</h3>
            <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D] focus:border-transparent transition"
                rows={4}
                placeholder="Ask AI to improve this slide..."
            />
            <button className="mt-2 w-full bg-[#E87C4D] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-200">
                Generate Suggestions
            </button>
        </div>
    );
};

export default AICopilot;
