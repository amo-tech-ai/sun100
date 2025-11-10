
import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap: React.FC = () => {
  const publicRoutes = [
    { path: '/', name: 'Landing Page', description: 'Public-facing homepage for the application.' },
    { path: '/terms', name: 'Terms of Service', description: 'Legal terms and conditions.' },
    { path: '/privacy', name: 'Privacy Policy', description: 'Information on data handling.' },
  ];
  
  const communityRoutes = [
    { path: '/about', name: 'About', description: 'Information about the Sun AI community.' },
    { path: '/how-it-works', name: 'How It Works', description: 'Explanation of the community platform.' },
    { path: '/perks', name: 'Perks', description: 'List of available perks for members.' },
    { path: '/perks/:id', name: 'Perk Detail', description: 'Details for a specific perk.' },
    { path: '/events', name: 'Events', description: 'List of upcoming community events.' },
    { path: '/events/:id', name: 'Event Detail', description: 'Details for a specific event.' },
    { path: '/jobs', name: 'Jobs', description: 'Career board for AI startups.' },
    { path: '/jobs/:id', name: 'Job Detail', description: 'Details for a specific job posting.' },
    { path: '/blogs', name: 'Blogs', description: 'Community blog and articles.' },
    { path: '/blogs/:id', name: 'Blog Detail', description: 'A single blog post.' },
  ];

  const agencyServicesRoutes = [
    { path: '/services', name: 'Services Overview', description: 'Hub for all agency service offerings.' },
    { path: '/services/web-design', name: 'Web Design Service', description: 'Details about our web design services.' },
    { path: '/services/logo-branding', name: 'Logo & Branding Service', description: 'Details about our branding services.' },
    { path: '/services/mvp-development', name: 'MVP Development Service', description: 'Details about our MVP development services.' },
  ];

  const appRoutes = [
    { path: '/dashboard', name: 'Dashboard', description: 'Main view for authenticated users.' },
    { path: '/pitch-deck', name: 'New Deck Wizard', description: 'Start the guided process to create a new presentation.' },
    { path: '/pitch-deck/generating', name: 'Generating Screen', description: 'Intermediate screen shown while the AI creates your deck.' },
    { path: '/dashboard/decks/:id/edit', name: 'Deck Editor', description: 'The core editor for a specific deck.' },
    { path: '/dashboard/decks/:id/present', name: 'Presentation View', description: 'The full-screen presentation mode for a deck.' },
  ];

  const utilityRoutes = [
      { path: '/sitemap', name: 'Sitemap (This Page)', description: 'A map of all application routes.' },
      { path: '*', name: 'Not Found', description: 'Fallback page for any route that does not exist.' },
      { path: '/login', name: 'Login (Dev)', description: 'Redirects to /dashboard for development.' },
      { path: '/signup', name: 'Signup (Dev)', description: 'Redirects to /dashboard for development.' },
  ];

  const renderRouteList = (routes: { path: string, name: string, description: string }[]) => (
    <ul className="space-y-4">
      {routes.map((route) => {
        const isDynamic = route.path.includes(':id');
        const isWildcard = route.path === '*';
        const linkPath = isDynamic ? route.path.replace(':id', 'mock-123') : route.path;
        
        return (
          <li key={route.path}>
            {isWildcard ? (
              <span className="text-[#E87C4D] font-bold">{route.name}</span>
            ) : (
              <Link to={linkPath} className="text-[#E87C4D] font-bold hover:underline">{route.name}</Link>
            )}
            <p className="text-gray-600 ml-4"><code className="text-sm bg-gray-100 p-1 rounded">{route.path}</code> - {route.description}</p>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Application Sitemap</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 border-b pb-2">Public & Legal Screens</h2>
          {renderRouteList(publicRoutes)}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 border-b pb-2">Community Screens</h2>
          {renderRouteList(communityRoutes)}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 border-b pb-2">Agency Services</h2>
          {renderRouteList(agencyServicesRoutes)}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 border-b pb-2">Core Application Screens</h2>
           <p className="text-sm text-gray-500 mb-4">These routes are currently open for development but will be protected by authentication in a future version.</p>
          {renderRouteList(appRoutes)}
        </div>
        
         <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 border-b pb-2">Utility & Dev Screens</h2>
          {renderRouteList(utilityRoutes)}
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
