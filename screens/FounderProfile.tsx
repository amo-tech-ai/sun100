
import React, { useMemo, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    Search, Presentation, ExternalLink
} from 'lucide-react';
import { UserProfile } from '../types/founder';
import { useFounderAI } from '../hooks/useFounderAI';
import { ProfileSidebar } from '../src/components/founder/ProfileSidebar';
import { StartupMainCard } from '../src/components/founder/StartupMainCard';
import { StrategicAnalysisSection } from '../src/components/founder/StrategicAnalysisSection';
import { DeckStrategySection } from '../components/founder/DeckStrategySection';
import { getPublicFounderProfile } from '../services/startupService';

// --- MAIN PAGE COMPONENT --- //

export default function FounderProfile() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) return;
            setLoading(true);
            try {
                const data = await getPublicFounderProfile(username);
                if (data) {
                    setProfile(data);
                } else {
                    // Optionally handle 404 behavior here or just show loading
                    console.log("Profile not found, defaulting to mock in service was likely skipped.");
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);
    
    // Ensure hook is always called, pass empty object if null to prevent crash, handle null check in UI
    const ai = useFounderAI(profile || {} as UserProfile);

    const profileStrength = useMemo(() => {
        if (!profile) return 0;
        let filledFields = 0;
        const totalFields = 10;
        const p = profile;
        if (p.name) filledFields++;
        if (p.title) filledFields++;
        if (p.avatarUrl) filledFields++;
        if (p.bio) filledFields++;
        if (p.startup?.name) filledFields++;
        if (p.startup?.tagline) filledFields++;
        if (p.startup?.description) filledFields++;
        if (p.startup?.industry) filledFields++;
        if (p.startup?.stage) filledFields++;
        if (p.startup?.fundingGoal) filledFields++;
        return Math.round((filledFields / totalFields) * 100);
    }, [profile]);

    const handleGenerateDeck = () => {
        if (profile?.startup) {
            navigate('/pitch-decks/new', { state: { prefill: profile.startup } });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
                <p className="text-gray-500 mb-6">We couldn't find a founder with that username.</p>
                <Link to="/" className="text-brand-orange hover:underline font-bold">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-1/3 lg:flex-shrink-0">
                <ProfileSidebar 
                    profile={profile} 
                    strength={profileStrength} 
                    strategicAnalysis={ai.strategicAnalysis}
                    ai={ai}
                />
            </aside>

            <main className="flex-1 space-y-8">
                <StartupMainCard 
                    startup={profile.startup} 
                    ai={ai}
                    onGenerateDeck={handleGenerateDeck} 
                />
                
                <StrategicAnalysisSection 
                    analysis={ai.strategicAnalysis} 
                    isAnalyzing={ai.isAnalyzingStrategy} 
                    onAnalyze={ai.handleStrategicAnalysis} 
                />

                <DeckStrategySection 
                    strategy={ai.deckStrategy}
                    isAnalyzing={ai.isAnalyzingDeckFocus}
                    onAnalyze={ai.handleSuggestDeckFocus}
                />
                
                {/* Looking For Card */}
                {profile.lookingFor && profile.lookingFor.length > 0 && (
                    <section className="bg-orange-50 p-8 rounded-lg border border-brand-orange/20">
                        <h3 className="text-lg font-bold text-brand-blue mb-4 flex items-center gap-2">
                            <Search className="text-brand-orange w-5 h-5"/>
                            Currently Looking For
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.lookingFor.map(item => (
                                <span key={item} className="bg-white border border-orange-200 text-gray-700 font-semibold text-sm px-4 py-1.5 rounded-full shadow-sm">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
                
                {/* Public Decks Section */}
                {profile.publicDecks && profile.publicDecks.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold text-brand-blue mb-4 flex items-center gap-2">
                            <Presentation className="w-5 h-5 text-gray-400"/> Public Pitch Decks
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {profile.publicDecks.map(deck => (
                                <Link key={deck.id} to={`/pitch-decks/${deck.id}/present`} className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all">
                                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                        <img 
                                            src={deck.imageUrl} 
                                            alt={deck.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">View Deck</span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <h4 className="font-bold text-sm text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-1">{deck.title}</h4>
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-brand-orange" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
