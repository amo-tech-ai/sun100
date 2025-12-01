
import React, { useEffect, useState } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import { useStartup } from '../hooks/useStartup';
import { getDecks } from '../services/deckService';
import { getEvents } from '../services/eventService';

// Components
import { StatCard } from '../components/dashboard/StatCard';
import { QuickActionCard } from '../components/dashboard/QuickActionCard';
import { StartupHealthDonut } from '../components/dashboard/StartupHealthDonut';
import { DeckPerformanceChart } from '../components/dashboard/DeckPerformanceChart';
import { PersonalizedFeed } from '../components/dashboard/PersonalizedFeed';
import { AiInsightsWidget } from '../components/dashboard/AiInsightsWidget';
import { UpcomingEvent } from '../components/dashboard/UpcomingEvent';
import { MiniCalendar } from '../components/dashboard/MiniCalendar';
import { MobileCtaBar } from '../components/dashboard/MobileCtaBar';

// Icons
const Wand2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const PresentationIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>;
const VideoIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect y="4" x="2" width="20" height="16" rx="2"/><path d="m22 8-6 4 6 4V8Z"/></svg>;
const BriefcaseIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const CheckCircleIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const BellIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const SettingsIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0 2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const UsersIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const FolderLockIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2"/><path d="M20 13v-1a2 2 0 1 0-4 0v1"/><rect width="8" height="7" x="14" y="13" rx="1"/></svg>;


const Dashboard: React.FC = () => {
    const [ref, isVisible] = useOnScreen<HTMLElement>({ threshold: 0.1 });
    const animationClass = isVisible ? 'animate-fade-in-up' : 'opacity-0';
    const { profile } = useStartup();
    
    // Live Data State
    const [deckCount, setDeckCount] = useState(0);
    const [eventCount, setEventCount] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [decks, events] = await Promise.all([
                    getDecks(),
                    getEvents()
                ]);
                setDeckCount(decks.length);
                setEventCount(events.length);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, []);
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="w-full bg-[#FBF8F5] min-h-screen pb-24 lg:pb-12 font-display">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                 <style>{`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(1rem); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
                `}</style>

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-gray-200/50">
                    <div>
                        <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-1">{todayDate}</p>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-brand-blue tracking-tight">
                            {getGreeting()}, {profile.name === 'My Startup' ? 'Founder' : profile.name}
                        </h1>
                        <p className="text-gray-500 font-medium mt-1 text-sm lg:text-base">Your command center for growth and fundraising.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-grow md:w-64 group">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-brand-orange transition-colors"/>
                            <input 
                                type="search" 
                                placeholder="Search your startup..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-sm font-medium placeholder-gray-400" 
                            />
                        </div>
                        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-brand-blue hover:bg-gray-50 transition-colors shadow-sm hidden sm:block relative" aria-label="Notifications">
                            <BellIcon className="w-5 h-5"/>
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-brand-blue hover:bg-gray-50 transition-colors shadow-sm hidden sm:block" aria-label="Settings">
                            <SettingsIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </header>

                {/* Quick Actions (Command Bar) */}
                <section ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className={`${animationClass}`} style={{animationDelay: '0ms'}}><QuickActionCard title="New Deck" link="/pitch-decks/new" icon={<Wand2Icon />} /></div>
                    <div className={`${animationClass}`} style={{animationDelay: '50ms'}}><QuickActionCard title="Investor Docs" link="/dashboard/investor-docs" icon={<BriefcaseIcon />} color="blue-600" /></div>
                    <div className={`${animationClass}`} style={{animationDelay: '100ms'}}><QuickActionCard title="Find Capital" link="/directory" icon={<UsersIcon />} color="green-600" /></div>
                    <div className={`${animationClass}`} style={{animationDelay: '150ms'}}><QuickActionCard title="Create Video" link="/dashboard/video-generator" icon={<VideoIcon />} color="purple-600" /></div>
                    <div className={`${animationClass}`} style={{animationDelay: '200ms'}}><QuickActionCard title="Data Room" link="/dashboard/data-room" icon={<FolderLockIcon />} color="amber-600" /></div>
                </section>
                
                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column (Operational) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Metrics */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard 
                                icon={<PresentationIcon />} 
                                label="Decks" 
                                value={isLoadingData ? 0 : deckCount} 
                                trend={deckCount > 0 ? "+1" : undefined} 
                                trendUp={true} 
                            />
                            <StatCard 
                                icon={<UsersIcon />} 
                                label="Events" 
                                value={isLoadingData ? 0 : eventCount} 
                            />
                             <StatCard 
                                icon={<BriefcaseIcon />} 
                                label="Investors" 
                                value={8} 
                                trend="+2" 
                                trendUp={true} 
                            />
                            <StatCard 
                                icon={<CheckCircleIcon />} 
                                label="Tasks" 
                                value={12} 
                            />
                        </div>
                        
                        {/* Analytics & Feed */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-auto"><StartupHealthDonut /></div>
                            <div className="h-auto"><DeckPerformanceChart /></div>
                        </div>
                        
                        {/* Personalized Feed */}
                        <div>
                            <PersonalizedFeed />
                        </div>
                    </div>

                    {/* Right Column (Strategic) */}
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="h-auto"><AiInsightsWidget /></div>
                        <div className="h-auto"><UpcomingEvent /></div>
                        <div className="h-auto"><MiniCalendar /></div>
                    </aside>
                </div>
            </div>

            <MobileCtaBar />
        </div>
    );
};

export default Dashboard;
