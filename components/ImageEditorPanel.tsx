import React, { useState } from 'react';

interface ImageEditorPanelProps {
    onEdit: (prompt: string) => void;
    isLoading: boolean;
    error: string | null;
}

const ImageEditorPanel: React.FC<ImageEditorPanelProps> = ({ onEdit, isLoading, error }) => {
    const [prompt, setPrompt] = useState('');

    const handleEditClick = () => {
        if (prompt.trim()) {
            onEdit(prompt);
        }
    };

    return (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Edit Image with AI</h3>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleEditClick()}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D] focus:border-transparent transition disabled:bg-gray-200"
                rows={3}
                placeholder="Describe your changes... e.g., 'Make the sky dark and stormy' or 'Add a red car'"
                disabled={isLoading}
            />
            <button
                onClick={handleEditClick}
                disabled={isLoading || !prompt.trim()}
                className="mt-2 w-full bg-[#E87C4D] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Applying...
                    </>
                ) : (
                    'Apply Edit'
                )}
            </button>
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default ImageEditorPanel;
