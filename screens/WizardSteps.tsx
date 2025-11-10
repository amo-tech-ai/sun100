
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UrlInput from '../components/UrlInput';

const WizardSteps: React.FC = () => {
  const [companyDetails, setCompanyDetails] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleGenerate = () => {
    // Prioritize company details if provided, otherwise use URLs.
    if (companyDetails.trim().length > 0) {
      navigate('/pitch-decks/generating', { state: { companyDetails } });
    } else if (urls.length > 0) {
      navigate('/pitch-decks/generating', { state: { urls } });
    }
  };

  const isGenerateDisabled = !companyDetails.trim() && urls.length === 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 text-center">Create Your Pitch Deck</h1>
        <p className="text-center text-gray-500 mb-8">
          Provide business context or enter website URLs. If both are provided, the business context will be used for generation.
        </p>
        
        {/* Business Context Section */}
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

        {/* Separator */}
        <div className="relative my-10">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white px-3 text-lg font-medium text-gray-500">
                    OR
                </span>
            </div>
        </div>

        {/* Website URL Section */}
        <div className="mb-6">
          <label htmlFor="company-urls" className="block text-lg lg:text-xl font-semibold mb-2 text-gray-700">
            Enter Your Website URLs
          </label>
          <p className="text-gray-600 mb-3">
            Provide up to 5 URLs (e.g., homepage, about us, pricing). Our AI will crawl these pages to gather context for your pitch deck.
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
    </div>
  );
};

export default WizardSteps;
