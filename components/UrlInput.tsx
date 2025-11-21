
import React, { useState } from 'react';

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;

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
                 throw new Error("URL already added.");
            }
            if (urls.length >= 5) {
                throw new Error("Max 5 URLs allowed.");
            }
            setUrls([...urls, currentUrl.trim()]);
            setCurrentUrl('');
        } catch (e) {
            setUrlError(e instanceof Error ? e.message : "Invalid URL.");
        }
    };

    const handleRemoveUrl = (urlToRemove: string) => {
        setUrls(urls.filter(url => url !== urlToRemove));
    };

    return (
        <div className="w-full">
            <div className="relative flex items-center">
                <input
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                    className="w-full pl-4 pr-24 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition text-sm"
                    placeholder="https://www.yourcompany.com"
                    type="url"
                />
                <button 
                    onClick={handleAddUrl} 
                    disabled={!currentUrl}
                    className="absolute right-1 top-1 bottom-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-semibold px-3 rounded-md text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                    <PlusIcon /> Add
                </button>
            </div>
            
            {urlError && <p className="text-red-500 text-xs mt-2 pl-1">{urlError}</p>}
            
            {urls.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {urls.map((url) => (
                        <div key={url} className="group flex items-center gap-2 bg-white border border-gray-200 text-xs font-medium text-gray-600 pl-3 pr-1 py-1.5 rounded-full shadow-sm">
                            <span className="max-w-[200px] truncate">{url.replace(/^https?:\/\//, '')}</span>
                            <button 
                                onClick={() => handleRemoveUrl(url)} 
                                className="p-1 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors" 
                                aria-label={`Remove ${url}`}
                            >
                                <XIcon />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UrlInput;
    