import React from 'react';
import { Link } from 'react-router-dom';

// --- ICONS ---
const Wand2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const LayoutTemplateIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/></svg>;
const FilePlus2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>;
const BarChart3Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const FilterIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const PresentationIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>;
const ChevronDownIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>;

// --- DATA ---
const recommendedTemplates = [
    { title: "Startup Pitch", description: "Perfect for seed-stage fundraising.", tag: "Fundraising", imageUrl: "https://storage.googleapis.com/aistudio-hosting/docs/service-web.png" },
    { title: "Product Demo", description: "Showcase your product features.", tag: "Product", imageUrl: "https://storage.googleapis.com/aistudio-hosting/docs/service-mvp.png", isPremium: true },
    { title: "Sales Proposal", description: "Win more deals with clarity.", tag: "Sales", imageUrl: "https://storage.googleapis.com/aistudio-hosting/docs/service-brand.png" },
    { title: "Quarterly Review", description: "Share progress with stakeholders.", tag: "Internal", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" },
]

// --- SUB-COMPONENTS ---
const CreationCard: React.FC<{ title: string; description: string; buttonText: string; link: string; icon: React.ReactNode }> = ({ title, description, buttonText, link, icon }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200/80 shadow-sm flex flex-col">
        <div className="text-brand-blue mb-4">{icon}</div>
        <h3 className="font-bold text-lg text-brand-blue">{title}</h3>
        <p className="text-gray-500 text-sm mt-1 mb-6 flex-grow">{description}</p>
        <Link to={link} className="w-full text-center bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            {buttonText}
        </Link>
    </div>
);

const TemplateCard: React.FC<typeof recommendedTemplates[0]> = ({ title, description, tag, imageUrl, isPremium }) => (
     <div className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden group">
        <div className="aspect-video bg-gray-100 relative">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            {isPremium && <span className="absolute top-2 right-2 bg-brand-mustard text-brand-blue text-xs font-bold px-2 py-1 rounded-full">Premium</span>}
        </div>
        <div className="p-4">
             <h3 className="font-bold text-brand-blue">{title}</h3>
             <p className="text-sm text-gray-500 mt-1 mb-3">{description}</p>
             <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tag}</span>
        </div>
     </div>
);


// --- MAIN COMPONENT ---
const PitchDecks: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* 1. Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-brand-blue">Good morning, There</h1>
            <p className="text-gray-500 mt-1">0 decks ready</p>
        </div>
        <Link
          to="/pitch-decks/new"
          className="inline-block bg-brand-orange text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-md"
        >
          + New Deck
        </Link>
      </header>

      {/* 2. Create New Presentation */}
      <section>
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Create New Presentation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CreationCard title="AI Generate" description="Create with artificial intelligence" buttonText="Get Started" link="/pitch-decks/new" icon={<Wand2Icon />} />
            <CreationCard title="Template Library" description="Browse 50+ professional templates" buttonText="Browse" link="#" icon={<LayoutTemplateIcon />} />
            <CreationCard title="Start Blank" description="Build from scratch with full control" buttonText="Create" link="/pitch-decks/new" icon={<FilePlus2Icon />} />
            <CreationCard title="Budget Deck" description="Quick financial presentation" buttonText="Start" link="#" icon={<BarChart3Icon />} />
        </div>
      </section>

      {/* 3. My Presentations */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-brand-blue">My Presentations</h2>
            <div className="flex items-center gap-4">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="search" placeholder="Search decks..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange" />
                </div>
                 <button className="flex items-center gap-2 pr-2 pl-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50">
                    <FilterIcon />
                    <span>Most Recent</span>
                    <ChevronDownIcon />
                </button>
            </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                <PresentationIcon />
            </div>
            <h3 className="text-xl font-bold text-brand-blue mt-4">No presentations yet</h3>
            <p className="text-gray-500 mt-2 max-w-sm">Create your first deck to get started. Use our AI wizard or start from a template.</p>
            <Link to="/pitch-decks/new" className="mt-6 inline-block bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-md">
                + Create First Deck
            </Link>
        </div>
      </section>

      {/* 4. Recommended Templates */}
       <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-brand-blue">Recommended Templates</h2>
                <Link to="#" className="font-semibold text-brand-orange hover:underline">
                    Browse All &rarr;
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedTemplates.map(template => (
                    <TemplateCard key={template.title} {...template} />
                ))}
            </div>
        </section>

    </div>
  );
};

export default PitchDecks;
