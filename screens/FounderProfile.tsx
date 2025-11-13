
import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { summarizeBio, BioSummary } from '../services/geminiService';

// --- ICONS ---
const LinkIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>;
const LinkedinIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TwitterIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 9.7 0 .3 0 .7-.1 1-.7 2.2-2.5 4.3-5.2 5.5-2.7.7-5.5.5-8.1-.4-2.6-.9-5-2.4-6.9-4.4-1.9-2-3.2-4.3-3.8-6.7 2.4.4 4.8.6 7.2.2-2.3-.5-4.3-1.9-5.7-3.6-1.4-1.7-2.1-3.8-1.9-5.9.8.4 1.7.7 2.6.8-1.5-.9-2.7-2.4-3.4-4 .9 2.1 2.5 3.9 4.6 5.2 2.1 1.2 4.6 1.8 7.1 1.6-1.5-1.1-2.4-2.8-2.1-4.5.3-1.7 1.4-3.1 2.9-3.9 1.5-.8 3.3-.9 4.9-.4.9-.1 1.8-.4 2.6-.8-.3.9-.8 1.7-1.4 2.4.8-.1 1.6-.3 2.3-.6-.6.8-1.2 1.5-1.9 2.1z"/></svg>;
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const WandIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>;
const CheckIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>;
const ClipboardIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>;
const Spinner = () => <svg className="animate-spin h-4 w-4 text-brand-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

// --- HELPER COMPONENTS ---
const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button onClick={handleCopy} className="text-gray-400 hover:text-brand-orange" aria-label="Copy text">
            {copied ? <CheckIcon className="text-green-500" /> : <ClipboardIcon />}
        </button>
    );
};


