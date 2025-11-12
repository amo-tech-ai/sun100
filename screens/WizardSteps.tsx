import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UrlInput from '../components/UrlInput';
import { generateDeck } from '../services/aiService';

type InputMode = 'context' | 'url';

const WizardSteps: React.FC = () => {
  const location = useLocation();
  const [companyDetails, setCompanyDetails] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<InputMode>('context');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.fundingGoal) {
        const goal = location.state.fundingGoal.trim();
        if (goal) {
            // Format the number if it's just digits, otherwise use as is
            const formattedGoal = /^\d+$/.test(goal.replace(/,/g, '')) 
                ? `$${parseInt(goal.replace(/,/g, ''), 10).toLocaleString()}` 
                : goal;
            
            setCompanyDetails(prev => `Our primary goal for this pitch is to secure funding of ${formattedGoal}.\n\n` + prev);
            // Switch to the context tab so the user sees the change
            setActiveTab('context');
        }
    }
  }, [location.state]);


  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      let deckId: string;
      if (activeTab === 'context' && companyDetails.trim().length > 0) {
        const result = await generateDeck({ mode: 'text', content: companyDetails });
        deckId = result.deckId;
      } else if (activeTab === 'url' && urls.length > 0) {
        const result = await generateDeck({ mode: 'url', content: urls });
        deckId = result.deckId;
      } else {
        throw new Error("No input provided.");
      }
      navigate('/pitch-decks/generating', { state: { deckId } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
    } finally {
      setLoading(false);
    }
  };

  const isGenerateDisabled = loading || (activeTab === 'context' ? !companyDetails.trim() : urls.length === 0);

  const tabClass = (mode: InputMode) =>
    `px-4 py-2 font-semibold rounded-t-md cursor-pointer transition-colors ${
      activeTab === mode
        ? 'bg-white text-[#E87C4D] border-b-2 border-transparent'
        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
    }`;

  return (
    <div className="max-w-3xl mx-auto">
       <div className="flex border-b border-gray-200 mb-[-1px]">
          <button onClick={() => setActiveTab('context')} className={tabClass('context')}>
            From Business Context
          </button>
          <button onClick={() => setActiveTab('url')} className={tabClass('url')}>
            From Website URL
          </button>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 text-center">Pitch Deck Wizard</h1>
        <p className="text-center text-gray-500 mb-6">
          {activeTab === 'context'
            ? "Let's start with the core of your business."
            : "Let our AI analyze your website for pitch deck content."
          }
        </p>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
        
        {activeTab === 'context' ? (
          <div className="mb-6">
            <label htmlFor="company-details" className="block text-lg lg:text-xl font-semibold mb-2 text-gray-700">
              Provide Business Context
            </label>
            <p className="text-gray-600 mb-3">
              Provide a brief, business plan, or any details about your company. The more information you provide, the better the AI can tailor your pitch deck.
            </p>
            <textarea
              id="company-details"
              value={companyDetails}
              onChange={(e) => setCompanyDetails(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E87C4D] focus:border-transparent transition-shadow duration-200"
              rows={10}
              placeholder="e.g., Sun AI is a startup that uses generative AI to create pitch decks..."
            />
          </div>
        ) : (
          <div className="mb-6">
            <label htmlFor="company-urls" className="block text-lg lg:text-xl font-semibold mb-2 text-gray-700">
              Enter Your Website URLs
            </label>
            <p className="text-gray-600 mb-3">
              Provide up to 5 URLs (e.g., homepage, about us, pricing). Our AI will crawl these pages to gather context for your pitch deck.
            </p>
            <UrlInput urls={urls} setUrls={setUrls} />
          </div>
        )}
        

        <div className="flex justify-center sm:justify-end mt-8">
          <button
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            className="w-full sm:w-auto bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md disabled:shadow-none flex items-center justify-center"
          >
            {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                </>
            ) : (
                'Generate Deck →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WizardSteps;