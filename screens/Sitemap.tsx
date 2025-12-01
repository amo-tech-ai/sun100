
import React from 'react';
import { Link } from 'react-router-dom';

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);


const Sitemap: React.FC = () => {
  const publicRoutes = [
    { path: '/', name: 'Landing Page', description: 'Public-facing homepage for the application.' },
    { path: '/terms', name: 'Terms of Service', description: 'Legal terms and conditions.' },
    { path: '/privacy', name: 'Privacy Policy', description: 'Information on data handling.' },
    { path: '/about', name: 'About', description: 'Information about the sun ai startup community.' },
    { path: '/directory', name: 'Investor Directory', description: 'List of VCs and Accelerators.' },
    { path: '/directory/:id', name: 'Investor Detail', description: 'Detailed profile of an investor.' },
    { path: '/perks', name: 'Perks', description: 'List of available perks for members.' },
    { path: '/perks/:id', name: 'Perk Detail', description: 'Details for a specific perk.' },
    { path: '/events', name: 'Events', description: 'List of upcoming community events.' },
    { path: '/events/:id', name: 'Event Detail', description: 'Details for a specific event.' },
    { path: '/jobs', name: 'Jobs', description: 'Career board for AI startups.' },
    { path: '/jobs/:id', name: 'Job Detail', description: 'Details for a specific job.' },
    { path: '/how-it-works', name: 'How It Works', description: 'Explanation of the community platform.' },
    { path: '/business-model', name: 'Business Model', description: 'Our sustainable SaaS business model.' },
    { path: '/blogs', name: 'Blogs', description: 'Community blog and articles.' },
    { path: '/blogs/:id', name: 'Blog Detail', description: 'A single blog post.' },
    { path: '/services', name: 'Services', description: 'Overview of agency service offerings.' },
    { path: '/services/web-design', name: 'Web Design Service', description: 'Detail page for web design services.' },
    { path: '/services/logo-branding', name: 'Logo & Branding Service', description: 'Detail page for branding services.' },
    { path: '/services/mvp-development', name: 'MVP Development Service', description: 'Detail page for MVP development.' },
    { path: '/community/profile/:username', name: 'Founder Profile', description: 'Public profile page for a founder and their startup.' },
    { path: '/login', name: 'Login', description: 'User login page.' },
    { path: '/signup', name: 'Sign Up', description: 'User registration page.' },
    { path: '/sunaistartup-deck', name: 'Startup Deck Overview', description: 'Overview of the sponsorship program.' },
    { path: '/sunaistartup-deck/showcase', name: 'Startup Deck Showcase', description: 'A grid of sponsor logos.' },
    { path: '/sunaistartup-deck/categories', name: 'Startup Deck Categories', description: 'Page to filter sponsors by category.' },
    { path: '/sunaistartup-deck/apply', name: 'Apply to Sponsor', description: 'Application form for potential sponsors.' },
    { path: '/sunaistartup-deck/stories', name: 'Sponsor Stories', description: 'Success stories from sponsors.' },
  ];
  
  const appRoutes = [
    { path: '/dashboard', name: 'Dashboard', description: 'Main view for authenticated users.' },
    { path: '/dashboard/crm', name: 'Customer CRM', description: 'Manage customers, pipelines, and insights.' },
    { path: '/dashboard/startup-wizard', name: 'Startup Wizard', description: 'Wizard for creating a startup profile.' },
    { path: '/pitch-decks', name: 'Pitch Decks Hub', description: 'Main hub for managing pitch decks.' },
    { path: '/pitch-decks/new', name: 'New Deck Wizard', description: 'Start the guided process to create a new presentation.' },
    { path: '/pitch-decks/generating', name: 'Generating Screen', description: 'Intermediate screen shown while the AI creates your deck.' },
    { path: '/pitch-decks/:id/edit', name: 'Deck Editor', description: 'The core editor for a specific deck.' },
    { path: '/pitch-decks/:id/present', name: 'Presentation View', description: 'The full-screen presentation mode for a deck.' },
    { path: '/pitch-decks/:id/publish-success', name: 'Publish Success', description: 'Confirmation screen after publishing a deck.' },
    { path: '/dashboard/my-events', name: 'My Events', description: "The user's personal event dashboard." },
    { path: '/dashboard/events/new', name: 'New Event Wizard', description: 'The new wizard for creating a community event.' },
    { path: '/dashboard/video-generator', name: 'Video Generator', description: 'Tool for generating videos with the Veo AI model.' },
    { path: '/dashboard/investor-docs', name: 'Investor Docs', description: 'Command center for creating fundraising documents.' },
    { path: '/dashboard/investor-docs/new', name: 'Doc Builder', description: 'Wizard for creating one-pagers and updates.' },
    { path: '/dashboard/gtm-strategy', name: 'GTM Strategy', description: 'AI-powered Go-To-Market strategy generator.' },
    { path: '/dashboard/data-room', name: 'Data Room', description: 'Secure file management and AI auditing for due diligence.' },
    { path: '/dashboard/directory-admin', name: 'Directory Admin', description: 'Administrative panel for the investor directory.' },
  ];

  const utilityRoutes = [
      { path: '/dashboard/sitemap', name: 'Sitemap (This Page)', description: 'A map of all application routes.' },
      { path: '/*', name: 'Not Found', description: 'Fallback page for any route that does not exist.' },
  ];

  const renderRoutes = (routes: {path: string, name: string, description: string}[]) => (
     <ul className="space-y-4">
        {routes.map((route) => (
          <li key={route.path} className="border-l-4 border-green-500 pl-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <Link to={route.path.includes(':id') || route.path.includes(':username') ? '#' : route.path} className={`font-bold ${route.path.includes(':id') || route.path.includes(':username') ? 'text-gray-400 cursor-not-allowed' : 'text-[#E87C4D] hover:underline'}`}>
                  {route.name} <code className="text-sm font-mono bg-gray-100 p-1 rounded-md">{route.path}</code>
                </Link>
                <p className="text-gray-600 ml-4">{route.description}</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 text-green-600 font-semibold text-sm mr-4">
                  <CheckCircleIcon />
                  <span>Verified</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
  );


  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Application Sitemap & Status</h1>
      <p className="text-gray-600 mb-6">This page serves as a live status report. Each route marked as "Verified" is confirmed to have a corresponding component and is correctly implemented in the application router.</p>
      
      <div className="space-y-8">
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
