
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Deck } from '../data/decks';
import { getDecks } from '../services/deckService';


// --- ICONS ---
const Wand2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const LayoutTemplateIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/></svg>;
const FilePlus2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>;
const BarChart3Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const FilterIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const PresentationIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>;
const ChevronDownIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>;
const DollarSignIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;


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

const DeckCard: React.FC<{ deck: Deck }> = ({ deck }) => (
    <Link to={`/pitch-decks/${deck.id}/edit`} className="block bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden group">
        <div className="aspect-video bg-gray-100 relative">
            {/* You could fetch the first slide's image here */}
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <PresentationIcon className="w-12 h-12"/>
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-brand-blue truncate group-hover:text-brand-orange">{deck.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{deck.slides?.length || 0} slides</p>
        </div>
    </Link>
);


// --- MAIN COMPONENT ---
const PitchDecks: React.FC = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fundingGoal, setFundingGoal] = useState('');

    useEffect(() => {
        const fetchDecks = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedDecks = await getDecks();
                setDecks(fetchedDecks);
            } catch (err) {
                console.error("Failed to fetch decks:", err);
                setError(err instanceof Error ? err.message : 'Failed to fetch decks. Supabase may not be configured.');
            } finally {
                setLoading(false);
            }
        };

        fetchDecks();
    }, []);

  return (
    <div className="space-y-12">
      {/* 1. Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-brand-blue">My Presentations</h1>
            <p className="text-gray-500 mt-1">{decks.length} deck{decks.length !== 1 && 's'} created</p>
        </div>
        <Link
          to="/pitch-decks/new"
          className="inline-block bg-brand-orange text-white font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-md"
        >
          + New Deck
        </Link>
      </header>

      {/* 2. My Presentations */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-brand-blue">All Decks</h2>
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
        
        {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200/80 shadow-sm overflow-hidden">
                        <div className="aspect-video bg-gray-200"></div>
                        <div className="p-4 space-y-2">
                            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {!loading && error && <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>}

        {!loading && !error && decks.length === 0 && (
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
        )}
        
        {!loading && !error && decks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {decks.map(deck => (
                    <DeckCard key={deck.id} deck={deck} />
                ))}
            </div>
        )}
      </section>

      {/* 3. Create New Presentation */}
      <section>
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Start from Scratch</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CreationCard title="AI Generate" description="Create with artificial intelligence" buttonText="Get Started" link="/pitch-decks/new" icon={<Wand2Icon />} />
            <CreationCard title="Template Library" description="Browse 50+ professional templates" buttonText="Browse" link="#" icon={<LayoutTemplateIcon />} />
            <CreationCard title="Start Blank" description="Build from scratch with full control" buttonText="Create" link="/pitch-decks/new" icon={<FilePlus2Icon />} />
            
            <div className="bg-white p-6 rounded-lg border border-gray-200/80 shadow-sm flex flex-col">
                <div className="text-brand-blue mb-4"><BarChart3Icon /></div>
                <h3 className="font-bold text-lg text-brand-blue">Financial Deck</h3>
                <p className="text-gray-500 text-sm mt-1 mb-4 flex-grow">Start a new deck with a specific funding goal in mind.</p>
                
                <div className="mb-4">
                    <label htmlFor="funding-goal" className="block text-sm font-medium text-gray-700 mb-1">Funding Goal</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <DollarSignIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="funding-goal"
                            type="text"
                            value={fundingGoal}
                            onChange={(e) => setFundingGoal(e.target.value)}
                            placeholder="1,500,000"
                            className="block w-full rounded-md border border-gray-300 py-2 pl-10 shadow-sm focus:border-brand-orange focus:ring-brand-orange sm:text-sm"
                        />
                    </div>
                </div>

                <Link
                    to="/pitch-decks/new"
                    state={{ fundingGoal: fundingGoal }}
                    className="w-full mt-auto text-center bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                    Start with Goal
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default PitchDecks;