// Mock Data
const mockProfile = {
    username: 'alex-chen',
    name: 'Alex Chen',
    title: 'Founder & CEO, Sun AI Startup',
    avatarUrl: 'https://picsum.photos/seed/sunai-user/200',
    bio: "Obsessed with democratizing access to AI for the next generation of founders. Building tools that make professional design and storytelling effortless. Previously at Google AI.",
    socials: {
        linkedin: '#',
        twitter: '#',
        website: 'https://sunaistartup.com'
    },
    startup: {
        name: 'Sun AI Startup',
        logoUrl: 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png', // Placeholder
        tagline: 'Your AI-Powered Startup Hub for Growth.',
        website: 'https://sunaistartup.com'
    },
    lookingFor: ['Seed Funding', 'Technical Co-founder', 'Beta Testers'],
    publicDecks: [
        { id: 'deck-1', title: 'Sun AI Seed Round Pitch', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/docs/service-web.png' },
        { id: 'deck-2', title: 'Q3 Product Update', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/docs/service-mvp.png' },
    ]
};

const FounderProfile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const profile = mockProfile; // In a real app, you'd fetch this based on username

    const [showAiTools, setShowAiTools] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryAndHighlights, setSummaryAndHighlights] = useState<BioSummary | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);

    const handleSummarize = useCallback(async () => {
        setIsSummarizing(true);
        setAiError(null);
        setSummaryAndHighlights(null);
        try {
            const result = await summarizeBio(profile.bio);
            setSummaryAndHighlights(result);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsSummarizing(false);
        }
    }, [profile.bio]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column / Profile Sidebar */}
                <aside className="w-full lg:w-1/3 lg:flex-shrink-0">
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center sticky top-28">
                        <img src={profile.avatarUrl} alt={profile.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
                        <h1 className="text-3xl font-bold text-brand-blue">{profile.name}</h1>
                        <p className="text-gray-500 mt-1">{profile.title}</p>
                        <button className="mt-6 w-full bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
                            Connect
                        </button>
                        <div className="border-t border-gray-200 my-6"></div>
                        <div className="text-left">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-brand-blue">About</h3>
                                <button 
                                    onClick={() => setShowAiTools(!showAiTools)} 
                                    className="p-1 text-gray-400 hover:text-brand-orange rounded-full transition-colors"
                                    title="Refine with AI"
                                    aria-label="Toggle AI Bio Assistant"
                                    aria-expanded={showAiTools}
                                >
                                    <WandIcon />
                                </button>
                            </div>
                            <p className="text-gray-600">{profile.bio}</p>
                            
                            {showAiTools && (
                                <div className="mt-4 p-4 bg-orange-50/50 border border-brand-orange/20 rounded-lg space-y-4">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                        <h4 className="font-semibold text-sm text-brand-blue">AI Bio Assistant</h4>
                                        <button 
                                            onClick={handleSummarize} 
                                            disabled={isSummarizing}
                                            className="flex items-center justify-center gap-2 text-sm font-semibold text-brand-orange hover:text-opacity-80 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors self-start sm:self-center"
                                        >
                                            {isSummarizing ? (
                                                <> <Spinner /> Generating... </>
                                            ) : (
                                                <> <WandIcon /> Generate Summary & Highlights </>
                                            )}
                                        </button>
                                    </div>
                                    {aiError && <p className="text-red-500 text-sm">{aiError}</p>}
                                    {summaryAndHighlights && (
                                        <div className="space-y-4 border-t border-brand-orange/20 pt-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Suggested Summary</label>
                                                <div className="flex items-start justify-between gap-2 bg-white p-2 border rounded-md">
                                                    <p className="text-sm text-gray-700">{summaryAndHighlights.summary}</p>
                                                    <CopyButton textToCopy={summaryAndHighlights.summary} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Suggested Highlights</label>
                                                <ul className="space-y-2">
                                                    {summaryAndHighlights.highlights.map((highlight, i) => (
                                                        <li key={i} className="flex items-start justify-between gap-2 bg-white p-2 border rounded-md">
                                                            <p className="text-sm text-gray-700 leading-tight">- {highlight}</p>
                                                            <CopyButton textToCopy={highlight} />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="border-t border-gray-200 my-6"></div>
                        <div className="flex justify-center gap-4">
                            <a href={profile.socials.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-orange"><LinkIcon /></a>
                            <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-orange"><LinkedinIcon /></a>
                            <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-orange"><TwitterIcon /></a>
                        </div>
                    </div>
                </aside>

                {/* Right Column / Main Content */}
                <main className="flex-1 space-y-8">
                    {/* Startup Card */}
                    <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center gap-6">
                            <img src={profile.startup.logoUrl} alt={`${profile.startup.name} logo`} className="w-16 h-16"/>
                            <div>
                                <h2 className="text-2xl font-bold text-brand-blue">{profile.startup.name}</h2>
                                <p className="text-gray-600">{profile.startup.tagline}</p>
                                <a href={profile.startup.website} target="_blank" rel="noopener noreferrer" className="text-brand-orange font-semibold hover:underline flex items-center gap-1 mt-1">
                                    <LinkIcon className="w-4 h-4" />
                                    {profile.startup.website.replace('https://', '')}
                                </a>
                            </div>
                        </div>
                    </section>
                    
                    {/* Looking For Card */}
                    <section className="bg-orange-50 p-8 rounded-lg border border-brand-orange/30">
                         <h3 className="text-xl font-semibold text-brand-blue mb-4 flex items-center gap-2">
                             <SearchIcon className="text-brand-orange"/>
                             Currently Looking For
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.lookingFor.map(item => (
                                <span key={item} className="bg-white border border-gray-300 text-gray-700 font-semibold text-sm px-3 py-1 rounded-full">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </section>
                    
                    {/* Public Decks Section */}
                    <section>
                         <h3 className="text-xl font-semibold text-brand-blue mb-4">Public Pitch Decks</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {profile.publicDecks.map(deck => (
                                <Link key={deck.id} to={`/pitch-decks/${deck.id}/present`} className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                                    <div className="aspect-video bg-gray-100">
                                        <img src={deck.imageUrl} alt={deck.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-brand-blue group-hover:text-brand-orange transition-colors">{deck.title}</h4>
                                    </div>
                                </Link>
                            ))}
                         </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default FounderProfile;
