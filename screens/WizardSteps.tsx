import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UrlInput from '../components/UrlInput'; // Import the new component

const WizardSteps: React.FC = () => {
  const [companyDetails, setCompanyDetails] = useState('');
  const [urls, setUrls] = useState<string[]>([]); // Add state for URLs
  const navigate = useNavigate();

  const handleGenerate = () => {
    // Navigate if either company details or URLs are provided
    if (companyDetails.trim().length > 0 || urls.length > 0) {
      navigate('/pitch-deck/generating', { state: { companyDetails, urls } });
    }
  };

  const isGenerateDisabled = !companyDetails.trim() && urls.length === 0;

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-3xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 text-center">Pitch Deck Wizard</h1>
      <p className="text-center text-gray-500 mb-6">Let's start with the core of your business.</p>

      <div className="mb-6">
        <label htmlFor="company-details" className="block text-lg lg:text-xl font-semibold mb-2 text-gray-700">
          Step 1: Provide Business Context
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

      <div className="flex items-center my-8">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 font-semibold">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="mb-6">
        <label className="block text-lg lg:text-xl font-semibold mb-2 text-gray-700">
          Step 2: Add Website URLs
        </label>
        <p className="text-gray-600 mb-3">
          Provide up to 5 URLs (like your homepage, competitor sites, or news articles). The AI will analyze their content to generate your deck.
        </p>
        <UrlInput urls={urls} setUrls={setUrls} />
      </div>

      <div className="flex justify-center sm:justify-end mt-8">
        <button
          onClick={handleGenerate}
          disabled={isGenerateDisabled}
          className="w-full sm:w-auto bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md disabled:shadow-none"
        >
          Generate Deck &rarr;
        </button>
      </div>
    </div>
  );
};

export default WizardSteps;
