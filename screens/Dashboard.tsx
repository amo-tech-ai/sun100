

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useOnScreen from '../hooks/useOnScreen';
import AnimatedCounter from '../components/AnimatedCounter';

// --- ICONS ---
const Wand2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
const PresentationIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>;
const VideoIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect y="4" x="2" width="20" height="16" rx="2"/><path d="m22 8-6 4 6 4V8Z"/></svg>;
const BriefcaseIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const GiftIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
const CheckCircleIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const SearchIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const BellIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const SettingsIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0 2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const ChevronLeftIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>;
const FilePlus2Icon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>;
const LightbulbIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7c0-2.2-1.8-4-4-4S10 4.8 10 7c0 2 .3 3.2 1.5 4.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;
const TrendingUpIcon = (props: React.ComponentProps<'svg'>) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;

// --- MOCK DATA ---
const mockInsights = [
    { type: 'AI Suggestion', title: 'Update Your Traction Slide', description: 'AI suggests adding your latest user growth metrics to improve credibility.', link: '/pitch-decks/deck-123/edit' },
    { type: 'New Perk Available', title: '90% off HubSpot for Startups', description: 'A new high-value perk has been added to the community portal.', link: '/perks/3' },
    { type: 'Upcoming Event', title: 'Founder Networking Night', description: 'Join our virtual networking event this Friday to connect with peers.', link: '/events/1' },
];
const mockTasks = [
    { title: 'Fix your "Problem" slide', deck: 'Sun AI Seed Deck', status: 'In Progress' },
    { title: 'Add market size data', deck: 'Q3 Product Update', status: 'To Do' },
    { title: 'Upload team member photos', deck: 'Sun AI Seed Deck', status: 'To Do' },
];
const mockUpcomingEvent = {
    title: "Rhythm & Beats Music Festival",
    image: "https://storage.googleapis.com/aistudio-hosting/event-placeholders/upcoming.jpg",
    date: "Apr 20, 2029",
    location: "Sunset Park, Los Angeles, CA",
    link: "/events/1"
};
const mockRecentActivity = [
    { user: 'You', action: 'created a new deck', details: 'Sun AI Seed Round', time: '5m ago', icon: <FilePlus2Icon/> },
    { user: 'Admin', action: 'added a new perk', details: 'AWS Credits', time: '2h ago', icon: <GiftIcon/> },
    { user: 'You', action: 'completed a task', details: 'Update team slide', time: '1d ago', icon: <CheckCircleIcon/> },
    { user: 'Alex Chen', action: 'posted a new job', details: 'Senior AI Engineer', time: '2d ago', icon: <BriefcaseIcon/> },
];


// --- SUB-COMPONENTS ---

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; suffix?: string; }> = ({ icon, label, value, suffix }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform duration-300 hover:-translate-y-1">
        <div className="w-12 h-12 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-brand-blue">
                <AnimatedCounter value={value} />{suffix}
            </p>
        </div>
    </div>
);

const QuickActionCard: React.FC<{ title: string; link: string; icon: React.ReactNode; }> = ({ title, link, icon }) => (
    <Link to={link} className="block bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm text-center transform hover:-translate-y-1 hover:shadow-lg hover:border-brand-orange/50 transition-all duration-300 group">
        <div className="w-12 h-12 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-4 mx-auto transition-transform duration-300 group-hover:scale-110">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-brand-blue transition-colors duration-300 group-hover:text-brand-orange">{title}</h3>
    </Link>
);


