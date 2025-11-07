
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Sun AI</h2>
        <p className="text-gray-600 mb-6">
          Ready to create a compelling pitch deck? Start by clicking the button below to launch the guided wizard.
        </p>
        <Link
          to="/pitch-deck"
          className="inline-block bg-[#E87C4D] text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E87C4D]"
        >
          Create New Deck
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
