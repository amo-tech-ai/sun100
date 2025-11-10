import React, { useState } from 'react';

// X Icon for the chip
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

interface UrlInputProps {
    urls: string[];
    setUrls: React.Dispatch<React.SetStateAction<string[]>>;
}

const UrlInput: React.FC<UrlInputProps> = ({ urls, setUrls }) => {
    const [currentUrl, setCurrentUrl] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAddUrl = () => {
        setError(null);
        if (!currentUrl.trim()) return;

        try {
            // Basic validation
            new URL(currentUrl);
            if (!currentUrl.startsWith('http')) {
                 throw new Error("URL must start with http:// or https://");
            }
            if (urls.includes(currentUrl)) {
                 throw new Error("URL already added.");
            }
            if (urls.length >= 5) {
                throw new Error("You can add a maximum of 5 URLs.");
            }
            
            setUrls([...urls, currentUrl]);
            setCurrentUrl('');
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid URL format.");
        }
    };

    const handleRemoveUrl = (urlToRemove: string) => {
        setUrls(urls.filter(url => url !== urlToRemove));
    };

    return (
        <div>
            <div className="flex items-start gap-2">
                <input
                    type="url"
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddUrl();
                        }
                    }}
                    className="flex-grow w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D] focus:border-transparent transition-shadow duration-200"
                    placeholder="e.g., https://www.yourcompany.com"
                />
                <button
                    onClick={handleAddUrl}
                    className="flex-shrink-0 bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                    Add
                </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            
            <div className="mt-4 flex flex-wrap gap-2">
                {urls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                        <span className="max-w-xs truncate">{url}</span>
                        <button onClick={() => handleRemoveUrl(url)} className="p-1 rounded-full hover:bg-gray-300" aria-label={`Remove ${url}`}>
                            <XIcon />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UrlInput;