const StartupHealthDonut: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="font-bold text-lg text-brand-blue mb-4">Startup Health Score</h3>
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-36 h-36">
                    <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90)">
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e6e6e6" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#E87C4D" strokeWidth="3" strokeDasharray="75, 100" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-brand-blue">75%</span>
                        <span className="text-xs text-gray-500">Investor Ready</span>
                    </div>
                </div>
                <div className="text-sm space-y-1 w-full">
                    <div className="flex justify-between"><span>Brand Story</span><span className="font-semibold">80%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{width: '80%'}}></div></div>
                    <div className="flex justify-between"><span>Traction</span><span className="font-semibold">40%</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-yellow-500 h-1.5 rounded-full" style={{width: '40%'}}></div></div>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-3 w-full">
                    <div className="flex items-start gap-3 bg-orange-50/50 p-3 rounded-lg">
                        <Wand2Icon className="w-4 h-4 text-brand-orange flex-shrink-0 mt-1" />
                        <p className="text-xs text-gray-700">
                            <span className="font-bold">AI Tip:</span> Your 'Traction' score is below the 50% benchmark for seed-stage startups. Add specific metrics like 'Monthly Active Users' or 'Revenue Growth' to improve it.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeckPerformanceChart: React.FC = () => {
    const data = [
        { month: 'May', slides: 8, rewrites: 12, visuals: 5 },
        { month: 'Jun', slides: 10, rewrites: 15, visuals: 8 },
        { month: 'Jul', slides: 12, rewrites: 20, visuals: 10 },
    ];
    const maxVal = Math.max(...data.flatMap(d => [d.slides, d.rewrites, d.visuals]));
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="font-bold text-lg text-brand-blue mb-4">AI Deck Performance</h3>
            <div className="flex h-48 items-end gap-6">
                {data.map(d => (
                    <div key={d.month} className="flex-1 text-center">
                        <div className="h-full flex items-end justify-center gap-1">
                            <div className="w-1/3 bg-brand-orange/20 rounded-t-md animate-grow" style={{ height: `${(d.slides/maxVal)*100}%` }} title="Slides"></div>
                            <div className="w-1/3 bg-brand-orange/50 rounded-t-md animate-grow" style={{ height: `${(d.rewrites/maxVal)*100}%`, animationDelay: '100ms' }} title="Rewrites"></div>
                            <div className="w-1/3 bg-brand-orange rounded-t-md animate-grow" style={{ height: `${(d.visuals/maxVal)*100}%`, animationDelay: '200ms' }} title="Visuals"></div>
                        </div>
                        <p className="text-sm font-semibold text-gray-500 mt-2">{d.month}</p>
                    </div>
                ))}
            </div>
            <div className="mt-4 border-t border-gray-100 pt-3">
                <div className="flex items-start gap-3 bg-brand-blue/5 p-3 rounded-lg">
                    <Wand2Icon className="w-4 h-4 text-brand-blue flex-shrink-0 mt-1" />
                    <p className="text-xs text-gray-700">
                        <span className="font-bold">AI Insight:</span> Your rewrite-to-slide ratio is 2:1, which is higher than average. This suggests your core narrative could be stronger from the start. Try using the AI wizard with a more detailed prompt for your next deck.
                    </p>
                </div>
            </div>
        </div>
    );
};


const PersonalizedFeed: React.FC = () => {
    const [activeTab, setActiveTab] = useState('insights');
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-6 border-b border-gray-200">
                <nav className="flex -mb-px space-x-6">
                    <button onClick={() => setActiveTab('insights')} className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'insights' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>AI Insights</button>
                    <button onClick={() => setActiveTab('tasks')} className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'tasks' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>My Tasks</button>
                    <button onClick={() => setActiveTab('decks')} className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'decks' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Recent Decks</button>
                </nav>
            </div>
            <div className="p-6 space-y-4">
                {activeTab === 'insights' && mockInsights.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200/80">
                        <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange flex items-center justify-center rounded-full flex-shrink-0"><Wand2Icon className="w-5 h-5"/></div>
                        <div>
                            <p className="font-semibold text-brand-blue">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                            <Link to={item.link} className="text-sm font-bold text-brand-orange hover:underline mt-1 inline-block">Review &rarr;</Link>
                        </div>
                    </div>
                ))}
                {activeTab === 'tasks' && mockTasks.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200/80">
                        <div>
                            <p className="font-semibold text-brand-blue">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.deck}</p>
                        </div>
                        <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{item.status}</span>
                    </div>
                ))}
                {/* Add content for 'decks' tab if needed */}
            </div>
        </div>
    );
};

const UpcomingEvent: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-brand-blue mb-4">Upcoming Event</h3>
        <div className="rounded-lg overflow-hidden mb-4 aspect-video">
            <img src={mockUpcomingEvent.image} alt={mockUpcomingEvent.title} className="w-full h-full object-cover" />
        </div>
        <h4 className="font-bold text-brand-blue">{mockUpcomingEvent.title}</h4>
        <p className="text-sm text-gray-500 mt-1">{mockUpcomingEvent.location}</p>
        <div className="flex justify-between items-center text-sm mt-4">
            <span className="text-gray-500">{mockUpcomingEvent.date}</span>
            <Link to={mockUpcomingEvent.link} className="font-bold text-brand-orange hover:underline">View Details</Link>
        </div>
    </div>
);

