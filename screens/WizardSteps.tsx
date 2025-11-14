import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { templates } from '../styles/templates';

const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;

const WizardSteps: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [companyDetails, setCompanyDetails] = useState('Sun AI is a startup that uses generative AI to create pitch decks for early-stage companies. We leverage large language models to analyze business context and generate compelling narratives, financial projections, and slide designs automatically.');
  const [urls, setUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('default');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (location.state?.fundingGoal) {
        const goal = location.state.fundingGoal.trim();
        if (goal) {
            const formattedGoal = /^\d+$/.test(goal.replace(/,/g, '')) 
                ? `$${parseInt(goal.replace(/,/g, ''), 10).toLocaleString()}` 
                : goal;
            
            setCompanyDetails(prev => `Our primary goal for this pitch is to secure funding of ${formattedGoal}.\n\n` + prev);
        }
    }
  }, [location.state]);

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
        setUrls(prev => [...prev, currentUrl.trim()]);
        setCurrentUrl('');
    } catch (e) {
        setUrlError(e instanceof Error ? e.message : "Invalid URL format.");
    }
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    setUrls(urls.filter(url => url !== urlToRemove));
  };

  const handleGenerate = async () => {
    setLoading(true);
    if (isGenerateDisabled) {
        setLoading(false);
        return;
    }
    
    navigate('/pitch-decks/generating', { state: { 
        textContext: companyDetails, 
        urlContext: urls,
        template: selectedTemplate,
    }});
  };
  
  const isGenerateDisabled = loading || (!companyDetails.trim() && urls.length === 0);

  const themeTemplates: (keyof typeof templates)[] = [
    'default', 'professional', 'minimalist', 'startup', 
    'vibrantCover', 'vibrantVision', 'vibrantProblem', 'vibrantSolutions', 'vibrantTimeline'
  ];

  const themePreviews: { [key in keyof typeof templates]?: React.ReactNode } = {
    default: <div className="aspect-[4/3] w-full p-3 flex flex-col justify-between"><div className="relative"><h3 className="font-bold text-gray-800 text-sm">point 1</h3><p className="text-xs text-gray-600 mt-1">Bullet</p></div><div className="w-full h-3 bg-gray-200 rounded-full"></div></div>,
    professional: <div className="aspect-[4/3] w-full bg-[#0F172A] p-3 flex flex-col justify-between"><div><h3 className="font-bold text-white text-sm">point 1</h3><p className="text-xs text-gray-300 mt-1">Bullet</p></div><div className="w-full h-3 bg-gray-700 rounded-full"></div></div>,
    minimalist: <div className="aspect-[4/3] w-full bg-white dark:bg-gray-100 p-3 flex flex-col justify-between"><div><h3 className="font-bold text-gray-800 text-sm">point 1</h3><p className="text-xs text-gray-600 mt-1">Bullet</p></div><div className="w-full h-3 bg-gray-200 rounded-full"></div></div>,
    startup: <div className="aspect-[4/3] w-full bg-[#1E293B] p-3 flex flex-col justify-between"><div><h3 className="font-bold text-white text-sm">point 1</h3><p className="text-xs text-gray-300 mt-1">Bullet</p></div><div className="w-full h-3 bg-gray-600 rounded-full"></div></div>,
    vibrantCover: <div className="aspect-[4/3] w-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center p-3 text-center"><div><p className="text-xs text-gray-500 dark:text-gray-400">Bullet point 1</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bullet point 2</p></div></div>,
    vibrantVision: <div className="aspect-[4/3] w-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center p-3 text-center"><div><p className="text-xs text-gray-500 dark:text-gray-400">Bullet point</p></div></div>,
    vibrantProblem: <div className="aspect-[4/3] w-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center p-3 text-center"><div><p className="text-xs text-gray-500 dark:text-gray-400">Bullet point</p></div></div>,
    vibrantSolutions: <div className="aspect-[4/3] w-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center p-3 text-center"><div><p className="text-xs text-gray-500 dark:text-gray-400">point 1</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bullet</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">point 2</p></div></div>,
    vibrantTimeline: <div className="aspect-[4/3] w-full bg-[#7C3AED] flex items-center justify-center p-3"></div>
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Pitch Deck Wizard</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Let's start with the core of your business. Provide your context and choose a style.</p>
        </header>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
            <div className="lg:col-span-1 mb-6 lg:mb-0">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm h-full">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Provide Business Context</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Provide a brief, business plan, or any details about your company. The more information you provide, the better the AI can tailor your pitch deck.</p>
                        <textarea
                            value={companyDetails}
                            onChange={(e) => setCompanyDetails(e.target.value)}
                            className="mt-4 w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] transition duration-150 ease-in-out"
                            placeholder="e.g., Sun AI is a startup that uses generative AI to create pitch decks..."
                            rows={10}
                        />
                    </div>
                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-200 dark:border-gray-700"/>
                        <span className="px-4 text-xs font-medium text-gray-500 dark:text-gray-400">OR</span>
                        <hr className="flex-grow border-gray-200 dark:border-gray-700"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generate from Website URLs</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Provide up to 5 URLs (e.g., homepage, about us). Our AI will crawl these pages to gather context. If business context is also provided above, it will be prioritized.</p>
                        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                            <input
                                value={currentUrl}
                                onChange={(e) => setCurrentUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                                className="flex-grow w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] transition duration-150 ease-in-out"
                                placeholder="e.g., https://www.yourcompany.com"
                                type="url"
                            />
                            <button onClick={handleAddUrl} className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out flex-shrink-0">Add</button>
                        </div>
                        {urlError && <p className="text-red-600 text-sm mt-2">{urlError}</p>}
                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">You can add up to 5 URLs.</div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {urls.map((url) => (
                                <div key={url} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-sm pl-3 pr-2 py-1 rounded-full">
                                    <span className="max-w-xs truncate">{url}</span>
                                    <button onClick={() => handleRemoveUrl(url)} className="p-0.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600" aria-label={`Remove ${url}`}><XIcon /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm h-full">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Select a Visual Theme</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Choose a theme for your presentation. The AI will adapt the tone and visual suggestions to match your selected style.</p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        {themeTemplates.map((key, index) => (
                             <div key={key} className={`theme-card fade-in fade-in-${index+1} group cursor-pointer relative`} onClick={() => setSelectedTemplate(key)}>
                                <div className={`aspect-[4/3] w-full rounded border transition-all duration-200 ${selectedTemplate === key ? 'border-2 border-[#6366F1] shadow-md' : 'border-gray-300 dark:border-gray-600 hover:border-[#6366F1]'}`}>
                                    {themePreviews[key]}
                                </div>
                                {selectedTemplate === key && (
                                    <div className="absolute top-2 right-2 bg-[#6366F1] rounded-full h-5 w-5 flex items-center justify-center pointer-events-none">
                                        <span className="material-symbols-outlined text-white text-sm">check</span>
                                    </div>
                                )}
                                <p className="mt-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{/* FIX: Cast `key` to a string to resolve TypeScript error. `keyof` on a string-indexed object type is `string | number`. */ String(key).replace(/([A-Z])/g, ' $1').replace('vibrant', 'Vibrant ')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-6 lg:mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 pulsating-indicator"></div>
                Auto-saving...
            </div>
            <button onClick={handleGenerate} disabled={isGenerateDisabled} className="w-full sm:w-auto bg-[#6366F1] hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out shadow-lg shadow-indigo-500/30 disabled:shadow-none flex items-center justify-center">
                 {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : 'Generate Deck'}
            </button>
        </div>
    </div>
  );
};

export default WizardSteps;
