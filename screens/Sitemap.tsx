import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap: React.FC = () => {
  const publicRoutes = [
    { path: '/', name: 'Landing Page', description: 'Public-facing homepage for the application.' },
    { path: '/terms', name: 'Terms of Service', description: 'Legal terms and conditions.' },
    { path: '/privacy', name: 'Privacy Policy', description: 'Information on data handling.' },
    { path: '/about', name: 'About', description: 'Information about the Sun AI community.' },
    { path: '/perks', name: 'Perks', description: 'List of available perks for members.' },
    { path: '/events', name: 'Events', description: 'List of upcoming community events.' },
    { path: '/jobs', name: 'Jobs', description: 'Career board for AI startups.' },
    { path: '/how-it-works', name: 'How It Works', description: 'Explanation of the community platform.' },
    { path: '/blogs', name: 'Blogs', description: 'Community blog and articles.' },
    { path: '/services', name: 'Services', description: 'Overview of agency service offerings.' },
  ];
  
  const appRoutes = [
    { path: '/dashboard', name: 'Dashboard', description: 'Main view for authenticated users.' },
    { path: '/dashboard/startup-wizard', name: 'Startup Wizard', description: 'Wizard for creating a startup profile.' },
    { path: '/pitch-decks', name: 'Pitch Decks Hub', description: 'Main hub for managing pitch decks.' },
    { path: '/pitch-decks/new', name: 'New Deck Wizard', description: 'Start the guided process to create a new presentation.' },
    { path: '/pitch-decks/generating', name: 'Generating Screen', description: 'Intermediate screen shown while the AI creates your deck.' },
    { path: '/pitch-decks/:id/edit', name: 'Deck Editor', description: 'The core editor for a specific deck.' },
    { path: '/pitch-decks/:id/present', name: 'Presentation View', description: 'The full-screen presentation mode for a deck.' },
    { path: '/pitch-decks/:id/publish-success', name: 'Publish Success', description: 'Confirmation screen after publishing a deck.' },
    { path: '/dashboard/my-events', name: 'My Events', description: "The user's personal event dashboard." },
    { path: '/dashboard/events/new', name: 'New Event Wizard', description: 'The new wizard for creating a community event.' },
  ];

  const utilityRoutes = [
      { path: '/dashboard/sitemap', name: 'Sitemap (This Page)', description: 'A map of all application routes.' },
      { path: '/*', name: 'Not Found', description: 'Fallback page for any route that does not exist.' },
  ];

  const renderRoutes = (routes: {path: string, name: string, description: string}[]) => (
     <ul className="space-y-4">
        {routes.map((route) => (
          <li key={route.path}>
            <Link to={route.path.includes(':id') ? '#' : route.path} className={`font-bold ${route.path.includes(':id') ? 'text-gray-400 cursor-not-allowed' : 'text-[#E87C4D] hover:underline'}`}>
              {route.name} <code className="text-sm font-mono bg-gray-100 p-1 rounded-md">{route.path}</code>
            </Link>
            <p className="text-gray-600 ml-4">{route.description}</p>
          </li>
        ))}
      </ul>
  );


  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Application Sitemap</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 border-b pb-2">Public Screens</h2>
          {renderRoutes(publicRoutes)}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 border-b pb-2">Core Application Screens</h2>
           <p className="text-sm text-gray-500 mb-4">These routes are intended for authenticated users and are nested under layouts.</p>
          {renderRoutes(appRoutes)}
        </div>
        
         <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 border-b pb-2">Utility Screens</h2>
          {renderRoutes(utilityRoutes)}
        </div>
      </div>
    </div>
  );
};

export default Sitemap;