const MiniCalendar: React.FC = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

    return (
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-brand-blue">{monthName} {currentYear}</h3>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(m => m - 1)} className="p-1.5 rounded-md hover:bg-gray-100" aria-label="Previous month"><ChevronLeftIcon /></button>
                    <button onClick={() => setCurrentMonth(m => m + 1)} className="p-1.5 rounded-md hover:bg-gray-100" aria-label="Next month"><ChevronRightIcon /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 text-center text-sm text-gray-500 font-semibold mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <span key={day}>{day}</span>)}
            </div>
            <div className="grid grid-cols-7 text-center text-sm">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const date = day + 1;
                    const isToday = date === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                    return (
                        <span key={date} className={`py-1.5 rounded-full ${isToday ? 'bg-brand-orange text-white font-bold' : 'text-gray-700'}`}>
                            {date}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

const RecentActivityFeed: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-brand-blue mb-4">Recent Activity</h3>
        <div className="space-y-4">
            {mockRecentActivity.map((activity, i) => (
                <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0 mt-1">
                        {activity.icon}
                    </div>
                    <div>
                        <p className="text-sm text-gray-800">
                            <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold text-brand-blue">{activity.details}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AiInsightsWidget: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-brand-blue mb-4 flex items-center gap-2">
            <Wand2Icon className="w-5 h-5" />
            <span>AI Strategic Insights</span>
        </h3>
        <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-orange-50/50 rounded-lg">
                <LightbulbIcon className="w-4 h-4 text-brand-orange flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-800">
                    <span className="font-semibold">Market Opportunity:</span> Research shows a 25% YoY growth in the AI developer tools market. Consider highlighting this in your "Market Size" slide.
                </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
                 <TrendingUpIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" />
                 <p className="text-sm text-gray-800">
                    <span className="font-semibold">Pitch Deck Hotspot:</span> Your "Solution" slide is viewed 40% longer than other slides. Consider adding a short demo video link to capitalize on this engagement.
                 </p>
            </div>
        </div>
    </div>
);


const MobileCtaBar: React.FC = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 flex justify-around gap-4 md:hidden z-40" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 1rem)' }}>
        <Link to="/pitch-decks/new" className="flex-1 text-center bg-brand-orange text-white font-bold py-3 px-4 rounded-lg">New Deck</Link>
        <Link to="/dashboard/video-generator" className="flex-1 text-center bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg">New Video</Link>
    </div>
);


// --- MAIN DASHBOARD COMPONENT ---

const Dashboard: React.FC = () => {
    // FIX: Explicitly type the ref from useOnScreen to be an HTMLElement to match the type expected by the section element's ref prop.
    const [ref, isVisible] = useOnScreen<HTMLElement>({ threshold: 0.1 });
    const animationClass = isVisible ? 'animate-fade-in-up' : 'opacity-0';

    return (
        <div className="space-y-8 pb-24 md:pb-0">
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(1rem); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
                @keyframes grow {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }
                .animate-grow { animation: grow 0.5s ease-out forwards; transform-origin: bottom; }
            `}</style>
            
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-blue">Founder Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, let's build something great today.</p>
                </div>
                <div className="flex items-center gap-2">
                     <div className="relative flex-grow">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input type="search" placeholder="Search..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-brand-orange" />
                    </div>
                    <button className="p-3 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-brand-blue hidden sm:block" aria-label="Notifications"><BellIcon/></button>
                    <button className="p-3 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-brand-blue hidden sm:block" aria-label="Settings"><SettingsIcon/></button>
                </div>
            </header>

            {/* Quick Actions (Desktop) */}
            <section ref={ref} className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className={`${animationClass}`} style={{animationDelay: '0ms'}}><QuickActionCard title="Create New Deck" link="/pitch-decks/new" icon={<Wand2Icon />} /></div>
                <div className={`${animationClass}`} style={{animationDelay: '100ms'}}><QuickActionCard title="Manage Decks" link="/pitch-decks" icon={<PresentationIcon />} /></div>
                <div className={`${animationClass}`} style={{animationDelay: '200ms'}}><QuickActionCard title="Generate Video" link="/dashboard/video-generator" icon={<VideoIcon />} /></div>
                <div className={`${animationClass}`} style={{animationDelay: '300ms'}}><QuickActionCard title="Find a Job" link="/jobs" icon={<BriefcaseIcon />} /></div>
                <div className={`${animationClass}`} style={{animationDelay: '400ms'}}><QuickActionCard title="Explore Perks" link="/perks" icon={<GiftIcon />} /></div>
            </section>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <main className="lg:col-span-2 space-y-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                       <StatCard icon={<PresentationIcon />} label="Decks Created" value={12} />
                       <StatCard icon={<VideoIcon />} label="Videos Generated" value={3} />
                       <StatCard icon={<BriefcaseIcon />} label="Jobs Applied" value={5} />
                       <StatCard icon={<CheckCircleIcon />} label="Tasks Completed" value={28} />
                    </div>
                    
                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="md:col-span-2"><StartupHealthDonut /></div>
                        <div className="md:col-span-3"><DeckPerformanceChart /></div>
                    </div>

                    {/* Personalized Feed */}
                    <PersonalizedFeed />
                </main>

                {/* Right Sidebar */}
                <aside className="lg:col-span-1 space-y-8">
                    <AiInsightsWidget />
                    <UpcomingEvent />
                    <MiniCalendar />
                    <RecentActivityFeed />
                </aside>
            </div>
            
            <MobileCtaBar />
        </div>
    );
};

export default Dashboard;
