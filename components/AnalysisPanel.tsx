import React from 'react';

const AnalysisPanel: React.FC = () => {
    return (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Slide Analysis</h3>
            <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-semibold text-green-600">✓ Clarity:</span> Good, content is concise.</p>
                <p><span className="font-semibold text-yellow-600">! Impact:</span> Could be stronger. Try adding a statistic.</p>
                <p><span className="font-semibold text-green-600">✓ Tone:</span> Professional and confident.</p>
            </div>
             <button className="mt-3 text-sm text-[#E87C4D] font-semibold hover:underline">
                Get Detailed Feedback
            </button>
        </div>
    );
};

export default AnalysisPanel;
