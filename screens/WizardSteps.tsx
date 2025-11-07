
import React from 'react';
import { Link } from 'react-router-dom';

const WizardSteps: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Pitch Deck Wizard</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Step 1: Your Company Details</h2>
        <p className="text-gray-600">
          This is a placeholder for the wizard steps. Here you would input information about your company, product, market, and financials. Each step will gather the necessary data for our AI to analyze.
        </p>
      </div>
      <div className="flex justify-end mt-8">
        <Link
          to="/pitch-deck/generating"
          className="bg-[#E87C4D] text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors duration-200"
        >
          Generate Deck &rarr;
        </Link>
      </div>
    </div>
  );
};

export default WizardSteps;
