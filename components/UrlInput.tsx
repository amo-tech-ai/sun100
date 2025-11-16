import React, { useState } from 'react';

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

interface UrlInputProps {
    urls: string[];
    setUrls: (urls: string[]) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ urls, setUrls }) => {
    const [currentUrl, setCurrentUrl] = useState('');
    const [urlError, setUrlError] = useState<string | null>(null);

    const handleAddUrl = () => {
        setUrlError(null);
        if (!currentUrl.trim()) return;

        try {
            new URL(currentUrl); // Basic validation
            if (urls.includes(currentUrl)) {
                 throw new Error("URL has already been added.");
            }
            if (urls.length >= 5) {
                throw new Error("You can add a maximum of 5 URLs.");
            }
            setUrls([...urls, currentUrl.trim()]);
            setCurrentUrl('');
        } catch (e) {
            setUrlError(e instanceof Error ? e.message : "Invalid URL format.");
        }
    };

    const handleRemoveUrl = (urlToRemove: string) => {
        setUrls(urls.filter(url => url !== urlToRemove));
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <input
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                    className="flex-grow w-full p-3 rounded border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition"
                    placeholder="e.g., https://www.yourcompany.com"
                    type="url"
                />
                <button onClick={handleAddUrl} className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out flex-shrink-0">Add URL</button>
            </div>
            {urlError && <p className="text-red-600 text-sm mt-2">{urlError}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
                {urls.map((url) => (
                    <div key={url} className="flex items-center gap-2 bg-gray-100 text-sm pl-3 pr-2 py-1 rounded-full">
                        <span className="max-w-xs truncate">{url}</span>
                        <button onClick={() => handleRemoveUrl(url)} className="p-0.5 rounded-full hover:bg-gray-300" aria-label={`Remove ${url}`}><XIcon /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UrlInput;
