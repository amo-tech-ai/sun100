import React from 'react';

const ResearchResultPanel: React.FC = () => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Research Assistant</h3>
             <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D] focus:border-transparent transition mb-3"
                placeholder="Research a topic..."
            />
            <div className="space-y-2 text-sm text-gray-700 p-2 border-t">
                <p className="font-semibold">"Latest trends in renewable energy"</p>
                <p className="text-gray-500">The global market is expected to reach $2.1 trillion by 2027, driven by solar and wind power adoption...</p>
                <a href="#" className="text-[#E87C4D] hover:underline text-xs">Source: MarketAnalysis.com</a>
            </div>
        </div>
    );
};

export default ResearchResultPanel;
