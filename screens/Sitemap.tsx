import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap: React.FC = () => {
  const publicRoutes = [
    { path: '/', name: 'Landing Page', description: 'Public-facing homepage for the application.' },
    { path: '/terms', name: 'Terms of Service', description: 'Legal terms and conditions.' },
    { path: '/privacy', name: 'Privacy Policy', description: 'Information on data handling.' },
  ];
  
  const appRoutes = [
    { path: '/dashboard', name: 'Dashboard', description: 'Main view for authenticated users to see their decks.' },
    { path: '/dashboard/new', name: 'New Deck Wizard', description: 'Start the guided process to create a new presentation.' },
    { path: '/dashboard/generating', name: 'Generating Screen', description: 'Intermediate screen shown while the AI creates your deck.' },
    { path: '/dashboard/decks/mock-deck-123/edit', name: 'Deck Editor', description: 'The core editor for a specific deck. (Uses a mock ID for linking).' },
    { path: '/dashboard/decks/mock-deck-123/present', name: 'Presentation View', description: 'The full-screen presentation mode for a deck. (Uses a mock ID for linking).' },
    { path: '/dashboard/decks/mock-deck-123/publish-success', name: 'Publish Success', description: 'Confirmation screen after publishing a deck.' },
  ];

  const utilityRoutes = [
      { path: '/dashboard/sitemap', name: 'Sitemap (This Page)', description: 'A map of all application routes.' },
      { path: '/*', name: 'Not Found', description: 'Fallback page for any route that does not exist.' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Application Sitemap</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 border-b pb-2">Public Screens</h2>
          <ul className="space-y-4">
            {publicRoutes.map((route) => (
              <li key={route.path}>
                <Link to={route.path} className="text-[#E87C4D] font-bold hover:underline">{route.name}</Link>
                <p className="text-gray-600 ml-4">{route.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 border-b pb-2">Core Application Screens</h2>
           <p className="text-sm text-gray-500 mb-4">These routes are intended for authenticated users.</p>
          <ul className="space-y-4">
            {appRoutes.map((route) => (
              <li key={route.path}>
                <Link to={route.path.includes('mock') ? '#' : route.path} className={`font-bold ${route.path.includes('mock') ? 'text-gray-400 cursor-not-allowed' : 'text-[#E87C4D] hover:underline'}`}>{route.name}</Link>
                <p className="text-gray-600 ml-4">{route.description}</p>
              </li>
            ))}
          </ul>
        </div>
        
         <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 border-b pb-2">Utility Screens</h2>
          <ul className="space-y-4">
            {utilityRoutes.map((route) => (
              <li key={route.path}>
                <Link to={route.path} className="text-[#E87C4D] font-bold hover:underline">{route.name}</Link>
                <p className="text-gray-600 ml-4">{route.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;